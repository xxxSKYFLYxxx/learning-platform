import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Некорректный email"),
  topic: z.string().min(1, "Укажите тему"),
  message: z.string().min(10, "Сообщение должно содержать минимум 10 символов"),
});

/**
 * POST /api/contact
 * Handle contact form submissions
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues.map((i) => i.message).join(", ") },
        { status: 400 }
      );
    }

    const { name, email, topic, message } = validation.data;

    if (!process.env.RESEND_API_KEY) {
      console.log("Contact form submission (RESEND_API_KEY not set):", {
        name,
        email,
        topic,
        message,
      });
      return NextResponse.json(
        { success: true, message: "Сообщение успешно отправлено" },
        { status: 200 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: "hello@kurs.dev",
      subject: `Contact Form: ${topic}`,
      html: `
        <h2>Новое сообщение из контактной формы</h2>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Тема:</strong> ${topic}</p>
        <p><strong>Сообщение:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Сообщение успешно отправлено" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { error: "Произошла ошибка при отправке сообщения" },
      { status: 500 }
    );
  }
}