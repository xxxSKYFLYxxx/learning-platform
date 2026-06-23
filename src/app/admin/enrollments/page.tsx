import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Admin — Заявки" };

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Активна",
  COMPLETED: "Завершена",
  REFUNDED: "Возврат",
};

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  ACTIVE: { bg: "rgba(31,158,110,0.1)", text: "var(--c-green)", border: "var(--c-green)" },
  COMPLETED: { bg: "rgba(232,160,32,0.1)", text: "var(--c-amber)", border: "var(--c-amber)" },
  REFUNDED: { bg: "rgba(217,64,47,0.1)", text: "var(--c-red)", border: "var(--c-red)" },
};

export default async function AdminEnrollmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const activeStatus = params.status && params.status in STATUS_LABELS ? params.status : "ALL";
  const enrollments = await prisma.enrollment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true, price: true, isFree: true } },
    },
  });

  const statusCounts = enrollments.reduce((acc, e) => {
    acc[e.status] = (acc[e.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const visibleEnrollments = activeStatus === "ALL"
    ? enrollments
    : enrollments.filter((enrollment) => enrollment.status === activeStatus);

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <style>{`
        @media (max-width: 768px) {
          .enrollments-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .status-filters {
            flex-wrap: wrap;
            gap: 8px;
          }
          .status-filters a {
            padding: 6px 10px !important;
            font-size: 11px !important;
          }
          table {
            font-size: 12px;
          }
          th, td {
            padding: 8px 12px !important;
          }
        }
        @media (max-width: 480px) {
          .enrollments-table-wrapper {
            overflow-x: auto;
          }
        }
      `}</style>

      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.25em", color: "var(--c-t3)", marginBottom: 4, fontFamily: "var(--font-mono)" }}>УПРАВЛЕНИЕ</p>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)" }}>Заявки</h1>
        <p style={{ fontSize: 14, color: "var(--c-t3)", marginTop: 4, fontFamily: "var(--font-sans)" }}>
          Всего: <span style={{ color: "var(--c-t1)", fontWeight: 600 }}>{enrollments.length}</span>
        </p>
      </div>

      {/* Status Filter */}
      <div className="status-filters" style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <Link
          href="/admin/enrollments"
          style={{
            padding: "6px 12px",
            border: "1px solid var(--c-border-hi)",
            borderRadius: 4,
            background: activeStatus === "ALL" ? "var(--c-red)" : "transparent",
            color: activeStatus === "ALL" ? "var(--c-bg)" : "var(--c-t2)",
            fontSize: 12,
            fontWeight: 900,
            fontFamily: "var(--font-mono)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            textDecoration: "none"
          }}
        >
          Все ({enrollments.length})
        </Link>
        {Object.entries(STATUS_LABELS).map(([status, label]) => {
          const st = STATUS_STYLES[status];
          return (
            <Link
              key={status}
              href={`/admin/enrollments?status=${status}`}
              style={{
                padding: "6px 12px",
                border: `1px solid ${st.border}`,
                borderRadius: 4,
                background: activeStatus === status ? st.text : st.bg,
                color: activeStatus === status ? "var(--c-bg)" : st.text,
                fontSize: 12,
                fontWeight: 900,
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textDecoration: "none"
              }}
            >
              {label} ({statusCounts[status] ?? 0})
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="enrollments-table-wrapper" style={{ background: "var(--c-s1)", border: "1px solid var(--c-border)", borderRadius: 8 }}>
        <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--c-border-hi)" }}>
              {["Студент", "Курс", "Сумма", "Статус", "Дата"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--c-t3)", fontFamily: "var(--font-mono)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleEnrollments.map((e) => {
              const st = STATUS_STYLES[e.status] ?? { bg: "transparent", text: "var(--c-t3)", border: "var(--c-border)" };
              return (
                <tr key={e.id} data-status={e.status} className="enrollment-row" style={{ borderBottom: "1px solid var(--c-border)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ color: "var(--c-t1)", fontWeight: 600, fontSize: 13, fontFamily: "var(--font-sans)" }}>{e.user.name ?? "—"}</div>
                    <div style={{ color: "var(--c-t4)", fontSize: 11, fontFamily: "var(--font-sans)" }}>{e.user.email}</div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--c-t2)", fontSize: 12, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--font-sans)" }}>{e.course.title}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 700, fontSize: 12, color: e.course.isFree ? "var(--c-green)" : "var(--c-t1)", fontFamily: "var(--font-mono)" }}>
                    {e.course.isFree ? "FREE" : formatPrice(Number(e.course.price))}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 900,
                      padding: "4px 8px",
                      fontFamily: "var(--font-mono)",
                      border: `1px solid ${st.border}`,
                      color: st.text,
                      background: st.bg,
                      borderRadius: 4
                    }}>
                      {STATUS_LABELS[e.status] ?? e.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--c-t4)", fontSize: 11, fontFamily: "var(--font-mono)" }}>
                    {new Date(e.createdAt).toLocaleDateString("ru-RU")}
                  </td>
                </tr>
              );
            })}
            {visibleEnrollments.length === 0 && (
              <tr><td colSpan={5} style={{ padding: "32px 16px", textAlign: "center", color: "var(--c-t3)", fontSize: 14, fontFamily: "var(--font-sans)" }}>Заявок пока нет</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
