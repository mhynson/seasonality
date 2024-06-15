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

export const SeasonalityBars = ({
  seasonalityData,
  view,
}: ISeasonalityBarsProps) => {
  if (!seasonalityData) return <></>;

  return Object.entries(seasonalityData).map(([label, stats]) => (
    <div key={label} className="mb-8 border-b-2 pb-4">
      <SectionHeading view={view} label={label} />

      <SeasonalityBarRow view={view} label={label} stats={stats} />

      <AverageStats stats={stats} />
      <HistoricalStats stats={stats} />
    </div>
  ));
};
