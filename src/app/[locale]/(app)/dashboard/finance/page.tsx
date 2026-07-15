import { getTranslations, setRequestLocale } from "next-intl/server";
import { CashflowChart } from "@/components/dashboard/charts";
import { EntityManager } from "@/components/dashboard/entity-manager";
import { TRANSACTIONS_CONFIG } from "@/components/dashboard/entity-configs";
import { StatCard } from "@/components/dashboard/stat-card";
import { getMonthlyCashflow } from "@/lib/dashboard-data";
import { formatMoney, formatNumber } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function FinancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fa = locale === "fa";
  const t = await getTranslations("dash");

  const [income, expense, unpaid, cashflow] = await Promise.all([
    prisma.transaction.aggregate({ where: { type: "INCOME" }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { type: "EXPENSE" }, _sum: { amount: true } }),
    prisma.invoice.aggregate({
      where: { status: { in: ["SENT", "OVERDUE"] } },
      _sum: { total: true },
      _count: true,
    }),
    getMonthlyCashflow(10),
  ]);

  const totalIncome = income._sum.amount ?? 0;
  const totalExpense = expense._sum.amount ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        {t("finance")}
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={fa ? "درآمد" : "Income"}
          value={formatMoney(totalIncome, locale)}
          accent="emerald"
        />
        <StatCard
          label={fa ? "هزینه" : "Expenses"}
          value={formatMoney(totalExpense, locale)}
          accent="violet"
        />
        <StatCard
          label={fa ? "خالص" : "Net"}
          value={formatMoney(totalIncome - totalExpense, locale)}
          accent="blue"
        />
        <StatCard
          label={fa ? "فاکتورهای وصول‌نشده" : "Outstanding invoices"}
          value={formatMoney(unpaid._sum.total ?? 0, locale)}
          hint={`${formatNumber(unpaid._count, locale)} ${fa ? "فاکتور" : "invoices"}`}
          accent="cyan"
        />
      </div>

      <CashflowChart
        data={cashflow}
        title={fa ? "جریان نقدی" : "Cashflow"}
      />

      <EntityManager {...TRANSACTIONS_CONFIG} />
    </div>
  );
}
