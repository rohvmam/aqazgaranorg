"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";
import {
  MouseParallax,
  MouseParallaxLayer,
} from "@/components/motion/mouse-parallax";
import { GlowCta } from "@/components/site/primitives";
import { GradientMesh } from "@/components/visuals/gradient-mesh";
import { Particles } from "@/components/visuals/particles";
import { WorldMap } from "@/components/visuals/world-map";
import { HERO } from "@/content/home";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/content";

export function Hero() {
  const locale = useLocale();
  const t = useTranslations("common");

  return (
    <MouseParallax className="relative flex min-h-dvh flex-col overflow-hidden">
      <GradientMesh opacity={0.3} />
      <Particles count={50} />

      {/* World map — lower band, faded at edges */}
      <MouseParallaxLayer
        depth={10}
        className="pointer-events-none absolute inset-x-0 bottom-[-6%] mx-auto w-[min(1400px,120vw)] opacity-80 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,black,transparent)]"
      >
        <WorldMap />
      </MouseParallaxLayer>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-5 pb-36 pt-40 text-center sm:px-8 lg:px-12">
        <Reveal delay={0.1} y={16}>
          <p className="eyebrow">{loc(HERO.eyebrow, locale)}</p>
        </Reveal>

        <TextReveal
          by="chars"
          immediate
          delay={0.35}
          as="h1"
          className="mt-7 max-w-5xl font-heading text-[clamp(2.5rem,7.5vw,6rem)] font-semibold leading-[1.04] tracking-tight text-foreground"
        >
          {loc(HERO.headline, locale)}
        </TextReveal>

        <Reveal delay={0.9} blur>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-text-2 sm:text-lg">
            {loc(HERO.sub, locale)}
          </p>
        </Reveal>

        <Reveal delay={1.15}>
          <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
            <Link href="/business">
              <GlowCta>{t("exploreEcosystem")}</GlowCta>
            </Link>
            <Link href="/investors">
              <GlowCta variant="ghost">{t("investorRelations")}</GlowCta>
            </Link>
          </div>
        </Reveal>

        {/* Floating glass chips */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
          {HERO.chips.map((chip, i) => (
            <MouseParallaxLayer
              key={i}
              depth={22 + i * 10}
              className={
                [
                  "absolute start-[8%] top-[30%]",
                  "absolute end-[9%] top-[26%]",
                  "absolute end-[16%] bottom-[30%]",
                ][i]
              }
            >
              <motion.span
                className="glass inline-block rounded-full px-5 py-2.5 font-mono text-[11px] tracking-[0.18em] text-text-2 uppercase"
                animate={{ y: [0, i % 2 ? 10 : -10, 0] }}
                transition={{ duration: 7 + i * 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {loc(chip, locale)}
              </motion.span>
            </MouseParallaxLayer>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3" aria-hidden>
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-3">
          {t("scrollToExplore")}
        </span>
        <div className="h-10 w-px overflow-hidden bg-white/10">
          <motion.div
            className="h-1/2 w-full gradient-brand"
            animate={{ y: ["-100%", "220%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </MouseParallax>
  );
}
