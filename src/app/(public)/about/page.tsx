import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, BookOpen, Award, Shield, Zap, Target, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { fallbackHomeData, withDbFallback } from "@/lib/public-fallbacks";

export const metadata: Metadata = {
  title: "О нас",
  description: "КУРС — платформа практического обучения программированию на русском языке. Узнайте, кто мы и почему выбирают нас.",
  keywords: ["о платформе", "онлайн обучение", "программирование", "курсы", "преподаватели"],
  alternates: { canonical: `${process.env.AUTH_URL ?? "http://localhost:3002"}/about` },
};

async function getAboutData() {
  const data = Promise.all([
    prisma.course.count({ where: { published: true } }),
    prisma.enrollment.count(),
    prisma.user.findMany({
      where: { role: "INSTRUCTOR" },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        courses: {
          where: { published: true },
          select: { id: true, _count: { select: { enrollments: true } } },
        },
      },
    }),
  ]);

  const [courseCount, enrollmentCount, instructors] = await withDbFallback(data, [
    fallbackHomeData.courseCount,
    fallbackHomeData.enrollmentCount,
    fallbackHomeData.instructors,
  ]);

  return { courseCount, enrollmentCount, instructors };
}

const VALUES = [
  {
    title: "Только практика",
    body: "Каждый курс строится вокруг реального проекта. Теория — минимум, необходимый для понимания. Всё остальное время — руки в коде.",
    icon: Target,
  },
  {
    title: "Без воды",
    body: "Средний урок — 12 минут. Мы уважаем ваше время и не растягиваем материал ради хронометража.",
    icon: Zap,
  },
  {
    title: "На русском",
    body: "Вся платформа, преподаватели и поддержка — на русском языке. Никакого языкового барьера между вами и знаниями.",
    icon: Shield,
  },
  {
    title: "Доступные цены",
    body: "Мы против подписной модели. Платите раз — получаете пожизненный доступ со всеми обновлениями.",
    icon: Clock,
  },
];

const GUARANTEES = [
  {
    title: "14 дней на возврат",
    body: "Если курс не подошел — вернем деньги без вопросов. Достаточно написать на hello@kurs.dev в течение 14 дней.",
    icon: "💰",
  },
  {
    title: "Пожизненный доступ",
    body: "Все обновления курса бесплатно. Даже если вы прошли курс год назад — новые материалы откроются автоматически.",
    icon: "♾️",
  },
  {
    title: "Сертификат после курса",
    body: "Сертификат с уникальным кодом верификации. Можно добавить в резюме и LinkedIn. Проверяется на платформе.",
    icon: "🎓",
  },
];

export default async function AboutPage() {
  const { courseCount, enrollmentCount, instructors } = await getAboutData();

  return (
    <div className="grain" style={{ background: "var(--c-bg)", minHeight: "100vh" }}>
      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .stats-grid > div { border-right: none !important; border-bottom: 1px solid var(--c-border); }
          .stats-grid > div:last-child { border-bottom: none !important; }
          .values-grid { grid-template-columns: 1fr !important; }
          .instructors-grid { grid-template-columns: 1fr !important; }
          .mission-grid { grid-template-columns: 1fr !important; }
          .guarantees-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Header />
      <main>
        {/* Hero */}
        <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--c-border)" }}>
          <div aria-hidden style={{ position: "absolute", top: "-30%", right: "-5%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,var(--c-red-mid) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px", position: "relative" }}>
            <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--c-t3)", fontFamily: "var(--font-mono)", marginBottom: 14 }}>
              О платформе
            </p>
            <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)", lineHeight: 1.05, marginBottom: 24 }}>
              Мы учим<br /><span style={{ color: "var(--c-red)" }}>программированию</span>
            </h1>
            <p style={{ fontSize: 18, color: "var(--c-t2)", fontFamily: "var(--font-sans)", maxWidth: 600, lineHeight: 1.65 }}>
              КУРС — платформа, которую построили практикующие разработчики для тех, кто хочет войти в IT без лишней воды и переплаты.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section style={{ borderBottom: "1px solid var(--c-border)", background: "var(--c-s1)" }}>
          <div className="stats-grid" style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
            {[
              { icon: BookOpen, value: courseCount, label: "Курсов" },
              { icon: Users, value: `${enrollmentCount}+`, label: "Студентов" },
              { icon: Award, value: "4.9", label: "Средняя оценка" },
            ].map(({ icon: Icon, value, label }, i) => (
              <div key={label} style={{ padding: "40px 24px", textAlign: "center", borderRight: i < 2 ? "1px solid var(--c-border)" : "none" }}>
                <Icon size={22} style={{ color: "var(--c-red)", margin: "0 auto 12px" }} />
                <div style={{ fontSize: 32, fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-mono)" }}>{value}</div>
                <div style={{ fontSize: 12, color: "var(--c-t3)", marginTop: 4, fontFamily: "var(--font-sans)" }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section style={{ borderBottom: "1px solid var(--c-border)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
            <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--c-t3)", fontFamily: "var(--font-mono)", marginBottom: 14 }}>
              Наша миссия
            </p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)", marginBottom: 48 }}>
              Почему мы это делаем
            </h2>
            <div className="mission-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
              <div>
                <p style={{ fontSize: 16, color: "var(--c-t2)", lineHeight: 1.75, fontFamily: "var(--font-sans)", marginBottom: 24 }}>
                  Мы верим, что качественное образование в IT должно быть доступным. Не только по цене, но и по формату — без лишних барьеров, на родном языке, с фокусом на результат.
                </p>
                <p style={{ fontSize: 16, color: "var(--c-t2)", lineHeight: 1.75, fontFamily: "var(--font-sans)" }}>
                  Наша цель — помочь людям войти в профессию разработчика за 6-12 месяцев, а не растягивать обучение на годы. Мы убираем всё лишнее и оставляем только то, что действительно работает.
                </p>
              </div>
              <div style={{ background: "var(--c-s1)", border: "1px solid var(--c-border)", padding: 32 }}>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: "var(--c-t1)", marginBottom: 16, fontFamily: "var(--font-display)" }}>
                  Что это значит для вас
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 14, color: "var(--c-t2)", fontFamily: "var(--font-sans)" }}>
                    <span style={{ color: "var(--c-green)", fontSize: 18, lineHeight: 1 }}>✓</span>
                    <span>Курсы от практиков, а не теоретиков</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 14, color: "var(--c-t2)", fontFamily: "var(--font-sans)" }}>
                    <span style={{ color: "var(--c-green)", fontSize: 18, lineHeight: 1 }}>✓</span>
                    <span>Реальные проекты в портфолио</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 14, color: "var(--c-t2)", fontFamily: "var(--font-sans)" }}>
                    <span style={{ color: "var(--c-green)", fontSize: 18, lineHeight: 1 }}>✓</span>
                    <span>Поддержка преподавателей и сообщества</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 14, color: "var(--c-t2)", fontFamily: "var(--font-sans)" }}>
                    <span style={{ color: "var(--c-green)", fontSize: 18, lineHeight: 1 }}>✓</span>
                    <span>Прозрачные цены без скрытых платежей</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section style={{ borderBottom: "1px solid var(--c-border)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
            <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--c-t3)", fontFamily: "var(--font-mono)", marginBottom: 14 }}>
              Принципы
            </p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)", marginBottom: 48 }}>Как мы работаем</h2>
            <div className="values-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1, background: "var(--c-border)" }}>
              {VALUES.map((v, i) => (
                <div key={v.title} className="feature-card" style={{ padding: "32px" }}>
                  <v.icon size={24} style={{ color: "var(--c-red)", marginBottom: 16 }} />
                  <div style={{ fontSize: 12, fontWeight: 900, color: "var(--c-red)", marginBottom: 12, fontFamily: "var(--font-mono)" }}>
                    0{i + 1}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: "var(--c-t1)", marginBottom: 12, fontFamily: "var(--font-display)" }}>
                    {v.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--c-t3)", lineHeight: 1.65, fontFamily: "var(--font-sans)", margin: 0 }}>
                    {v.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guarantees */}
        <section style={{ borderBottom: "1px solid var(--c-border)", background: "var(--c-s1)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
            <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--c-t3)", fontFamily: "var(--font-mono)", marginBottom: 14 }}>
              Гарантии
            </p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)", marginBottom: 48 }}>
              Наши обещания
            </h2>
            <div className="guarantees-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {GUARANTEES.map((g) => (
                <div key={g.title} style={{ background: "var(--c-bg)", border: "1px solid var(--c-border)", padding: 32 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>{g.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: "var(--c-t1)", marginBottom: 12, fontFamily: "var(--font-display)" }}>
                    {g.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--c-t3)", lineHeight: 1.65, fontFamily: "var(--font-sans)", margin: 0 }}>
                    {g.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Instructors */}
        {instructors.length > 0 && (
          <section style={{ borderBottom: "1px solid var(--c-border)" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
              <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--c-t3)", fontFamily: "var(--font-mono)", marginBottom: 14 }}>
                Команда
              </p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)", marginBottom: 48 }}>Преподаватели</h2>
              <div className="instructors-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                {instructors.map((inst) => {
                  const totalStudents = inst.courses.reduce((a, c) => a + c._count.enrollments, 0);
                  return (
                    <div key={inst.id} style={{ background: "var(--c-s1)", border: "1px solid var(--c-border)", padding: "28px", display: "flex", gap: 20 }}>
                      {inst.image ? (
                        <Image src={inst.image} alt={inst.name ?? ""} width={72} height={72} unoptimized style={{ borderRadius: "50%", border: "1px solid var(--c-border)", objectFit: "cover", flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--c-s2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: "var(--c-t2)", fontFamily: "var(--font-display)", flexShrink: 0 }}>
                          {(inst.name ?? "?")[0]}
                        </div>
                      )}
                      <div>
                        <h3 style={{ fontWeight: 900, fontSize: 17, color: "var(--c-t1)", marginBottom: 4, fontFamily: "var(--font-display)" }}>{inst.name}</h3>
                        <p style={{ fontSize: 12, color: "var(--c-t3)", marginBottom: 14, fontFamily: "var(--font-mono)" }}>Senior Developer</p>
                        <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--c-t3)", fontFamily: "var(--font-mono)" }}>
                          <span><span style={{ color: "var(--c-amber)" }}>{inst.courses.length}</span> курсов</span>
                          <span><span style={{ color: "var(--c-amber)" }}>{totalStudents}</span> студентов</span>
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
        <section style={{ background: "var(--c-red)", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", top: "-40%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "rgba(0,0,0,0.15)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 24px", display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start", position: "relative" }}>
            <div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)" }}>Начать учиться</h2>
              <p style={{ color: "rgba(240,230,216,0.7)", marginTop: 8, fontFamily: "var(--font-sans)" }}>
                Три бесплатных курса доступны без регистрации.
              </p>
            </div>
            <Link href="/courses" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 32px", background: "var(--c-bg)", color: "var(--c-t1)", fontWeight: 900, fontFamily: "var(--font-display)", textDecoration: "none" }}>
              Все курсы <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
