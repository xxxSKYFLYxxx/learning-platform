import Link from "next/link";

const COLS = [
  {
    title: "Обучение",
    links: [
      { href: "/courses", label: "Все курсы" },
      { href: "/courses?level=BEGINNER", label: "Для начинающих" },
      { href: "/courses?level=INTERMEDIATE", label: "Средний уровень" },
      { href: "/courses?isFree=true", label: "Бесплатные курсы" },
    ],
  },
  {
    title: "Компания",
    links: [
      { href: "/about", label: "О платформе" },
      { href: "/contact", label: "Контакты" },
      { href: "/privacy", label: "Конфиденциальность" },
      { href: "/offer", label: "Публичная оферта" },
    ],
  },
];

export function Footer() {
  return (
    <footer style={{ background: "var(--c-s1)", borderTop: "1px solid var(--c-border)" }}>
      {/* Main */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px 40px", display: "grid", gridTemplateColumns: "1fr", gap: 48 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48 }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", marginBottom: 16 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 16, padding: "3px 8px", background: "var(--c-red)", color: "var(--c-t1)" }}>К</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 16, padding: "3px 7px", border: "1px solid var(--c-border-hi)", borderLeft: "none", color: "var(--c-t1)" }}>УРС</span>
            </Link>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--c-t3)", fontFamily: "var(--font-sans)", maxWidth: 280, marginBottom: 24 }}>
              Практические курсы по программированию на русском языке. Только реальные проекты и живые преподаватели.
            </p>
            <p style={{ fontSize: 11, color: "var(--c-t4)", fontFamily: "var(--font-mono)" }}>
              hello@kurs.dev
            </p>
          </div>

          {/* Links */}
          {COLS.map((col) => (
            <div key={col.title}>
              <h4 style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--c-t1)", fontFamily: "var(--font-display)", marginBottom: 16 }}>
                {col.title}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-cream" style={{ fontSize: 13, fontFamily: "var(--font-sans)", textDecoration: "none" }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid var(--c-border)", paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "var(--c-t4)", fontFamily: "var(--font-mono)" }}>
            &copy; {new Date().getFullYear()} КУРС — Все права защищены
          </span>
          <span style={{ fontSize: 11, color: "var(--c-t4)", fontFamily: "var(--font-mono)" }}>v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
