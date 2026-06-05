import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Users, DollarSign, Star } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Кабинет преподавателя" };

export default async function InstructorPage() {
  const session = await auth();
  if (!session?.user || !["INSTRUCTOR", "ADMIN"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const courses = await prisma.course.findMany({
    where: { instructorId: session.user.id! },
    include: {
      _count: { select: { enrollments: true, reviews: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalStudents = courses.reduce((a, c) => a + c._count.enrollments, 0);

  // Revenue from courses prices
  const revenue = await prisma.$queryRaw<{ total: number }[]>`
    SELECT COALESCE(SUM(c.price), 0) as total
    FROM enrollments e
    JOIN courses c ON c.id = e."courseId"
    WHERE c."instructorId" = ${session.user.id}
      AND e.status IN ('ACTIVE', 'COMPLETED')
      AND c."isFree" = false
  `;

  const stats = [
    { icon: BookOpen, label: "Курсов", value: courses.length },
    { icon: Users, label: "Студентов", value: totalStudents },
    {
      icon: DollarSign,
      label: "Выручка",
      value: formatPrice(Number(revenue[0]?.total ?? 0)),
    },
  ];

  return (
    <div className="grain admin-dark" style={{ background: "var(--c-bg)", minHeight: "100vh" }}>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-display text-3xl font-bold text-primary">Кабинет преподавателя</h1>
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
        <h2 className="font-display text-xl font-bold text-primary mb-4">Мои курсы</h2>
        {courses.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <p className="text-muted">Курсов пока нет</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {courses.map((course) => {
              const avgRating =
                course.reviews.length > 0
                  ? course.reviews.reduce((a, r) => a + r.rating, 0) / course.reviews.length
                  : null;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-text truncate">{course.title}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          course.published
                            ? "bg-success/10 text-success"
                            : "bg-gray-100 text-muted"
                        }`}
                      >
                        {course.published ? "Опубликован" : "Черновик"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {course._count.enrollments}
                      </span>
                      {avgRating && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-secondary" /> {avgRating.toFixed(1)}
                        </span>
                      )}
                      <span>{formatPrice(Number(course.price))}</span>
                    </div>
                  </div>
                  <Link
                    href={`/instructor/courses/${course.id}`}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-xs text-muted hover:border-primary hover:text-primary transition-colors shrink-0"
                  >
                    Управление
                  </Link>
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
