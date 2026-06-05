import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Star, Award, Clock, Users, Zap, Shield, Code2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/course/CourseCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "КУРС — Онлайн-обучение программированию на русском",
  description: "Практические курсы по программированию на русском языке. JavaScript, React, TypeScript, Python, Node.js. Реальные проекты, сертификаты, живые преподаватели.",
};

async function getData() {
  const [courses, courseCount, enrollmentCount, totalLessons, instructors, reviews, reviewCount] = await Promise.all([
    prisma.course.findMany({
      where: { published: true }, take: 6,
      orderBy: { enrollments: { _count: "desc" } },
      include: {
        instructor: { select: { id: true, name: true, image: true } },
        _count: { select: { enrollments: true, reviews: true } },
        reviews: { select: { rating: true } },
      },
    }),
    prisma.course.count({ where: { published: true } }),
    prisma.enrollment.count(),
    prisma.lesson.count(),
    prisma.user.findMany({
      where: { role: "INSTRUCTOR" },
      include: {
        courses: { where: { published: true }, select: { id: true, _count: { select: { enrollments: true } } } },
        _count: { select: { courses: true } },
      },
    }),
    prisma.review.findMany({
      where: { rating: { gte: 4 } }, take: 6,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, image: true } }, course: { select: { title: true } } },
    }),
    prisma.review.count(),
  ]);

  return {
    courses: courses.map(c => ({ ...c, price: c.price ? Number(c.price) : null, avgRating: c.reviews.length > 0 ? c.reviews.reduce((a, r) => a + r.rating, 0) / c.reviews.length : undefined })),
    courseCount, enrollmentCount, totalLessons, instructors, reviews, reviewCount,
  };
}

const T = {
  bg:    "var(--c-bg)",
  s1:    "var(--c-s1)",
  s2:    "var(--c-s2)",
  b:     "var(--c-border)",
  bhi:   "var(--c-border-hi)",
  t1:    "var(--c-t1)",
  t2:    "var(--c-t2)",
  t3:    "var(--c-t3)",
  t4:    "var(--c-t4)",
  red:   "var(--c-red)",
  amb:   "var(--c-amber)",
  grn:   "var(--c-green)",
  rlo:   "var(--c-red-lo)",
  rmid:  "var(--c-red-mid)",
};

const TECHS = ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "PostgreSQL", "Git", "Docker", "GraphQL", "REST API", "CSS / Tailwind"];

const FEATURES = [
  { icon: Code2,     title: "Только практика",      desc: "Каждый курс строится вокруг реального проекта. Вы пишете код с первого урока, а не смотрите слайды." },
  { icon: Zap,       title: "Без воды",              desc: "Средняя длина урока — 12 минут. Убираем всё лишнее: только то, что нужно для работы." },
  { icon: Award,     title: "Сертификат",            desc: "По окончании курса выдаём PDF-сертификат с уникальным кодом верификации и QR-ссылкой." },
  { icon: Clock,     title: "Пожизненный доступ",    desc: "Оплачиваете один раз и получаете доступ навсегда, включая все будущие обновления курса." },
  { icon: Users,     title: "Живые преподаватели",   desc: "Все курсы записаны практикующими разработчиками с реальным опытом в коммерческих проектах." },
  { icon: Shield,    title: "Возврат за 14 дней",    desc: "Если курс не подошёл — вернём деньги без вопросов в течение 14 дней после покупки." },
];

const TRACKS = [
  { title: "Frontend разработчик", steps: ["HTML + CSS основы", "JavaScript ES6+", "React + TypeScript", "Next.js полный курс"], color: T.red },
  { title: "Backend разработчик",  steps: ["Python или Node.js", "Базы данных + SQL", "REST API + Express", "Деплой и CI/CD"],    color: T.amb },
  { title: "Fullstack разработчик", steps: ["Frontend основы",  "React + TypeScript", "Node.js + PostgreSQL", "Next.js full-stack"], color: T.grn },
];

const WHO = [
  { icon: "→", who: "Начинающим",     desc: "Хочу войти в IT с нуля и получить первую работу разработчиком в течение года." },
  { icon: "→", who: "Переключателям", desc: "Работаю в другой сфере, хочу переквалифицироваться и зарабатывать больше." },
  { icon: "→", who: "Практикам",      desc: "Уже знаю основы, хочу закрыть пробелы и научиться делать реальные проекты." },
];

const COMPARE = [
  { param: "Язык обучения",        kurs: "Русский",             other: "Английский" },
  { param: "Формат",               kurs: "Реальные проекты",    other: "Упражнения и тесты" },
  { param: "Преподаватели",        kurs: "Практикующие разр.",  other: "Академические лекторы" },
  { param: "Цена",                 kurs: "от 0 ₽",              other: "от 2 000 ₽/мес" },
  { param: "Доступ",               kurs: "Пожизненно",          other: "Пока платите подписку" },
  { param: "Сертификат",           kurs: "Да, с верификацией",  other: "Платно или нет" },
];

// Divider line
function Div({ style }: { style?: React.CSSProperties }) {
  return <div style={{ height: 1, background: T.b, ...style }} />;
}

// Section label
function Label({ children }: { children: string }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.28em", textTransform: "uppercase", color: T.t3, fontFamily: "var(--font-mono)", marginBottom: 12 }}>
      {children}
    </p>
  );
}

// Section heading
function H2({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, lineHeight: 1.1, color: T.t1, fontFamily: "var(--font-display)", margin: 0, ...style }}>
      {children}
    </h2>
  );
}

export default async function HomePage() {
  const { courses, courseCount, enrollmentCount, totalLessons, instructors, reviews, reviewCount } = await getData();

  return (
    <div className="grain" style={{ background: T.bg }}>
      <Header />
      <main>

        {/* ━━━━━━━━━━━━━━━━━━━━ HERO ━━━━━━━━━━━━━━━━━━━━ */}
        <section style={{ position: "relative", overflow: "hidden", paddingBottom: 0 }}>
          {/* Grid bg */}
          <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${T.b}55 1px,transparent 1px),linear-gradient(90deg,${T.b}55 1px,transparent 1px)`, backgroundSize: "72px 72px", pointerEvents: "none" }} />
          {/* Red bloom */}
          <div aria-hidden style={{ position: "absolute", top: "-15%", right: "-5%", width: 560, height: 560, borderRadius: "50%", background: `radial-gradient(circle,${T.rmid} 0%,transparent 70%)`, pointerEvents: "none" }} />

          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px 0", position: "relative" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 64, alignItems: "start" }}>

              {/* Left */}
              <div>
                {/* Eyebrow */}
                <div className="hero-fade" style={{ animationDelay: "0.05s", marginBottom: 36 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: T.rlo, border: `1px solid ${T.rmid}`, fontSize: 11, fontWeight: 900, letterSpacing: "0.1em", fontFamily: "var(--font-mono)", color: T.red }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.red, display: "inline-block" }} />
                    НОВЫЙ КУРС: NEXT.JS ПОЛНЫЙ КУРС
                  </span>
                </div>

                {/* Headline */}
                <div style={{ marginBottom: 36 }}>
                  {[
                    { text: "УЧИСЬ.", color: T.t1, delay: "0.1s" },
                    { text: "СОЗДАВАЙ.", color: T.red, delay: "0.22s", glow: true },
                    { text: "РАСТИ.", color: T.t4, delay: "0.34s" },
                  ].map(({ text, color, delay, glow }) => (
                    <div key={text} className="hero-word" style={{ animationDelay: delay }}>
                      <span style={{
                        display: "block",
                        fontSize: "clamp(72px, 10vw, 108px)",
                        fontWeight: 900, lineHeight: 0.88,
                        letterSpacing: "-0.03em",
                        fontFamily: "var(--font-display)",
                        color,
                        textShadow: glow ? "0 0 60px var(--c-red-glow), 0 0 120px var(--c-red-lo)" : "none",
                      }}>
                        {text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Sub + CTA */}
                <div className="hero-fade" style={{ animationDelay: "0.55s", display: "flex", flexDirection: "column", gap: 24 }}>
                  <p style={{ fontSize: 16, lineHeight: 1.65, color: T.t3, fontFamily: "var(--font-sans)", maxWidth: 380, margin: 0 }}>
                    Практические курсы от разработчиков с опытом в production. Учитесь на реальных задачах — не на туториалах.
                  </p>
                  <div style={{ display: "flex", gap: 12 }}>
                    <Link href="/courses" className="btn-red" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", fontSize: 14, fontWeight: 900, fontFamily: "var(--font-display)", textDecoration: "none" }}>
                      Смотреть курсы <ArrowRight size={16} />
                    </Link>
                    <Link href="/courses?isFree=true" className="btn-ghost" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", fontSize: 14, fontWeight: 900, fontFamily: "var(--font-display)", textDecoration: "none" }}>
                      Бесплатно
                    </Link>
                  </div>
                  {/* Mini social proof */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 8 }}>
                    <div style={{ display: "flex", gap: -4 }}>
                      {["А", "Д", "М", "Н"].map((l, i) => (
                        <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: `hsl(${i * 40 + 10},30%,20%)`, border: "2px solid var(--c-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: T.t2, fontFamily: "var(--font-display)", marginLeft: i > 0 ? -8 : 0 }}>
                          {l}
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 13, color: T.t3, fontFamily: "var(--font-sans)", margin: 0 }}>
                      <span style={{ color: T.t2, fontWeight: 600 }}>{enrollmentCount}+ студентов</span> уже учатся
                    </p>
                  </div>
                </div>
              </div>

              {/* Right — terminal */}
              <div className="hero-right" style={{ animationDelay: "0.3s", alignSelf: "end" }}>
                <div style={{ background: "var(--c-s1)", border: `1px solid ${T.b}`, boxShadow: `0 0 60px rgba(0,0,0,0.5)` }}>
                  {/* Terminal header */}
                  <div style={{ padding: "10px 16px", borderBottom: `1px solid ${T.b}`, display: "flex", alignItems: "center", gap: 8 }}>
                    {["#C0392B", "#E8A020", "#1D9E6E"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.8 }} />)}
                    <span style={{ fontSize: 11, color: T.t4, fontFamily: "var(--font-mono)", marginLeft: 8 }}>~/projects/my-app</span>
                  </div>
                  {/* Terminal body */}
                  <div style={{ padding: "20px 20px", fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.8 }}>
                    <div style={{ color: T.t4, fontSize: 11, marginBottom: 8, letterSpacing: "0.08em" }}>{"// день 1 после курса"}</div>
                    <div style={{ color: T.t2 }}><span style={{ color: T.red }}>const </span><span style={{ color: T.t2 }}>dev </span>= {"{"}</div>
                    <div style={{ paddingLeft: 20, color: T.t3 }}>
                      <div><span style={{ color: T.t1 }}>name</span>: <span style={{ color: T.amb }}>&quot;Алексей&quot;</span>,</div>
                      <div><span style={{ color: T.t1 }}>stack</span>: [<span style={{ color: T.amb }}>&quot;React&quot;</span>, <span style={{ color: T.amb }}>&quot;Next.js&quot;</span>],</div>
                      <div><span style={{ color: T.t1 }}>salary</span>: <span style={{ color: T.grn }}>120_000</span>,</div>
                    </div>
                    <div style={{ color: T.t2 }}>{"}"}</div>
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.b}`, display: "flex", flexDirection: "column", gap: 6 }}>
                      {[
                        { done: true, text: "записался на курс" },
                        { done: true, text: "написал TodoApp за 3 часа" },
                        { done: true, text: "получил оффер" },
                        { done: false, text: "стал Senior..." },
                      ].map(({ done, text }) => (
                        <div key={text} style={{ color: done ? T.grn : T.t4, display: "flex", gap: 8, alignItems: "center" }}>
                          <span>{done ? "✓" : "○"}</span>
                          <span style={{ fontSize: 12 }}>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Stats bar */}
          <Div style={{ marginTop: 72 }} />
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
              {[
                { val: `${courseCount}`,       lab: "Курсов",         sub: "на платформе" },
                { val: `${totalLessons}+`,     lab: "Уроков",         sub: "суммарно" },
                { val: `${enrollmentCount}+`,  lab: "Студентов",      sub: "записались" },
                { val: `${reviewCount}`,       lab: "Отзывов",        sub: "средняя 4.9★" },
              ].map(({ val, lab, sub }, i) => (
                <div key={lab} style={{ padding: "28px 32px", borderRight: i < 3 ? `1px solid ${T.b}` : "none" }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: T.t1, fontFamily: "var(--font-mono)", lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.t2, fontFamily: "var(--font-sans)", marginTop: 6 }}>{lab}</div>
                  <div style={{ fontSize: 11, color: T.t4, fontFamily: "var(--font-sans)", marginTop: 2 }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━━ MARQUEE ━━━━ */}
        <Div />
        <div style={{ background: "var(--c-s1)", overflow: "hidden", padding: "14px 0" }}>
          <div className="animate-marquee" style={{ display: "flex", gap: 10, width: "max-content" }}>
            {[...TECHS, ...TECHS].map((t, i) => (
              <span key={i} className="tag-pill" style={{ flexShrink: 0, padding: "5px 14px", fontSize: 11, fontWeight: 700, fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <Div />

        {/* ━━━━ ДЛЯ КОГО ━━━━ */}
        <section style={{ padding: "80px 0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 64, alignItems: "start" }}>
              <div>
                <Label>Аудитория</Label>
                <H2>Для кого<br />эти курсы</H2>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: T.t3, fontFamily: "var(--font-sans)", marginTop: 16 }}>
                  Неважно, знаете ли вы уже программирование или начинаете с нуля — у нас есть курс для вашего уровня.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {WHO.map((w) => (
                  <div key={w.who} className="feature-card" style={{ padding: "24px", borderRadius: 0 }}>
                    <div style={{ fontSize: 20, marginBottom: 12, color: T.red }}>{w.icon}</div>
                    <h3 style={{ fontSize: 15, fontWeight: 900, color: T.t1, fontFamily: "var(--font-display)", marginBottom: 10 }}>{w.who}</h3>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: T.t3, fontFamily: "var(--font-sans)", margin: 0 }}>{w.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Div />

        {/* ━━━━ FEATURES ━━━━ */}
        <section style={{ padding: "80px 0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
              <div>
                <Label>Преимущества</Label>
                <H2>Почему выбирают КУРС</H2>
              </div>
              <Link href="/about" className="link-muted" style={{ fontSize: 13, fontFamily: "var(--font-display)", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                Подробнее о нас <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: T.b }}>
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="feature-card" style={{ padding: "32px 28px" }}>
                  <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: T.rlo, marginBottom: 18 }}>
                    <Icon size={18} style={{ color: T.red }} />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: T.t1, fontFamily: "var(--font-display)", marginBottom: 10 }}>{title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: T.t3, fontFamily: "var(--font-sans)", margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Div />

        {/* ━━━━ COURSES ━━━━ */}
        <section style={{ padding: "80px 0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
              <div>
                <Label>Программы</Label>
                <H2>Популярные курсы</H2>
              </div>
              <Link href="/courses" className="link-muted" style={{ fontSize: 13, fontFamily: "var(--font-display)", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                Все {courseCount} курсов <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {courses.map(c => <CourseCard key={c.id} course={c} />)}
            </div>
          </div>
        </section>

        <Div />

        {/* ━━━━ ТРЕКИ ━━━━ */}
        <section style={{ padding: "80px 0", background: "var(--c-s1)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ marginBottom: 48 }}>
              <Label>Роадмапы</Label>
              <H2>Треки обучения</H2>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: T.t3, fontFamily: "var(--font-sans)", marginTop: 12, maxWidth: 540 }}>
                Выберите направление — и мы покажем, какие курсы пройти в правильном порядке, чтобы быстрее попасть на работу.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {TRACKS.map(({ title, steps, color }) => (
                <div key={title} style={{ background: T.bg, border: `1px solid ${T.b}`, padding: "28px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, marginBottom: 16 }} />
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: T.t1, fontFamily: "var(--font-display)", marginBottom: 24 }}>{title}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {steps.map((step, i) => (
                      <div key={step} style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingBottom: i < steps.length - 1 ? 18 : 0, position: "relative" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: 2 }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, color, fontFamily: "var(--font-mono)" }}>{i + 1}</div>
                          {i < steps.length - 1 && <div style={{ width: 1, flex: 1, background: T.b, marginTop: 4, minHeight: 20 }} />}
                        </div>
                        <div style={{ paddingBottom: i < steps.length - 1 ? 16 : 0 }}>
                          <span style={{ fontSize: 13, color: T.t2, fontFamily: "var(--font-sans)" }}>{step}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/courses" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 24, fontSize: 12, fontWeight: 900, color, textDecoration: "none", fontFamily: "var(--font-display)" }}>
                    Начать трек <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Div />

        {/* ━━━━ СРАВНЕНИЕ ━━━━ */}
        <section style={{ padding: "80px 0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
              <div>
                <Label>Сравнение</Label>
                <H2>КУРС vs<br />другие платформы</H2>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: T.t3, fontFamily: "var(--font-sans)", marginTop: 16, marginBottom: 32 }}>
                  Мы не пытаемся конкурировать с Coursera или Udemy. Мы делаем другое: короткие, практические, русскоязычные курсы для разработчиков, которым важен результат, а не сертификат ради сертификата.
                </p>
                <Link href="/courses" className="btn-red" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", fontSize: 14, fontWeight: 900, fontFamily: "var(--font-display)", textDecoration: "none" }}>
                  Попробовать бесплатно <ArrowRight size={15} />
                </Link>
              </div>
              <div>
                <div style={{ border: `1px solid ${T.b}` }}>
                  {/* Header */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: T.s2 }}>
                    <div style={{ padding: "12px 16px", fontSize: 11, color: T.t4, fontFamily: "var(--font-mono)", fontWeight: 700 }}>ПАРАМЕТР</div>
                    <div style={{ padding: "12px 16px", fontSize: 11, color: T.red, fontFamily: "var(--font-mono)", fontWeight: 900, borderLeft: `1px solid ${T.b}` }}>КУРС</div>
                    <div style={{ padding: "12px 16px", fontSize: 11, color: T.t4, fontFamily: "var(--font-mono)", fontWeight: 700, borderLeft: `1px solid ${T.b}` }}>ДРУГИЕ</div>
                  </div>
                  <Div />
                  {COMPARE.map(({ param, kurs, other }, i) => (
                    <div key={param} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: i < COMPARE.length - 1 ? `1px solid ${T.b}` : "none" }}>
                      <div style={{ padding: "13px 16px", fontSize: 12, color: T.t3, fontFamily: "var(--font-sans)" }}>{param}</div>
                      <div style={{ padding: "13px 16px", fontSize: 12, color: T.t1, fontFamily: "var(--font-sans)", fontWeight: 600, borderLeft: `1px solid ${T.b}`, background: T.rlo, display: "flex", alignItems: "center", gap: 6 }}>
                        <CheckCircle size={12} style={{ color: T.red, flexShrink: 0 }} /> {kurs}
                      </div>
                      <div style={{ padding: "13px 16px", fontSize: 12, color: T.t4, fontFamily: "var(--font-sans)", borderLeft: `1px solid ${T.b}` }}>{other}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Div />

        {/* ━━━━ INSTRUCTORS ━━━━ */}
        <section style={{ padding: "80px 0", background: "var(--c-s1)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ marginBottom: 40 }}>
              <Label>Команда</Label>
              <H2>Преподаватели</H2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {instructors.map((inst) => {
                const students = inst.courses.reduce((a, c) => a + c._count.enrollments, 0);
                return (
                  <div key={inst.id} style={{ background: T.bg, border: `1px solid ${T.b}`, padding: "28px", display: "flex", gap: 20 }}>
                    {inst.image ? (
                      <Image src={inst.image} alt={inst.name ?? ""} width={72} height={72} unoptimized style={{ borderRadius: "50%", objectFit: "cover", border: `1px solid ${T.b}`, flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 72, height: 72, borderRadius: "50%", background: T.s2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: T.t2, fontFamily: "var(--font-display)", flexShrink: 0 }}>
                        {(inst.name ?? "?")[0]}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 900, color: T.t1, fontFamily: "var(--font-display)", marginBottom: 4 }}>{inst.name}</h3>
                      <p style={{ fontSize: 12, color: T.t3, fontFamily: "var(--font-mono)", marginBottom: 16 }}>Senior Developer · Преподаватель КУРС</p>
                      <div style={{ display: "flex", gap: 20, fontSize: 12, fontFamily: "var(--font-mono)", color: T.t3 }}>
                        <span><span style={{ color: T.amb }}>{inst._count.courses}</span> курсов</span>
                        <span><span style={{ color: T.amb }}>{students}</span> студентов</span>
                        <span style={{ color: T.amb }}>★ 4.9</span>
                      </div>
                      <Div style={{ margin: "16px 0" }} />
                      <p style={{ fontSize: 13, lineHeight: 1.6, color: T.t3, fontFamily: "var(--font-sans)", margin: 0 }}>
                        Практикующий разработчик с опытом в коммерческих проектах. Преподаёт конкретные навыки, применимые в реальной работе.
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <Div />

        {/* ━━━━ REVIEWS ━━━━ */}
        <section style={{ padding: "80px 0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
              <div>
                <Label>Отзывы</Label>
                <H2>Что говорят студенты</H2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 2 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} style={{ color: T.amb, fill: T.amb }} />)}
                </div>
                <span style={{ fontSize: 13, color: T.t3, fontFamily: "var(--font-mono)" }}>4.9 / 5 &nbsp;·&nbsp; {reviewCount} отзывов</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {reviews.map((r) => (
                <div key={r.id} style={{ background: T.s1, border: `1px solid ${T.b}`, padding: "24px", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                    {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= r.rating ? T.amb : T.b, fontSize: 13 }}>★</span>)}
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: T.t2, fontFamily: "var(--font-sans)", margin: "0 0 20px", flex: 1 }}>
                    &laquo;{r.text}&raquo;
                  </p>
                  <Div style={{ marginBottom: 16 }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {r.user.image ? (
                      <Image src={r.user.image} alt={r.user.name ?? ""} width={32} height={32} unoptimized style={{ borderRadius: "50%", objectFit: "cover", border: `1px solid ${T.b}` }} />
                    ) : (
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.s2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: T.t2, fontFamily: "var(--font-display)" }}>
                        {(r.user.name ?? "?")[0]}
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.t1, fontFamily: "var(--font-sans)" }}>{r.user.name}</div>
                      <div style={{ fontSize: 11, color: T.t4, fontFamily: "var(--font-mono)" }}>{r.course.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Div />

        {/* ━━━━ CTA ━━━━ */}
        <section style={{ background: "var(--c-red)", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", top: "-40%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "rgba(0,0,0,0.15)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 24px", display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "center", position: "relative" }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.2em", color: "rgba(240,230,216,0.6)", fontFamily: "var(--font-mono)", marginBottom: 12 }}>СТАРТ БЕЗ РИСКОВ</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, color: T.t1, fontFamily: "var(--font-display)", lineHeight: 1.1, marginBottom: 16 }}>
                Три курса<br />бесплатно — прямо сейчас
              </h2>
              <p style={{ fontSize: 15, color: "rgba(240,230,216,0.7)", fontFamily: "var(--font-sans)", marginBottom: 24 }}>
                JavaScript, Python, Git — доступны без регистрации. Платите только если понравится.
              </p>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {["JavaScript", "Python", "Git"].map(tag => (
                  <span key={tag} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(240,230,216,0.8)", fontFamily: "var(--font-mono)" }}>
                    <CheckCircle size={14} style={{ color: "rgba(240,230,216,0.9)" }} /> {tag}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
              <Link href="/courses?isFree=true" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 32px", background: T.bg, color: T.t1, fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 15, textDecoration: "none", transition: "opacity 0.2s" }}>
                Начать бесплатно <ArrowRight size={18} />
              </Link>
              <Link href="/courses" style={{ fontSize: 13, color: "rgba(240,230,216,0.65)", textAlign: "center", textDecoration: "underline", fontFamily: "var(--font-sans)" }}>
                Посмотреть все курсы
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
