import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import VK from "next-auth/providers/vk";
import Yandex from "next-auth/providers/yandex";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // ВКонтакте OAuth
    VK({
      clientId:     process.env.VK_CLIENT_ID!,
      clientSecret: process.env.VK_CLIENT_SECRET!,
    }),
    // Яндекс ID
    Yandex({
      clientId:     process.env.YANDEX_CLIENT_ID!,
      clientSecret: process.env.YANDEX_CLIENT_SECRET!,
    }),
    // Email magic link через Resend (резервный вариант)
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from:   process.env.EMAIL_FROM ?? "noreply@kurs.dev",
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id   = user.id;
      session.user.role = (user as { role?: string }).role ?? "STUDENT";
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error:  "/login",
  },
});
