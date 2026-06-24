"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Loader2, User, Mail, Key, Upload, Shield, Calendar, CheckCircle, Edit3 } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<{ name: string; email: string; image?: string; role?: string; createdAt?: string } | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/login");
      return;
    }

    const userData = {
      name: session.user.name || "",
      email: session.user.email || "",
      image: session.user.image || undefined,
      role: (session.user as any)?.role || "STUDENT",
      createdAt: (session.user as any)?.createdAt || new Date().toISOString(),
    };
    setUser(userData);
    setFormData({ name: userData.name, email: userData.email });
    setLoading(false);
  }, [session, status, router]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/avatar/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setUser(prev => prev ? { ...prev, image: data.url } : null);
        await update({ image: data.url });
        setSuccess("Аватар успешно обновлён!");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Ошибка при загрузке аватара");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setUser(prev => prev ? { ...prev, name: formData.name, email: formData.email } : null);
        await update({ name: formData.name, email: formData.email });
        setSuccess("Профиль успешно обновлён!");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Произошла ошибка при обновлении профиля");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      setError("Новые пароли не совпадают");
      return;
    }
    if (passwordData.new.length < 6) {
      setError("Новый пароль должен быть не менее 6 символов");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const fd = new FormData();
      fd.set("currentPassword", passwordData.current);
      fd.set("newPassword", passwordData.new);

      const result = await fetch("/api/auth/change-password", {
        method: "POST",
        body: fd,
      });

      const data = await result.json();
      if (data.success) {
        setSuccess("Пароль успешно изменён!");
        setPasswordData({ current: "", new: "", confirm: "" });
      } else {
        setError(data.error || "Произошла ошибка при смене пароля");
      }
    } catch (err) {
      setError("Произошла ошибка при смене пароля");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="grain" style={{ background: "var(--c-bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="animate-spin" size={32} style={{ color: "var(--c-t2)" }} />
      </div>
    );
  }

  if (!user) return null;

  const roleLabels: Record<string, string> = {
    STUDENT: "Студент",
    INSTRUCTOR: "Преподаватель",
    ADMIN: "Администратор",
  };

  return (
    <div className="grain" style={{ background: "var(--c-bg)", minHeight: "100vh" }}>
      <Header />
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--c-t3)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
            Личный кабинет
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)", lineHeight: 1.1, marginBottom: 8 }}>
            Мой профиль
          </h1>
          <p style={{ fontSize: 15, color: "var(--c-t3)", fontFamily: "var(--font-sans)", lineHeight: 1.6 }}>
            Управляйте своей личной информацией и настройками безопасности
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {/* Profile Card */}
          <div style={{ background: "var(--c-s1)", border: "1px solid var(--c-border)", padding: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
              <div style={{ position: "relative", marginBottom: 16 }}>
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: "50%",
                      border: "3px solid var(--c-border)",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: "50%",
                      background: "var(--c-s2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "3px solid var(--c-border)",
                    }}
                  >
                    <User size={40} style={{ color: "var(--c-t3)" }} />
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "var(--c-red)",
                    border: "2px solid var(--c-s1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: uploading ? "not-allowed" : "pointer",
                    opacity: uploading ? 0.6 : 1,
                  }}
                >
                  {uploading ? (
                    <Loader2 size={14} className="animate-spin" style={{ color: "var(--c-t1)" }} />
                  ) : (
                    <Edit3 size={14} style={{ color: "var(--c-t1)" }} />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleAvatarUpload}
                  style={{ display: "none" }}
                />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--c-t1)", fontFamily: "var(--font-display)", marginBottom: 4, textAlign: "center" }}>
                {user.name}
              </h3>
              <p style={{ fontSize: 13, color: "var(--c-t3)", fontFamily: "var(--font-sans)" }}>{user.email}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--c-s2)", borderRadius: 8 }}>
                <Shield size={18} style={{ color: "var(--c-red)", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-t3)", fontFamily: "var(--font-mono)", marginBottom: 2 }}>
                    Роль
                  </p>
                  <p style={{ fontSize: 14, color: "var(--c-t1)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>
                    {roleLabels[user.role || "STUDENT"]}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--c-s2)", borderRadius: 8 }}>
                <Calendar size={18} style={{ color: "var(--c-amber)", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-t3)", fontFamily: "var(--font-mono)", marginBottom: 2 }}>
                    Дата регистрации
                  </p>
                  <p style={{ fontSize: 14, color: "var(--c-t1)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>
                    {new Date(user.createdAt || Date.now()).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleProfileSubmit} style={{ background: "var(--c-s1)", border: "1px solid var(--c-border)", padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--c-red-lo)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={18} style={{ color: "var(--c-red)" }} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-t1)", fontFamily: "var(--font-display)" }}>
                Основная информация
              </h2>
            </div>

            {error && (
              <div style={{ padding: "10px 14px", background: "rgba(208,57,42,0.1)", border: "1px solid rgba(208,57,42,0.3)", borderRadius: 6, color: "var(--c-red)", fontSize: 13, fontFamily: "var(--font-sans)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>⚠️</span>
                {error}
              </div>
            )}

            {success && (
              <div style={{ padding: "10px 14px", background: "rgba(31,158,110,0.1)", border: "1px solid rgba(31,158,110,0.3)", borderRadius: 6, color: "var(--c-green)", fontSize: 13, fontFamily: "var(--font-sans)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle size={16} />
                {success}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-t3)", marginBottom: 6, fontFamily: "var(--font-mono)" }}>
                  Имя
                </label>
                <div style={{ position: "relative" }}>
                  <User size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--c-t3)" }} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    minLength={2}
                    className="input-dark"
                    style={{ width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 11, paddingBottom: 11, fontSize: 14, fontFamily: "var(--font-sans)", boxSizing: "border-box", borderRadius: 6 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-t3)", marginBottom: 6, fontFamily: "var(--font-mono)" }}>
                  Email
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--c-t3)" }} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="input-dark"
                    style={{ width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 11, paddingBottom: 11, fontSize: 14, fontFamily: "var(--font-sans)", boxSizing: "border-box", borderRadius: 6 }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-red"
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 16px", fontSize: 14, fontWeight: 900, border: "none", borderRadius: 6, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.6 : 1, fontFamily: "var(--font-display)", marginTop: 8 }}
              >
                {submitting ? <Loader2 className="animate-spin" size={16} /> : null}
                Сохранить изменения
              </button>
            </div>
          </form>

          {/* Password Form */}
          <form onSubmit={handlePasswordSubmit} style={{ background: "var(--c-s1)", border: "1px solid var(--c-border)", padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--c-amber-lo)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Key size={18} style={{ color: "var(--c-amber)" }} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-t1)", fontFamily: "var(--font-display)" }}>
                Смена пароля
              </h2>
            </div>

            <p style={{ fontSize: 13, color: "var(--c-t3)", fontFamily: "var(--font-sans)", marginBottom: 20, lineHeight: 1.6 }}>
              Убедитесь, что используете надёжный пароль не менее 6 символов
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-t3)", marginBottom: 6, fontFamily: "var(--font-mono)" }}>
                  Текущий пароль
                </label>
                <div style={{ position: "relative" }}>
                  <Key size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--c-t3)" }} />
                  <input
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                    required
                    className="input-dark"
                    style={{ width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 11, paddingBottom: 11, fontSize: 14, fontFamily: "var(--font-sans)", boxSizing: "border-box", borderRadius: 6 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-t3)", marginBottom: 6, fontFamily: "var(--font-mono)" }}>
                  Новый пароль
                </label>
                <div style={{ position: "relative" }}>
                  <Key size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--c-t3)" }} />
                  <input
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                    required
                    minLength={6}
                    className="input-dark"
                    style={{ width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 11, paddingBottom: 11, fontSize: 14, fontFamily: "var(--font-sans)", boxSizing: "border-box", borderRadius: 6 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-t3)", marginBottom: 6, fontFamily: "var(--font-mono)" }}>
                  Подтверждение нового пароля
                </label>
                <div style={{ position: "relative" }}>
                  <Key size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--c-t3)" }} />
                  <input
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                    required
                    className="input-dark"
                    style={{ width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 11, paddingBottom: 11, fontSize: 14, fontFamily: "var(--font-sans)", boxSizing: "border-box", borderRadius: 6 }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-red"
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 16px", fontSize: 14, fontWeight: 900, border: "none", borderRadius: 6, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.6 : 1, fontFamily: "var(--font-display)", marginTop: 8 }}
              >
                {submitting ? <Loader2 className="animate-spin" size={16} /> : null}
                Изменить пароль
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
