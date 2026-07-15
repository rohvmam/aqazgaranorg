import { getTranslations, setRequestLocale } from "next-intl/server";
import { MessagesPanel } from "@/components/dashboard/messages-panel";
import { auth } from "@/lib/auth";

export default async function MessagesPage({
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
        {t("messages")}
      </h1>
      <MessagesPanel currentUserId={session!.user.id} />
    </div>
  );
}
