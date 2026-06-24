import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Публичная оферта",
  description: "Публичная оферта на оказание образовательных услуг платформы КУРС.",
  alternates: { canonical: `${process.env.AUTH_URL ?? "http://localhost:3002"}/offer` },
  robots: { index: false },
};

const LAST_UPDATED = "1 июня 2026 г.";

const SECTIONS = [
  {
    id: "general",
    title: "1. Общие положения",
    body: `Настоящий документ является публичной офертой (предложением) заключить Договор об оказании образовательных услуг на указанных ниже условиях. Акцептом оферты является факт оплаты доступа к курсу или регистрация на бесплатный курс.`,
  },
  {
    id: "definitions",
    title: "2. Определения",
    body: `Платформа — веб-сайт КУРС и связанные сервисы.
Курс — учебная программа, размещённая на Платформе, состоящая из видеоуроков, материалов и заданий.
Пользователь — физическое лицо, прошедшее регистрацию на Платформе.
Доступ — право просматривать материалы конкретного Курса.`,
  },
  {
    id: "subject",
    title: "3. Предмет договора",
    body: `Платформа предоставляет Пользователю доступ к учебным материалам выбранного Курса в электронном виде через интернет. Доступ предоставляется бессрочно с момента успешной оплаты или бесплатной регистрации.`,
  },
  {
    id: "payment",
    title: "4. Стоимость и порядок оплаты",
    body: `Стоимость платных Курсов указана на страницах Курсов в рублях, включая НДС (если применимо). Оплата производится через платёжный сервис ЮКасса. Доступ активируется автоматически после подтверждения платежа от ЮКасса.`,
  },
  {
    id: "refund",
    title: "5. Возврат средств",
    body: `Возврат возможен в течение 14 дней с момента оплаты при условии, что Пользователь просмотрел не более 20% уроков Курса. Для оформления возврата напишите на hello@kurs.dev с темой «Возврат» и укажите email аккаунта. Средства возвращаются тем же способом, которым была произведена оплата, в течение 5-10 рабочих дней.`,
  },
  {
    id: "obligations",
    title: "6. Права и обязанности сторон",
    body: `Платформа обязуется:
— Обеспечивать доступ к материалам Курса 24/7 (за исключением периодов технического обслуживания).
— Уведомлять об обновлениях Курса.
— Выдавать Сертификат при выполнении условий Курса.

Пользователь обязуется:
— Не передавать учётные данные третьим лицам.
— Не копировать, не распространять и не продавать материалы Курса.
— Соблюдать настоящую Оферту и Политику конфиденциальности.`,
  },
  {
    id: "ip",
    title: "7. Интеллектуальная собственность",
    body: `Все материалы Курсов — видео, тексты, код, изображения — являются исключительной собственностью Платформы или её лицензиаров. Доступ к Курсу не передаёт Пользователю права интеллектуальной собственности на эти материалы.`,
  },
  {
    id: "liability",
    title: "8. Ограничение ответственности",
    body: `Платформа не несёт ответственности за:
— Временную недоступность сервиса по причинам, не зависящим от Платформы (форс-мажор, сбои интернет-провайдера).
— Результаты трудоустройства Пользователя после обучения.
— Устаревание технологий, описанных в Курсах.

Максимальная ответственность Платформы ограничена суммой, уплаченной за Курс.`,
  },
  {
    id: "law",
    title: "9. Применимое право",
    body: `Настоящая Оферта регулируется законодательством Российской Федерации. Споры разрешаются в судебном порядке по месту нахождения Платформы.

Дата последнего обновления: ${LAST_UPDATED}

По всем вопросам: hello@kurs.dev`,
  },
];

export default function OfferPage() {
  return (
    <div className="grain" style={{ background: "var(--c-bg)", minHeight: "100vh" }}>
      <style>{`
        @media (max-width: 768px) {
          .offer-layout { flex-direction: column !important; gap: 32px !important; }
          .offer-toc { position: static !important; width: 100% !important; flex-shrink: 0 !important; }
          .offer-content { padding-left: 0 !important; }
        }
        .offer-toc a:hover { color: var(--c-red); }
      `}</style>
      <Header />
      <main>
        {/* Hero */}
        <section style={{ borderBottom: "1px solid var(--c-border)", background: "var(--c-s1)", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, var(--c-red), var(--c-amber), var(--c-red))" }} />
          <div aria-hidden style={{ position: "absolute", top: "-30%", right: "-10%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,var(--c-red-lo) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 896, margin: "0 auto", padding: "72px 24px", position: "relative" }}>
            <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--c-t3)", fontFamily: "var(--font-mono)", marginBottom: 14 }}>
              Документы
            </p>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)", lineHeight: 1.1, marginBottom: 16 }}>
              Публичная<br />оферта
            </h1>
            <p style={{ fontSize: 14, color: "var(--c-t3)", fontFamily: "var(--font-sans)", marginTop: 16, lineHeight: 1.6 }}>
              Условия оказания образовательных услуг на платформе КУРС. Последнее обновление: <span style={{ color: "var(--c-t2)", fontWeight: 600 }}>{LAST_UPDATED}</span>
            </p>
          </div>
        </section>

        {/* Content with TOC */}
        <section style={{ maxWidth: 896, margin: "0 auto", padding: "64px 24px" }}>
          <div className="offer-layout" style={{ display: "flex", gap: 48 }}>
            {/* Table of Contents */}
            <nav className="offer-toc" style={{ width: 220, flexShrink: 0, position: "sticky", top: 80, alignSelf: "flex-start" }}>
              <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--c-t3)", fontFamily: "var(--font-mono)", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--c-border)" }}>
                Содержание
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} style={{ fontSize: 13, color: "var(--c-t3)", fontFamily: "var(--font-sans)", textDecoration: "none", lineHeight: 1.5, display: "block", transition: "color 0.15s" }}>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Section Content */}
            <div className="offer-content" style={{ flex: 1, borderLeft: "2px solid var(--c-border)", paddingLeft: 32, display: "flex", flexDirection: "column", gap: 32 }}>
              {SECTIONS.map((s) => (
                <div key={s.id} id={s.id} style={{ scrollMarginTop: 80 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 900, color: "var(--c-t1)", marginBottom: 12, fontFamily: "var(--font-display)" }}>
                    {s.title}
                  </h2>
                  <div style={{ fontSize: 14, color: "var(--c-t2)", lineHeight: 1.7, whiteSpace: "pre-line", fontFamily: "var(--font-sans)" }}>
                    {s.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}