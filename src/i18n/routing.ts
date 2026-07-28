import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fa", "ar", "ru", "zh"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

/** Locales rendered right-to-left. */
export const RTL_LOCALES: readonly Locale[] = ["fa", "ar"];

export function localeDir(locale: string): "rtl" | "ltr" {
  return (RTL_LOCALES as readonly string[]).includes(locale) ? "rtl" : "ltr";
}

/** Native display names, used by the locale switcher. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  fa: "فارسی",
  ar: "العربية",
  ru: "Русский",
  zh: "中文",
};
