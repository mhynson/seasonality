interface HistoricalRowHistory {
  [key: string]: any;
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
  [key in Month]: SeasonalityEntry[];
};

type AverageSeasonalityData = {
  [key in Month]: SeasonalityEntry;
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

export const getPeriodLabelFromDate = (type = "monthly", date: Date) => {
  if (type === "weekly") return getWeekNumber(date);

  if (type === "monthly")
    return date.toLocaleDateString("default", {
      month: "short",
      timeZone: "UTC",
    });

  return date;
};

export const sum = (total: number, current: number) => total + current;

export const calculateSeasonality = (
  type: "monthly" | "weekly",
  data: any[] // TODO: fix type to HistoricalRowHistory
) => {
  const seasonalityAverages: SeasonalityAverages = {};

  const groupedPeriods = (
    data?.reduce(
      (
        acc: PercentChangeDataForPeriod[],
        { open, close, date }: HistoricalRowHistory
      ) => [
        ...acc,
        {
          label: getPeriodLabelFromDate(type, date),
          date,
          open,
          close: close,
          change: (close - open) / open,
        },
      ],
      []
    ) || []
  ).reduce((acc: SeasonalityData, curr: PercentChangeDataForPeriod) => {
    const { label, change, date } = curr;
    if (!acc[label]) {
      acc[label] = [];
    }

    return {
      ...acc,
      [`${label}`]: [
        ...acc[label],
        {
          up: change * 100 >= 0,
          change,
          date,
        },
      ],
    };
  }, {});

  Object.entries(groupedPeriods).forEach(([label, periods]: [string, any]) => {
    const averageChange =
      periods.map(({ change }: SeasonalityEntry) => change).reduce(sum, 0) /
      periods.length;

    const higherCloses = periods.filter(
      (entry: SeasonalityEntry) => entry.up
    ).length;
    const lowerCloses = periods.filter(
      (entry: SeasonalityEntry) => !entry.up
    ).length;
    const higherPct = higherCloses / periods.length;

    seasonalityAverages[label] = {
      averageChange,
      lowerCloses,
      higherCloses,
      count: periods.length,
      higherPct,
    };
  });
  return seasonalityAverages;
};
