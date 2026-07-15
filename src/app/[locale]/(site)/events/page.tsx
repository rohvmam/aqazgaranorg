import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/site/page-hero";
import { Container, Section } from "@/components/site/primitives";
import { formatDate } from "@/lib/format";
import { loc, type L } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("events") };
}

const TYPE_LABEL: Record<string, L> = {
  SUMMIT: { en: "Summit", fa: "اجلاس" },
  EXPO: { en: "Expo", fa: "نمایشگاه" },
  WEBINAR: { en: "Webinar", fa: "وبینار" },
  FORUM: { en: "Forum", fa: "همایش" },
};

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fa = locale === "fa";
  const now = new Date();

  const events = await prisma.event.findMany({ orderBy: { startDate: "asc" } });
  const upcoming = events.filter((e) => e.startDate >= now);
  const past = events.filter((e) => e.startDate < now).reverse();

  const Group = ({ title, items, dimmed }: { title: string; items: typeof events; dimmed?: boolean }) =>
    items.length === 0 ? null : (
      <div className="mb-16 last:mb-0">
        <p className="eyebrow mb-8">{title}</p>
        <RevealGroup className="space-y-4" stagger={0.06}>
          {items.map((event) => (
            <RevealItem key={event.id}>
              <article
                className={cn(
                  "glass group grid gap-6 rounded-3xl p-7 transition-colors duration-300 hover:border-brand-violet/40 md:grid-cols-[140px_1fr_auto] md:items-center",
                  dimmed && "opacity-60",
                )}
              >
                <div className="font-mono text-sm text-brand-cyan tabular">
                  {formatDate(event.startDate, locale)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-border/60 px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-text-2">
                      {loc(TYPE_LABEL[event.type] ?? TYPE_LABEL.SUMMIT, locale)}
                    </span>
                  </div>
                  <h2 className="mt-2.5 font-heading text-xl font-semibold text-foreground">
                    {fa ? event.titleFa : event.titleEn}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-2">
                    {fa ? event.descriptionFa : event.descriptionEn}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-3 md:flex-col md:items-end">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5" aria-hidden />
                    {event.location}
                  </span>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    );

  return (
    <>
      <PageHero
        eyebrow={fa ? "رویدادها" : "Events"}
        title={fa ? "جایی که شبکه گرد هم می‌آید" : "Where the network gathers"}
        lead={
          fa
            ? "اجلاس‌ها، نمایشگاه‌ها و وبینارهایی که هلدینگ برگزار می‌کند یا در آن‌ها حضور دارد."
            : "Summits, expos, and webinars the holding hosts or attends."
        }
      />
      <Section className="border-t border-border/30 pt-12">
        <Container>
          {events.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <CalendarDays className="size-8 text-text-3" aria-hidden />
              <p className="text-text-2">
                {fa ? "رویدادی ثبت نشده است." : "No events scheduled yet."}
              </p>
            </div>
          )}
          <Group title={fa ? "پیش رو" : "Upcoming"} items={upcoming} />
          <Group title={fa ? "برگزارشده" : "Past"} items={past} dimmed />
        </Container>
      </Section>
    </>
  );
}
