import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

/**
 * The ATA mark: a gateway arch traced by the Meridian gradient — the
 * holding as the arch trade passes through.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("size-8", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="32" x2="32" y2="0">
          <stop offset="0" stopColor="#2B59FF" />
          <stop offset="0.55" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <path
        d="M3 27 Q16 1 29 27"
        stroke="url(#logo-grad)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M9 27 Q16 13 23 27"
        stroke="url(#logo-grad)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.65"
      />
      <circle cx="16" cy="7.5" r="2" fill="#22D3EE" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  const locale = useLocale();
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-[15px] font-semibold tracking-tight text-foreground">
          {locale === "fa" ? "آغازگران تجارت آینده" : "AGHAZGARAN"}
        </span>
        <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.32em] text-text-3">
          {locale === "fa" ? "هلدینگ آتا" : "Tejarat Ayandeh"}
        </span>
      </span>
    </span>
  );
}
