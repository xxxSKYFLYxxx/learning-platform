import Link from "next/link";
import { ArrowRight, BookOpen, Users, Award, TrendingUp } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/course/CourseCard";

async function getFeaturedCourses() {
  const rows = await prisma.course.findMany({
    where: { published: true },
    take: 6,
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

const STATS = [
  { icon: BookOpen, label: "Курсов", value: "50+" },
  { icon: Users, label: "Студентов", value: "2 000+" },
  { icon: Award, label: "Сертификатов выдано", value: "800+" },
  { icon: TrendingUp, label: "Среднее завершение", value: "78%" },
];

export default async function HomePage() {
  const courses = await getFeaturedCourses();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary text-white py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
              Учитесь у лучших.{" "}
              <span className="text-secondary">Растите каждый день.</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Практические курсы от опытных специалистов. Без воды -- только то, что работает.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary/90 transition-colors"
              >
                Смотреть курсы <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/courses?isFree=true"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors"
              >
                Бесплатные курсы
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center">
                  <Icon className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <div className="text-3xl font-bold text-primary font-display">{value}</div>
                  <div className="text-sm text-muted mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured courses */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-primary">Популярные курсы</h2>
              <p className="text-muted mt-2">Самые востребованные среди студентов</p>
            </div>
            <Link href="/courses" className="text-sm text-secondary font-medium hover:underline flex items-center gap-1">
              Все курсы <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Курсы появятся совсем скоро</p>
            </div>
          )}
        </section>

        {/* CTA Banner */}
        <section className="bg-surface border-y border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h2 className="font-display text-3xl font-bold text-primary mb-4">
              Готовы начать обучение?
            </h2>
            <p className="text-muted mb-8 max-w-xl mx-auto">
              Зарегистрируйтесь бесплатно и получите доступ к первым урокам прямо сейчас.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Начать бесплатно <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
