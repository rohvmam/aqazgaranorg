"use client";

import { AnimatePresence, animate, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { LogoMark } from "./logo";

/**
 * Premium first-visit loader: the Meridian arc draws while a counter
 * runs 0→100, then the veil lifts. Shown once per browser session.
 */
export function LoadingScreen() {
  const reduced = usePrefersReducedMotion();
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced) return;
    if (sessionStorage.getItem("ata-visited")) return;
    sessionStorage.setItem("ata-visited", "1");
    setShow(true);
    document.documentElement.style.overflow = "hidden";

    const controls = animate(0, 100, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.round(v)).padStart(3, "0");
        }
      },
      onComplete: () => {
        setDone(true);
        document.documentElement.style.overflow = "";
      },
    });
    return () => {
      controls.stop();
      document.documentElement.style.overflow = "";
    };
  }, [reduced]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-1000 flex flex-col items-center justify-center bg-[#05070A]"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          aria-hidden
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <LogoMark className="size-14" />
          </motion.div>
          <div className="relative mt-8 h-px w-48 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="absolute inset-y-0 start-0 gradient-brand"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span
            ref={counterRef}
            className="mt-6 font-mono text-xs tracking-[0.4em] text-text-3 tabular"
          >
            000
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
