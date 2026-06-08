import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Award } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LessonContent } from "@/components/lesson/LessonContent";
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
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "var(--c-bg)" }}>
      {/* Top bar */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--c-s1)", borderBottom: "1px solid var(--c-border)", flexShrink: 0, gap: 16 }}>
        <Link href={`/courses/${courseSlug}`} className="link-cream" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, textDecoration: "none", flexShrink: 0, fontFamily: "var(--font-sans)" }}>
          <ChevronLeft size={16} />
          {course.title}
        </Link>

        <div style={{ flex: 1, maxWidth: 360 }} className="lesson-progress">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, background: "var(--c-border)", height: 4 }}>
              <div style={{ background: progressPct === 100 ? "var(--c-green)" : "var(--c-red)", height: 4, width: `${progressPct}%`, transition: "width 0.3s" }} />
            </div>
            <span style={{ fontSize: 12, color: "var(--c-t3)", flexShrink: 0, fontFamily: "var(--font-mono)" }}>{completedLessons}/{totalLessons}</span>
          </div>
        </div>

        <Link href="/dashboard" className="link-muted" style={{ fontSize: 12, textDecoration: "none", flexShrink: 0, fontFamily: "var(--font-sans)" }}>
          Мой кабинет
        </Link>
      </header>

      {/* Main layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 288, flexShrink: 0, display: "flex", flexDirection: "column", overflow: "hidden", borderRight: "1px solid var(--c-border)", background: "var(--c-s1)" }} className="lesson-sidebar">
          <CourseSidebar
            courseSlug={courseSlug}
            modules={sidebarModules}
            activeLessonId={lessonId}
            enrolled={enrolled}
          />
        </div>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ maxWidth: 896, margin: "0 auto", padding: "32px 24px" }}>
            {/* Lesson header */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--c-t4)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
                УРОК {lessonIndex + 1} / {totalLessons}
              </p>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)", lineHeight: 1.15, marginBottom: 8 }}>{lesson.title}</h1>
              {lesson.duration && (
                <p style={{ fontSize: 13, color: "var(--c-t3)", fontFamily: "var(--font-mono)" }}>~ {formatDuration(lesson.duration)} чтения</p>
              )}
            </div>

            {/* Lesson content */}
            {lesson.content ? (
              <LessonContent content={lesson.content} />
            ) : (
              <div style={{ padding: 48, background: "var(--c-s1)", border: "1px solid var(--c-border)", textAlign: "center", color: "var(--c-t3)", fontFamily: "var(--font-sans)" }}>
                Материал урока готовится. Скоро здесь появится подробный разбор темы с примерами кода.
              </div>
            )}

            {/* Actions row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--c-border)", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {prevLesson && (
                  <Link href={`/learn/${courseSlug}/${prevLesson.id}`} className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", fontSize: 14, textDecoration: "none", fontFamily: "var(--font-sans)" }}>
                    <ChevronLeft size={16} /> Назад
                  </Link>
                )}
                {nextLesson && (
                  <Link href={`/learn/${courseSlug}/${nextLesson.id}`} className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", fontSize: 14, textDecoration: "none", fontFamily: "var(--font-sans)" }}>
                    Далее <ChevronRight size={16} />
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
              <div style={{ marginTop: 32, padding: 24, background: "rgba(31,158,110,0.08)", border: "1px solid rgba(31,158,110,0.25)", display: "flex", alignItems: "center", gap: 16 }}>
                <Award size={32} style={{ color: "var(--c-green)", flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 700, color: "var(--c-green)", fontFamily: "var(--font-display)" }}>Курс пройден!</p>
                  <p style={{ fontSize: 14, color: "var(--c-t3)", marginTop: 2, fontFamily: "var(--font-sans)" }}>
                    Ваш сертификат доступен в{" "}
                    <Link href="/dashboard/certificates" style={{ color: "var(--c-red)", textDecoration: "none" }}>
                      личном кабинете
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 1024px) { .lesson-sidebar { display: none !important; } }
        @media (max-width: 768px) { .lesson-progress { display: none !important; } }
      `}</style>
    </div>
  );
}
