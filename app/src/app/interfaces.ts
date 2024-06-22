import { Month, TSeasonalityAverageEntry } from "./types";

export interface HistoricalRowHistory {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose?: number;
  volume: number;
}

export interface TSeasonalityAverageEntryWithSymbol
  extends TSeasonalityAverageEntry {
  symbol?: string;
}

export interface PercentChangeDataForPeriod {
  date: string;
  label: Month;
  close: number;
  open: number;
  change: number;
}
