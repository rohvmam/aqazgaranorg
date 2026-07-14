import { generateSecret, generateURI, verifySync } from "otplib";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Begin TOTP enrollment: returns an otpauth QR (data URL) + secret. */
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = generateSecret();
  const otpauth = generateURI({
    issuer: "ATA Holding",
    label: session.user.email,
    secret,
  });
  const qr = await QRCode.toDataURL(otpauth, { margin: 1, width: 220 });

  // Stored unconfirmed; enabling happens after the user verifies a code.
  await prisma.user.update({
    where: { id: session.user.id },
    data: { totpSecret: secret, twoFactorEnabled: false },
  });

  return NextResponse.json({ qr, secret });
}

const verifySchema = z.object({ code: z.string().length(6) });

/** Confirm enrollment with a live code → enables 2FA. */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (
    !user?.totpSecret ||
    !verifySync({
      token: parsed.data.code,
      secret: user.totpSecret,
      epochTolerance: 1,
    }).valid
  ) {
    return NextResponse.json({ error: "INVALID_CODE" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorEnabled: true },
  });
  await prisma.activityLog.create({
    data: { userId: user.id, action: "UPDATE", entity: "security", detail: "2FA enabled" },
  });

  return NextResponse.json({ ok: true });
}

/** Disable 2FA. */
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await prisma.user.update({
    where: { id: session.user.id },
    data: { twoFactorEnabled: false, totpSecret: null },
  });
  await prisma.activityLog.create({
    data: { userId: session.user.id, action: "UPDATE", entity: "security", detail: "2FA disabled" },
  });
  return NextResponse.json({ ok: true });
}
