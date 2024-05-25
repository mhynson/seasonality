interface HistoricalRowHistory {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose?: number;
  volume: number;
}

interface SeasonalityAverageEntry {
  averageChange: number;
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
  type: "monthly" | "weekly",
  date: Date
): string => {
  if (type === "weekly") return getWeekNumber(date).toString();

  if (type === "monthly") {
    return date.toLocaleDateString("default", {
      month: "short",
      timeZone: "UTC",
    });
  }

  return date.toISOString();
};

export const sum = (total: number, current: number) => total + current;

export const calculateSeasonality = (
  type: "monthly" | "weekly",
  data: HistoricalRowHistory[]
): SeasonalityAverages => {
  // Transform data to PercentChangeDataForPeriod and group by label
  const groupedPeriods = data
    .map(({ open, close, date }) => ({
      label: getPeriodLabelFromDate(type, new Date(date)),
      date,
      open,
      close,
      change: (close - open) / open,
    }))
    .reduce<SeasonalityData>((acc, { label, change, date }) => {
      const entry: SeasonalityEntry = {
        up: change * 100 >= 0,
        change,
        date: date.toISOString(),
      };
      return {
        ...acc,
        [label]: acc[label] ? [...acc[label], entry] : [entry],
      };
    }, {});

  // Calculate seasonality averages
  const seasonalityAverages = Object.entries(
    groupedPeriods
  ).reduce<SeasonalityAverages>((acc, [label, periods]) => {
    const changes = periods!.map(({ change }) => change);
    const averageChange = changes.reduce(sum, 0) / periods!.length;
    const higherCloses = periods!.filter(({ up }) => up).length;
    const lowerCloses = periods!.filter(({ up }) => !up).length;
    const higherPct = higherCloses / periods!.length;

    return {
      ...acc,
      [label]: {
        averageChange,
        lowerCloses,
        higherCloses,
        count: periods!.length,
        higherPct,
      },
    };
  }, {});

  return seasonalityAverages;
};
