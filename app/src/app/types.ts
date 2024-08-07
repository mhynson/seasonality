import { HistoricalRowHistory } from "./interfaces";

export type TTimeframeLabel = "weekly" | "monthly";

export type TReduceGroupedPeriods = (
  years: number
) => (
  acc: TSeasonalityAverageEntry[],
  [label, periods]: [string, TSeasonalityEntry[]]
) => TSeasonalityAverageEntry[];

export type TCalculateSeasonality = (
  timeframe: TTimeframeLabel,
  data: HistoricalRowHistory[],
  lookbackYears: number
) => TSeasonalityAverageEntry[];

export type TSeasonalityData = {
  timeframe: TTimeframeLabel;
  results: TSeasonalityAverageEntry[];
  error?: string;
};

export type TSymbolSeasonalityDataView = {
  view: TTimeframeLabel;
  data: TSeasonalityData[];
};

export type TSymbolGroupedData = {
  [symbol: string]: TSymbolSeasonalityDataView;
};

export type TSymbolGroupedTimeframeSeasonality = {
  [symbol: string]: TSeasonalityData[];
};

export type TSeasonalityAverageEntry = {
  label: string;
  averageChange: number;
  averageDrawdown: number;
  averageRange: number;
  changes: TSeasonalityEntry[];
  lowerCloses: number;
  higherCloses: number;
  count: number;
  higherPct: number;
};

export type TSeasonalityEntry = {
  up: boolean;
  change: number;
  open: number;
  high: number;
  low: number;
  close: number;
  range: number;
  date: string;
  drawdown: number;
};

export type Month =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec";

export type TGroupedSeasonalityData = {
  [key in Month | string]: TSeasonalityEntry[];
};
