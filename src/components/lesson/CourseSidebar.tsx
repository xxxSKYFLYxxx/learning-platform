"use client";

import Link from "next/link";
import { CheckCircle, PlayCircle, Lock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
    <aside className="flex flex-col h-full overflow-y-auto bg-white border-r border-gray-100">
      <div className="flex flex-col divide-y divide-gray-50">
        {modules.map((mod) => {
          const completedCount = mod.lessons.filter((l) => l.completed).length;
          const isOpen = open[mod.id];

          return (
            <div key={mod.id}>
              <button
                onClick={() => setOpen((prev) => ({ ...prev, [mod.id]: !prev[mod.id] }))}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">{mod.title}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {completedCount}/{mod.lessons.length} пройдено
                  </p>
                </div>
                <ChevronDown
                  className={cn("w-4 h-4 text-muted shrink-0 ml-2 transition-transform", isOpen && "rotate-180")}
                />
              </button>

              {isOpen && (
                <div className="flex flex-col">
                  {mod.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    const accessible = enrolled || lesson.isFree;

                    return accessible ? (
                      <Link
                        key={lesson.id}
                        href={`/learn/${courseSlug}/${lesson.id}`}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                          isActive
                            ? "bg-primary/5 text-primary border-r-2 border-primary"
                            : "text-muted hover:bg-surface hover:text-text"
                        )}
                      >
                        <span className="shrink-0">
                          {lesson.completed ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <PlayCircle className={cn("w-4 h-4", isActive ? "text-primary" : "text-gray-300")} />
                          )}
                        </span>
                        <span className="flex-1 line-clamp-2 leading-snug">{lesson.title}</span>
                        {lesson.duration && (
                          <span className="text-xs text-muted shrink-0">{formatSec(lesson.duration)}</span>
                        )}
                      </Link>
                    ) : (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 cursor-not-allowed"
                      >
                        <Lock className="w-4 h-4 shrink-0" />
                        <span className="flex-1 line-clamp-2 leading-snug">{lesson.title}</span>
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
