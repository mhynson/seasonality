import { SeasonalityAverageEntry } from "../api/seasonality/utils";

export const AverageStats = ({ stats }: { stats: SeasonalityAverageEntry }) => (
  <div className="text-right ml-2 text-xs italic text-black py-2">
    Average % Change: {(stats.averageChange * 100).toPrecision(2)}% | Average
    Range: ${stats.averageRange.toFixed(2)}
  </div>
);
