import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendOtpEmail } from "@/lib/mailer";
import { canResend, issueOtp, type OtpPurpose } from "@/lib/otp";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  purpose: z.enum(["LOGIN", "REGISTER"]),
  locale: z.string().max(5).optional(),
});

/**
 * Re-sends a one-time code. The response is uniform whether or not the
 * account exists (anti-enumeration); only the cooldown surfaces as 429.
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
    const purpose = parsed.data.purpose as OtpPurpose;
    if (!(await canResend(user.id, purpose))) {
      return NextResponse.json({ error: "COOLDOWN" }, { status: 429 });
    }
    try {
      const code = await issueOtp(user.id, purpose);
      if (code) await sendOtpEmail(user.email, code, parsed.data.locale);
    } catch (err) {
      console.error("[otp/resend] delivery failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
