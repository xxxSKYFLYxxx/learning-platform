/**
 * Kinescope Webhook (использует путь /api/mux/webhook для обратной совместимости)
 * Kinescope отправляет событие video.done когда видео обработано
 *
 * Настройки вебхука в Kinescope: https://kinescope.io/settings/webhooks
 * Endpoint: https://yourdomain.ru/api/mux/webhook
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseDuration } from "@/lib/kinescope";

interface KinescopeWebhookEvent {
  event: "video.done" | "video.failed" | "video.processing";
  data: {
    id: string;
    status: string;
    duration?: number;
  };
}

export async function POST(req: NextRequest) {
  let event: KinescopeWebhookEvent;

  try {
    event = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event === "video.done") {
    const videoId   = event.data.id;
    const duration  = parseDuration(event.data.duration);

    // muxAssetId хранит Kinescope videoId
    // muxPlaybackId хранит тот же ID (используется плеером)
    await prisma.lesson.updateMany({
      where: { muxAssetId: videoId },
      data: {
        muxPlaybackId: videoId, // playbackId = videoId для Kinescope
        duration,
      },
    });
  }

  return NextResponse.json({ received: true });
}
