import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Admin — Заявки" };

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Активна",
  COMPLETED: "Завершена",
  REFUNDED: "Возврат",
};
const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "text-[#1A9E6E] border-[#1A9E6E]",
  COMPLETED: "text-[#E8A020] border-[#E8A020]",
  REFUNDED: "text-[#D4402F] border-[#D4402F]",
};

export default async function AdminEnrollmentsPage() {
  const enrollments = await prisma.enrollment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true, price: true, isFree: true } },
    },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="text-[10px] font-black tracking-[0.25em] text-[#787068] mb-1" style={{ fontFamily: "var(--font-mono)" }}>УПРАВЛЕНИЕ</p>
        <h1 className="text-3xl font-black text-[#0F0F0F]" style={{ fontFamily: "var(--font-display)" }}>Заявки</h1>
        <p className="text-sm text-[#787068] mt-1" style={{ fontFamily: "var(--font-sans)" }}>Всего: {enrollments.length}</p>
      </div>

      <div className="bg-white border-2 border-[#0F0F0F]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[#0F0F0F] bg-[#FAFAF7]">
              {["Студент", "Курс", "Сумма", "Статус", "Дата"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider text-[#787068]" style={{ fontFamily: "var(--font-mono)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e) => (
              <tr key={e.id} className="border-b border-[#E0DDD8] last:border-b-0 hover:bg-[#FAFAF7] transition-colors">
                <td className="px-4 py-3">
                  <div className="text-[#0F0F0F] text-xs font-medium" style={{ fontFamily: "var(--font-sans)" }}>{e.user.name ?? "—"}</div>
                  <div className="text-[#787068] text-[10px]">{e.user.email}</div>
                </td>
                <td className="px-4 py-3 text-[#0F0F0F] text-xs max-w-[200px] truncate" style={{ fontFamily: "var(--font-sans)" }}>{e.course.title}</td>
                <td className="px-4 py-3 font-bold text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                  {e.course.isFree ? "FREE" : formatPrice(Number(e.course.price))}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-black px-2 py-0.5 border ${STATUS_COLORS[e.status] ?? "text-[#787068] border-[#787068]"}`} style={{ fontFamily: "var(--font-mono)" }}>
                    {STATUS_LABELS[e.status] ?? e.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[10px] text-[#787068]" style={{ fontFamily: "var(--font-mono)" }}>
                  {new Date(e.createdAt).toLocaleDateString("ru-RU")}
                </td>
              </tr>
            ))}
            {enrollments.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-[#787068] text-sm">Заявок пока нет</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
