import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2).optional(),
  title: z.string().optional().nullable(),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }

  const data: Record<string, unknown> = {};
  if (parsed.data.name) data.name = parsed.data.name;
  if (parsed.data.title !== undefined) data.title = parsed.data.title;

  if (parsed.data.newPassword) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    const ok =
      user &&
      parsed.data.currentPassword &&
      (await bcrypt.compare(parsed.data.currentPassword, user.passwordHash));
    if (!ok) {
      return NextResponse.json({ error: "WRONG_PASSWORD" }, { status: 400 });
    }
    data.passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  }

  await prisma.user.update({ where: { id: session.user.id }, data });
  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE",
      entity: "profile",
      detail: parsed.data.newPassword ? "password changed" : "profile updated",
    },
  });
  return NextResponse.json({ ok: true });
}
