import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

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

  // Free course -- enroll immediately
  if (course.isFree || !course.price || Number(course.price) === 0) {
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: session.user.id!, courseId } },
      create: { userId: session.user.id!, courseId, status: "ACTIVE" },
      update: { status: "ACTIVE" },
    });
    return NextResponse.redirect(new URL(`/learn/${course.slug}`, req.url));
  }

  // Paid course -- create Stripe Checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "rub",
          product_data: { name: course.title },
          unit_amount: Math.round(Number(course.price) * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { userId: session.user.id!, courseId },
    success_url: `${process.env.AUTH_URL}/dashboard?enrolled=1`,
    cancel_url: `${process.env.AUTH_URL}/courses/${course.slug}`,
    customer_email: session.user.email ?? undefined,
  });

  return NextResponse.redirect(new URL(checkoutSession.url!));
}
