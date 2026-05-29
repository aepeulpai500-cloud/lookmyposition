export function formatNumber(v: number, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    ...opts,
  }).format(v);
}

export function formatMoney(v: number, opts?: Intl.NumberFormatOptions) {
  return formatNumber(v, { maximumFractionDigits: 2, ...opts });
}

export function formatPrice(v: number, digits = 2) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(v);
}

export function formatPct(v: number, digits = 2) {
  return `${formatNumber(v, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })}%`;
}

export function formatIsoTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", {
    hour12: false,
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function pnlTone(v: number) {
  if (v > 0) return "positive";
  if (v < 0) return "negative";
  return "neutral";
}

