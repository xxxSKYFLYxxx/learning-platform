import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Award } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import { CourseSidebar } from "@/components/lesson/CourseSidebar";
import { CompleteButton } from "@/components/lesson/CompleteButton";
import { formatDuration } from "@/lib/utils";
import type { Metadata } from "next";

async function getCourseData(courseSlug: string, userId: string) {
  const course = await prisma.course.findUnique({
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
  });
  return course;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonId: string }>;
}): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  return { title: lesson?.title ?? "Урок" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonId: string }>;
}) {
  const { courseSlug, lessonId } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=/learn/${courseSlug}/${lessonId}`);

  const course = await getCourseData(courseSlug, session.user.id!);
  if (!course) notFound();

  const enrolled = course.enrollments.length > 0;

  // Find current lesson
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const lesson = allLessons.find((l) => l.id === lessonId);
  if (!lesson) notFound();

  // Access check
  if (!enrolled && !lesson.isFree) {
    redirect(`/courses/${courseSlug}`);
  }

  const progress = lesson.progress[0] ?? null;
  const lessonIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < allLessons.length - 1 ? allLessons[lessonIndex + 1] : null;

  // Build sidebar data
  const sidebarModules = course.modules.map((mod) => ({
    id: mod.id,
    title: mod.title,
    lessons: mod.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      duration: l.duration,
      isFree: l.isFree,
      completed: l.progress[0]?.completed ?? false,
    })),
  }));

  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter((l) => l.progress[0]?.completed).length;
  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shrink-0 gap-4">
        <Link href={`/courses/${courseSlug}`} className="flex items-center gap-1.5 text-sm text-muted hover:text-text transition-colors shrink-0">
          <ChevronLeft className="w-4 h-4" />
          {course.title}
        </Link>

        <div className="flex-1 max-w-sm hidden md:block">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
              <div className="bg-secondary h-1.5 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="text-xs text-muted shrink-0">{completedLessons}/{totalLessons}</span>
          </div>
        </div>

        <Link href="/dashboard" className="text-xs text-muted hover:text-text transition-colors shrink-0">
          Мой кабинет
        </Link>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 shrink-0 hidden lg:flex flex-col overflow-hidden border-r border-gray-100">
          <CourseSidebar
            courseSlug={courseSlug}
            modules={sidebarModules}
            activeLessonId={lessonId}
            enrolled={enrolled}
          />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {/* Player */}
            {lesson.muxPlaybackId ? (
              <LessonPlayer
                playbackId={lesson.muxPlaybackId}
                lessonId={lesson.id}
                initialTime={progress?.watchedSeconds ?? 0}
              />
            ) : (
              <div className="aspect-video bg-primary/5 rounded-xl flex items-center justify-center text-muted text-sm">
                Видео ещё не загружено
              </div>
            )}

            {/* Lesson header */}
            <div className="mt-6">
              <h1 className="font-display text-2xl font-bold text-primary">{lesson.title}</h1>
              {lesson.duration && (
                <p className="text-sm text-muted mt-1">{formatDuration(lesson.duration)}</p>
              )}
            </div>

            {/* Actions row */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                {prevLesson && (
                  <Link
                    href={`/learn/${courseSlug}/${prevLesson.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm text-muted hover:border-primary hover:text-primary transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Назад
                  </Link>
                )}
                {nextLesson && (
                  <Link
                    href={`/learn/${courseSlug}/${nextLesson.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm text-muted hover:border-primary hover:text-primary transition-colors"
                  >
                    Далее <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>

              <CompleteButton
                lessonId={lesson.id}
                completed={progress?.completed ?? false}
                nextLessonHref={nextLesson ? `/learn/${courseSlug}/${nextLesson.id}` : undefined}
              />
            </div>

            {/* Course complete banner */}
            {progressPct === 100 && (
              <div className="mt-8 p-6 bg-success/5 border border-success/20 rounded-2xl flex items-center gap-4">
                <Award className="w-8 h-8 text-success shrink-0" />
                <div>
                  <p className="font-semibold text-success">Курс пройден!</p>
                  <p className="text-sm text-muted mt-0.5">
                    Ваш сертификат доступен в{" "}
                    <Link href="/dashboard/certificates" className="text-secondary hover:underline">
                      личном кабинете
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
