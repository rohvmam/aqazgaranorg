import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Counter } from "@/components/motion/counter";
import { MeridianLine } from "@/components/motion/draw-line";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { PageHero } from "@/components/site/page-hero";
import { Container, Section, SectionHeading } from "@/components/site/primitives";
import { STATS } from "@/content/home";
import { ABOUT } from "@/content/pages";
import { loc } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("about") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow={loc(ABOUT.eyebrow, locale)}
        title={loc(ABOUT.title, locale)}
        lead={loc(ABOUT.lead, locale)}
      />

      {/* Story */}
      <Section className="border-t border-border/30 pt-16 md:pt-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Reveal>
                <p className="eyebrow">
                  {locale === "fa" ? "داستان ما" : "The Story"}
                </p>
              </Reveal>
            </div>
            <div className="space-y-8 lg:col-span-7">
              {ABOUT.story.map((paragraph, i) => (
                <TextReveal
                  key={i}
                  by="lines"
                  as="p"
                  className="text-lg leading-relaxed text-text-2 first:font-heading first:text-xl first:font-medium first:text-foreground sm:first:text-2xl"
                >
                  {loc(paragraph, locale)}
                </TextReveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Figures */}
      <section className="relative py-16">
        <MeridianLine className="absolute inset-x-0 top-0 h-8" />
        <Container>
          <RevealGroup className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
            {STATS.items.map((stat, i) => (
              <RevealItem key={i} className="text-center">
                <p className="font-mono text-4xl font-medium text-gradient tabular">
                  <Counter
                    to={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    locale={locale}
                  />
                </p>
                <p className="mt-3 text-sm text-text-2">{loc(stat.label, locale)}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Values */}
      <Section className="border-t border-border/30">
        <Container>
          <SectionHeading
            eyebrow={locale === "fa" ? "ارزش‌ها" : "Values"}
            title={loc(ABOUT.valuesTitle, locale)}
          />
          <RevealGroup className="grid gap-5 sm:grid-cols-2" stagger={0.09}>
            {ABOUT.values.map((value, i) => (
              <RevealItem key={i}>
                <div className="glass h-full rounded-3xl p-8">
                  <span className="font-mono text-xs text-brand-cyan tabular">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
                    {loc(value.title, locale)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-2">
                    {loc(value.body, locale)}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Leadership */}
      <Section className="border-t border-border/30">
        <div className="ambient-glow end-0 top-1/4 size-96 bg-brand-violet/30" />
        <Container>
          <SectionHeading
            eyebrow={locale === "fa" ? "تیم" : "The Team"}
            title={loc(ABOUT.leadershipTitle, locale)}
          />
          <RevealGroup className="grid grid-cols-2 gap-5 md:grid-cols-3" stagger={0.07}>
            {ABOUT.leadership.map((person, i) => (
              <RevealItem key={i}>
                <div className="group glass rounded-3xl p-6 text-center transition-colors duration-300 hover:border-brand-violet/40 sm:p-8">
                  <span
                    aria-hidden
                    className="mx-auto flex size-16 items-center justify-center rounded-full gradient-brand font-heading text-lg font-semibold text-white sm:size-20"
                  >
                    {loc(person.name, "en")
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <h3 className="mt-5 font-heading text-base font-semibold text-foreground">
                    {loc(person.name, locale)}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-text-3">
                    {loc(person.role, locale)}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Offices */}
      <Section className="border-t border-border/30">
        <Container>
          <SectionHeading
            eyebrow={locale === "fa" ? "حضور جهانی" : "Global Presence"}
            title={loc(ABOUT.officesTitle, locale)}
          />
          <RevealGroup className="grid gap-px overflow-hidden rounded-3xl border border-border/40 bg-border/40 sm:grid-cols-3" stagger={0.1}>
            {ABOUT.offices.map((office, i) => (
              <RevealItem key={i} className="bg-card p-8">
                <p className="font-heading text-2xl font-semibold text-foreground">
                  {loc(office.city, locale)}
                </p>
                <p className="mt-2 text-sm text-text-2">{loc(office.role, locale)}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>
    </>
  );
}
