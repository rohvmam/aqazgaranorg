"use client";

import { Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const other = locale === "fa" ? "en" : "fa";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: other })}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border border-border/60 px-3.5 text-xs font-medium text-text-2 transition-colors hover:border-brand-violet/50 hover:text-foreground",
        className,
      )}
      aria-label={other === "fa" ? "تغییر زبان به فارسی" : "Switch to English"}
    >
      <Languages className="size-3.5" aria-hidden />
      {other === "fa" ? "فارسی" : "EN"}
    </button>
  );
}
