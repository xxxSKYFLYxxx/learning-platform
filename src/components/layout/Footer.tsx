import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t-2 border-[#0F0F0F] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-0 select-none mb-4">
              <span
                className="inline-block px-2 py-0.5 text-[#FAFAF7] text-base font-black border-2 border-[#0F0F0F] bg-[#0F0F0F]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                К
              </span>
              <span
                className="inline-block px-1.5 py-0.5 text-[#0F0F0F] text-base font-black border-2 border-l-0 border-[#0F0F0F]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                УРС
              </span>
            </div>
            <p className="text-sm text-[#787068] max-w-xs leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
              Практические курсы для тех, кто хочет работать в IT.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10">
            <div>
              <h4
                className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0F0F0F] mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Обучение
              </h4>
              <ul className="space-y-2 text-sm text-[#787068]" style={{ fontFamily: "var(--font-sans)" }}>
                <li><Link href="/courses" className="hover:text-[#0F0F0F] transition-colors">Все курсы</Link></li>
                <li><Link href="/courses?level=BEGINNER" className="hover:text-[#0F0F0F] transition-colors">Для начинающих</Link></li>
                <li><Link href="/courses?isFree=true" className="hover:text-[#0F0F0F] transition-colors">Бесплатные</Link></li>
              </ul>
            </div>
            <div>
              <h4
                className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0F0F0F] mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Компания
              </h4>
              <ul className="space-y-2 text-sm text-[#787068]" style={{ fontFamily: "var(--font-sans)" }}>
                <li><Link href="/about" className="hover:text-[#0F0F0F] transition-colors">О нас</Link></li>
                <li><Link href="/contact" className="hover:text-[#0F0F0F] transition-colors">Контакты</Link></li>
                <li><Link href="/privacy" className="hover:text-[#0F0F0F] transition-colors">Политика</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-[#0F0F0F] mt-10 pt-5 flex items-center justify-between">
          <span className="text-xs text-[#787068]" style={{ fontFamily: "var(--font-mono)" }}>
            © {new Date().getFullYear()} КУРС
          </span>
          <span className="text-xs text-[#787068]" style={{ fontFamily: "var(--font-mono)" }}>
            v1.0.0
          </span>
        </div>
      </div>
    </footer>
  );
}
