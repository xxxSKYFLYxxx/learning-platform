"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const labelStyle: React.CSSProperties = { display: "block", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-t2)", marginBottom: 6, fontFamily: "var(--font-mono)" };
const fieldStyle: React.CSSProperties = { width: "100%", padding: "12px 16px", fontSize: 14, fontFamily: "var(--font-sans)", boxSizing: "border-box" };

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Неверный email или пароль");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="grain" style={{ minHeight: "100vh", background: "var(--c-bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 16, position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,var(--c-red-lo) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 380, position: "relative" }}>
        {/* Logo + heading */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", marginBottom: 24 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 20, padding: "4px 10px", background: "var(--c-red)", color: "var(--c-t1)" }}>К</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 20, padding: "4px 9px", border: "1px solid var(--c-border-hi)", borderLeft: "none", color: "var(--c-t1)" }}>УРС</span>
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)" }}>
            Вход в аккаунт
          </h1>
          <p style={{ color: "var(--c-t3)", fontSize: 14, marginTop: 8, fontFamily: "var(--font-sans)" }}>
            Введите email и пароль
          </p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} style={{ background: "var(--c-s1)", border: "1px solid var(--c-border)", display: "flex", flexDirection: "column", gap: 16, padding: 24 }}>
          {error && (
            <div style={{ padding: "10px 14px", background: "rgba(208,57,42,0.1)", border: "1px solid rgba(208,57,42,0.3)", color: "var(--c-red)", fontSize: 13, fontFamily: "var(--font-sans)" }}>
              {error}
            </div>
          )}

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email" name="email" required autoComplete="email"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-dark" style={fieldStyle} placeholder="you@mail.ru"
            />
          </div>

          <div>
            <label style={labelStyle}>Пароль</label>
            <input
              type="password" name="password" required autoComplete="current-password"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-dark" style={fieldStyle} placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-red" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 16px", fontSize: 14, fontWeight: 900, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, fontFamily: "var(--font-display)" }}>
            {loading && <Loader2 size={16} className="animate-spin" />}
            Войти
          </button>
          <div style={{ padding: "10px 12px", border: "1px solid var(--c-border)", background: "var(--c-bg)", color: "var(--c-t3)", fontSize: 12, lineHeight: 1.6, fontFamily: "var(--font-mono)" }}>
            Демо-админ: admin@kurs.dev / password123
          </div>
        </form>

        <p style={{ textAlign: "center", fontSize: 14, color: "var(--c-t3)", marginTop: 20, fontFamily: "var(--font-sans)" }}>
          Нет аккаунта?{" "}
          <Link href="/register" style={{ color: "var(--c-red)", textDecoration: "none", fontWeight: 700 }}>Зарегистрироваться</Link>
        </p>

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--c-t4)", marginTop: 16, lineHeight: 1.6, fontFamily: "var(--font-sans)" }}>
          Продолжая, вы соглашаетесь с{" "}
          <Link href="/privacy" style={{ color: "var(--c-t3)", textDecoration: "underline" }}>политикой конфиденциальности</Link>{" "}
          и{" "}
          <Link href="/offer" style={{ color: "var(--c-t3)", textDecoration: "underline" }}>офертой</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
