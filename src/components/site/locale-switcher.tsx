"use client";

import { Check, Languages } from "lucide-react";
import { useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALE_NAMES, routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-full border border-border/60 px-3.5 text-xs font-medium text-text-2 transition-colors hover:border-brand-violet/50 hover:text-foreground focus-visible:outline-none",
          className,
        )}
        aria-label="Change language"
      >
        <Languages className="size-3.5" aria-hidden />
        {LOCALE_NAMES[locale as Locale] ?? locale}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {routing.locales.map((l) => (
          <DropdownMenuItem
            key={l}
            lang={l}
            onSelect={() => router.replace(pathname, { locale: l })}
            className="flex items-center justify-between gap-3 text-sm"
          >
            {LOCALE_NAMES[l]}
            {l === locale && (
              <Check className="size-3.5 text-brand-cyan" aria-hidden />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
