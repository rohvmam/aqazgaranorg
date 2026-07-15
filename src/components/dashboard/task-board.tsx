"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  assignee?: { name: string } | null;
  project?: { titleEn: string; titleFa: string } | null;
};

const COLUMNS = [
  { status: "TODO", en: "To do", fa: "انجام‌نشده", tone: "border-t-slate-400" },
  { status: "IN_PROGRESS", en: "In progress", fa: "در حال انجام", tone: "border-t-brand-blue" },
  { status: "REVIEW", en: "In review", fa: "در بررسی", tone: "border-t-brand-violet" },
  { status: "DONE", en: "Done", fa: "انجام‌شده", tone: "border-t-emerald-500" },
];

const PRIORITY_TONE: Record<string, string> = {
  LOW: "border-border bg-muted text-muted-foreground",
  MEDIUM: "border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  HIGH: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  URGENT: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
};

export function TaskBoard() {
  const locale = useLocale();
  const fa = locale === "fa";
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["entity", "tasks", "board"],
    queryFn: async () => {
      const res = await fetch("/api/data/tasks?take=200");
      if (!res.ok) throw new Error("failed");
      return (await res.json()) as { items: TaskRow[] };
    },
  });

  const move = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/data/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("failed");
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["entity", "tasks"] }),
    onError: () => toast.error(fa ? "جابه‌جایی ناموفق بود." : "Move failed."),
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {COLUMNS.map((column) => {
        const tasks = (data?.items ?? []).filter((t) => t.status === column.status);
        return (
          <div key={column.status} className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-semibold">
                {fa ? column.fa : column.en}
              </p>
              <span className="font-mono text-xs text-muted-foreground tabular">
                {tasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {isLoading &&
                Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 rounded-2xl" />
                ))}
              {tasks.map((task) => (
                <Card
                  key={task.id}
                  className={cn("gap-2.5 border-t-2 border-border/70 p-4", column.tone)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug">{task.title}</p>
                    <Badge
                      variant="outline"
                      className={cn("shrink-0 font-mono text-[9px]", PRIORITY_TONE[task.priority])}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  {task.description && (
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                    <span className="truncate">
                      {task.project
                        ? fa
                          ? task.project.titleFa
                          : task.project.titleEn
                        : task.assignee?.name ?? ""}
                    </span>
                    {task.dueDate && (
                      <time className="shrink-0 font-mono tabular">
                        {formatDate(task.dueDate, locale)}
                      </time>
                    )}
                  </div>
                  <Select
                    value={task.status}
                    onValueChange={(status) => move.mutate({ id: task.id, status })}
                  >
                    <SelectTrigger className="!h-8 w-full text-xs" aria-label={fa ? "تغییر وضعیت" : "Change status"}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COLUMNS.map((c) => (
                        <SelectItem key={c.status} value={c.status}>
                          {fa ? c.fa : c.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Card>
              ))}
              {!isLoading && tasks.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                  {fa ? "خالی" : "Empty"}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
