import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, BookOpen, Award } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "О нас",
  description: "КУРС — платформа практического обучения программированию на русском языке. Узнайте, кто мы и почему выбирают нас.",
  keywords: ["о платформе", "онлайн обучение", "программирование", "курсы", "преподаватели"],
  alternates: { canonical: `${process.env.AUTH_URL ?? "http://localhost:3002"}/about` },
};

async function getAboutData() {
  const [courseCount, enrollmentCount, instructors] = await Promise.all([
    prisma.course.count({ where: { published: true } }),
    prisma.enrollment.count(),
    prisma.user.findMany({
      where: { role: "INSTRUCTOR" },
      include: {
        courses: {
          where: { published: true },
          select: { id: true, _count: { select: { enrollments: true } } },
        },
      },
    }),
  ]);
  return { courseCount, enrollmentCount, instructors };
}

const VALUES = [
  {
    title: "Только практика",
    body: "Каждый курс строится вокруг реального проекта. Теория — минимум, необходимый для понимания. Всё остальное время — руки в коде.",
  },
  {
    title: "Без воды",
    body: "Средний урок — 12 минут. Мы уважаем ваше время и не растягиваем материал ради хронометража.",
  },
  {
    title: "На русском",
    body: "Вся платформа, преподаватели и поддержка — на русском языке. Никакого языкового барьера между вами и знаниями.",
  },
  {
    title: "Доступные цены",
    body: "Мы против подписной модели. Платите раз — получаете пожизненный доступ со всеми обновлениями.",
  },
];

export default async function AboutPage() {
  const { courseCount, enrollmentCount, instructors } = await getAboutData();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b-2 border-[#0F0F0F] bg-[#FDFCE8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#787068] mb-3" style={{ fontFamily: "var(--font-mono)" }}>
              О платформе
            </p>
            <h1 className="text-5xl md:text-6xl font-black text-[#0F0F0F] leading-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
              МЫ УЧИМ<br />ПРОГРАММИРОВАНИЮ
            </h1>
            <p className="text-lg text-[#787068] max-w-xl leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
              КУРС — платформа, которую построили практикующие разработчики для тех, кто хочет войти в IT без лишней воды и переплаты.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b-2 border-[#0F0F0F] bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-3 divide-x-2 divide-[#0F0F0F]">
            {[
              { icon: BookOpen, value: courseCount, label: "Курсов" },
              { icon: Users, value: `${enrollmentCount}+`, label: "Студентов" },
              { icon: Award, value: "4.9", label: "Средняя оценка" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="px-6 py-10 text-center">
                <Icon className="w-6 h-6 text-[#D4402F] mx-auto mb-3" />
                <div className="text-3xl font-black text-[#0F0F0F]" style={{ fontFamily: "var(--font-mono)" }}>{value}</div>
                <div className="text-xs text-[#787068] mt-1" style={{ fontFamily: "var(--font-sans)" }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="border-b-2 border-[#0F0F0F]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#787068] mb-3" style={{ fontFamily: "var(--font-mono)" }}>
              Принципы
            </p>
            <h2 className="text-4xl font-black text-[#0F0F0F] mb-12" style={{ fontFamily: "var(--font-display)" }}>КАК МЫ РАБОТАЕМ</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {VALUES.map((v, i) => (
                <div key={v.title} className="border-2 border-[#0F0F0F] p-7 bg-white shadow-brutal">
                  <div className="text-xs font-black text-[#787068] mb-2" style={{ fontFamily: "var(--font-mono)" }}>
                    0{i + 1}
                  </div>
                  <h3 className="text-lg font-black text-[#0F0F0F] mb-3" style={{ fontFamily: "var(--font-display)" }}>
                    {v.title}
                  </h3>
                  <p className="text-sm text-[#787068] leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
                    {v.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Instructors */}
        {instructors.length > 0 && (
          <section className="border-b-2 border-[#0F0F0F] bg-[#FDFCE8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#787068] mb-3" style={{ fontFamily: "var(--font-mono)" }}>
                Команда
              </p>
              <h2 className="text-4xl font-black text-[#0F0F0F] mb-12" style={{ fontFamily: "var(--font-display)" }}>ПРЕПОДАВАТЕЛИ</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {instructors.map((inst) => {
                  const totalStudents = inst.courses.reduce((a, c) => a + c._count.enrollments, 0);
                  return (
                    <div key={inst.id} className="bg-white border-2 border-[#0F0F0F] p-6 flex gap-5 shadow-brutal">
                      {inst.image ? (
                        <Image
                          src={inst.image}
                          alt={inst.name ?? ""}
                          width={72}
                          height={72}
                          unoptimized
                          className="rounded-full border-2 border-[#0F0F0F] shrink-0 object-cover"
                        />
                      ) : (
                        <div className="w-18 h-18 rounded-full border-2 border-[#0F0F0F] bg-[#FAFAF7] flex items-center justify-center shrink-0 text-xl font-black" style={{ fontFamily: "var(--font-display)", width: 72, height: 72 }}>
                          {(inst.name ?? "?")[0]}
                        </div>
                      )}
                      <div>
                        <h3 className="font-black text-[#0F0F0F] mb-0.5" style={{ fontFamily: "var(--font-display)" }}>{inst.name}</h3>
                        <p className="text-xs text-[#787068] mb-3" style={{ fontFamily: "var(--font-mono)" }}>Senior Developer</p>
                        <div className="flex gap-4 text-xs text-[#787068]" style={{ fontFamily: "var(--font-mono)" }}>
                          <span>{inst.courses.length} курсов</span>
                          <span>{totalStudents} студентов</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-[#0F0F0F] text-[#FAFAF7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-black" style={{ fontFamily: "var(--font-display)" }}>НАЧАТЬ УЧИТЬСЯ</h2>
              <p className="text-[#787068] mt-2" style={{ fontFamily: "var(--font-sans)" }}>
                Три бесплатных курса доступны без регистрации.
              </p>
            </div>
            <Link
              href="/courses"
              className="shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-[#D4402F] text-[#FAFAF7] font-black border-2 border-[#D4402F] shadow-[4px_4px_0_#FAFAF7] hover:shadow-[2px_2px_0_#FAFAF7] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Все курсы <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
