import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-secondary" />
              <span className="font-display text-lg font-bold">Платформа</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Онлайн-курсы от практикующих специалистов. Учитесь в своём темпе.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-secondary mb-3">Обучение</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/courses" className="hover:text-white transition-colors">Все курсы</Link></li>
              <li><Link href="/courses?level=BEGINNER" className="hover:text-white transition-colors">Для начинающих</Link></li>
              <li><Link href="/courses?isFree=true" className="hover:text-white transition-colors">Бесплатные</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-secondary mb-3">Компания</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/about" className="hover:text-white transition-colors">О нас</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Контакты</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Политика</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Платформа. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
