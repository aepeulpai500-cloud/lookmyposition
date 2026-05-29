export type PositionSide = "LONG" | "SHORT";

export type Position = {
  symbol: string;
  side: PositionSide;
  leverage: number;
  entryPrice: number;
  markPrice: number;
  liqPrice: number | null;
  size: number;
  notional: number;
  margin: number;
  unrealizedPnl: number;
  roe: number;
  updatedAt: string;
};

export type PositionsSummary = {
  totalUnrealizedPnl: number;
  totalMargin: number;
  totalNotional: number;
  positionsCount: number;
  winners: number;
  losers: number;
  updatedAt: string;
};

export type PrivatePositionsResponse = {
  summary: PositionsSummary;
  positions: Position[];
};

export type SharePayload = {
  displayName: string;
  title: string;
  summary: PositionsSummary;
  positions: Position[];
  generatedAt: string;
};

export type PrivateSettings = {
  displayName: string;
  shareTitleDefault: string;
  apiKey: string | null;
  apiSecretEncrypted: string | null;
};

