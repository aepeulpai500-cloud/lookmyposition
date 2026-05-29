"use client";

import { useEffect, useRef, useState } from "react";

export function useJsonPoll<T>(
  url: string,
  {
    intervalMs,
    enabled = true,
    initial,
  }: { intervalMs?: number; enabled?: boolean; initial?: T }
) {
  const [data, setData] = useState<T | undefined>(initial);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(!initial);
  const dataRef = useRef<T | undefined>(initial);
  const abortRef = useRef<AbortController | null>(null);
  const runRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let mounted = true;

    const run = async () => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      try {
        if (dataRef.current === undefined) setLoading(true);
        const res = await fetch(url, {
          method: "GET",
          cache: "no-store",
          signal: ac.signal,
          headers: { "cache-control": "no-store" },
        });
        if (!res.ok) {
          const errJson = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(errJson?.error ? String(errJson.error) : `HTTP ${res.status}`);
        }
        const json = (await res.json()) as T;
        if (!mounted) return;
        dataRef.current = json;
        setData(json);
        setError(null);
        setLoading(false);
      } catch (e) {
        if (!mounted) return;
        if ((e as { name?: string }).name === "AbortError") return;
        setError((e as Error).message ?? "Fetch error");
        setLoading(false);
      }
    };

    runRef.current = run;
    run();
    const t = intervalMs && intervalMs > 0 ? window.setInterval(run, intervalMs) : null;
    return () => {
      mounted = false;
      if (t !== null) window.clearInterval(t);
      abortRef.current?.abort();
    };
  }, [url, intervalMs, enabled]);

  const refresh = async () => {
    await runRef.current?.();
  };

  return { data, error, loading, refresh };
}
