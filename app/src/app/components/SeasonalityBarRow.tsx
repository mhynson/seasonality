import { getDayNumber, getWeekNumber } from "../api/seasonality/utils";
import { monthOrder } from "../constants";
import { TSeasonalityAverageEntry, TTimeframeLabel } from "../types";

interface ISeasonalityBarRowProps {
  view: TTimeframeLabel;
  label: string;
  stats: TSeasonalityAverageEntry;
}

const updateLabelForView = (label: string, view: TTimeframeLabel): string => {
  // const now = new Date();
  // if (view === "daily") {
  //   return "" + getDayNumber(now);
  // }

  if (view === "weekly") {
    return "" + parseFloat(label) + 1;
  }

  // if (view === "monthly") {
  //   return monthOrder[now.getMonth()];
  // }
  return label;
};

export const SeasonalityBarRow = (props: ISeasonalityBarRowProps) => {
  const { view, label, stats } = props;

  return (
    <div className="flex items-center">
      <span className="w-12 text-black uppercase font-semibold">
        {updateLabelForView(label, view)}
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
  );
};
