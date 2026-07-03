import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma/client";

function resolveRole(email: string | null | undefined): Role {
  if (!email) return "client";
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase());
  const sales = (process.env.SALES_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase());
  const lower = email.toLowerCase();
  if (admins.includes(lower)) return "admin";
  if (sales.includes(lower)) return "sales";
  return "client";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  jwt: {
    maxAge: 60 * 60 * 24, // 念のためトークン自体の有効期限（1日）
  },
  cookies: {
    sessionToken: {
      options: {
        // maxAgeを指定しないことで「ブラウザセッションCookie」になる
        // = ブラウザを閉じるとCookieが消え、次回アクセス時は未ログイン扱いになる
        maxAge: undefined,
      },
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email && account.providerAccountId) {
        const role = resolveRole(user.email);
        await prisma.user.upsert({
          where: { googleSub: account.providerAccountId },
          update: { email: user.email, displayName: user.name, role },
          create: {
            googleSub: account.providerAccountId,
            email: user.email,
            displayName: user.name,
            role,
          },
        });
      }
      return true;
    },
    async jwt({ token }) {
      if (token.email) {
        const dbUser = await prisma.user.findFirst({
          where: { email: token.email },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.appUserId = dbUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as Role;
        session.user.appUserId = token.appUserId as string;
      }
      return session;
    },
  },
});