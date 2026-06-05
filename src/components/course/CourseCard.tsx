"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, Users } from "lucide-react";
import type { CourseCard as CourseCardType } from "@/types";
import { formatPrice } from "@/lib/utils";

interface Props { course: CourseCardType }

const LEVEL_COLOR: Record<string, string> = {
  BEGINNER:     "var(--c-green)",
  INTERMEDIATE: "var(--c-amber)",
  ADVANCED:     "var(--c-red)",
};
const LEVEL_BG: Record<string, string> = {
  BEGINNER:     "rgba(31,158,110,0.12)",
  INTERMEDIATE: "rgba(200,138,32,0.12)",
  ADVANCED:     "rgba(208,57,42,0.12)",
};
const LEVEL_LABELS: Record<string, string> = {
  BEGINNER:     "Начальный",
  INTERMEDIATE: "Средний",
  ADVANCED:     "Продвинутый",
};

export function CourseCard({ course }: Props) {
  const accent = LEVEL_COLOR[course.level] ?? "var(--c-t3)";
  const accentBg = LEVEL_BG[course.level] ?? "transparent";

  return (
    <Link href={`/courses/${course.slug}`} className="course-card" style={{ display: "flex", flexDirection: "column", textDecoration: "none" }}>
      {/* Thumbnail */}
      <div style={{ position: "relative", aspectRatio: "16/9", background: "var(--c-bg)", overflow: "hidden" }}>
        {course.imageUrl ? (
          <Image
            src={course.imageUrl} alt={course.title}
            fill unoptimized
            style={{ objectFit: "cover", opacity: 0.65, transition: "opacity 0.4s, transform 0.5s" }}
            className="card-img"
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BookOpen size={32} style={{ color: "var(--c-border-hi)" }} />
          </div>
        )}

        {/* Level badge */}
        <span style={{
          position: "absolute", top: 12, left: 12,
          fontSize: 10, fontWeight: 900, letterSpacing: "0.12em",
          padding: "3px 8px", fontFamily: "var(--font-mono)",
          background: "rgba(14,12,10,0.85)",
          color: accent, border: `1px solid ${accent}55`,
        }}>
          {LEVEL_LABELS[course.level] ?? course.level}
        </span>

        {/* Free badge */}
        {course.isFree && (
          <span style={{
            position: "absolute", top: 12, right: 12,
            fontSize: 10, fontWeight: 900, letterSpacing: "0.08em",
            padding: "3px 8px", fontFamily: "var(--font-mono)",
            background: "rgba(31,158,110,0.9)", color: "#fff",
          }}>FREE</span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <h3 style={{
          fontFamily: "var(--font-display)", fontWeight: 900,
          fontSize: 15, lineHeight: 1.3, color: "var(--c-t1)",
          margin: 0, transition: "color 0.2s",
        }}>
          {course.title}
        </h3>

        {course.description && (
          <p style={{
            fontSize: 13, lineHeight: 1.6, color: "var(--c-t3)",
            fontFamily: "var(--font-sans)", margin: 0,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {course.description}
          </p>
        )}

        {/* Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--c-t3)", fontFamily: "var(--font-mono)" }}>
            <Users size={11} /> {course._count.enrollments}
          </span>
          {course.avgRating && (
            <span style={{ fontSize: 12, color: "var(--c-amber)", fontFamily: "var(--font-mono)" }}>
              ★ {course.avgRating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid var(--c-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Instructor */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%",
              background: "var(--c-s3)", color: "var(--c-t2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 900, fontFamily: "var(--font-display)", flexShrink: 0,
            }}>
              {(course.instructor.name ?? "?")[0].toUpperCase()}
            </div>
            <span style={{ fontSize: 12, color: "var(--c-t3)", fontFamily: "var(--font-sans)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {course.instructor.name}
            </span>
          </div>

          {/* Price */}
          <span style={{
            fontFamily: "var(--font-mono)", fontWeight: 900,
            fontSize: 15, color: course.isFree ? "var(--c-green)" : "var(--c-t1)",
          }}>
            {course.isFree ? "FREE" : formatPrice(Number(course.price))}
          </span>
        </div>
      </div>

      <style>{`
        .course-card:hover .card-img { opacity: 0.9 !important; transform: scale(1.04); }
      `}</style>
    </Link>
  );
}
