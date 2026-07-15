"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_PAGE } from "@/content/pages";
import { loc } from "@/lib/content";

const schema = z.object({
  name: z.string().min(2, "min2"),
  email: z.string().email("email"),
  company: z.string().optional(),
  topic: z.string().min(1, "topic"),
  message: z.string().min(10, "min10"),
});

type FormValues = z.infer<typeof schema>;

const ERRORS: Record<string, { en: string; fa: string }> = {
  min2: { en: "At least 2 characters.", fa: "دست‌کم ۲ نویسه." },
  email: { en: "Enter a valid email.", fa: "ایمیل معتبر وارد کنید." },
  topic: { en: "Choose a topic.", fa: "موضوع را انتخاب کنید." },
  min10: {
    en: "Tell us a little more (10+ characters).",
    fa: "کمی بیشتر توضیح دهید (دست‌کم ۱۰ نویسه).",
  },
};

export function ContactForm({ defaultTopic }: { defaultTopic?: string }) {
  const locale = useLocale();
  const fa = locale === "fa";
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      topic: defaultTopic ?? "",
      message: "",
    },
  });

  const err = (key?: string) =>
    key && ERRORS[key] ? loc(ERRORS[key], locale) : undefined;

  const onSubmit = form.handleSubmit(async (values) => {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      toast.error(
        fa
          ? "ارسال ناموفق بود. دوباره تلاش کنید."
          : "Submission failed. Please try again.",
      );
      return;
    }
    setSubmitted(true);
  });

  if (submitted) {
    return (
      <div className="glass rounded-3xl p-10 text-center" role="status">
        <span
          aria-hidden
          className="mx-auto flex size-14 items-center justify-center rounded-full gradient-brand text-2xl text-white"
        >
          ✓
        </span>
        <h3 className="mt-6 font-heading text-xl font-semibold text-foreground">
          {fa ? "پیام شما رسید." : "Message received."}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-text-2">
          {fa
            ? "یکی از اعضای ارشد تیم ظرف دو روز کاری پاسخ می‌دهد."
            : "A senior member of the team will reply within two business days."}
        </p>
      </div>
    );
  }

  const { errors, isSubmitting } = form.formState;

  return (
    <form onSubmit={onSubmit} className="glass space-y-6 rounded-3xl p-8" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="contact-name">
            {fa ? "نام و نام خانوادگی" : "Full name"}{" "}
            <span className="text-brand-cyan" aria-hidden>*</span>
          </Label>
          <Input
            id="contact-name"
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
          <Label htmlFor="contact-email">
            {fa ? "ایمیل" : "Email"}{" "}
            <span className="text-brand-cyan" aria-hidden>*</span>
          </Label>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            dir="ltr"
            aria-invalid={!!errors.email}
            className="h-11 border-border/60 bg-white/[0.03]"
            {...form.register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive" role="alert">
              {err(errors.email.message)}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="contact-company">
            {fa ? "شرکت (اختیاری)" : "Company (optional)"}
          </Label>
          <Input
            id="contact-company"
            autoComplete="organization"
            className="h-11 border-border/60 bg-white/[0.03]"
            {...form.register("company")}
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="contact-topic">
            {fa ? "موضوع" : "Topic"}{" "}
            <span className="text-brand-cyan" aria-hidden>*</span>
          </Label>
          <Select
            value={form.watch("topic")}
            onValueChange={(v) =>
              form.setValue("topic", v, { shouldValidate: true })
            }
          >
            <SelectTrigger
              id="contact-topic"
              aria-invalid={!!errors.topic}
              className="!h-11 w-full border-border/60 bg-white/[0.03]"
            >
              <SelectValue placeholder={fa ? "انتخاب کنید" : "Select one"} />
            </SelectTrigger>
            <SelectContent>
              {CONTACT_PAGE.topics.map((topic) => (
                <SelectItem key={topic.value} value={topic.value}>
                  {loc(topic.label, locale)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.topic && (
            <p className="text-xs text-destructive" role="alert">
              {err(errors.topic.message)}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="contact-message">
          {fa ? "پیام" : "Message"}{" "}
          <span className="text-brand-cyan" aria-hidden>*</span>
        </Label>
        <Textarea
          id="contact-message"
          rows={6}
          aria-invalid={!!errors.message}
          className="border-border/60 bg-white/[0.03]"
          placeholder={
            fa
              ? "چه چیزی را می‌خواهید به حرکت درآورید؟"
              : "What do you want to move?"
          }
          {...form.register("message")}
        />
        {errors.message && (
          <p className="text-xs text-destructive" role="alert">
            {err(errors.message.message)}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-full gradient-brand text-sm font-semibold text-white shadow-[0_0_32px_rgba(43,89,255,0.3)] transition-shadow hover:shadow-[0_0_48px_rgba(139,92,246,0.45)]"
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Send className="size-4 rtl:-scale-x-100" aria-hidden />
        )}
        {fa ? "ارسال پیام" : "Send message"}
      </Button>
    </form>
  );
}
