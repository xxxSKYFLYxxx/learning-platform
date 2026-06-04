import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/course/CourseCard";

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
      },
    }),
    prisma.course.count({ where: { published: true } }),
    prisma.enrollment.count(),
  ]);

  return {
    courses: courses.map((c) => ({ ...c, price: c.price ? Number(c.price) : null })),
    courseCount,
    enrollmentCount,
  };
}

const TECH_TAGS = [
  { label: "JavaScript", v: "dark" },
  { label: "React",      v: "accent" },
  { label: "TypeScript", v: "light" },
  { label: "Node.js",    v: "dark" },
  { label: "Next.js",    v: "light" },
  { label: "Python",     v: "accent" },
  { label: "Git",        v: "dark" },
  { label: "CSS",        v: "light" },
  { label: "SQL",        v: "accent" },
  { label: "Docker",     v: "dark" },
  { label: "GraphQL",    v: "light" },
  { label: "REST API",   v: "accent" },
];

function tagClass(v: string) {
  if (v === "dark")   return "bg-[#0F0F0F] text-[#FAFAF7] border-[#0F0F0F]";
  if (v === "accent") return "bg-[#D4402F] text-[#FAFAF7] border-[#D4402F]";
  return "bg-white text-[#0F0F0F] border-[#0F0F0F]";
}

export default async function HomePage() {
  const { courses, courseCount, enrollmentCount } = await getHomeData();

  return (
    <>
      <Header />
      <main className="flex-1">

        {/* ─── HERO ─────────────────────────────────────────────── */}
        <section className="bg-[#FDFCE8] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-0">
            <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">

              {/* Left: typography */}
              <div>
                <h1 className="leading-[0.88] tracking-tight mb-10" style={{ fontFamily: "var(--font-display)" }}>
                  <span
                    className="block text-[13vw] sm:text-7xl lg:text-8xl xl:text-[7rem] font-black text-[#0F0F0F] hero-word"
                    style={{ animationDelay: "0.1s" }}
                  >
                    УЧИСЬ.
                  </span>
                  <span
                    className="block text-[13vw] sm:text-7xl lg:text-8xl xl:text-[7rem] font-black text-[#D4402F] hero-word"
                    style={{ animationDelay: "0.22s" }}
                  >
                    СОЗДАВАЙ.
                  </span>
                  <span
                    className="block text-[13vw] sm:text-7xl lg:text-8xl xl:text-[7rem] font-black text-[#0F0F0F] hero-word"
                    style={{ animationDelay: "0.34s" }}
                  >
                    РАСТИ.
                  </span>
                </h1>

                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <p className="text-base text-[#787068] max-w-xs leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
                    Практические курсы от реальных разработчиков. Только живые проекты.
                  </p>
                  <div className="flex gap-3 shrink-0">
                    <Link
                      href="/courses"
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black bg-[#0F0F0F] text-[#FAFAF7] border-2 border-[#0F0F0F] shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Курсы <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/courses?isFree=true"
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black bg-transparent text-[#0F0F0F] border-2 border-[#0F0F0F] shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Бесплатно
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right: code card */}
              <div className="hidden lg:flex flex-col justify-end pb-0 self-end">
                <div
                  className="bg-[#111111] border-2 border-[#0F0F0F] shadow-[8px_8px_0_#0F0F0F] p-7 text-sm leading-7"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <div className="text-[#555] text-xs mb-3 tracking-widest">// твой путь</div>
                  <div className="text-[#F8F8F2]">
                    <span className="text-[#FF79C6]">const </span>
                    <span className="text-[#8BE9FD]">you </span>
                    <span className="text-[#F8F8F2]">= </span>
                    <span className="text-[#FF79C6]">new </span>
                    <span className="text-[#50FA7B]">Developer</span>
                    <span className="text-[#F8F8F2]">{"({"}</span>
                  </div>
                  <div className="pl-4 text-[#F8F8F2]">
                    <span className="text-[#F1FA8C]">skills</span>
                    <span>: [</span>
                    <span className="text-[#F1FA8C]">"React"</span>
                    <span>, </span>
                    <span className="text-[#F1FA8C]">"TS"</span>
                    <span>],</span>
                  </div>
                  <div className="pl-4 text-[#F8F8F2]">
                    <span className="text-[#F1FA8C]">level</span>
                    <span>: </span>
                    <span className="text-[#F1FA8C]">"senior"</span>
                    <span>,</span>
                  </div>
                  <div className="text-[#F8F8F2]">{"});"}</div>
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-1">
                    <div className="text-[#50FA7B]">✓ начал обучение</div>
                    <div className="text-[#444]">○ создал проект</div>
                    <div className="text-[#444]">○ получил работу</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="border-t-2 border-[#0F0F0F] mt-16">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-[#0F0F0F]">
              {[
                { value: `${courseCount}+`,      label: "Курсов" },
                { value: `${enrollmentCount}+`,  label: "Студентов" },
                { value: "800+",                 label: "Сертификатов" },
                { value: "78%",                  label: "Завершают курс" },
              ].map((s) => (
                <div key={s.label} className="px-6 py-7 md:px-8">
                  <div className="text-3xl md:text-4xl font-bold text-[#0F0F0F]" style={{ fontFamily: "var(--font-mono)" }}>
                    {s.value}
                  </div>
                  <div className="text-sm text-[#787068] mt-1" style={{ fontFamily: "var(--font-sans)" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MARQUEE ──────────────────────────────────────────── */}
        <div className="border-y-2 border-[#0F0F0F] py-3.5 overflow-hidden bg-[#0F0F0F]">
          <div className="flex animate-marquee w-max gap-3">
            {[...TECH_TAGS, ...TECH_TAGS].map((tag, i) => (
              <span
                key={i}
                className={`shrink-0 px-4 py-1.5 text-xs font-bold border-2 ${tagClass(tag.v)}`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* ─── COURSES ──────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#787068] mb-2" style={{ fontFamily: "var(--font-mono)" }}>
                Программы
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-[#0F0F0F] leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                ПОПУЛЯРНЫЕ<br />КУРСЫ
              </h2>
            </div>
            <Link
              href="/courses"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-black text-[#D4402F] border-b-2 border-[#D4402F] pb-0.5 hover:text-[#0F0F0F] hover:border-[#0F0F0F] transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
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
            <div className="text-center py-24 border-2 border-dashed border-[#E0DDD8]">
              <p className="text-[#787068]" style={{ fontFamily: "var(--font-mono)" }}>
                Курсы скоро появятся
              </p>
            </div>
          )}
        </section>

        {/* ─── CTA ──────────────────────────────────────────────── */}
        <section className="border-t-2 border-[#0F0F0F] bg-[#0F0F0F] text-[#FAFAF7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2
                className="text-3xl md:text-4xl font-black leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                ГОТОВ НАЧАТЬ?
              </h2>
              <p className="text-[#787068] mt-3 max-w-sm" style={{ fontFamily: "var(--font-sans)" }}>
                Зарегистрируйся и получи доступ к первому уроку прямо сейчас.
              </p>
            </div>
            <Link
              href="/login"
              className="shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-[#D4402F] text-[#FAFAF7] font-black text-base border-2 border-[#D4402F] shadow-[4px_4px_0_#FAFAF7] hover:shadow-[2px_2px_0_#FAFAF7] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Начать обучение <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
