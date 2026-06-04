import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Star, Users, Clock, CheckCircle, PlayCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { formatPrice, formatDuration } from "@/lib/utils";
import type { Metadata } from "next";

async function getCourse(slug: string) {
  return prisma.course.findUnique({
    where: { slug, published: true },
    include: {
      instructor: { select: { id: true, name: true, image: true } },
      modules: {
        orderBy: { sortOrder: "asc" },
        include: {
          lessons: { orderBy: { sortOrder: "asc" } },
        },
      },
      reviews: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true, image: true } } },
      },
      _count: { select: { enrollments: true, reviews: true } },
    },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return { title: "Курс не найден" };
  return {
    title: course.title,
    description: course.description ?? undefined,
    openGraph: { images: course.imageUrl ? [course.imageUrl] : [] },
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [course, session] = await Promise.all([getCourse(slug), auth()]);

  if (!course) notFound();

  const isEnrolled = session?.user
    ? !!(await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: session.user.id!, courseId: course.id } },
      }))
    : false;

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalDuration = course.modules.reduce(
    (acc, m) => acc + m.lessons.reduce((a, l) => a + (l.duration ?? 0), 0),
    0
  );
  const avgRating =
    course.reviews.length > 0
      ? course.reviews.reduce((a, r) => a + r.rating, 0) / course.reviews.length
      : null;

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
                <Link href="/courses" className="hover:text-white transition-colors">Курсы</Link>
                <span>/</span>
                <span>{course.title}</span>
              </div>
              <h1 className="font-display text-4xl font-bold mb-4">{course.title}</h1>
              {course.description && (
                <p className="text-white/70 text-lg leading-relaxed mb-6">{course.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                {avgRating && (
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                    {avgRating.toFixed(1)} ({course._count.reviews})
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {course._count.enrollments} студентов
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {formatDuration(totalDuration)}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-6">
                {course.instructor.image && (
                  <Image src={course.instructor.image} alt={course.instructor.name ?? ""} width={32} height={32} className="rounded-full" />
                )}
                <span className="text-sm text-white/70">
                  Преподаватель: <span className="text-white font-medium">{course.instructor.name}</span>
                </span>
              </div>
            </div>

            {/* Buy card */}
            <div className="bg-white text-text rounded-2xl p-6 shadow-xl h-fit">
              {course.imageUrl && (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                  <Image src={course.imageUrl} alt={course.title} fill className="object-cover" />
                </div>
              )}
              <div className="text-3xl font-bold text-primary font-display mb-4">
                {course.isFree ? "Бесплатно" : formatPrice(Number(course.price))}
              </div>

              {isEnrolled ? (
                <Link
                  href={`/learn/${course.slug}/${course.modules[0]?.lessons[0]?.id ?? ""}`}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-success text-white font-semibold rounded-xl hover:bg-success/90 transition-colors"
                >
                  <PlayCircle className="w-5 h-5" /> Продолжить обучение
                </Link>
              ) : (
                <Link
                  href={`/api/enrollments?courseId=${course.id}`}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  {course.isFree ? "Записаться бесплатно" : "Купить курс"}
                </Link>
              )}

              <div className="mt-4 flex flex-col gap-2 text-sm text-muted">
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success" /> {totalLessons} уроков</span>
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success" /> Сертификат по окончании</span>
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success" /> Пожизненный доступ</span>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-display text-2xl font-bold text-primary mb-6">Программа курса</h2>
          <div className="flex flex-col gap-3">
            {course.modules.map((mod) => (
              <details key={mod.id} className="group border border-gray-100 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer bg-white hover:bg-surface transition-colors list-none">
                  <span className="font-medium text-text">{mod.title}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted">{mod.lessons.length} уроков</span>
                    <ChevronDown className="w-4 h-4 text-muted group-open:rotate-180 transition-transform" />
                  </div>
                </summary>
                <div className="border-t border-gray-100">
                  {mod.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-b-0">
                      <div className="flex items-center gap-3 text-sm text-muted">
                        <PlayCircle className="w-4 h-4 shrink-0" />
                        <span>{lesson.title}</span>
                        {lesson.isFree && (
                          <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">Превью</span>
                        )}
                      </div>
                      {lesson.duration && (
                        <span className="text-xs text-muted shrink-0">{formatDuration(lesson.duration)}</span>
                      )}
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Reviews */}
        {course.reviews.length > 0 && (
          <section className="bg-surface border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <h2 className="font-display text-2xl font-bold text-primary mb-8">
                Отзывы ({course._count.reviews})
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {course.reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl p-5 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      {review.user.image && (
                        <Image src={review.user.image} alt={review.user.name ?? ""} width={36} height={36} className="rounded-full" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-text">{review.user.name}</div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-secondary fill-secondary" : "text-gray-200"}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.text && <p className="text-sm text-muted leading-relaxed">{review.text}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
