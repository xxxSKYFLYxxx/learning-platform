"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { BookOpen, MessageSquare, Plus, RefreshCcw, Star, Users } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import {
  cmsCourses,
  cmsInstructors,
  cmsReviews,
  cmsUsers,
  type CmsCourse,
  type CmsLevel,
} from "@/lib/cms-demo-data";

const STORAGE_KEY = "kurs-cms-courses";

const levelLabels: Record<CmsLevel, string> = {
  BEGINNER: "Начальный",
  INTERMEDIATE: "Средний",
  ADVANCED: "Продвинутый",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/ё/g, "e")
    .replace(/й/g, "i")
    .replace(/[а-я]/g, (char) => {
      const map: Record<string, string> = {
        а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ж: "zh", з: "z", и: "i",
        к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t",
        у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ы: "y",
        э: "e", ю: "yu", я: "ya", ь: "", ъ: "",
      };
      return map[char] ?? "";
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ color: "var(--c-t3)", fontSize: 11, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function inputStyle(): React.CSSProperties {
  return {
    width: "100%",
    boxSizing: "border-box",
    background: "var(--c-s2)",
    border: "1px solid var(--c-border-hi)",
    color: "var(--c-t1)",
    padding: "11px 12px",
    borderRadius: 4,
    fontFamily: "var(--font-sans)",
    fontSize: 14,
    outline: "none",
  };
}

export default function CmsPage() {
  const [courses, setCourses] = useState<CmsCourse[]>(cmsCourses);
  const [activeTab, setActiveTab] = useState<"courses" | "users" | "teachers" | "reviews">("courses");
  const [source, setSource] = useState<"database" | "fallback" | "local">("local");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCourses(JSON.parse(stored));
        setSource("local");
      } catch {
        setCourses(cmsCourses);
      }
    }

    fetch("/api/cms/courses")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { courses?: CmsCourse[]; source?: "database" | "fallback" } | null) => {
        if (!data?.courses) return;
        setCourses(data.courses);
        setSource(data.source ?? "database");
      })
      .catch(() => {
        setSource("local");
      });
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  const stats = useMemo(() => {
    const published = courses.filter((course) => course.published).length;
    const free = courses.filter((course) => course.isFree).length;
    const paid = courses.length - free;
    const enrollments = courses.reduce((sum, course) => sum + course.enrollments, 0);
    return { published, free, paid, enrollments };
  }, [courses]);

  async function addCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    if (!title) return;

    const slug = String(form.get("slug") || slugify(title));
    const price = Number(form.get("price") || 0);
    const isFree = form.get("isFree") === "on";
    const instructorId = String(form.get("instructorId") ?? cmsInstructors[0].id);
    const level = String(form.get("level") ?? "BEGINNER") as CmsLevel;

    const coursePayload = {
      title,
      slug,
      description: String(form.get("description") || "Новый курс из CMS. Добавьте программу, уроки и материалы."),
      imageUrl: String(form.get("imageUrl") || "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop"),
      isFree,
      level,
      price: isFree ? null : price || 1990,
      instructorId,
      published: form.get("published") === "on",
    };

    const localCourse: CmsCourse = {
      id: `local-${Date.now()}`,
      ...coursePayload,
      enrollments: 0,
      reviews: 0,
      rating: 5,
    };

    setSaving(true);
    try {
      const response = await fetch("/api/cms/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coursePayload),
      });
      const data = await response.json();
      setCourses((items) => [data.course ?? localCourse, ...items]);
      setSource(data.source ?? "database");
    } catch {
      setCourses((items) => [localCourse, ...items]);
      setSource("local");
    } finally {
      setSaving(false);
    }

    event.currentTarget.reset();
  }

  async function togglePublished(id: string) {
    const course = courses.find((item) => item.id === id);
    if (!course) return;
    const nextPublished = !course.published;

    setCourses((items) =>
      items.map((course) =>
        course.id === id ? { ...course, published: nextPublished } : course
      )
    );

    if (id.startsWith("fallback-") || id.startsWith("local-")) return;

    try {
      const response = await fetch("/api/cms/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, published: nextPublished }),
      });
      const data = await response.json();
      if (data.course) {
        setCourses((items) => items.map((item) => (item.id === id ? data.course : item)));
        setSource(data.source ?? "database");
      }
    } catch {
      setSource("local");
    }
  }

  function resetCourses() {
    setCourses(cmsCourses);
    setSource("fallback");
    window.localStorage.removeItem(STORAGE_KEY);
  }

  const tabs = [
    { id: "courses", label: "Курсы", icon: BookOpen, count: courses.length },
    { id: "users", label: "Пользователи", icon: Users, count: cmsUsers.length },
    { id: "teachers", label: "Преподы", icon: Star, count: cmsInstructors.length },
    { id: "reviews", label: "Отзывы", icon: MessageSquare, count: cmsReviews.length },
  ] as const;

  return (
    <div style={{ background: "var(--c-bg)", minHeight: "100vh" }}>
      <Header />
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <p style={{ color: "var(--c-red)", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>
              Самописная CMS
            </p>
            <h1 style={{ color: "var(--c-t1)", fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1, marginBottom: 14 }}>
              Управление платформой
            </h1>
            <p style={{ color: "var(--c-t3)", fontFamily: "var(--font-sans)", maxWidth: 680, lineHeight: 1.7 }}>
              Здесь можно быстро добавить курс, посмотреть пользователей, преподавателей и отзывы. CMS пишет в Prisma через собственный API, а если база недоступна, включает демо-режим.
            </p>
            <p style={{ color: source === "database" ? "var(--c-green)" : "var(--c-amber)", fontFamily: "var(--font-mono)", fontSize: 12, marginTop: 12 }}>
              источник данных: {source === "database" ? "database" : source === "fallback" ? "demo fallback" : "localStorage"}
            </p>
          </div>
          <Link href="/courses" className="btn-ghost" style={{ padding: "10px 16px", textDecoration: "none", fontFamily: "var(--font-display)", fontWeight: 900, color: "var(--c-t1)", whiteSpace: "nowrap" }}>
            На витрину
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "1px solid var(--c-border)", marginBottom: 24 }}>
          {[
            ["Опубликовано", stats.published],
            ["Бесплатных", stats.free],
            ["Платных", stats.paid],
            ["Студентов", stats.enrollments],
          ].map(([label, value], index) => (
            <div key={label} style={{ padding: 20, borderRight: index < 3 ? "1px solid var(--c-border)" : "none", background: "var(--c-s1)" }}>
              <div style={{ color: "var(--c-t1)", fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 900 }}>{value}</div>
              <div style={{ color: "var(--c-t3)", fontFamily: "var(--font-sans)", fontSize: 13, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 14px",
                background: activeTab === id ? "var(--c-red)" : "var(--c-s1)",
                color: activeTab === id ? "var(--c-bg)" : "var(--c-t2)",
                border: `1px solid ${activeTab === id ? "var(--c-red)" : "var(--c-border)"}`,
                borderRadius: 4,
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                fontWeight: 900,
              }}
            >
              <Icon size={15} /> {label} <span style={{ fontFamily: "var(--font-mono)" }}>{count}</span>
            </button>
          ))}
        </div>

        {activeTab === "courses" && (
          <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 24, alignItems: "start" }}>
            <form onSubmit={addCourse} style={{ background: "var(--c-s1)", border: "1px solid var(--c-border)", padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--c-t1)", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 20 }}>
                <Plus size={18} /> Добавить курс
              </div>

              <Field label="Название">
                <input name="title" required placeholder="Например: HTML практика" style={inputStyle()} />
              </Field>
              <Field label="Slug">
                <input name="slug" placeholder="auto из названия" style={inputStyle()} />
              </Field>
              <Field label="Описание">
                <textarea name="description" rows={4} placeholder="Коротко о курсе" style={{ ...inputStyle(), resize: "vertical" }} />
              </Field>
              <Field label="Обложка">
                <input name="imageUrl" placeholder="URL картинки" style={inputStyle()} />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Уровень">
                  <select name="level" defaultValue="BEGINNER" style={inputStyle()}>
                    {Object.entries(levelLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Цена">
                  <input name="price" type="number" min="0" defaultValue="1990" style={inputStyle()} />
                </Field>
              </div>
              <Field label="Преподаватель">
                <select name="instructorId" style={inputStyle()}>
                  {cmsInstructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                  ))}
                </select>
              </Field>
              <label style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--c-t2)", fontFamily: "var(--font-sans)", fontSize: 14 }}>
                <input name="isFree" type="checkbox" /> Бесплатный курс
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--c-t2)", fontFamily: "var(--font-sans)", fontSize: 14 }}>
                <input name="published" type="checkbox" defaultChecked /> Опубликовать
              </label>
              <button type="submit" disabled={saving} className="btn-red" style={{ padding: "12px 16px", fontFamily: "var(--font-display)", fontWeight: 900, border: "none", cursor: saving ? "wait" : "pointer", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Сохраняю..." : "Добавить"}
              </button>
              <button type="button" onClick={resetCourses} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 14px", background: "transparent", color: "var(--c-t3)", border: "1px solid var(--c-border)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                <RefreshCcw size={14} /> Сбросить демо-данные
              </button>
            </form>

            <div style={{ background: "var(--c-s1)", border: "1px solid var(--c-border)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-sans)" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--c-border)" }}>
                    {["Курс", "Уровень", "Цена", "Препод", "Статус"].map((head) => (
                      <th key={head} style={{ textAlign: "left", padding: "12px 14px", color: "var(--c-t3)", fontSize: 11, fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => {
                    const instructor = cmsInstructors.find((item) => item.id === course.instructorId);
                    return (
                      <tr key={course.id} style={{ borderBottom: "1px solid var(--c-border)" }}>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ color: "var(--c-t1)", fontWeight: 800 }}>{course.title}</div>
                          <Link href={`/courses/${course.slug}`} style={{ color: "var(--c-t4)", fontSize: 12, textDecoration: "none" }}>
                            /courses/{course.slug}
                          </Link>
                        </td>
                        <td style={{ padding: "12px 14px", color: "var(--c-t2)", fontSize: 13 }}>{levelLabels[course.level]}</td>
                        <td style={{ padding: "12px 14px", color: course.isFree ? "var(--c-green)" : "var(--c-t2)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
                          {course.isFree ? "FREE" : `${course.price} ₽`}
                        </td>
                        <td style={{ padding: "12px 14px", color: "var(--c-t3)", fontSize: 13 }}>{instructor?.name ?? "Без препода"}</td>
                        <td style={{ padding: "12px 14px" }}>
                          <button onClick={() => togglePublished(course.id)} style={{ padding: "5px 9px", border: `1px solid ${course.published ? "var(--c-green)" : "var(--c-border-hi)"}`, color: course.published ? "var(--c-green)" : "var(--c-t3)", background: "transparent", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 11 }}>
                            {course.published ? "LIVE" : "DRAFT"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div style={{ background: "var(--c-s1)", border: "1px solid var(--c-border)", overflow: "hidden" }}>
            {cmsUsers.map((user) => (
              <div key={user.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr", gap: 16, padding: 18, borderBottom: "1px solid var(--c-border)", alignItems: "center" }}>
                <strong style={{ color: "var(--c-t1)", fontFamily: "var(--font-sans)" }}>{user.name}</strong>
                <span style={{ color: "var(--c-t3)", fontFamily: "var(--font-sans)", fontSize: 14 }}>{user.email}</span>
                <span style={{ color: "var(--c-amber)", fontFamily: "var(--font-mono)", fontSize: 12 }}>{user.role}</span>
                <span style={{ color: "var(--c-t4)", fontFamily: "var(--font-mono)", fontSize: 12 }}>{user.courses} курсов</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "teachers" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {cmsInstructors.map((instructor) => {
              const owned = courses.filter((course) => course.instructorId === instructor.id).length;
              return (
                <div key={instructor.id} style={{ background: "var(--c-s1)", border: "1px solid var(--c-border)", padding: 20 }}>
                  <img src={instructor.image} alt="" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--c-border-hi)", marginBottom: 14 }} />
                  <h3 style={{ color: "var(--c-t1)", fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 6 }}>{instructor.name}</h3>
                  <p style={{ color: "var(--c-red)", fontFamily: "var(--font-mono)", fontSize: 11, marginBottom: 12 }}>{instructor.role}</p>
                  <p style={{ color: "var(--c-t3)", fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>{instructor.bio}</p>
                  <span style={{ color: "var(--c-amber)", fontFamily: "var(--font-mono)", fontSize: 12 }}>{owned} курсов</span>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "reviews" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {cmsReviews.map((review) => (
              <div key={review.id} style={{ background: "var(--c-s1)", border: "1px solid var(--c-border)", padding: 20 }}>
                <div style={{ color: "var(--c-amber)", fontFamily: "var(--font-mono)", fontSize: 13, marginBottom: 10 }}>
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </div>
                <p style={{ color: "var(--c-t2)", fontFamily: "var(--font-sans)", lineHeight: 1.7, marginBottom: 14 }}>{review.text}</p>
                <div style={{ color: "var(--c-t4)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                  {review.userName} / {review.courseTitle}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
