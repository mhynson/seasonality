import { HistoricalRowHistory } from "./interfaces";

export type TTimeframeLabel = "weekly" | "monthly";

export type TReduceGroupedPeriods = (
  acc: TSeasonalityAverageEntry[],
  [label, periods]: [string, TSeasonalityEntry[]]
) => TSeasonalityAverageEntry[];

export type TCalculateSeasonality = (
  timeframe: TTimeframeLabel,
  data: HistoricalRowHistory[]
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
  close: number;
  range: number;
  date: string;
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
