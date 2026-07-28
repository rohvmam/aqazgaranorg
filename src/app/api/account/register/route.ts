import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { sendOtpEmail } from "@/lib/mailer";
import { issueOtp } from "@/lib/otp";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "EMAIL_IN_USE" }, { status: 409 });
  }

  const viewerRole = await prisma.role.findUnique({ where: { name: "VIEWER" } });
  if (!viewerRole) {
    return NextResponse.json({ error: "Roles not seeded" }, { status: 500 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      phone: parsed.data.phone,
      passwordHash,
      roleId: viewerRole.id,
    },
  });

  await prisma.activityLog.create({
    data: { userId: user.id, action: "CREATE", entity: "user", entityId: user.id, detail: email },
  });

  const locale = typeof (body as { locale?: unknown })?.locale === "string"
    ? String((body as { locale?: string }).locale)
    : undefined;
  try {
    const code = await issueOtp(user.id, "REGISTER");
    if (code) await sendOtpEmail(email, code, locale);
  } catch (err) {
    console.error("[register] OTP delivery failed:", err);
  }

  return NextResponse.json({ ok: true, verifyRequired: true }, { status: 201 });
}
