import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Container, Section, SectionHeading } from "@/components/site/primitives";
import { PLATFORMS_SECTION } from "@/content/home";
import { loc } from "@/lib/content";
import { cn } from "@/lib/utils";

export type PlatformRow = {
  id: string;
  nameEn: string;
  nameFa: string;
  descriptionEn: string;
  descriptionFa: string;
  status: string;
  users: number;
  growth: number;
};

const STATUS_STYLE: Record<string, string> = {
  LIVE: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  BETA: "text-brand-cyan border-brand-cyan/30 bg-brand-cyan/10",
  DEVELOPMENT: "text-text-2 border-border bg-white/5",
};

const STATUS_LABEL: Record<string, { en: string; fa: string }> = {
  LIVE: { en: "Live", fa: "فعال" },
  BETA: { en: "Beta", fa: "بتا" },
  DEVELOPMENT: { en: "In development", fa: "در حال توسعه" },
};

/** CSS-drawn product windows — no screenshots, pure interface suggestion. */
function MiniWindow({ seed }: { seed: number }) {
  const bars = [72, 48, 88, 56, 64];
  return (
    <div
      aria-hidden
      className="pointer-events-none select-none rounded-xl border border-border/50 bg-[#070B12] p-3 shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center gap-1.5 pb-2.5">
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="ms-2 h-2 w-24 rounded-full bg-white/8" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 rounded-lg bg-white/[0.04] p-2.5">
          <div className="h-1.5 w-16 rounded-full bg-white/15" />
          <div className="mt-2.5 flex items-end gap-1">
            {bars.map((b, i) => (
              <div
                key={i}
                className={cn(
                  "w-full rounded-sm",
                  (i + seed) % 3 === 0 ? "gradient-brand opacity-80" : "bg-white/10",
                )}
                style={{ height: `${(b + seed * 7) % 48 + 14}px` }}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex-1 rounded-lg bg-white/[0.04] p-2">
            <div className="h-1.5 w-8 rounded-full bg-white/15" />
            <div className="mt-2 h-3 w-12 rounded-md bg-brand-cyan/30" />
          </div>
          <div className="flex-1 rounded-lg bg-white/[0.04] p-2">
            <div className="h-1.5 w-8 rounded-full bg-white/15" />
            <div className="mt-2 h-3 w-10 rounded-md bg-brand-violet/30" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Platforms({
  locale,
  platforms,
}: {
  locale: string;
  platforms: PlatformRow[];
}) {
  const fa = locale === "fa";

  return (
    <Section className="border-t border-border/30">
      <Container>
        <SectionHeading
          eyebrow={loc(PLATFORMS_SECTION.eyebrow, locale)}
          title={loc(PLATFORMS_SECTION.title, locale)}
          lead={loc(PLATFORMS_SECTION.lead, locale)}
        />
        <RevealGroup className="grid gap-5 md:grid-cols-2" stagger={0.1}>
          {platforms.map((platform, i) => (
            <RevealItem key={platform.id}>
              <article className="group glass h-full overflow-hidden rounded-3xl p-7 transition-colors duration-300 hover:border-brand-violet/40">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-heading text-xl font-semibold text-foreground">
                    {fa ? platform.nameFa : platform.nameEn}
                  </h3>
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]",
                      STATUS_STYLE[platform.status] ?? STATUS_STYLE.DEVELOPMENT,
                    )}
                  >
                    {loc(STATUS_LABEL[platform.status] ?? STATUS_LABEL.DEVELOPMENT, locale)}
                  </span>
                </div>
                <p className="mt-3 min-h-10 text-sm leading-relaxed text-text-2">
                  {fa ? platform.descriptionFa : platform.descriptionEn}
                </p>
                <div className="mt-6 flex gap-8 border-t border-border/40 pt-5 text-sm">
                  <div>
                    <p className="font-mono text-lg font-medium text-foreground tabular">
                      {platform.users.toLocaleString(fa ? "fa-IR" : "en-US")}
                    </p>
                    <p className="text-xs text-text-3">{fa ? "کاربر" : "users"}</p>
                  </div>
                  {platform.growth > 0 && (
                    <div>
                      <p className="font-mono text-lg font-medium text-emerald-400 tabular">
                        +{platform.growth.toLocaleString(fa ? "fa-IR" : "en-US")}%
                      </p>
                      <p className="text-xs text-text-3">
                        {fa ? "رشد ماهانه" : "monthly growth"}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-6 translate-y-2 opacity-90 transition-transform duration-500 group-hover:translate-y-0">
                  <MiniWindow seed={i} />
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
