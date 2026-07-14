import { useId } from "react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { GlowCta, Container, Section, SectionHeading } from "@/components/site/primitives";
import { OPPORTUNITIES } from "@/content/home";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/content";

function Sparkline({ points }: { points: number[] }) {
  const gradId = useId();
  const max = Math.max(...points);
  const w = 120;
  const h = 36;
  const step = w / (points.length - 1);
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-30" aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2B59FF" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke={`url(#${gradId})`} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Opportunities({ locale }: { locale: string }) {
  return (
    <Section className="border-t border-border/30">
      <div className="ambient-glow -start-32 top-1/4 size-96 bg-brand-cyan/30" />
      <Container>
        <SectionHeading
          eyebrow={loc(OPPORTUNITIES.eyebrow, locale)}
          title={loc(OPPORTUNITIES.title, locale)}
          lead={loc(OPPORTUNITIES.lead, locale)}
        />
        <RevealGroup className="grid gap-5 lg:grid-cols-3" stagger={0.1}>
          {OPPORTUNITIES.items.map((item, i) => (
            <RevealItem key={i}>
              <article className="glass flex h-full flex-col rounded-3xl p-7">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-cyan">
                    {loc(item.sector, locale)}
                  </p>
                  <Sparkline points={item.trend} />
                </div>
                <h3 className="mt-4 font-heading text-xl font-semibold leading-snug text-foreground">
                  {loc(item.title, locale)}
                </h3>
                <dl className="mt-6 space-y-2.5 border-t border-border/40 pt-5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-text-3">
                      {locale === "fa" ? "حداقل ورود" : "Minimum ticket"}
                    </dt>
                    <dd className="font-medium text-foreground">
                      {loc(item.ticket, locale)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-text-3">
                      {locale === "fa" ? "افق" : "Horizon"}
                    </dt>
                    <dd className="font-medium text-foreground">
                      {loc(item.horizon, locale)}
                    </dd>
                  </div>
                </dl>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="mt-12 flex justify-center">
          <Link href="/investors">
            <GlowCta variant="ghost">
              {locale === "fa" ? "همه فرصت‌ها برای سرمایه‌گذاران" : "All opportunities for investors"}
            </GlowCta>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
