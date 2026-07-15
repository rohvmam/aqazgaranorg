"use client";

import { Download, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/* eslint-disable @typescript-eslint/no-explicit-any */
function toCsv(rows: Record<string, any>[]): string {
  if (rows.length === 0) return "";
  const keys = Object.keys(rows[0]).filter(
    (k) => typeof rows[0][k] !== "object" || rows[0][k] === null,
  );
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  };
  return [
    keys.join(","),
    ...rows.map((row) => keys.map((k) => escape(row[k])).join(",")),
  ].join("\n");
}

export function ExportButton({ entity }: { entity: string }) {
  const locale = useLocale();
  const fa = locale === "fa";
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/data/${entity}?take=200`);
      if (!res.ok) throw new Error("failed");
      const { items } = (await res.json()) as { items: Record<string, any>[] };
      const csv = toCsv(items);
      const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ata-${entity}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(fa ? "فایل CSV دانلود شد." : "CSV downloaded.");
    } catch {
      toast.error(fa ? "خروجی گرفتن ناموفق بود." : "Export failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={run} disabled={busy} className="rounded-full">
      {busy ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden />
      ) : (
        <Download className="size-3.5" aria-hidden />
      )}
      CSV
    </Button>
  );
}
