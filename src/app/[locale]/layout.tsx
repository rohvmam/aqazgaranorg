import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AppProviders } from "@/components/providers/app-providers";
import { routing } from "@/i18n/routing";
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
  const description =
    locale === "fa"
      ? "هلدینگ سرمایه‌گذاری و تجارت بین‌الملل؛ اتصال سرمایه، فناوری و تولید به بازارهای جهانی."
      : "An investment and international trade holding connecting capital, technology, and production to global markets.";

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
      locale: locale === "fa" ? "fa_IR" : "en_US",
    },
    alternates: {
      languages: { en: "/en", fa: "/fa" },
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

  const dir = locale === "fa" ? "rtl" : "ltr";

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
