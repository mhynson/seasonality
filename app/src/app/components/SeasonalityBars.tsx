import { TSeasonalityData } from "../api/seasonality/utils";
import { AverageStats } from "./AverageStats";
import { HistoricalStats } from "./HistoricalStats";
import { SeasonalityBarRow } from "./SeasonalityBarRow";
import { SectionHeading } from "./SectionHeading";
interface ISeasonalityBarsProps {
  seasonalityData: TSeasonalityData | undefined;
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

export const SeasonalityBars = ({ seasonalityData }: ISeasonalityBarsProps) => {
  if (!seasonalityData) return <></>;

  const { timeframe, results } = seasonalityData;

  // TODO: sort this in the api
  const sortedSeasonalityData = results.sort((a, b) => {
    const { label: labelA = "" } = a;
    const { label: labelB = "" } = b;
    if (monthOrder.indexOf(labelA) < 0) {
      if (!isNaN(parseFloat(labelA)))
        return parseFloat(labelB) - parseFloat(labelB);
      return 0;
    }
    return monthOrder.indexOf(labelA) - monthOrder.indexOf(labelB);
  });

  console.log({ timeframe, sortedSeasonalityData });

  return sortedSeasonalityData.map((result) => (
    <div key={result.label} className="mb-8 border-b-2 pb-4">
      <SectionHeading view={timeframe} label={result.label} />

      <SeasonalityBarRow view={timeframe} label={result.label} stats={result} />

      <AverageStats stats={result} />

      <HistoricalStats stats={result} />
    </div>
  ));
};
