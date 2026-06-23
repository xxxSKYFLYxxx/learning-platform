import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { togglePublish } from "@/app/admin/actions";
import { Eye, EyeOff, Pencil, Plus, Search } from "lucide-react";
import { Suspense } from "react";

export const metadata = { title: "Admin — Курсы" };

async function CoursesTable({ searchQuery }: { searchQuery?: string }) {
  const courses = await prisma.course.findMany({
    where: searchQuery
      ? { OR: [{ title: { contains: searchQuery, mode: 'insensitive' } }, { slug: { contains: searchQuery, mode: 'insensitive' } }] }
      : {},
    orderBy: { createdAt: "desc" },
    include: {
      instructor: { select: { name: true } },
      _count: { select: { enrollments: true, modules: true } },
    },
  });

  const LEVEL: Record<string, string> = {
    BEGINNER: "Начальный",
    INTERMEDIATE: "Средний",
    ADVANCED: "Продвинутый",
  };

  return (
    <div style={{ background: "var(--c-s1)", border: "1px solid var(--c-border)" }}>
      <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--c-border-hi)" }}>
            {["Название", "Уровень", "Цена", "Студентов", "Модулей", "Статус", ""].map((h) => (
              <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--c-t3)", fontFamily: "var(--font-mono)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} style={{ borderBottom: "1px solid var(--c-border)", transition: "background-color 0.2s ease" }}>
              <td style={{ padding: "12px 16px" }}>
                <div style={{ color: "var(--c-t1)", fontWeight: 600, fontSize: 13, fontFamily: "var(--font-sans)" }}>{course.title}</div>
                <div style={{ color: "var(--c-t4)", fontSize: 11, fontFamily: "var(--font-mono)" }}>{course.slug}</div>
              </td>
              <td style={{ padding: "12px 16px", color: "var(--c-t2)", fontSize: 12, fontFamily: "var(--font-sans)" }}>{LEVEL[course.level]}</td>
              <td style={{ padding: "12px 16px", fontWeight: 700, fontSize: 12, color: course.isFree ? "var(--c-green)" : "var(--c-t1)", fontFamily: "var(--font-mono)" }}>
                {course.isFree ? "FREE" : formatPrice(Number(course.price))}
              </td>
              <td style={{ padding: "12px 16px", color: "var(--c-t2)", fontSize: 12, textAlign: "center", fontFamily: "var(--font-mono)" }}>{course._count.enrollments}</td>
              <td style={{ padding: "12px 16px", color: "var(--c-t2)", fontSize: 12, textAlign: "center", fontFamily: "var(--font-mono)" }}>{course._count.modules}</td>
              <td style={{ padding: "12px 16px" }}>
                <span style={{
                  fontSize: 10,
                  fontWeight: 900,
                  padding: "4px 8px",
                  fontFamily: "var(--font-mono)",
                  border: `1px solid ${course.published ? "var(--c-green)" : "var(--c-border-hi)"}`,
                  color: course.published ? "var(--c-green)" : "var(--c-t3)",
                  background: course.published ? "rgba(31,158,110,0.1)" : "transparent",
                  borderRadius: 4
                }}>
                  {course.published ? "LIVE" : "DRAFT"}
                </span>
              </td>
              <td style={{ padding: "12px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Link href={`/admin/courses/${course.id}`} style={{
                    padding: 6,
                    border: "1px solid var(--c-border)",
                    borderRadius: 4,
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Pencil size={14} style={{ color: "var(--c-t3)" }} />
                  </Link>
                  <form action={togglePublish.bind(null, course.id)} style={{ margin: 0 }}>
                    <button type="submit" style={{
                      padding: 6,
                      border: "1px solid var(--c-border)",
                      borderRadius: 4,
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "transparent",
                      cursor: "pointer"
                    }}>
                      {course.published ? <EyeOff size={14} style={{ color: "var(--c-t3)" }} /> : <Eye size={14} style={{ color: "var(--c-t3)" }} />}
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
          {courses.length === 0 && (
            <tr>
              <td colSpan={7} style={{ padding: "32px 16px", textAlign: "center", color: "var(--c-t3)", fontSize: 14, fontFamily: "var(--font-sans)" }}>
                Курсов не найдено
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params.q?.trim() || undefined;

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <style>{`
        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .search-container {
            width: 100%;
          }
          .btn-new-course {
            width: 100%;
            justify-content: center;
          }
          table {
            font-size: 12px;
          }
          th, td {
            padding: 8px 12px !important;
          }
        }
      `}</style>

      <div className="header-container" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.25em", color: "var(--c-t3)", marginBottom: 4, fontFamily: "var(--font-mono)" }}>УПРАВЛЕНИЕ</p>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)" }}>Курсы</h1>
        </div>
        <Link
          href="/admin/courses/new"
          className="btn-new-course"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            background: "var(--c-red)",
            color: "var(--c-bg)",
            fontSize: 13,
            fontWeight: 900,
            textDecoration: "none",
            fontFamily: "var(--font-display)",
            borderRadius: 4,
            border: "1px solid var(--c-red)",
            transition: "all 0.2s ease"
          }}
        >
          <Plus size={16} /> Новый курс
        </Link>
      </div>

      {/* Search */}
      <form className="search-container" style={{ marginBottom: 24, position: "relative" }}>
        <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--c-t3)" }} />
        <input
          name="q"
          type="text"
          placeholder="Поиск курсов..."
          defaultValue={searchQuery ?? ""}
          style={{
            width: "100%",
            padding: "10px 12px 10px 36px",
            background: "var(--c-s2)",
            border: "1px solid var(--c-border)",
            borderRadius: 4,
            color: "var(--c-t1)",
            fontSize: 14,
            fontFamily: "var(--font-sans)"
          }}
        />
      </form>

      <Suspense fallback={
        <div style={{ background: "var(--c-s1)", border: "1px solid var(--c-border)", padding: "32px", textAlign: "center", color: "var(--c-t3)" }}>
          Загрузка...
        </div>
      }>
        <CoursesTable searchQuery={searchQuery} />
      </Suspense>
    </div>
  );
}
