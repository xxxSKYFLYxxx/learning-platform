"use client";

import { useSession, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

function LogoDark() {
  return (
    <Link href="/" className="inline-flex items-center select-none group">
      <span
        className="inline-block font-black tracking-tight px-2 py-0.5 text-base transition-all"
        style={{
          fontFamily: "var(--font-display)",
          background: "#E8351D",
          color: "#F0EBE3",
        }}
      >
        К
      </span>
      <span
        className="inline-block font-black tracking-tight px-1.5 py-0.5 text-base border border-l-0 transition-all"
        style={{
          fontFamily: "var(--font-display)",
          borderColor: "#3A3530",
          color: "#F0EBE3",
          background: "transparent",
        }}
      >
        УРС
      </span>
    </Link>
  );
}

export function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(13, 11, 9, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #262220",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-6">
        <LogoDark />

        <nav className="hidden md:flex items-center gap-6 ml-4">
          <Link
            href="/courses"
            className="text-sm font-medium transition-colors hover:text-[#F0EBE3]"
            style={{ fontFamily: "var(--font-sans)", color: "#6E675E" }}
          >
            Курсы
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium transition-colors hover:text-[#F0EBE3]"
            style={{ fontFamily: "var(--font-sans)", color: "#6E675E" }}
          >
            О нас
          </Link>
          {session?.user?.role === "INSTRUCTOR" && (
            <Link
              href="/instructor"
              className="text-sm font-medium transition-colors hover:text-[#F0EBE3]"
              style={{ fontFamily: "var(--font-sans)", color: "#6E675E" }}
            >
              Преподаватель
            </Link>
          )}
          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-sm font-medium transition-colors hover:text-[#E8351D]"
              style={{ fontFamily: "var(--font-sans)", color: "#6E675E" }}
            >
              Админ
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="hidden md:block text-sm font-medium transition-colors hover:text-[#F0EBE3]"
                style={{ fontFamily: "var(--font-sans)", color: "#6E675E" }}
              >
                {session.user?.name?.split(" ")[0] ?? "Кабинет"}
              </Link>
              <button
                onClick={() => signOut()}
                className="hidden md:block text-xs transition-colors hover:text-[#E8351D]"
                style={{ fontFamily: "var(--font-mono)", color: "#6E675E" }}
              >
                [выйти]
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-black border transition-all hover:glow-red"
              style={{
                fontFamily: "var(--font-display)",
                background: "#E8351D",
                color: "#F0EBE3",
                borderColor: "#E8351D",
                boxShadow: "0 0 16px rgba(232,53,29,0.25)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 24px rgba(232,53,29,0.5), 0 0 48px rgba(232,53,29,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 16px rgba(232,53,29,0.25)";
              }}
            >
              Войти
            </Link>
          )}
          <button
            className="md:hidden p-1 transition-colors"
            style={{ color: "#6E675E" }}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="md:hidden px-4 py-4 flex flex-col gap-4"
          style={{ background: "#0D0B09", borderTop: "1px solid #262220" }}
        >
          <Link
            href="/courses"
            className="text-sm font-medium"
            style={{ color: "#F0EBE3" }}
            onClick={() => setOpen(false)}
          >
            Курсы
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium"
            style={{ color: "#6E675E" }}
            onClick={() => setOpen(false)}
          >
            О нас
          </Link>
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium"
                style={{ color: "#F0EBE3" }}
                onClick={() => setOpen(false)}
              >
                Кабинет
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm text-left"
                style={{ color: "#E8351D" }}
              >
                Выйти
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-black"
              style={{ color: "#E8351D" }}
              onClick={() => setOpen(false)}
            >
              Войти →
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
