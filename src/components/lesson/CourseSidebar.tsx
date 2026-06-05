"use client";

import Link from "next/link";
import { CheckCircle, PlayCircle, Lock, ChevronDown } from "lucide-react";
import { useState } from "react";

interface Lesson {
  id: string;
  title: string;
  duration: number | null;
  isFree: boolean;
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Props {
  courseSlug: string;
  modules: Module[];
  activeLessonId: string;
  enrolled: boolean;
}

function formatSec(s: number | null) {
  if (!s) return "";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export function CourseSidebar({ courseSlug, modules, activeLessonId, enrolled }: Props) {
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    modules.forEach((m) => {
      initial[m.id] = m.lessons.some((l) => l.id === activeLessonId);
    });
    return initial;
  });

  return (
    <aside style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", background: "var(--c-s1)" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {modules.map((mod) => {
          const completedCount = mod.lessons.filter((l) => l.completed).length;
          const isOpen = open[mod.id];

          return (
            <div key={mod.id} style={{ borderBottom: "1px solid var(--c-border)" }}>
              <button
                onClick={() => setOpen((prev) => ({ ...prev, [mod.id]: !prev[mod.id] }))}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", textAlign: "left", background: "transparent", border: "none", cursor: "pointer" }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--c-t1)", fontFamily: "var(--font-sans)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{mod.title}</p>
                  <p style={{ fontSize: 11, color: "var(--c-t3)", marginTop: 2, fontFamily: "var(--font-mono)" }}>
                    {completedCount}/{mod.lessons.length} пройдено
                  </p>
                </div>
                <ChevronDown size={16} style={{ color: "var(--c-t3)", flexShrink: 0, marginLeft: 8, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }} />
              </button>

              {isOpen && (
                <div style={{ display: "flex", flexDirection: "column", paddingBottom: 6 }}>
                  {mod.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    const accessible = enrolled || lesson.isFree;

                    return accessible ? (
                      <Link
                        key={lesson.id}
                        href={`/learn/${courseSlug}/${lesson.id}`}
                        style={{
                          display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", fontSize: 13, textDecoration: "none", fontFamily: "var(--font-sans)",
                          background: isActive ? "var(--c-red-lo)" : "transparent",
                          color: isActive ? "var(--c-t1)" : "var(--c-t3)",
                          borderRight: isActive ? "2px solid var(--c-red)" : "2px solid transparent",
                        }}
                      >
                        <span style={{ flexShrink: 0 }}>
                          {lesson.completed ? (
                            <CheckCircle size={16} style={{ color: "var(--c-green)" }} />
                          ) : (
                            <PlayCircle size={16} style={{ color: isActive ? "var(--c-red)" : "var(--c-border-hi)" }} />
                          )}
                        </span>
                        <span style={{ flex: 1, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{lesson.title}</span>
                        {lesson.duration && (
                          <span style={{ fontSize: 11, color: "var(--c-t4)", flexShrink: 0, fontFamily: "var(--font-mono)" }}>{formatSec(lesson.duration)}</span>
                        )}
                      </Link>
                    ) : (
                      <div key={lesson.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", fontSize: 13, color: "var(--c-t4)", cursor: "not-allowed", fontFamily: "var(--font-sans)" }}>
                        <Lock size={16} style={{ flexShrink: 0 }} />
                        <span style={{ flex: 1, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{lesson.title}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
