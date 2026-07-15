import { getTranslations, setRequestLocale } from "next-intl/server";
import { RolesPanel } from "@/components/dashboard/roles-panel";
import { auth } from "@/lib/auth";

export default async function RolesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dash");
  const session = await auth();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        {t("roles")}
      </h1>
      <RolesPanel currentUserId={session!.user.id} />
    </div>
  );
}
