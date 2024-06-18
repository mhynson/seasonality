import { SeasonalityAverageEntry } from "../api/seasonality/utils";
import { AverageStats } from "./AverageStats";
import { HistoricalStats } from "./HistoricalStats";
import { SeasonalityBarRow } from "./SeasonalityBarRow";
import { SectionHeading } from "./SectionHeading";

interface SeasonalityData {
  [key: string]: {
    monthly: SeasonalityAverages;
    weekly: SeasonalityAverages;
  };
}

interface SeasonalityAverages {
  [key: string]: SeasonalityAverageEntry;
}

interface ISeasonalityBarsProps {
  seasonalityData: SeasonalityAverages;
  view: "weekly" | "monthly";
}

const monthOrder = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const SeasonalityBars = ({
  seasonalityData,
  view,
}: ISeasonalityBarsProps) => {
  if (!seasonalityData) return <></>;

  const sortedSeasonalityData = Object.entries(seasonalityData).sort((a, b) => {
    const labelA = a[0];
    const labelB = b[0];
    if (monthOrder.indexOf(labelA) < 0) {
      if (!isNaN(parseFloat(labelA)))
        return parseFloat(labelB) - parseFloat(labelB);
      return 0;
    }
    return monthOrder.indexOf(labelA) - monthOrder.indexOf(labelB);
  });

  return sortedSeasonalityData.map(([label, stats]) => (
    <div key={label} className="mb-8 border-b-2 pb-4">
      <SectionHeading view={view} label={label} />

      <SeasonalityBarRow view={view} label={label} stats={stats} />

      <AverageStats stats={stats} />
      <HistoricalStats stats={stats} />
    </div>
  ));
};
