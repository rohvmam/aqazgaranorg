import { getTranslations, setRequestLocale } from "next-intl/server";
import { CashflowChart, CategoryBarChart } from "@/components/dashboard/charts";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { getMonthlyCashflow, getOverviewStats } from "@/lib/dashboard-data";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fa = locale === "fa";
  const t = await getTranslations("dash");
  const session = await auth();

  const [stats, cashflow, dealsByStage, activity, events] = await Promise.all([
    getOverviewStats(),
    getMonthlyCashflow(8),
    prisma.deal.groupBy({ by: ["stage"], _sum: { value: true } }),
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: { select: { name: true } } },
    }),
    prisma.calendarEvent.findMany({
      where: { start: { gte: new Date() } },
      orderBy: { start: "asc" },
      take: 5,
    }),
  ]);

  const stageData = dealsByStage
    .filter((d) => d.stage !== "CLOSED_LOST")
    .map((d) => ({
      name: d.stage.replaceAll("_", " ").toLowerCase(),
      value: Math.round(d._sum.value ?? 0),
    }));

  const firstName = (session?.user?.name ?? "").split(" ")[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {fa ? `خوش آمدید، ${firstName}` : `Welcome back, ${firstName}`}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {fa
            ? "وضعیت هلدینگ در یک نگاه."
            : "The holding at a glance."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={fa ? "درآمد کل" : "Total revenue"}
          value={formatMoney(stats.revenue, locale)}
          delta={12}
          hint={fa ? "نسبت به دوره قبل" : "vs previous period"}
          accent="blue"
        />
        <StatCard
          label={fa ? "ارزش پایپ‌لاین معاملات" : "Deal pipeline"}
          value={formatMoney(stats.pipelineValue, locale)}
          hint={`${formatNumber(stats.pipelineCount, locale)} ${fa ? "معامله باز" : "open deals"}`}
          accent="violet"
        />
        <StatCard
          label={fa ? "مشتریان فعال" : "Active clients"}
          value={formatNumber(stats.activeClients, locale)}
          delta={6}
          accent="cyan"
        />
        <StatCard
          label={fa ? "درخواست‌های تجاری باز" : "Open trade requests"}
          value={formatNumber(stats.openRequests, locale)}
          hint={`${formatNumber(stats.invoicesDue, locale)} ${fa ? "فاکتور در انتظار" : "invoices outstanding"}`}
          accent="emerald"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <CashflowChart
            data={cashflow}
            title={fa ? "جریان نقدی ماهانه" : "Monthly cashflow"}
          />
        </div>
        <div className="xl:col-span-2">
          <CategoryBarChart
            data={stageData}
            money
            title={fa ? "معاملات بر اساس مرحله" : "Deals by stage"}
          />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Recent activity */}
        <Card className="gap-4 border-border/70 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">{t("activity")}</p>
            <Link href="/dashboard/activity" className="text-xs text-primary hover:underline">
              {fa ? "مشاهده همه" : "View all"}
            </Link>
          </div>
          <ul className="space-y-3">
            {activity.map((log) => (
              <li key={log.id} className="flex items-center gap-3 text-sm">
                <Badge variant="outline" className="w-16 justify-center font-mono text-[10px]">
                  {log.action}
                </Badge>
                <span className="min-w-0 flex-1 truncate text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {log.user?.name ?? "System"}
                  </span>{" "}
                  — {log.entity}
                  {log.detail ? ` · ${log.detail}` : ""}
                </span>
                <time className="shrink-0 text-xs text-muted-foreground/70">
                  {formatDate(log.createdAt, locale)}
                </time>
              </li>
            ))}
          </ul>
        </Card>

        {/* Upcoming */}
        <Card className="gap-4 border-border/70 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">
              {fa ? "رویدادهای پیش رو" : "Upcoming"}
            </p>
            <Link href="/dashboard/calendar" className="text-xs text-primary hover:underline">
              {t("calendar")}
            </Link>
          </div>
          {events.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {t("emptyTitle")}
            </p>
          ) : (
            <ul className="space-y-3">
              {events.map((event) => (
                <li key={event.id} className="flex items-center gap-3 text-sm">
                  <span className="w-24 shrink-0 font-mono text-xs text-brand-cyan tabular">
                    {formatDate(event.start, locale)}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {event.title}
                  </span>
                  {event.location && (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {event.location}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
