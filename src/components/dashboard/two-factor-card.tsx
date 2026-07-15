"use client";

/* eslint-disable @next/next/no-img-element */
import { Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TwoFactorCard({ initiallyEnabled }: { initiallyEnabled: boolean }) {
  const locale = useLocale();
  const fa = locale === "fa";
  const [enabled, setEnabled] = useState(initiallyEnabled);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const begin = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/account/two-factor");
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { qr: string; secret: string };
      setQr(data.qr);
      setSecret(data.secret);
    } catch {
      toast.error(fa ? "شروع فعال‌سازی ناموفق بود." : "Could not start enrollment.");
    } finally {
      setBusy(false);
    }
  };

  const confirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/account/two-factor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        toast.error(
          fa
            ? "کد معتبر نیست. کدها هر ۳۰ ثانیه تغییر می‌کنند."
            : "That code is not valid. Codes rotate every 30 seconds.",
        );
        return;
      }
      setEnabled(true);
      setQr(null);
      setSecret(null);
      setCode("");
      toast.success(
        fa ? "تأیید دومرحله‌ای فعال شد." : "Two-factor authentication enabled.",
      );
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/account/two-factor", { method: "DELETE" });
      if (!res.ok) throw new Error();
      setEnabled(false);
      toast.success(fa ? "تأیید دومرحله‌ای غیرفعال شد." : "Two-factor disabled.");
    } catch {
      toast.error(fa ? "غیرفعال‌سازی ناموفق بود." : "Could not disable.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="gap-5 border-border/70 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold">
            {enabled ? (
              <ShieldCheck className="size-4 text-emerald-500" aria-hidden />
            ) : (
              <ShieldOff className="size-4 text-muted-foreground" aria-hidden />
            )}
            {fa ? "تأیید دومرحله‌ای (TOTP)" : "Two-factor authentication (TOTP)"}
          </p>
          <p className="mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground">
            {fa
              ? "با برنامه‌هایی مانند Google Authenticator یا 1Password، ورود شما به یک کد ۶ رقمی چرخشی نیز نیاز خواهد داشت."
              : "With an app like Google Authenticator or 1Password, signing in will additionally require a rotating 6-digit code."}
          </p>
        </div>
        {enabled ? (
          <Button variant="outline" size="sm" onClick={disable} disabled={busy}>
            {busy && <Loader2 className="size-3.5 animate-spin" aria-hidden />}
            {fa ? "غیرفعال کردن" : "Disable"}
          </Button>
        ) : (
          !qr && (
            <Button
              size="sm"
              onClick={begin}
              disabled={busy}
              className="gradient-brand text-white"
            >
              {busy && <Loader2 className="size-3.5 animate-spin" aria-hidden />}
              {fa ? "فعال‌سازی" : "Enable"}
            </Button>
          )
        )}
      </div>

      {qr && !enabled && (
        <div className="grid gap-6 rounded-2xl border border-border p-5 sm:grid-cols-[auto_1fr]">
          <img
            src={qr}
            alt={fa ? "کد QR فعال‌سازی" : "Enrollment QR code"}
            className="size-44 rounded-xl bg-white p-2"
          />
          <div className="space-y-4">
            <ol className="list-decimal space-y-1.5 ps-4 text-xs leading-relaxed text-muted-foreground">
              <li>
                {fa
                  ? "کد QR را با برنامه احراز هویت خود اسکن کنید."
                  : "Scan the QR code with your authenticator app."}
              </li>
              <li>
                {fa
                  ? "کد ۶ رقمی نمایش‌داده‌شده را وارد کنید."
                  : "Enter the 6-digit code it shows."}
              </li>
            </ol>
            {secret && (
              <p className="break-all font-mono text-[11px] text-muted-foreground" dir="ltr">
                {fa ? "کلید دستی: " : "Manual key: "}
                {secret}
              </p>
            )}
            <form onSubmit={confirm} className="flex gap-2">
              <div className="space-y-1">
                <Label htmlFor="totp-code" className="sr-only">
                  {fa ? "کد تأیید" : "Verification code"}
                </Label>
                <Input
                  id="totp-code"
                  inputMode="numeric"
                  maxLength={6}
                  dir="ltr"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="h-10 w-36 text-center font-mono tracking-[0.3em]"
                  placeholder="000000"
                />
              </div>
              <Button
                type="submit"
                disabled={busy || code.length !== 6}
                className="gradient-brand text-white"
              >
                {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
                {fa ? "تأیید" : "Verify"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}
