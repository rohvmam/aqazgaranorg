"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";
import { Link, useRouter } from "@/i18n/navigation";

const schema = z
  .object({
    name: z.string().min(2, "name"),
    email: z.string().email("email"),
    phone: z
      .string()
      .regex(/^\+?[0-9\s\-()]{7,20}$/, "phone")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "password")
      .regex(/[A-Z]/, "password")
      .regex(/[0-9]/, "password"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "confirm" });

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const fa = locale === "fa";

  const [step, setStep] = useState<"form" | "verify">("form");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const MSG: Record<string, string> = {
    name: fa ? "دست‌کم ۲ نویسه." : "At least 2 characters.",
    email: fa ? "ایمیل معتبر وارد کنید." : "Enter a valid email.",
    phone: fa ? "شماره تلفن معتبر وارد کنید." : "Enter a valid phone number.",
    password: fa
      ? "دست‌کم ۸ نویسه، شامل یک حرف بزرگ و یک رقم."
      : "At least 8 characters with one uppercase letter and one digit.",
    confirm: fa ? "رمزها یکسان نیستند." : "Passwords do not match.",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", password: "", confirm: "" },
  });
  const { errors, isSubmitting } = form.formState;
  const err = (k?: string) => (k ? MSG[k] : undefined);

  const onSubmit = form.handleSubmit(async (values) => {
    const res = await fetch("/api/account/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        password: values.password,
        locale,
      }),
    });
    if (res.status === 409) {
      form.setError("email", { message: "inUse" });
      MSG.inUse = t("emailInUse");
      return;
    }
    if (!res.ok) {
      toast.error(fa ? "ثبت‌نام ناموفق بود." : "Registration failed.");
      return;
    }
    setEmail(values.email);
    setCooldown(60);
    setStep("verify");
  });

  const resend = async () => {
    if (cooldown > 0) return;
    setCodeError(null);
    const res = await fetch("/api/account/otp/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, purpose: "REGISTER", locale }),
    });
    if (res.status === 429) {
      setCodeError(t("resendWait"));
      return;
    }
    toast.success(t("codeResent"));
    setCooldown(60);
    setCode("");
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError(null);
    setVerifying(true);
    try {
      const res = await fetch("/api/account/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (res.ok) {
        toast.success(t("emailVerified"));
        router.push("/login");
        return;
      }
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        attemptsLeft?: number;
      } | null;
      if (data?.error === "CODE_EXPIRED") setCodeError(t("codeExpired"));
      else if (data?.error === "CODE_LOCKED") setCodeError(t("codeLocked"));
      else if (data?.error === "CODE_INVALID")
        setCodeError(
          `${t("codeInvalid")} ${
            typeof data.attemptsLeft === "number"
              ? t("attemptsLeft", { count: data.attemptsLeft })
              : ""
          }`.trim(),
        );
      else setCodeError(t("codeInvalid"));
    } finally {
      setVerifying(false);
    }
  };

  if (step === "verify") {
    return (
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
          {t("verifyEmailTitle")}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-2">
          {t("verifyEmailSubtitle", { email })}
        </p>

        <form onSubmit={verify} className="mt-9 space-y-5" noValidate>
          <div className="flex items-center gap-3 rounded-2xl border border-brand-cyan/25 bg-brand-cyan/5 p-4 text-xs leading-relaxed text-text-2">
            <MailCheck className="size-5 shrink-0 text-brand-cyan" aria-hidden />
            {t("otpSubtitle", { email })}
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="reg-code">{t("codeLabel")}</Label>
            <Input
              id="reg-code"
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
          <div className="flex items-center justify-end text-xs">
            <button
              type="button"
              onClick={resend}
              disabled={cooldown > 0}
              className="text-brand-cyan transition-colors hover:text-foreground disabled:cursor-default disabled:text-text-3"
            >
              {cooldown > 0 ? t("resendIn", { seconds: cooldown }) : t("resendCode")}
            </button>
          </div>

          {codeError && (
            <p role="alert" className="text-sm text-destructive">
              {codeError}
            </p>
          )}

          <Button
            type="submit"
            disabled={verifying || code.length !== 6}
            className="h-12 w-full rounded-full gradient-brand text-sm font-semibold text-white shadow-[0_0_32px_rgba(43,89,255,0.3)] transition-shadow hover:shadow-[0_0_48px_rgba(139,92,246,0.45)]"
          >
            {verifying && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {t("verify")}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
        {t("registerTitle")}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-text-2">
        {t("registerSubtitle")}
      </p>

      <form onSubmit={onSubmit} className="mt-9 space-y-5" noValidate>
        <div className="space-y-2.5">
          <Label htmlFor="reg-name">{t("fullName")}</Label>
          <Input
            id="reg-name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            className="h-11 border-border/60 bg-white/[0.03]"
            {...form.register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive" role="alert">
              {err(errors.name.message)}
            </p>
          )}
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="reg-email">{t("email")}</Label>
          <Input
            id="reg-email"
            type="email"
            dir="ltr"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className="h-11 border-border/60 bg-white/[0.03]"
            {...form.register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive" role="alert">
              {errors.email.message === "inUse" ? t("emailInUse") : err(errors.email.message)}
            </p>
          )}
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="reg-phone">{t("phone")}</Label>
          <Input
            id="reg-phone"
            type="tel"
            dir="ltr"
            autoComplete="tel"
            placeholder="+98 912 000 0000"
            aria-invalid={!!errors.phone}
            className="h-11 border-border/60 bg-white/[0.03]"
            {...form.register("phone")}
          />
          {errors.phone && (
            <p className="text-xs text-destructive" role="alert">
              {err(errors.phone.message)}
            </p>
          )}
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="reg-password">{t("password")}</Label>
          <PasswordInput
            id="reg-password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...form.register("password")}
          />
          <p className="text-xs leading-relaxed text-text-3">{MSG.password}</p>
          {errors.password && (
            <p className="text-xs text-destructive" role="alert">
              {err(errors.password.message)}
            </p>
          )}
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="reg-confirm">{t("confirmPassword")}</Label>
          <PasswordInput
            id="reg-confirm"
            autoComplete="new-password"
            aria-invalid={!!errors.confirm}
            {...form.register("confirm")}
          />
          {errors.confirm && (
            <p className="text-xs text-destructive" role="alert">
              {err(errors.confirm.message)}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-full gradient-brand text-sm font-semibold text-white shadow-[0_0_32px_rgba(43,89,255,0.3)] transition-shadow hover:shadow-[0_0_48px_rgba(139,92,246,0.45)]"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {t("signUp")}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-3">
        {t("haveAccount")}{" "}
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
