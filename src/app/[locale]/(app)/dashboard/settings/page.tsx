import { getTranslations, setRequestLocale } from "next-intl/server";
import { TwoFactorCard } from "@/components/dashboard/two-factor-card";
import { Card } from "@/components/ui/card";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fa = locale === "fa";
  const t = await getTranslations("dash");
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { twoFactorEnabled: true, email: true },
  });

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        {t("settings")}
      </h1>

      <TwoFactorCard initiallyEnabled={user?.twoFactorEnabled ?? false} />

      <Card className="gap-4 border-border/70 p-6">
        <p className="text-sm font-semibold">{t("theme")} · {fa ? "زبان" : "Language"}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {fa
            ? "پوسته تیره/روشن از نوار بالای داشبورد قابل تغییر است. زبان پنل و وب‌سایت را از اینجا عوض کنید:"
            : "Dark/light theme is toggled from the dashboard top bar. Switch the panel and website language here:"}
        </p>
        <div>
          <LocaleSwitcher />
        </div>
      </Card>

      <Card className="gap-3 border-border/70 p-6">
        <p className="text-sm font-semibold">{fa ? "حساب" : "Account"}</p>
        <p className="text-xs text-muted-foreground" dir="ltr">
          {user?.email}
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {fa
            ? "برای تغییر نام، سمت یا رمز عبور به صفحه پروفایل بروید."
            : "To change your name, title, or password, use the Profile page."}
        </p>
      </Card>
    </div>
  );
}
