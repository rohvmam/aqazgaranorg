import { prisma } from "@/lib/prisma";

/** Month key like "Mar" for the last `n` months, oldest first. */
export function lastMonths(n: number): { key: string; year: number; month: number }[] {
  const out = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      key: d.toLocaleString("en-US", { month: "short" }),
      year: d.getFullYear(),
      month: d.getMonth(),
    });
  }
  return out;
}

export async function getMonthlyCashflow(months = 8) {
  const window = lastMonths(months);
  const from = new Date(window[0].year, window[0].month, 1);
  const rows = await prisma.transaction.findMany({
    where: { date: { gte: from } },
    select: { date: true, type: true, amount: true },
  });
  return window.map(({ key, year, month }) => {
    let income = 0;
    let expense = 0;
    for (const row of rows) {
      if (row.date.getFullYear() === year && row.date.getMonth() === month) {
        if (row.type === "INCOME") income += row.amount;
        if (row.type === "EXPENSE") expense += row.amount;
      }
    }
    return { month: key, income: Math.round(income), expense: Math.round(expense) };
  });
}

export async function getOverviewStats() {
  const [income, expense, clients, deals, requests, invoicesDue, tasksOpen] =
    await Promise.all([
      prisma.transaction.aggregate({ where: { type: "INCOME" }, _sum: { amount: true } }),
      prisma.transaction.aggregate({ where: { type: "EXPENSE" }, _sum: { amount: true } }),
      prisma.client.count({ where: { status: "ACTIVE" } }),
      prisma.deal.aggregate({
        where: { stage: { notIn: ["CLOSED_LOST"] } },
        _sum: { value: true },
        _count: true,
      }),
      prisma.tradeRequest.count({
        where: { status: { in: ["RECEIVED", "REVIEW", "QUOTED", "IN_TRANSIT"] } },
      }),
      prisma.invoice.count({ where: { status: { in: ["SENT", "OVERDUE"] } } }),
      prisma.task.count({ where: { status: { not: "DONE" } } }),
    ]);

  return {
    revenue: income._sum.amount ?? 0,
    expenses: expense._sum.amount ?? 0,
    activeClients: clients,
    pipelineValue: deals._sum.value ?? 0,
    pipelineCount: deals._count,
    openRequests: requests,
    invoicesDue,
    tasksOpen,
  };
}
