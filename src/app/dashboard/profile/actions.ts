"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Имя должно быть не короче 2 символов").max(60),
  image: z.string().max(500).optional().nullable(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Введите текущий пароль"),
  newPassword: z.string().min(6, "Новый пароль должен быть не короче 6 символов").max(100),
});

export type ProfileResult = { ok: true } | { ok: false; error: string };

/**
 * Update user profile: name and avatar URL.
 */
export async function updateProfile(formData: FormData): Promise<ProfileResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Неавторизован" };
  }

  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
    image: formData.get("image") || null,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Проверьте данные" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name, image: parsed.data.image },
  });

  revalidatePath("/dashboard/profile");
  return { ok: true };
}

/**
 * Change user password.
 */
export async function changePassword(formData: FormData): Promise<ProfileResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Неавторизован" };
  }

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Проверьте данные" };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { passwordHash: true } });
  if (!user?.passwordHash) {
    return { ok: false, error: "У вашего аккаунта нет пароля (возможно, вход через соцсети)" };
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) {
    return { ok: false, error: "Текущий пароль введён неверно" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash },
  });

  return { ok: true };
}