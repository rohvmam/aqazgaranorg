import { Counter } from "@/components/motion/counter";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Container, Section, SectionHeading } from "@/components/site/primitives";
import { WorldMap } from "@/components/visuals/world-map";
import { GLOBAL, REGIONS } from "@/content/home";
import { loc } from "@/lib/content";

export function GlobalNetwork({ locale }: { locale: string }) {
  return (
    <Section className="overflow-hidden border-t border-border/30">
      <Container>
        <SectionHeading
          eyebrow={loc(GLOBAL.eyebrow, locale)}
          title={loc(GLOBAL.title, locale)}
          align="center"
        />
        <Reveal blur>
          <div className="relative mx-auto max-w-5xl [mask-image:radial-gradient(ellipse_80%_80%_at_50%_40%,black,transparent)]">
            <WorldMap dotColor="rgba(148,163,184,0.22)" />
          </div>
        </Reveal>
        <RevealGroup
          className="mx-auto mt-4 grid max-w-5xl gap-px overflow-hidden rounded-3xl border border-border/40 bg-border/40 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.08}
        >
          {REGIONS.map((region, i) => (
            <RevealItem key={i} className="bg-card p-6">
              <p className="font-mono text-3xl font-medium text-foreground tabular">
                <Counter to={region.markets} locale={locale} />
              </p>
              <p className="mt-1.5 text-sm font-medium text-foreground">
                {loc(region.name, locale)}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-text-3">
                {loc(region.note, locale)}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
