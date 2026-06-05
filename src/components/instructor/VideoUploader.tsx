"use client";

/**
 * Загрузка видео в Kinescope
 * Прямая загрузка из браузера через signed upload URL
 */
import { useRef, useState } from "react";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  lessonId: string;
  lessonTitle?: string;
}

type Status = "idle" | "preparing" | "uploading" | "done" | "error";

export function VideoUploader({ lessonId, lessonTitle }: Props) {
  const [status,   setStatus]   = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setStatus("preparing");
    setProgress(0);
    setErrorMsg("");

    try {
      // 1. Получаем URL загрузки от Kinescope через наш API
      const res = await fetch("/api/kinescope/upload", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ lessonId, title: lessonTitle }),
      });

      if (!res.ok) throw new Error("Не удалось создать сессию загрузки");
      const { uploadUrl } = await res.json();

      // 2. Загружаем файл напрямую в Kinescope
      setStatus("uploading");
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`HTTP ${xhr.status}`));
        };

        xhr.onerror = () => reject(new Error("Ошибка сети"));
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Неизвестная ошибка");
    }
  };

  if (status === "done") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-[#1A9E6E]" style={{ fontFamily: "var(--font-mono)" }}>
        <CheckCircle className="w-3.5 h-3.5" />
        Загружено в Kinescope
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-xs text-[#D4402F]" style={{ fontFamily: "var(--font-mono)" }}>
          <AlertCircle className="w-3.5 h-3.5" />
          {errorMsg}
        </div>
        <button onClick={() => setStatus("idle")} className="text-[10px] text-[#D4402F] hover:underline text-left" style={{ fontFamily: "var(--font-mono)" }}>
          Попробовать снова
        </button>
      </div>
    );
  }

  if (status === "uploading" || status === "preparing") {
    return (
      <div className="flex items-center gap-2 min-w-[140px]" style={{ fontFamily: "var(--font-mono)" }}>
        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4402F] shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between text-[10px] text-[#787068] mb-1">
            <span>{status === "preparing" ? "Подготовка..." : "Загрузка..."}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-[#E0DDD8] rounded-full h-1.5">
            <div
              className="bg-[#D4402F] h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#0F0F0F] text-xs text-[#787068] hover:text-[#0F0F0F] hover:shadow-brutal-sm transition-all"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <Upload className="w-3.5 h-3.5" />
        Загрузить в Kinescope
      </button>
    </>
  );
}
