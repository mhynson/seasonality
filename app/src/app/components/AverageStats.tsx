import { TSeasonalityAverageEntry } from "../types";

export const AverageStats = ({
  stats,
}: {
  stats: TSeasonalityAverageEntry;
}) => (
  <div className="text-right ml-2 text-xs italic text-black py-2">
    <p className="px-2 md:inline">
      Average Change: {(stats.averageChange * 100).toPrecision(2)}%
    </p>

    <p className="px-2 md:inline">
      Average Range: ${stats.averageRange.toFixed(2)}
    </p>

    <p className="px-2 md:inline">
      Average Drawdown: {(stats.averageDrawdown * 100).toPrecision(2)}%
    </p>
  </div>
);
