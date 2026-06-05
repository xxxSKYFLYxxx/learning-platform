import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Award, PlayCircle, TrendingUp } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { formatDuration } from "@/lib/utils";

async function getDashboardData(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId, status: "ACTIVE" },
    include: {
      course: {
        include: {
          modules: {
            include: { lessons: { select: { id: true, duration: true } } },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const certificates = await prisma.certificate.count({ where: { userId } });

  const completedLessons = await prisma.lessonProgress.count({
    where: { userId, completed: true },
  });

  return { enrollments, certificates, completedLessons };
}

function calcProgress(enrollment: Awaited<ReturnType<typeof getDashboardData>>["enrollments"][0], completedIds: Set<string>) {
  const totalLessons = enrollment.course.modules.reduce((a, m) => a + m.lessons.length, 0);
  if (!totalLessons) return 0;
  const done = enrollment.course.modules.reduce(
    (a, m) => a + m.lessons.filter((l) => completedIds.has(l.id)).length,
    0
  );
  return Math.round((done / totalLessons) * 100);
}

export const metadata = { title: "Мой кабинет" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { enrollments, certificates, completedLessons } = await getDashboardData(session.user.id!);

  const completedLessonIds = new Set(
    (
      await prisma.lessonProgress.findMany({
        where: { userId: session.user.id!, completed: true },
        select: { lessonId: true },
      })
    ).map((p) => p.lessonId)
  );

  const stats = [
    { icon: BookOpen, label: "Курсов", value: enrollments.length },
    { icon: PlayCircle, label: "Уроков пройдено", value: completedLessons },
    { icon: Award, label: "Сертификатов", value: certificates },
  ];

  return (
    <div className="grain" style={{ background: "var(--c-bg)", minHeight: "100vh" }}>
      <Header />
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
        {/* Greeting */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          {session.user.image && (
            <Image src={session.user.image} alt={session.user.name ?? ""} width={56} height={56} unoptimized style={{ borderRadius: "50%", border: "1px solid var(--c-border)" }} />
          )}
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)" }}>
              Привет, {session.user.name?.split(" ")[0] ?? "Студент"}!
            </h1>
            <p style={{ color: "var(--c-t3)", fontSize: 14, marginTop: 2, fontFamily: "var(--font-sans)" }}>Продолжайте обучение</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 48 }}>
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ background: "var(--c-s1)", border: "1px solid var(--c-border)", padding: 24, textAlign: "center" }}>
              <Icon size={22} style={{ color: "var(--c-red)", margin: "0 auto 8px" }} />
              <div style={{ fontSize: 26, fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)" }}>{value}</div>
              <div style={{ fontSize: 12, color: "var(--c-t3)", marginTop: 4, fontFamily: "var(--font-sans)" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Courses */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)" }}>Мои курсы</h2>
          <Link href="/courses" className="link-muted" style={{ fontSize: 14, textDecoration: "none", fontFamily: "var(--font-sans)" }}>Найти ещё →</Link>
        </div>

        {enrollments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", border: "1px dashed var(--c-border)" }}>
            <BookOpen size={40} style={{ color: "var(--c-border-hi)", margin: "0 auto 16px" }} />
            <p style={{ color: "var(--c-t3)", marginBottom: 20, fontFamily: "var(--font-sans)" }}>Вы пока не записаны ни на один курс</p>
            <Link href="/courses" className="btn-red" style={{ display: "inline-block", padding: "10px 24px", fontSize: 14, fontWeight: 900, textDecoration: "none", fontFamily: "var(--font-display)" }}>
              Перейти к курсам
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {enrollments.map((enrollment) => {
              const progress = calcProgress(enrollment, completedLessonIds);
              const totalDuration = enrollment.course.modules.reduce(
                (a, m) => a + m.lessons.reduce((b, l) => b + (l.duration ?? 0), 0),
                0
              );
              return (
                <div key={enrollment.id} className="course-card" style={{ overflow: "hidden" }}>
                  {enrollment.course.imageUrl ? (
                    <div style={{ position: "relative", aspectRatio: "16/9" }}>
                      <Image src={enrollment.course.imageUrl} alt={enrollment.course.title} fill unoptimized style={{ objectFit: "cover", opacity: 0.7 }} />
                    </div>
                  ) : (
                    <div style={{ aspectRatio: "16/9", background: "var(--c-s2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <BookOpen size={32} style={{ color: "var(--c-border-hi)" }} />
                    </div>
                  )}
                  <div style={{ padding: 16 }}>
                    <h3 style={{ fontWeight: 600, color: "var(--c-t1)", marginBottom: 14, fontFamily: "var(--font-sans)", fontSize: 15, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{enrollment.course.title}</h3>

                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--c-t3)", marginBottom: 6, fontFamily: "var(--font-mono)" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><TrendingUp size={12} /> Прогресс</span>
                        <span style={{ color: progress === 100 ? "var(--c-green)" : "var(--c-t2)" }}>{progress}%</span>
                      </div>
                      <div style={{ width: "100%", background: "var(--c-border)", height: 4 }}>
                        <div style={{ background: progress === 100 ? "var(--c-green)" : "var(--c-red)", height: 4, width: `${progress}%`, transition: "width 0.3s" }} />
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "var(--c-t4)", fontFamily: "var(--font-mono)" }}>{formatDuration(totalDuration)}</span>
                      <Link href={`/learn/${enrollment.course.slug}`} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "var(--c-red)", textDecoration: "none", fontFamily: "var(--font-display)" }}>
                        <PlayCircle size={14} />
                        {progress > 0 ? "Продолжить" : "Начать"}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
