import { getTranslations, setRequestLocale } from "next-intl/server";
import { EntityManager } from "@/components/dashboard/entity-manager";
import { TRADE_REQUESTS_CONFIG } from "@/components/dashboard/entity-configs";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dash");
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        {t("tradeRequests")}
      </h1>
      <EntityManager {...TRADE_REQUESTS_CONFIG} />
    </div>
  );
}
