import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  CashflowChart,
  CategoryBarChart,
  DonutChart,
} from "@/components/dashboard/charts";
import { StatCard } from "@/components/dashboard/stat-card";
import { getMonthlyCashflow } from "@/lib/dashboard-data";
import { formatMoney, formatNumber } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fa = locale === "fa";
  const t = await getTranslations("dash");

  const [cashflow, requestsByStatus, investmentsBySector, platforms, tradeVolume, dealWinRate] =
    await Promise.all([
      getMonthlyCashflow(12),
      prisma.tradeRequest.groupBy({ by: ["status"], _count: true }),
      prisma.investment.groupBy({ by: ["sector"], _sum: { amount: true } }),
      prisma.platform.findMany({ select: { nameEn: true, nameFa: true, users: true } }),
      prisma.tradeRequest.aggregate({ _sum: { value: true } }),
      prisma.deal.groupBy({ by: ["stage"], _count: true }),
    ]);

  const won = dealWinRate.find((d) => d.stage === "CLOSED_WON")?._count ?? 0;
  const lost = dealWinRate.find((d) => d.stage === "CLOSED_LOST")?._count ?? 0;
  const winRate = won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        {t("analytics")}
      </h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label={fa ? "حجم درخواست‌های تجاری" : "Trade request volume"}
          value={formatMoney(tradeVolume._sum.value ?? 0, locale)}
          accent="blue"
        />
        <StatCard
          label={fa ? "نرخ موفقیت معاملات" : "Deal win rate"}
          value={`${formatNumber(winRate, locale)}%`}
          accent="violet"
        />
        <StatCard
          label={fa ? "کاربران پلتفرم‌ها" : "Platform users"}
          value={formatNumber(
            platforms.reduce((sum, p) => sum + p.users, 0),
            locale,
          )}
          delta={9}
          accent="cyan"
        />
      </div>

      <CashflowChart
        data={cashflow}
        title={fa ? "جریان نقدی ۱۲ ماه اخیر" : "Cashflow — last 12 months"}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <DonutChart
          title={fa ? "درخواست‌ها بر اساس وضعیت" : "Requests by status"}
          data={requestsByStatus.map((r) => ({
            name: r.status.replaceAll("_", " ").toLowerCase(),
            value: r._count,
          }))}
        />
        <CategoryBarChart
          money
          title={fa ? "سرمایه‌گذاری بر اساس بخش" : "Investments by sector"}
          data={investmentsBySector.map((r) => ({
            name: r.sector,
            value: Math.round(r._sum.amount ?? 0),
          }))}
        />
        <CategoryBarChart
          title={fa ? "کاربران هر پلتفرم" : "Users per platform"}
          data={platforms.map((p) => ({
            name: fa ? p.nameFa : p.nameEn,
            value: p.users,
          }))}
        />
      </div>
    </div>
  );
}
