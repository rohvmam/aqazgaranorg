"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale } from "next-intl";
import { HorizontalScroll } from "@/components/motion/horizontal-scroll";
import { Container, SectionHeading } from "@/components/site/primitives";
import { BUSINESS_AREAS } from "@/content/business-areas";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/content";

/**
 * Pinned horizontal rail through all eleven business areas — the visitor
 * literally travels the breadth of the holding.
 */
export function Industries() {
  const locale = useLocale();

  return (
    <section className="border-t border-border/30 py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow={locale === "fa" ? "حوزه‌های کسب‌وکار" : "Business Areas"}
          title={
            locale === "fa"
              ? "یازده حوزه، یک افق"
              : "Eleven divisions, one horizon"
          }
          lead={
            locale === "fa"
              ? "از کریدورهای تجاری تا گردشگری فرهنگی — هر حوزه بخشی از یک سیستم واحد است."
              : "From trade corridors to cultural tourism — each division is a working part of one system."
          }
        />
      </Container>
      <HorizontalScroll trackClassName="gap-5 ps-5 pe-5 sm:ps-8 lg:ps-[max(3rem,calc((100vw-80rem)/2+3rem))]">
        {BUSINESS_AREAS.map((area, i) => (
          <Link
            key={area.slug}
            href={`/business/${area.slug}`}
            className="group relative flex h-[340px] w-[280px] shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-border/50 bg-card p-6 transition-colors duration-300 hover:border-brand-violet/50 sm:h-[380px] sm:w-[320px]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -end-16 -top-16 size-48 rounded-full bg-primary/10 blur-3xl transition-opacity duration-500 group-hover:bg-brand-violet/20"
            />
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs text-text-3 tabular">
                {String(i + 1).padStart(2, "0")} / {BUSINESS_AREAS.length}
              </span>
              <area.icon className="size-6 text-brand-violet transition-colors duration-300 group-hover:text-brand-cyan" aria-hidden />
            </div>
            <div>
              <h3 className="font-heading text-xl font-semibold text-foreground">
                {loc(area.name, locale)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-2 line-clamp-3">
                {loc(area.tagline, locale)}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-brand-cyan opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {locale === "fa" ? "مشاهده حوزه" : "Explore division"}
                <ArrowUpRight className="size-3.5 rtl:rotate-[270deg]" aria-hidden />
              </span>
            </div>
          </Link>
        ))}
      </HorizontalScroll>
    </section>
  );
}
