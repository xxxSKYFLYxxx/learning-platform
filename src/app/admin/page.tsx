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
    <div style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.25em", color: "var(--c-t3)", marginBottom: 4, fontFamily: "var(--font-mono)" }}>ПАНЕЛЬ УПРАВЛЕНИЯ</p>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)" }}>Дашборд</h1>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
        {STAT_CARDS.map(({ icon: Icon, label, value, href }) => {
          const inner = (
            <div className="feature-card" style={{ padding: 20 }}>
              <Icon size={20} style={{ color: "var(--c-red)", marginBottom: 12 }} />
              <div style={{ fontSize: 30, fontWeight: 700, color: "var(--c-t1)", marginBottom: 4, fontFamily: "var(--font-mono)" }}>{value}</div>
              <div style={{ fontSize: 12, color: "var(--c-t3)", fontFamily: "var(--font-sans)" }}>{label}</div>
            </div>
          );
          return href ? <Link key={label} href={href} style={{ textDecoration: "none" }}>{inner}</Link> : <div key={label}>{inner}</div>;
        })}
      </div>

      {/* Instructor count + new course */}
      <div style={{ display: "flex", gap: 12, marginBottom: 40, alignItems: "center" }}>
        <span style={{ padding: "6px 12px", border: "1px solid var(--c-border)", fontSize: 12, color: "var(--c-t3)", fontFamily: "var(--font-mono)" }}>
          Преподавателей: <span style={{ color: "var(--c-amber)" }}>{instructorCount}</span>
        </span>
        <Link href="/admin/courses/new" className="btn-red" style={{ padding: "6px 14px", fontSize: 12, fontWeight: 900, textDecoration: "none", fontFamily: "var(--font-display)" }}>
          + Новый курс
        </Link>
      </div>

      {/* Recent enrollments */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 900, color: "var(--c-t1)", marginBottom: 16, fontFamily: "var(--font-display)" }}>Последние заявки</h2>
        <div style={{ background: "var(--c-s1)", border: "1px solid var(--c-border)" }}>
          <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--c-border)" }}>
                {["Студент", "Курс", "Сумма", "Дата"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--c-t3)", fontFamily: "var(--font-mono)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentEnrollments.map((e) => (
                <tr key={e.id} style={{ borderBottom: "1px solid var(--c-border)" }}>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-sans)" }}>
                    <div style={{ color: "var(--c-t1)", fontWeight: 600, fontSize: 12 }}>{e.user.name ?? "—"}</div>
                    <div style={{ color: "var(--c-t4)", fontSize: 10 }}>{e.user.email}</div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--c-t2)", fontSize: 12, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--font-sans)" }}>{e.course.title}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 700, fontSize: 12, color: e.course.isFree ? "var(--c-green)" : "var(--c-t1)", fontFamily: "var(--font-mono)" }}>
                    {e.course.isFree ? "FREE" : formatPrice(Number(e.course.price))}
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--c-t4)", fontSize: 10, fontFamily: "var(--font-mono)" }}>
                    {new Date(e.createdAt).toLocaleDateString("ru-RU")}
                  </td>
                </tr>
              ))}
              {recentEnrollments.length === 0 && (
                <tr><td colSpan={4} style={{ padding: "32px 16px", textAlign: "center", color: "var(--c-t3)", fontSize: 14 }}>Заявок пока нет</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
