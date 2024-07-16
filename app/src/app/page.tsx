"use client";

import { useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

import { cleanSymbolList, getError } from "./api/seasonality/utils";
import { LINKS as links } from "./constants";
import { ErrorMessage } from "./components/ErrorMessage";
import { SeasonalityBars } from "./components/SeasonalityBars";
import { GlobalNav } from "./components/GlobalNav";
import { TickerSymbolForm } from "./components/TickerSymbolForm";
import {
  TSeasonalityData,
  TSymbolGroupedData,
  TSymbolSeasonalityDataView,
} from "./types";
import { JumpScrollButton } from "./components/JumpScrollButton";

const Home = () => {
  const [symbols, setSymbols] = useState("");
  const [data, setData] = useState<TSymbolGroupedData>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const symbolsArray = cleanSymbolList(symbols);
    const allData: TSymbolGroupedData = {};

    for (const symbol of symbolsArray) {
      const response = await fetch(`/api/seasonality?ticker=${symbol}`);
      const result = await response.json();
      allData[symbol] = { view: "monthly", data: result };
    }

    setData(allData);
  };

  const renderSymbolData = (
    symbol: string,
    symbolData: TSymbolSeasonalityDataView
  ) => {
    const { view, data } = symbolData;
    const error = getError(data);

    const btnBaseClasses =
      "rounded px-4 py-2 ml-1 text-white  hover:bg-red-300 hover:opacity-100";
    const btnActiveClasses = "bg-red-400";
    const btnInactiveClasses = "bg-slate-300 opacity-70";

    const dataForView = data.find(
      ({ timeframe }: TSeasonalityData) => timeframe === view
    );

    return (
      <div key={symbol} className="mt-8 border-t-2 py-4">
        <div
          className="stock-header mb-4p
        "
          id={`${symbol}--stock-header`}
        >
          <h2 className="text-xl font-bold">{symbol.toUpperCase()}</h2>

          {!error ? (
            <>
              <div className="flex justify-center">
                <button
                  className={`${btnBaseClasses} ${
                    view === "monthly" ? btnActiveClasses : btnInactiveClasses
                  }`}
                  onClick={() =>
                    setData((prevData) => ({
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
                    setData((prevData) => ({
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

  return (
    <>
      <GlobalNav links={links} />
      <main className="bg-black py-40 sm:py-24 mx-auto min-h-screen">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h1 className="font-bold text-indigo-600">Stock Seasonality</h1>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            View monthly and weekly stock seasonality!
          </p>
          <p className="mt-9 leading-7 text-white">
            Just enter ticker(s) below.
          </p>
          <p className="text-xs leading-7 text-white">
            Symbols can be comma-separated or entered on a new line.
          </p>
        </div>
        <div className="container xl mt-9 mx-auto p-12 bg-slate-700 rounded-xl shadow-lg text-white">
          <TickerSymbolForm
            handleSubmit={handleSubmit}
            onTextChange={(e) => setSymbols(e.target.value)}
            symbols={symbols}
          />

          {Object.keys(data).length > 0 && (
            <div>
              {Object.entries(data).map(([symbol, symbolData]) =>
                renderSymbolData(symbol, symbolData)
              )}
            </div>
          )}
        </div>
      </main>
      <GoogleAnalytics gaId="G-4QH71SMBZ9" />
    </>
  );
};

export default Home;
