"use client";

import { Loader2, MailCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";

export function ForgotForm() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch("/api/account/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center" role="status">
        <span
          aria-hidden
          className="mx-auto flex size-14 items-center justify-center rounded-full gradient-brand text-white"
        >
          <MailCheck className="size-6" />
        </span>
        <h1 className="mt-6 font-heading text-2xl font-semibold text-foreground">
          {t("resetSent")}
        </h1>
        <Link
          href="/login"
          className="mt-8 inline-block text-sm font-medium text-brand-cyan transition-colors hover:text-foreground"
        >
          {t("signIn")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
        {t("forgotTitle")}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-text-2">
        {t("forgotSubtitle")}
      </p>

      <form onSubmit={onSubmit} className="mt-9 space-y-5">
        <div className="space-y-2.5">
          <Label htmlFor="forgot-email">{t("email")}</Label>
          <Input
            id="forgot-email"
            type="email"
            dir="ltr"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 border-border/60 bg-white/[0.03]"
          />
        </div>
        <Button
          type="submit"
          disabled={busy}
          className="h-12 w-full rounded-full gradient-brand text-sm font-semibold text-white shadow-[0_0_32px_rgba(43,89,255,0.3)]"
        >
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {t("sendResetLink")}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-3">
        <Link
          href="/login"
          className="font-medium text-brand-cyan transition-colors hover:text-foreground"
        >
          {t("signIn")}
        </Link>
      </p>
    </div>
  );
}
