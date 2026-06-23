import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LessonView } from "@/components/lesson/LessonView";
import { getFallbackCourseBySlug, withDbFallback } from "@/lib/public-fallbacks";
import type { Metadata } from "next";

function getFallbackCourseData(courseSlug: string) {
  const course = getFallbackCourseBySlug(courseSlug);
  if (!course) return null;

  return {
    ...course,
    enrollments: [{ id: "fallback-enrollment" }],
    modules: course.modules.map((mod: any) => ({
      ...mod,
      lessons: mod.lessons.map((lesson: any) => ({
        ...lesson,
        progress: [],
      })),
    })),
  };
}

async function getCourseData(courseSlug: string, userId: string) {
  const course = await withDbFallback<any>(prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      modules: {
        orderBy: { sortOrder: "asc" },
        include: {
          lessons: {
            orderBy: { sortOrder: "asc" },
            include: {
              progress: {
                where: { userId },
                take: 1,
              },
            },
          },
        },
      },
      enrollments: { where: { userId }, take: 1 },
    },
  }), getFallbackCourseData(courseSlug));
  return course;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonId: string }>;
}): Promise<Metadata> {
  const { courseSlug, lessonId } = await params;
  const fallbackCourse = getFallbackCourseData(courseSlug);
  const fallbackLesson = fallbackCourse?.modules.flatMap((m: any) => m.lessons).find((l: any) => l.id === lessonId);
  if (fallbackLesson) return { title: fallbackLesson.title };

  const lesson = await withDbFallback(prisma.lesson.findUnique({ where: { id: lessonId } }), null);
  return { title: lesson?.title ?? "Урок" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonId: string }>;
}) {
  const { courseSlug, lessonId } = await params;
  const fallbackCourse = getFallbackCourseData(courseSlug);
  const fallbackLessonExists = fallbackCourse?.modules.flatMap((m: any) => m.lessons).some((l: any) => l.id === lessonId);
  const session = await auth();
  if (!session?.user && !fallbackLessonExists) redirect(`/login?callbackUrl=/learn/${courseSlug}/${lessonId}`);

  const course = await getCourseData(courseSlug, session?.user?.id ?? "fallback-user");
  if (!course) notFound();

  const enrolled = course.enrollments.length > 0;

  // Find current lesson
  const allLessons = course.modules.flatMap((m: any) => m.lessons);
  const lesson = allLessons.find((l: any) => l.id === lessonId);
  if (!lesson) notFound();

  // Access check
  if (!enrolled && !lesson.isFree) {
    redirect(`/courses/${courseSlug}`);
  }

  const progress = lesson.progress[0] ?? null;
  const lessonIndex = allLessons.findIndex((l: any) => l.id === lessonId);
  const prevLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < allLessons.length - 1 ? allLessons[lessonIndex + 1] : null;

  // Build sidebar data
  const sidebarModules = course.modules.map((mod: any) => ({
    id: mod.id,
    title: mod.title,
    lessons: mod.lessons.map((l: any) => ({
      id: l.id,
      title: l.title,
      duration: l.duration,
      isFree: l.isFree,
      completed: l.progress[0]?.completed ?? false,
    })),
  }));

  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter((l: any) => l.progress[0]?.completed).length;
  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <LessonView
      courseSlug={courseSlug}
      courseTitle={course.title}
      lessonId={lessonId}
      lessonTitle={lesson.title}
      lessonDuration={lesson.duration}
      lessonContent={lesson.content}
      lessonIndex={lessonIndex}
      totalLessons={totalLessons}
      completedLessons={completedLessons}
      progressPct={progressPct}
      progress={progress}
      enrolled={enrolled}
      sidebarModules={sidebarModules}
      prevLesson={prevLesson ? { id: prevLesson.id } : null}
      nextLesson={nextLesson ? { id: nextLesson.id } : null}
    />
  );
}
