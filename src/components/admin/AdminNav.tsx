"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Users, ShoppingCart, LogOut, ChevronRight } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";

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
        <Logo variant="light" size="sm" />
        <p className="text-[#555] text-[10px] mt-2 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>ADMIN</p>
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
