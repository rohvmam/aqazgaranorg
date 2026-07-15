import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Conversations with their messages, newest conversation first. */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const conversations = await prisma.conversation.findMany({
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ conversations });
}

const sendSchema = z.object({
  conversationId: z.string().optional(),
  title: z.string().optional(),
  body: z.string().min(1),
});

/** Send a message; creates the conversation when no id is given. */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = sendSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }

  let conversationId = parsed.data.conversationId;
  if (!conversationId) {
    const conversation = await prisma.conversation.create({
      data: { title: parsed.data.title?.trim() || "New conversation" },
    });
    conversationId = conversation.id;
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: session.user.id,
      body: parsed.data.body,
      read: true,
    },
    include: { sender: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ message, conversationId }, { status: 201 });
}
