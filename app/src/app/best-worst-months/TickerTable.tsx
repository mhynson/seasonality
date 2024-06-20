interface ITickerTableProps {
  tableId?: string;
  label?: string;
  data?: any;
}

const tableHeaderClass = "border-b p-4 pl-8 pt-0 pb-3 bg-indigo-600";

export const TickerTable = ({ data, label, tableId }: ITickerTableProps) => {
  return (
    <div
      key={tableId}
      className="not-prose relative bg-indigo-600 rounded-xl overflow-hidden mb-8"
    >
      <h4 className="text-white p-4 block font-semibold text-center">
        {label}
      </h4>
      <div className="shadow-sm overflow-hidden">
        <div className="relative rounded-xl overflow-auto">
          <table className="table-auto border-collapse table-auto w-full text-sm mt-4">
            <thead>
              <tr className="font-medium text-white text-center">
                <th className={tableHeaderClass}>Ticker</th>
                <th className={tableHeaderClass}>Chance of Being Up</th>
                <th className={tableHeaderClass}>Average Range</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800">
              {data.map((item) => (
                <tr
                  key={item.symbol}
                  className="border-b border-slate-100 p-4 pl-8 text-slate-500 text-center"
                >
                  <td className="uppercase p-4 pl-8">{item.symbol}</td>
                  <td className="p-4 pl-8">
                    {(item.higherPct * 100).toFixed(2)}%
                  </td>
                  <td className="p-4 pl-8">{item.range || "n/a"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
