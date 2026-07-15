import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { MeridianLine } from "@/components/motion/draw-line";
import { Reveal } from "@/components/motion/reveal";
import { GlowCta, Container } from "@/components/site/primitives";
import { GradientMesh } from "@/components/visuals/gradient-mesh";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await prisma.newsPost.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: locale === "fa" ? post.titleFa : post.titleEn,
    description: locale === "fa" ? post.excerptFa : post.excerptEn,
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const fa = locale === "fa";

  const post = await prisma.newsPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  const body = fa ? post.bodyFa : post.bodyEn;
  const more = await prisma.newsPost.findMany({
    where: { published: true, id: { not: post.id } },
    orderBy: { publishedAt: "desc" },
    take: 2,
  });

  return (
    <>
      <article>
        <header className="relative overflow-hidden pb-14 pt-40 md:pt-48">
          <GradientMesh opacity={0.2} />
          <Container className="relative z-10 max-w-4xl">
            <Reveal y={12}>
              <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em]">
                <span className="text-brand-cyan">{post.category}</span>
                <time className="text-text-3">
                  {formatDate(post.publishedAt, locale)}
                </time>
                <span className="text-text-3">
                  {post.readMinutes} {fa ? "دقیقه مطالعه" : "min read"}
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.12} blur>
              <h1 className="mt-6 font-heading text-3xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {fa ? post.titleFa : post.titleEn}
              </h1>
            </Reveal>
            <Reveal delay={0.24}>
              <p className="mt-6 text-lg leading-relaxed text-text-2">
                {fa ? post.excerptFa : post.excerptEn}
              </p>
            </Reveal>
          </Container>
        </header>

        <MeridianLine className="h-10" />

        <Container className="max-w-3xl py-14">
          <div className="space-y-6">
            {body.split("\n\n").map((paragraph, i) => (
              <Reveal key={i} delay={Math.min(i * 0.05, 0.3)}>
                <p className="text-base leading-[1.85] text-text-2">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </article>

      {more.length > 0 && (
        <section className="border-t border-border/30 py-16">
          <Container>
            <p className="eyebrow mb-8">{fa ? "مطالب بیشتر" : "More from the network"}</p>
            <div className="grid gap-5 md:grid-cols-2">
              {more.map((p) => (
                <Link
                  key={p.id}
                  href={`/news/${p.slug}`}
                  className="group glass rounded-3xl p-7 transition-colors duration-300 hover:border-brand-violet/40"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-cyan">
                    {p.category}
                  </span>
                  <h2 className="mt-3 font-heading text-lg font-semibold leading-snug text-foreground">
                    {fa ? p.titleFa : p.titleEn}
                  </h2>
                </Link>
              ))}
            </div>
            <div className="mt-10">
              <Link href="/news">
                <GlowCta variant="ghost">{fa ? "همه اخبار" : "All news"}</GlowCta>
              </Link>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
