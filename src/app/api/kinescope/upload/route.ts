/**
 * Kinescope Upload API
 * Создаёт видео в Kinescope и возвращает URL для прямой загрузки из браузера
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createUploadSession } from "@/lib/kinescope";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !["INSTRUCTOR", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { lessonId, title } = await req.json();
  if (!lessonId) {
    return NextResponse.json({ error: "Missing lessonId" }, { status: 400 });
  }

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  try {
    const { videoId, uploadUrl } = await createUploadSession(
      title ?? lesson.title
    );

    // Сохраняем videoId в БД (поле muxAssetId используем для хранения Kinescope ID)
    await prisma.lesson.update({
      where: { id: lessonId },
      data: { muxAssetId: videoId },
    });

    return NextResponse.json({ uploadUrl, videoId });
  } catch (error) {
    console.error("Kinescope upload error:", error);
    return NextResponse.json({ error: "Upload session failed" }, { status: 500 });
  }
}
