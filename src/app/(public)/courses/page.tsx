import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CourseCard } from "@/components/course/CourseCard";
import { prisma } from "@/lib/prisma";
import type { CourseLevel } from "@prisma/client";

interface SearchParams {
  level?: string;
  isFree?: string;
  q?: string;
}

async function getCourses(filters: SearchParams) {
  const rows = await prisma.course.findMany({
    where: {
      published: true,
      ...(filters.level ? { level: filters.level as CourseLevel } : {}),
      ...(filters.isFree === "true" ? { isFree: true } : {}),
      ...(filters.q ? { title: { contains: filters.q, mode: "insensitive" } } : {}),
    },
    orderBy: { enrollments: { _count: "desc" } },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      imageUrl: true,
      price: true,
      isFree: true,
      level: true,
      instructor: { select: { id: true, name: true, image: true } },
      _count: { select: { enrollments: true, reviews: true } },
    },
  });
  return rows.map((r) => ({ ...r, price: r.price ? Number(r.price) : null }));
}

const LEVELS = [
  { value: "", label: "Все уровни" },
  { value: "BEGINNER", label: "Начальный" },
  { value: "INTERMEDIATE", label: "Средний" },
  { value: "ADVANCED", label: "Продвинутый" },
];

export const metadata = { title: "Каталог курсов" };

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const courses = await getCourses(params);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-primary mb-2">Все курсы</h1>
          <p className="text-muted">{courses.length} {courses.length === 1 ? "курс" : "курсов"}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          {LEVELS.map((l) => (
            <a
              key={l.value}
              href={l.value ? `?level=${l.value}` : "/courses"}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                params.level === l.value || (!params.level && !l.value)
                  ? "bg-primary text-white border-primary"
                  : "border-gray-200 text-muted hover:border-primary hover:text-primary"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="?isFree=true"
            className={`px-4 py-2 rounded-full text-sm border transition-colors ${
              params.isFree === "true"
                ? "bg-success text-white border-success"
                : "border-gray-200 text-muted hover:border-success hover:text-success"
            }`}
          >
            Бесплатные
          </a>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-muted">
            <p className="text-lg">По вашему запросу ничего не найдено</p>
            <a href="/courses" className="mt-4 inline-block text-sm text-secondary hover:underline">
              Сбросить фильтры
            </a>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
