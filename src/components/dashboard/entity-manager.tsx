"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type {
  ColumnDef,
  EntityManagerConfig,
  FieldDef,
} from "@/components/dashboard/entity-types";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

const PAGE_SIZE = 15;

const BADGE_TONE: Record<string, string> = {
  // positive
  ACTIVE: "emerald", LIVE: "emerald", PAID: "emerald", DONE: "emerald",
  DELIVERED: "emerald", CLOSED_WON: "emerald", COMPLETED: "emerald",
  SUCCESS: "emerald", RESPONDED: "emerald",
  // in-motion
  NEGOTIATION: "cyan", REVIEW: "cyan", IN_PROGRESS: "cyan", QUOTED: "cyan",
  SENT: "cyan", BETA: "cyan", IN_REVIEW: "cyan", IN_TRANSIT: "cyan",
  GROWTH: "cyan", CONTRACT: "cyan",
  // attention
  ON_HOLD: "amber", PAUSED: "amber", HOLD: "amber", OVERDUE: "amber",
  URGENT: "amber", ALERT: "amber", HIGH: "amber", WARNING: "amber",
  // negative / closed
  INACTIVE: "red", CANCELLED: "red", CLOSED_LOST: "red", VOID: "red",
  EXITED: "red", ARCHIVED: "red", SOLD_OUT: "red",
};

const TONE_CLASS: Record<string, string> = {
  emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  cyan: "border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  red: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
  neutral: "border-border bg-muted text-muted-foreground",
};

function cellValue(row: Row, col: ColumnDef, locale: string): React.ReactNode {
  const fa = locale === "fa";
  const raw = col.localePair ? row[`${col.key}${fa ? "Fa" : "En"}`] : row[col.key];

  switch (col.type) {
    case "money":
      return (
        <span className="font-mono tabular">
          {formatMoney(Number(raw ?? 0), locale, row.currency ?? "USD")}
        </span>
      );
    case "number":
      return <span className="font-mono tabular">{formatNumber(Number(raw ?? 0), locale)}</span>;
    case "percent":
      return <span className="font-mono tabular">{formatNumber(Number(raw ?? 0), locale)}%</span>;
    case "date":
      return raw ? formatDate(raw, locale) : "—";
    case "boolean":
      return raw ? "✓" : "—";
    case "badge": {
      const tone = TONE_CLASS[BADGE_TONE[String(raw)] ?? "neutral"];
      return (
        <Badge variant="outline" className={cn("font-mono text-[10px] tracking-wide", tone)}>
          {String(raw ?? "—").replaceAll("_", " ")}
        </Badge>
      );
    }
    case "relation": {
      const obj = row[col.key];
      if (!obj) return "—";
      return fa
        ? obj.nameFa ?? obj.titleFa ?? obj.name ?? "—"
        : obj.nameEn ?? obj.titleEn ?? obj.name ?? "—";
    }
    default:
      return raw == null || raw === "" ? "—" : String(raw);
  }
}

function toFormDefaults(fields: FieldDef[], row?: Row): Row {
  const defaults: Row = {};
  for (const field of fields) {
    const value = row?.[field.name];
    if (field.type === "date") {
      defaults[field.name] = value ? String(value).slice(0, 10) : "";
    } else if (field.type === "switch") {
      defaults[field.name] = Boolean(value);
    } else {
      defaults[field.name] = value ?? "";
    }
  }
  return defaults;
}

function toPayload(fields: FieldDef[], values: Row): Row {
  const payload: Row = {};
  for (const field of fields) {
    let value = values[field.name];
    if (field.type === "number") value = value === "" ? 0 : Number(value);
    if (field.type === "date") {
      if (!value) {
        if (!field.required) continue;
      }
      payload[field.name] = value;
      continue;
    }
    if (value === "" && !field.required) continue;
    payload[field.name] = value;
  }
  return payload;
}

/** Select whose options come from another entity's records. */
function RemoteSelect({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
}) {
  const locale = useLocale();
  const fa = locale === "fa";
  const source = field.optionsFrom!;
  const { data } = useQuery({
    queryKey: ["entity-options", source.entity],
    queryFn: async () => {
      const res = await fetch(`/api/data/${source.entity}?take=200`);
      if (!res.ok) throw new Error("load failed");
      return (await res.json()) as { items: Row[] };
    },
    staleTime: 60_000,
  });

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={fa ? field.labelFa : field.labelEn} />
      </SelectTrigger>
      <SelectContent>
        {(data?.items ?? []).map((row) => (
          <SelectItem key={row.id} value={row.id}>
            {fa
              ? row[`${source.labelBase}Fa`] ?? row[source.labelBase]
              : row[`${source.labelBase}En`] ?? row[source.labelBase]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function EntityManager({
  entity,
  columns,
  fields,
  readOnly,
  noCreate,
}: EntityManagerConfig) {
  const locale = useLocale();
  const t = useTranslations("dash");
  const common = useTranslations("common");
  const fa = locale === "fa";
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Row | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setQ(search);
      setPage(0);
    }, 350);
    return () => clearTimeout(id);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ["entity", entity, q, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        take: String(PAGE_SIZE),
        skip: String(page * PAGE_SIZE),
      });
      if (q) params.set("q", q);
      const res = await fetch(`/api/data/${entity}?${params}`);
      if (!res.ok) throw new Error("load failed");
      return (await res.json()) as { items: Row[]; total: number };
    },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["entity", entity] });

  const saveMutation = useMutation({
    mutationFn: async ({ id, payload }: { id?: string; payload: Row }) => {
      const res = await fetch(id ? `/api/data/${entity}/${id}` : `/api/data/${entity}`, {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(res.status === 403 ? "forbidden" : body.error ?? "failed");
      }
      return res.json();
    },
    onSuccess: () => {
      invalidate();
      setEditing(null);
      setCreating(false);
      toast.success(fa ? "ذخیره شد." : "Saved.");
    },
    onError: (error) => {
      toast.error(
        error.message === "forbidden"
          ? fa
            ? "دسترسی شما برای این عملیات کافی نیست."
            : "Your role does not allow this action."
          : fa
            ? "ذخیره ناموفق بود. ورودی‌ها را بررسی کنید."
            : "Save failed. Check the inputs.",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/data/${entity}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(res.status === 403 ? "forbidden" : "failed");
    },
    onSuccess: () => {
      invalidate();
      setDeleting(null);
      toast.success(fa ? "حذف شد." : "Deleted.");
    },
    onError: (error) => {
      toast.error(
        error.message === "forbidden"
          ? fa
            ? "دسترسی شما برای حذف کافی نیست."
            : "Your role does not allow deleting."
          : common("error"),
      );
    },
  });

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52 max-w-sm">
          <Search className="absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={common("search")}
            aria-label={common("search")}
            className="h-10 rounded-full ps-10"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {t("total")}:{" "}
          <span className="font-mono tabular">{formatNumber(data?.total ?? 0, locale)}</span>
        </p>
        {!readOnly && !noCreate && (
          <Button
            onClick={() => setCreating(true)}
            className="ms-auto h-10 rounded-full gradient-brand px-5 text-xs font-semibold text-white"
          >
            <Plus className="size-4" aria-hidden />
            {t("newItem")}
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {columns.map((col) => (
                  <TableHead key={col.key} className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {fa ? col.labelFa : col.labelEn}
                  </TableHead>
                ))}
                {!readOnly && <TableHead className="w-12" aria-label={t("actions")} />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={`s-${i}`}>
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    ))}
                    {!readOnly && <TableCell />}
                  </TableRow>
                ))}

              {!isLoading && (data?.items.length ?? 0) === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (readOnly ? 0 : 1)}
                    className="py-16 text-center"
                  >
                    <p className="font-medium text-foreground">{t("emptyTitle")}</p>
                    {!readOnly && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {fa ? "با دکمه «جدید» نخستین مورد را بسازید." : "Create the first one with the New button."}
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              )}

              {data?.items.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className="max-w-64 truncate text-sm">
                      {cellValue(row, col, locale)}
                    </TableCell>
                  ))}
                  {!readOnly && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8" aria-label={t("actions")}>
                            <MoreHorizontal className="size-4" aria-hidden />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditing(row)}>
                            <Pencil className="size-4" aria-hidden />
                            {common("edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onClick={() => setDeleting(row)}>
                            <Trash2 className="size-4" aria-hidden />
                            {common("delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
            <p className="text-xs text-muted-foreground tabular">
              {page + 1} / {totalPages}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                {fa ? "قبلی" : "Previous"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                {fa ? "بعدی" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {(creating || editing) && (
        <EntityFormDialog
          fields={fields}
          row={editing ?? undefined}
          pending={saveMutation.isPending}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSubmit={(values) =>
            saveMutation.mutate({
              id: editing?.id,
              payload: toPayload(fields, values),
            })
          }
        />
      )}

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {fa ? "حذف این مورد؟" : "Delete this record?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {fa
                ? "این عملیات قابل بازگشت نیست."
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{common("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => deleting && deleteMutation.mutate(deleting.id)}
            >
              {deleteMutation.isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
              {common("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EntityFormDialog({
  fields,
  row,
  pending,
  onClose,
  onSubmit,
}: {
  fields: FieldDef[];
  row?: Row;
  pending: boolean;
  onClose: () => void;
  onSubmit: (values: Row) => void;
}) {
  const locale = useLocale();
  const common = useTranslations("common");
  const fa = locale === "fa";

  const defaults = useMemo(() => toFormDefaults(fields, row), [fields, row]);
  const form = useForm<Row>({ defaultValues: defaults });

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {row ? common("edit") : common("create")}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-5 sm:grid-cols-2"
        >
          {fields.map((field) => {
            const label = fa ? field.labelFa : field.labelEn;
            const id = `f-${field.name}`;
            return (
              <div
                key={field.name}
                className={cn("space-y-2", (field.wide || field.type === "textarea") && "sm:col-span-2")}
              >
                {field.type !== "switch" ? (
                  <Label htmlFor={id}>
                    {label}
                    {field.required && (
                      <span className="text-brand-cyan" aria-hidden> *</span>
                    )}
                  </Label>
                ) : null}

                {field.type === "textarea" ? (
                  <Textarea id={id} rows={4} {...form.register(field.name)} />
                ) : field.optionsFrom ? (
                  <RemoteSelect
                    field={field}
                    value={String(form.watch(field.name) ?? "")}
                    onChange={(v) => form.setValue(field.name, v)}
                  />
                ) : field.type === "select" ? (
                  <Select
                    value={String(form.watch(field.name) ?? "")}
                    onValueChange={(v) => form.setValue(field.name, v)}
                  >
                    <SelectTrigger id={id} className="w-full">
                      <SelectValue placeholder={label} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {fa ? opt.labelFa : opt.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "switch" ? (
                  <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                    <Label htmlFor={id} className="cursor-pointer">{label}</Label>
                    <Switch
                      id={id}
                      checked={Boolean(form.watch(field.name))}
                      onCheckedChange={(v) => form.setValue(field.name, v)}
                    />
                  </div>
                ) : (
                  <Input
                    id={id}
                    type={field.type}
                    step={field.type === "number" ? "any" : undefined}
                    dir={field.ltr ? "ltr" : undefined}
                    required={field.required}
                    {...form.register(field.name)}
                  />
                )}
              </div>
            );
          })}

          <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {common("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="gradient-brand text-white"
            >
              {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
              {common("save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
