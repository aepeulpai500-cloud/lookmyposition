import { Card, CardContent } from "@/components/ui/card";
import type { PositionsSummary } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatMoney, formatNumber, formatIsoTime, pnlTone } from "@/lib/format";

export function SummaryKpis({ summary }: { summary: PositionsSummary }) {
  const tone = pnlTone(summary.totalUnrealizedPnl);
  const pnlClass =
    tone === "positive"
      ? "text-emerald-400"
      : tone === "negative"
        ? "text-rose-400"
        : "text-zinc-200";

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <KpiCard
        label="Total Unrealized PNL"
        value={formatMoney(summary.totalUnrealizedPnl)}
        valueClass={pnlClass}
      />
      <KpiCard label="Total Margin" value={formatMoney(summary.totalMargin)} />
      <KpiCard label="Total Notional" value={formatMoney(summary.totalNotional)} />
      <KpiCard
        label="Positions"
        value={formatNumber(summary.positionsCount, { maximumFractionDigits: 0 })}
        sub={`${summary.winners}W · ${summary.losers}L`}
      />
      <div className="col-span-2 sm:col-span-4">
        <div className="mt-2 text-xs text-muted-foreground">
          마지막 업데이트: <span className="tabular-nums">{formatIsoTime(summary.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  valueClass,
}: {
  label: string;
  value: string;
  sub?: string;
  valueClass?: string;
}) {
  return (
    <Card className="border bg-card/55">
      <CardContent className="p-4">
        <div className="text-[11px] text-muted-foreground">{label}</div>
        <div className={cn("mt-2 text-xl font-semibold tabular-nums tracking-tight", valueClass)}>
          {value}
        </div>
        {sub ? <div className="mt-1 text-xs text-muted-foreground">{sub}</div> : null}
      </CardContent>
    </Card>
  );
}

