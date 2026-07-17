import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/site/page-hero";
import { Container, Section } from "@/components/site/primitives";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/format";
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
  return { title: t("news") };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fa = locale === "fa";

  const posts = await prisma.newsPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        eyebrow={fa ? "اخبار" : "News"}
        title={fa ? "سیگنال‌هایی از شبکه" : "Signals from the network"}
        lead={
          fa
            ? "کریدورهای تازه، معاملات بسته‌شده و آنچه در بازارها می‌بینیم — بدون حاشیه."
            : "New corridors, closed deals, and what we see in the markets — no noise."
        }
      />

      <Section className="border-t border-border/30 pt-12">
        <Container>
          {featured && (
            <RevealGroup stagger={0.05}>
              <RevealItem>
                <Link
                  href={`/news/${featured.slug}`}
                  className="group glass mb-5 block rounded-3xl p-8 transition-colors duration-300 hover:border-brand-violet/40 md:p-12"
                >
                  <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em]">
                    <span className="text-brand-cyan">{featured.category}</span>
                    <span className="text-text-3">
                      {formatDate(featured.publishedAt, locale)}
                    </span>
                  </div>
                  <h2 className="mt-5 max-w-3xl font-heading text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                    {fa ? featured.titleFa : featured.titleEn}
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-2">
                    {fa ? featured.excerptFa : featured.excerptEn}
                  </p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand-cyan">
                    {fa ? "خواندن گزارش" : "Read the story"}
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:rotate-[270deg] rtl:group-hover:-translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </RevealItem>
            </RevealGroup>
          )}

          <RevealGroup className="grid gap-px overflow-hidden rounded-3xl border border-border/40 bg-border/40 md:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
            {rest.map((post) => (
              <RevealItem key={post.id} className="bg-card">
                <Link
                  href={`/news/${post.slug}`}
                  className="group flex h-full flex-col p-7 transition-colors duration-300 hover:bg-accent"
                >
                  <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-text-3">
                    <span className="text-brand-cyan">{post.category}</span>
                    <time>{formatDate(post.publishedAt, locale)}</time>
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold leading-snug text-foreground">
                    {fa ? post.titleFa : post.titleEn}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-2 line-clamp-3">
                    {fa ? post.excerptFa : post.excerptEn}
                  </p>
                  <span className="mt-auto pt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-text-3 transition-colors group-hover:text-brand-cyan">
                    {post.readMinutes} {fa ? "دقیقه" : "min"}
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>
    </>
  );
}
