import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Counter } from "@/components/motion/counter";
import { MeridianLine } from "@/components/motion/draw-line";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/site/page-hero";
import { GlowCta, Container, Section, SectionHeading } from "@/components/site/primitives";
import { BUSINESS_AREAS, getBusinessArea } from "@/content/business-areas";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { loc } from "@/lib/content";
import { prisma } from "@/lib/prisma";

// Render at request time — `next build` must not need a database.
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    BUSINESS_AREAS.map((area) => ({ locale, slug: area.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const area = getBusinessArea(slug);
  if (!area) return {};
  return {
    title: loc(area.name, locale),
    description: loc(area.description, locale),
  };
}

/** Sector keywords used to find related projects per division. */
const SECTOR_MATCH: Record<string, string[]> = {
  "international-trade": ["Trade", "Logistics"],
  "import-export": ["Trade", "Logistics", "Agriculture"],
  investment: ["Investment", "Finance"],
  technology: ["Technology", "AI"],
  "digital-platforms": ["Technology", "Platform"],
  consulting: ["Consulting"],
  branding: ["Brand"],
  agriculture: ["Agriculture"],
  mining: ["Mining"],
  tourism: ["Tourism"],
  "knowledge-based": ["Technology", "Knowledge"],
};

export default async function BusinessAreaPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const area = getBusinessArea(slug);
  if (!area) notFound();
  const fa = locale === "fa";

  const keywords = SECTOR_MATCH[slug] ?? [];
  const related = await prisma.project.findMany({
    where: { OR: keywords.map((k) => ({ sector: { contains: k } })) },
    orderBy: { startDate: "desc" },
    take: 2,
  });

  const index = BUSINESS_AREAS.findIndex((a) => a.slug === slug);
  const next = BUSINESS_AREAS[(index + 1) % BUSINESS_AREAS.length];

  return (
    <>
      <PageHero
        eyebrow={`${fa ? "حوزه" : "Division"} ${String(index + 1).padStart(2, "0")} — ${loc(area.tagline, locale)}`}
        title={loc(area.name, locale)}
        lead={loc(area.description, locale)}
      />

      {/* Stats band */}
      <section className="relative py-14">
        <MeridianLine className="absolute inset-x-0 top-0 h-8" />
        <Container>
          <RevealGroup className="grid gap-8 sm:grid-cols-3" stagger={0.1}>
            {area.stats.map((stat, i) => (
              <RevealItem key={i} className="text-center sm:text-start">
                <p className="font-mono text-4xl font-medium text-gradient tabular">
                  <Counter
                    to={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={Number.isInteger(stat.value) ? 0 : 1}
                    locale={locale}
                  />
                </p>
                <p className="mt-2.5 text-sm text-text-2">{loc(stat.label, locale)}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Capabilities */}
      <Section className="border-t border-border/30">
        <Container>
          <SectionHeading
            eyebrow={fa ? "توانمندی‌ها" : "Capabilities"}
            title={fa ? "آنچه ارائه می‌کنیم" : "What we deliver"}
          />
          <RevealGroup className="grid gap-5 md:grid-cols-3" stagger={0.1}>
            {area.capabilities.map((cap, i) => (
              <RevealItem key={i}>
                <div className="glass h-full rounded-3xl p-7">
                  <area.icon className="size-5 text-brand-cyan" aria-hidden />
                  <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">
                    {loc(cap.title, locale)}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-text-2">
                    {loc(cap.body, locale)}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Process — numbered because it is a real sequence */}
      <Section className="border-t border-border/30">
        <div className="ambient-glow start-0 top-1/3 size-96 bg-primary/30" />
        <Container>
          <SectionHeading
            eyebrow={fa ? "فرایند" : "The Process"}
            title={fa ? "چگونه کار می‌کنیم" : "How an engagement runs"}
          />
          <div className="grid gap-0 md:grid-cols-3">
            {area.process.map((step, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div className="relative border-s border-border/40 p-7 md:border-s-0 md:border-t md:pt-10">
                  <span
                    aria-hidden
                    className="absolute -start-px top-0 h-14 w-px gradient-brand md:h-px md:w-14 md:-top-px md:start-0"
                  />
                  <span className="font-mono text-xs text-brand-cyan tabular">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">
                    {loc(step.title, locale)}
                  </h3>
                  <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-text-2">
                    {loc(step.body, locale)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Related projects */}
      {related.length > 0 && (
        <Section className="border-t border-border/30">
          <Container>
            <SectionHeading
              eyebrow={fa ? "پروژه‌های مرتبط" : "Related Projects"}
              title={fa ? "این حوزه در عمل" : "This division at work"}
            />
            <RevealGroup className="grid gap-5 md:grid-cols-2" stagger={0.1}>
              {related.map((project) => (
                <RevealItem key={project.id}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group glass block h-full rounded-3xl p-8 transition-colors duration-300 hover:border-brand-violet/40"
                  >
                    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em]">
                      <span className="text-brand-cyan">{project.sector}</span>
                      <span className="text-text-3">{project.country}</span>
                    </div>
                    <h3 className="mt-4 font-heading text-xl font-semibold leading-snug text-foreground">
                      {fa ? project.titleFa : project.titleEn}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-2 line-clamp-2">
                      {fa ? project.summaryFa : project.summaryEn}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-text-3 transition-colors group-hover:text-brand-cyan">
                      {fa ? "مشاهده پروژه" : "View project"}
                      <ArrowUpRight className="size-3.5 rtl:rotate-[270deg]" aria-hidden />
                    </span>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </Section>
      )}

      {/* CTA + next division */}
      <Section className="border-t border-border/30">
        <Container className="flex flex-col items-center gap-10 text-center">
          <Reveal>
            <h2 className="max-w-2xl font-heading text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              {fa
                ? "درباره این حوزه گفت‌وگو کنیم."
                : "Let's talk about this division."}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <GlowCta>{fa ? "شروع گفت‌وگو" : "Start the conversation"}</GlowCta>
              </Link>
              <Link href={`/business/${next.slug}`}>
                <GlowCta variant="ghost">
                  {fa ? `حوزه بعدی: ${loc(next.name, locale)}` : `Next: ${loc(next.name, locale)}`}
                </GlowCta>
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
