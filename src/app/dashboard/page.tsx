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
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          {session.user.image && (
            <Image src={session.user.image} alt={session.user.name ?? ""} width={56} height={56} className="rounded-full" />
          )}
          <div>
            <h1 className="font-display text-3xl font-bold text-primary">
              Привет, {session.user.name?.split(" ")[0] ?? "Студент"}!
            </h1>
            <p className="text-muted text-sm mt-0.5">Продолжайте обучение</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
              <Icon className="w-6 h-6 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary font-display">{value}</div>
              <div className="text-xs text-muted mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Courses */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-primary">Мои курсы</h2>
          <Link href="/courses" className="text-sm text-secondary hover:underline">Найти ещё</Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <p className="text-muted mb-4">Вы пока не записаны ни на один курс</p>
            <Link href="/courses" className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
              Перейти к курсам
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => {
              const progress = calcProgress(enrollment, completedLessonIds);
              const totalDuration = enrollment.course.modules.reduce(
                (a, m) => a + m.lessons.reduce((b, l) => b + (l.duration ?? 0), 0),
                0
              );
              return (
                <div key={enrollment.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  {enrollment.course.imageUrl ? (
                    <div className="relative aspect-video">
                      <Image src={enrollment.course.imageUrl} alt={enrollment.course.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-video bg-primary/5 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-primary/20" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-text mb-3 line-clamp-2">{enrollment.course.title}</h3>

                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted mb-1">
                        <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Прогресс</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-secondary h-1.5 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted">{formatDuration(totalDuration)}</span>
                      <Link
                        href={`/learn/${enrollment.course.slug}`}
                        className="flex items-center gap-1 text-xs font-medium text-primary hover:text-secondary transition-colors"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
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
    </>
  );
}
