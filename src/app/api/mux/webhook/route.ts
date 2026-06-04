import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mux } from "@/lib/mux";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("mux-signature");

  // Verify webhook signature
  try {
    mux.webhooks.verifySignature(body, req.headers as never, process.env.MUX_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.type === "video.asset.ready") {
    const assetId = event.data.id as string;
    const playbackId = (event.data.playback_ids?.[0]?.id ?? "") as string;
    const duration = Math.floor((event.data.duration ?? 0) as number);

    if (playbackId) {
      await prisma.lesson.updateMany({
        where: { muxAssetId: assetId },
        data: { muxPlaybackId: playbackId, duration },
      });
    }
  }

  return NextResponse.json({ received: true });
}
