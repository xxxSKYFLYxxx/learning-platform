import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderToBuffer, Document } from "@react-pdf/renderer";
import { CertificatePDF } from "@/components/lesson/CertificatePDF";
import React from "react";
import type { ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const cert = await prisma.certificate.findUnique({
    where: { uniqueCode: code },
    include: {
      course: { select: { title: true } },
      user: { select: { name: true } },
    },
  });

  if (!cert) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const element = React.createElement(CertificatePDF, {
    userName: cert.user.name ?? "Студент",
    courseTitle: cert.course.title,
    issuedAt: cert.issuedAt,
    uniqueCode: cert.uniqueCode,
  }) as unknown as ReactElement<DocumentProps, typeof Document>;

  const buffer = await renderToBuffer(element);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificate-${code}.pdf"`,
    },
  });
}
