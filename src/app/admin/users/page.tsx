import { prisma } from "@/lib/prisma";
import { updateUserRole } from "@/app/admin/actions";
import type { Role } from "@prisma/client";
import { Search } from "lucide-react";

export const metadata = { title: "Admin — Пользователи" };

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { enrollments: true } } },
  });

  const ROLES: Role[] = ["STUDENT", "INSTRUCTOR", "ADMIN"];
  const ROLE_LABELS: Record<Role, string> = { STUDENT: "Студент", INSTRUCTOR: "Преподаватель", ADMIN: "Админ" };
  const ROLE_COLORS: Record<Role, { bg: string; text: string; border: string }> = {
    ADMIN: { bg: "rgba(217,64,47,0.1)", text: "var(--c-red)", border: "var(--c-red)" },
    INSTRUCTOR: { bg: "rgba(232,160,32,0.1)", text: "var(--c-amber)", border: "var(--c-amber)" },
    STUDENT: { bg: "rgba(31,158,110,0.1)", text: "var(--c-green)", border: "var(--c-green)" },
  };

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <style>{`
        @media (max-width: 768px) {
          .users-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .search-box {
            width: 100%;
          }
          table {
            font-size: 12px;
          }
          th, td {
            padding: 8px 12px !important;
          }
          .role-select-form {
            flex-direction: column;
            gap: 4px;
          }
        }
        @media (max-width: 480px) {
          .user-table-wrapper {
            overflow-x: auto;
          }
        }
      `}</style>

      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.25em", color: "var(--c-t3)", marginBottom: 4, fontFamily: "var(--font-mono)" }}>УПРАВЛЕНИЕ</p>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)" }}>Пользователи</h1>
        <p style={{ fontSize: 14, color: "var(--c-t3)", marginTop: 4, fontFamily: "var(--font-sans)" }}>
          Всего: <span style={{ color: "var(--c-t1)", fontWeight: 600 }}>{users.length}</span>
        </p>
      </div>

      {/* Search */}
      <div className="search-box" style={{ marginBottom: 24, position: "relative" }}>
        <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--c-t3)" }} />
        <input
          id="user-search"
          type="text"
          placeholder="Поиск по имени или email..."
          style={{
            width: "100%",
            padding: "10px 12px 10px 36px",
            background: "var(--c-s2)",
            border: "1px solid var(--c-border)",
            borderRadius: 4,
            color: "var(--c-t1)",
            fontSize: 14,
            fontFamily: "var(--font-sans)"
          }}
        />
      </div>

      {/* Table */}
      <div className="user-table-wrapper" style={{ background: "var(--c-s1)", border: "1px solid var(--c-border)", borderRadius: 8 }}>
        <table id="users-table" style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--c-border-hi)" }}>
              {["Пользователь", "Роль", "Курсов", "Регистрация", "Действие"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--c-t3)", fontFamily: "var(--font-mono)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody id="users-tbody">
            {users.map((user) => {
              const rc = ROLE_COLORS[user.role];
              return (
                <tr key={user.id} data-search={`${(user.name ?? "").toLowerCase()} ${user.email.toLowerCase()}`} style={{ borderBottom: "1px solid var(--c-border)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ color: "var(--c-t1)", fontWeight: 600, fontSize: 13, fontFamily: "var(--font-sans)" }}>{user.name ?? "—"}</div>
                    <div style={{ color: "var(--c-t4)", fontSize: 11, fontFamily: "var(--font-sans)" }}>{user.email}</div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 900,
                      padding: "4px 8px",
                      fontFamily: "var(--font-mono)",
                      border: `1px solid ${rc.border}`,
                      color: rc.text,
                      background: rc.bg,
                      borderRadius: 4
                    }}>
                      {ROLE_LABELS[user.role]}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--c-t2)", fontSize: 12, textAlign: "center", fontFamily: "var(--font-mono)" }}>{user._count.enrollments}</td>
                  <td style={{ padding: "12px 16px", color: "var(--c-t4)", fontSize: 11, fontFamily: "var(--font-mono)" }}>
                    {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <form action={async (fd: FormData) => {
                      "use server";
                      const role = fd.get("role") as Role;
                      await updateUserRole(user.id, role);
                    }} className="role-select-form" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <select name="role" defaultValue={user.role} style={{
                        padding: "4px 8px",
                        border: "1px solid var(--c-border)",
                        borderRadius: 4,
                        color: "var(--c-t1)",
                        background: "var(--c-s2)",
                        fontSize: 12,
                        fontFamily: "var(--font-sans)",
                        cursor: "pointer"
                      }}>
                        {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                      </select>
                      <button type="submit" style={{
                        padding: "4px 10px",
                        background: "var(--c-red)",
                        color: "var(--c-bg)",
                        fontSize: 10,
                        fontWeight: 900,
                        border: "1px solid var(--c-red)",
                        borderRadius: 4,
                        fontFamily: "var(--font-mono)",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}>
                        ✓
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr><td colSpan={5} style={{ padding: "32px 16px", textAlign: "center", color: "var(--c-t3)", fontSize: 14, fontFamily: "var(--font-sans)" }}>Пользователей пока нет</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Client-side search script */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          const search = document.getElementById('user-search');
          const rows = document.querySelectorAll('#users-tbody tr[data-search]');
          search.addEventListener('input', function() {
            const q = this.value.toLowerCase();
            rows.forEach(row => {
              const match = row.dataset.search.includes(q);
              row.style.display = match ? '' : 'none';
            });
          });
        })();
      ` }} />
    </div>
  );
}