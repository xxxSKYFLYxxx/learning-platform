import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <div
            className="text-[20vw] sm:text-[160px] font-black leading-none text-[#0F0F0F] select-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            404
          </div>
          <div className="border-2 border-[#0F0F0F] bg-[#D4402F] text-[#FAFAF7] px-6 py-3 inline-block -mt-4 shadow-[4px_4px_0_#0F0F0F] mb-8">
            <span className="text-sm font-black tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              СТРАНИЦА НЕ НАЙДЕНА
            </span>
          </div>
          <p className="text-[#787068] text-base max-w-sm mx-auto mb-8" style={{ fontFamily: "var(--font-sans)" }}>
            Страница удалена, перемещена или никогда не существовала. Зато курсы точно существуют.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-black bg-[#0F0F0F] text-[#FAFAF7] border-2 border-[#0F0F0F] shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              style={{ fontFamily: "var(--font-display)" }}
            >
              На главную
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-black bg-transparent text-[#0F0F0F] border-2 border-[#0F0F0F] shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Курсы <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
