"use client";

import { useCallback, useId, useRef } from "react";
import { TradingViewWidget } from "@/components/tradingview/tradingview-widget";

export function PositionChart({
  symbol,
  height = 460,
}: {
  symbol: string;
  height?: number;
}) {
  const containerId = useId().replace(/:/g, "");
  const widgetRef = useRef<unknown | null>(null);

  const handleReady = useCallback((inst: unknown) => {
    widgetRef.current = inst;
  }, []);

  return (
    <div className="relative" data-testid="position-chart-container">
      <TradingViewWidget symbol={symbol} height={height} containerId={containerId} onReady={handleReady} />
    </div>
  );
}

