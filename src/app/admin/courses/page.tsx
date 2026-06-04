import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { togglePublish, deleteCourse } from "@/app/admin/actions";
import { Eye, EyeOff, Pencil, Plus } from "lucide-react";

export const metadata = { title: "Admin — Курсы" };

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      instructor: { select: { name: true } },
      _count: { select: { enrollments: true, modules: true } },
    },
  });

  const LEVEL: Record<string, string> = {
    BEGINNER: "Начальный",
    INTERMEDIATE: "Средний",
    ADVANCED: "Продвинутый",
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[10px] font-black tracking-[0.25em] text-[#787068] mb-1" style={{ fontFamily: "var(--font-mono)" }}>УПРАВЛЕНИЕ</p>
          <h1 className="text-3xl font-black text-[#0F0F0F]" style={{ fontFamily: "var(--font-display)" }}>Курсы</h1>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F0F0F] text-[#FAFAF7] text-sm font-black border-2 border-[#0F0F0F] shadow-brutal-r hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <Plus className="w-4 h-4" /> Новый курс
        </Link>
      </div>

      <div className="bg-white border-2 border-[#0F0F0F]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[#0F0F0F] bg-[#FAFAF7]">
              {["Название", "Уровень", "Цена", "Студентов", "Модулей", "Статус", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider text-[#787068]" style={{ fontFamily: "var(--font-mono)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b border-[#E0DDD8] last:border-b-0 hover:bg-[#FAFAF7] transition-colors">
                <td className="px-4 py-3">
                  <div className="font-semibold text-[#0F0F0F] text-xs" style={{ fontFamily: "var(--font-sans)" }}>{course.title}</div>
                  <div className="text-[#787068] text-[10px]" style={{ fontFamily: "var(--font-mono)" }}>{course.slug}</div>
                </td>
                <td className="px-4 py-3 text-xs text-[#787068]" style={{ fontFamily: "var(--font-sans)" }}>{LEVEL[course.level]}</td>
                <td className="px-4 py-3 text-xs font-bold" style={{ fontFamily: "var(--font-mono)" }}>
                  {course.isFree ? "FREE" : formatPrice(Number(course.price))}
                </td>
                <td className="px-4 py-3 text-xs text-center" style={{ fontFamily: "var(--font-mono)" }}>{course._count.enrollments}</td>
                <td className="px-4 py-3 text-xs text-center" style={{ fontFamily: "var(--font-mono)" }}>{course._count.modules}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-black px-2 py-0.5 border border-current ${course.published ? "text-[#1A9E6E]" : "text-[#787068]"}`} style={{ fontFamily: "var(--font-mono)" }}>
                    {course.published ? "LIVE" : "DRAFT"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/courses/${course.id}`} className="p-1.5 border border-[#E0DDD8] hover:border-[#0F0F0F] transition-colors">
                      <Pencil className="w-3.5 h-3.5 text-[#787068]" />
                    </Link>
                    <form action={togglePublish.bind(null, course.id)}>
                      <button type="submit" className="p-1.5 border border-[#E0DDD8] hover:border-[#0F0F0F] transition-colors">
                        {course.published ? <EyeOff className="w-3.5 h-3.5 text-[#787068]" /> : <Eye className="w-3.5 h-3.5 text-[#787068]" />}
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {courses.length === 0 && (
          <div className="p-12 text-center text-[#787068] text-sm">Курсов пока нет</div>
        )}
      </div>
    </div>
  );
}
