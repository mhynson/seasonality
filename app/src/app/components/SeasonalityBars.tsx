import { monthOrder } from "../constants";
import { TSeasonalityData } from "../types";
import { AverageStats } from "./AverageStats";
import { HistoricalStats } from "./HistoricalStats";
import { SeasonalityBarRow } from "./SeasonalityBarRow";
import { SectionHeading } from "./SectionHeading";
interface ISeasonalityBarsProps {
  seasonalityData: TSeasonalityData | undefined;
  symbol: string;
}

export const SeasonalityBars = ({
  seasonalityData,
  symbol,
}: ISeasonalityBarsProps) => {
  if (!seasonalityData) return <></>;

  const { timeframe, results } = seasonalityData;

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

  return sortedSeasonalityData.map((result) => {
    const { label } = result;
    return (
      <div
        key={label}
        className="mb-8 border-b-2 pb-4"
        id={`${symbol}--header-${timeframe}-${label}`}
      >
        <SectionHeading view={timeframe} label={label} />

        <SeasonalityBarRow view={timeframe} label={label} stats={result} />

        <AverageStats stats={result} />

        <HistoricalStats stats={result} />
      </div>
    );
  });
};
