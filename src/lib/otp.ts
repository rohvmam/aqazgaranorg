import { createHash, randomInt, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";

export type OtpPurpose = "LOGIN" | "REGISTER";
export type OtpVerdict = "ok" | "invalid" | "expired" | "locked";

export const OTP_EXPIRY_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;
const OTP_ISSUE_CAP = 5; // max codes per user+purpose per 15 minutes
const OTP_ISSUE_WINDOW_MS = 15 * 60 * 1000;

function hash(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

function codesMatch(code: string, storedHash: string): boolean {
  const a = Buffer.from(hash(code), "hex");
  const b = Buffer.from(storedHash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function generateCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

/**
 * Issues a fresh code for (user, purpose), invalidating any previous
 * unconsumed one. Returns the raw code, or null when the 15-minute issue
 * cap is hit (treat as "try later", not an error the caller must leak).
 */
export async function issueOtp(
  userId: string,
  purpose: OtpPurpose,
): Promise<string | null> {
  const recent = await prisma.otpCode.count({
    where: {
      userId,
      purpose,
      createdAt: { gt: new Date(Date.now() - OTP_ISSUE_WINDOW_MS) },
    },
  });
  if (recent >= OTP_ISSUE_CAP) return null;

  await prisma.otpCode.deleteMany({
    where: { userId, purpose, consumedAt: null },
  });

  const code = generateCode();
  await prisma.otpCode.create({
    data: {
      userId,
      purpose,
      codeHash: hash(code),
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    },
  });
  return code;
}

/**
 * Verifies and consumes a code. Attempts are counted before comparison so
 * brute force burns the code after OTP_MAX_ATTEMPTS wrong tries.
 */
export async function verifyOtp(
  userId: string,
  purpose: OtpPurpose,
  code: string,
): Promise<{ verdict: OtpVerdict; attemptsLeft: number }> {
  const row = await prisma.otpCode.findFirst({
    where: { userId, purpose, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });
  if (!row || row.expiresAt < new Date()) {
    return { verdict: "expired", attemptsLeft: 0 };
  }
  if (row.attempts >= OTP_MAX_ATTEMPTS) {
    return { verdict: "locked", attemptsLeft: 0 };
  }

  const updated = await prisma.otpCode.update({
    where: { id: row.id },
    data: { attempts: { increment: 1 } },
  });

  if (!codesMatch(code, row.codeHash)) {
    const left = Math.max(0, OTP_MAX_ATTEMPTS - updated.attempts);
    return { verdict: left === 0 ? "locked" : "invalid", attemptsLeft: left };
  }

  await prisma.otpCode.update({
    where: { id: row.id },
    data: { consumedAt: new Date() },
  });
  return { verdict: "ok", attemptsLeft: OTP_MAX_ATTEMPTS - updated.attempts };
}

/** True when the newest code for (user, purpose) is older than the cooldown. */
export async function canResend(
  userId: string,
  purpose: OtpPurpose,
): Promise<boolean> {
  const latest = await prisma.otpCode.findFirst({
    where: { userId, purpose },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });
  if (!latest) return true;
  return (
    Date.now() - latest.createdAt.getTime() >
    OTP_RESEND_COOLDOWN_SECONDS * 1000
  );
}
