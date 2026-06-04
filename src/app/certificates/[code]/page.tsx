import { notFound } from "next/navigation";
import Link from "next/link";
import { Award, CheckCircle, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const cert = await prisma.certificate.findUnique({
    where: { uniqueCode: code },
    include: { course: true, user: true },
  });
  if (!cert) return { title: "Сертификат не найден" };
  return { title: `Сертификат: ${cert.course.title}` };
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const cert = await prisma.certificate.findUnique({
    where: { uniqueCode: code },
    include: {
      course: { select: { title: true, slug: true } },
      user: { select: { name: true } },
    },
  });

  if (!cert) notFound();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        {/* Certificate card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary via-primary to-primary/90 px-10 py-14 text-center text-white relative">
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)",
              backgroundSize: "12px 12px",
            }} />
            <Award className="w-16 h-16 text-secondary mx-auto mb-4" />
            <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-2">Сертификат об окончании курса</p>
            <h1 className="font-display text-3xl font-bold leading-tight mt-4">
              {cert.course.title}
            </h1>
          </div>

          {/* Body */}
          <div className="px-10 py-10 text-center">
            <p className="text-muted text-sm">Настоящим подтверждается, что</p>
            <p className="font-display text-2xl font-bold text-primary mt-2">{cert.user.name ?? "Студент"}</p>
            <p className="text-muted text-sm mt-2">успешно завершил(а) курс</p>
            <p className="font-semibold text-text mt-1">{cert.course.title}</p>

            <div className="flex items-center justify-center gap-2 mt-6 text-success">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Верифицировано платформой</span>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-muted">Дата выдачи</p>
              <p className="text-sm font-medium text-text mt-1">
                {new Date(cert.issuedAt).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-muted mt-4 font-mono">{cert.uniqueCode}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <Link
            href={`/api/certificates/${cert.uniqueCode}/pdf`}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Скачать PDF
          </Link>
          <Link
            href="/courses"
            className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-muted rounded-xl text-sm hover:border-primary hover:text-primary transition-colors"
          >
            <BookOpen className="w-4 h-4" /> Все курсы
          </Link>
        </div>
      </div>
    </div>
  );
}
