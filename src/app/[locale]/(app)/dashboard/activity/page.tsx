import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

const ACTION_TONE: Record<string, string> = {
  CREATE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  UPDATE: "border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  DELETE: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
  LOGIN: "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

export default async function ActivityPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  setRequestLocale(locale);
  const fa = locale === "fa";
  const t = await getTranslations("dash");

  const page = Math.max(0, Number(pageParam) || 0);
  const PAGE_SIZE = 30;

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: page * PAGE_SIZE,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.activityLog.count(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t("activity")}
        </h1>
        <p className="text-xs text-muted-foreground tabular">
          {total} {fa ? "رویداد" : "events"}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {[
                  fa ? "عملیات" : "Action",
                  fa ? "کاربر" : "User",
                  fa ? "موجودیت" : "Entity",
                  fa ? "جزئیات" : "Detail",
                  fa ? "زمان" : "Time",
                ].map((h) => (
                  <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("font-mono text-[10px]", ACTION_TONE[log.action] ?? "")}
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.user?.name ?? "System"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.entity}
                  </TableCell>
                  <TableCell className="max-w-72 truncate text-sm text-muted-foreground">
                    {log.detail ?? "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(log.createdAt, locale)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs">
            <span className="text-muted-foreground tabular">
              {page + 1} / {totalPages}
            </span>
            <div className="flex gap-3">
              {page > 0 && (
                <a href={`?page=${page - 1}`} className="text-primary hover:underline">
                  {fa ? "قبلی" : "Previous"}
                </a>
              )}
              {page + 1 < totalPages && (
                <a href={`?page=${page + 1}`} className="text-primary hover:underline">
                  {fa ? "بعدی" : "Next"}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
