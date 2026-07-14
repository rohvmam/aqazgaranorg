import { Marquee } from "@/components/motion/marquee";
import { LogoMark } from "@/components/site/logo";

/**
 * Infinite partner strip. Wordmarks are typographic (no fake logos),
 * separated by the holding's mark as a beat.
 */
export function PartnerMarquee({
  locale,
  names,
}: {
  locale: string;
  names: string[];
}) {
  return (
    <section
      className="border-t border-border/30 py-10"
      aria-label={locale === "fa" ? "شرکای ما" : "Our partners"}
    >
      <Marquee duration={46}>
        {names.map((name) => (
          <span key={name} className="flex items-center gap-16">
            <span className="whitespace-nowrap font-heading text-lg font-medium text-text-3 transition-colors hover:text-text-2">
              {name}
            </span>
            <LogoMark className="size-4 opacity-30" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
