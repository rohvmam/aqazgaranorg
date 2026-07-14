export function formatDate(date: Date | string | null, locale: string): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
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
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number, locale: string): string {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(n);
}
