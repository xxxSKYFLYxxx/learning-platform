"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, CheckCircle } from "lucide-react";

interface Props {
  lessonId: string;
}

type Status = "idle" | "uploading" | "done" | "error";

export function VideoUploader({ lessonId }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setStatus("uploading");
    setProgress(0);

    // Get signed upload URL from Mux
    const res = await fetch("/api/mux/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId }),
    });

    if (!res.ok) {
      setStatus("error");
      return;
    }

    const { uploadUrl } = await res.json();

    // Upload directly to Mux
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) {
        setStatus("done");
      } else {
        setStatus("error");
      }
    };
    xhr.onerror = () => setStatus("error");
    xhr.open("PUT", uploadUrl);
    xhr.send(file);
  };

  if (status === "done") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-success">
        <CheckCircle className="w-3.5 h-3.5" /> Загружено
      </div>
    );
  }

  if (status === "uploading") {
    return (
      <div className="flex items-center gap-2 text-xs text-muted w-32">
        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
          <div className="bg-secondary h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="shrink-0">{progress}%</span>
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
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-muted hover:border-primary hover:text-primary transition-colors shrink-0"
      >
        <Upload className="w-3.5 h-3.5" />
        {status === "error" ? "Повторить" : "Загрузить видео"}
      </button>
    </>
  );
}
