import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CourseCard } from "@/components/course/CourseCard";
import { prisma } from "@/lib/prisma";
import type { CourseLevel } from "@prisma/client";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";

interface SearchParams { level?: string; isFree?: string; q?: string; sort?: string }

async function getCourses(filters: SearchParams) {
  const rows = await prisma.course.findMany({
    where: {
      published: true,
      ...(filters.level ? { level: filters.level as CourseLevel } : {}),
      ...(filters.isFree === "true" ? { isFree: true } : {}),
      ...(filters.q ? { OR: [
        { title: { contains: filters.q, mode: "insensitive" } },
        { description: { contains: filters.q, mode: "insensitive" } },
      ]} : {}),
    },
    orderBy: filters.sort === "price_asc"  ? { price: "asc" }
           : filters.sort === "price_desc" ? { price: "desc" }
           : filters.sort === "newest"     ? { createdAt: "desc" }
           : { enrollments: { _count: "desc" } },
    include: {
      instructor: { select: { id: true, name: true, image: true } },
      _count: { select: { enrollments: true, reviews: true } },
      reviews: { select: { rating: true } },
    },
  });

  return rows.map((r) => ({
    ...r,
    price: r.price ? Number(r.price) : null,
    avgRating: r.reviews.length > 0 ? r.reviews.reduce((a, rv) => a + rv.rating, 0) / r.reviews.length : undefined,
  }));
}

const LEVELS = [
  { value: "", label: "Все уровни" },
  { value: "BEGINNER", label: "Начальный" },
  { value: "INTERMEDIATE", label: "Средний" },
  { value: "ADVANCED", label: "Продвинутый" },
];
const SORTS = [
  { value: "", label: "По популярности" },
  { value: "newest", label: "Новые" },
  { value: "price_asc", label: "Цена ↑" },
  { value: "price_desc", label: "Цена ↓" },
];

export const metadata: Metadata = {
  title: "Каталог курсов",
  description: "Все курсы по программированию на платформе КУРС — JavaScript, React, Python, TypeScript и другие",
};

export default async function CoursesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const courses = await getCourses(params);

  const buildHref = (overrides: Partial<SearchParams>) => {
    const merged = { ...params, ...overrides };
    const qs = new URLSearchParams();
    if (merged.level) qs.set("level", merged.level);
    if (merged.isFree) qs.set("isFree", merged.isFree);
    if (merged.q)     qs.set("q", merged.q);
    if (merged.sort)  qs.set("sort", merged.sort);
    return `/courses${qs.toString() ? `?${qs}` : ""}`;
  };

  const isFiltered = !!(params.level || params.isFree || params.q);

  return (
    <div style={{ background: "var(--c-bg)", minHeight: "100vh" }}>
      <Header />
      <main>

        {/* ── Hero bar ── */}
        <div style={{ background: "var(--c-s1)", borderBottom: "1px solid var(--c-border)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 40px" }}>
            <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--c-t3)", fontFamily: "var(--font-mono)", marginBottom: 10 }}>
              Каталог
            </p>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)", marginBottom: 24, lineHeight: 1.1 }}>
              Все курсы
            </h1>

            {/* Search */}
            <form method="GET" style={{ position: "relative", maxWidth: 520 }}>
              <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--c-t3)", pointerEvents: "none" }} />
              <input
                name="q"
                defaultValue={params.q ?? ""}
                placeholder="Поиск по названию или теме..."
                className="input-dark"
                style={{ width: "100%", paddingLeft: 42, paddingRight: 16, paddingTop: 11, paddingBottom: 11, fontSize: 14, fontFamily: "var(--font-sans)", boxSizing: "border-box" }}
              />
            </form>
          </div>
        </div>

        {/* ── Filters + results ── */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

          {/* Filter row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", padding: "20px 0", borderBottom: "1px solid var(--c-border)" }}>
            <SlidersHorizontal size={14} style={{ color: "var(--c-t3)" }} />

            {/* Level filters */}
            {LEVELS.map((l) => {
              const active = (params.level ?? "") === l.value;
              return (
                <a
                  key={l.value}
                  href={buildHref({ level: l.value })}
                  className={active ? "filter-active" : "filter-btn"}
                  style={{ padding: "6px 14px", fontSize: 12, fontWeight: 700, fontFamily: "var(--font-display)", textDecoration: "none", letterSpacing: "0.03em" }}
                >
                  {l.label}
                </a>
              );
            })}

            {/* Free toggle */}
            <a
              href={buildHref({ isFree: params.isFree === "true" ? "" : "true" })}
              style={{
                padding: "6px 14px", fontSize: 12, fontWeight: 700, fontFamily: "var(--font-display)", textDecoration: "none",
                background: params.isFree === "true" ? "rgba(31,158,110,0.15)" : "transparent",
                color: params.isFree === "true" ? "var(--c-green)" : "var(--c-t3)",
                border: `1px solid ${params.isFree === "true" ? "var(--c-green)" : "var(--c-border)"}`,
                transition: "all 0.15s",
              }}
            >
              Бесплатные
            </a>

            {/* Sort */}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "var(--c-t4)", fontFamily: "var(--font-mono)" }}>Сортировка:</span>
              {SORTS.map((s) => {
                const active = (params.sort ?? "") === s.value;
                return (
                  <a
                    key={s.value}
                    href={buildHref({ sort: s.value })}
                    style={{
                      fontSize: 12, fontFamily: "var(--font-sans)", textDecoration: "none", padding: "4px 10px",
                      color: active ? "var(--c-t1)" : "var(--c-t3)",
                      fontWeight: active ? 700 : 400,
                      borderBottom: active ? "2px solid var(--c-red)" : "2px solid transparent",
                      transition: "all 0.15s",
                    }}
                  >
                    {s.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Results meta */}
          <div style={{ padding: "14px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 12, color: "var(--c-t4)", fontFamily: "var(--font-mono)", margin: 0 }}>
              Найдено: <span style={{ color: "var(--c-t2)" }}>{courses.length}</span>
              {params.q && <span style={{ color: "var(--c-t3)" }}> по запросу «{params.q}»</span>}
            </p>
            {isFiltered && (
              <a href="/courses" style={{ fontSize: 12, color: "var(--c-red)", textDecoration: "none", fontFamily: "var(--font-display)", fontWeight: 700 }}>
                Сбросить фильтры ×
              </a>
            )}
          </div>

          {/* Grid */}
          {courses.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, paddingBottom: 80 }}>
              {courses.map((course) => <CourseCard key={course.id} course={course} />)}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "96px 0", border: "1px dashed var(--c-border)", marginBottom: 80 }}>
              <div style={{ fontSize: 40, color: "var(--c-border-hi)", marginBottom: 16 }}>—</div>
              <p style={{ fontSize: 15, color: "var(--c-t3)", fontFamily: "var(--font-sans)", marginBottom: 20 }}>
                По вашему запросу ничего не найдено
              </p>
              <a href="/courses" style={{ fontSize: 13, fontWeight: 900, color: "var(--c-red)", textDecoration: "none", fontFamily: "var(--font-display)" }}>
                Сбросить фильтры →
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
