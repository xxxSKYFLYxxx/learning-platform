import { signIn } from "@/lib/auth";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

export const metadata = { title: "Войти" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FDFCE8] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo href="/" />
          </div>
          <h1
            className="text-2xl font-black text-[#0F0F0F]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Войти в аккаунт
          </h1>
          <p className="text-[#787068] text-sm mt-2" style={{ fontFamily: "var(--font-sans)" }}>
            Выберите удобный способ входа
          </p>
        </div>

        <div className="bg-white border-2 border-[#0F0F0F] shadow-brutal flex flex-col gap-3 p-6">

          {/* ── ВКонтакте ── */}
          <form
            action={async () => {
              "use server";
              await signIn("vk", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 bg-[#0077FF] text-white text-sm font-black border-2 border-[#0077FF] hover:bg-[#0066DD] transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="w-6 h-6 bg-white text-[#0077FF] rounded-sm text-xs font-black flex items-center justify-center shrink-0">
                ВК
              </span>
              Войти через ВКонтакте
            </button>
          </form>

          {/* ── Яндекс ID ── */}
          <form
            action={async () => {
              "use server";
              await signIn("yandex", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 bg-[#FC3F1D] text-white text-sm font-black border-2 border-[#FC3F1D] hover:bg-[#E03518] transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="w-6 h-6 bg-white text-[#FC3F1D] rounded-sm text-sm font-black flex items-center justify-center shrink-0">
                Я
              </span>
              Войти через Яндекс ID
            </button>
          </form>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 border-t border-[#E0DDD8]" />
            <span className="text-[10px] text-[#787068]" style={{ fontFamily: "var(--font-mono)" }}>или</span>
            <div className="flex-1 border-t border-[#E0DDD8]" />
          </div>

          {/* ── Email magic link ── */}
          <form
            action={async (formData: FormData) => {
              "use server";
              const email = formData.get("email") as string;
              await signIn("resend", { email, redirectTo: "/dashboard" });
            }}
            className="flex flex-col gap-3"
          >
            <div>
              <label
                className="block text-[10px] font-black uppercase tracking-widest text-[#787068] mb-1.5"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@mail.ru"
                className="w-full px-4 py-3 border-2 border-[#0F0F0F] bg-[#FAFAF7] text-sm outline-none focus:bg-white transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-[#0F0F0F] text-[#FAFAF7] text-sm font-black border-2 border-[#0F0F0F] shadow-brutal-r hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Отправить ссылку →
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#787068] mt-5 leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
          Продолжая, вы соглашаетесь с{" "}
          <Link href="/privacy" className="text-[#D4402F] hover:underline">
            политикой конфиденциальности
          </Link>{" "}
          и{" "}
          <Link href="/offer" className="text-[#D4402F] hover:underline">
            публичной офертой
          </Link>
        </p>
      </div>
    </div>
  );
}
