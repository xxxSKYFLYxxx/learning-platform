import { prisma } from "@/lib/prisma";
import { BookOpen, Users, ShoppingCart, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

async function getStats() {
  const [courses, users, enrollments, revenue] = await Promise.all([
    prisma.course.aggregate({ _count: true, where: {} }),
    prisma.user.groupBy({ by: ["role"], _count: true }),
    prisma.enrollment.count(),
    prisma.$queryRaw<{ total: number }[]>`
      SELECT COALESCE(SUM(c.price), 0) as total
      FROM enrollments e
      JOIN courses c ON c.id = e."courseId"
      WHERE c."isFree" = false AND e.status IN ('ACTIVE','COMPLETED')
    `,
  ]);

  const recentEnrollments = await prisma.enrollment.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true, price: true, isFree: true } },
    },
  });

  return { courses, users, enrollments, revenue, recentEnrollments };
}

export const metadata = { title: "Admin — Дашборд" };

export default async function AdminDashboard() {
  const { courses, users, enrollments, revenue, recentEnrollments } = await getStats();

  const studentCount = users.find((u) => u.role === "STUDENT")?._count ?? 0;
  const instructorCount = users.find((u) => u.role === "INSTRUCTOR")?._count ?? 0;

  const STAT_CARDS = [
    { icon: BookOpen,    label: "Курсов",       value: courses._count,   href: "/admin/courses" },
    { icon: Users,       label: "Студентов",    value: studentCount,     href: "/admin/users" },
    { icon: ShoppingCart,label: "Заявок",       value: enrollments,      href: "/admin/enrollments" },
    { icon: TrendingUp,  label: "Выручка",      value: formatPrice(Number(revenue[0]?.total ?? 0)), href: null },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="text-[10px] font-black tracking-[0.25em] text-[#787068] mb-1" style={{ fontFamily: "var(--font-mono)" }}>ПАНЕЛЬ УПРАВЛЕНИЯ</p>
        <h1 className="text-3xl font-black text-[#0F0F0F]" style={{ fontFamily: "var(--font-display)" }}>Дашборд</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STAT_CARDS.map(({ icon: Icon, label, value, href }) => {
          const inner = (
            <div className="bg-white border-2 border-[#0F0F0F] shadow-brutal p-5 hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
              <Icon className="w-5 h-5 text-[#D4402F] mb-3" />
              <div className="text-3xl font-bold text-[#0F0F0F] mb-1" style={{ fontFamily: "var(--font-mono)" }}>{value}</div>
              <div className="text-xs text-[#787068]" style={{ fontFamily: "var(--font-sans)" }}>{label}</div>
            </div>
          );
          return href ? <Link key={label} href={href}>{inner}</Link> : <div key={label}>{inner}</div>;
        })}
      </div>

      {/* Instructor count badge */}
      <div className="flex gap-3 mb-10">
        <span className="px-3 py-1 border-2 border-[#0F0F0F] text-xs font-mono" style={{ fontFamily: "var(--font-mono)" }}>
          Преподавателей: {instructorCount}
        </span>
        <Link href="/admin/courses/new" className="px-3 py-1 bg-[#0F0F0F] text-[#FAFAF7] border-2 border-[#0F0F0F] text-xs font-black shadow-brutal-r hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all" style={{ fontFamily: "var(--font-display)" }}>
          + Новый курс
        </Link>
      </div>

      {/* Recent enrollments */}
      <div>
        <h2 className="text-base font-black text-[#0F0F0F] mb-4" style={{ fontFamily: "var(--font-display)" }}>Последние заявки</h2>
        <div className="bg-white border-2 border-[#0F0F0F]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-[#0F0F0F]">
                {["Студент", "Курс", "Сумма", "Дата"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider text-[#787068]" style={{ fontFamily: "var(--font-mono)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentEnrollments.map((e) => (
                <tr key={e.id} className="border-b border-[#E0DDD8] last:border-b-0 hover:bg-[#FAFAF7] transition-colors">
                  <td className="px-4 py-3" style={{ fontFamily: "var(--font-sans)" }}>
                    <div className="text-[#0F0F0F] font-medium text-xs">{e.user.name ?? "—"}</div>
                    <div className="text-[#787068] text-[10px]">{e.user.email}</div>
                  </td>
                  <td className="px-4 py-3 text-[#0F0F0F] text-xs max-w-[200px] truncate" style={{ fontFamily: "var(--font-sans)" }}>{e.course.title}</td>
                  <td className="px-4 py-3 font-bold text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                    {e.course.isFree ? "FREE" : formatPrice(Number(e.course.price))}
                  </td>
                  <td className="px-4 py-3 text-[#787068] text-[10px]" style={{ fontFamily: "var(--font-mono)" }}>
                    {new Date(e.createdAt).toLocaleDateString("ru-RU")}
                  </td>
                </tr>
              ))}
              {recentEnrollments.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-[#787068] text-sm">Заявок пока нет</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
