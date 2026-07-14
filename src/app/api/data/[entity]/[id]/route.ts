import { NextRequest, NextResponse } from "next/server";
import { auth, hasRole } from "@/lib/auth";
import { ENTITIES, logActivity } from "@/server/crud";

type Params = { params: Promise<{ entity: string; id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { entity, id } = await params;
  const config = ENTITIES[entity];
  if (!config) {
    return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  }
  const item = await config.delegate.findUnique({
    where: { id },
    include: config.include,
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { entity, id } = await params;
  const config = ENTITIES[entity];
  if (!config) {
    return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  }
  if (!hasRole(session.user.role, config.writeRole)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const partialSchema =
    "partial" in config.schema &&
    typeof (config.schema as { partial?: unknown }).partial === "function"
      ? (config.schema as unknown as { partial: () => typeof config.schema }).partial()
      : config.schema;
  const parsed = partialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const updated = await config.delegate.update({ where: { id }, data: parsed.data });
  await logActivity(session.user.id, "UPDATE", config.label, id);
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { entity, id } = await params;
  const config = ENTITIES[entity];
  if (!config) {
    return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  }
  if (!hasRole(session.user.role, config.writeRole)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await config.delegate.delete({ where: { id } });
  await logActivity(session.user.id, "DELETE", config.label, id);
  return NextResponse.json({ ok: true });
}
