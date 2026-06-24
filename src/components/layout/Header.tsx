"use client";

import { useSession, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(14,12,10,0.88)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--c-border)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", gap: 32 }}>

        {/* Logo */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 15,
            padding: "3px 8px", background: "var(--c-red)", color: "var(--c-t1)",
            letterSpacing: "-0.02em",
          }}>К</span>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 15,
            padding: "3px 7px",
            border: "1px solid var(--c-border-hi)", borderLeft: "none",
            color: "var(--c-t1)", letterSpacing: "-0.02em",
          }}>УРС</span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 24, flex: 1 }}>
          {[
            { href: "/courses", label: "Курсы" },
            { href: "/about", label: "О нас" },
            { href: "/contact", label: "Контакты" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="link-cream" style={{
              fontSize: 14, fontWeight: 500,
              fontFamily: "var(--font-sans)",
              textDecoration: "none",
            }}>
              {label}
            </Link>
          ))}
          {session?.user?.role === "INSTRUCTOR" && (
            <Link href="/instructor" className="link-cream" style={{ fontSize: 14, fontWeight: 500, fontFamily: "var(--font-sans)", textDecoration: "none" }}>
              Преподаватель
            </Link>
          )}
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin" className="link-muted" style={{ fontSize: 13, fontFamily: "var(--font-sans)", textDecoration: "none" }}>
              Админ
            </Link>
          )}
        </nav>

        {/* Auth */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          {session ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Link href="/dashboard/profile" className="link-cream" style={{ fontSize: 14, fontWeight: 500, fontFamily: "var(--font-sans)", textDecoration: "none" }}>
                  👤
                </Link>
                <Link href="/dashboard" className="link-cream" style={{ fontSize: 14, fontWeight: 500, fontFamily: "var(--font-sans)", textDecoration: "none" }}>
                  {session.user?.name?.split(" ")[0] ?? "Кабинет"}
                </Link>
              </div>
              <button onClick={() => signOut()} className="link-muted" style={{ fontSize: 12, fontFamily: "var(--font-mono)", background: "none", border: "none", cursor: "pointer" }}>
                [выйти]
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-red" style={{
              padding: "7px 20px", fontSize: 13, fontWeight: 900,
              fontFamily: "var(--font-display)", textDecoration: "none",
              letterSpacing: "0.02em",
            }}>
              Войти
            </Link>
          )}

          {/* Burger */}
          <button
            onClick={() => setOpen(!open)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--c-t3)", padding: 4, display: "none" }}
            className="burger-btn"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: "var(--c-bg)", borderTop: "1px solid var(--c-border)", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {["/courses", "/about", "/contact"].map((href) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} style={{ color: "var(--c-t1)", fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
              {href === "/courses" ? "Курсы" : href === "/about" ? "О нас" : "Контакты"}
            </Link>
          ))}
          {session ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} style={{ color: "var(--c-t1)", fontSize: 15, textDecoration: "none" }}>Кабинет</Link>
              <Link href="/dashboard/profile" onClick={() => setOpen(false)} style={{ color: "var(--c-t1)", fontSize: 15, textDecoration: "none" }}>Настройки профиля</Link>
              <button onClick={() => signOut()} style={{ color: "var(--c-red)", textAlign: "left", background: "none", border: "none", fontSize: 14, cursor: "pointer" }}>Выйти</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} style={{ color: "var(--c-red)", fontSize: 15, fontWeight: 900, textDecoration: "none" }}>Войти →</Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .burger-btn { display: block !important; } nav { display: none !important; } }
      `}</style>
    </header>
  );
}
