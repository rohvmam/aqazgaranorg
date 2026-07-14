"use client";

import { useId, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type MeridianLineProps = {
  className?: string;
  /** SVG path `d` in a 0 0 1200 120 viewBox; defaults to a sweeping arc */
  d?: string;
  /** Scrub the drawing to scroll instead of playing once */
  scrub?: boolean;
};

/**
 * The signature "Meridian" — a luminous gradient trade-route line that
 * draws itself as it enters the viewport.
 */
export function MeridianLine({
  className,
  d = "M0,90 C260,90 340,18 600,18 C860,18 940,90 1200,90",
  scrub = false,
}: MeridianLineProps) {
  const ref = useRef<SVGSVGElement>(null);
  const reduced = usePrefersReducedMotion();
  const gradId = useId();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      const path = ref.current.querySelector("path");
      if (!path) return;
      gsap.fromTo(
        path,
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          ease: scrub ? "none" : "power2.inOut",
          duration: scrub ? 1 : 1.8,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            ...(scrub ? { end: "bottom 40%", scrub: 0.6 } : { once: true }),
          },
        },
      );
    },
    { dependencies: [reduced, scrub], scope: ref },
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 1200 120"
      fill="none"
      preserveAspectRatio="none"
      className={cn("h-16 w-full", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2B59FF" stopOpacity="0" />
          <stop offset="0.25" stopColor="#2B59FF" />
          <stop offset="0.55" stopColor="#8B5CF6" />
          <stop offset="0.85" stopColor="#22D3EE" />
          <stop offset="1" stopColor="#22D3EE" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={d} stroke={`url(#${gradId})`} strokeWidth="1.5" />
    </svg>
  );
}
