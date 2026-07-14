import { Reveal } from "@/components/motion/reveal";
import { Container, Section, SectionHeading } from "@/components/site/primitives";
import { EcosystemDiagram } from "@/components/visuals/ecosystem-diagram";
import { ECOSYSTEM } from "@/content/home";
import { loc } from "@/lib/content";

export function EcosystemSection({ locale }: { locale: string }) {
  return (
    <Section id="ecosystem">
      <div className="ambient-glow start-1/2 top-1/3 size-[420px] -translate-x-1/2 bg-brand-violet/40" />
      <Container>
        <SectionHeading
          eyebrow={loc(ECOSYSTEM.eyebrow, locale)}
          title={loc(ECOSYSTEM.title, locale)}
          lead={loc(ECOSYSTEM.lead, locale)}
          align="center"
        />
        <Reveal blur>
          <EcosystemDiagram
            centerLabel={loc(ECOSYSTEM.center, locale)}
            nodes={ECOSYSTEM.nodes.map((n) => ({
              id: n.id,
              label: loc(n.label, locale),
            }))}
          />
        </Reveal>
      </Container>
    </Section>
  );
}
