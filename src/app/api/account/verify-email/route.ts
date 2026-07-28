import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyOtp } from "@/lib/otp";
import { prisma } from "@/lib/prisma";
import { otpCodeSchema } from "@/lib/validators";

const schema = z.object({ email: z.string().email(), code: otpCodeSchema });

/**
 * Completes registration: consumes the REGISTER code and marks the
 * mailbox as verified. Responses stay uniform for unknown emails.
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
  if (!user) {
    return NextResponse.json({ error: "CODE_INVALID" }, { status: 400 });
  }
  if (user.emailVerified) {
    return NextResponse.json({ ok: true, alreadyVerified: true });
  }

  const { verdict, attemptsLeft } = await verifyOtp(
    user.id,
    "REGISTER",
    parsed.data.code,
  );
  if (verdict === "expired") {
    return NextResponse.json({ error: "CODE_EXPIRED" }, { status: 400 });
  }
  if (verdict === "locked") {
    return NextResponse.json({ error: "CODE_LOCKED" }, { status: 429 });
  }
  if (verdict === "invalid") {
    return NextResponse.json(
      { error: "CODE_INVALID", attemptsLeft },
      { status: 400 },
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() },
  });
  await prisma.activityLog.create({
    data: {
      userId: user.id,
      action: "UPDATE",
      entity: "user",
      entityId: user.id,
      detail: "Email verified",
    },
  });

  return NextResponse.json({ ok: true });
}
