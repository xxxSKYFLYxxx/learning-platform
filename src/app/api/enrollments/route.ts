import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPayment } from "@/lib/yookassa";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const courseId = req.nextUrl.searchParams.get("courseId");
  if (!courseId) {
    return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  // Бесплатный курс — сразу записываем без оплаты
  if (course.isFree || !course.price || Number(course.price) === 0) {
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: session.user.id!, courseId } },
      create: { userId: session.user.id!, courseId, status: "ACTIVE" },
      update: { status: "ACTIVE" },
    });
    return NextResponse.redirect(new URL(`/learn/${course.slug}`, req.url));
  }

  // Платный курс — создаём платёж в ЮКассе
  try {
    const payment = await createPayment({
      amount: Number(course.price),
      description: `Курс «${course.title}»`,
      returnUrl: `${process.env.AUTH_URL}/dashboard?enrolled=1`,
      metadata: {
        userId:   session.user.id!,
        courseId: course.id,
      },
    });

    return NextResponse.redirect(new URL(payment.confirmation.confirmation_url));
  } catch (error) {
    console.error("ЮКасса ошибка:", error);
    return NextResponse.redirect(
      new URL(`/courses/${course.slug}?error=payment`, req.url)
    );
  }
}
