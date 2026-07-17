import type { Metadata } from "next";
import { ArrowUpRight, MapPin } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/site/page-hero";
import { GlowCta, Container, Section, SectionHeading } from "@/components/site/primitives";
import { Link } from "@/i18n/navigation";
import { loc, type L } from "@/lib/content";
import { prisma } from "@/lib/prisma";

// Render at request time — `next build` must not need a database.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("careers") };
}

const TYPE_LABEL: Record<string, L> = {
  FULL_TIME: { en: "Full-time", fa: "تمام‌وقت" },
  PART_TIME: { en: "Part-time", fa: "پاره‌وقت" },
  CONTRACT: { en: "Contract", fa: "قراردادی" },
  REMOTE: { en: "Remote", fa: "دورکاری" },
};

const CULTURE: { title: L; body: L }[] = [
  {
    title: { en: "Real stakes, early", fa: "مسئولیت واقعی، از ابتدا" },
    body: {
      en: "Analysts negotiate with real counterparties in their first quarter. We teach by trusting.",
      fa: "تحلیلگران در همان فصل نخست با طرف‌های واقعی مذاکره می‌کنند. ما با اعتماد آموزش می‌دهیم.",
    },
  },
  {
    title: { en: "Builders and traders together", fa: "سازندگان و تاجران کنار هم" },
    body: {
      en: "Engineers sit beside trade desks. The best products come from watching a shipment stall.",
      fa: "مهندسان کنار میز معاملات می‌نشینند. بهترین محصولات از دیدن توقف یک محموله زاده می‌شوند.",
    },
  },
  {
    title: { en: "A region-sized ambition", fa: "جاه‌طلبی در مقیاس منطقه" },
    body: {
      en: "The work spans three continents before lunch. Careers here compound like the ecosystem does.",
      fa: "کار ما پیش از ظهر از سه قاره می‌گذرد. مسیر شغلی اینجا مانند خود اکوسیستم مرکب رشد می‌کند.",
    },
  },
];

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fa = locale === "fa";

  const jobs = await prisma.jobOpening.findMany({
    where: { open: true },
    orderBy: { postedAt: "desc" },
  });

  return (
    <>
      <PageHero
        eyebrow={fa ? "فرصت‌های شغلی" : "Careers"}
        title={fa ? "آینده تجارت را با ما بسازید" : "Build the future of trade with us"}
        lead={
          fa
            ? "تیمی از تاجران، مهندسان و سازندگان برند — که باور دارند اعتماد، صادراتی‌ترین کالای منطقه است."
            : "A team of traders, engineers, and brand-builders who believe trust is the region's most exportable product."
        }
      />

      {/* Culture */}
      <Section className="border-t border-border/30 py-16 md:py-20">
        <Container>
          <RevealGroup className="grid gap-5 md:grid-cols-3" stagger={0.1}>
            {CULTURE.map((item, i) => (
              <RevealItem key={i}>
                <div className="glass h-full rounded-3xl p-7">
                  <span className="font-mono text-xs text-brand-cyan tabular">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-4 font-heading text-lg font-semibold text-foreground">
                    {loc(item.title, locale)}
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-text-2">
                    {loc(item.body, locale)}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Openings */}
      <Section className="border-t border-border/30">
        <Container>
          <SectionHeading
            eyebrow={fa ? "موقعیت‌های باز" : "Open Roles"}
            title={fa ? "به تیم بپیوندید" : "Join the team"}
          />
          {jobs.length === 0 ? (
            <div className="glass rounded-3xl p-12 text-center">
              <p className="text-text-2">
                {fa
                  ? "در حال حاضر موقعیت بازی نداریم — اما همیشه مشتاق آشنایی با افراد فوق‌العاده‌ایم."
                  : "No open roles right now — but we always want to meet exceptional people."}
              </p>
              <div className="mt-6 flex justify-center">
                <Link href="/contact">
                  <GlowCta variant="ghost">
                    {fa ? "معرفی خودتان" : "Introduce yourself"}
                  </GlowCta>
                </Link>
              </div>
            </div>
          ) : (
            <RevealGroup className="space-y-4" stagger={0.06}>
              {jobs.map((job) => (
                <RevealItem key={job.id}>
                  <Link
                    href={{ pathname: "/contact", query: { topic: "Careers" } }}
                    className="glass group grid gap-5 rounded-3xl p-7 transition-colors duration-300 hover:border-brand-violet/40 md:grid-cols-[1fr_auto] md:items-center"
                  >
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-cyan">
                        {fa ? job.departmentFa : job.departmentEn}
                      </p>
                      <h2 className="mt-2 font-heading text-xl font-semibold text-foreground">
                        {fa ? job.titleFa : job.titleEn}
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-2 line-clamp-2">
                        {fa ? job.descriptionFa : job.descriptionEn}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-3">
                      <span className="inline-flex items-center gap-1.5 text-sm text-text-3">
                        <MapPin className="size-3.5" aria-hidden />
                        {job.location}
                      </span>
                      <span className="rounded-full border border-border/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-text-2">
                        {loc(TYPE_LABEL[job.type] ?? TYPE_LABEL.FULL_TIME, locale)}
                      </span>
                      <span className="hidden items-center gap-1.5 text-xs font-medium text-brand-cyan opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:inline-flex">
                        {fa ? "درخواست" : "Apply"}
                        <ArrowUpRight className="size-3.5 rtl:rotate-[270deg]" aria-hidden />
                      </span>
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </Container>
      </Section>

      <Section className="border-t border-border/30">
        <Container className="flex flex-col items-center gap-6 text-center">
          <Reveal>
            <h2 className="max-w-xl font-heading text-3xl font-semibold text-foreground">
              {fa
                ? "موقعیت مناسب را نمی‌بینید؟"
                : "Don't see the right role?"}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href={{ pathname: "/contact", query: { topic: "Careers" } }}>
              <GlowCta>{fa ? "با ما در میان بگذارید" : "Tell us anyway"}</GlowCta>
            </Link>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
