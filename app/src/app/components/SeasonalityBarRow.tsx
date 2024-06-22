import { TSeasonalityAverageEntry } from "../api/seasonality/utils";

interface ISeasonalityBarRowProps {
  view: string;
  label: string;
  stats: TSeasonalityAverageEntry;
}

export const SeasonalityBarRow = (props: ISeasonalityBarRowProps) => {
  const { view, label, stats } = props;

  return (
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
  );
};
