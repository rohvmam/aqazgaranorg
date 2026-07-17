import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/site/page-hero";
import { GlowCta, Container, Section, SectionHeading } from "@/components/site/primitives";
import { Reveal } from "@/components/motion/reveal";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { loc, type L } from "@/lib/content";

// Render at request time — `next build` must not need a database.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("partners") };
}

const TIER_LABEL: Record<string, L> = {
  STRATEGIC: { en: "Strategic Partners", fa: "شرکای راهبردی" },
  FINANCIAL: { en: "Financial Partners", fa: "شرکای مالی" },
  TECHNOLOGY: { en: "Technology Partners", fa: "شرکای فناوری" },
  LOGISTICS: { en: "Logistics Partners", fa: "شرکای لجستیک" },
};

const TIER_ORDER = ["STRATEGIC", "FINANCIAL", "TECHNOLOGY", "LOGISTICS"];

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fa = locale === "fa";

  const partners = await prisma.partner.findMany({ orderBy: { since: "asc" } });
  const byTier = TIER_ORDER.map((tier) => ({
    tier,
    items: partners.filter((p) => p.type === tier),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <PageHero
        eyebrow={fa ? "شرکای تجاری" : "Partners"}
        title={fa ? "شبکه‌ای که با آن حرکت می‌کنیم" : "The network we move with"}
        lead={
          fa
            ? "بانک‌ها، خطوط لجستیک، شرکت‌های فناوری و نهادهای راهبردی — روابطی که سال‌ها با اجرای درست ساخته شده‌اند."
            : "Banks, logistics lines, technology firms, and strategic institutions — relationships built over years of delivering exactly what was promised."
        }
      />

      {byTier.map(({ tier, items }, gi) => (
        <Section key={tier} className="border-t border-border/30 py-16 md:py-20">
          <Container>
            <SectionHeading
              eyebrow={String(gi + 1).padStart(2, "0")}
              title={loc(TIER_LABEL[tier], locale)}
              className="mb-10"
            />
            <RevealGroup className="grid gap-px overflow-hidden rounded-3xl border border-border/40 bg-border/40 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
              {items.map((partner) => (
                <RevealItem key={partner.id} className="bg-card">
                  <div className="group flex h-full flex-col p-7 transition-colors duration-300 hover:bg-accent">
                    <span
                      aria-hidden
                      className="flex size-12 items-center justify-center rounded-2xl border border-border/60 font-heading text-sm font-semibold text-gradient"
                    >
                      {partner.nameEn
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">
                      {fa ? partner.nameFa : partner.nameEn}
                    </h3>
                    <p className="mt-1.5 text-sm text-text-3">{partner.country}</p>
                    <p className="mt-auto pt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-text-3">
                      {fa ? "همکاری از" : "Partner since"}{" "}
                      {formatDate(partner.since, locale)}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </Section>
      ))}

      <Section className="border-t border-border/30">
        <Container className="flex flex-col items-center gap-8 text-center">
          <Reveal>
            <h2 className="max-w-xl font-heading text-3xl font-semibold text-foreground">
              {fa ? "به شبکه بپیوندید." : "Join the network."}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/contact">
              <GlowCta>{fa ? "درخواست شراکت" : "Propose a partnership"}</GlowCta>
            </Link>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
