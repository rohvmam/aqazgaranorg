/** Bilingual string — every piece of site content carries both locales. */
export type L = { en: string; fa: string };

export function loc(l: L, locale: string): string {
  return locale === "fa" ? l.fa : l.en;
}
