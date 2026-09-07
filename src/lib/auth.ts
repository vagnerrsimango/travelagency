import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import type { AdminRole } from "@/generated/prisma/client";

// Matches the pattern used across xclusivo / jstore-website / elleza's
// admin backoffices: NextAuth v4, CredentialsProvider, bcryptjs, JWT
// session strategy with the role embedded in the token. See ROADMAP.md
// Phase 1 and memory `user-stack-preference` for why this shape specifically.
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const user = await prisma.adminUser.findUnique({ where: { email } });

        // Deliberately generic failure for both "no such user" and "wrong
        // password" — do not leak which one it was (NFR Segurança).
        if (!user || !user.isActive) {
          return null;
        }

        const passwordIsValid = await compare(password, user.passwordHash);
        if (!passwordIsValid) {
          return null;
        }

        await prisma.adminUser.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        await logAudit({
          actorId: user.id,
          action: "auth.login",
          entityType: "AdminUser",
          entityId: user.id,
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: AdminRole }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as AdminRole;
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.id) {
        await logAudit({
          actorId: token.id as string,
          action: "auth.logout",
          entityType: "AdminUser",
          entityId: token.id as string,
        });
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
