import { useState } from "react";
import { formatDate } from "../api/seasonality/utils";
import { TSeasonalityAverageEntry } from "../types";

interface IHistoricalStatsProps {
  stats: TSeasonalityAverageEntry;
}

export const HistoricalStats = ({ stats }: IHistoricalStatsProps) => {
  const [shouldShowStats, setShouldShowStats] = useState<boolean>(false);

  if (!stats.changes) return <></>;

  const buttonText = shouldShowStats ? "Hide" : "Show";
  const standardStyles = "bg-gray-100 text-black text-xs px-4 py-1";
  const standardWithBorder = `${standardStyles} border-b-2 border-black`;

  return (
    <div>
      <button
        onClick={() => setShouldShowStats(!shouldShowStats)}
        className="text-center text-sm text-black mx-auto block font-thin underline underline-offset-2"
      >
        {buttonText} Stats
      </button>

      {shouldShowStats ? (
        <div className="grid grid-cols-4 gap-3 justify-center py-3">
          {stats.changes.map((period, idx) => {
            const { change, date, open, close, high, low, drawdown } = period;
            const percentChangeClassName =
              change > 0 ? "bg-green-400" : "bg-red-400";
            const formattedDate = formatDate(new Date(date));
            const year = formattedDate.substring(0, 4);

            return (
              <div key={idx} className="flex flex-col px-5 text-center">
                <div className="bg-gray-800 w-full">
                  {year}
                  <br />
                  <span className="text-xs">{formattedDate}</span>
                </div>
                <div className={`w-full ${percentChangeClassName}`}>
                  {(change * 100).toFixed(2)}%
                </div>
                <div className={standardWithBorder}>
                  High: ${high.toFixed(2)}
                </div>
                <div className={standardWithBorder}>
                  Open: ${open.toFixed(2)}
                </div>
                <div className={standardWithBorder}>
                  Close: ${close.toFixed(2)}
                </div>
                <div className={standardWithBorder}>Low: ${low.toFixed(2)}</div>
                <div className={standardStyles}>
                  Max Drawdown: {(drawdown * 100).toFixed(2)}%
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
