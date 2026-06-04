import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import type { CourseCard as CourseCardType } from "@/types";
import { formatPrice } from "@/lib/utils";

interface Props {
  course: CourseCardType;
}

const LEVEL_BG: Record<string, string> = {
  BEGINNER:     "#B8E8C8",
  INTERMEDIATE: "#FFE08A",
  ADVANCED:     "#FFB3AA",
};

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER:     "Начальный",
  INTERMEDIATE: "Средний",
  ADVANCED:     "Продвинутый",
};

export function CourseCard({ course }: Props) {
  const levelBg = LEVEL_BG[course.level] ?? "#E0DDD8";

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col bg-white border-2 border-[#0F0F0F] shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150"
    >
      {/* Level colour strip */}
      <div
        className="h-1.5 border-b-2 border-[#0F0F0F]"
        style={{ backgroundColor: levelBg }}
      />

      {/* Thumbnail */}
      <div className="relative aspect-video border-b-2 border-[#0F0F0F]" style={{ backgroundColor: levelBg + "55" }}>
        {course.imageUrl ? (
          <Image src={course.imageUrl} alt={course.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-[#0F0F0F]/20" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Level tag */}
        <span
          className="self-start text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border border-[#0F0F0F]"
          style={{ backgroundColor: levelBg, fontFamily: "var(--font-mono)" }}
        >
          {LEVEL_LABELS[course.level] ?? course.level}
        </span>

        <h3
          className="font-black text-base leading-snug text-[#0F0F0F] group-hover:text-[#D4402F] transition-colors"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {course.title}
        </h3>

        {course.description && (
          <p
            className="text-sm text-[#787068] line-clamp-2 leading-relaxed"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {course.description}
          </p>
        )}

        <div className="mt-auto pt-3 border-t-2 border-[#0F0F0F]/10 flex items-center justify-between">
          <div
            className="flex items-center gap-3 text-xs text-[#787068]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span>{course._count.enrollments}⟳</span>
            {course._count.reviews > 0 && course.avgRating && (
              <span>★{course.avgRating.toFixed(1)}</span>
            )}
          </div>
          <span
            className="font-black text-base text-[#0F0F0F]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {course.isFree ? "FREE" : formatPrice(Number(course.price))}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border-2 border-[#0F0F0F] flex items-center justify-center text-[10px] font-black bg-[#FAFAF7]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {(course.instructor.name ?? "?")[0].toUpperCase()}
          </div>
          <span className="text-xs text-[#787068]" style={{ fontFamily: "var(--font-sans)" }}>
            {course.instructor.name}
          </span>
        </div>
      </div>
    </Link>
  );
}
