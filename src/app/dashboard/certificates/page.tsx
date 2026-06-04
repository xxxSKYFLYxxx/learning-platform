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
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-3xl font-bold text-primary mb-8">Мои сертификаты</h1>

        {certificates.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-gray-200 rounded-2xl">
            <Award className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <p className="text-muted">Завершите курс, чтобы получить сертификат</p>
            <Link href="/courses" className="mt-4 inline-block text-sm text-secondary hover:underline">
              К курсам
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-br from-primary to-primary/80 p-8 flex flex-col items-center text-center text-white">
                  <Award className="w-12 h-12 text-secondary mb-3" />
                  <p className="text-xs text-white/60 uppercase tracking-widest mb-1">Сертификат</p>
                  <h3 className="font-display font-bold text-lg leading-tight">{cert.course.title}</h3>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted mb-1">Выдан</p>
                  <p className="text-sm font-medium text-text">
                    {new Date(cert.issuedAt).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-muted mt-2 font-mono truncate">{cert.uniqueCode}</p>

                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/certificates/${cert.uniqueCode}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 rounded-lg text-xs text-muted hover:border-primary hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Просмотр
                    </Link>
                    <Link
                      href={`/api/certificates/${cert.uniqueCode}/pdf`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary text-white rounded-lg text-xs hover:bg-primary/90 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
