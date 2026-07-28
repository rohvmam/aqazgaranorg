/**
 * Localized string — en and fa are always authored; ar/ru/zh are optional and
 * fall back to English so partially translated content never breaks a page.
 */
export type L = {
  en: string;
  fa: string;
  ar?: string;
  ru?: string;
  zh?: string;
};

export function loc(l: L, locale: string): string {
  return l[locale as keyof L] ?? l.en;
}
