import { ArrowUpRight } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12", className)}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative py-24 md:py-32 lg:py-40", className)}>
      {children}
    </section>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "start" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "start",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "mb-14 max-w-3xl md:mb-20",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
      <h2 className="font-heading text-3xl font-semibold leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {lead && (
        <p className="mt-6 text-base leading-relaxed text-text-2 sm:text-lg">
          {lead}
        </p>
      )}
    </Reveal>
  );
}

type GlowCtaProps = {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

/**
 * The site's CTA treatment: magnetic pill with gradient glow (primary)
 * or hairline glass (ghost). Render inside a Link/button.
 */
export function GlowCta({ children, variant = "primary", className }: GlowCtaProps) {
  return (
    <Magnetic strength={0.25}>
      <span
        className={cn(
          "group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300",
          variant === "primary"
            ? "gradient-brand bg-[length:180%_180%] text-white shadow-[0_0_40px_rgba(43,89,255,0.35)] hover:shadow-[0_0_64px_rgba(139,92,246,0.5)] hover:bg-right"
            : "glass text-foreground hover:border-brand-violet/50 hover:shadow-[0_0_32px_rgba(139,92,246,0.18)]",
          className,
        )}
      >
        {children}
        <ArrowUpRight
          className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:rotate-[270deg] rtl:group-hover:-translate-x-0.5"
          aria-hidden
        />
      </span>
    </Magnetic>
  );
}
