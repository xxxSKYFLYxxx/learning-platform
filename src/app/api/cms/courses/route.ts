import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { cmsCourses, type CmsCourse } from "@/lib/cms-demo-data";
import type { CourseLevel } from "@prisma/client";

const courseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isFree: z.boolean().default(false),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"),
  price: z.number().min(0).nullable().optional(),
  instructorId: z.string().optional(),
  published: z.boolean().default(true),
});

const patchSchema = z.object({
  id: z.string(),
  published: z.boolean().optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return null;
  }

  return session.user;
}

function mapCourse(course: any): CmsCourse {
  const ratings = course.reviews ?? [];
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / ratings.length
      : 5;

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description ?? "",
    imageUrl:
      course.imageUrl ??
      "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
    isFree: course.isFree,
    level: course.level,
    price: course.price ? Number(course.price) : null,
    instructorId: course.instructorId,
    enrollments: course._count?.enrollments ?? 0,
    reviews: course._count?.reviews ?? ratings.length,
    rating: Number(avgRating.toFixed(1)),
    published: course.published,
  };
}

async function resolveInstructorId(requestedId: string | undefined, fallbackUserId: string) {
  if (!requestedId || requestedId.startsWith("fallback-")) return fallbackUserId;

  const user = await prisma.user.findUnique({
    where: { id: requestedId },
    select: { id: true },
  });

  return user?.id ?? fallbackUserId;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { enrollments: true, reviews: true } },
        reviews: { select: { rating: true } },
      },
    });

    return NextResponse.json({ courses: courses.map(mapCourse), source: "database" });
  } catch {
    return NextResponse.json({ courses: cmsCourses, source: "fallback" });
  }
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (!user?.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = courseSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid course", details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = data.slug?.trim() || `${slugify(data.title)}-${Date.now().toString(36)}`;

  try {
    const instructorId = await resolveInstructorId(data.instructorId, user.id);
    const course = await prisma.course.create({
      data: {
        title: data.title,
        slug,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        isFree: data.isFree,
        price: data.isFree ? null : data.price ?? null,
        level: data.level as CourseLevel,
        instructorId,
        published: data.published,
        modules: {
          create: {
            title: "Старт",
            sortOrder: 0,
            lessons: {
              create: {
                title: "Первый урок",
                content: `# ${data.title}\n\nДобавьте подробный материал курса в CMS или расширенной админке.`,
                duration: 720,
                isFree: true,
                sortOrder: 0,
              },
            },
          },
        },
      },
      include: {
        _count: { select: { enrollments: true, reviews: true } },
        reviews: { select: { rating: true } },
      },
    });

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath(`/courses/${course.slug}`);

    return NextResponse.json({ course: mapCourse(course), source: "database" }, { status: 201 });
  } catch {
    const fallbackCourse: CmsCourse = {
      id: `local-${Date.now()}`,
      slug,
      title: data.title,
      description: data.description ?? "Новый курс из CMS.",
      imageUrl:
        data.imageUrl ??
        "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
      isFree: data.isFree,
      level: data.level,
      price: data.isFree ? null : data.price ?? 1990,
      instructorId: data.instructorId ?? "fallback-instructor-layout",
      enrollments: 0,
      reviews: 0,
      rating: 5,
      published: data.published,
    };

    return NextResponse.json({ course: fallbackCourse, source: "fallback" }, { status: 202 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid patch", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const course = await prisma.course.update({
      where: { id: parsed.data.id },
      data: {
        ...(parsed.data.published !== undefined ? { published: parsed.data.published } : {}),
      },
      include: {
        _count: { select: { enrollments: true, reviews: true } },
        reviews: { select: { rating: true } },
      },
    });

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath(`/courses/${course.slug}`);

    return NextResponse.json({ course: mapCourse(course), source: "database" });
  } catch {
    return NextResponse.json({ ok: true, source: "fallback" });
  }
}
