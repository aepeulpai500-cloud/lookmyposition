"use client";

import { useEffect, useMemo, useState } from "react";
import { PrivateTopbar } from "@/components/app/private-topbar";
import { PositionChart } from "@/components/positions/position-chart";
import { SummaryKpis } from "@/components/positions/summary-kpis";
import { PositionCard } from "@/components/positions/position-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useJsonPoll } from "@/hooks/use-json-poll";
import type { PrivatePositionsResponse } from "@/lib/types";

export default function DashboardPage() {
  const positionsPoll = useJsonPoll<PrivatePositionsResponse>("/api/private/positions", {
    intervalMs: 1000,
  });

  const positions = useMemo(() => positionsPoll.data?.positions ?? [], [positionsPoll.data]);
  const summary = useMemo(() => positionsPoll.data?.summary ?? null, [positionsPoll.data]);

  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  useEffect(() => {
    if (!positions.length) return;
    setSelectedSymbol((prev) => (prev && positions.some((p) => p.symbol === prev) ? prev : positions[0]!.symbol));
  }, [positions]);

  const selected = useMemo(
    () => positions.find((p) => p.symbol === selectedSymbol) ?? positions[0] ?? null,
    [positions, selectedSymbol]
  );

  const chartSymbol = selected?.symbol ?? positions[0]?.symbol ?? "BTCUSDT";
  const chartKey = selected ? `${selected.symbol}-${selected.side}-${selected.entryPrice}` : "chart-loading";

  return (
    <div className="space-y-8">
      <PrivateTopbar title="MEXC Positions" />

      {positionsPoll.error ? (
        <div className="rounded-2xl border bg-card/55 p-4 text-sm text-muted-foreground">
          {positionsPoll.error === "HTTP 500"
            ? "MEXC_API_KEY / MEXC_API_SECRET 를 .env(.env.local) 에 넣어주세요."
            : positionsPoll.error}
        </div>
      ) : null}

      {summary ? <SummaryKpis summary={summary} /> : <KpiSkeleton />}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Chart</div>
          <div className="text-xs text-muted-foreground">{selected ? selected.symbol : "BTCUSDT"}</div>
        </div>
        {selected ? (
          <PositionChart key={chartKey} symbol={chartSymbol} height={460} />
        ) : (
          <Skeleton className="h-[460px] rounded-2xl" />
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Open Positions</div>
        </div>
        <div className="grid gap-3">
          {positionsPoll.loading ? (
            <>
              <Skeleton className="h-36 rounded-2xl" />
              <Skeleton className="h-36 rounded-2xl" />
              <Skeleton className="h-36 rounded-2xl" />
            </>
          ) : positions.length ? (
            positions.map((p) => (
              <PositionCard
                key={`${p.symbol}-${p.side}`}
                position={p}
                selected={p.symbol === selectedSymbol}
                onSelect={() => setSelectedSymbol(p.symbol)}
              />
            ))
          ) : (
            <div className="rounded-2xl border bg-card/55 p-6 text-sm text-muted-foreground">
              오픈 포지션이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Skeleton className="h-[92px] rounded-2xl" />
      <Skeleton className="h-[92px] rounded-2xl" />
      <Skeleton className="h-[92px] rounded-2xl" />
      <Skeleton className="h-[92px] rounded-2xl" />
    </div>
  );
}
