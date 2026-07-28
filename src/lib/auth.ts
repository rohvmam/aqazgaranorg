import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { verifySync } from "otplib";
import { verifyOtp } from "@/lib/otp";
import { prisma } from "@/lib/prisma";

export type AppRole = "ADMIN" | "MANAGER" | "ANALYST" | "VIEWER";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/en/login" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        code: {},
      },
      authorize: async (credentials) => {
        const email = String(credentials?.email ?? "").toLowerCase();
        const password = String(credentials?.password ?? "");
        const code = String(credentials?.code ?? "");
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { role: true },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        // Every login requires a one-time code: either the emailed 6-digit
        // OTP or, for enrolled users, an authenticator-app TOTP.
        if (!code) return null;
        const totpValid =
          user.twoFactorEnabled &&
          user.totpSecret &&
          verifySync({
            token: code,
            secret: user.totpSecret,
            epochTolerance: 1,
          }).valid;
        if (!totpValid) {
          const { verdict } = await verifyOtp(user.id, "LOGIN", code);
          if (verdict !== "ok") return null;
        }

        // A consumed emailed code proves mailbox control.
        if (!user.emailVerified) {
          await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() },
          });
        }

        await prisma.activityLog.create({
          data: {
            userId: user.id,
            action: "LOGIN",
            entity: "session",
            detail: user.email,
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.name as AppRole,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: AppRole }).role ?? "VIEWER";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as AppRole;
      }
      return session;
    },
  },
});

/** Role gate for API handlers and server components. */
export const ROLE_RANK: Record<AppRole, number> = {
  VIEWER: 0,
  ANALYST: 1,
  MANAGER: 2,
  ADMIN: 3,
};

export function hasRole(role: string | undefined, min: AppRole): boolean {
  if (!role || !(role in ROLE_RANK)) return false;
  return ROLE_RANK[role as AppRole] >= ROLE_RANK[min];
}
