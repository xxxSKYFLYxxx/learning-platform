"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name:     z.string().trim().min(2, "Имя должно быть не короче 2 символов").max(60),
  email:    z.string().trim().toLowerCase().email("Введите корректный email"),
  password: z.string().min(6, "Пароль должен быть не короче 6 символов").max(100),
});

export type RegisterResult = { ok: true } | { ok: false; error: string };

export async function registerUser(formData: FormData): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse({
    name:     formData.get("name"),
    email:    formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Проверьте введённые данные" };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: "Пользователь с таким email уже зарегистрирован" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, passwordHash, role: "STUDENT" },
  });

  return { ok: true };
}
