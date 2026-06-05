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

  const base = process.env.AUTH_URL ?? "http://localhost:3002";
  const url = `${base}/courses/${slug}`;
  const avgRating =
    course.reviews.length > 0
      ? course.reviews.reduce((a, r) => a + r.rating, 0) / course.reviews.length
      : null;

  return {
    title: course.title,
    description: course.description ?? undefined,
    keywords: [
      course.title,
      "онлайн курс",
      "программирование",
      "обучение",
      course.instructor.name ?? "",
      "курс купить",
      "русский язык",
    ].filter(Boolean),
    alternates: { canonical: url },
    openGraph: {
      title: course.title,
      description: course.description ?? undefined,
      url,
      locale: "ru_RU",
      type: "article",
      images: course.imageUrl ? [{ url: course.imageUrl, width: 1280, height: 720 }] : [],
    },
    other: avgRating ? { "og:rating": String(avgRating.toFixed(1)) } : {},
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

  const base = process.env.AUTH_URL ?? "http://localhost:3002";

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description ?? undefined,
    url: `${base}/courses/${course.slug}`,
    image: course.imageUrl ?? undefined,
    provider: {
      "@type": "Organization",
      name: "КУРС",
      url: base,
    },
    instructor: {
      "@type": "Person",
      name: course.instructor.name ?? "",
    },
    offers: {
      "@type": "Offer",
      price: course.isFree ? "0" : String(Number(course.price)),
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
    },
    ...(avgRating && course._count.reviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating.toFixed(1),
            reviewCount: course._count.reviews,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    numberOfCredits: totalLessons,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      inLanguage: "ru",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: base },
      { "@type": "ListItem", position: 2, name: "Курсы", item: `${base}/courses` },
      { "@type": "ListItem", position: 3, name: course.title, item: `${base}/courses/${course.slug}` },
    ],
  };

  const LEVEL_LABELS: Record<string, string> = { BEGINNER: "Начальный", INTERMEDIATE: "Средний", ADVANCED: "Продвинутый" };

  return (
    <div className="grain" style={{ background: "var(--c-bg)", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <main>
        {/* Hero */}
        <section style={{ background: "var(--c-s1)", borderBottom: "1px solid var(--c-border)", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", top: "-30%", right: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,var(--c-red-mid) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, position: "relative" }}>
            {/* Left */}
            <div>
              {/* Breadcrumb */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--c-t3)", marginBottom: 20, fontFamily: "var(--font-sans)" }}>
                <Link href="/courses" className="link-cream" style={{ textDecoration: "none" }}>Курсы</Link>
                <span style={{ color: "var(--c-t4)" }}>/</span>
                <span style={{ color: "var(--c-t2)" }}>{course.title}</span>
              </div>

              {/* Level pill */}
              <span style={{ display: "inline-block", fontSize: 10, fontWeight: 900, letterSpacing: "0.12em", padding: "4px 10px", fontFamily: "var(--font-mono)", background: "var(--c-red-lo)", color: "var(--c-red)", border: "1px solid var(--c-red-mid)", marginBottom: 16 }}>
                {LEVEL_LABELS[course.level] ?? course.level}
              </span>

              <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)", lineHeight: 1.1, marginBottom: 16 }}>
                {course.title}
              </h1>

              {course.description && (
                <p style={{ fontSize: 17, color: "var(--c-t2)", lineHeight: 1.6, marginBottom: 24, fontFamily: "var(--font-sans)", maxWidth: 600 }}>
                  {course.description}
                </p>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20, fontSize: 13, color: "var(--c-t3)", fontFamily: "var(--font-mono)" }}>
                {avgRating && (
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Star size={14} style={{ color: "var(--c-amber)", fill: "var(--c-amber)" }} />
                    {avgRating.toFixed(1)} ({course._count.reviews})
                  </span>
                )}
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Users size={14} /> {course._count.enrollments} студентов
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Clock size={14} /> {formatDuration(totalDuration)}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24 }}>
                {course.instructor.image && (
                  <Image src={course.instructor.image} alt={course.instructor.name ?? ""} width={36} height={36} unoptimized style={{ borderRadius: "50%", border: "1px solid var(--c-border)" }} />
                )}
                <span style={{ fontSize: 13, color: "var(--c-t3)", fontFamily: "var(--font-sans)" }}>
                  Преподаватель: <span style={{ color: "var(--c-t1)", fontWeight: 600 }}>{course.instructor.name}</span>
                </span>
              </div>
            </div>

            {/* Buy card */}
            <div style={{ background: "var(--c-bg)", border: "1px solid var(--c-border)", padding: 24, height: "fit-content", position: "sticky", top: 80 }}>
              {course.imageUrl && (
                <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", marginBottom: 16 }}>
                  <Image src={course.imageUrl} alt={course.title} fill unoptimized style={{ objectFit: "cover", opacity: 0.85 }} />
                </div>
              )}
              <div style={{ fontSize: 32, fontWeight: 900, color: course.isFree ? "var(--c-green)" : "var(--c-t1)", fontFamily: "var(--font-display)", marginBottom: 20 }}>
                {course.isFree ? "Бесплатно" : formatPrice(Number(course.price))}
              </div>

              {isEnrolled ? (
                <Link
                  href={`/learn/${course.slug}/${course.modules[0]?.lessons[0]?.id ?? ""}`}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", background: "var(--c-green)", color: "#fff", fontWeight: 900, fontFamily: "var(--font-display)", textDecoration: "none", fontSize: 14 }}
                >
                  <PlayCircle size={18} /> Продолжить обучение
                </Link>
              ) : (
                <Link
                  href={`/api/enrollments?courseId=${course.id}`}
                  className="btn-red"
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", fontWeight: 900, fontFamily: "var(--font-display)", textDecoration: "none", fontSize: 14, boxSizing: "border-box" }}
                >
                  {course.isFree ? "Записаться бесплатно" : "Купить курс"}
                </Link>
              )}

              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "var(--c-t3)", fontFamily: "var(--font-sans)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}><CheckCircle size={14} style={{ color: "var(--c-green)" }} /> {totalLessons} уроков</span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}><CheckCircle size={14} style={{ color: "var(--c-green)" }} /> Сертификат по окончании</span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}><CheckCircle size={14} style={{ color: "var(--c-green)" }} /> Пожизненный доступ</span>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum */}
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px" }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)", marginBottom: 24 }}>Программа курса</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {course.modules.map((mod) => (
              <details key={mod.id} className="course-module" style={{ border: "1px solid var(--c-border)", overflow: "hidden", background: "var(--c-s1)" }}>
                <summary style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 18, cursor: "pointer", listStyle: "none" }}>
                  <span style={{ fontWeight: 600, color: "var(--c-t1)", fontFamily: "var(--font-sans)", fontSize: 15 }}>{mod.title}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 12, color: "var(--c-t3)", fontFamily: "var(--font-mono)" }}>{mod.lessons.length} уроков</span>
                    <ChevronDown size={16} className="chev" style={{ color: "var(--c-t3)", transition: "transform 0.2s" }} />
                  </div>
                </summary>
                <div style={{ borderTop: "1px solid var(--c-border)" }}>
                  {mod.lessons.map((lesson) => (
                    <div key={lesson.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: "1px solid var(--c-border)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "var(--c-t3)", fontFamily: "var(--font-sans)" }}>
                        <PlayCircle size={15} style={{ flexShrink: 0 }} />
                        <span>{lesson.title}</span>
                        {lesson.isFree && (
                          <span style={{ fontSize: 11, background: "rgba(31,158,110,0.12)", color: "var(--c-green)", padding: "2px 8px", borderRadius: 99 }}>Превью</span>
                        )}
                      </div>
                      {lesson.duration && (
                        <span style={{ fontSize: 12, color: "var(--c-t4)", flexShrink: 0, fontFamily: "var(--font-mono)" }}>{formatDuration(lesson.duration)}</span>
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
          <section style={{ background: "var(--c-s1)", borderTop: "1px solid var(--c-border)", borderBottom: "1px solid var(--c-border)" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px" }}>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)", marginBottom: 32 }}>
                Отзывы ({course._count.reviews})
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {course.reviews.map((review) => (
                  <div key={review.id} style={{ background: "var(--c-bg)", border: "1px solid var(--c-border)", padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                      {review.user.image && (
                        <Image src={review.user.image} alt={review.user.name ?? ""} width={36} height={36} unoptimized style={{ borderRadius: "50%", border: "1px solid var(--c-border)" }} />
                      )}
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--c-t1)", fontFamily: "var(--font-sans)" }}>{review.user.name}</div>
                        <div style={{ display: "flex", gap: 2 }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} style={{ fontSize: 12, color: i < review.rating ? "var(--c-amber)" : "var(--c-border)" }}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.text && <p style={{ fontSize: 14, color: "var(--c-t2)", lineHeight: 1.6, fontFamily: "var(--font-sans)", margin: 0 }}>{review.text}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />

      <style>{`
        .course-module[open] .chev { transform: rotate(180deg); }
        .course-module summary::-webkit-details-marker { display: none; }
      `}</style>
    </div>
  );
}
