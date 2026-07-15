"use client";

import { useLocale } from "next-intl";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { formatMoney, formatNumber } from "@/lib/format";

const PALETTE = ["#2B59FF", "#8B5CF6", "#22D3EE", "#6366F1", "#0EA5E9", "#A78BFA"];

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "var(--popover-foreground)",
  fontSize: 12,
};

export type MonthlyFlow = { month: string; income: number; expense: number };

export function CashflowChart({
  data,
  title,
}: {
  data: MonthlyFlow[];
  title: string;
}) {
  const locale = useLocale();
  return (
    <Card className="gap-4 border-border/70 p-5">
      <p className="text-sm font-semibold">{title}</p>
      <div className="h-64" dir="ltr">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ left: 8, right: 8, top: 4 }}>
            <defs>
              <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2B59FF" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#2B59FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
              width={48}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => formatMoney(Number(value), locale)}
            />
            <Area type="monotone" dataKey="income" stroke="#2B59FF" strokeWidth={2} fill="url(#inc)" />
            <Area type="monotone" dataKey="expense" stroke="#8B5CF6" strokeWidth={2} fill="url(#exp)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export type NamedValue = { name: string; value: number };

export function CategoryBarChart({
  data,
  title,
  money,
}: {
  data: NamedValue[];
  title: string;
  money?: boolean;
}) {
  const locale = useLocale();
  return (
    <Card className="gap-4 border-border/70 p-5">
      <p className="text-sm font-semibold">{title}</p>
      <div className="h-64" dir="ltr">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ left: 8, right: 8, top: 4 }}>
            <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} interval={0} />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => (money ? `$${Math.round(v / 1000)}k` : formatNumber(v, locale))}
              width={52}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: "var(--muted)" }}
              formatter={(value) =>
                money ? formatMoney(Number(value), locale) : formatNumber(Number(value), locale)
              }
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function DonutChart({
  data,
  title,
}: {
  data: NamedValue[];
  title: string;
}) {
  const locale = useLocale();
  return (
    <Card className="gap-4 border-border/70 p-5">
      <p className="text-sm font-semibold">{title}</p>
      <div className="h-64" dir="ltr">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="58%"
              outerRadius="85%"
              paddingAngle={3}
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => formatNumber(Number(value), locale)}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span aria-hidden className="size-2 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
            {d.name}
          </li>
        ))}
      </ul>
    </Card>
  );
}
