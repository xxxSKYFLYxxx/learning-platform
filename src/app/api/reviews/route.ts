import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
  courseId: z.string().min(1, "Укажите курс"),
  rating: z.number().int().min(1).max(5),
  text: z.string().max(1000).optional(),
});

/**
 * POST /api/reviews
 * Create or update a review for a course.
 * A student can review only a course they are enrolled in.
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Неавторизован" }, { status: 401 });
  }

  const body = reviewSchema.safeParse(await req.json());
  if (!body.success) {
    return NextResponse.json(
      { error: body.error.issues.map((i) => i.message).join(", ") },
      { status: 400 }
    );
  }

  const { courseId, rating, text } = body.data;
  const userId = session.user.id!;

  // Verify enrollment — only enrolled students can review
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (!enrollment) {
    return NextResponse.json(
      { error: "Вы должны быть записаны на курс, чтобы оставить отзыв" },
      { status: 403 }
    );
  }

  // Upsert: allows students to edit their own review
  const review = await prisma.review.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId, rating, text: text || null },
    update: { rating, text: text || null },
  });

  return NextResponse.json({ review }, { status: 200 });
}

/**
 * DELETE /api/reviews?courseId=X
 * Delete a review (student deletes their own)
 */
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Неавторизован" }, { status: 401 });
  }

  const courseId = req.nextUrl.searchParams.get("courseId");
  if (!courseId) {
    return NextResponse.json({ error: "Укажите courseId" }, { status: 400 });
  }

  await prisma.review.deleteMany({
    where: { userId: session.user.id!, courseId },
  });

  return NextResponse.json({ deleted: true });
}
