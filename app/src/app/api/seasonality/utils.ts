interface HistoricalRowHistory {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose?: number;
  volume: number;
}

export interface SeasonalityAverageEntry {
  label?: string;
  averageChange: number;
  averageRange: number;
  changes: PercentChangeDataForPeriod[];
  lowerCloses: number;
  higherCloses: number;
  count: number;
  higherPct: number;
}

interface SeasonalityAverages {
  [key: string]: SeasonalityAverageEntry;
}

interface PercentChangeDataForPeriod {
  date: string;
  label: Month;
  close: number;
  open: number;
  change: number;
}

interface SeasonalityEntry {
  up: boolean;
  change: number;
  open: number;
  close: number;
  range: number;
  date: string;
}

type Month =
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

type SeasonalityData = {
  [key in Month | string]: SeasonalityEntry[];
};

export const formatDate = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getWeekNumber = (date: Date): number => {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const diff =
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) -
    start.getTime();
  const oneDay = 86400000;
  return Math.floor(diff / oneDay / 7);
};

export const getPeriodLabelFromDate = (
  timeframe: "monthly" | "weekly",
  date: Date
): string => {
  if (timeframe === "weekly") return getWeekNumber(date).toString();

  if (timeframe === "monthly") {
    return date.toLocaleDateString("default", {
      month: "short",
      timeZone: "UTC",
    });
  }

  return date.toISOString();
};

export const getStartOfWeek = (weekNumber: number | string) => {
  const week = parseFloat(`${weekNumber}`);
  const currentYear = new Date().getFullYear();
  const startDay = new Date(currentYear, 0, 1).getDay();
  const offset = startDay <= 4 ? startDay : startDay - 7;
  return formatDate(new Date(currentYear, 0, 1 + week * 7 - offset + 1));
};

export const sum = (total: number, current: number) => total + current;

export const calculateSeasonality = (
  timeframe: "monthly" | "weekly",
  data: HistoricalRowHistory[]
): SeasonalityAverageEntry[] => {
  const groupedPeriods = data
    .map(({ open, high, low, close, date }) => ({
      label: getPeriodLabelFromDate(timeframe, new Date(date)),
      date,
      open,
      close,
      range: Math.abs(high - low),
      change: (close - open) / open,
    }))
    .reduce<SeasonalityData>((acc, data) => {
      const { label, change, range, date, open, close } = data;

      const entry: SeasonalityEntry = {
        up: change * 100 >= 0,
        change,
        open,
        close,
        range,
        date: date.toISOString(),
      };

      return {
        ...acc,
        [label]: acc[label] ? [...acc[label], entry] : [entry],
      };
    }, {});

  // Calculate seasonality averages
  const seasonalityAverages = Object.entries(groupedPeriods).reduce(
    (acc, [label, periods]) => {
      const changes = periods!.map(({ change }) => change);
      const averageChange = changes.reduce(sum, 0) / periods!.length;
      const higherCloses = periods!.filter(({ up }) => up).length;
      const lowerCloses = periods!.filter(({ up }) => !up).length;
      const higherPct = higherCloses / periods!.length;
      const averageRange =
        periods!.map(({ range }) => range).reduce(sum, 0) / periods!.length;

      return [
        ...acc,
        {
          label,
          averageChange,
          averageRange,
          lowerCloses,
          higherCloses,
          count: periods!.length,
          higherPct,
          changes: periods,
        },
      ];
    },
    []
  );

  return seasonalityAverages;
};

export const cleanSymbolList = (symbols: string): string[] =>
  symbols
    .replace(/\n/g, ",")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);
