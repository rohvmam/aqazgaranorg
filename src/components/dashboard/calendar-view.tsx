"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type EventRow = {
  id: string;
  title: string;
  start: string;
  type: string;
};

const TYPE_DOT: Record<string, string> = {
  MEETING: "bg-brand-blue",
  DEADLINE: "bg-red-500",
  TRAVEL: "bg-amber-500",
  EVENT: "bg-brand-cyan",
};

/** Lightweight month grid fed by the calendar-events entity. */
export function CalendarView() {
  const locale = useLocale();
  const fa = locale === "fa";
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const { data } = useQuery({
    queryKey: ["entity", "calendar-events", "grid"],
    queryFn: async () => {
      const res = await fetch("/api/data/calendar-events?take=200");
      if (!res.ok) throw new Error("failed");
      return (await res.json()) as { items: EventRow[] };
    },
  });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const monthName = new Intl.DateTimeFormat(fa ? "fa-IR" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(cursor);

  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(fa ? "fa-IR" : "en-US", { weekday: "short" }).format(
      new Date(2024, 8, 1 + i), // 2024-09-01 was a Sunday
    ),
  );

  const eventsOn = (day: number) =>
    (data?.items ?? []).filter((e) => {
      const d = new Date(e.start);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });

  return (
    <Card className="gap-4 border-border/70 p-5">
      <div className="flex items-center justify-between">
        <p className="font-heading text-base font-semibold">{monthName}</p>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            aria-label={fa ? "ماه قبل" : "Previous month"}
            onClick={() => setCursor(new Date(year, month - 1, 1))}
          >
            <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            aria-label={fa ? "ماه بعد" : "Next month"}
            onClick={() => setCursor(new Date(year, month + 1, 1))}
          >
            <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-border bg-border">
        {weekdays.map((day) => (
          <div key={day} className="bg-muted px-2 py-1.5 text-center text-[11px] font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`pad-${i}`} className="min-h-20 bg-card/60" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const events = eventsOn(day);
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;
          return (
            <div key={day} className="min-h-20 bg-card p-1.5">
              <span
                className={cn(
                  "inline-flex size-6 items-center justify-center rounded-full font-mono text-[11px] tabular",
                  isToday
                    ? "gradient-brand font-semibold text-white"
                    : "text-muted-foreground",
                )}
              >
                {new Intl.NumberFormat(fa ? "fa-IR" : "en-US").format(day)}
              </span>
              <div className="mt-1 space-y-1">
                {events.slice(0, 2).map((event) => (
                  <p
                    key={event.id}
                    className="flex items-center gap-1.5 truncate text-[11px]"
                    title={event.title}
                  >
                    <span
                      aria-hidden
                      className={cn("size-1.5 shrink-0 rounded-full", TYPE_DOT[event.type] ?? "bg-brand-blue")}
                    />
                    <span className="truncate">{event.title}</span>
                  </p>
                ))}
                {events.length > 2 && (
                  <p className="text-[10px] text-muted-foreground">
                    +{events.length - 2}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
