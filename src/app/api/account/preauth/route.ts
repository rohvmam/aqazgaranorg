import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendOtpEmail } from "@/lib/mailer";
import { issueOtp } from "@/lib/otp";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  locale: z.string().max(5).optional(),
});

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  const visible = user.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(1, user.length - 2))}@${domain}`;
}

/**
 * First step of the login flow: validates credentials, then emails a
 * one-time 6-digit code. Every login requires the code; users with an
 * authenticator app enrolled may enter a TOTP instead.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  const valid = user && (await bcrypt.compare(parsed.data.password, user.passwordHash));
  if (!valid) {
    return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  // Best-effort delivery: a mail hiccup must not turn valid credentials
  // into a 500. issueOtp returns null when the issue cap is hit — the
  // previously sent code is still live, so the user can proceed.
  try {
    const code = await issueOtp(user.id, "LOGIN");
    if (code) await sendOtpEmail(user.email, code, parsed.data.locale);
  } catch (err) {
    console.error("[preauth] OTP delivery failed:", err);
  }

  return NextResponse.json({
    ok: true,
    otpRequired: true,
    emailMasked: maskEmail(user.email),
    totpAvailable: user.twoFactorEnabled,
  });
}
