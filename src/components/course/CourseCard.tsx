"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Users, Clock, Star, Award, Code } from "lucide-react";
import type { CourseCard as CourseCardType } from "@/types";
import { formatPrice, formatDuration } from "@/lib/utils";

interface Props { course: CourseCardType }

const LEVEL_COLOR: Record<string, string> = {
  BEGINNER:     "var(--c-green)",
  INTERMEDIATE: "var(--c-amber)",
  ADVANCED:     "var(--c-red)",
};
const LEVEL_LABELS: Record<string, string> = {
  BEGINNER:     "Начальный",
  INTERMEDIATE: "Средний",
  ADVANCED:     "Продвинутый",
};

const COURSE_TAGS: Record<string, string[]> = {
  javascript:    ["JavaScript", "ES6+"],
  react:         ["React", "Hooks"],
  typescript:    ["TypeScript"],
  "node.js":     ["Node.js", "Backend"],
  "next.js":     ["Next.js", "Fullstack"],
  python:        ["Python", "Backend"],
  git:           ["Git", "DevOps"],
  css:           ["CSS", "Tailwind"],
  docker:        ["Docker"],
  graphql:       ["GraphQL"],
  postgresql:    ["PostgreSQL"],
};

export function CourseCard({ course }: Props) {
  const accent = LEVEL_COLOR[course.level] ?? "var(--c-t3)";
  const tags = COURSE_TAGS[course.title.toLowerCase()] ?? [];

  return (
    <Link href={`/courses/${course.slug}`} className="course-card" style={{ display: "flex", flexDirection: "column", textDecoration: "none", background: "var(--c-s1)", border: "1px solid var(--c-border)" }}>
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
          <div style={{
            width: "100%", height: "100%",
            background: "linear-gradient(135deg, var(--c-s1) 0%, var(--c-s2) 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
              <Code size={40} style={{ color: "var(--c-border-hi)", marginBottom: 8 }} />
              <p style={{ fontSize: 11, color: "var(--c-t4)", fontFamily: "var(--font-mono)" }}>Курс</p>
            </div>
          </div>
        )}

        {/* Level badge */}
        <span style={{
          position: "absolute", top: 10, left: 10,
          fontSize: 10, fontWeight: 900, letterSpacing: "0.08em",
          padding: "4px 10px", fontFamily: "var(--font-mono)",
          background: "rgba(14,12,10,0.85)", backdropFilter: "blur(4px)",
          color: accent, border: `1px solid ${accent}44`,
          borderRadius: 12,
        }}>
          {LEVEL_LABELS[course.level] ?? course.level}
        </span>

        {/* Free badge */}
        {course.isFree && (
          <span style={{
            position: "absolute", top: 10, right: 10,
            fontSize: 10, fontWeight: 900, letterSpacing: "0.06em",
            padding: "4px 10px", fontFamily: "var(--font-mono)",
            background: "rgba(31,158,110,0.9)", color: "#fff",
            borderRadius: 12,
          }}>
            FREE
          </span>
        )}

        {/* Image overlay */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
          background: "linear-gradient(to top, var(--c-s1), transparent)",
          pointerEvents: "none",
        }} />
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

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {tags.map(tag => (
              <span key={tag} style={{
                fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 700,
                padding: "2px 8px", borderRadius: 4,
                background: "var(--c-s2)", color: "var(--c-t3)",
                border: "1px solid var(--c-border)",
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--c-t3)", fontFamily: "var(--font-mono)" }}>
            <Users size={11} /> {course._count.enrollments}
          </span>
          {course.avgRating && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--c-amber)", fontFamily: "var(--font-mono)" }}>
              <Star size={11} style={{ fill: "var(--c-amber)" }} /> {course.avgRating.toFixed(1)}
            </span>
          )}
          {course._count.reviews > 0 && (
            <span style={{ fontSize: 12, color: "var(--c-t3)", fontFamily: "var(--font-mono)" }}>
              ({course._count.reviews})
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
              overflow: "hidden",
            }}>
              {course.instructor.image ? (
                <Image
                  src={course.instructor.image}
                  alt={course.instructor.name ?? ""}
                  width={22}
                  height={22}
                  unoptimized
                  style={{ objectFit: "cover" }}
                />
              ) : (
                (course.instructor.name ?? "?")[0].toUpperCase()
              )}
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
    </Link>
  );
}
