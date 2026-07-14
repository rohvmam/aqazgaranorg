"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { createContext, useContext } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

const MouseCtx = createContext<{
  x: ReturnType<typeof useMotionValue<number>>;
  y: ReturnType<typeof useMotionValue<number>>;
} | null>(null);

/** Tracks pointer position (-0.5…0.5) over its area for parallax layers. */
export function MouseParallax({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <MouseCtx.Provider value={{ x, y }}>
      <div
        className={className}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          x.set((e.clientX - rect.left) / rect.width - 0.5);
          y.set((e.clientY - rect.top) / rect.height - 0.5);
        }}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
      >
        {children}
      </div>
    </MouseCtx.Provider>
  );
}

/** A layer inside MouseParallax that drifts by `depth` px at full deflection. */
export function MouseParallaxLayer({
  children,
  className,
  depth = 20,
}: {
  children: React.ReactNode;
  className?: string;
  depth?: number;
}) {
  const ctx = useContext(MouseCtx);
  const reduced = usePrefersReducedMotion();
  const fallback = useMotionValue(0);
  const rawX = ctx?.x ?? fallback;
  const rawY = ctx?.y ?? fallback;
  const tx = useTransform(rawX, (v) => v * depth * 2);
  const ty = useTransform(rawY, (v) => v * depth * 2);
  const sx = useSpring(tx, { stiffness: 60, damping: 18 });
  const sy = useSpring(ty, { stiffness: 60, damping: 18 });

  return (
    <motion.div
      className={className}
      style={reduced ? undefined : { x: sx, y: sy }}
    >
      {children}
    </motion.div>
  );
}
