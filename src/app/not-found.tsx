import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="grain" style={{ background: "var(--c-bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: 16, position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,var(--c-red-lo) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ textAlign: "center", position: "relative" }}>
          <div style={{ fontSize: "clamp(120px, 22vw, 200px)", fontWeight: 900, lineHeight: 1, color: "var(--c-t1)", fontFamily: "var(--font-display)", userSelect: "none", textShadow: "0 0 80px var(--c-red-glow)" }}>
            404
          </div>
          <div style={{ display: "inline-block", marginTop: -8, marginBottom: 32, padding: "10px 24px", background: "var(--c-red)", color: "var(--c-t1)" }}>
            <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: "0.18em", fontFamily: "var(--font-mono)" }}>
              СТРАНИЦА НЕ НАЙДЕНА
            </span>
          </div>
          <p style={{ color: "var(--c-t3)", fontSize: 16, maxWidth: 380, margin: "0 auto 32px", fontFamily: "var(--font-sans)", lineHeight: 1.6 }}>
            Страница удалена, перемещена или никогда не существовала. Зато курсы точно существуют.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" className="btn-red" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 26px", fontSize: 14, fontWeight: 900, fontFamily: "var(--font-display)", textDecoration: "none" }}>
              На главную
            </Link>
            <Link href="/courses" className="btn-ghost" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", fontSize: 14, fontWeight: 900, fontFamily: "var(--font-display)", textDecoration: "none" }}>
              Курсы <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
