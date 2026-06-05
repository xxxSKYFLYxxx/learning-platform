"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import type { CourseCard as CourseCardType } from "@/types";
import { formatPrice } from "@/lib/utils";

interface Props {
  course: CourseCardType;
}

const LEVEL_ACCENT: Record<string, string> = {
  BEGINNER:     "#1EA876",
  INTERMEDIATE: "#E8A020",
  ADVANCED:     "#E8351D",
};

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER:     "Начальный",
  INTERMEDIATE: "Средний",
  ADVANCED:     "Продвинутый",
};

export function CourseCard({ course }: Props) {
  const accent = LEVEL_ACCENT[course.level] ?? "#6E675E";

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col course-card"
    >
      {/* Level strip */}
      <div className="h-0.5" style={{ background: accent, opacity: 0.6 }} />

      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden" style={{ background: "#0D0B09" }}>
        {course.imageUrl ? (
          <Image
            src={course.imageUrl}
            alt={course.title}
            fill
            unoptimized
            className="object-cover opacity-60 transition-all duration-500 group-hover:opacity-85 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 opacity-10" style={{ color: "#F0EBE3" }} />
          </div>
        )}

        {/* Level badge */}
        <div className="absolute top-3 left-3">
          <span
            className="text-[9px] font-black uppercase tracking-widest px-2 py-1"
            style={{
              fontFamily: "var(--font-mono)",
              background: "#0D0B09",
              color: accent,
              border: `1px solid ${accent}66`,
            }}
          >
            {LEVEL_LABELS[course.level] ?? course.level}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3
          className="font-black text-base leading-snug transition-colors duration-200 group-hover:text-[#E8351D]"
          style={{ fontFamily: "var(--font-display)", color: "#F0EBE3" }}
        >
          {course.title}
        </h3>

        {course.description && (
          <p
            className="text-sm leading-relaxed line-clamp-2"
            style={{ fontFamily: "var(--font-sans)", color: "#6E675E" }}
          >
            {course.description}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between" style={{ borderTop: "1px solid #262220" }}>
          <div className="flex items-center gap-3 text-xs" style={{ fontFamily: "var(--font-mono)", color: "#6E675E" }}>
            <span>{course._count.enrollments} уч.</span>
            {course._count.reviews > 0 && course.avgRating && (
              <span style={{ color: "#E8A020" }}>★ {course.avgRating.toFixed(1)}</span>
            )}
          </div>
          <span
            className="font-black text-base"
            style={{ fontFamily: "var(--font-mono)", color: course.isFree ? "#1EA876" : "#F0EBE3" }}
          >
            {course.isFree ? "FREE" : formatPrice(Number(course.price))}
          </span>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
            style={{ background: "#262220", color: "#9A9088", fontFamily: "var(--font-display)" }}
          >
            {(course.instructor.name ?? "?")[0].toUpperCase()}
          </div>
          <span className="text-xs truncate" style={{ fontFamily: "var(--font-sans)", color: "#6E675E" }}>
            {course.instructor.name}
          </span>
        </div>
      </div>
    </Link>
  );
}
