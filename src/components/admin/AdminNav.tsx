"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Users, ShoppingCart, LogOut, ChevronRight } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin",             icon: LayoutDashboard, label: "Дашборд" },
  { href: "/admin/courses",     icon: BookOpen,        label: "Курсы" },
  { href: "/admin/users",       icon: Users,           label: "Пользователи" },
  { href: "/admin/enrollments", icon: ShoppingCart,    label: "Заявки" },
];

export function AdminNav() {
  const path = usePathname();

  return (
    <aside className="w-52 shrink-0 bg-[#0F0F0F] flex flex-col min-h-screen sticky top-0 h-screen">
      {/* Brand */}
      <div className="px-5 py-4 border-b-2 border-white/10">
        <div className="flex items-center gap-0">
          <span className="px-2 py-0.5 text-[#FAFAF7] text-sm font-black bg-[#D4402F]" style={{ fontFamily: "var(--font-display)" }}>К</span>
          <span className="px-1.5 py-0.5 text-[#0F0F0F] text-sm font-black bg-[#FAFAF7]" style={{ fontFamily: "var(--font-display)" }}>УРС</span>
        </div>
        <p className="text-[#555] text-[10px] mt-1.5 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>ADMIN</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = path === href || (href !== "/admin" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-[#D4402F] text-[#FAFAF7] font-semibold"
                  : "text-[#666] hover:text-[#FAFAF7] hover:bg-white/5"
              )}
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t-2 border-white/10">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 text-xs text-[#555] hover:text-[#FAFAF7] transition-colors mb-1" style={{ fontFamily: "var(--font-mono)" }}>
          ← на сайт
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2 w-full text-sm text-[#666] hover:text-[#D4402F] transition-colors"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <LogOut className="w-4 h-4" />
          Выйти
        </button>
      </div>
    </aside>
  );
}
