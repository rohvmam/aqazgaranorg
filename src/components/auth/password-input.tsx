"use client";

import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { forwardRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const PasswordInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(function PasswordInput({ className, ...props }, ref) {
  const [show, setShow] = useState(false);
  const t = useTranslations("auth");

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={show ? "text" : "password"}
        dir="ltr"
        className={cn("h-11 border-border/60 bg-white/[0.03] pe-11", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? t("hidePassword") : t("showPassword")}
        className="absolute end-0 top-0 flex h-11 w-11 items-center justify-center text-text-3 transition-colors hover:text-foreground"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
});
