import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MeridianLine } from "@/components/motion/draw-line";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { PageHero } from "@/components/site/page-hero";
import { Container, Section, SectionHeading } from "@/components/site/primitives";
import { GradientMesh } from "@/components/visuals/gradient-mesh";
import { VISION } from "@/content/pages";
import { loc } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("vision") };
}

export default async function VisionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow={loc(VISION.eyebrow, locale)}
        title={loc(VISION.title, locale)}
      />

      {/* Vision statement — full cinematic typographic treatment */}
      <section className="relative overflow-hidden border-t border-border/30 py-28 md:py-40">
        <GradientMesh opacity={0.25} />
        <Container className="relative z-10">
          <Reveal>
            <p className="eyebrow text-center">{loc(VISION.visionLabel, locale)}</p>
          </Reveal>
          <TextReveal
            by="words"
            as="p"
            className="mx-auto mt-10 max-w-4xl text-center font-heading text-2xl font-medium leading-[1.4] text-foreground sm:text-3xl lg:text-4xl"
          >
            {loc(VISION.vision, locale)}
          </TextReveal>
        </Container>
      </section>

      {/* Mission */}
      <section className="relative py-28 md:py-36">
        <MeridianLine className="absolute inset-x-0 top-0 h-8" />
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Reveal>
                <p className="eyebrow">{loc(VISION.missionLabel, locale)}</p>
              </Reveal>
            </div>
            <div className="lg:col-span-9">
              <TextReveal
                by="lines"
                as="p"
                className="max-w-3xl font-heading text-xl font-medium leading-[1.5] text-text-2 sm:text-2xl [&_.line]:text-foreground"
              >
                {loc(VISION.mission, locale)}
              </TextReveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Three horizons */}
      <Section className="border-t border-border/30">
        <Container>
          <SectionHeading
            eyebrow={locale === "fa" ? "نقشه راه" : "The Road"}
            title={loc(VISION.pillarsTitle, locale)}
          />
          <RevealGroup className="grid gap-5 lg:grid-cols-3" stagger={0.12}>
            {VISION.pillars.map((pillar, i) => (
              <RevealItem key={i}>
                <div className="glass relative h-full overflow-hidden rounded-3xl p-8">
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px gradient-brand opacity-70"
                    style={{ opacity: 0.3 + i * 0.35 }}
                  />
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-cyan">
                    {loc(pillar.period, locale)}
                  </p>
                  <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
                    {loc(pillar.title, locale)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-2">
                    {loc(pillar.body, locale)}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>
    </>
  );
}
