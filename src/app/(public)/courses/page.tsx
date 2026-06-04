import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CourseCard } from "@/components/course/CourseCard";
import { prisma } from "@/lib/prisma";
import type { CourseLevel } from "@prisma/client";
import { Search } from "lucide-react";

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
    orderBy: filters.sort === "price_asc" ? { price: "asc" }
           : filters.sort === "price_desc" ? { price: "desc" }
           : filters.sort === "newest" ? { createdAt: "desc" }
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

export const metadata = { title: "Каталог курсов" };

export default async function CoursesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const courses = await getCourses(params);

  const buildHref = (overrides: Partial<SearchParams>) => {
    const merged = { ...params, ...overrides };
    const qs = new URLSearchParams();
    if (merged.level) qs.set("level", merged.level);
    if (merged.isFree) qs.set("isFree", merged.isFree);
    if (merged.q)    qs.set("q", merged.q);
    if (merged.sort)  qs.set("sort", merged.sort);
    return `/courses${qs.toString() ? `?${qs}` : ""}`;
  };

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero bar */}
        <div className="bg-[#0F0F0F] border-b-2 border-[#0F0F0F] py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[10px] font-black tracking-[0.25em] text-[#787068] mb-1" style={{ fontFamily: "var(--font-mono)" }}>КАТАЛОГ</p>
            <h1 className="text-4xl font-black text-[#FAFAF7] mb-4" style={{ fontFamily: "var(--font-display)" }}>Все курсы</h1>

            {/* Search */}
            <form method="GET" className="relative max-w-xl">
              <Search className="absolute left-3 top-3 w-4 h-4 text-[#787068]" />
              <input
                name="q"
                defaultValue={params.q ?? ""}
                placeholder="Поиск по названию или описанию..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-[#0F0F0F] text-sm outline-none focus:border-[#D4402F] transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              />
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b-2 border-[#0F0F0F]">
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => {
                const active = (params.level ?? "") === l.value;
                return (
                  <a key={l.value} href={buildHref({ level: l.value })}
                    className={`px-3 py-1.5 text-xs font-black border-2 transition-all ${active ? "bg-[#0F0F0F] text-[#FAFAF7] border-[#0F0F0F]" : "border-[#E0DDD8] text-[#787068] hover:border-[#0F0F0F] hover:text-[#0F0F0F]"}`}
                    style={{ fontFamily: "var(--font-display)" }}>
                    {l.label}
                  </a>
                );
              })}
              <a href={buildHref({ isFree: params.isFree === "true" ? "" : "true" })}
                className={`px-3 py-1.5 text-xs font-black border-2 transition-all ${params.isFree === "true" ? "bg-[#1A9E6E] text-white border-[#1A9E6E]" : "border-[#E0DDD8] text-[#787068] hover:border-[#1A9E6E] hover:text-[#1A9E6E]"}`}
                style={{ fontFamily: "var(--font-display)" }}>
                Бесплатные
              </a>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-[#787068]" style={{ fontFamily: "var(--font-mono)" }}>Сортировка:</span>
              {SORTS.map((s) => {
                const active = (params.sort ?? "") === s.value;
                return (
                  <a key={s.value} href={buildHref({ sort: s.value })}
                    className={`px-3 py-1.5 text-xs border transition-colors ${active ? "border-[#0F0F0F] text-[#0F0F0F] font-semibold" : "border-[#E0DDD8] text-[#787068] hover:border-[#0F0F0F]"}`}
                    style={{ fontFamily: "var(--font-sans)" }}>
                    {s.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Results count */}
          <p className="text-xs text-[#787068] mb-6" style={{ fontFamily: "var(--font-mono)" }}>
            Найдено: {courses.length} {courses.length === 1 ? "курс" : "курсов"}
            {params.q && <span> по запросу «{params.q}»</span>}
          </p>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => <CourseCard key={course.id} course={course} />)}
            </div>
          ) : (
            <div className="text-center py-24 border-2 border-dashed border-[#E0DDD8]">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-[#787068] mb-4" style={{ fontFamily: "var(--font-sans)" }}>По вашему запросу ничего не найдено</p>
              <a href="/courses" className="text-sm text-[#D4402F] hover:underline" style={{ fontFamily: "var(--font-display)" }}>
                Сбросить фильтры
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
