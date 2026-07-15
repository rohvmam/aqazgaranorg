import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  hint,
  accent = "blue",
}: {
  label: string;
  value: string;
  /** Percent change vs previous period; sign controls the trend icon */
  delta?: number;
  hint?: string;
  accent?: "blue" | "violet" | "cyan" | "emerald";
}) {
  const ACCENT: Record<string, string> = {
    blue: "from-brand-blue/18",
    violet: "from-brand-violet/18",
    cyan: "from-brand-cyan/18",
    emerald: "from-emerald-500/18",
  };

  return (
    <Card
      className={cn(
        "relative gap-2 overflow-hidden border-border/70 bg-gradient-to-br to-transparent p-5",
        ACCENT[accent],
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="font-mono text-3xl font-semibold tracking-tight tabular">
        {value}
      </p>
      {(delta !== undefined || hint) && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {delta !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-medium",
                delta >= 0 ? "text-emerald-500" : "text-red-500",
              )}
            >
              {delta >= 0 ? (
                <TrendingUp className="size-3.5" aria-hidden />
              ) : (
                <TrendingDown className="size-3.5" aria-hidden />
              )}
              {Math.abs(delta)}%
            </span>
          )}
          {hint}
        </p>
      )}
    </Card>
  );
}
