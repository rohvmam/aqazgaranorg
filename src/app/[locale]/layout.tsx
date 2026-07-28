import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AppProviders } from "@/components/providers/app-providers";
import { localeDir, routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const descriptions: Record<string, string> = {
    en: "An investment and international trade holding connecting capital, technology, and production to global markets.",
    fa: "هلدینگ سرمایه‌گذاری و تجارت بین‌الملل؛ اتصال سرمایه، فناوری و تولید به بازارهای جهانی.",
    ar: "شركة قابضة للاستثمار والتجارة الدولية؛ تربط رأس المال والتكنولوجيا والإنتاج بالأسواق العالمية.",
    ru: "Инвестиционный и внешнеторговый холдинг, соединяющий капитал, технологии и производство с мировыми рынками.",
    zh: "投资与国际贸易控股集团，将资本、技术与生产连接到全球市场。",
  };
  const description = descriptions[locale] ?? descriptions.en;
  const ogLocales: Record<string, string> = {
    en: "en_US",
    fa: "fa_IR",
    ar: "ar_AE",
    ru: "ru_RU",
    zh: "zh_CN",
  };

  return {
    metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
    title: {
      default: `${t("companyName")} — ${t("tagline")}`,
      template: `%s — ${t("companyName")}`,
    },
    description,
    openGraph: {
      type: "website",
      siteName: t("companyName"),
      title: `${t("companyName")} — ${t("tagline")}`,
      description,
      locale: ogLocales[locale] ?? "en_US",
    },
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}`]),
      ),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const dir = localeDir(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <AppProviders dir={dir}>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
