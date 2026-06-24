import { notFound } from "next/navigation";
import Link from "next/link";
import { Award, CheckCircle, BookOpen, ExternalLink, Search } from "lucide-react";
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

  const issuedDate = new Date(cert.issuedAt);
  const formattedDate = issuedDate.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

  const linkedInUrl = new URL("https://www.linkedin.com/sharing/share-offsite/");
  const verifyUrl = process.env.AUTH_URL ?? "http://localhost:3002";
  linkedInUrl.searchParams.set("url", `${verifyUrl}/certificates/${cert.uniqueCode}`);

  return (
    <div className="grain" style={{ minHeight: "100vh", background: "var(--c-bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 16px", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes certificate-enter {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(208,57,42,0.05); }
          50% { box-shadow: 0 0 50px rgba(208,57,42,0.12); }
        }
        @media (max-width: 768px) {
          .cert-actions { flex-direction: column !important; width: 100% !important; }
          .cert-actions > a { width: 100% !important; justify-content: center !important; }
          .cert-body { padding: 28px 20px !important; }
          .cert-header { padding: 40px 20px !important; }
          .cert-code { font-size: 10px !important; }
        }
        .cert-linkedin:hover { color: var(--c-amber) !important; }
        .cert-verify:hover { color: var(--c-green) !important; }
        .cert-pdf:hover { background: var(--c-s1) !important; }
        .cert-course:hover { color: var(--c-red) !important; }
        .cert-verify-another:hover { color: var(--c-red) !important; }
      `}</style>
      <div aria-hidden style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 700, height: 500, borderRadius: "50%", background: "radial-gradient(circle,var(--c-red-lo) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: 672, position: "relative", animation: "certificate-enter 0.6s ease-out" }}>
        {/* Certificate card */}
        <div style={{ background: "var(--c-s1)", border: "1px solid var(--c-border-hi)", overflow: "hidden", boxShadow: "0 0 60px rgba(0,0,0,0.5)", animation: "pulse-glow 4s ease-in-out infinite", borderRadius: 0 }}>
          {/* Header */}
          <div className="cert-header" style={{ background: "linear-gradient(135deg, var(--c-s3), var(--c-s2))", padding: "56px 40px", textAlign: "center", position: "relative", borderBottom: "2px solid var(--c-red)" }}>
            <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(45deg, var(--c-t1) 0, var(--c-t1) 1px, transparent 0, transparent 50%)", backgroundSize: "12px 12px" }} />
            <Award size={64} style={{ color: "var(--c-amber)", margin: "0 auto 16px", position: "relative" }} />
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.3em", color: "var(--c-t3)", marginBottom: 8, fontFamily: "var(--font-mono)", position: "relative" }}>Сертификат об окончании курса</p>
            <h1 style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.2, marginTop: 16, color: "var(--c-t1)", fontFamily: "var(--font-display)", position: "relative" }}>
              {cert.course.title}
            </h1>
          </div>

          {/* Body */}
          <div className="cert-body" style={{ padding: "40px", textAlign: "center" }}>
            <p style={{ color: "var(--c-t3)", fontSize: 14, fontFamily: "var(--font-sans)" }}>Настоящим подтверждается, что</p>
            <p style={{ fontSize: 24, fontWeight: 900, color: "var(--c-t1)", marginTop: 8, fontFamily: "var(--font-display)" }}>{cert.user.name ?? "Студент"}</p>
            <p style={{ color: "var(--c-t3)", fontSize: 14, marginTop: 8, fontFamily: "var(--font-sans)" }}>успешно завершил(а) курс</p>
            <Link href={`/courses/${cert.course.slug}`} className="cert-course" style={{ fontWeight: 600, color: "var(--c-t2)", marginTop: 4, fontFamily: "var(--font-sans)", textDecoration: "none", display: "inline-block", transition: "color 0.15s" }}>
              {cert.course.title}
            </Link>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24, color: "var(--c-green)" }}>
              <CheckCircle size={20} />
              <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-sans)" }}>Верифицировано платформой</span>
            </div>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--c-border)", display: "flex", justifyContent: "space-around", gap: 24, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: 11, color: "var(--c-t4)", fontFamily: "var(--font-mono)" }}>Дата выдачи</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--c-t1)", marginTop: 4, fontFamily: "var(--font-sans)" }}>
                  {formattedDate}
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 11, color: "var(--c-t4)", fontFamily: "var(--font-mono)" }}>Код сертификата</p>
                <p className="cert-code" style={{ fontSize: 13, fontWeight: 700, color: "var(--c-t1)", marginTop: 4, fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>
                  {cert.uniqueCode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="cert-actions" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          <Link href={`/api/certificates/${cert.uniqueCode}/pdf`} className="cert-pdf" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", fontSize: 14, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-display)", border: "1px solid var(--c-border)", background: "var(--c-s1)", color: "var(--c-t1)", transition: "background 0.15s" }}>
            Скачать PDF
          </Link>
          <Link href="/courses" className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", fontSize: 14, textDecoration: "none", fontFamily: "var(--font-sans)", color: "var(--c-t2)" }}>
            <BookOpen size={16} /> Все курсы
          </Link>
          <a href={linkedInUrl.toString()} target="_blank" rel="noopener noreferrer" className="cert-linkedin" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", fontSize: 14, textDecoration: "none", fontFamily: "var(--font-sans)", color: "var(--c-amber)", border: "1px solid var(--c-border)", background: "var(--c-s1)", transition: "color 0.15s" }}>
            <ExternalLink size={16} /> LinkedIn
          </a>
          <Link href="/certificates/verify" className="cert-verify-another" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", fontSize: 14, textDecoration: "none", fontFamily: "var(--font-display)", color: "var(--c-t2)", border: "1px solid var(--c-border)", background: "var(--c-s1)", transition: "color 0.15s" }}>
            <Search size={16} /> Проверить другой
          </Link>
        </div>
      </div>
    </div>
  );
}
