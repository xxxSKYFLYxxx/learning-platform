import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/course/CourseCard";
import { formatDuration } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "КУРС — Онлайн-обучение программированию",
  description: "Практические курсы по программированию на русском языке. JavaScript, React, TypeScript, Python.",
};

async function getHomeData() {
  const [courses, courseCount, enrollmentCount] = await Promise.all([
    prisma.course.findMany({
      where: { published: true },
      take: 6,
      orderBy: { enrollments: { _count: "desc" } },
      select: {
        id: true, slug: true, title: true, description: true,
        imageUrl: true, price: true, isFree: true, level: true,
        instructor: { select: { id: true, name: true, image: true } },
        _count: { select: { enrollments: true, reviews: true } },
        reviews: { select: { rating: true } },
      },
    }),
    prisma.course.count({ where: { published: true } }),
    prisma.enrollment.count(),
  ]);

  const instructors = await prisma.user.findMany({
    where: { role: "INSTRUCTOR" },
    include: {
      courses: {
        where: { published: true },
        select: { id: true, _count: { select: { enrollments: true } } },
      },
      _count: { select: { courses: true } },
    },
  });

  const reviews = await prisma.review.findMany({
    where: { rating: 5 },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, image: true } },
      course: { select: { title: true } },
    },
  });

  const totalLessons = await prisma.lesson.count();

  return {
    courses: courses.map((c) => ({
      ...c,
      price: c.price ? Number(c.price) : null,
      avgRating: c.reviews.length > 0 ? c.reviews.reduce((a, r) => a + r.rating, 0) / c.reviews.length : undefined,
    })),
    courseCount, enrollmentCount, instructors, reviews, totalLessons,
  };
}

const TECH_TAGS = [
  "JavaScript", "React", "TypeScript", "Node.js",
  "Next.js", "Python", "Git", "CSS / Tailwind",
  "PostgreSQL", "Docker", "GraphQL", "REST API",
];

const FEATURES = [
  { num: "01", title: "Только практика", desc: "Каждый курс — реальный проект. Никакой теории ради теории." },
  { num: "02", title: "Без воды", desc: "Средний урок — 12 минут. Только суть, никаких отступлений." },
  { num: "03", title: "Сертификат", desc: "PDF-сертификат с уникальным кодом верификации." },
  { num: "04", title: "Пожизненный доступ", desc: "Купил раз — учись всю жизнь. Все обновления бесплатно." },
];

export default async function HomePage() {
  const { courses, courseCount, enrollmentCount, totalLessons, instructors, reviews } = await getHomeData();

  return (
    <div className="grain" style={{ background: "#0D0B09", minHeight: "100vh" }}>
      <Header />
      <main>

        {/* ─── HERO ─── */}
        <section style={{ background: "#0D0B09", position: "relative", overflow: "hidden" }}>
          {/* Radial red glow top-right */}
          <div
            aria-hidden
            style={{
              position: "absolute", top: "-20%", right: "-10%",
              width: "600px", height: "600px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(232,53,29,0.07) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          {/* Subtle grid */}
          <div
            aria-hidden
            style={{
              position: "absolute", inset: 0,
              backgroundImage: "linear-gradient(rgba(38,34,32,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(38,34,32,0.35) 1px, transparent 1px)",
              backgroundSize: "80px 80px", pointerEvents: "none",
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-0" style={{ position: "relative" }}>
            <div className="grid lg:grid-cols-[1fr_380px] gap-16 items-start">
              <div>
                {/* Eyebrow */}
                <div className="hero-fade inline-flex items-center gap-2 mb-10" style={{ animationDelay: "0.05s" }}>
                  <span
                    className="px-3 py-1.5 text-[10px] font-black tracking-widest"
                    style={{
                      fontFamily: "var(--font-mono)",
                      background: "rgba(232,53,29,0.1)",
                      color: "#E8351D",
                      border: "1px solid rgba(232,53,29,0.25)",
                    }}
                  >
                    ▶ НОВЫЙ КУРС: NEXT.JS ПОЛНЫЙ КУРС
                  </span>
                </div>

                {/* Headline */}
                <div className="mb-10">
                  <div
                    className="hero-word text-[13vw] sm:text-[88px] lg:text-[96px] font-black leading-[0.88] tracking-tight"
                    style={{ fontFamily: "var(--font-display)", color: "#F0EBE3", animationDelay: "0.12s" }}
                  >
                    УЧИСЬ.
                  </div>
                  <div
                    className="hero-word text-[13vw] sm:text-[88px] lg:text-[96px] font-black leading-[0.88] tracking-tight text-glow-red"
                    style={{ fontFamily: "var(--font-display)", color: "#E8351D", animationDelay: "0.26s" }}
                  >
                    СОЗДАВАЙ.
                  </div>
                  <div
                    className="hero-word text-[13vw] sm:text-[88px] lg:text-[96px] font-black leading-[0.88] tracking-tight"
                    style={{ fontFamily: "var(--font-display)", color: "#2E2924", animationDelay: "0.4s" }}
                  >
                    РАСТИ.
                  </div>
                </div>

                <div className="hero-fade flex flex-col sm:flex-row gap-6 items-start" style={{ animationDelay: "0.65s" }}>
                  <p
                    className="text-base leading-relaxed max-w-xs"
                    style={{ fontFamily: "var(--font-sans)", color: "#6E675E" }}
                  >
                    Практические курсы от реальных разработчиков. Только живые проекты.
                  </p>
                  <div className="flex gap-3 shrink-0">
                    <Link
                      href="/courses"
                      className="btn-red inline-flex items-center gap-2 px-7 py-3.5 text-sm font-black"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Все курсы <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/courses?isFree=true"
                      className="btn-outline-dark inline-flex items-center gap-2 px-7 py-3.5 text-sm font-black"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Бесплатно
                    </Link>
                  </div>
                </div>
              </div>

              {/* Code card */}
              <div className="hidden lg:block hero-left self-end" style={{ animationDelay: "0.35s" }}>
                <div
                  className="text-sm leading-7 p-7"
                  style={{
                    fontFamily: "var(--font-mono)",
                    background: "#0A0807",
                    border: "1px solid #262220",
                    boxShadow: "0 0 40px rgba(0,0,0,0.5)",
                  }}
                >
                  <div style={{ color: "#3A3530", fontSize: "10px", marginBottom: "12px", letterSpacing: "0.1em" }}>
                    // твой путь в IT
                  </div>
                  <div style={{ color: "#9A9088" }}>
                    <span style={{ color: "#E8351D" }}>const </span>
                    <span style={{ color: "#6E675E" }}>developer </span>= {"{"}
                  </div>
                  <div className="pl-5" style={{ color: "#9A9088" }}>
                    <span style={{ color: "#F0EBE3" }}>name</span>: <span style={{ color: "#E8A020" }}>&quot;Ты&quot;</span>,
                  </div>
                  <div className="pl-5" style={{ color: "#9A9088" }}>
                    <span style={{ color: "#F0EBE3" }}>skills</span>: [<span style={{ color: "#E8A020" }}>&quot;JS&quot;</span>, <span style={{ color: "#E8A020" }}>&quot;React&quot;</span>],
                  </div>
                  <div className="pl-5" style={{ color: "#9A9088" }}>
                    <span style={{ color: "#F0EBE3" }}>salary</span>: <span style={{ color: "#1EA876" }}>150_000</span>,
                  </div>
                  <div style={{ color: "#9A9088" }}>{"}"}</div>
                  <div className="mt-4 pt-4 space-y-1.5" style={{ borderTop: "1px solid #1F1C1A" }}>
                    <div style={{ color: "#1EA876" }}>✓ записался на курс</div>
                    <div style={{ color: "#1EA876" }}>✓ сдал проект</div>
                    <div style={{ color: "#3A3530" }}>○ получил оффер</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20" style={{ borderTop: "1px solid #1F1C1A" }}>
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
              {[
                { value: `${courseCount}`, label: "Курсов", sub: "на платформе" },
                { value: `${totalLessons}`, label: "Уроков", sub: "суммарно" },
                { value: `${enrollmentCount}+`, label: "Записей", sub: "от студентов" },
                { value: "4.9", label: "Рейтинг", sub: "средняя оценка" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className="px-6 py-8 md:px-10"
                  style={{ borderRight: i < 3 ? "1px solid #1F1C1A" : "none" }}
                >
                  <div
                    className="text-3xl md:text-4xl font-black mb-1"
                    style={{ fontFamily: "var(--font-mono)", color: "#F0EBE3" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-sm font-semibold" style={{ fontFamily: "var(--font-sans)", color: "#9A9088" }}>
                    {s.label}
                  </div>
                  <div className="text-xs mt-0.5" style={{ fontFamily: "var(--font-sans)", color: "#3A3530" }}>
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MARQUEE ─── */}
        <div
          className="py-4 overflow-hidden"
          style={{ background: "#0A0807", borderTop: "1px solid #1F1C1A", borderBottom: "1px solid #1F1C1A" }}
        >
          <div className="flex animate-marquee w-max gap-3">
            {[...TECH_TAGS, ...TECH_TAGS].map((tag, i) => (
              <span
                key={i}
                className="shrink-0 px-4 py-1.5 text-[11px] font-black tracking-widest"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: i % 3 === 0 ? "rgba(232,53,29,0.08)" : "transparent",
                  color: i % 3 === 0 ? "#E8351D" : "#3A3530",
                  border: `1px solid ${i % 3 === 0 ? "rgba(232,53,29,0.2)" : "#1F1C1A"}`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ─── FEATURES ─── */}
        <section style={{ background: "#0D0B09", borderBottom: "1px solid #1F1C1A" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "#1F1C1A" }}>
              {FEATURES.map((f) => (
                <div key={f.title} className="feature-card p-8">
                  <div
                    className="text-xs font-black mb-4"
                    style={{ fontFamily: "var(--font-mono)", color: "#E8351D" }}
                  >
                    {f.num}
                  </div>
                  <h3
                    className="font-black text-sm mb-3"
                    style={{ fontFamily: "var(--font-display)", color: "#F0EBE3" }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-sans)", color: "#6E675E" }}>
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── COURSES ─── */}
        <section style={{ background: "#0D0B09" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p
                  className="text-[10px] font-black uppercase tracking-[0.25em] mb-2"
                  style={{ fontFamily: "var(--font-mono)", color: "#6E675E" }}
                >
                  Программы
                </p>
                <h2
                  className="text-4xl md:text-5xl font-black leading-tight"
                  style={{ fontFamily: "var(--font-display)", color: "#F0EBE3" }}
                >
                  ПОПУЛЯРНЫЕ<br />КУРСЫ
                </h2>
              </div>
              <Link
                href="/courses"
                className="link-muted hidden md:inline-flex items-center gap-1.5 text-sm font-black"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Все курсы <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => <CourseCard key={course.id} course={course} />)}
            </div>
            <Link
              href="/courses"
              className="mt-8 flex md:hidden items-center gap-1.5 text-sm font-black"
              style={{ fontFamily: "var(--font-display)", color: "#E8351D" }}
            >
              Все {courseCount} курсов <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ─── INSTRUCTORS ─── */}
        <section style={{ background: "#0A0807", borderTop: "1px solid #1F1C1A", borderBottom: "1px solid #1F1C1A" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="mb-12">
              <p
                className="text-[10px] font-black uppercase tracking-[0.25em] mb-2"
                style={{ fontFamily: "var(--font-mono)", color: "#6E675E" }}
              >
                Команда
              </p>
              <h2
                className="text-4xl font-black"
                style={{ fontFamily: "var(--font-display)", color: "#F0EBE3" }}
              >
                ПРЕПОДАВАТЕЛИ
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {instructors.map((inst) => {
                const totalStudents = inst.courses.reduce((a, c) => a + c._count.enrollments, 0);
                return (
                  <div
                    key={inst.id}
                    className="flex gap-5 p-6"
                    style={{ background: "#141210", border: "1px solid #262220" }}
                  >
                    {inst.image ? (
                      <Image
                        src={inst.image}
                        alt={inst.name ?? ""}
                        width={72} height={72}
                        unoptimized
                        className="rounded-full shrink-0 object-cover"
                        style={{ border: "1px solid #3A3530" }}
                      />
                    ) : (
                      <div
                        className="rounded-full shrink-0 flex items-center justify-center text-xl font-black"
                        style={{ width: 72, height: 72, background: "#1F1C1A", color: "#F0EBE3", fontFamily: "var(--font-display)" }}
                      >
                        {(inst.name ?? "?")[0]}
                      </div>
                    )}
                    <div>
                      <h3
                        className="font-black text-lg mb-0.5"
                        style={{ fontFamily: "var(--font-display)", color: "#F0EBE3" }}
                      >
                        {inst.name}
                      </h3>
                      <p className="text-xs mb-3" style={{ fontFamily: "var(--font-mono)", color: "#6E675E" }}>
                        Senior Developer — Преподаватель
                      </p>
                      <div className="flex gap-5 text-xs" style={{ fontFamily: "var(--font-mono)", color: "#6E675E" }}>
                        <span><span style={{ color: "#E8A020" }}>{inst._count.courses}</span> курсов</span>
                        <span><span style={{ color: "#E8A020" }}>{totalStudents}</span> студентов</span>
                        <span style={{ color: "#E8A020" }}>★ 4.9</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── REVIEWS ─── */}
        {reviews.length > 0 && (
          <section style={{ background: "#0D0B09" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="mb-12">
                <p
                  className="text-[10px] font-black uppercase tracking-[0.25em] mb-2"
                  style={{ fontFamily: "var(--font-mono)", color: "#6E675E" }}
                >
                  Отзывы
                </p>
                <h2
                  className="text-4xl font-black"
                  style={{ fontFamily: "var(--font-display)", color: "#F0EBE3" }}
                >
                  ЧТО ГОВОРЯТ<br />СТУДЕНТЫ
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {reviews.map((r) => (
                  <div key={r.id} className="p-7" style={{ background: "#141210", border: "1px solid #262220" }}>
                    <div className="flex gap-0.5 mb-5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{ color: i < r.rating ? "#E8A020" : "#2A2218", fontSize: "14px" }}>★</span>
                      ))}
                    </div>
                    <p
                      className="text-sm leading-relaxed mb-6"
                      style={{ fontFamily: "var(--font-sans)", color: "#9A9088" }}
                    >
                      &laquo;{r.text}&raquo;
                    </p>
                    <div className="flex items-center gap-3 pt-5" style={{ borderTop: "1px solid #1F1C1A" }}>
                      {r.user.image ? (
                        <Image
                          src={r.user.image} alt={r.user.name ?? ""}
                          width={36} height={36} unoptimized
                          className="rounded-full object-cover"
                          style={{ border: "1px solid #3A3530" }}
                        />
                      ) : (
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black"
                          style={{ background: "#1F1C1A", color: "#F0EBE3", fontFamily: "var(--font-display)" }}
                        >
                          {(r.user.name ?? "?")[0]}
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-semibold" style={{ fontFamily: "var(--font-sans)", color: "#F0EBE3" }}>
                          {r.user.name}
                        </div>
                        <div className="text-[10px]" style={{ fontFamily: "var(--font-mono)", color: "#3A3530" }}>
                          {r.course.title}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── CTA ─── */}
        <section style={{ background: "#E8351D" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2
                className="text-3xl md:text-4xl font-black leading-tight"
                style={{ fontFamily: "var(--font-display)", color: "#F0EBE3" }}
              >
                ГОТОВ НАЧАТЬ?
              </h2>
              <p className="mt-3 max-w-sm" style={{ fontFamily: "var(--font-sans)", color: "rgba(240,235,227,0.65)" }}>
                Зарегистрируйся и получи доступ к 3 бесплатным курсам прямо сейчас.
              </p>
              <div className="flex flex-wrap gap-4 mt-5">
                {["JavaScript", "Python", "Git"].map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 text-xs"
                    style={{ fontFamily: "var(--font-mono)", color: "rgba(240,235,227,0.6)" }}
                  >
                    <CheckCircle className="w-3.5 h-3.5" style={{ color: "rgba(240,235,227,0.8)" }} /> {tag}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/login"
              className="shrink-0 inline-flex items-center gap-2 px-10 py-4 text-base font-black transition-opacity hover:opacity-90"
              style={{ fontFamily: "var(--font-display)", background: "#0D0B09", color: "#F0EBE3" }}
            >
              Начать бесплатно <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
