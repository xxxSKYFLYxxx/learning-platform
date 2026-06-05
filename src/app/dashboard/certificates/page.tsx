import { redirect } from "next/navigation";
import Link from "next/link";
import { Award, ExternalLink, Download } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "Мои сертификаты" };

export default async function CertificatesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const certificates = await prisma.certificate.findMany({
    where: { userId: session.user.id! },
    include: {
      course: { select: { id: true, title: true, slug: true, imageUrl: true } },
    },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div className="grain" style={{ background: "var(--c-bg)", minHeight: "100vh" }}>
      <Header />
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--c-t1)", fontFamily: "var(--font-display)", marginBottom: 32 }}>Мои сертификаты</h1>

        {certificates.length === 0 ? (
          <div style={{ textAlign: "center", padding: "96px 0", border: "1px dashed var(--c-border)" }}>
            <Award size={40} style={{ color: "var(--c-border-hi)", margin: "0 auto 16px" }} />
            <p style={{ color: "var(--c-t3)", fontFamily: "var(--font-sans)" }}>Завершите курс, чтобы получить сертификат</p>
            <Link href="/courses" className="link-muted" style={{ marginTop: 16, display: "inline-block", fontSize: 14, textDecoration: "none", fontFamily: "var(--font-sans)" }}>
              К курсам →
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {certificates.map((cert) => (
              <div key={cert.id} className="course-card" style={{ overflow: "hidden" }}>
                <div style={{ background: "linear-gradient(135deg, var(--c-s2), var(--c-bg))", padding: 32, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", borderBottom: "1px solid var(--c-border)" }}>
                  <Award size={48} style={{ color: "var(--c-amber)", marginBottom: 12 }} />
                  <p style={{ fontSize: 11, color: "var(--c-t3)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6, fontFamily: "var(--font-mono)" }}>Сертификат</p>
                  <h3 style={{ fontWeight: 900, fontSize: 17, lineHeight: 1.25, color: "var(--c-t1)", fontFamily: "var(--font-display)" }}>{cert.course.title}</h3>
                </div>
                <div style={{ padding: 16 }}>
                  <p style={{ fontSize: 11, color: "var(--c-t4)", marginBottom: 2, fontFamily: "var(--font-mono)" }}>Выдан</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--c-t1)", fontFamily: "var(--font-sans)" }}>
                    {new Date(cert.issuedAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--c-t4)", marginTop: 8, fontFamily: "var(--font-mono)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cert.uniqueCode}</p>

                  <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                    <Link href={`/certificates/${cert.uniqueCode}`} className="btn-ghost" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", fontSize: 12, textDecoration: "none", fontFamily: "var(--font-sans)" }}>
                      <ExternalLink size={13} /> Просмотр
                    </Link>
                    <Link href={`/api/certificates/${cert.uniqueCode}/pdf`} className="btn-red" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", fontSize: 12, textDecoration: "none", fontFamily: "var(--font-sans)" }}>
                      <Download size={13} /> PDF
                    </Link>
                  </div>
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
