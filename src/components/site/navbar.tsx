"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BUSINESS_AREAS } from "@/content/business-areas";
import { Link, usePathname } from "@/i18n/navigation";
import { loc } from "@/lib/content";
import { cn } from "@/lib/utils";
import { LocaleSwitcher } from "./locale-switcher";
import { Logo, LogoMark } from "./logo";

type MenuKey = "company" | "business" | "insights" | null;

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation.
  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const enter = (key: Exclude<MenuKey, null>) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(key);
  };
  const leave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 160);
  };

  const companyLinks = [
    { href: "/about", label: t("about") },
    { href: "/vision", label: t("vision") },
    { href: "/partners", label: t("partners") },
    { href: "/careers", label: t("careers") },
  ];
  const insightLinks = [
    { href: "/projects", label: t("projects") },
    { href: "/news", label: t("news") },
    { href: "/events", label: t("events") },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-100 transition-all duration-300",
        scrolled || open
          ? "glass border-x-0 border-t-0"
          : "border-b border-transparent",
      )}
      onMouseLeave={leave}
    >
      <nav
        className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12"
        aria-label="Main"
      >
        <Link href="/" className="shrink-0" aria-label={t("home")}>
          <Logo />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          <TopLink href="/" active={pathname === "/"}>
            {t("home")}
          </TopLink>
          <TopDropdown
            label={t("company")}
            open={open === "company"}
            onEnter={() => enter("company")}
          />
          <TopDropdown
            label={t("business")}
            open={open === "business"}
            onEnter={() => enter("business")}
          />
          <TopDropdown
            label={t("insights")}
            open={open === "insights"}
            onEnter={() => enter("insights")}
          />
          <TopLink href="/investors" active={pathname.startsWith("/investors")}>
            {t("investors")}
          </TopLink>
          <TopLink href="/contact" active={pathname.startsWith("/contact")}>
            {t("contact")}
          </TopLink>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher />
          <Link href="/login">
            <Button
              size="sm"
              className="h-9 rounded-full gradient-brand bg-[length:180%_180%] px-5 text-xs font-semibold text-white shadow-[0_0_24px_rgba(43,89,255,0.3)] transition-all hover:shadow-[0_0_40px_rgba(139,92,246,0.45)]"
            >
              {t("signIn")}
            </Button>
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <LocaleSwitcher />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("openMenu")}
                className="text-foreground"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side={locale === "fa" ? "left" : "right"}
              className="dark w-[320px] overflow-y-auto border-border/60 bg-popover text-foreground"
            >
              <SheetHeader>
                <SheetTitle>
                  <span className="flex items-center gap-2">
                    <LogoMark className="size-6" />
                    <span className="font-heading text-sm font-semibold">
                      {locale === "fa" ? "هلدینگ آتا" : "ATA Holding"}
                    </span>
                  </span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4 pb-8">
                <MobileLink href="/">{t("home")}</MobileLink>
                <Accordion type="single" collapsible>
                  <AccordionItem value="company" className="border-border/40">
                    <AccordionTrigger className="py-3 text-sm font-medium">
                      {t("company")}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-1">
                      {companyLinks.map((l) => (
                        <MobileLink key={l.href} href={l.href} sub>
                          {l.label}
                        </MobileLink>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="business" className="border-border/40">
                    <AccordionTrigger className="py-3 text-sm font-medium">
                      {t("business")}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-1">
                      <MobileLink href="/business" sub>
                        {t("business")} — {locale === "fa" ? "همه" : "Overview"}
                      </MobileLink>
                      {BUSINESS_AREAS.map((a) => (
                        <MobileLink key={a.slug} href={`/business/${a.slug}`} sub>
                          {loc(a.name, locale)}
                        </MobileLink>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="insights" className="border-border/40">
                    <AccordionTrigger className="py-3 text-sm font-medium">
                      {t("insights")}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-1">
                      {insightLinks.map((l) => (
                        <MobileLink key={l.href} href={l.href} sub>
                          {l.label}
                        </MobileLink>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <MobileLink href="/investors">{t("investors")}</MobileLink>
                <MobileLink href="/contact">{t("contact")}</MobileLink>
                <Link href="/login" className="mt-4">
                  <Button className="w-full rounded-full gradient-brand text-white">
                    {t("signIn")}
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Mega/dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key={open}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full hidden border-b border-border/60 bg-popover/95 backdrop-blur-2xl lg:block"
            onMouseEnter={() => enter(open)}
            onMouseLeave={leave}
          >
            <div className="mx-auto max-w-7xl px-8 py-8 lg:px-12">
              {open === "business" ? (
                <div className="grid grid-cols-[280px_1fr] gap-10">
                  <div>
                    <p className="eyebrow mb-3">{t("business")}</p>
                    <p className="text-sm leading-relaxed text-text-2">
                      {t("businessIntro")}
                    </p>
                    <Link
                      href="/business"
                      className="mt-4 inline-block text-sm font-medium text-brand-cyan hover:underline"
                    >
                      {locale === "fa" ? "مشاهده همه حوزه‌ها ←" : "View all areas →"}
                    </Link>
                  </div>
                  <ul className="grid grid-cols-2 gap-1 xl:grid-cols-3">
                    {BUSINESS_AREAS.map((area) => (
                      <li key={area.slug}>
                        <Link
                          href={`/business/${area.slug}`}
                          className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-accent"
                        >
                          <area.icon
                            className="mt-0.5 size-4.5 shrink-0 text-brand-violet transition-colors group-hover:text-brand-cyan"
                            aria-hidden
                          />
                          <span>
                            <span className="block text-sm font-medium text-foreground">
                              {loc(area.name, locale)}
                            </span>
                            <span className="mt-0.5 block text-xs leading-snug text-text-3">
                              {loc(area.tagline, locale)}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <ul className="flex gap-2">
                  {(open === "company" ? companyLinks : insightLinks).map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="block rounded-xl px-4 py-3 text-sm font-medium text-text-2 transition-colors hover:bg-accent hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function TopLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors",
        active ? "text-foreground" : "text-text-2 hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

function TopDropdown({
  label,
  open,
  onEnter,
}: {
  label: string;
  open: boolean;
  onEnter: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors",
        open ? "text-foreground" : "text-text-2 hover:text-foreground",
      )}
      aria-expanded={open}
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onClick={onEnter}
    >
      {label}
      <ChevronDown
        className={cn("size-3.5 transition-transform", open && "rotate-180")}
        aria-hidden
      />
    </button>
  );
}

function MobileLink({
  href,
  sub,
  children,
}: {
  href: string;
  sub?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-lg py-2.5 text-sm font-medium text-text-2 transition-colors hover:text-foreground",
        sub ? "ps-3 text-[13px]" : "",
      )}
    >
      {children}
    </Link>
  );
}
