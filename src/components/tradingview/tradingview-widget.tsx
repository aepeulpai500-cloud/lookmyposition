"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import { toTradingViewSymbol } from "@/lib/tradingview";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    TradingView?: {
      widget: new (options: Record<string, unknown>) => unknown;
    };
  }
}

let tradingViewScriptPromise: Promise<void> | null = null;

function loadTradingViewScript() {
  if (typeof document === "undefined") return Promise.resolve();
  if (window.TradingView?.widget) return Promise.resolve();

  const id = "tradingview-widget-script";
  const existing = document.getElementById(id) as HTMLScriptElement | null;

  if (existing) {
    if ((existing as any).dataset?.loaded === "true") {
      return Promise.resolve();
    }
    return tradingViewScriptPromise ?? new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("TradingView script failed to load.")));
    });
  }

  const s = document.createElement("script");
  s.id = id;
  s.src = "https://s3.tradingview.com/tv.js";
  s.async = true;

  tradingViewScriptPromise = new Promise((resolve, reject) => {
    s.onload = () => {
      s.dataset.loaded = "true";
      resolve();
    };
    s.onerror = () => reject(new Error("TradingView script failed to load."));
  });

  document.head.appendChild(s);
  return tradingViewScriptPromise;
}

function waitForTradingViewWidget(timeout = 8000) {
  return new Promise<new (options: Record<string, unknown>) => unknown>((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      const widget = window.TradingView?.widget;
      if (typeof widget === "function") {
        resolve(widget);
        return;
      }
      if (Date.now() - start > timeout) {
        reject(new Error("TradingView widget did not become available."));
        return;
      }
      window.setTimeout(tick, 120);
    };
    tick();
  });
}

export function TradingViewWidget({
  symbol,
  className,
  height = 420,
  disableInteractions = false,
  containerId: containerIdProp,
  onReady,
}: {
  symbol: string;
  height?: number;
  className?: string;
  disableInteractions?: boolean;
  containerId?: string;
  onReady?: (inst: any, containerId: string) => void;
}) {
  const generatedId = useId().replace(/:/g, "");
  const containerId = containerIdProp ?? generatedId;
  const hostRef = useRef<HTMLDivElement | null>(null);
  const tvSymbol = useMemo(() => toTradingViewSymbol(symbol), [symbol]);

  useEffect(() => {
    let cancelled = false;
    const el = document.getElementById(containerId);
    if (!el) return;

    loadTradingViewScript()
      .then(() => waitForTradingViewWidget())
      .then((widget) => {
        if (cancelled) return;
        el.innerHTML = "";
        // instantiate widget and expose instance for sync
        const inst = new (widget as any)({
          autosize: true,
          symbol: tvSymbol,
          interval: "15",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          hide_legend: true,
          allow_symbol_change: false,
          container_id: containerId,
        });

        try {
          (window as any).__TV_WIDGETS__ = (window as any).__TV_WIDGETS__ || {};
          (window as any).__TV_WIDGETS__[containerId] = inst;
        } catch (e) {
          // ignore
        }

        try {
          onReady?.(inst, containerId);
        } catch (e) {
          // ignore
        }
      })
      .catch(() => {
        // TradingView failed to initialize; suppress console noise.
      });

    return () => {
      cancelled = true;
    };
  }, [containerId, tvSymbol]);

  return (
    <div
      ref={hostRef}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card/70 shadow-[0_0_0_1px_oklch(1_0_0/0.05),0_18px_60px_-32px_oklch(0_0_0/0.8)]",
        className
      )}
      style={{ height }}
    >
      {disableInteractions ? (
        <div className="absolute inset-0 z-20" style={{ background: "transparent" }} />
      ) : null}
      <div className="absolute inset-0 opacity-60 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)] bg-[radial-gradient(circle_at_top,oklch(0.77_0.17_165/0.18),transparent_65%)]" />
      <div className="relative h-full w-full">
        <div id={containerId} className="h-full w-full" />
      </div>
    </div>
  );
}
