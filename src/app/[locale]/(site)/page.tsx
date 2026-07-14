import { setRequestLocale } from "next-intl/server";
import { CtaSection } from "@/components/site/home/cta-section";
import { EcosystemSection } from "@/components/site/home/ecosystem-section";
import { FaqSection } from "@/components/site/home/faq-section";
import { FeaturedProjects } from "@/components/site/home/featured-projects";
import { GlobalNetwork } from "@/components/site/home/global-network";
import { Hero } from "@/components/site/home/hero";
import { Industries } from "@/components/site/home/industries";
import { Intro } from "@/components/site/home/intro";
import { NewsPreview } from "@/components/site/home/news-preview";
import { Opportunities } from "@/components/site/home/opportunities";
import { PartnerMarquee } from "@/components/site/home/partner-marquee";
import { Platforms } from "@/components/site/home/platforms";
import { Services } from "@/components/site/home/services";
import { Stats } from "@/components/site/home/stats";
import { Testimonials } from "@/components/site/home/testimonials";
import { Timeline } from "@/components/site/home/timeline";
import { WhyUs } from "@/components/site/home/why-us";
import { prisma } from "@/lib/prisma";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [projects, news, platforms, partners] = await Promise.all([
    prisma.project.findMany({
      where: { featured: true },
      orderBy: { startDate: "desc" },
      take: 3,
    }),
    prisma.newsPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    prisma.platform.findMany({ orderBy: { users: "desc" } }),
    prisma.partner.findMany({ where: { status: "ACTIVE" }, take: 10 }),
  ]);

  return (
    <>
      <Hero />
      <Intro locale={locale} />
      <PartnerMarquee
        locale={locale}
        names={partners.map((p) => (locale === "fa" ? p.nameFa : p.nameEn))}
      />
      <EcosystemSection locale={locale} />
      <Services locale={locale} />
      <Industries />
      <GlobalNetwork locale={locale} />
      <Stats locale={locale} />
      <FeaturedProjects locale={locale} projects={projects} />
      <Opportunities locale={locale} />
      <Platforms locale={locale} platforms={platforms} />
      <WhyUs locale={locale} />
      <Timeline />
      <Testimonials />
      <FaqSection locale={locale} />
      <NewsPreview locale={locale} posts={news} />
      <CtaSection locale={locale} />
    </>
  );
}
