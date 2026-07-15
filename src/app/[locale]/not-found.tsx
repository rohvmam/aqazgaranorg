import { useTranslations } from "next-intl";
import { LogoMark } from "@/components/site/logo";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="dark flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-6 text-center text-foreground">
      <LogoMark className="size-12 opacity-80" />
      <p className="font-mono text-sm tracking-[0.3em] text-text-3">404</p>
      <h1 className="max-w-md font-heading text-3xl font-semibold text-foreground">
        {t("noResults")}
      </h1>
      <Link
        href="/"
        className="rounded-full gradient-brand px-7 py-3 text-sm font-semibold text-white shadow-[0_0_32px_rgba(43,89,255,0.3)]"
      >
        {t("backToHome")}
      </Link>
    </div>
  );
}
