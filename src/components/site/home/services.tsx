import { ArrowUpRight } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { Container, Section, SectionHeading } from "@/components/site/primitives";
import { BUSINESS_AREAS } from "@/content/business-areas";
import { SERVICES } from "@/content/home";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/content";
import { cn } from "@/lib/utils";

const FEATURED_SLUGS = [
  "international-trade",
  "investment",
  "technology",
  "consulting",
  "branding",
  "digital-platforms",
];

/** Bento spans: first two cells dominate, the rest tile. */
const SPANS = [
  "md:col-span-3 md:row-span-2",
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
];

export function Services({ locale }: { locale: string }) {
  const areas = FEATURED_SLUGS.map(
    (slug) => BUSINESS_AREAS.find((a) => a.slug === slug)!,
  );

  return (
    <Section className="border-t border-border/30">
      <Container>
        <SectionHeading
          eyebrow={loc(SERVICES.eyebrow, locale)}
          title={loc(SERVICES.title, locale)}
          lead={loc(SERVICES.lead, locale)}
        />
        <RevealGroup className="grid gap-4 md:grid-cols-6" stagger={0.07}>
          {areas.map((area, i) => (
            <RevealItem key={area.slug} className={cn(SPANS[i])}>
              <Link href={`/business/${area.slug}`} className="group block h-full">
                <TiltCard className="glass h-full rounded-3xl p-7 transition-colors duration-300 group-hover:border-brand-violet/40">
                  <div className="flex h-full flex-col">
                    <div className="flex items-start justify-between">
                      <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-brand-cyan">
                        <area.icon className="size-5" aria-hidden />
                      </span>
                      <ArrowUpRight
                        className="size-4 text-text-3 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-cyan rtl:rotate-[270deg] rtl:group-hover:-translate-x-0.5"
                        aria-hidden
                      />
                    </div>
                    <h3 className="mt-6 font-heading text-lg font-semibold text-foreground">
                      {loc(area.name, locale)}
                    </h3>
                    <p
                      className={cn(
                        "mt-2.5 text-sm leading-relaxed text-text-2",
                        i === 0 ? "" : "line-clamp-3",
                      )}
                    >
                      {i === 0
                        ? loc(area.description, locale)
                        : loc(area.tagline, locale)}
                    </p>
                    {i === 0 && (
                      <div className="mt-auto grid grid-cols-3 gap-3 pt-8">
                        {area.stats.map((s, j) => (
                          <div key={j}>
                            <p className="font-mono text-lg font-medium text-foreground tabular">
                              {s.prefix}
                              {s.value.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}
                              {s.suffix}
                            </p>
                            <p className="mt-1 text-[11px] leading-snug text-text-3">
                              {loc(s.label, locale)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TiltCard>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
