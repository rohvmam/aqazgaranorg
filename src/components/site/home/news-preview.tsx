import { ArrowUpRight } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Container, Section, SectionHeading } from "@/components/site/primitives";
import { NEWS_SECTION } from "@/content/home";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/content";
import { formatDate } from "@/lib/format";

export type NewsRow = {
  id: string;
  slug: string;
  titleEn: string;
  titleFa: string;
  excerptEn: string;
  excerptFa: string;
  category: string;
  publishedAt: Date | null;
  readMinutes: number;
};

export function NewsPreview({
  locale,
  posts,
}: {
  locale: string;
  posts: NewsRow[];
}) {
  const fa = locale === "fa";

  return (
    <Section className="border-t border-border/30">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow={loc(NEWS_SECTION.eyebrow, locale)}
            title={loc(NEWS_SECTION.title, locale)}
            className="mb-0"
          />
          <Link
            href="/news"
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-cyan transition-colors hover:text-foreground"
          >
            {fa ? "همه اخبار" : "All news"}
            <ArrowUpRight className="size-4 rtl:rotate-[270deg]" aria-hidden />
          </Link>
        </div>
        <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border/40 bg-border/40 md:grid-cols-3" stagger={0.1}>
          {posts.map((post) => (
            <RevealItem key={post.id} className="bg-card">
              <Link
                href={`/news/${post.slug}`}
                className="group flex h-full flex-col p-7 transition-colors duration-300 hover:bg-accent"
              >
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-text-3">
                  <span className="text-brand-cyan">{post.category}</span>
                  <span aria-hidden>·</span>
                  <time>{formatDate(post.publishedAt, locale)}</time>
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold leading-snug text-foreground">
                  {fa ? post.titleFa : post.titleEn}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-2 line-clamp-3">
                  {fa ? post.excerptFa : post.excerptEn}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-xs font-medium text-text-3 transition-colors group-hover:text-brand-cyan">
                  {post.readMinutes} {fa ? "دقیقه مطالعه" : "min read"}
                  <ArrowUpRight className="size-3.5 rtl:rotate-[270deg]" aria-hidden />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
