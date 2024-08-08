"use client";

import { useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

import { cleanSymbolList } from "./api/seasonality/utils";
import { LINKS as links } from "./constants";
import { GlobalNav } from "./components/GlobalNav";
import { TickerSymbolForm } from "./components/TickerSymbolForm";
import { TSymbolGroupedData } from "./types";
import { YearsSelector } from "./components/YearsSelector";
import { useYears, YearsContextType } from "./context/YearsContext";
import { SymbolResults } from "./components/SymbolResults";

const Home = () => {
  const [symbols, setSymbols] = useState("");
  const [data, setData] = useState<TSymbolGroupedData>({});

  const { years } = useYears() as YearsContextType;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const symbolsArray = cleanSymbolList(symbols);
    const allData: TSymbolGroupedData = {};

    for (const symbol of symbolsArray) {
      const response = await fetch(
        `/api/seasonality?ticker=${symbol}&years=${years}`
      );
      const result = await response.json();
      allData[symbol] = { view: "monthly", data: result };
    }

    setData(allData);
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
          <YearsSelector years={years} />
          <TickerSymbolForm
            handleSubmit={handleSubmit}
            onTextChange={(e) => setSymbols(e.target.value)}
            symbols={symbols}
          />
          {Object.keys(data).length > 0 && (
            <div>
              {Object.entries(data).map(([symbol, symbolData]) => (
                <SymbolResults
                  key={symbol}
                  {...{ symbol, symbolData, setData }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
