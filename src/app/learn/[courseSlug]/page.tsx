import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function LearnCoursePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=/learn/${courseSlug}`);

  // Find last watched lesson or first lesson
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      modules: {
        orderBy: { sortOrder: "asc" },
        include: { lessons: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  if (!course) redirect("/courses");

  const allLessons = course.modules.flatMap((m) => m.lessons);
  if (allLessons.length === 0) redirect(`/courses/${courseSlug}`);

  // Find last incomplete lesson with progress
  const lastProgress = await prisma.lessonProgress.findFirst({
    where: {
      userId: session.user.id!,
      lessonId: { in: allLessons.map((l) => l.id) },
      completed: false,
    },
    orderBy: { updatedAt: "desc" },
  });

  const targetLesson = lastProgress
    ? allLessons.find((l) => l.id === lastProgress.lessonId)
    : allLessons[0];

  redirect(`/learn/${courseSlug}/${targetLesson?.id ?? allLessons[0].id}`);
}
