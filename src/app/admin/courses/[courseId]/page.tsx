import { notFound } from "next/navigation";
import Link from "next/link";
import { Trash2, Plus, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  updateCourse,
  togglePublish,
  deleteCourse,
  createModule,
  deleteModule,
  createLesson,
  deleteLesson,
} from "@/app/admin/actions";

export async function generateMetadata({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { title: true } });
  return { title: `Admin — ${course?.title ?? "Курс"}` };
}

export default async function AdminCourseEditPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: { select: { name: true } },
      modules: {
        orderBy: { sortOrder: "asc" },
        include: { lessons: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });
  if (!course) notFound();

  const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <p className="text-[10px] font-black tracking-[0.25em] text-[#787068] mb-1" style={{ fontFamily: "var(--font-mono)" }}>
            <Link href="/admin/courses" className="hover:text-[#0F0F0F]">КУРСЫ</Link> / РЕДАКТИРОВАТЬ
          </p>
          <h1 className="text-2xl font-black text-[#0F0F0F]" style={{ fontFamily: "var(--font-display)" }}>{course.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-[10px] font-black px-2 py-0.5 border ${course.published ? "border-[#1A9E6E] text-[#1A9E6E]" : "border-[#787068] text-[#787068]"}`} style={{ fontFamily: "var(--font-mono)" }}>
              {course.published ? "LIVE" : "DRAFT"}
            </span>
            <span className="text-xs text-[#787068]" style={{ fontFamily: "var(--font-mono)" }}>{totalLessons} уроков</span>
            <Link href={`/courses/${course.slug}`} target="_blank" className="text-xs text-[#D4402F] flex items-center gap-1 hover:underline" style={{ fontFamily: "var(--font-sans)" }}>
              <ExternalLink className="w-3 h-3" /> Открыть
            </Link>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <form action={togglePublish.bind(null, courseId)}>
            <button type="submit" className={`px-4 py-2 text-xs font-black border-2 transition-all ${course.published ? "border-[#787068] text-[#787068] hover:border-[#0F0F0F] hover:text-[#0F0F0F]" : "bg-[#1A9E6E] text-white border-[#1A9E6E]"}`} style={{ fontFamily: "var(--font-display)" }}>
              {course.published ? "Снять с публикации" : "Опубликовать"}
            </button>
          </form>
          <form action={deleteCourse.bind(null, courseId)}>
            <button type="submit" className="px-4 py-2 text-xs font-black border-2 border-[#D4402F] text-[#D4402F] hover:bg-[#D4402F] hover:text-white transition-all" style={{ fontFamily: "var(--font-display)" }}>
              Удалить
            </button>
          </form>
        </div>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        {/* Left: Edit form */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-[#787068] mb-3" style={{ fontFamily: "var(--font-mono)" }}>Основные данные</h2>
          <form action={updateCourse.bind(null, courseId)} className="bg-white border-2 border-[#0F0F0F] p-5 flex flex-col gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#787068] mb-1" style={{ fontFamily: "var(--font-mono)" }}>Название</label>
              <input name="title" defaultValue={course.title} required className="w-full px-3 py-2 border-2 border-[#0F0F0F] bg-[#FAFAF7] text-sm outline-none focus:bg-white" style={{ fontFamily: "var(--font-sans)" }} />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#787068] mb-1" style={{ fontFamily: "var(--font-mono)" }}>Описание</label>
              <textarea name="description" defaultValue={course.description ?? ""} rows={3} className="w-full px-3 py-2 border-2 border-[#0F0F0F] bg-[#FAFAF7] text-sm outline-none focus:bg-white resize-none" style={{ fontFamily: "var(--font-sans)" }} />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#787068] mb-1" style={{ fontFamily: "var(--font-mono)" }}>Уровень</label>
              <select name="level" defaultValue={course.level} className="w-full px-3 py-2 border-2 border-[#0F0F0F] bg-[#FAFAF7] text-sm outline-none focus:bg-white" style={{ fontFamily: "var(--font-sans)" }}>
                <option value="BEGINNER">Начальный</option>
                <option value="INTERMEDIATE">Средний</option>
                <option value="ADVANCED">Продвинутый</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#787068] mb-1" style={{ fontFamily: "var(--font-mono)" }}>Цена (₽)</label>
                <input name="price" type="number" defaultValue={course.price ? Number(course.price) : ""} min="0" className="w-full px-3 py-2 border-2 border-[#0F0F0F] bg-[#FAFAF7] text-sm outline-none focus:bg-white" style={{ fontFamily: "var(--font-mono)" }} />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isFree" defaultChecked={course.isFree} className="w-4 h-4 accent-[#D4402F]" />
                  <span className="text-xs" style={{ fontFamily: "var(--font-sans)" }}>Бесплатный</span>
                </label>
              </div>
            </div>
            <button type="submit" className="px-5 py-2.5 bg-[#0F0F0F] text-[#FAFAF7] text-xs font-black border-2 border-[#0F0F0F] shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all" style={{ fontFamily: "var(--font-display)" }}>
              Сохранить
            </button>
          </form>
        </div>

        {/* Right: Modules & Lessons */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#787068]" style={{ fontFamily: "var(--font-mono)" }}>Программа курса</h2>
          </div>

          {/* Add module form */}
          <form action={createModule.bind(null, courseId)} className="flex gap-2 mb-4">
            <input name="title" required placeholder="Название модуля..." className="flex-1 px-3 py-2 border-2 border-[#0F0F0F] bg-white text-sm outline-none" style={{ fontFamily: "var(--font-sans)" }} />
            <button type="submit" className="px-4 py-2 bg-[#0F0F0F] text-[#FAFAF7] text-xs font-black border-2 border-[#0F0F0F] shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all" style={{ fontFamily: "var(--font-display)" }}>
              <Plus className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col gap-3">
            {course.modules.map((mod) => (
              <div key={mod.id} className="bg-white border-2 border-[#0F0F0F]">
                {/* Module header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#E0DDD8] bg-[#FAFAF7]">
                  <div>
                    <span className="text-sm font-semibold text-[#0F0F0F]" style={{ fontFamily: "var(--font-sans)" }}>{mod.title}</span>
                    <span className="ml-2 text-[10px] text-[#787068]" style={{ fontFamily: "var(--font-mono)" }}>{mod.lessons.length} уроков</span>
                  </div>
                  <form action={deleteModule.bind(null, mod.id, courseId)}>
                    <button type="submit" className="p-1 text-[#787068] hover:text-[#D4402F] transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

                {/* Lessons */}
                {mod.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between px-4 py-2.5 border-b border-[#E0DDD8] last:border-b-0">
                    <div className="flex items-center gap-2 text-xs" style={{ fontFamily: "var(--font-sans)" }}>
                      <span className="text-[#0F0F0F]">{lesson.title}</span>
                      {lesson.isFree && <span className="text-[10px] text-[#1A9E6E] border border-[#1A9E6E] px-1" style={{ fontFamily: "var(--font-mono)" }}>FREE</span>}
                      {lesson.muxPlaybackId && <span className="text-[10px] text-[#E8A020] border border-[#E8A020] px-1" style={{ fontFamily: "var(--font-mono)" }}>VIDEO</span>}
                    </div>
                    <form action={deleteLesson.bind(null, lesson.id, courseId)}>
                      <button type="submit" className="p-1 text-[#787068] hover:text-[#D4402F] transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </form>
                  </div>
                ))}

                {/* Add lesson form */}
                <form action={createLesson.bind(null, mod.id, courseId)} className="flex gap-2 p-3 bg-[#FAFAF7] border-t border-[#E0DDD8]">
                  <input name="title" required placeholder="Название урока..." className="flex-1 px-3 py-1.5 border border-[#E0DDD8] bg-white text-xs outline-none focus:border-[#0F0F0F]" style={{ fontFamily: "var(--font-sans)" }} />
                  <label className="flex items-center gap-1.5 text-[10px] text-[#787068] cursor-pointer" style={{ fontFamily: "var(--font-mono)" }}>
                    <input type="checkbox" name="isFree" className="w-3 h-3 accent-[#1A9E6E]" />
                    free
                  </label>
                  <button type="submit" className="px-3 py-1.5 bg-[#0F0F0F] text-[#FAFAF7] text-[10px] font-black border border-[#0F0F0F]" style={{ fontFamily: "var(--font-mono)" }}>
                    + урок
                  </button>
                </form>
              </div>
            ))}

            {course.modules.length === 0 && (
              <p className="text-sm text-[#787068] text-center py-8 border-2 border-dashed border-[#E0DDD8]" style={{ fontFamily: "var(--font-sans)" }}>
                Добавьте первый модуль выше
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
