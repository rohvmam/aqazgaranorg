import { Reveal } from "@/components/motion/reveal";
import { GlowCta, Container } from "@/components/site/primitives";
import { GradientMesh } from "@/components/visuals/gradient-mesh";
import { CTA } from "@/content/home";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/content";

export function CtaSection({ locale }: { locale: string }) {
  return (
    <section className="relative overflow-hidden border-t border-border/30 py-28 md:py-40">
      <GradientMesh opacity={0.5} />
      <Container className="relative z-10 text-center">
        <Reveal>
          <p className="eyebrow">{loc(CTA.eyebrow, locale)}</p>
        </Reveal>
        <Reveal delay={0.1} blur>
          <h2 className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {loc(CTA.title, locale)}
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-text-2">
            {loc(CTA.body, locale)}
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-11 flex justify-center">
            <Link href="/contact">
              <GlowCta>{locale === "fa" ? "تماس با ما" : "Get in touch"}</GlowCta>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
