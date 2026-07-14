"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const variants: Variants = {
  hidden: (custom: { y: number; blur: boolean }) => ({
    opacity: 0,
    y: custom.y,
    filter: custom.blur ? "blur(12px)" : "blur(0px)",
  }),
  visible: (custom: { delay: number }) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      delay: custom.delay,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Blur-to-focus entrance */
  blur?: boolean;
  once?: boolean;
};

/** Fade/slide (optionally blur-to-focus) entrance when scrolled into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  blur = false,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      className={cn(className)}
      custom={{ y, blur, delay }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-12% 0px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

/** Staggers direct children Reveal-style without wrapping each one. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
