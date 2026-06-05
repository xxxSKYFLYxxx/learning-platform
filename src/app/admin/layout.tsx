import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex min-h-screen" style={{ background: "var(--c-bg)" }}>
      <AdminNav />
      <main className="flex-1 min-w-0 overflow-auto admin-dark" style={{ background: "var(--c-bg)" }}>{children}</main>
    </div>
  );
}
