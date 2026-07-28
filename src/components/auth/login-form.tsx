"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MailCheck } from "lucide-react";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";
import { Link } from "@/i18n/navigation";

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [step, setStep] = useState<"credentials" | "code">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [emailMasked, setEmailMasked] = useState("");
  const [totpAvailable, setTotpAvailable] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const destination = callbackUrl || `/${locale}/dashboard`;

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const finishSignIn = async () => {
    const res = await signIn("credentials", {
      email,
      password,
      code,
      redirect: false,
    });
    if (res?.error) {
      setError(t("codeInvalid"));
      return false;
    }
    window.location.assign(destination);
    return true;
  };

  const resend = async () => {
    if (cooldown > 0 || busy) return;
    setError(null);
    const res = await fetch("/api/account/otp/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, purpose: "LOGIN", locale }),
    });
    if (res.status === 429) {
      setError(t("resendWait"));
      return;
    }
    setCooldown(60);
    setCode("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (step === "credentials") {
        const res = await fetch("/api/account/preauth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, locale }),
        });
        if (!res.ok) {
          setError(t("invalidCredentials"));
          return;
        }
        const data = (await res.json()) as {
          emailMasked?: string;
          totpAvailable?: boolean;
        };
        setEmailMasked(data.emailMasked ?? email);
        setTotpAvailable(Boolean(data.totpAvailable));
        setCooldown(60);
        setStep("code");
      } else {
        await finishSignIn();
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
        {step === "credentials" ? t("welcomeBack") : t("otpTitle")}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-text-2">
        {step === "credentials"
          ? t("loginSubtitle")
          : t("otpSubtitle", { email: emailMasked })}
      </p>

      <form onSubmit={onSubmit} className="mt-9 space-y-5" noValidate>
        <AnimatePresence mode="wait" initial={false}>
          {step === "credentials" ? (
            <motion.div
              key="credentials"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              <div className="space-y-2.5">
                <Label htmlFor="login-email">{t("email")}</Label>
                <Input
                  id="login-email"
                  type="email"
                  dir="ltr"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-border/60 bg-white/[0.03]"
                />
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">{t("password")}</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-text-3 transition-colors hover:text-brand-cyan"
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>
                <PasswordInput
                  id="login-password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              <div className="flex items-center gap-3 rounded-2xl border border-brand-cyan/25 bg-brand-cyan/5 p-4 text-xs leading-relaxed text-text-2">
                <MailCheck className="size-5 shrink-0 text-brand-cyan" aria-hidden />
                <span>
                  {t("otpSubtitle", { email: emailMasked })}
                  {totpAvailable && <> {t("totpHint")}</>}
                </span>
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="login-code">{t("codeLabel")}</Label>
                <Input
                  id="login-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  dir="ltr"
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="h-13 border-border/60 bg-white/[0.03] text-center font-mono text-xl tracking-[0.5em]"
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStep("credentials");
                    setCode("");
                    setError(null);
                  }}
                  className="text-text-3 transition-colors hover:text-foreground"
                >
                  {t("back")}
                </button>
                <button
                  type="button"
                  onClick={resend}
                  disabled={cooldown > 0}
                  className="text-brand-cyan transition-colors hover:text-foreground disabled:cursor-default disabled:text-text-3"
                >
                  {cooldown > 0
                    ? t("resendIn", { seconds: cooldown })
                    : t("resendCode")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={busy || (step === "code" && code.length !== 6)}
          className="h-12 w-full rounded-full gradient-brand text-sm font-semibold text-white shadow-[0_0_32px_rgba(43,89,255,0.3)] transition-shadow hover:shadow-[0_0_48px_rgba(139,92,246,0.45)]"
        >
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {step === "credentials" ? t("signIn") : t("verify")}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-3">
        {t("noAccount")}{" "}
        <Link
          href="/register"
          className="font-medium text-brand-cyan transition-colors hover:text-foreground"
        >
          {t("signUp")}
        </Link>
      </p>
    </div>
  );
}
