"use client";

import { useLocale } from "next-intl";
import { useRef } from "react";
import { Reveal } from "@/components/motion/reveal";
import { Container, Section, SectionHeading } from "@/components/site/primitives";
import { TIMELINE } from "@/content/home";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { loc } from "@/lib/content";

/**
 * The company timeline: the Meridian line draws downward through the
 * years as the visitor scrolls, lighting each milestone as it passes.
 */
export function Timeline() {
  const locale = useLocale();
  const lineRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !lineRef.current || !wrapRef.current) return;
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 70%",
            end: "bottom 55%",
            scrub: 0.5,
          },
        },
      );
    },
    { dependencies: [reduced], scope: wrapRef },
  );

  return (
    <Section className="border-t border-border/30">
      <Container>
        <SectionHeading
          eyebrow={loc(TIMELINE.eyebrow, locale)}
          title={loc(TIMELINE.title, locale)}
          align="center"
        />
        <div ref={wrapRef} className="relative mx-auto max-w-3xl">
          {/* The drawing meridian */}
          <div
            aria-hidden
            className="absolute inset-y-0 start-[19px] w-px bg-white/8 sm:start-1/2"
          />
          <div
            ref={lineRef}
            aria-hidden
            className="absolute inset-y-0 start-[19px] w-px origin-top bg-gradient-to-b from-brand-blue via-brand-violet to-brand-cyan glow-line sm:start-1/2"
            style={{ transform: reduced ? undefined : "scaleY(0)" }}
          />
          <ol className="space-y-14">
            {TIMELINE.milestones.map((m, i) => (
              <li key={m.year} className="relative">
                <Reveal delay={0.05 * i}>
                  <div
                    className={`flex flex-col gap-3 ps-14 sm:w-1/2 sm:ps-0 ${
                      i % 2 === 0
                        ? "sm:pe-12 sm:text-end"
                        : "sm:ms-auto sm:ps-12"
                    }`}
                  >
                    <span className="font-mono text-sm font-medium text-brand-cyan tabular">
                      {m.year}
                    </span>
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {loc(m.title, locale)}
                    </h3>
                    <p className="text-sm leading-relaxed text-text-2">
                      {loc(m.body, locale)}
                    </p>
                  </div>
                </Reveal>
                <span
                  aria-hidden
                  className="absolute start-[13px] top-1 size-3.5 rounded-full border-2 border-brand-violet bg-background sm:start-1/2 sm:-translate-x-1/2 rtl:sm:translate-x-1/2"
                />
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
