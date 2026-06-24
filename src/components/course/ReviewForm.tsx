"use client";

import { useState } from "react";
import { Star, Send, Trash2, Loader2 } from "lucide-react";

interface Props {
  courseId: string;
  onSubmitSuccess?: () => void;
}

export function ReviewForm({ courseId, onSubmitSuccess }: Props) {
  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, rating, text }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка при отправке отзыва");
      }

      setSuccess(true);
      onSubmitSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Вы уверены, что хотите удалить отзыв?")) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/reviews?courseId=${courseId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Не удалось удалить отзыв");
      }

      setRating(0);
      setText("");
      setSuccess(false);
      onSubmitSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--c-s1)] border border-[var(--c-border)] p-6 rounded-none">
      <h3 className="font-display text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--c-t1)" }}>
        Оставьте отзыв
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-lo border border-red text-red" style={{ background: "rgba(208,57,42,0.1)", borderColor: "rgba(208,57,42,0.3)", color: "var(--c-red)" }}>
          {error}
        </div>
      )}

      {success ? (
        <div className="mb-4 p-3 bg-green-lo border border-green text-green" style={{ background: "rgba(31,158,110,0.1)", borderColor: "rgba(31,158,110,0.3)", color: "var(--c-green)" }}>
          Отзыв успешно отправлен! Спасибо за обратную связь.
        </div>
      ) : (
        <>
          {/* Rating */}
          <div className="mb-4">
            <label className="block text-[10px] font-black uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-mono)", color: "var(--c-t3)" }}>
              Оценка *
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 transition-colors ${rating >= star ? "text-amber" : "text-border-hi"}`}
                  style={{ color: rating >= star ? "var(--c-amber)" : "var(--c-border-hi)" }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Text */}
          <div className="mb-4">
            <label className="block text-[10px] font-black uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-mono)", color: "var(--c-t3)" }}>
              Комментарий (необязательно)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Что вам понравилось? Что можно улучшить?"
              rows={4}
              className="w-full px-3 py-2 bg-s1 border border-border text-sm outline-none focus:border-red transition-colors resize-none"
              style={{ background: "var(--c-s1)", borderColor: "var(--c-border)", color: "var(--c-t1)", fontFamily: "var(--font-sans)" }}
            />
          </div>

          {/* Submit/Delete buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-red flex items-center gap-2 px-4 py-2 text-sm font-black"
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Send size={16} />} {" "}
              Отправить
            </button>
            {rating > 0 && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="border border-border hover:border-red text-t3 hover:text-red flex items-center gap-2 px-4 py-2 text-sm transition-colors"
                style={{ borderColor: "var(--c-border)", color: "var(--c-t3)" }}
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Trash2 size={16} />} {" "}
                Удалить
              </button>
            )}
          </div>
        </>
      )}
    </form>
  );
}
