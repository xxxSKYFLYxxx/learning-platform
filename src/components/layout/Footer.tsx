import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ background: "#0A0807", borderTop: "1px solid #1F1C1A" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="inline-flex items-center select-none mb-5">
              <span
                className="inline-block font-black tracking-tight px-2 py-0.5 text-base"
                style={{ fontFamily: "var(--font-display)", background: "#E8351D", color: "#F0EBE3" }}
              >
                К
              </span>
              <span
                className="inline-block font-black tracking-tight px-1.5 py-0.5 text-base border border-l-0"
                style={{ fontFamily: "var(--font-display)", borderColor: "#3A3530", color: "#F0EBE3" }}
              >
                УРС
              </span>
            </Link>
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-sans)", color: "#6E675E" }}
            >
              Практические курсы для тех, кто хочет работать в IT. Только живые проекты.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <h4
                className="text-[10px] font-black uppercase tracking-[0.2em] mb-4"
                style={{ fontFamily: "var(--font-display)", color: "#F0EBE3" }}
              >
                Обучение
              </h4>
              <ul className="space-y-2.5">
                {[
                  { href: "/courses", label: "Все курсы" },
                  { href: "/courses?level=BEGINNER", label: "Для начинающих" },
                  { href: "/courses?isFree=true", label: "Бесплатные" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm transition-colors hover:text-[#F0EBE3]"
                      style={{ fontFamily: "var(--font-sans)", color: "#6E675E" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                className="text-[10px] font-black uppercase tracking-[0.2em] mb-4"
                style={{ fontFamily: "var(--font-display)", color: "#F0EBE3" }}
              >
                Компания
              </h4>
              <ul className="space-y-2.5">
                {[
                  { href: "/about", label: "О нас" },
                  { href: "/contact", label: "Контакты" },
                  { href: "/privacy", label: "Политика" },
                  { href: "/offer", label: "Оферта" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm transition-colors hover:text-[#F0EBE3]"
                      style={{ fontFamily: "var(--font-sans)", color: "#6E675E" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-12 pt-6 flex items-center justify-between"
          style={{ borderTop: "1px solid #1F1C1A" }}
        >
          <span
            className="text-xs"
            style={{ fontFamily: "var(--font-mono)", color: "#3A3530" }}
          >
            &copy; {new Date().getFullYear()} КУРС. Все права защищены.
          </span>
          <span
            className="text-xs"
            style={{ fontFamily: "var(--font-mono)", color: "#3A3530" }}
          >
            v1.0.0
          </span>
        </div>
      </div>
    </footer>
  );
}
