"use client";

import { useSession, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

export function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-[#0F0F0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-6">
        <Logo />

        <nav className="hidden md:flex items-center gap-5 ml-4">
          <Link href="/courses" className="text-sm font-semibold text-[#787068] hover:text-[#0F0F0F] transition-colors" style={{ fontFamily: "var(--font-sans)" }}>
            Курсы
          </Link>
          {session?.user?.role === "INSTRUCTOR" && (
            <Link href="/instructor" className="text-sm font-semibold text-[#787068] hover:text-[#0F0F0F] transition-colors" style={{ fontFamily: "var(--font-sans)" }}>
              Преподаватель
            </Link>
          )}
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin" className="text-sm font-semibold text-[#787068] hover:text-[#0F0F0F] transition-colors" style={{ fontFamily: "var(--font-sans)" }}>
              Админ
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {session ? (
            <>
              <Link href="/dashboard" className="hidden md:block text-sm font-semibold text-[#787068] hover:text-[#0F0F0F] transition-colors" style={{ fontFamily: "var(--font-sans)" }}>
                {session.user?.name?.split(" ")[0] ?? "Кабинет"}
              </Link>
              <button onClick={() => signOut()} className="hidden md:block text-xs text-[#787068] hover:text-[#D4402F] transition-colors" style={{ fontFamily: "var(--font-mono)" }}>
                [выйти]
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 bg-[#0F0F0F] text-[#FAFAF7] text-sm font-black border-2 border-[#0F0F0F] shadow-brutal-r hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Войти
            </Link>
          )}
          <button className="md:hidden p-1 text-[#787068]" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t-2 border-[#0F0F0F] bg-white px-4 py-4 flex flex-col gap-3">
          <Link href="/courses" className="text-sm font-semibold" onClick={() => setOpen(false)}>Курсы</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="text-sm font-semibold" onClick={() => setOpen(false)}>Кабинет</Link>
              <button onClick={() => signOut()} className="text-sm text-[#D4402F] text-left">Выйти</button>
            </>
          ) : (
            <Link href="/login" className="text-sm font-black" onClick={() => setOpen(false)}>Войти</Link>
          )}
        </div>
      )}
    </header>
  );
}
