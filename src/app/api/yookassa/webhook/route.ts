/**
 * Вебхук ЮКассы — обрабатывает успешные платежи
 * ЮКасса отправляет POST-запросы при изменении статуса платежа
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPayment } from "@/lib/yookassa";

export async function POST(req: NextRequest) {
  let body: { event: string; object: { id: string; metadata: Record<string, string>; status: string } };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Обрабатываем только успешные платежи
  if (body.event !== "payment.succeeded") {
    return NextResponse.json({ ok: true });
  }

  const paymentId = body.object.id;

  // Дополнительная проверка через API ЮКассы (защита от фальшивых вебхуков)
  const payment = await getPayment(paymentId);

  if (payment.status !== "succeeded") {
    return NextResponse.json({ error: "Payment not succeeded" }, { status: 400 });
  }

  const { userId, courseId } = payment.metadata;
  if (!userId || !courseId) {
    return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
  }

  // Создаём запись о зачислении
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: {
      userId,
      courseId,
      status: "ACTIVE",
      stripePaymentIntentId: paymentId, // Используем поле для хранения ID ЮКассы
    },
    update: { status: "ACTIVE" },
  });

  return NextResponse.json({ received: true });
}
