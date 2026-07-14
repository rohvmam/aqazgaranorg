import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: React.ReactNode;
  className?: string;
  /** Seconds per full loop */
  duration?: number;
  reverse?: boolean;
};

/**
 * Infinite marquee. Content is duplicated once; the track translates -50%.
 * Direction is honored in RTL via the parent `dir` (CSS keyframe uses
 * translateX so we flip with `reverse` where needed).
 */
export function Marquee({
  children,
  className,
  duration = 40,
  reverse = false,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className,
      )}
      dir="ltr"
    >
      <div
        className="flex w-max animate-marquee items-center gap-16 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="flex shrink-0 items-center gap-16">{children}</div>
        <div className="flex shrink-0 items-center gap-16" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
