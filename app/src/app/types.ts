import { HistoricalRowHistory } from "./interfaces";

export type TReduceGroupedPeriods = (
  acc: TSeasonalityAverageEntry[],
  [label, periods]: [string, TSeasonalityEntry[]]
) => TSeasonalityAverageEntry[];

export type TCalculateSeasonality = (
  timeframe: "monthly" | "weekly",
  data: HistoricalRowHistory[]
) => TSeasonalityAverageEntry[];

export type TSeasonalityData = {
  timeframe: "weekly" | "monthly";
  results: TSeasonalityAverageEntry[];
  error?: string;
};

export type TSymbolSeasonalityDataView = {
  view: "monthly" | "weekly";
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
