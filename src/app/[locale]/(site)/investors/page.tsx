import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Counter } from "@/components/motion/counter";
import { MeridianLine } from "@/components/motion/draw-line";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Opportunities } from "@/components/site/home/opportunities";
import { PageHero } from "@/components/site/page-hero";
import { PortfolioChart } from "@/components/site/portfolio-chart";
import { GlowCta, Container, Section, SectionHeading } from "@/components/site/primitives";
import { INVESTORS_PAGE } from "@/content/pages";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/content";
import { prisma } from "@/lib/prisma";

// Render at request time — `next build` must not need a database.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("investors") };
}

export default async function InvestorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fa = locale === "fa";

  const investments = await prisma.investment.findMany();
  const bySector = new Map<string, number>();
  for (const inv of investments) {
    bySector.set(inv.sector, (bySector.get(inv.sector) ?? 0) + inv.amount);
  }
  const allocation = [...bySector.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  const totalAum = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const activeCount = investments.filter((i) => i.status === "ACTIVE").length;
  const medianIrr = 23;

  return (
    <>
      <PageHero
        eyebrow={loc(INVESTORS_PAGE.eyebrow, locale)}
        title={loc(INVESTORS_PAGE.title, locale)}
        lead={loc(INVESTORS_PAGE.lead, locale)}
      />

      {/* Figures band */}
      <section className="relative py-14">
        <MeridianLine className="absolute inset-x-0 top-0 h-8" />
        <Container>
          <RevealGroup className="grid gap-8 sm:grid-cols-3" stagger={0.1}>
            <RevealItem>
              <p className="font-mono text-4xl font-medium text-gradient tabular">
                <Counter to={Math.round(totalAum / 1_000_000)} prefix="$" suffix="M+" locale={locale} />
              </p>
              <p className="mt-2.5 text-sm text-text-2">
                {fa ? "سرمایه تحت مدیریت" : "Capital deployed"}
              </p>
            </RevealItem>
            <RevealItem>
              <p className="font-mono text-4xl font-medium text-gradient tabular">
                <Counter to={activeCount} locale={locale} />
              </p>
              <p className="mt-2.5 text-sm text-text-2">
                {fa ? "موقعیت فعال" : "Active positions"}
              </p>
            </RevealItem>
            <RevealItem>
              <p className="font-mono text-4xl font-medium text-gradient tabular">
                <Counter to={medianIrr} suffix="%" locale={locale} />
              </p>
              <p className="mt-2.5 text-sm text-text-2">
                {fa ? "میانه بازده داخلی سبد" : "Median portfolio IRR"}
              </p>
            </RevealItem>
          </RevealGroup>
        </Container>
      </section>

      {/* Thesis */}
      <Section className="border-t border-border/30">
        <Container>
          <SectionHeading
            eyebrow={fa ? "چرا اکنون" : "Why Now"}
            title={loc(INVESTORS_PAGE.thesisTitle, locale)}
          />
          <RevealGroup className="grid gap-5 lg:grid-cols-3" stagger={0.1}>
            {INVESTORS_PAGE.thesis.map((item, i) => (
              <RevealItem key={i}>
                <div className="glass h-full rounded-3xl p-8">
                  <span className="font-mono text-xs text-brand-cyan tabular">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
                    {loc(item.title, locale)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-2">
                    {loc(item.body, locale)}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Allocation */}
      <Section className="border-t border-border/30">
        <div className="ambient-glow end-0 top-1/4 size-96 bg-primary/30" />
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow={fa ? "سبد" : "Portfolio"}
                title={loc(INVESTORS_PAGE.figuresTitle, locale)}
                className="mb-8"
              />
              <ul className="space-y-3">
                {allocation.map((slice, i) => (
                  <Reveal key={slice.name} delay={i * 0.06}>
                    <li className="flex items-center justify-between border-b border-border/40 pb-3 text-sm">
                      <span className="flex items-center gap-3 text-text-2">
                        <span
                          aria-hidden
                          className="size-2.5 rounded-full"
                          style={{
                            background: ["#2B59FF", "#8B5CF6", "#22D3EE", "#6366F1", "#0EA5E9", "#A78BFA"][i % 6],
                          }}
                        />
                        {slice.name}
                      </span>
                      <span className="font-mono text-foreground tabular">
                        {Math.round((slice.value / totalAum) * 100)}%
                      </span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
            <Reveal blur>
              <PortfolioChart data={allocation} locale={locale} />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Open opportunities (reused from home) */}
      <Opportunities locale={locale} />

      {/* Investor pack CTA */}
      <Section className="border-t border-border/30">
        <Container className="flex flex-col items-center gap-6 text-center">
          <Reveal>
            <h2 className="max-w-xl font-heading text-3xl font-semibold text-foreground sm:text-4xl">
              {loc(INVESTORS_PAGE.contactTitle, locale)}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-lg text-sm leading-relaxed text-text-2">
              {loc(INVESTORS_PAGE.contactBody, locale)}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Link href="/contact">
              <GlowCta>{fa ? "درخواست بسته سرمایه‌گذاران" : "Request the pack"}</GlowCta>
            </Link>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
