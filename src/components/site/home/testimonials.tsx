"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Container, Section, SectionHeading } from "@/components/site/primitives";
import { TESTIMONIALS } from "@/content/home";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { loc } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const locale = useLocale();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const items = TESTIMONIALS.items;

  useEffect(() => {
    if (reduced || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 7000);
    return () => clearInterval(id);
  }, [reduced, paused, items.length]);

  const active = items[index];

  return (
    <Section className="border-t border-border/30">
      <div className="ambient-glow end-0 top-1/3 size-96 bg-brand-violet/30" />
      <Container>
        <SectionHeading
          eyebrow={loc(TESTIMONIALS.eyebrow, locale)}
          title=""
          className="mb-8"
        />
        <div
          className="mx-auto max-w-4xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative min-h-56 sm:min-h-44" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.figure
                key={index}
                initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <blockquote className="font-heading text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
                  <span aria-hidden className="text-gradient">“</span>
                  {loc(active.quote, locale)}
                  <span aria-hidden className="text-gradient">”</span>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex size-10 items-center justify-center rounded-full gradient-brand font-heading text-sm font-semibold text-white"
                  >
                    {active.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">
                      {active.name}
                    </span>
                    <span className="block text-xs text-text-3">
                      {loc(active.role, locale)}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex gap-2.5" role="tablist" aria-label="Testimonials">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${i + 1} / ${items.length}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index
                    ? "w-10 gradient-brand"
                    : "w-5 bg-white/10 hover:bg-white/20",
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
