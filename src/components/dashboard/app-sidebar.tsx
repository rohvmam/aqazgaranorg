"use client";

import { useTranslations } from "next-intl";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LogoMark } from "@/components/site/logo";
import { DASHBOARD_NAV } from "@/components/dashboard/nav-config";
import { Link, usePathname } from "@/i18n/navigation";

export function AppSidebar() {
  const t = useTranslations("dash");
  const common = useTranslations("common");
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <LogoMark className="size-7 shrink-0" />
          <span className="truncate font-heading text-sm font-semibold group-data-[collapsible=icon]:hidden">
            {common("companyShort")}
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {DASHBOARD_NAV.map((group) => (
          <SidebarGroup key={group.groupKey}>
            <SidebarGroupLabel>{t(group.groupKey)}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={t(item.key)}
                        className="data-[active=true]:bg-primary/12 data-[active=true]:text-primary data-[active=true]:shadow-[inset_2px_0_0_var(--primary)] rtl:data-[active=true]:shadow-[inset_-2px_0_0_var(--primary)]"
                      >
                        <Link href={item.href}>
                          <item.icon aria-hidden />
                          <span>{t(item.key)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
