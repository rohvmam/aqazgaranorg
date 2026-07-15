"use client";

import { Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";

export function ProfileForm({
  initialName,
  initialTitle,
}: {
  initialName: string;
  initialTitle: string;
}) {
  const locale = useLocale();
  const fa = locale === "fa";
  const [name, setName] = useState(initialName);
  const [title, setTitle] = useState(initialTitle);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busyInfo, setBusyInfo] = useState(false);
  const [busyPass, setBusyPass] = useState(false);

  const saveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusyInfo(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, title }),
      });
      if (!res.ok) throw new Error();
      toast.success(fa ? "پروفایل به‌روزرسانی شد." : "Profile updated.");
    } catch {
      toast.error(fa ? "به‌روزرسانی ناموفق بود." : "Update failed.");
    } finally {
      setBusyInfo(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusyPass(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.status === 400) {
        toast.error(fa ? "رمز فعلی نادرست است." : "Current password is wrong.");
        return;
      }
      if (!res.ok) {
        toast.error(
          fa
            ? "رمز جدید باید دست‌کم ۸ نویسه با یک حرف بزرگ و یک رقم باشد."
            : "New password needs 8+ characters with an uppercase letter and a digit.",
        );
        return;
      }
      toast.success(fa ? "رمز عبور تغییر کرد." : "Password changed.");
      setCurrentPassword("");
      setNewPassword("");
    } finally {
      setBusyPass(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="gap-5 border-border/70 p-6">
        <p className="text-sm font-semibold">
          {fa ? "اطلاعات پایه" : "Basic information"}
        </p>
        <form onSubmit={saveInfo} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-name">{fa ? "نام" : "Name"}</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-title">{fa ? "سمت" : "Job title"}</Label>
            <Input
              id="profile-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={busyInfo} className="gradient-brand text-white">
            {busyInfo && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {fa ? "ذخیره" : "Save"}
          </Button>
        </form>
      </Card>

      <Card className="gap-5 border-border/70 p-6">
        <p className="text-sm font-semibold">
          {fa ? "تغییر رمز عبور" : "Change password"}
        </p>
        <form onSubmit={savePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-current">
              {fa ? "رمز فعلی" : "Current password"}
            </Label>
            <PasswordInput
              id="profile-current"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-new">{fa ? "رمز جدید" : "New password"}</Label>
            <PasswordInput
              id="profile-new"
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={busyPass} variant="outline">
            {busyPass && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {fa ? "تغییر رمز" : "Change password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
