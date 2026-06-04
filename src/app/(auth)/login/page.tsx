import { signIn } from "@/lib/auth";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Войти" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary font-display text-xl font-bold mb-6">
            <BookOpen className="w-6 h-6 text-secondary" />
            Платформа
          </Link>
          <h1 className="text-2xl font-bold text-primary font-display">Войти в аккаунт</h1>
          <p className="text-muted text-sm mt-2">Введите email -- пришлём ссылку для входа</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form
            action={async (formData: FormData) => {
              "use server";
              const email = formData.get("email") as string;
              await signIn("resend", { email, redirectTo: "/dashboard" });
            }}
            className="flex flex-col gap-3"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              className="w-full px-4 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Отправить ссылку для входа
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted mt-6">
          Продолжая, вы соглашаетесь с{" "}
          <Link href="/privacy" className="text-secondary hover:underline">политикой конфиденциальности</Link>
        </p>
      </div>
    </div>
  );
}
