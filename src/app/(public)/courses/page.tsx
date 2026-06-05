import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CourseCard } from "@/components/course/CourseCard";
import { prisma } from "@/lib/prisma";
import type { CourseLevel } from "@prisma/client";
import { Search } from "lucide-react";
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
  { value: "", label: "Популярность" },
  { value: "newest", label: "Новые" },
  { value: "price_asc", label: "Цена ↑" },
  { value: "price_desc", label: "Цена ↓" },
];

export const metadata: Metadata = {
  title: "Каталог курсов",
  description: "Все курсы по программированию на платформе КУРС",
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

  return (
    <div style={{ background: "#0D0B09", minHeight: "100vh" }}>
      <Header />
      <main>
        {/* Header */}
        <div style={{ background: "#0A0807", borderBottom: "1px solid #1F1C1A" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p
              className="text-[10px] font-black tracking-[0.25em] mb-1"
              style={{ fontFamily: "var(--font-mono)", color: "#6E675E" }}
            >
              КАТАЛОГ
            </p>
            <h1
              className="text-4xl font-black mb-6"
              style={{ fontFamily: "var(--font-display)", color: "#F0EBE3" }}
            >
              Все курсы
            </h1>

            {/* Search */}
            <form method="GET" className="relative max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6E675E" }} />
              <input
                name="q"
                defaultValue={params.q ?? ""}
                placeholder="Поиск по названию или описанию..."
                className="input-dark w-full pl-10 pr-4 py-3 text-sm"
                style={{
                  fontFamily: "var(--font-sans)",
                  background: "#141210",
                  border: "1px solid #262220",
                  color: "#F0EBE3",
                }}
              />
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-8 pb-6" style={{ borderBottom: "1px solid #1F1C1A" }}>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => {
                const active = (params.level ?? "") === l.value;
                return (
                  <a
                    key={l.value}
                    href={buildHref({ level: l.value })}
                    className="px-3 py-1.5 text-[11px] font-black tracking-wide transition-all"
                    style={{
                      fontFamily: "var(--font-display)",
                      background: active ? "#E8351D" : "transparent",
                      color: active ? "#F0EBE3" : "#6E675E",
                      border: `1px solid ${active ? "#E8351D" : "#262220"}`,
                    }}
                  >
                    {l.label}
                  </a>
                );
              })}
              <a
                href={buildHref({ isFree: params.isFree === "true" ? "" : "true" })}
                className="px-3 py-1.5 text-[11px] font-black tracking-wide transition-all"
                style={{
                  fontFamily: "var(--font-display)",
                  background: params.isFree === "true" ? "#1EA876" : "transparent",
                  color: params.isFree === "true" ? "#F0EBE3" : "#6E675E",
                  border: `1px solid ${params.isFree === "true" ? "#1EA876" : "#262220"}`,
                }}
              >
                Бесплатные
              </a>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs hidden sm:block" style={{ fontFamily: "var(--font-mono)", color: "#3A3530" }}>
                Сорт.:
              </span>
              {SORTS.map((s) => {
                const active = (params.sort ?? "") === s.value;
                return (
                  <a
                    key={s.value}
                    href={buildHref({ sort: s.value })}
                    className="px-3 py-1.5 text-[11px] transition-colors"
                    style={{
                      fontFamily: "var(--font-sans)",
                      color: active ? "#F0EBE3" : "#6E675E",
                      border: `1px solid ${active ? "#3A3530" : "transparent"}`,
                    }}
                  >
                    {s.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Count */}
          <p className="text-xs mb-6" style={{ fontFamily: "var(--font-mono)", color: "#3A3530" }}>
            Найдено: {courses.length}
            {params.q && <span style={{ color: "#6E675E" }}> по запросу «{params.q}»</span>}
          </p>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => <CourseCard key={course.id} course={course} />)}
            </div>
          ) : (
            <div className="text-center py-24" style={{ border: "1px dashed #262220" }}>
              <p className="text-4xl mb-4" style={{ color: "#3A3530" }}>—</p>
              <p className="mb-4" style={{ fontFamily: "var(--font-sans)", color: "#6E675E" }}>
                По вашему запросу ничего не найдено
              </p>
              <a
                href="/courses"
                className="text-sm font-black"
                style={{ fontFamily: "var(--font-display)", color: "#E8351D" }}
              >
                Сбросить фильтры
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
