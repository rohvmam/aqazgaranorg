import { ArrowUpRight } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/site/primitives";
import { PROJECTS_SECTION } from "@/content/home";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/content";

export type FeaturedProject = {
  id: string;
  slug: string;
  titleEn: string;
  titleFa: string;
  summaryEn: string;
  summaryFa: string;
  sector: string;
  country: string;
  progress: number;
  value: number;
};

/**
 * Featured projects as a sticky stack: each card pins under the last,
 * creating the stacked-deck scroll without any JS.
 */
export function FeaturedProjects({
  locale,
  projects,
}: {
  locale: string;
  projects: FeaturedProject[];
}) {
  const fa = locale === "fa";

  return (
    <Section className="border-t border-border/30">
      <Container>
        <SectionHeading
          eyebrow={loc(PROJECTS_SECTION.eyebrow, locale)}
          title={loc(PROJECTS_SECTION.title, locale)}
        />
        <div className="flex flex-col gap-6">
          {projects.map((project, i) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group sticky"
              style={{ top: `${7 + i * 2.5}rem` }}
            >
              <article className="glass relative overflow-hidden rounded-3xl p-8 transition-colors duration-300 group-hover:border-brand-violet/40 md:p-12">
                <div
                  aria-hidden
                  className="ambient-glow -end-24 -top-24 size-72 bg-primary/50"
                />
                <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-cyan">
                        {project.sector}
                      </span>
                      <span className="size-1 rounded-full bg-text-3" aria-hidden />
                      <span className="font-mono text-xs text-text-3">
                        {project.country}
                      </span>
                    </div>
                    <h3 className="mt-4 max-w-2xl font-heading text-2xl font-semibold leading-tight text-foreground md:text-4xl">
                      {fa ? project.titleFa : project.titleEn}
                    </h3>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-2 md:text-base">
                      {fa ? project.summaryFa : project.summaryEn}
                    </p>
                  </div>
                  <div className="flex items-center gap-8 md:flex-col md:items-end md:gap-6">
                    <div className="md:text-end">
                      <p className="font-mono text-2xl font-medium text-foreground tabular">
                        {project.progress}%
                      </p>
                      <p className="mt-1 text-xs text-text-3">
                        {fa ? "پیشرفت" : "progress"}
                      </p>
                    </div>
                    <span className="inline-flex size-12 items-center justify-center rounded-full border border-border/60 text-text-2 transition-all duration-300 group-hover:gradient-brand group-hover:text-white">
                      <ArrowUpRight className="size-5 rtl:rotate-[270deg]" aria-hidden />
                    </span>
                  </div>
                </div>
                <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full gradient-brand transition-all duration-700"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
