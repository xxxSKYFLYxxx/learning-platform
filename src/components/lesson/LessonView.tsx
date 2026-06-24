"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Award, Menu, X } from "lucide-react";
import { LessonContent } from "./LessonContent";
import { CourseSidebar } from "./CourseSidebar";
import { CompleteButton } from "./CompleteButton";
import { formatDuration } from "@/lib/utils";

interface SidebarModule {
  id: string;
  title: string;
  lessons: {
    id: string;
    title: string;
    duration: number | null;
    isFree: boolean;
    completed: boolean;
  }[];
}

interface ProgressData {
  completed: boolean;
}

interface Props {
  courseSlug: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  lessonDuration: number | null;
  lessonContent: string | null;
  lessonIndex: number;
  totalLessons: number;
  completedLessons: number;
  progressPct: number;
  progress: ProgressData | null;
  enrolled: boolean;
  sidebarModules: SidebarModule[];
  prevLesson: { id: string } | null;
  nextLesson: { id: string } | null;
}

export function LessonView({
  courseSlug,
  courseTitle,
  lessonId,
  lessonTitle,
  lessonDuration,
  lessonContent,
  lessonIndex,
  totalLessons,
  completedLessons,
  progressPct,
  progress,
  enrolled,
  sidebarModules,
  prevLesson,
  nextLesson,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "var(--c-bg)" }}>
      {/* Top bar */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--c-s1)", borderBottom: "1px solid var(--c-border)", flexShrink: 0, gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, minWidth: 0 }}>
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="sidebar-toggle-btn"
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "1px solid var(--c-border)",
              color: "var(--c-t2)",
              cursor: "pointer",
              padding: 6,
              flexShrink: 0,
            }}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Link href={`/courses/${courseSlug}`} className="link-cream" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, textDecoration: "none", flexShrink: 0, fontFamily: "var(--font-sans)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            <ChevronLeft size={16} style={{ flexShrink: 0 }} />
            <span className="course-title-text">{courseTitle}</span>
          </Link>
        </div>

        <div style={{ flex: 1, maxWidth: 360 }} className="lesson-progress">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, background: "var(--c-border)", height: 4 }}>
              <div style={{ background: progressPct === 100 ? "var(--c-green)" : "var(--c-red)", height: 4, width: `${progressPct}%`, transition: "width 0.3s" }} />
            </div>
            <span style={{ fontSize: 12, color: "var(--c-t3)", flexShrink: 0, fontFamily: "var(--font-mono)" }}>{completedLessons}/{totalLessons}</span>
          </div>
        </div>

        <Link href="/dashboard" className="link-muted dashboard-link" style={{ fontSize: 12, textDecoration: "none", flexShrink: 0, fontFamily: "var(--font-sans)" }}>
          Мой кабинет
        </Link>
      </header>

      {/* Main layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
            style={{ display: "none", position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 10 }}
          />
        )}

        {/* Sidebar */}
        <div
          className={`lesson-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
          style={{ width: 288, flexShrink: 0, display: "flex", flexDirection: "column", overflow: "hidden", borderRight: "1px solid var(--c-border)", background: "var(--c-s1)" }}
        >
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
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)", lineHeight: 1.15, marginBottom: 8 }}>{lessonTitle}</h1>
              {lessonDuration && (
                <p style={{ fontSize: 13, color: "var(--c-t3)", fontFamily: "var(--font-mono)" }}>~ {formatDuration(lessonDuration)} чтения</p>
              )}
            </div>

            {/* Lesson content */}
            {lessonContent ? (
              <LessonContent content={lessonContent} />
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
                lessonId={lessonId}
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
        .sidebar-toggle-btn { display: none !important; }

        @media (max-width: 1024px) {
          .sidebar-toggle-btn { display: flex !important; }
          .lesson-sidebar {
            position: absolute !important;
            left: -300px;
            top: 0;
            bottom: 0;
            z-index: 20;
            transition: left 0.25s ease;
            box-shadow: none;
          }
          .lesson-sidebar.sidebar-open {
            left: 0;
            box-shadow: 4px 0 24px rgba(0,0,0,0.5);
          }
          .sidebar-overlay { display: block !important; }
        }

        @media (max-width: 768px) {
          .lesson-progress { display: none !important; }
          .dashboard-link { display: none !important; }
          .course-title-text { max-width: 160px; overflow: hidden; text-overflow: ellipsis; }
        }

        @media (max-width: 480px) {
          .course-title-text { max-width: 100px; }
        }
      `}</style>
    </div>
  );
}