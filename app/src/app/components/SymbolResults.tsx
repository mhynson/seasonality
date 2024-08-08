import React, { Dispatch, SetStateAction } from "react";
import { getError } from "../api/seasonality/utils";
import { TSymbolGroupedData, TSymbolSeasonalityDataView } from "../types";
import { JumpScrollButton } from "./JumpScrollButton";
import { ErrorMessage } from "./ErrorMessage";
import { SeasonalityBars } from "./SeasonalityBars";

interface ISymbolResults {
  symbol: string;
  symbolData: TSymbolSeasonalityDataView;
  setData: Dispatch<SetStateAction<TSymbolGroupedData>>;
}

export const SymbolResults: React.FC<ISymbolResults> = ({
  symbol,
  symbolData,
  setData,
}) => {
  const { view, data } = symbolData;
  const error = getError(data);

  const btnBaseClasses =
    "rounded px-4 py-2 ml-1 text-white hover:bg-red-300 hover:opacity-100";
  const btnActiveClasses = "bg-red-400";
  const btnInactiveClasses = "bg-slate-300 opacity-70";

  const dataForView = data.find(({ timeframe }) => timeframe === view);

  return (
    <div className="mt-8 border-t-2 py-4">
      <div className="stock-header mb-4 p-4" id={`${symbol}--stock-header`}>
        <h2 className="text-xl font-bold">{symbol.toUpperCase()}</h2>
        {!error ? (
          <>
            <div className="flex justify-center">
              <button
                className={`${btnBaseClasses} ${
                  view === "monthly" ? btnActiveClasses : btnInactiveClasses
                }`}
                onClick={() =>
                  setData((prevData: TSymbolGroupedData) => ({
                    ...prevData,
                    [symbol]: { ...prevData[symbol], view: "monthly" },
                  }))
                }
              >
                Monthly View
              </button>
              <button
                className={`${btnBaseClasses} ${
                  view === "weekly" ? btnActiveClasses : btnInactiveClasses
                }`}
                onClick={() =>
                  setData((prevData: TSymbolGroupedData) => ({
                    ...prevData,
                    [symbol]: { ...prevData[symbol], view: "weekly" },
                  }))
                }
              >
                Weekly View
              </button>
            </div>
            <JumpScrollButton symbol={symbol} view={view} />
          </>
        ) : (
          <></>
        )}
      </div>
      {error ? (
        <div className="my-4 p-4 bg-slate-50">
          <pre>
            <ErrorMessage error={error} />
          </pre>
        </div>
      ) : (
        <>
          <div className="bg-white p-4 rounded mt-4">
            <SeasonalityBars seasonalityData={dataForView} symbol={symbol} />
          </div>
        </>
      )}
    </div>
  );
};
