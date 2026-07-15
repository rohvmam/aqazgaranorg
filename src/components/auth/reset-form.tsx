"use client";

import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";
import { useRouter } from "@/i18n/navigation";

export function ResetForm({ token }: { token: string }) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const fa = locale === "fa";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError(fa ? "رمزها یکسان نیستند." : "Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/account/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        setError(
          fa
            ? "پیوند نامعتبر یا منقضی است. دوباره درخواست دهید."
            : "This link is invalid or expired. Request a new one.",
        );
        return;
      }
      toast.success(
        fa ? "رمز عبور به‌روزرسانی شد." : "Password updated. Sign in now.",
      );
      router.push("/login");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
        {t("forgotTitle")}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-text-2">
        {fa ? "رمز عبور جدید را وارد کنید." : "Choose a new password."}
      </p>

      <form onSubmit={onSubmit} className="mt-9 space-y-5">
        <div className="space-y-2.5">
          <Label htmlFor="reset-password">{t("password")}</Label>
          <PasswordInput
            id="reset-password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs leading-relaxed text-text-3">
            {fa
              ? "دست‌کم ۸ نویسه، شامل یک حرف بزرگ و یک رقم."
              : "At least 8 characters with one uppercase letter and one digit."}
          </p>
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="reset-confirm">{t("confirmPassword")}</Label>
          <PasswordInput
            id="reset-confirm"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button
          type="submit"
          disabled={busy}
          className="h-12 w-full rounded-full gradient-brand text-sm font-semibold text-white shadow-[0_0_32px_rgba(43,89,255,0.3)]"
        >
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {fa ? "ذخیره رمز جدید" : "Save new password"}
        </Button>
      </form>
    </div>
  );
}
