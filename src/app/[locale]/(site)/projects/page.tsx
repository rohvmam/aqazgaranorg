import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/site/page-hero";
import { Container, Section } from "@/components/site/primitives";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/content";
import { formatMoney } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("projects") };
}

const STATUS_LABEL = {
  PLANNING: { en: "Planning", fa: "برنامه‌ریزی" },
  ACTIVE: { en: "Active", fa: "فعال" },
  COMPLETED: { en: "Completed", fa: "تکمیل‌شده" },
  ON_HOLD: { en: "On hold", fa: "متوقف" },
} as const;

export default async function ProjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sector?: string }>;
}) {
  const { locale } = await params;
  const { sector } = await searchParams;
  setRequestLocale(locale);
  const fa = locale === "fa";

  const [projects, sectors] = await Promise.all([
    prisma.project.findMany({
      where: sector ? { sector } : undefined,
      orderBy: [{ featured: "desc" }, { startDate: "desc" }],
    }),
    prisma.project.findMany({
      select: { sector: true },
      distinct: ["sector"],
      orderBy: { sector: "asc" },
    }),
  ]);

  return (
    <>
      <PageHero
        eyebrow={fa ? "پروژه‌ها" : "Projects"}
        title={fa ? "کارهایی که بازارها را حرکت می‌دهند" : "Work that moves markets"}
        lead={
          fa
            ? "منتخبی از پروژه‌های هلدینگ در کریدورها، پلتفرم‌ها، معادن و مزارع — هر کدام با اعداد واقعی."
            : "A selection of the holding's work across corridors, platforms, mines, and farms — each with its real numbers."
        }
      />

      <Section className="border-t border-border/30 pt-12">
        <Container>
          {/* Sector filter */}
          <nav
            aria-label={fa ? "فیلتر بخش" : "Filter by sector"}
            className="mb-12 flex flex-wrap gap-2"
          >
            <FilterChip href="/projects" active={!sector} label={fa ? "همه" : "All"} />
            {sectors.map((s) => (
              <FilterChip
                key={s.sector}
                href={`/projects?sector=${encodeURIComponent(s.sector)}`}
                active={sector === s.sector}
                label={s.sector}
              />
            ))}
          </nav>

          <RevealGroup className="grid gap-5 md:grid-cols-2" stagger={0.07}>
            {projects.map((project) => (
              <RevealItem key={project.id}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group glass flex h-full flex-col rounded-3xl p-8 transition-colors duration-300 hover:border-brand-violet/40"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em]">
                      <span className="text-brand-cyan">{project.sector}</span>
                      <span className="text-text-3">{project.country}</span>
                    </div>
                    <span className="rounded-full border border-border/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-text-2">
                      {loc(
                        STATUS_LABEL[project.status as keyof typeof STATUS_LABEL] ??
                          STATUS_LABEL.ACTIVE,
                        locale,
                      )}
                    </span>
                  </div>
                  <h2 className="mt-5 font-heading text-2xl font-semibold leading-snug text-foreground">
                    {fa ? project.titleFa : project.titleEn}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-text-2 line-clamp-3">
                    {fa ? project.summaryFa : project.summaryEn}
                  </p>
                  <div className="mt-auto flex items-end justify-between pt-8">
                    <div>
                      <p className="font-mono text-lg font-medium text-foreground tabular">
                        {formatMoney(project.value, locale)}
                      </p>
                      <p className="mt-1 text-xs text-text-3">
                        {fa ? "ارزش پروژه" : "project value"}
                      </p>
                    </div>
                    <span className="inline-flex size-11 items-center justify-center rounded-full border border-border/60 text-text-2 transition-all duration-300 group-hover:gradient-brand group-hover:text-white">
                      <ArrowUpRight className="size-4.5 rtl:rotate-[270deg]" aria-hidden />
                    </span>
                  </div>
                  <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full gradient-brand"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          {projects.length === 0 && (
            <p className="py-20 text-center text-text-2">
              {fa ? "پروژه‌ای در این بخش ثبت نشده است." : "No projects in this sector yet."}
            </p>
          )}
        </Container>
      </Section>
    </>
  );
}

function FilterChip({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-4 py-2 text-xs font-medium transition-colors",
        active
          ? "border-transparent gradient-brand text-white"
          : "border-border/60 text-text-2 hover:border-brand-violet/50 hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}
