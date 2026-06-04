"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { BookOpen, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
            <BookOpen className="w-6 h-6 text-secondary" />
            Платформа
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
            <Link href="/courses" className="hover:text-text transition-colors">Курсы</Link>
            {session?.user?.role === "INSTRUCTOR" && (
              <Link href="/instructor" className="hover:text-text transition-colors">Преподаватель</Link>
            )}
            {session?.user?.role === "ADMIN" && (
              <Link href="/admin" className="hover:text-text transition-colors">Админ</Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-sm text-muted hover:text-text transition-colors"
                >
                  <User className="w-4 h-4" />
                  {session.user?.name ?? "Кабинет"}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 text-sm text-muted hover:text-error transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
              >
                Войти
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2 text-muted hover:text-text"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3">
          <Link href="/courses" className="text-sm text-muted py-1" onClick={() => setMenuOpen(false)}>Курсы</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="text-sm text-muted py-1" onClick={() => setMenuOpen(false)}>Мой кабинет</Link>
              <button onClick={() => signOut()} className="text-sm text-error text-left py-1">Выйти</button>
            </>
          ) : (
            <Link href="/login" className="text-sm font-medium text-primary py-1" onClick={() => setMenuOpen(false)}>Войти</Link>
          )}
        </div>
      )}
    </header>
  );
}
