import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Политика конфиденциальности платформы КУРС — как мы собираем, используем и защищаем ваши персональные данные.",
  alternates: { canonical: `${process.env.AUTH_URL ?? "http://localhost:3002"}/privacy` },
  robots: { index: false },
};

const LAST_UPDATED = "1 июня 2026 г.";

const SECTIONS = [
  {
    id: "general",
    title: "1. Общие положения",
    body: `Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей платформы КУРС (далее — Платформа). Используя Платформу, вы соглашаетесь с условиями настоящей Политики. Политика разработана в соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных".`,
  },
  {
    id: "data",
    title: "2. Собираемые данные",
    body: `Платформа собирает следующие данные:

— Регистрационные данные: имя, адрес электронной почты, фотография профиля (при входе через ВКонтакте или Яндекс ID).
— Данные об активности: просмотренные уроки, прогресс по курсам, время просмотра видео.
— Платёжные данные: обрабатываются исключительно платёжным оператором ЮКасса; Платформа не хранит реквизиты карт.
— Технические данные: IP-адрес, тип браузера, операционная система — собираются Яндекс Метрикой в обезличенном виде.`,
  },
  {
    id: "purposes",
    title: "3. Цели обработки данных",
    body: `Данные используются для:

— Идентификации пользователя и предоставления доступа к приобретённым курсам.
— Отслеживания прогресса обучения и выдачи сертификатов.
— Обработки платежей и возвратов.
— Направления уведомлений об обновлениях курсов и платёжных операциях.
— Улучшения работы Платформы на основе обезличенной статистики.`,
  },
  {
    id: "thirdparties",
    title: "4. Передача данных третьим лицам",
    body: `Платформа не продаёт персональные данные. Передача происходит только:

— Платёжному оператору ЮКасса — для проведения транзакций.
— Сервису Яндекс Метрика — обезличенные данные для аналитики.
— Kinescope — идентификатор пользователя для защиты видеоконтента.

Все третьи лица работают на территории Российской Федерации и соблюдают требования 152-ФЗ.`,
  },
  {
    id: "storage",
    title: "5. Хранение данных",
    body: `Данные хранятся на серверах в Российской Федерации. Срок хранения — в течение действия аккаунта и 3 лет после его удаления (в соответствии с требованиями законодательства). Резервные копии шифруются и недоступны третьим лицам.`,
  },
  {
    id: "rights",
    title: "6. Права пользователя",
    body: `Вы вправе:

— Запросить копию ваших персональных данных.
— Потребовать исправления неточных данных.
— Потребовать удаления аккаунта и данных (за исключением данных, хранение которых обязательно по закону).
— Отозвать согласие на обработку маркетинговых рассылок.

Для реализации прав обратитесь на hello@kurs.dev.`,
  },
  {
    id: "cookies",
    title: "7. Cookies",
    body: `Платформа использует cookies для поддержания сессии авторизации и сбора обезличенной аналитики. Вы можете отключить cookies в настройках браузера, однако это может нарушить работу авторизации.`,
  },
  {
    id: "changes",
    title: "8. Изменения Политики",
    body: `Платформа вправе изменять настоящую Политику. Об изменениях пользователи уведомляются по электронной почте за 10 дней до вступления в силу. Продолжение использования Платформы означает согласие с изменёнными условиями.`,
  },
  {
    id: "contacts",
    title: "9. Контакты",
    body: `По вопросам обработки персональных данных: hello@kurs.dev

Дата последнего обновления: ${LAST_UPDATED}`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="grain" style={{ background: "var(--c-bg)", minHeight: "100vh" }}>
      <style>{`
        @media (max-width: 768px) {
          .privacy-layout { flex-direction: column !important; gap: 32px !important; }
          .privacy-toc { position: static !important; width: 100% !important; flex-shrink: 0 !important; }
          .privacy-content { padding-left: 0 !important; }
        }
        .privacy-toc a:hover { color: var(--c-red); }
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
              Политика<br />конфиденциальности
            </h1>
            <p style={{ fontSize: 14, color: "var(--c-t3)", fontFamily: "var(--font-sans)", marginTop: 16, lineHeight: 1.6 }}>
              Как мы собираем, используем и защищаем ваши персональные данные. Последнее обновление: <span style={{ color: "var(--c-t2)", fontWeight: 600 }}>{LAST_UPDATED}</span>
            </p>
          </div>
        </section>

        {/* Content with TOC */}
        <section style={{ maxWidth: 896, margin: "0 auto", padding: "64px 24px" }}>
          <div className="privacy-layout" style={{ display: "flex", gap: 48 }}>
            {/* Table of Contents */}
            <nav className="privacy-toc" style={{ width: 220, flexShrink: 0, position: "sticky", top: 80, alignSelf: "flex-start" }}>
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
            <div className="privacy-content" style={{ flex: 1, borderLeft: "2px solid var(--c-border)", paddingLeft: 32, display: "flex", flexDirection: "column", gap: 32 }}>
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
