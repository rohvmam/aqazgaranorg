import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSubmissionSchema } from "@/lib/validators";

/** Public endpoint for the site contact form. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = contactSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const submission = await prisma.contactSubmission.create({
    data: { ...parsed.data, status: "NEW" },
  });

  await prisma.notification.create({
    data: {
      title: "New contact submission",
      body: `${submission.name} — ${submission.topic}`,
      type: "INFO",
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
