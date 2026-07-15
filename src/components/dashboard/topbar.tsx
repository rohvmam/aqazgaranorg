"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, LogOut, Moon, Search, Sun, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  CommandPalette,
  useCommandPalette,
} from "@/components/dashboard/command-palette";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/format";

type NotificationRow = {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: string;
};

export function Topbar({
  userName,
  userRole,
}: {
  userName: string;
  userRole: string;
}) {
  const t = useTranslations("dash");
  const tAuth = useTranslations("auth");
  const locale = useLocale();
  const { resolvedTheme, setTheme } = useTheme();
  const palette = useCommandPalette();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["notifications", "topbar"],
    queryFn: async () => {
      const res = await fetch("/api/data/notifications?take=8");
      if (!res.ok) throw new Error("failed");
      return (await res.json()) as { items: NotificationRow[]; total: number };
    },
    refetchInterval: 60_000,
  });
  const unread = data?.items.filter((n) => !n.read) ?? [];

  const markAllRead = async () => {
    await Promise.all(
      unread.map((n) =>
        fetch(`/api/data/notifications/${n.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ read: true }),
        }),
      ),
    );
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <SidebarTrigger className="-ms-1" />

      <Button
        variant="outline"
        onClick={() => palette.setOpen(true)}
        className="hidden h-9 w-64 justify-start gap-2 rounded-full border-border/70 bg-muted/40 px-4 text-xs font-normal text-muted-foreground sm:inline-flex"
      >
        <Search className="size-3.5" aria-hidden />
        {t("searchPlaceholder")}
      </Button>
      <CommandPalette open={palette.open} onOpenChange={palette.setOpen} />

      <div className="ms-auto flex items-center gap-1.5">
        <LocaleSwitcher className="hidden sm:inline-flex" />

        <Button
          variant="ghost"
          size="icon"
          aria-label={t("theme")}
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          <Sun className="size-4.5 dark:hidden" aria-hidden />
          <Moon className="hidden size-4.5 dark:block" aria-hidden />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("notifications")}
              className="relative"
            >
              <Bell className="size-4.5" aria-hidden />
              {unread.length > 0 && (
                <span className="absolute end-1.5 top-1.5 size-2 rounded-full bg-brand-cyan" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-96 p-0">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-semibold">{t("notifications")}</p>
              {unread.length > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-xs text-primary hover:underline"
                >
                  {t("markAllRead")}
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {(data?.items ?? []).length === 0 && (
                <p className="p-6 text-center text-sm text-muted-foreground">
                  {t("emptyTitle")}
                </p>
              )}
              {(data?.items ?? []).map((n) => (
                <div
                  key={n.id}
                  className="flex gap-3 border-b border-border/60 px-4 py-3 last:border-0"
                >
                  <span
                    aria-hidden
                    className={`mt-1.5 size-2 shrink-0 rounded-full ${n.read ? "bg-border" : "bg-brand-cyan"}`}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{n.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {n.body}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground/70">
                      {formatDate(n.createdAt, locale)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="ms-1 rounded-full outline-none ring-primary/50 focus-visible:ring-2"
              aria-label={t("profile")}
            >
              <Avatar className="size-9">
                <AvatarFallback className="gradient-brand text-xs font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-semibold">{userName}</p>
              <Badge variant="secondary" className="mt-1 font-mono text-[10px]">
                {userRole}
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <User className="size-4" aria-hidden />
                {t("viewProfile")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => signOut({ callbackUrl: `/${locale}` })}
            >
              <LogOut className="size-4" aria-hidden />
              {tAuth("signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
