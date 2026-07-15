import { getTranslations, setRequestLocale } from "next-intl/server";
import { ExportButton } from "@/components/dashboard/export-button";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fa = locale === "fa";
  const t = await getTranslations("dash");

  const [clients, deals, requests, invoices, projects, investments, transactions, contacts] =
    await Promise.all([
      prisma.client.count(),
      prisma.deal.count(),
      prisma.tradeRequest.count(),
      prisma.invoice.count(),
      prisma.project.count(),
      prisma.investment.count(),
      prisma.transaction.count(),
      prisma.contactSubmission.count(),
    ]);

  const reports: { entity: string; label: string; count: number; note: string }[] = [
    { entity: "clients", label: t("clients"), count: clients, note: fa ? "دفتر مشتریان با وضعیت و ارزش" : "Client book with status and value" },
    { entity: "deals", label: t("deals"), count: deals, note: fa ? "پایپ‌لاین معاملات بین‌المللی" : "International deal pipeline" },
    { entity: "trade-requests", label: t("tradeRequests"), count: requests, note: fa ? "درخواست‌های واردات و صادرات" : "Import & export requests" },
    { entity: "invoices", label: t("invoices"), count: invoices, note: fa ? "فاکتورها و وضعیت پرداخت" : "Invoices and payment status" },
    { entity: "projects", label: t("projects"), count: projects, note: fa ? "پروژه‌ها با پیشرفت و ارزش" : "Projects with progress and value" },
    { entity: "investments", label: t("investments"), count: investments, note: fa ? "سبد سرمایه‌گذاری" : "Investment portfolio" },
    { entity: "transactions", label: t("finance"), count: transactions, note: fa ? "تراکنش‌های مالی" : "Financial transactions" },
    { entity: "contacts", label: t("contactInbox"), count: contacts, note: fa ? "پیام‌های دریافتی سایت" : "Website contact submissions" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t("reports")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {fa
            ? "خروجی CSV از هر مجموعه‌داده — تا ۲۰۰ ردیف اخیر."
            : "CSV export of any dataset — up to the 200 most recent rows."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {reports.map((report) => (
          <Card key={report.entity} className="gap-3 border-border/70 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{report.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {report.note}
                </p>
              </div>
              <span className="font-mono text-2xl font-semibold text-gradient tabular">
                {formatNumber(report.count, locale)}
              </span>
            </div>
            <div className="mt-auto">
              <ExportButton entity={report.entity} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
