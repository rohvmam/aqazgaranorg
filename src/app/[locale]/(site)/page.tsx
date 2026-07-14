import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("common");

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <p className="eyebrow">{t("tagline")}</p>
      <h1 className="font-heading text-5xl font-semibold text-gradient">
        {t("companyName")}
      </h1>
    </main>
  );
}
