"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";

interface Props {
  lessonId: string;
  completed: boolean;
  nextLessonHref?: string;
}

export function CompleteButton({ lessonId, completed: initialCompleted, nextLessonHref }: Props) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    if (completed || loading) return;
    setLoading(true);
    let saved = false;
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, completed: true }),
      });
      saved = response.ok;
    } catch {
      // Demo/fallback lessons can be completed locally when the database is unavailable.
    }
    setCompleted(true);
    setLoading(false);
    if (saved) router.refresh();
    if (nextLessonHref) {
      setTimeout(() => router.push(nextLessonHref), 400);
    }
  };

  return (
    <button
      onClick={handleComplete}
      disabled={completed || loading}
      className={completed ? "" : "btn-red"}
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", fontSize: 14, fontWeight: 700,
        border: "none", fontFamily: "var(--font-display)",
        cursor: completed ? "default" : "pointer",
        ...(completed
          ? { background: "rgba(31,158,110,0.12)", color: "var(--c-green)" }
          : {}),
      }}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <CheckCircle size={16} />
      )}
      {completed ? "Урок завершён" : "Отметить как пройденный"}
    </button>
  );
}
