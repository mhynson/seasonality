import { LOOKBACK_YEARS, monthNames } from "@/app/constants";
import {
  TCalculateSeasonality,
  TGroupedSeasonalityData,
  TReduceGroupedPeriods,
  TSeasonalityData,
  TSeasonalityEntry,
  TTimeframeLabel,
} from "@/app/types";

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
  timeframe: TTimeframeLabel,
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

export const sumReduction = (total: number, current: number) => total + current;

export const calculateSeasonality: TCalculateSeasonality = (
  timeframe,
  data
) => {
  const groupedPeriods = data
    .map(({ open, high, low, close, date, ...rest }) => ({
      label: getPeriodLabelFromDate(timeframe, new Date(date)),
      date,
      open,
      high,
      low,
      close,
      drawdown: (low - high) / high,
      range: Math.abs(high - low),
      change: (close - open) / open,
    }))
    .reduce<TGroupedSeasonalityData>((acc, data) => {
      const { label, change, range, date, open, close, drawdown } = data;

      const entry: TSeasonalityEntry = {
        ...data,
        drawdown,
        change,
        close,
        date: date.toISOString(),
        open,
        range,
        up: change * 100 >= 0,
      };

      return {
        ...acc,
        [label]: acc[label] ? [...acc[label], entry] : [entry],
      };
    }, {});

  const seasonalityAverages = Object.entries(groupedPeriods).reduce(
    reduceGroupedPeriods,
    []
  );

  return seasonalityAverages;
};

const reduceGroupedPeriods: TReduceGroupedPeriods = (acc, [label, periods]) => {
  const validPeriods = periods.slice(0, LOOKBACK_YEARS);
  const changes = validPeriods.map(({ change }) => change);
  const averageChange = changes.reduce(sumReduction, 0) / validPeriods.length;
  const drawdowns = validPeriods.map(({ drawdown }) => drawdown);
  const averageDrawdown =
    drawdowns.reduce(sumReduction, 0) / validPeriods.length;
  const higherCloses = validPeriods.filter(({ up }) => up).length;
  const lowerCloses = validPeriods.filter(({ up }) => !up).length;
  const higherPct = higherCloses / validPeriods.length;
  const averageRange =
    validPeriods.map(({ range }) => range).reduce(sumReduction, 0) /
    validPeriods.length;

  return [
    ...acc,
    {
      label,
      averageChange,
      averageDrawdown,
      averageRange,
      lowerCloses,
      higherCloses,
      count: validPeriods.length,
      higherPct,
      changes: validPeriods,
    },
  ];
};

export const cleanSymbolList = (symbols: string): string[] =>
  symbols
    .replace(/\n/g, ",")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);

export const getFullMonthName = (abbr: string) => monthNames[abbr] || abbr;

export const getLabelForTimeframe = (
  initialLabel: string,
  timeframe: string
) => {
  return timeframe === "monthly"
    ? getFullMonthName(initialLabel)
    : timeframe === "weekly"
    ? `Week ${initialLabel} / ${getStartOfWeek(initialLabel)}`
    : initialLabel;
};

export const getError = (data: TSeasonalityData[]) => data?.[0]?.error || null;
