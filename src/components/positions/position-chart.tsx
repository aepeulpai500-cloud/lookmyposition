"use client";

import { useId, useRef } from "react";
import { TradingViewWidget } from "@/components/tradingview/tradingview-widget";
import type { Position } from "@/lib/types";

export function PositionChart({
  position,
  symbol,
  height = 460,
}: {
  position: Position | null;
  symbol: string;
  height?: number;
}) {
  const containerId = useId().replace(/:/g, "");
  const widgetRef = useRef<any | null>(null);

  return (
    <div className="relative" data-testid="position-chart-container">
      <TradingViewWidget symbol={symbol} height={height} containerId={containerId} onReady={(inst) => {
        widgetRef.current = inst;
      }} />
    </div>
  );
}

