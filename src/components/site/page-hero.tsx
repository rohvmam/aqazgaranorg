import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { GradientMesh } from "@/components/visuals/gradient-mesh";
import { Container } from "@/components/site/primitives";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
};

/** Standard inner-page opening: eyebrow, display title, optional lead. */
export function PageHero({ eyebrow, title, lead, children }: PageHeroProps) {
  return (
    <div className="relative overflow-hidden pb-16 pt-40 md:pb-24 md:pt-48">
      <GradientMesh opacity={0.22} />
      <Container className="relative z-10">
        <Reveal y={12}>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
        <TextReveal
          by="words"
          immediate
          delay={0.2}
          as="h1"
          className="mt-6 max-w-4xl font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          {title}
        </TextReveal>
        {lead && (
          <Reveal delay={0.5} blur>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-text-2 sm:text-lg">
              {lead}
            </p>
          </Reveal>
        )}
        {children}
      </Container>
    </div>
  );
}
