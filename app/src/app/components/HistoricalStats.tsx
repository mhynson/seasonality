import { useState } from "react";
import { SeasonalityAverageEntry, formatDate } from "../api/seasonality/utils";

interface IHistoricalStatsProps {
  stats: SeasonalityAverageEntry;
}

export const HistoricalStats = ({ stats }: IHistoricalStatsProps) => {
  const [shouldShowStats, setShouldShowStats] = useState<boolean>(false);

  if (!stats.changes) return <></>;

  const buttonText = shouldShowStats ? "Hide" : "Show";

  return (
    <div>
      <button
        onClick={() => setShouldShowStats(!shouldShowStats)}
        className="text-center text-sm text-black mx-auto block font-thin underline underline-offset-2"
      >
        {buttonText} Stats
      </button>

      {shouldShowStats ? (
        <div className="flex flex-row justify-center py-3">
          {stats.changes.map((period, idx) => {
            const { change, date, open, close } = period;
            const percentChangeClassName =
              change > 0 ? "bg-green-400" : "bg-red-400";
            const formattedDate = formatDate(new Date(date));
            const year = formattedDate.substr(0, 4);
            console.log({ year, date, formattedDate, open, close });
            return (
              <div key={idx} className="flex flex-col px-5 text-center">
                <div data-point="year" className="bg-gray-800 w-full">
                  {year}
                  <br />
                  <span className="text-xs">{formattedDate}</span>
                </div>
                <div
                  data-point="pct-change"
                  className={`w-full ${percentChangeClassName}`}
                >
                  {(period.change * 100).toFixed(2)}%
                </div>
                <div
                  data-point="open"
                  className="bg-gray-100 text-black text-xs px-4 border-b-2 border-black"
                >
                  Open: ${open.toFixed(2)}
                </div>

                {/* 
            <div data-point="high">{high}</div>
            <div data-point="low">{low}</div>
             */}
                <div
                  data-point="close"
                  className="bg-gray-100 text-black text-xs px-4"
                >
                  Close: ${close.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
