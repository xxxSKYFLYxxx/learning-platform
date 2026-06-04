import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { mux } from "@/lib/mux";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !["INSTRUCTOR", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { lessonId } = await req.json();
  if (!lessonId) return NextResponse.json({ error: "Missing lessonId" }, { status: 400 });

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

  const upload = await mux.video.uploads.create({
    new_asset_settings: {
      playback_policy: ["public"],
      encoding_tier: "baseline",
    },
    cors_origin: process.env.AUTH_URL!,
  });

  // Save asset id reference on lesson for webhook update
  await prisma.lesson.update({
    where: { id: lessonId },
    data: { muxAssetId: upload.id },
  });

  return NextResponse.json({ uploadUrl: upload.url, uploadId: upload.id });
}
