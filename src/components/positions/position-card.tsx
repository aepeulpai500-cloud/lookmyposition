import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Position } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatMoney, formatPct, formatPrice, pnlTone } from "@/lib/format";

export function PositionCard({
  position,
  selected,
  onSelect,
}: {
  position: Position;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const tone = pnlTone(position.unrealizedPnl);
  const pnlClass =
    tone === "positive"
      ? "text-emerald-400"
      : tone === "negative"
        ? "text-rose-400"
        : "text-zinc-200";

  const sideClass =
    position.side === "LONG"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/25"
      : "bg-rose-500/15 text-rose-300 border-rose-500/25";

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border bg-card/60 transition-all hover:bg-card/75 hover:shadow-[0_18px_60px_-32px_oklch(0_0_0/0.9)]",
        selected ? "ring-1 ring-primary/40" : "ring-0",
        onSelect ? "cursor-pointer" : ""
      )}
      onClick={onSelect}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100",
          position.side === "LONG"
            ? "bg-[radial-gradient(circle_at_top,oklch(0.77_0.17_165/0.16),transparent_55%)]"
            : "bg-[radial-gradient(circle_at_top,oklch(0.73_0.2_15/0.14),transparent_55%)]"
        )}
      />
      <CardHeader className="relative flex-row items-start justify-between gap-3 space-y-0 pb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-semibold tracking-tight">{position.symbol}</div>
            <Badge variant="outline" className={cn("h-6", sideClass)}>
              {position.side}
            </Badge>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {position.leverage}x · Size {formatNumberCompact(position.size)}
          </div>
        </div>
        <div className={cn("text-right", pnlClass)}>
          <div className="text-xl font-semibold tabular-nums">{formatMoney(position.unrealizedPnl)}</div>
          <div className="text-xs tabular-nums text-muted-foreground">
            ROE {formatPct(position.roe)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative grid grid-cols-2 gap-3 pb-5">
        <Metric label="Entry" value={formatPrice(position.entryPrice, priceDigits(position.entryPrice))} />
        <Metric
          label="Mark"
          value={formatPrice(position.markPrice, priceDigits(position.markPrice))}
          valueClass={pnlClass}
        />
        <Metric
          label="Liq"
          value={position.liqPrice ? formatPrice(position.liqPrice, priceDigits(position.liqPrice)) : "—"}
        />
        <Metric label="Margin" value={formatMoney(position.margin)} />
      </CardContent>
    </Card>
  );
}

function Metric({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl border bg-background/40 px-3 py-2">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={cn("mt-0.5 text-sm font-medium tabular-nums tracking-tight", valueClass)}>
        {value}
      </div>
    </div>
  );
}

function priceDigits(v: number) {
  if (v >= 1000) return 2;
  if (v >= 10) return 3;
  return 4;
}

function formatNumberCompact(v: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 3 }).format(v);
}

