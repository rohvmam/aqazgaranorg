import { getTranslations, setRequestLocale } from "next-intl/server";
import { CalendarView } from "@/components/dashboard/calendar-view";
import { CALENDAR_CONFIG } from "@/components/dashboard/entity-configs";
import { EntityManager } from "@/components/dashboard/entity-manager";

export default async function CalendarPage({
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
        {t("calendar")}
      </h1>
      <CalendarView />
      <EntityManager {...CALENDAR_CONFIG} />
    </div>
  );
}
