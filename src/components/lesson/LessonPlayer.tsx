"use client";

/**
 * Kinescope Player — российский видеохостинг
 * Документация: https://kinescope.io/docs/player
 */
import { useCallback, useRef, useEffect } from "react";
import { getEmbedUrl } from "@/lib/kinescope";

interface Props {
  videoId: string; // Kinescope video ID
  lessonId: string;
  initialTime?: number;
  onComplete?: () => void;
}

const SAVE_INTERVAL_MS = 10_000; // Сохраняем прогресс каждые 10 секунд

export function LessonPlayer({ videoId, lessonId, onComplete }: Props) {
  const savedAtRef    = useRef(0);
  const completedRef  = useRef(false);
  const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null);

  const saveProgress = useCallback(
    async (watchedSeconds: number, completed = false) => {
      await fetch("/api/progress", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ lessonId, watchedSeconds, completed }),
      });
    },
    [lessonId]
  );

  // Heartbeat — сохраняем прогресс пока видео воспроизводится
  useEffect(() => {
    timerRef.current = setInterval(() => {
      savedAtRef.current += SAVE_INTERVAL_MS / 1000;
      saveProgress(savedAtRef.current);
    }, SAVE_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [saveProgress]);

  // Слушаем postMessage от Kinescope iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== "https://kinescope.io") return;

      const { event, data } = e.data ?? {};

      if (event === "timeupdate" && data?.currentTime) {
        savedAtRef.current = Math.floor(data.currentTime);
      }

      if ((event === "ended" || event === "complete") && !completedRef.current) {
        completedRef.current = true;
        if (timerRef.current) clearInterval(timerRef.current);
        saveProgress(savedAtRef.current, true);
        onComplete?.();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [saveProgress, onComplete]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-none overflow-hidden border-2 border-[#0F0F0F]">
      <iframe
        src={`${getEmbedUrl(videoId)}?autoplay=0`}
        className="absolute inset-0 w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer"
        allowFullScreen
        referrerPolicy="origin"
      />
    </div>
  );
}
