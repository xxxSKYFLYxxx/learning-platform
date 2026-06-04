"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, completed: true }),
    });
    setCompleted(true);
    setLoading(false);
    router.refresh();
    if (nextLessonHref) {
      setTimeout(() => router.push(nextLessonHref), 400);
    }
  };

  return (
    <button
      onClick={handleComplete}
      disabled={completed || loading}
      className={cn(
        "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
        completed
          ? "bg-success/10 text-success cursor-default"
          : "bg-primary text-white hover:bg-primary/90"
      )}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <CheckCircle className="w-4 h-4" />
      )}
      {completed ? "Урок завершён" : "Отметить как пройденный"}
    </button>
  );
}
