import { signIn } from "@/lib/auth";
import Link from "next/link";

export const metadata = { title: "Войти" };

export default function LoginPage() {
  return (
    <div className="grain" style={{ minHeight: "100vh", background: "var(--c-bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 16, position: "relative", overflow: "hidden" }}>
      {/* Red bloom */}
      <div aria-hidden style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,var(--c-red-lo) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 380, position: "relative" }}>
        {/* Logo + heading */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", marginBottom: 24 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 20, padding: "4px 10px", background: "var(--c-red)", color: "var(--c-t1)" }}>К</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 20, padding: "4px 9px", border: "1px solid var(--c-border-hi)", borderLeft: "none", color: "var(--c-t1)" }}>УРС</span>
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)" }}>
            Войти в аккаунт
          </h1>
          <p style={{ color: "var(--c-t3)", fontSize: 14, marginTop: 8, fontFamily: "var(--font-sans)" }}>
            Выберите удобный способ входа
          </p>
        </div>

        {/* Card */}
        <div style={{ background: "var(--c-s1)", border: "1px solid var(--c-border)", display: "flex", flexDirection: "column", gap: 12, padding: 24 }}>

          {/* ВКонтакте */}
          <form action={async () => { "use server"; await signIn("vk", { redirectTo: "/dashboard" }); }}>
            <button type="submit" style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#0077FF", color: "#fff", fontSize: 14, fontWeight: 900, border: "none", cursor: "pointer", fontFamily: "var(--font-display)" }}>
              <span style={{ width: 24, height: 24, background: "#fff", color: "#0077FF", borderRadius: 3, fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>ВК</span>
              Войти через ВКонтакте
            </button>
          </form>

          {/* Яндекс ID */}
          <form action={async () => { "use server"; await signIn("yandex", { redirectTo: "/dashboard" }); }}>
            <button type="submit" style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#FC3F1D", color: "#fff", fontSize: 14, fontWeight: 900, border: "none", cursor: "pointer", fontFamily: "var(--font-display)" }}>
              <span style={{ width: 24, height: 24, background: "#fff", color: "#FC3F1D", borderRadius: 3, fontSize: 14, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>Я</span>
              Войти через Яндекс ID
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--c-border)" }} />
            <span style={{ fontSize: 10, color: "var(--c-t4)", fontFamily: "var(--font-mono)" }}>или</span>
            <div style={{ flex: 1, height: 1, background: "var(--c-border)" }} />
          </div>

          {/* Email */}
          <form
            action={async (formData: FormData) => {
              "use server";
              const email = formData.get("email") as string;
              await signIn("resend", { email, redirectTo: "/dashboard" });
            }}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <div>
              <label style={{ display: "block", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-t3)", marginBottom: 6, fontFamily: "var(--font-mono)" }}>
                Email
              </label>
              <input
                type="email" name="email" required
                placeholder="you@mail.ru"
                className="input-dark"
                style={{ width: "100%", padding: "12px 16px", fontSize: 14, fontFamily: "var(--font-sans)", boxSizing: "border-box" }}
              />
            </div>
            <button type="submit" className="btn-red" style={{ width: "100%", padding: "12px 16px", fontSize: 14, fontWeight: 900, border: "none", cursor: "pointer", fontFamily: "var(--font-display)" }}>
              Отправить ссылку →
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--c-t3)", marginTop: 20, lineHeight: 1.6, fontFamily: "var(--font-sans)" }}>
          Продолжая, вы соглашаетесь с{" "}
          <Link href="/privacy" style={{ color: "var(--c-red)", textDecoration: "none" }}>политикой конфиденциальности</Link>{" "}
          и{" "}
          <Link href="/offer" style={{ color: "var(--c-red)", textDecoration: "none" }}>публичной офертой</Link>
        </p>
      </div>
    </div>
  );
}
