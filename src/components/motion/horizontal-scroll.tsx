"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type HorizontalScrollProps = {
  children: React.ReactNode;
  className?: string;
  trackClassName?: string;
};

/**
 * Pins the section and converts vertical scroll into a horizontal rail.
 * Falls back to native horizontal overflow under reduced motion and on
 * touch-primary devices, and reverses direction for RTL locales.
 */
export function HorizontalScroll({
  children,
  className,
  trackClassName,
}: HorizontalScrollProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (reduced || !section || !track) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const isRtl = document.documentElement.dir === "rtl";
      const distance = () => track.scrollWidth - section.clientWidth;

      gsap.to(track, {
        x: () => (isRtl ? distance() : -distance()),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    },
    { dependencies: [reduced], scope: sectionRef },
  );

  const fallbackScroll =
    "max-lg:overflow-x-auto max-lg:[scrollbar-width:thin] motion-reduce:overflow-x-auto";

  return (
    <div ref={sectionRef} className={cn("overflow-hidden", fallbackScroll, className)}>
      <div ref={trackRef} className={cn("flex w-max", trackClassName)}>
        {children}
      </div>
    </div>
  );
}
