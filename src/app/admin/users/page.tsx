import { prisma } from "@/lib/prisma";
import { updateUserRole } from "@/app/admin/actions";
import type { Role } from "@prisma/client";

export const metadata = { title: "Admin — Пользователи" };

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { enrollments: true } } },
  });

  const ROLES: Role[] = ["STUDENT", "INSTRUCTOR", "ADMIN"];
  const ROLE_LABELS: Record<Role, string> = { STUDENT: "Студент", INSTRUCTOR: "Преподаватель", ADMIN: "Админ" };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="text-[10px] font-black tracking-[0.25em] text-[#787068] mb-1" style={{ fontFamily: "var(--font-mono)" }}>УПРАВЛЕНИЕ</p>
        <h1 className="text-3xl font-black text-[#0F0F0F]" style={{ fontFamily: "var(--font-display)" }}>Пользователи</h1>
        <p className="text-sm text-[#787068] mt-1" style={{ fontFamily: "var(--font-sans)" }}>Всего: {users.length}</p>
      </div>

      <div className="bg-white border-2 border-[#0F0F0F]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[#0F0F0F] bg-[#FAFAF7]">
              {["Пользователь", "Роль", "Курсов", "Регистрация", "Действие"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider text-[#787068]" style={{ fontFamily: "var(--font-mono)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-[#E0DDD8] last:border-b-0 hover:bg-[#FAFAF7] transition-colors">
                <td className="px-4 py-3">
                  <div className="font-semibold text-[#0F0F0F] text-xs" style={{ fontFamily: "var(--font-sans)" }}>{user.name ?? "—"}</div>
                  <div className="text-[#787068] text-[10px]">{user.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-black px-2 py-0.5 border ${
                    user.role === "ADMIN" ? "border-[#D4402F] text-[#D4402F]" :
                    user.role === "INSTRUCTOR" ? "border-[#E8A020] text-[#E8A020]" :
                    "border-[#787068] text-[#787068]"
                  }`} style={{ fontFamily: "var(--font-mono)" }}>
                    {ROLE_LABELS[user.role]}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-center" style={{ fontFamily: "var(--font-mono)" }}>{user._count.enrollments}</td>
                <td className="px-4 py-3 text-[10px] text-[#787068]" style={{ fontFamily: "var(--font-mono)" }}>
                  {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                </td>
                <td className="px-4 py-3">
                  <form action={async (fd: FormData) => {
                    "use server";
                    const role = fd.get("role") as Role;
                    await updateUserRole(user.id, role);
                  }} className="flex items-center gap-2">
                    <select name="role" defaultValue={user.role} className="px-2 py-1 border border-[#E0DDD8] text-xs outline-none hover:border-[#0F0F0F] transition-colors" style={{ fontFamily: "var(--font-sans)" }}>
                      {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                    </select>
                    <button type="submit" className="px-2 py-1 bg-[#0F0F0F] text-[#FAFAF7] text-[10px] font-black border border-[#0F0F0F] hover:bg-[#D4402F] hover:border-[#D4402F] transition-colors" style={{ fontFamily: "var(--font-mono)" }}>
                      ✓
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
