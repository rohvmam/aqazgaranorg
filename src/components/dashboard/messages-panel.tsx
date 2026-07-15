"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Send } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type MessageRow = {
  id: string;
  body: string;
  createdAt: string;
  sender: { id: string; name: string } | null;
};

type ConversationRow = {
  id: string;
  title: string;
  createdAt: string;
  messages: MessageRow[];
};

export function MessagesPanel({ currentUserId }: { currentUserId: string }) {
  const locale = useLocale();
  const fa = locale === "fa";
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [composing, setComposing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const res = await fetch("/api/messages");
      if (!res.ok) throw new Error("failed");
      return (await res.json()) as { conversations: ConversationRow[] };
    },
    refetchInterval: 30_000,
  });

  const conversations = data?.conversations ?? [];
  const active =
    conversations.find((c) => c.id === selected) ?? conversations[0] ?? null;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [active?.messages.length, active?.id]);

  const send = useMutation({
    mutationFn: async (payload: {
      conversationId?: string;
      title?: string;
      body: string;
    }) => {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      return (await res.json()) as { conversationId: string };
    },
    onSuccess: (result) => {
      setDraft("");
      setComposing(false);
      setNewTitle("");
      setSelected(result.conversationId);
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    if (composing) {
      send.mutate({ title: newTitle.trim() || undefined, body: draft });
    } else if (active) {
      send.mutate({ conversationId: active.id, body: draft });
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      {/* Conversation list */}
      <Card className="gap-0 overflow-hidden border-border/70 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">
            {fa ? "گفت‌وگوها" : "Conversations"}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label={fa ? "گفت‌وگوی جدید" : "New conversation"}
            onClick={() => {
              setComposing(true);
              setSelected(null);
            }}
          >
            <Plus className="size-4" aria-hidden />
          </Button>
        </div>
        <div className="max-h-[520px] overflow-y-auto">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border-b border-border/60 p-4">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="mt-2 h-3 w-48" />
              </div>
            ))}
          {conversations.map((conversation) => {
            const last = conversation.messages.at(-1);
            const isActive = !composing && active?.id === conversation.id;
            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => {
                  setComposing(false);
                  setSelected(conversation.id);
                }}
                className={cn(
                  "block w-full border-b border-border/60 p-4 text-start transition-colors last:border-0",
                  isActive ? "bg-accent" : "hover:bg-accent/50",
                )}
              >
                <p className="truncate text-sm font-medium">{conversation.title}</p>
                {last && (
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {last.sender?.name}: {last.body}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Thread */}
      <Card className="flex h-[580px] flex-col gap-0 overflow-hidden border-border/70 p-0">
        <div className="border-b border-border px-5 py-3.5">
          {composing ? (
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={fa ? "موضوع گفت‌وگوی جدید…" : "New conversation subject…"}
              className="h-9 border-0 bg-transparent px-0 font-semibold shadow-none focus-visible:ring-0"
            />
          ) : (
            <p className="truncate text-sm font-semibold">
              {active?.title ?? (fa ? "گفت‌وگویی انتخاب نشده" : "No conversation selected")}
            </p>
          )}
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {!composing &&
            active?.messages.map((message) => {
              const mine = message.sender?.id === currentUserId;
              return (
                <div
                  key={message.id}
                  className={cn("flex items-end gap-2.5", mine && "flex-row-reverse")}
                >
                  <Avatar className="size-7">
                    <AvatarFallback
                      className={cn(
                        "text-[10px] font-semibold",
                        mine ? "gradient-brand text-white" : "bg-muted",
                      )}
                    >
                      {(message.sender?.name ?? "?")
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      mine
                        ? "gradient-brand text-white"
                        : "bg-muted text-foreground",
                    )}
                  >
                    <p>{message.body}</p>
                    <p
                      className={cn(
                        "mt-1 text-[10px]",
                        mine ? "text-white/70" : "text-muted-foreground",
                      )}
                    >
                      {message.sender?.name} · {formatDate(message.createdAt, locale)}
                    </p>
                  </div>
                </div>
              );
            })}
          {composing && (
            <p className="pt-16 text-center text-sm text-muted-foreground">
              {fa
                ? "موضوع را بنویسید و نخستین پیام را ارسال کنید."
                : "Set a subject and send the first message."}
            </p>
          )}
        </div>

        <form onSubmit={submit} className="flex gap-2 border-t border-border p-4">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={fa ? "پیام خود را بنویسید…" : "Write a message…"}
            aria-label={fa ? "پیام" : "Message"}
            className="h-11 rounded-full"
          />
          <Button
            type="submit"
            size="icon"
            disabled={send.isPending || !draft.trim() || (!active && !composing)}
            aria-label={fa ? "ارسال" : "Send"}
            className="size-11 shrink-0 rounded-full gradient-brand text-white"
          >
            {send.isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Send className="size-4 rtl:-scale-x-100" aria-hidden />
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
