import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage({
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
    include: { role: true },
  });
  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        {t("profile")}
      </h1>

      <Card className="flex-row items-center gap-5 border-border/70 p-6">
        <Avatar className="size-16">
          <AvatarFallback className="gradient-brand text-lg font-semibold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-heading text-lg font-semibold">{user.name}</p>
          <p className="truncate text-sm text-muted-foreground" dir="ltr">
            {user.email}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="font-mono text-[10px]">
              {user.role.name}
            </Badge>
            {user.title && (
              <span className="text-xs text-muted-foreground">{user.title}</span>
            )}
            <span className="text-xs text-muted-foreground/70">
              {fa ? "عضو از" : "Member since"} {formatDate(user.createdAt, locale)}
            </span>
          </div>
        </div>
      </Card>

      <ProfileForm initialName={user.name} initialTitle={user.title ?? ""} />
    </div>
  );
}
