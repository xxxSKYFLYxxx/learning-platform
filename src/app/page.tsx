import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Star, Clock, Users } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/course/CourseCard";
import { formatDuration } from "@/lib/utils";

async function getHomeData() {
  const [courses, courseCount, enrollmentCount, reviewCount] = await Promise.all([
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
    prisma.review.count(),
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
    courses: courses.map((c) => ({ ...c, price: c.price ? Number(c.price) : null })),
    courseCount, enrollmentCount, reviewCount, instructors, reviews, totalLessons,
  };
}

const TECH_TAGS = [
  { label: "JavaScript", v: "dark" }, { label: "React", v: "accent" },
  { label: "TypeScript", v: "light" }, { label: "Node.js", v: "dark" },
  { label: "Next.js", v: "light" }, { label: "Python", v: "accent" },
  { label: "Git", v: "dark" }, { label: "CSS / Tailwind", v: "light" },
  { label: "PostgreSQL", v: "accent" }, { label: "Docker", v: "dark" },
  { label: "GraphQL", v: "light" }, { label: "REST API", v: "accent" },
];

function tagClass(v: string) {
  if (v === "dark")   return "bg-[#0F0F0F] text-[#FAFAF7] border-[#0F0F0F]";
  if (v === "accent") return "bg-[#D4402F] text-[#FAFAF7] border-[#D4402F]";
  return "bg-white text-[#0F0F0F] border-[#0F0F0F]";
}

const FEATURES = [
  { icon: "🎯", title: "Только практика", desc: "Каждый курс — реальный проект, который можно показать работодателю" },
  { icon: "⚡", title: "Быстро и без воды", desc: "Средний урок — 12 минут. Только суть, никаких отступлений" },
  { icon: "🏆", title: "Сертификат", desc: "PDF-сертификат с уникальным кодом верификации после каждого курса" },
  { icon: "♾️", title: "Пожизненный доступ", desc: "Купи раз — учись всю жизнь. Все обновления курсов бесплатно" },
];

export default async function HomePage() {
  const { courses, courseCount, enrollmentCount, totalLessons, instructors, reviews } = await getHomeData();

  return (
    <>
      <Header />
      <main className="flex-1">

        {/* ─── HERO ─── */}
        <section className="bg-[#FDFCE8] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-0">
            <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-[#0F0F0F] text-[10px] font-black tracking-widest mb-8" style={{ fontFamily: "var(--font-mono)" }}>
                  🚀 НОВЫЙ КУРС: Next.js Полный курс →
                </div>
                <h1 className="leading-[0.88] tracking-tight mb-10" style={{ fontFamily: "var(--font-display)" }}>
                  <span className="block text-[12vw] sm:text-7xl lg:text-8xl font-black text-[#0F0F0F] hero-word" style={{ animationDelay: "0.1s" }}>УЧИСЬ.</span>
                  <span className="block text-[12vw] sm:text-7xl lg:text-8xl font-black text-[#D4402F] hero-word" style={{ animationDelay: "0.22s" }}>СОЗДАВАЙ.</span>
                  <span className="block text-[12vw] sm:text-7xl lg:text-8xl font-black text-[#0F0F0F] hero-word" style={{ animationDelay: "0.34s" }}>РАСТИ.</span>
                </h1>
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <p className="text-base text-[#787068] max-w-xs leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
                    Практические курсы от реальных разработчиков. Только живые проекты, никакой теории ради теории.
                  </p>
                  <div className="flex gap-3 shrink-0">
                    <Link href="/courses" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black bg-[#0F0F0F] text-[#FAFAF7] border-2 border-[#0F0F0F] shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all" style={{ fontFamily: "var(--font-display)" }}>
                      Курсы <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/courses?isFree=true" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black bg-transparent text-[#0F0F0F] border-2 border-[#0F0F0F] shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all" style={{ fontFamily: "var(--font-display)" }}>
                      Бесплатно
                    </Link>
                  </div>
                </div>
              </div>

              {/* Code card */}
              <div className="hidden lg:flex flex-col justify-end self-end">
                <div className="bg-[#111111] border-2 border-[#0F0F0F] shadow-[8px_8px_0_#0F0F0F] p-7 text-sm leading-7" style={{ fontFamily: "var(--font-mono)" }}>
                  <div className="text-[#555] text-xs mb-3 tracking-widest">// твой путь в IT</div>
                  <div className="text-[#F8F8F2]"><span className="text-[#FF79C6]">const </span><span className="text-[#8BE9FD]">developer </span><span className="text-[#F8F8F2]">= {"{"}</span></div>
                  <div className="pl-4 text-[#F8F8F2]"><span className="text-[#F1FA8C]">name</span><span>: </span><span className="text-[#F1FA8C]">"Ты"</span><span>,</span></div>
                  <div className="pl-4 text-[#F8F8F2]"><span className="text-[#F1FA8C]">skills</span><span>: [</span><span className="text-[#F1FA8C]">"JS"</span><span>, </span><span className="text-[#F1FA8C]">"React"</span><span>],</span></div>
                  <div className="pl-4 text-[#F8F8F2]"><span className="text-[#F1FA8C]">salary</span><span>: </span><span className="text-[#50FA7B]">150_000</span><span>,</span></div>
                  <div className="text-[#F8F8F2]">{"}"}</div>
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-1.5">
                    <div className="text-[#50FA7B]">✓ записался на курс</div>
                    <div className="text-[#50FA7B]">✓ сдал проект</div>
                    <div className="text-[#444]">○ получил оффер</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="border-t-2 border-[#0F0F0F] mt-16">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-[#0F0F0F]">
              {[
                { value: `${courseCount}`,       label: "Курсов", sub: "на платформе" },
                { value: `${totalLessons}`,      label: "Уроков", sub: "суммарно" },
                { value: `${enrollmentCount}+`,  label: "Записей", sub: "от студентов" },
                { value: "4.9",                   label: "Рейтинг", sub: "средняя оценка" },
              ].map((s) => (
                <div key={s.label} className="px-6 py-7 md:px-8">
                  <div className="text-3xl md:text-4xl font-bold text-[#0F0F0F]" style={{ fontFamily: "var(--font-mono)" }}>{s.value}</div>
                  <div className="text-sm font-semibold text-[#0F0F0F] mt-1" style={{ fontFamily: "var(--font-sans)" }}>{s.label}</div>
                  <div className="text-xs text-[#787068]" style={{ fontFamily: "var(--font-sans)" }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MARQUEE ─── */}
        <div className="border-y-2 border-[#0F0F0F] py-3.5 overflow-hidden bg-[#0F0F0F]">
          <div className="flex animate-marquee w-max gap-3">
            {[...TECH_TAGS, ...TECH_TAGS].map((tag, i) => (
              <span key={i} className={`shrink-0 px-4 py-1.5 text-xs font-bold border-2 ${tagClass(tag.v)}`} style={{ fontFamily: "var(--font-mono)" }}>
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* ─── FEATURES ─── */}
        <section className="border-b-2 border-[#0F0F0F] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((f) => (
                <div key={f.title} className="border-2 border-[#0F0F0F] p-6 hover:shadow-brutal transition-all hover:-translate-y-0.5 bg-white">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="font-black text-sm text-[#0F0F0F] mb-2" style={{ fontFamily: "var(--font-display)" }}>{f.title}</h3>
                  <p className="text-xs text-[#787068] leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── COURSES ─── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#787068] mb-2" style={{ fontFamily: "var(--font-mono)" }}>Программы</p>
              <h2 className="text-4xl md:text-5xl font-black text-[#0F0F0F] leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                ПОПУЛЯРНЫЕ<br />КУРСЫ
              </h2>
            </div>
            <Link href="/courses" className="hidden md:inline-flex items-center gap-1.5 text-sm font-black text-[#D4402F] border-b-2 border-[#D4402F] pb-0.5 hover:text-[#0F0F0F] hover:border-[#0F0F0F] transition-colors" style={{ fontFamily: "var(--font-display)" }}>
              Все курсы <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => <CourseCard key={course.id} course={course} />)}
          </div>
          <Link href="/courses" className="mt-6 flex md:hidden items-center gap-1.5 text-sm font-black text-[#D4402F]" style={{ fontFamily: "var(--font-display)" }}>
            Все {courseCount} курсов <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* ─── INSTRUCTORS ─── */}
        <section className="border-y-2 border-[#0F0F0F] bg-[#FDFCE8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="mb-10">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#787068] mb-2" style={{ fontFamily: "var(--font-mono)" }}>Команда</p>
              <h2 className="text-4xl font-black text-[#0F0F0F]" style={{ fontFamily: "var(--font-display)" }}>ПРЕПОДАВАТЕЛИ</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {instructors.map((inst) => {
                const totalStudents = inst.courses.reduce((a, c) => a + c._count.enrollments, 0);
                return (
                  <div key={inst.id} className="bg-white border-2 border-[#0F0F0F] p-6 flex gap-5 shadow-brutal">
                    {inst.image ? (
                      <Image src={inst.image} alt={inst.name ?? ""} width={80} height={80} unoptimized className="rounded-full border-2 border-[#0F0F0F] shrink-0 object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-full border-2 border-[#0F0F0F] bg-[#FAFAF7] flex items-center justify-center shrink-0">
                        <span className="text-2xl font-black" style={{ fontFamily: "var(--font-display)" }}>{(inst.name ?? "?")[0]}</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-black text-lg text-[#0F0F0F]" style={{ fontFamily: "var(--font-display)" }}>{inst.name}</h3>
                      <p className="text-xs text-[#787068] mt-0.5 mb-3" style={{ fontFamily: "var(--font-mono)" }}>Senior Developer · Преподаватель</p>
                      <div className="flex gap-4 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {totalStudents} студентов</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {inst._count.courses} курсов</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#D4402F]" /> 4.9</span>
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
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="mb-10">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#787068] mb-2" style={{ fontFamily: "var(--font-mono)" }}>Отзывы</p>
              <h2 className="text-4xl font-black text-[#0F0F0F]" style={{ fontFamily: "var(--font-display)" }}>ЧТО ГОВОРЯТ<br />СТУДЕНТЫ</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {reviews.map((r) => (
                <div key={r.id} className="bg-white border-2 border-[#0F0F0F] p-6 shadow-brutal">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < r.rating ? "text-[#D4402F] fill-[#D4402F]" : "text-[#E0DDD8]"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-[#0F0F0F] leading-relaxed mb-5" style={{ fontFamily: "var(--font-sans)" }}>«{r.text}»</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-[#E0DDD8]">
                    {r.user.image ? (
                      <Image src={r.user.image} alt={r.user.name ?? ""} width={36} height={36} unoptimized className="rounded-full border-2 border-[#0F0F0F] object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-full border-2 border-[#0F0F0F] bg-[#FAFAF7] flex items-center justify-center text-xs font-black" style={{ fontFamily: "var(--font-display)" }}>
                        {(r.user.name ?? "?")[0]}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-semibold text-[#0F0F0F]" style={{ fontFamily: "var(--font-sans)" }}>{r.user.name}</div>
                      <div className="text-[10px] text-[#787068]" style={{ fontFamily: "var(--font-mono)" }}>Курс: {r.course.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── CTA ─── */}
        <section className="border-t-2 border-[#0F0F0F] bg-[#0F0F0F] text-[#FAFAF7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-black leading-tight" style={{ fontFamily: "var(--font-display)" }}>ГОТОВ НАЧАТЬ?</h2>
              <p className="text-[#787068] mt-3 max-w-sm" style={{ fontFamily: "var(--font-sans)" }}>
                Зарегистрируйся и получи доступ к 3 бесплатным курсам прямо сейчас.
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                {["JavaScript", "Python", "Git"].map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 text-xs text-[#787068]" style={{ fontFamily: "var(--font-mono)" }}>
                    <CheckCircle className="w-3.5 h-3.5 text-[#1A9E6E]" /> {tag}
                  </span>
                ))}
              </div>
            </div>
            <Link href="/login" className="shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-[#D4402F] text-[#FAFAF7] font-black text-base border-2 border-[#D4402F] shadow-[4px_4px_0_#FAFAF7] hover:shadow-[2px_2px_0_#FAFAF7] hover:translate-x-0.5 hover:translate-y-0.5 transition-all" style={{ fontFamily: "var(--font-display)" }}>
              Начать бесплатно <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
