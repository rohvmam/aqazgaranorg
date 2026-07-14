import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Container, Section, SectionHeading } from "@/components/site/primitives";
import { WHY_US } from "@/content/home";
import { loc } from "@/lib/content";

/**
 * Editorial commitments list. The numbering is deliberate: these are
 * ranked, non-negotiable operating principles.
 */
export function WhyUs({ locale }: { locale: string }) {
  return (
    <Section className="border-t border-border/30">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow={loc(WHY_US.eyebrow, locale)}
              title={loc(WHY_US.title, locale)}
              className="mb-0 lg:sticky lg:top-32"
            />
          </div>
          <RevealGroup className="lg:col-span-8" stagger={0.09}>
            {WHY_US.items.map((item, i) => (
              <RevealItem key={i}>
                <div className="group flex gap-6 border-b border-border/40 py-8 first:pt-0 sm:gap-10">
                  <span className="font-mono text-sm text-text-3 tabular transition-colors group-hover:text-brand-cyan">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground sm:text-xl">
                      {loc(item.title, locale)}
                    </h3>
                    <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-text-2">
                      {loc(item.body, locale)}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}
