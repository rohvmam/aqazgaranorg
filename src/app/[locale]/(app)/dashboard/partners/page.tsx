import { getTranslations, setRequestLocale } from "next-intl/server";
import { EntityManager } from "@/components/dashboard/entity-manager";
import { PARTNERS_CONFIG } from "@/components/dashboard/entity-configs";

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
        {t("partners")}
      </h1>
      <EntityManager {...PARTNERS_CONFIG} />
    </div>
  );
}
