"use client";

import { useLocale } from "next-intl";
import { useRef } from "react";
import { EASE, gsap, SplitText, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { localeDir } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  children: React.ReactNode;
  /** Split granularity — chars for display lines, words for paragraphs */
  by?: "chars" | "words" | "lines";
  as?: React.ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Play immediately on mount instead of on scroll into view */
  immediate?: boolean;
};

export function TextReveal({
  children,
  by = "words",
  as: Tag = "div",
  className,
  delay = 0,
  stagger,
  immediate = false,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const locale = useLocale();

  // Arabic-script text is cursive: putting every character in its own element
  // stops the shaper from joining letters and scrambles their bidi order, so
  // RTL locales reveal the block as a whole instead of per character.
  const noSplit = by === "chars" && localeDir(locale) === "rtl";

  useGSAP(
    () => {
      if (reduced || !ref.current) return;

      if (noSplit) {
        gsap.set(ref.current, { visibility: "visible" });
        gsap.from(ref.current, {
          yPercent: 8,
          opacity: 0,
          duration: 0.9,
          ease: EASE,
          delay,
          scrollTrigger: immediate
            ? undefined
            : { trigger: ref.current, start: "top 85%", once: true },
        });
        return;
      }

      const split = SplitText.create(ref.current, {
        type: by === "chars" ? "chars,words" : by,
        mask: by === "lines" ? "lines" : undefined,
      });
      const targets =
        by === "chars" ? split.chars : by === "words" ? split.words : split.lines;

      gsap.set(ref.current, { visibility: "visible" });
      gsap.from(targets, {
        yPercent: 110,
        opacity: by === "lines" ? 1 : 0,
        duration: 0.9,
        ease: EASE,
        delay,
        stagger: stagger ?? (by === "chars" ? 0.018 : by === "words" ? 0.045 : 0.12),
        scrollTrigger: immediate
          ? undefined
          : { trigger: ref.current, start: "top 85%", once: true },
      });

      return () => split.revert();
    },
    { dependencies: [reduced, by, noSplit], scope: ref },
  );

  return (
    <Tag
      ref={ref}
      className={cn(reduced ? "" : "invisible", className)}
      style={reduced ? undefined : { visibility: "hidden" }}
    >
      {children}
    </Tag>
  );
}
