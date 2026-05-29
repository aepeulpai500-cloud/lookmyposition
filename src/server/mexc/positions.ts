import type { Position, PositionsSummary, PrivatePositionsResponse } from "@/lib/types";
import { mexcPublicGet, mexcSignedGet } from "./client";

type MexcResponse<T> = {
  success: boolean;
  code: number;
  data: T;
  message?: string;
};

type MexcOpenPosition = {
  symbol: string;
  positionType: 1 | 2;
  leverage: number;
  holdAvgPrice: number;
  holdVol: number;
  liquidatePrice?: number;
  im: number;
  updateTime?: number;
  state?: number;
};

type MexcContractDetail = {
  symbol: string;
  contractSize: number;
};

type MexcTicker = {
  symbol: string;
  fairPrice?: number;
  lastPrice?: number;
};

function nowIso() {
  return new Date().toISOString();
}

function normalizeSymbol(s: string) {
  return s.replaceAll("_", "");
}

function summaryFromPositions(positions: Position[]): PositionsSummary {
  const updatedAt = nowIso();
  const totalUnrealizedPnl = positions.reduce((a, p) => a + p.unrealizedPnl, 0);
  const totalMargin = positions.reduce((a, p) => a + p.margin, 0);
  const totalNotional = positions.reduce((a, p) => a + p.notional, 0);
  const winners = positions.filter((p) => p.unrealizedPnl > 0).length;
  const losers = positions.filter((p) => p.unrealizedPnl < 0).length;

  return {
    totalUnrealizedPnl,
    totalMargin,
    totalNotional,
    positionsCount: positions.length,
    winners,
    losers,
    updatedAt,
  };
}

async function fetchContractSize(symbol: string) {
  const res = await mexcPublicGet<MexcResponse<MexcContractDetail>>("/api/v1/contract/detail/country", {
    symbol,
  });
  if (!res.success) throw new Error(res.message ?? "MEXC contract detail error");
  return Number(res.data.contractSize) || 1;
}

async function fetchTicker(symbol: string): Promise<MexcTicker | null> {
  const try1 = async () =>
    mexcPublicGet<MexcResponse<MexcTicker>>(`/api/v1/contract/ticker/${symbol}`).then((r) =>
      r.success ? r.data : null
    );
  const try2 = async () =>
    mexcPublicGet<MexcResponse<MexcTicker>>("/api/v1/contract/ticker", { symbol }).then((r) =>
      r.success ? r.data : null
    );

  try {
    return await try1();
  } catch {
    try {
      return await try2();
    } catch {
      return null;
    }
  }
}

export async function fetchPrivatePositions(): Promise<PrivatePositionsResponse> {
  const apiKey = process.env.MEXC_API_KEY?.trim() || null;
  const apiSecret = process.env.MEXC_API_SECRET?.trim() || null;

  if (!apiKey || !apiSecret) {
    throw new Error("환경변수 MEXC_API_KEY / MEXC_API_SECRET 이(가) 필요합니다.");
  }

  const openPositions = await mexcSignedGet<MexcResponse<MexcOpenPosition[]>>(
    { apiKey, apiSecret },
    "/api/v1/private/position/open_positions"
  );

  if (!openPositions.success) {
    throw new Error(openPositions.message ?? "MEXC open positions error");
  }

  const sizes = new Map<string, number>();
  const tickers = new Map<string, MexcTicker | null>();

  const positions: Position[] = [];

  for (const p of openPositions.data) {
    if (typeof p.state === "number" && p.state !== 1) continue;
    if (!p.symbol) continue;

    let contractSize = sizes.get(p.symbol);
    if (!contractSize) {
      contractSize = await fetchContractSize(p.symbol).catch(() => 1);
      sizes.set(p.symbol, contractSize);
    }

    let ticker = tickers.get(p.symbol);
    if (typeof ticker === "undefined") {
      ticker = await fetchTicker(p.symbol);
      tickers.set(p.symbol, ticker);
    }

    const entryPrice = Number(p.holdAvgPrice) || 0;
    const markPrice = Number(ticker?.fairPrice ?? ticker?.lastPrice ?? entryPrice) || entryPrice;
    const side = p.positionType === 1 ? "LONG" : "SHORT";

    const size = (Number(p.holdVol) || 0) * contractSize;
    const notional = markPrice * size;
    const margin = Number(p.im) || 0;

    const liq = Number(p.liquidatePrice ?? 0);
    const liqPrice = liq > 0 ? liq : null;

    const diff = side === "LONG" ? markPrice - entryPrice : entryPrice - markPrice;
    const unrealizedPnl = diff * size;
    const roe = margin === 0 ? 0 : (unrealizedPnl / margin) * 100;

    const updatedAt = p.updateTime ? new Date(p.updateTime).toISOString() : nowIso();

    positions.push({
      symbol: normalizeSymbol(p.symbol),
      side,
      leverage: Number(p.leverage) || 0,
      entryPrice,
      markPrice,
      liqPrice,
      size,
      notional,
      margin,
      unrealizedPnl,
      roe,
      updatedAt,
    });
  }

  return { summary: summaryFromPositions(positions), positions };
}
