import { createCourse } from "@/app/admin/actions";

export const metadata = { title: "Admin — Новый курс" };

export default function NewCoursePage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-[10px] font-black tracking-[0.25em] text-[#787068] mb-1" style={{ fontFamily: "var(--font-mono)" }}>КУРСЫ / НОВЫЙ</p>
        <h1 className="text-3xl font-black text-[#0F0F0F]" style={{ fontFamily: "var(--font-display)" }}>Создать курс</h1>
      </div>

      <form action={createCourse} className="flex flex-col gap-5">
        <div className="bg-white border-2 border-[#0F0F0F] p-6 flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-[#787068] mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
              Название *
            </label>
            <input
              name="title"
              required
              placeholder="Например: React с нуля до Pro"
              className="w-full px-4 py-3 border-2 border-[#0F0F0F] bg-[#FAFAF7] text-sm outline-none focus:bg-white transition-colors"
              style={{ fontFamily: "var(--font-sans)" }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-[#787068] mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
              Описание
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Краткое описание курса..."
              className="w-full px-4 py-3 border-2 border-[#0F0F0F] bg-[#FAFAF7] text-sm outline-none focus:bg-white transition-colors resize-none"
              style={{ fontFamily: "var(--font-sans)" }}
            />
          </div>

          {/* Level */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-[#787068] mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
              Уровень
            </label>
            <select
              name="level"
              className="w-full px-4 py-3 border-2 border-[#0F0F0F] bg-[#FAFAF7] text-sm outline-none focus:bg-white transition-colors"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <option value="BEGINNER">Начальный</option>
              <option value="INTERMEDIATE">Средний</option>
              <option value="ADVANCED">Продвинутый</option>
            </select>
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#787068] mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
                Цена (₽)
              </label>
              <input
                name="price"
                type="number"
                min="0"
                step="100"
                placeholder="4900"
                className="w-full px-4 py-3 border-2 border-[#0F0F0F] bg-[#FAFAF7] text-sm outline-none focus:bg-white transition-colors"
                style={{ fontFamily: "var(--font-mono)" }}
              />
            </div>
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isFree" className="w-4 h-4 border-2 border-[#0F0F0F] accent-[#D4402F]" />
                <span className="text-sm text-[#0F0F0F]" style={{ fontFamily: "var(--font-sans)" }}>Бесплатный курс</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-8 py-3 bg-[#0F0F0F] text-[#FAFAF7] text-sm font-black border-2 border-[#0F0F0F] shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Создать курс →
          </button>
          <a
            href="/admin/courses"
            className="px-6 py-3 text-sm text-[#787068] border-2 border-[#E0DDD8] hover:border-[#0F0F0F] transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Отмена
          </a>
        </div>
      </form>
    </div>
  );
}
