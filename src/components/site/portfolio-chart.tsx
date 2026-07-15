"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatMoney } from "@/lib/format";

const COLORS = ["#2B59FF", "#8B5CF6", "#22D3EE", "#6366F1", "#0EA5E9", "#A78BFA"];

export type AllocationSlice = { name: string; value: number };

/** Donut of portfolio allocation by sector, fed from the investments table. */
export function PortfolioChart({
  data,
  locale,
}: {
  data: AllocationSlice[];
  locale: string;
}) {
  return (
    <div className="h-72 w-full" dir="ltr">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="88%"
            paddingAngle={3}
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#0C1220",
              border: "1px solid rgba(148,163,184,0.2)",
              borderRadius: 12,
              color: "#F4F7FF",
              fontSize: 13,
            }}
            formatter={(value) => formatMoney(Number(value), locale)}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
