"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Mail, MessageSquare, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const TOPICS = ["Вопрос по курсу", "Технические проблемы", "Оплата и возврат", "Сотрудничество", "Другое"];

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--c-t2)",
  marginBottom: 8,
  fontFamily: "var(--font-mono)"
};
const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  fontSize: 14,
  fontFamily: "var(--font-sans)",
  boxSizing: "border-box"
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Произошла ошибка при отправке");
      }

      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
      setStatus("error");
    }
  }

  return (
    <div className="grain" style={{ background: "var(--c-bg)", minHeight: "100vh" }}>
      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .contact-form-fields { grid-template-columns: 1fr !important; }
          .contact-info { flex-direction: column !important; }
          .contact-submit { align-self: stretch !important; justify-content: center !important; }
        }
      `}</style>
      <Header />
      <main>
        {/* Hero */}
        <section style={{ borderBottom: "1px solid var(--c-border)", background: "var(--c-s1)", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", top: "-30%", right: "-5%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,var(--c-red-mid) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 24px", position: "relative" }}>
            <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--c-t3)", fontFamily: "var(--font-mono)", marginBottom: 14 }}>
              Связаться
            </p>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)", lineHeight: 1.05 }}>
              Контакты
            </h1>
          </div>
        </section>

        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 24px" }}>
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 64 }}>
            {/* Form */}
            <div>
              {status === "sent" ? (
                <div style={{ border: "1px solid var(--c-green)", background: "rgba(31,158,110,0.1)", padding: 48, textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 16, color: "var(--c-green)" }}>✓</div>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: "var(--c-t1)", marginBottom: 8, fontFamily: "var(--font-display)" }}>Сообщение отправлено</h2>
                  <p style={{ fontSize: 14, color: "var(--c-t3)", fontFamily: "var(--font-sans)" }}>
                    Ответим в течение одного рабочего дня.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {error && (
                    <div style={{ padding: "10px 14px", background: "rgba(208,57,42,0.1)", border: "1px solid rgba(208,57,42,0.3)", color: "var(--c-red)", fontSize: 13, fontFamily: "var(--font-sans)" }}>
                      {error}
                    </div>
                  )}

                  <div className="contact-form-fields" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div>
                      <label style={labelStyle}>Имя</label>
                      <input
                        required
                        type="text"
                        minLength={2}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input-dark"
                        style={fieldStyle}
                        placeholder="Иван Петров"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="input-dark"
                        style={fieldStyle}
                        placeholder="ivan@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Тема</label>
                    <select
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      className="input-dark"
                      style={fieldStyle}
                    >
                      {TOPICS.map((t) => <option key={t} style={{ background: "var(--c-s1)" }}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Сообщение</label>
                    <textarea
                      required
                      minLength={10}
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="input-dark"
                      style={{ ...fieldStyle, resize: "none" }}
                      placeholder="Опишите ваш вопрос..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-red contact-submit"
                    style={{
                      alignSelf: "flex-start",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "13px 32px",
                      fontWeight: 900,
                      fontSize: 14,
                      border: "none",
                      cursor: status === "sending" ? "not-allowed" : "pointer",
                      opacity: status === "sending" ? 0.5 : 1,
                      fontFamily: "var(--font-display)"
                    }}
                  >
                    {status === "sending" ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                    {status === "sending" ? "Отправка..." : "Отправить"}
                  </button>
                </form>
              )}
            </div>

            {/* Info sidebar */}
            <div className="contact-info" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ border: "1px solid var(--c-border)", background: "var(--c-s1)", padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <Mail size={18} style={{ color: "var(--c-red)" }} />
                  <span style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-t2)", fontFamily: "var(--font-mono)" }}>Email</span>
                </div>
                <p style={{ fontSize: 14, color: "var(--c-t3)", fontFamily: "var(--font-sans)", marginBottom: 4 }}>Пишите напрямую:</p>
                <a href="mailto:hello@kurs.dev" style={{ fontSize: 14, fontWeight: 600, color: "var(--c-t1)", fontFamily: "var(--font-mono)", textDecoration: "none" }}>hello@kurs.dev</a>
              </div>

              <div style={{ border: "1px solid var(--c-border)", background: "var(--c-s1)", padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <MessageSquare size={18} style={{ color: "var(--c-red)" }} />
                  <span style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-t2)", fontFamily: "var(--font-mono)" }}>Время ответа</span>
                </div>
                <p style={{ fontSize: 14, color: "var(--c-t3)", lineHeight: 1.6, fontFamily: "var(--font-sans)" }}>
                  Отвечаем в течение одного рабочего дня. В выходные — в понедельник.
                </p>
              </div>

              <div style={{ border: "1px solid var(--c-border)", background: "var(--c-bg)", padding: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-t3)", marginBottom: 12, fontFamily: "var(--font-mono)" }}>
                  Документы
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  <li><Link href="/privacy" className="link-cream" style={{ fontSize: 14, textDecoration: "none", fontFamily: "var(--font-sans)" }}>Политика конфиденциальности</Link></li>
                  <li><Link href="/offer" className="link-cream" style={{ fontSize: 14, textDecoration: "none", fontFamily: "var(--font-sans)" }}>Публичная оферта</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
