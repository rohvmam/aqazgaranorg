"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const t = useTranslations("footer");
  const [email, setEmail] = useState("");

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!email) return;
        toast.success(t("newsletterSuccess"));
        setEmail("");
      }}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        {t("newsletterPlaceholder")}
      </label>
      <Input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("newsletterPlaceholder")}
        className="h-11 rounded-full border-border/60 bg-white/[0.03] px-5 text-sm"
        autoComplete="email"
      />
      <Button
        type="submit"
        size="icon"
        aria-label={t("newsletterCta")}
        className="size-11 shrink-0 rounded-full gradient-brand text-white shadow-[0_0_24px_rgba(43,89,255,0.3)]"
      >
        <ArrowRight className="size-4 rtl:rotate-180" />
      </Button>
    </form>
  );
}
