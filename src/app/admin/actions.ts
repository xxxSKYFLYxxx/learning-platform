"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import type { CourseLevel, Role } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
    redirect("/dashboard");
  }
  return session.user;
}

async function requireAdminOnly() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");
  return session.user;
}

// ── COURSES ────────────────────────────────────────────────

export async function createCourse(formData: FormData) {
  const user = await requireAdmin();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const isFree = formData.get("isFree") === "on";
  const level = formData.get("level") as CourseLevel;

  const slug = slugify(title) + "-" + Date.now().toString(36);

  const course = await prisma.course.create({
    data: {
      title,
      slug,
      description: description || null,
      price: isFree ? null : price ? parseFloat(price) : null,
      isFree,
      level: level ?? "BEGINNER",
      instructorId: user.id!,
      published: false,
    },
  });

  redirect(`/admin/courses/${course.id}`);
}

export async function updateCourse(courseId: string, formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const isFree = formData.get("isFree") === "on";
  const level = formData.get("level") as CourseLevel;

  await prisma.course.update({
    where: { id: courseId },
    data: {
      title,
      description: description || null,
      price: isFree ? null : price ? parseFloat(price) : null,
      isFree,
      level,
    },
  });

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/admin/courses");
}

export async function togglePublish(courseId: string) {
  await requireAdmin();
  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { published: true } });
  await prisma.course.update({
    where: { id: courseId },
    data: { published: !course?.published },
  });
  revalidatePath(`/admin/courses`);
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteCourse(courseId: string) {
  await requireAdminOnly();
  await prisma.course.delete({ where: { id: courseId } });
  redirect("/admin/courses");
}

// ── MODULES ────────────────────────────────────────────────

export async function createModule(courseId: string, formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const count = await prisma.module.count({ where: { courseId } });
  await prisma.module.create({ data: { courseId, title, sortOrder: count } });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteModule(moduleId: string, courseId: string) {
  await requireAdmin();
  await prisma.module.delete({ where: { id: moduleId } });
  revalidatePath(`/admin/courses/${courseId}`);
}

// ── LESSONS ────────────────────────────────────────────────

export async function createLesson(moduleId: string, courseId: string, formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const isFree = formData.get("isFree") === "on";
  const count = await prisma.lesson.count({ where: { moduleId } });
  await prisma.lesson.create({ data: { moduleId, title, isFree, sortOrder: count } });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteLesson(lessonId: string, courseId: string) {
  await requireAdmin();
  await prisma.lesson.delete({ where: { id: lessonId } });
  revalidatePath(`/admin/courses/${courseId}`);
}

// ── USERS ──────────────────────────────────────────────────

export async function updateUserRole(userId: string, role: Role) {
  await requireAdminOnly();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}
