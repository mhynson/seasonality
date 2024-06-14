import {
  SeasonalityAverageEntry,
  getStartOfWeek,
} from "../api/seasonality/utils";

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
      {view === "weekly" ? (
        <h6 className="w-full text-black text-center text-sm italic">
          {getStartOfWeek(label)}
        </h6>
      ) : (
        ""
      )}
      <div className="flex items-center">
        <span className="w-12 text-black uppercase font-semibold">
          {view === "weekly" ? parseFloat(label) + 1 : label}
        </span>
        <div
          className="flex items-center bg-gradient-to-r from-blue-500 to-red-400 h-8 rounded"
          style={{ width: `${stats.higherPct * 100}%` }}
        >
          <span
            className={`text-xs pl-2 ${
              stats.higherPct ? "text-white" : "text-black"
            }`}
          >
            {(stats.higherPct * 100).toFixed(2)}%
          </span>
        </div>
      </div>
      {stats.changes && (
        <div>
          {stats.changes.map((period, idx) => (
            <div key={idx} className="group flex relative">
              <>{console.log(period)}</>
              <span
                className={
                  period.change < 0
                    ? "bg-red-500"
                    : "bg-green-500" + " text-white px-2 py-1"
                }
              >
                {(period.change * 100).toFixed(2)}%
              </span>
              <span
                className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
  -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
              >
                Open: {period.open}, Close: {period.close}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="text-right ml-2 text-xs italic text-black">
        Average % Change: {(stats.averageChange * 100).toPrecision(2)}% |
        Average Range: ${stats.averageRange.toFixed(2)}
      </div>
    </div>
  ));
};
