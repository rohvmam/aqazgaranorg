"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type GradientMeshProps = {
  className?: string;
  /** Overall intensity of the glow blobs */
  opacity?: number;
};

/**
 * Ambient morphing background: three blurred brand-gradient blobs drifting
 * on slow independent loops. Purely decorative.
 */
export function GradientMesh({ className, opacity = 0.35 }: GradientMeshProps) {
  const reduced = usePrefersReducedMotion();

  const blobs: {
    color: string;
    size: string;
    initial: React.CSSProperties;
    animate: { x: number[]; y: number[] };
    duration: number;
  }[] = [
    {
      color: "rgba(43,89,255,0.5)",
      size: "45vw",
      initial: { top: "-10%", left: "-8%" },
      animate: { x: [0, 60, -30, 0], y: [0, 40, 80, 0] },
      duration: 26,
    },
    {
      color: "rgba(139,92,246,0.42)",
      size: "38vw",
      initial: { top: "20%", right: "-12%" },
      animate: { x: [0, -80, 40, 0], y: [0, 60, -40, 0] },
      duration: 32,
    },
    {
      color: "rgba(34,211,238,0.28)",
      size: "32vw",
      initial: { bottom: "-15%", left: "30%" },
      animate: { x: [0, 50, -60, 0], y: [0, -50, 30, 0] },
      duration: 38,
    },
  ];

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ opacity }}
    >
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            minWidth: 320,
            minHeight: 320,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
            filter: "blur(60px)",
            ...b.initial,
          }}
          animate={reduced ? undefined : b.animate}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
