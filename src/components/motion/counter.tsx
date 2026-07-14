"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type CounterProps = {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
  locale?: string;
};

/** Animated count-up that respects locale digit formatting (incl. Persian). */
export function Counter({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 2,
  className,
  locale = "en",
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    const fmt = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    if (reduced) {
      el.textContent = `${prefix}${fmt.format(to)}${suffix}`;
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${prefix}${fmt.format(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, to, prefix, suffix, decimals, duration, locale, reduced]);

  return (
    <span ref={ref} className={cn("tabular", className)}>
      {prefix}0{suffix}
    </span>
  );
}
