"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useCallback, useRef } from "react";

interface Props {
  playbackId: string;
  lessonId: string;
  initialTime?: number;
  onComplete?: () => void;
}

const SAVE_INTERVAL_SEC = 10;

export function LessonPlayer({ playbackId, lessonId, initialTime = 0, onComplete }: Props) {
  const lastSavedRef = useRef(0);
  const completedRef = useRef(false);

  const saveProgress = useCallback(
    async (watchedSeconds: number, completed = false) => {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, watchedSeconds, completed }),
      });
    },
    [lessonId]
  );

  const handleTimeUpdate = useCallback(
    (e: Event) => {
      const video = e.target as HTMLVideoElement;
      const current = Math.floor(video.currentTime);
      if (current - lastSavedRef.current >= SAVE_INTERVAL_SEC) {
        lastSavedRef.current = current;
        saveProgress(current);
      }
    },
    [saveProgress]
  );

  const handleEnded = useCallback(async () => {
    if (completedRef.current) return;
    completedRef.current = true;
    const video = document.querySelector("mux-player")?.shadowRoot?.querySelector("video");
    await saveProgress(Math.floor(video?.duration ?? 0), true);
    onComplete?.();
  }, [saveProgress, onComplete]);

  return (
    <MuxPlayer
      playbackId={playbackId}
      startTime={initialTime}
      streamType="on-demand"
      className="w-full aspect-video rounded-xl overflow-hidden bg-black"
      accentColor="#C9A96E"
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
    />
  );
}
