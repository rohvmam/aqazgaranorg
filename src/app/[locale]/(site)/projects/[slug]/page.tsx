import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Counter } from "@/components/motion/counter";
import { MeridianLine } from "@/components/motion/draw-line";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/site/page-hero";
import { GlowCta, Container, Section } from "@/components/site/primitives";
import { Link } from "@/i18n/navigation";
import { formatDate, formatMoney } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return {};
  return {
    title: locale === "fa" ? project.titleFa : project.titleEn,
    description: locale === "fa" ? project.summaryFa : project.summaryEn,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const fa = locale === "fa";

  const project = await prisma.project.findUnique({
    where: { slug },
    include: { client: true },
  });
  if (!project) notFound();

  const body = fa ? project.bodyFa : project.bodyEn;

  return (
    <>
      <PageHero
        eyebrow={`${project.sector} — ${project.country}`}
        title={fa ? project.titleFa : project.titleEn}
        lead={fa ? project.summaryFa : project.summaryEn}
      />

      {/* Key figures */}
      <section className="relative py-14">
        <MeridianLine className="absolute inset-x-0 top-0 h-8" />
        <Container>
          <div className="grid gap-8 sm:grid-cols-3">
            <Reveal>
              <p className="font-mono text-3xl font-medium text-gradient tabular">
                {formatMoney(project.value, locale)}
              </p>
              <p className="mt-2 text-sm text-text-2">{fa ? "ارزش پروژه" : "Project value"}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-mono text-3xl font-medium text-gradient tabular">
                <Counter to={project.progress} suffix="%" locale={locale} />
              </p>
              <p className="mt-2 text-sm text-text-2">{fa ? "پیشرفت" : "Progress"}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-mono text-3xl font-medium text-gradient tabular">
                {formatDate(project.startDate, locale)}
              </p>
              <p className="mt-2 text-sm text-text-2">{fa ? "آغاز" : "Started"}</p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Narrative */}
      {body && (
        <Section className="border-t border-border/30">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <Reveal>
                  <p className="eyebrow">{fa ? "شرح پروژه" : "The Work"}</p>
                  {project.client && (
                    <p className="mt-6 text-sm text-text-3">
                      {fa ? "کارفرما" : "Client"}
                      <span className="mt-1 block font-medium text-text-2">
                        {fa ? project.client.nameFa : project.client.nameEn}
                      </span>
                    </p>
                  )}
                </Reveal>
              </div>
              <div className="space-y-6 lg:col-span-7">
                {body.split("\n\n").map((paragraph, i) => (
                  <Reveal key={i} delay={i * 0.08}>
                    <p className="text-base leading-relaxed text-text-2 first:font-heading first:text-xl first:font-medium first:text-foreground">
                      {paragraph}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}

      <Section className="border-t border-border/30">
        <Container className="flex flex-col items-center gap-8 text-center">
          <Reveal>
            <h2 className="max-w-xl font-heading text-3xl font-semibold text-foreground">
              {fa ? "پروژه مشابهی در ذهن دارید؟" : "Have a similar project in mind?"}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <GlowCta>{fa ? "گفت‌وگو کنیم" : "Talk to us"}</GlowCta>
              </Link>
              <Link href="/projects">
                <GlowCta variant="ghost">{fa ? "همه پروژه‌ها" : "All projects"}</GlowCta>
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
