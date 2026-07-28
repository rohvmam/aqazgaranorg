import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendResetEmail } from "@/lib/mailer";
import { prisma } from "@/lib/prisma";

const schema = z.object({ email: z.string().email() });

/**
 * Issues a reset token and emails the link (logged to the console when
 * SMTP is not configured); the response never reveals whether the
 * account exists.
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

  if (user) {
    const token = randomBytes(32).toString("hex");
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: new Date(Date.now() + 1000 * 60 * 30),
      },
    });
    const base = process.env.SITE_URL ?? "http://localhost:3000";
    try {
      await sendResetEmail(user.email, `${base}/en/reset-password?token=${token}`);
    } catch (err) {
      console.error("[reset-password] delivery failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
