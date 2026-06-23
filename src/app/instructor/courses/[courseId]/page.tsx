import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VideoUploader } from "@/components/instructor/VideoUploader";
import { CheckCircle, Clock, Video, Plus, ChevronDown, ChevronUp, Settings } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Управление курсом" };

export default async function InstructorCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await auth();
  if (!session?.user || !["INSTRUCTOR", "ADMIN"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId, instructorId: session.user.id! },
    include: {
      modules: {
        orderBy: { sortOrder: "asc" },
        include: { lessons: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  if (!course) notFound();

  return (
    <div style={{ background: "var(--c-bg)", minHeight: "100vh" }}>
      <style>{`
        @media (max-width: 768px) {
          .main-container {
            padding: 24px 16px !important;
          }
          h1 {
            font-size: 20px !important;
          }
          .module-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .lesson-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .lesson-info {
            width: 100% !important;
          }
        }
      `}</style>
      <Header />
      <main className="main-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <Link href="/instructor" style={{ color: "var(--c-t3)", textDecoration: "none", fontSize: 12, fontFamily: "var(--font-mono)" }}>← Назад к курсам</Link>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)", marginBottom: 8 }}>
                {course.title}
              </h1>
              <span style={{
                fontSize: 10,
                fontWeight: 900,
                padding: "4px 10px",
                fontFamily: "var(--font-mono)",
                border: `1px solid ${course.published ? "var(--c-green)" : "var(--c-border-hi)"}`,
                color: course.published ? "var(--c-green)" : "var(--c-t3)",
                background: course.published ? "rgba(31,158,110,0.1)" : "transparent",
                borderRadius: 4
              }}>
                {course.published ? "Опубликован" : "Черновик"}
              </span>
            </div>
            <Link
              href={`/admin/courses/${course.id}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                background: "transparent",
                border: "1px solid var(--c-border)",
                color: "var(--c-t1)",
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                fontFamily: "var(--font-display)",
                borderRadius: 6,
                transition: "all 0.2s ease"
              }}
            >
              <Settings size={16} /> Настройки
            </Link>
          </div>
        </div>

        {/* Modules */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)" }}>
              Программа курса
            </h2>
            <button style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              background: "var(--c-red)",
              color: "var(--c-bg)",
              border: "1px solid var(--c-red)",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 900,
              fontFamily: "var(--font-display)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}>
              <Plus size={14} /> Добавить модуль
            </button>
          </div>

          {course.modules.length === 0 ? (
            <div style={{
              padding: "48px 24px",
              border: "1px dashed var(--c-border)",
              borderRadius: 8,
              textAlign: "center",
              background: "var(--c-s1)"
            }}>
              <p style={{ color: "var(--c-t3)", fontFamily: "var(--font-sans)" }}>Модулей пока нет</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {course.modules.map((mod, idx) => (
                <div key={mod.id} style={{
                  background: "var(--c-s1)",
                  border: "1px solid var(--c-border)",
                  borderRadius: 8,
                  overflow: "hidden"
                }}>
                  {/* Module Header */}
                  <div className="module-header" style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--c-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "var(--c-s2)"
                  }}>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--c-t1)", fontFamily: "var(--font-sans)", marginBottom: 4 }}>
                        Модуль {idx + 1}: {mod.title}
                      </h3>
                      <p style={{ fontSize: 12, color: "var(--c-t3)", fontFamily: "var(--font-mono)" }}>
                        {mod.lessons.length} уроков
                      </p>
                    </div>
                    <button style={{
                      padding: 6,
                      background: "transparent",
                      border: "1px solid var(--c-border)",
                      borderRadius: 4,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <ChevronDown size={16} style={{ color: "var(--c-t3)" }} />
                    </button>
                  </div>

                  {/* Lessons */}
                  <div>
                    {mod.lessons.length === 0 ? (
                      <div style={{ padding: "24px 20px", textAlign: "center", color: "var(--c-t4)", fontSize: 13, fontFamily: "var(--font-sans)" }}>
                        Уроков пока нет
                      </div>
                    ) : (
                      mod.lessons.map((lesson, lessonIdx) => (
                        <div key={lesson.id} className="lesson-item" style={{
                          padding: "16px 20px",
                          borderBottom: lessonIdx < mod.lessons.length - 1 ? "1px solid var(--c-border)" : "none",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 16,
                          transition: "background 0.2s ease"
                        }}>
                          <div className="lesson-info" style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                            {lesson.muxPlaybackId ? (
                              <CheckCircle size={18} style={{ color: "var(--c-green)", flexShrink: 0 }} />
                            ) : (
                              <Video size={18} style={{ color: "var(--c-t4)", flexShrink: 0 }} />
                            )}
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--c-t1)", fontFamily: "var(--font-sans)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {lesson.title}
                              </p>
                              <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "var(--c-t3)", fontFamily: "var(--font-mono)" }}>
                                {lesson.duration && (
                                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                    <Clock size={12} /> {formatDuration(lesson.duration)}
                                  </span>
                                )}
                                {!lesson.muxPlaybackId && (
                                  <span style={{ color: "var(--c-amber)" }}>Видео не загружено</span>
                                )}
                              </div>
                            </div>
                          </div>
                          {!lesson.muxPlaybackId && (
                            <VideoUploader lessonId={lesson.id} />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}