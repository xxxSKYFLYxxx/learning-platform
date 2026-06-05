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
    <div className="grain" style={{ minHeight: "100vh", background: "var(--c-bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 16px", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 700, height: 500, borderRadius: "50%", background: "radial-gradient(circle,var(--c-red-lo) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: 672, position: "relative" }}>
        {/* Certificate card */}
        <div style={{ background: "var(--c-s1)", border: "1px solid var(--c-border-hi)", overflow: "hidden", boxShadow: "0 0 60px rgba(0,0,0,0.5)" }}>
          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, var(--c-s3), var(--c-s2))", padding: "56px 40px", textAlign: "center", position: "relative", borderBottom: "2px solid var(--c-red)" }}>
            <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(45deg, var(--c-t1) 0, var(--c-t1) 1px, transparent 0, transparent 50%)", backgroundSize: "12px 12px" }} />
            <Award size={64} style={{ color: "var(--c-amber)", margin: "0 auto 16px", position: "relative" }} />
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.3em", color: "var(--c-t3)", marginBottom: 8, fontFamily: "var(--font-mono)" }}>Сертификат об окончании курса</p>
            <h1 style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.2, marginTop: 16, color: "var(--c-t1)", fontFamily: "var(--font-display)", position: "relative" }}>
              {cert.course.title}
            </h1>
          </div>

          {/* Body */}
          <div style={{ padding: "40px", textAlign: "center" }}>
            <p style={{ color: "var(--c-t3)", fontSize: 14, fontFamily: "var(--font-sans)" }}>Настоящим подтверждается, что</p>
            <p style={{ fontSize: 24, fontWeight: 900, color: "var(--c-t1)", marginTop: 8, fontFamily: "var(--font-display)" }}>{cert.user.name ?? "Студент"}</p>
            <p style={{ color: "var(--c-t3)", fontSize: 14, marginTop: 8, fontFamily: "var(--font-sans)" }}>успешно завершил(а) курс</p>
            <p style={{ fontWeight: 600, color: "var(--c-t2)", marginTop: 4, fontFamily: "var(--font-sans)" }}>{cert.course.title}</p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24, color: "var(--c-green)" }}>
              <CheckCircle size={20} />
              <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-sans)" }}>Верифицировано платформой</span>
            </div>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--c-border)" }}>
              <p style={{ fontSize: 11, color: "var(--c-t4)", fontFamily: "var(--font-mono)" }}>Дата выдачи</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--c-t1)", marginTop: 4, fontFamily: "var(--font-sans)" }}>
                {new Date(cert.issuedAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <p style={{ fontSize: 11, color: "var(--c-t4)", marginTop: 16, fontFamily: "var(--font-mono)" }}>{cert.uniqueCode}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 24 }}>
          <Link href={`/api/certificates/${cert.uniqueCode}/pdf`} className="btn-red" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", fontSize: 14, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-display)" }}>
            Скачать PDF
          </Link>
          <Link href="/courses" className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", fontSize: 14, textDecoration: "none", fontFamily: "var(--font-sans)" }}>
            <BookOpen size={16} /> Все курсы
          </Link>
        </div>
      </div>
    </div>
  );
}
