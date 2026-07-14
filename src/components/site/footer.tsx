import { getLocale, getTranslations } from "next-intl/server";
import { MeridianLine } from "@/components/motion/draw-line";
import { BUSINESS_AREAS } from "@/content/business-areas";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/content";
import { LogoMark } from "./logo";
import { NewsletterForm } from "./newsletter-form";

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const common = await getTranslations("common");
  const locale = await getLocale();
  const year = new Date().getFullYear();

  const columns: { title: string; links: { href: string; label: string }[] }[] = [
    {
      title: t("ecosystem"),
      links: [
        ...BUSINESS_AREAS.slice(0, 6).map((a) => ({
          href: `/business/${a.slug}`,
          label: loc(a.name, locale),
        })),
        { href: "/business", label: common("viewAll") },
      ],
    },
    {
      title: t("company"),
      links: [
        { href: "/about", label: nav("about") },
        { href: "/vision", label: nav("vision") },
        { href: "/partners", label: nav("partners") },
        { href: "/careers", label: nav("careers") },
        { href: "/contact", label: nav("contact") },
      ],
    },
    {
      title: t("insights"),
      links: [
        { href: "/projects", label: nav("projects") },
        { href: "/investors", label: nav("investors") },
        { href: "/news", label: nav("news") },
        { href: "/events", label: nav("events") },
      ],
    },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden">
      <MeridianLine className="h-10" />
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm">
            <span className="flex items-center gap-2.5">
              <LogoMark />
              <span className="font-heading text-base font-semibold text-foreground">
                {common("companyName")}
              </span>
            </span>
            <p className="mt-5 text-sm leading-relaxed text-text-2">
              {t("blurb")}
            </p>
            <div className="mt-8">
              <p className="eyebrow mb-2">{t("newsletterTitle")}</p>
              <p className="mb-4 text-xs leading-relaxed text-text-3">
                {t("newsletterBody")}
              </p>
              <NewsletterForm />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="eyebrow mb-5">{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-text-2 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border/40 pt-6 text-xs text-text-3 sm:flex-row sm:items-center">
          <p>
            © {year} {common("companyName")}. {t("rights")}
          </p>
          <div className="flex items-center gap-6">
            <span className="cursor-default transition-colors hover:text-text-2">
              {t("privacy")}
            </span>
            <span className="cursor-default transition-colors hover:text-text-2">
              {t("terms")}
            </span>
          </div>
        </div>
      </div>

      {/* Oversized watermark */}
      <div
        aria-hidden
        className="pointer-events-none select-none overflow-hidden pb-2"
      >
        <p className="whitespace-nowrap text-center font-heading text-[11vw] font-bold leading-none tracking-tight text-white/[0.025]">
          {locale === "fa" ? "تجارت آینده" : "FUTURE TRADE"}
        </p>
      </div>
    </footer>
  );
}
