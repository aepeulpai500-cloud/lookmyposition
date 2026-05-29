export function toTradingViewSymbol(symbol: string) {
  const cleaned = symbol.toUpperCase().replace(/[^A-Z0-9:]/g, "");
  if (cleaned.includes(":")) return cleaned;
  return `BINANCE:${cleaned}`;
}

