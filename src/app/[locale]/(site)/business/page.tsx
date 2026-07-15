import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/site/page-hero";
import { Container, Section } from "@/components/site/primitives";
import { BUSINESS_AREAS } from "@/content/business-areas";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("business") };
}

export default async function BusinessIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fa = locale === "fa";

  return (
    <>
      <PageHero
        eyebrow={fa ? "حوزه‌های کسب‌وکار" : "Business Areas"}
        title={fa ? "یازده بخش، یک سیستم واحد" : "Eleven divisions, one system"}
        lead={
          fa
            ? "هر حوزه به‌تنهایی یک کسب‌وکار کامل است — و در کنار هم، اکوسیستمی که ارزش را از خاستگاه تا بازار جهانی هدایت می‌کند."
            : "Each division is a complete business on its own — together, they form an ecosystem that routes value from origin to global market."
        }
      />
      <Section className="border-t border-border/30 pt-16">
        <Container>
          <RevealGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
            {BUSINESS_AREAS.map((area, i) => (
              <RevealItem key={area.slug}>
                <Link
                  href={`/business/${area.slug}`}
                  className="group glass relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition-colors duration-300 hover:border-brand-violet/40"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -end-14 -top-14 size-40 rounded-full bg-primary/10 blur-3xl transition-colors duration-500 group-hover:bg-brand-violet/20"
                  />
                  <div className="flex items-start justify-between">
                    <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-brand-cyan">
                      <area.icon className="size-5" aria-hidden />
                    </span>
                    <span className="font-mono text-xs text-text-3 tabular">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="mt-6 font-heading text-xl font-semibold text-foreground">
                    {loc(area.name, locale)}
                  </h2>
                  <p className="mt-2 text-sm font-medium text-brand-cyan/90">
                    {loc(area.tagline, locale)}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-text-2 line-clamp-3">
                    {loc(area.description, locale)}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-xs font-medium text-text-3 transition-colors group-hover:text-brand-cyan">
                    {fa ? "مشاهده حوزه" : "Explore division"}
                    <ArrowUpRight className="size-3.5 rtl:rotate-[270deg]" aria-hidden />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>
    </>
  );
}
