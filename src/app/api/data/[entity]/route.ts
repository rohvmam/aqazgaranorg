import { NextRequest, NextResponse } from "next/server";
import { auth, hasRole } from "@/lib/auth";
import { ENTITIES, logActivity } from "@/server/crud";

type Params = { params: Promise<{ entity: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { entity } = await params;
  const config = ENTITIES[entity];
  if (!config) {
    return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  }

  const url = req.nextUrl;
  const q = url.searchParams.get("q")?.trim();
  const take = Math.min(Number(url.searchParams.get("take")) || 50, 200);
  const skip = Number(url.searchParams.get("skip")) || 0;

  const where = q
    ? { OR: config.searchFields.map((f) => ({ [f]: { contains: q } })) }
    : undefined;

  const [items, total] = await Promise.all([
    config.delegate.findMany({
      where,
      take,
      skip,
      orderBy: config.orderBy,
      include: config.include,
    }),
    config.delegate.count({ where }),
  ]);

  return NextResponse.json({ items, total });
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { entity } = await params;
  const config = ENTITIES[entity];
  if (!config) {
    return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  }
  if (!hasRole(session.user.role, config.writeRole)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = config.schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const created = await config.delegate.create({ data: parsed.data });
  await logActivity(
    session.user.id,
    "CREATE",
    config.label,
    created.id,
    summarize(created),
  );
  return NextResponse.json(created, { status: 201 });
}

function summarize(record: Record<string, unknown>): string {
  const key =
    record.titleEn ?? record.nameEn ?? record.title ?? record.number ?? record.refCode;
  return typeof key === "string" ? key : "";
}
