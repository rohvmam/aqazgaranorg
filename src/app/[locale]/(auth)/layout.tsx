import { getLocale, getTranslations } from "next-intl/server";
import { LogoMark } from "@/components/site/logo";
import { GradientMesh } from "@/components/visuals/gradient-mesh";
import { WorldMap } from "@/components/visuals/world-map";
import { Link } from "@/i18n/navigation";

/** Cinematic split shell for login/register/reset — always dark. */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const t = await getTranslations("common");
  const fa = locale === "fa";

  return (
    <div className="dark bg-background text-foreground grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      {/* Form column */}
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link href="/" className="inline-flex w-fit items-center gap-2.5" aria-label={t("backToHome")}>
          <LogoMark className="size-7" />
          <span className="font-heading text-sm font-semibold">
            {t("companyShort")}
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="text-center text-xs text-text-3">
          © {new Date().getFullYear()} {t("companyName")}
        </p>
      </div>

      {/* Visual column */}
      <div className="relative hidden overflow-hidden border-s border-border/40 lg:block">
        <GradientMesh opacity={0.35} />
        <div className="absolute inset-0 flex flex-col justify-between p-14">
          <p className="eyebrow">{t("tagline")}</p>
          <div className="[mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]">
            <WorldMap />
          </div>
          <blockquote className="max-w-md">
            <p className="font-heading text-2xl font-medium leading-relaxed text-foreground">
              {fa
                ? "تجارت، جابه‌جایی اعتماد است — و اعتماد از همین‌جا آغاز می‌شود."
                : "Trade is the movement of trust — and trust starts here."}
            </p>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
