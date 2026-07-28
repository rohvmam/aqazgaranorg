/** BCP-47 tags per app locale. fa uses Latin digits for figures consistency. */
const INTL_LOCALES: Record<string, string> = {
  en: "en-US",
  fa: "fa-IR",
  ar: "ar-AE-u-nu-latn",
  ru: "ru-RU",
  zh: "zh-CN",
};

export function intlLocale(locale: string): string {
  return INTL_LOCALES[locale] ?? "en-US";
}

export function formatDate(date: Date | string | null, locale: string): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatMoney(
  amount: number,
  locale: string,
  currency = "USD",
): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number, locale: string): string {
  return new Intl.NumberFormat(intlLocale(locale)).format(n);
}
