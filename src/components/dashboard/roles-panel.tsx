"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";

type UserRow = {
  id: string;
  name: string;
  email: string;
  title: string | null;
  twoFactorEnabled: boolean;
  createdAt: string;
  role: { id: string; name: string };
};

type RoleRow = {
  id: string;
  name: string;
  descriptionEn: string;
  descriptionFa: string;
  permissions: { permission: { key: string; labelEn: string; labelFa: string } }[];
};

export function RolesPanel({ currentUserId }: { currentUserId: string }) {
  const locale = useLocale();
  const fa = locale === "fa";
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (res.status === 403) throw new Error("forbidden");
      if (!res.ok) throw new Error("failed");
      return (await res.json()) as { users: UserRow[]; roles: RoleRow[] };
    },
    retry: false,
  });

  const changeRole = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }) => {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, roleId }),
      });
      if (!res.ok) throw new Error("failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(fa ? "نقش به‌روزرسانی شد." : "Role updated.");
    },
    onError: () => toast.error(fa ? "تغییر نقش ناموفق بود." : "Role change failed."),
  });

  if (error?.message === "forbidden") {
    return (
      <Card className="items-center gap-3 border-border/70 p-10 text-center">
        <ShieldCheck className="size-8 text-muted-foreground" aria-hidden />
        <p className="text-sm font-medium">
          {fa ? "این بخش مخصوص مدیران است." : "This section is for administrators."}
        </p>
        <p className="text-xs text-muted-foreground">
          {fa
            ? "برای مدیریت نقش‌ها با یک حساب ADMIN وارد شوید."
            : "Sign in with an ADMIN account to manage roles."}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Role definitions */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        {data?.roles.map((role) => (
          <Card key={role.id} className="gap-3 border-border/70 p-5">
            <Badge variant="secondary" className="w-fit font-mono text-[10px]">
              {role.name}
            </Badge>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {fa ? role.descriptionFa : role.descriptionEn}
            </p>
            <ul className="mt-auto space-y-1">
              {role.permissions.map(({ permission }) => (
                <li key={permission.key} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span aria-hidden className="size-1 rounded-full bg-brand-cyan" />
                  {fa ? permission.labelFa : permission.labelEn}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {/* Users */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {[
                  fa ? "کاربر" : "User",
                  fa ? "سمت" : "Title",
                  fa ? "۲مرحله‌ای" : "2FA",
                  fa ? "عضویت" : "Joined",
                  fa ? "نقش" : "Role",
                ].map((h) => (
                  <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground" dir="ltr">
                      {user.email}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.title ?? "—"}
                  </TableCell>
                  <TableCell>
                    {user.twoFactorEnabled ? (
                      <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                        ON
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(user.createdAt, locale)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role.id}
                      onValueChange={(roleId) =>
                        changeRole.mutate({ userId: user.id, roleId })
                      }
                      disabled={user.id === currentUserId}
                    >
                      <SelectTrigger className="!h-8 w-36 text-xs" aria-label={fa ? "نقش" : "Role"}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {data.roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
