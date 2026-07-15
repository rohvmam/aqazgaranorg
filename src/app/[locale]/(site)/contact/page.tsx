import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/site/contact-form";
import { PageHero } from "@/components/site/page-hero";
import { Container, Section } from "@/components/site/primitives";
import { WorldMap } from "@/components/visuals/world-map";
import { ABOUT, CONTACT_PAGE } from "@/content/pages";
import { loc } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("contact") };
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ topic?: string }>;
}) {
  const { locale } = await params;
  const { topic } = await searchParams;
  setRequestLocale(locale);
  const fa = locale === "fa";

  const validTopic = CONTACT_PAGE.topics.some((t) => t.value === topic)
    ? topic
    : undefined;

  return (
    <>
      <PageHero
        eyebrow={loc(CONTACT_PAGE.eyebrow, locale)}
        title={loc(CONTACT_PAGE.title, locale)}
        lead={loc(CONTACT_PAGE.lead, locale)}
      />

      <Section className="border-t border-border/30 pt-14">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            <Reveal>
              <ContactForm defaultTopic={validTopic} />
            </Reveal>

            <div className="space-y-10">
              <Reveal delay={0.15}>
                <div>
                  <p className="eyebrow mb-6">{fa ? "دفاتر" : "Offices"}</p>
                  <ul className="space-y-5">
                    {ABOUT.offices.map((office, i) => (
                      <li key={i} className="flex items-start gap-3.5">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-brand-cyan" aria-hidden />
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {loc(office.city, locale)}
                          </p>
                          <p className="mt-0.5 text-xs text-text-3">
                            {loc(office.role, locale)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.25}>
                <div>
                  <p className="eyebrow mb-6">{fa ? "تماس مستقیم" : "Direct"}</p>
                  <ul className="space-y-4 text-sm">
                    <li className="flex items-center gap-3.5">
                      <Mail className="size-4 text-brand-cyan" aria-hidden />
                      <a
                        href="mailto:hello@ata-holding.com"
                        className="text-text-2 transition-colors hover:text-foreground"
                        dir="ltr"
                      >
                        hello@ata-holding.com
                      </a>
                    </li>
                    <li className="flex items-center gap-3.5">
                      <Phone className="size-4 text-brand-cyan" aria-hidden />
                      <a
                        href="tel:+982100000000"
                        className="text-text-2 transition-colors hover:text-foreground"
                        dir="ltr"
                      >
                        +98 21 0000 0000
                      </a>
                    </li>
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.35} blur>
                <div className="overflow-hidden rounded-3xl border border-border/40 p-4 [mask-image:linear-gradient(to_bottom,black_75%,transparent)]">
                  <WorldMap dotColor="rgba(148,163,184,0.2)" />
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
