import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string | undefined)?.trim().toLowerCase();
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const fallbackAdminEmail = process.env.FALLBACK_ADMIN_EMAIL?.trim().toLowerCase();
        const fallbackAdminPassword = process.env.FALLBACK_ADMIN_PASSWORD;

        if (fallbackAdminEmail && fallbackAdminPassword && email === fallbackAdminEmail && password === fallbackAdminPassword) {
          try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (user?.passwordHash) {
              const valid = await bcrypt.compare(password, user.passwordHash);
              if (valid) {
                return {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  image: user.image,
                  role: user.role,
                };
              }
            }
          } catch {
            // Private fallback keeps the CMS reachable before production DB is configured.
          }

          return {
            id: "fallback-admin",
            email: fallbackAdminEmail,
            name: "Администратор",
            image: null,
            role: "ADMIN",
          };
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "STUDENT";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? token.sub!;
        session.user.role = (token.role as string) ?? "STUDENT";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
