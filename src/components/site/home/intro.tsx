import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { Container, Section } from "@/components/site/primitives";
import { INTRO } from "@/content/home";
import { loc } from "@/lib/content";

export function Intro({ locale }: { locale: string }) {
  return (
    <Section className="border-t border-border/30">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Reveal>
              <p className="eyebrow">{loc(INTRO.eyebrow, locale)}</p>
            </Reveal>
          </div>
          <div className="lg:col-span-9">
            <TextReveal
              by="words"
              as="p"
              className="max-w-4xl font-heading text-2xl font-medium leading-[1.35] text-foreground sm:text-3xl lg:text-[2.6rem] lg:leading-[1.3]"
            >
              {loc(INTRO.manifesto, locale)}
            </TextReveal>
            <div className="mt-12 grid max-w-4xl gap-8 sm:grid-cols-2">
              <Reveal delay={0.15}>
                <p className="text-sm leading-relaxed text-text-2 sm:text-base">
                  {loc(INTRO.body1, locale)}
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-sm leading-relaxed text-text-2 sm:text-base">
                  {loc(INTRO.body2, locale)}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
