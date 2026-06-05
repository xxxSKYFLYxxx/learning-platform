"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Users, ShoppingCart, LogOut, ChevronRight } from "lucide-react";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/admin",             icon: LayoutDashboard, label: "Дашборд" },
  { href: "/admin/courses",     icon: BookOpen,        label: "Курсы" },
  { href: "/admin/users",       icon: Users,           label: "Пользователи" },
  { href: "/admin/enrollments", icon: ShoppingCart,    label: "Заявки" },
];

export function AdminNav() {
  const path = usePathname();

  return (
    <aside style={{ width: 208, flexShrink: 0, background: "var(--c-s1)", borderRight: "1px solid var(--c-border)", display: "flex", flexDirection: "column", minHeight: "100vh", position: "sticky", top: 0, height: "100vh" }}>
      {/* Brand */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--c-border)" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 14, padding: "3px 7px", background: "var(--c-red)", color: "var(--c-t1)" }}>К</span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 14, padding: "3px 6px", border: "1px solid var(--c-border-hi)", borderLeft: "none", color: "var(--c-t1)" }}>УРС</span>
        </Link>
        <p style={{ color: "var(--c-t4)", fontSize: 10, marginTop: 8, letterSpacing: "0.18em", fontFamily: "var(--font-mono)" }}>ADMIN</p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = path === href || (href !== "/admin" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", fontSize: 14, textDecoration: "none", fontFamily: "var(--font-sans)",
                transition: "all 0.15s",
                ...(active
                  ? { background: "var(--c-red)", color: "var(--c-t1)", fontWeight: 600 }
                  : { color: "var(--c-t3)" }),
              }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              {label}
              {active && <ChevronRight size={12} style={{ marginLeft: "auto", opacity: 0.6 }} />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid var(--c-border)" }}>
        <Link href="/" className="link-muted" style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", fontSize: 12, textDecoration: "none", marginBottom: 4, fontFamily: "var(--font-mono)" }}>
          ← на сайт
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="link-muted"
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", width: "100%", fontSize: 14, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)" }}
        >
          <LogOut size={16} />
          Выйти
        </button>
      </div>
    </aside>
  );
}
