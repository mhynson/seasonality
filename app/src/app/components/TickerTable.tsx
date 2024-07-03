import { TSeasonalityAverageEntryWithSymbol } from "../interfaces";

interface ITickerTableProps {
  tableId?: string;
  label?: string;
  data?: TSeasonalityAverageEntryWithSymbol[];
}

type TGetColorClass = (item: TSeasonalityAverageEntryWithSymbol) => string;
const getColorClass: TGetColorClass = ({ higherPct }) =>
  higherPct === 1 ? "bg-green-400" : higherPct === 0 ? "bg-red-300" : "";

const tableHeaderClass = "p-4 bg-indigo-600";

export const TickerTable = ({ data, label, tableId }: ITickerTableProps) => (
  <div
    key={tableId}
    className="not-prose relative bg-indigo-700 rounded-xl overflow-hidden mb-8"
  >
    <h4 className="text-white p-4 block font-semibold text-center">{label}</h4>
    <div className="shadow-sm overflow-hidden">
      <div className="relative rounded-xl overflow-auto">
        <table className="table-auto border-collapse table-auto w-full text-sm">
          <thead>
            <tr className="font-medium text-white text-center">
              <th className={tableHeaderClass}>Ticker</th>
              <th className={tableHeaderClass}>Chance of Being Up</th>
              <th className={tableHeaderClass}>Average Range</th>
              <th className={tableHeaderClass}>Average Change</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800">
            {data?.map((item) => (
              <tr
                key={item.symbol}
                className="border-b border-slate-100 p-4 pl-8 text-slate-500 text-center"
              >
                <td className="uppercase p-4 pl-8">{item.symbol}</td>
                <td className="p-4 pl-8">
                  <span className={`p-2 ${getColorClass(item)}`}>
                    {(item.higherPct * 100).toFixed(2)}%
                  </span>
                </td>
                <td className="p-4 pl-8">
                  ${item.averageRange.toFixed(2) || "n/a"}
                </td>
                <td className="p-4 pl-8">
                  {(100 * item.averageChange).toFixed(2) || "n/a"}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
