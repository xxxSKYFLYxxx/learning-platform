"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Mail, MessageSquare } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const TOPICS = [
  "Вопрос по курсу",
  "Технические проблемы",
  "Оплата и возврат",
  "Сотрудничество",
  "Другое",
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 800));
    setStatus("sent");
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b-2 border-[#0F0F0F] bg-[#FDFCE8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#787068] mb-3" style={{ fontFamily: "var(--font-mono)" }}>
              Связаться
            </p>
            <h1 className="text-5xl md:text-6xl font-black text-[#0F0F0F] leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              КОНТАКТЫ
            </h1>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-[1fr_420px] gap-16">
            {/* Form */}
            <div>
              {status === "sent" ? (
                <div className="border-2 border-[#0F0F0F] bg-[#1A9E6E] text-[#FAFAF7] p-10 shadow-brutal text-center">
                  <div className="text-4xl mb-4">✓</div>
                  <h2 className="text-xl font-black mb-2" style={{ fontFamily: "var(--font-display)" }}>Сообщение отправлено</h2>
                  <p className="text-sm opacity-80" style={{ fontFamily: "var(--font-sans)" }}>
                    Ответим в течение одного рабочего дня.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-[#0F0F0F] mb-2" style={{ fontFamily: "var(--font-mono)" }}>
                        Имя
                      </label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border-2 border-[#0F0F0F] px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#D4402F] transition-colors"
                        style={{ fontFamily: "var(--font-sans)" }}
                        placeholder="Иван Петров"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-[#0F0F0F] mb-2" style={{ fontFamily: "var(--font-mono)" }}>
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border-2 border-[#0F0F0F] px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#D4402F] transition-colors"
                        style={{ fontFamily: "var(--font-sans)" }}
                        placeholder="ivan@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-[#0F0F0F] mb-2" style={{ fontFamily: "var(--font-mono)" }}>
                      Тема
                    </label>
                    <select
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      className="w-full border-2 border-[#0F0F0F] px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#D4402F] transition-colors"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {TOPICS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-[#0F0F0F] mb-2" style={{ fontFamily: "var(--font-mono)" }}>
                      Сообщение
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border-2 border-[#0F0F0F] px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#D4402F] transition-colors resize-none"
                      style={{ fontFamily: "var(--font-sans)" }}
                      placeholder="Опишите ваш вопрос..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="self-start inline-flex items-center gap-2 px-8 py-3 bg-[#0F0F0F] text-[#FAFAF7] font-black text-sm border-2 border-[#0F0F0F] shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <Send className="w-4 h-4" />
                    {status === "sending" ? "Отправка..." : "Отправить"}
                  </button>
                </form>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-5">
              <div className="border-2 border-[#0F0F0F] p-6 bg-white shadow-brutal">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-5 h-5 text-[#D4402F]" />
                  <span className="text-xs font-black uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>Email</span>
                </div>
                <p className="text-sm text-[#787068]" style={{ fontFamily: "var(--font-sans)" }}>
                  Пишите напрямую:
                </p>
                <a href="mailto:hello@kurs.dev" className="text-sm font-semibold text-[#0F0F0F] hover:text-[#D4402F] transition-colors" style={{ fontFamily: "var(--font-mono)" }}>
                  hello@kurs.dev
                </a>
              </div>

              <div className="border-2 border-[#0F0F0F] p-6 bg-white shadow-brutal">
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare className="w-5 h-5 text-[#D4402F]" />
                  <span className="text-xs font-black uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>Время ответа</span>
                </div>
                <p className="text-sm text-[#787068] leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
                  Отвечаем в течение одного рабочего дня. В выходные — в понедельник.
                </p>
              </div>

              <div className="border-2 border-[#0F0F0F] p-6 bg-[#FDFCE8]">
                <p className="text-xs font-black uppercase tracking-widest text-[#787068] mb-3" style={{ fontFamily: "var(--font-mono)" }}>
                  Частые вопросы
                </p>
                <ul className="text-sm text-[#787068] space-y-2" style={{ fontFamily: "var(--font-sans)" }}>
                  <li>
                    <Link href="/privacy" className="hover:text-[#0F0F0F] transition-colors">Политика конфиденциальности</Link>
                  </li>
                  <li>
                    <Link href="/offer" className="hover:text-[#0F0F0F] transition-colors">Публичная оферта</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
