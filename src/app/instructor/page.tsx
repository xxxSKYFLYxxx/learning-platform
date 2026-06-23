import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Users, DollarSign, Star, TrendingUp } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Кабинет преподавателя" };

export default async function InstructorPage() {
  const session = await auth();
  if (!session?.user || !["INSTRUCTOR", "ADMIN"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const courses = await prisma.course.findMany({
    where: { instructorId: session.user.id! },
    include: {
      _count: { select: { enrollments: true, reviews: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalStudents = courses.reduce((a, c) => a + c._count.enrollments, 0);
  const totalReviews = courses.reduce((a, c) => a + c._count.reviews, 0);
  const avgRating = totalReviews > 0
    ? courses.flatMap(c => c.reviews.map(r => r.rating)).reduce((a, b) => a + b, 0) / totalReviews
    : 0;

  const revenue = await prisma.$queryRaw<{ total: number }[]>`
    SELECT COALESCE(SUM(c.price), 0) as total
    FROM enrollments e
    JOIN courses c ON c.id = e."courseId"
    WHERE c."instructorId" = ${session.user.id}
      AND e.status IN ('ACTIVE', 'COMPLETED')
      AND c."isFree" = false
  `;

  const stats = [
    { icon: BookOpen, label: "Курсов", value: courses.length, color: "var(--c-red)" },
    { icon: Users, label: "Студентов", value: totalStudents, color: "var(--c-green)" },
    { icon: Star, label: "Рейтинг", value: avgRating.toFixed(1), color: "var(--c-amber)" },
    { icon: DollarSign, label: "Выручка", value: formatPrice(Number(revenue[0]?.total ?? 0)), color: "var(--c-t1)" },
  ];

  return (
    <div style={{ background: "var(--c-bg)", minHeight: "100vh" }}>
      <style>{`
        @media (max-width: 768px) {
          .main-container {
            padding: 24px 16px !important;
          }
          h1 {
            font-size: 24px !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .course-card {
            flex-direction: column !important;
            gap: 16px !important;
          }
          .course-info {
            width: 100% !important;
          }
        }
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          .course-card {
            padding: 16px !important;
          }
        }
      `}</style>
      <Header />
      <main className="main-container" style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.25em", color: "var(--c-t3)", marginBottom: 4, fontFamily: "var(--font-mono)" }}>ЛИЧНЫЙ КАБИНЕТ</p>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)" }}>
            Кабинет преподавателя
          </h1>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 48 }}>
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div key={label} style={{
              background: "var(--c-s1)",
              border: "1px solid var(--c-border)",
              padding: 24,
              borderRadius: 8,
              textAlign: "center",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <Icon size={24} style={{ color }} />
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)", marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 12, color: "var(--c-t3)", fontFamily: "var(--font-sans)" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Courses */}
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)", marginBottom: 24 }}>
          Мои курсы
        </h2>

        {courses.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "80px 24px",
            border: "1px dashed var(--c-border)",
            borderRadius: 8,
            background: "var(--c-s1)"
          }}>
            <BookOpen size={48} style={{ color: "var(--c-border-hi)", margin: "0 auto 16px" }} />
            <p style={{ color: "var(--c-t3)", marginBottom: 20, fontFamily: "var(--font-sans)", fontSize: 16 }}>Курсов пока нет</p>
            <Link
              href="/admin/courses/new"
              style={{
                display: "inline-block",
                padding: "12px 32px",
                fontSize: 14,
                fontWeight: 900,
                textDecoration: "none",
                fontFamily: "var(--font-display)",
                background: "var(--c-red)",
                color: "var(--c-bg)",
                borderRadius: 6,
                border: "1px solid var(--c-red)",
                transition: "all 0.2s ease"
              }}
            >
              Создать первый курс
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {courses.map((course) => {
              const avgRating =
                course.reviews.length > 0
                  ? course.reviews.reduce((a, r) => a + r.rating, 0) / course.reviews.length
                  : null;

              return (
                <div
                  key={course.id}
                  className="course-card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 24,
                    padding: 24,
                    background: "var(--c-s1)",
                    border: "1px solid var(--c-border)",
                    borderRadius: 8,
                    transition: "all 0.2s ease"
                  }}
                >
                  <div className="course-info" style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <h3 style={{
                        fontWeight: 700,
                        color: "var(--c-t1)",
                        fontFamily: "var(--font-sans)",
                        fontSize: 16,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        margin: 0
                      }}>
                        {course.title}
                      </h3>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 900,
                        padding: "4px 10px",
                        fontFamily: "var(--font-mono)",
                        border: `1px solid ${course.published ? "var(--c-green)" : "var(--c-border-hi)"}`,
                        color: course.published ? "var(--c-green)" : "var(--c-t3)",
                        background: course.published ? "rgba(31,158,110,0.1)" : "transparent",
                        borderRadius: 4,
                        flexShrink: 0
                      }}>
                        {course.published ? "LIVE" : "DRAFT"}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "var(--c-t3)", fontFamily: "var(--font-mono)", flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Users size={14} style={{ color: "var(--c-t2)" }} />
                        <span style={{ color: "var(--c-t2)", fontWeight: 600 }}>{course._count.enrollments}</span> студентов
                      </span>
                      {avgRating && (
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Star size={14} style={{ color: "var(--c-amber)" }} />
                          <span style={{ color: "var(--c-amber)", fontWeight: 600 }}>{avgRating.toFixed(1)}</span> рейтинг
                        </span>
                      )}
                      <span style={{ color: "var(--c-t2)", fontWeight: 600 }}>
                        {course.isFree ? "БЕСПЛАТНО" : formatPrice(Number(course.price))}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/instructor/courses/${course.id}`}
                    style={{
                      padding: "10px 20px",
                      fontSize: 13,
                      textDecoration: "none",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      flexShrink: 0,
                      background: "transparent",
                      color: "var(--c-t1)",
                      border: "1px solid var(--c-border)",
                      borderRadius: 6,
                      transition: "all 0.2s ease",
                      whiteSpace: "nowrap"
                    }}
                  >
                    Управление →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}