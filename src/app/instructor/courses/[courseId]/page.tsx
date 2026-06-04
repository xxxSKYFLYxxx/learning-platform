import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VideoUploader } from "@/components/instructor/VideoUploader";
import { CheckCircle, Clock, Video } from "lucide-react";
import { formatDuration } from "@/lib/utils";

export const metadata = { title: "Управление курсом" };

export default async function InstructorCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await auth();
  if (!session?.user || !["INSTRUCTOR", "ADMIN"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId, instructorId: session.user.id! },
    include: {
      modules: {
        orderBy: { sortOrder: "asc" },
        include: { lessons: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  if (!course) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-primary">{course.title}</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block ${
            course.published ? "bg-success/10 text-success" : "bg-gray-100 text-muted"
          }`}>
            {course.published ? "Опубликован" : "Черновик"}
          </span>
        </div>

        <h2 className="font-display text-lg font-bold text-primary mb-4">Программа курса</h2>

        <div className="flex flex-col gap-4">
          {course.modules.map((mod) => (
            <div key={mod.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="font-semibold text-text">{mod.title}</h3>
                <p className="text-xs text-muted mt-0.5">{mod.lessons.length} уроков</p>
              </div>

              <div className="divide-y divide-gray-50">
                {mod.lessons.map((lesson) => (
                  <div key={lesson.id} className="px-5 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {lesson.muxPlaybackId ? (
                        <CheckCircle className="w-4 h-4 text-success shrink-0" />
                      ) : (
                        <Video className="w-4 h-4 text-gray-300 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text truncate">{lesson.title}</p>
                        {lesson.duration && (
                          <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> {formatDuration(lesson.duration)}
                          </p>
                        )}
                        {!lesson.muxPlaybackId && (
                          <p className="text-xs text-muted mt-0.5">Видео не загружено</p>
                        )}
                      </div>
                    </div>

                    {!lesson.muxPlaybackId && (
                      <VideoUploader lessonId={lesson.id} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
