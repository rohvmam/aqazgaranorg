import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** ADMIN only: list users with roles. */
export async function GET() {
  const session = await auth();
  if (!session?.user || !hasRole(session.user.role, "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      title: true,
      twoFactorEnabled: true,
      createdAt: true,
      role: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "asc" },
  });
  const roles = await prisma.role.findMany({
    include: { permissions: { include: { permission: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ users, roles });
}

const patchSchema = z.object({ userId: z.string(), roleId: z.string() });

/** ADMIN only: change a user's role. */
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !hasRole(session.user.role, "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }
  if (parsed.data.userId === session.user.id) {
    return NextResponse.json({ error: "SELF_CHANGE" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { roleId: parsed.data.roleId },
    include: { role: true },
  });
  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE",
      entity: "user role",
      entityId: updated.id,
      detail: `${updated.email} → ${updated.role.name}`,
    },
  });
  return NextResponse.json({ ok: true });
}
