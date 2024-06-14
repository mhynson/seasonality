"use client";

import { useState } from "react";
import {
  SeasonalityAverageEntry,
  cleanSymbolList,
} from "./api/seasonality/utils";
import Link from "next/link";
import { ErrorMessage } from "./components/ErrorMessage";
import { SeasonalityBars } from "./components/SeasonalityBars";
interface SeasonalityAverages {
  [key: string]: SeasonalityAverageEntry;
}

interface SeasonalityData {
  [key: string]: {
    monthly: SeasonalityAverages;
    weekly: SeasonalityAverages;
  };
}

interface SymbolData {
  view: "monthly" | "weekly";
  data: SeasonalityAverages;
}

const Home = () => {
  const [symbols, setSymbols] = useState("");
  const [data, setData] = useState<{ [symbol: string]: SymbolData }>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const symbolsArray = cleanSymbolList(symbols);
    const allData: { [symbol: string]: SymbolData } = {};

    for (const symbol of symbolsArray) {
      const response = await fetch(`/api/seasonality?ticker=${symbol}`);
      const result = await response.json();
      allData[symbol] = { view: "monthly", data: result };
    }

    setData(allData);
  };

  const renderSymbolData = (symbol: string, symbolData: SymbolData) => {
    const { view, data } = symbolData;
    const btnBaseClasses =
      "rounded px-4 py-2 ml-1 text-white  hover:bg-red-300 hover:opacity-100";
    const btnActiveClasses = "bg-red-400";
    const btnInactiveClasses = "bg-slate-300 opacity-70";

    return (
      <div key={symbol} className="mt-8 border-t-2 py-4">
        <h2 className="text-xl font-bold">{symbol.toUpperCase()}</h2>
        <div className="flex justify-center mt-4">
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
        <div className="bg-white p-4 rounded mt-4">
          {data?.error ? (
            <ErrorMessage error={data.error} />
          ) : (
            <SeasonalityBars view={view} seasonalityData={data?.[view]} />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <nav className="bg-gray-800 p-4">
        <Link
          className="text-white px-4 active:border-b-2 active:border-indigo-600"
          href="/"
        >
          Monthly and Weekly Seasonality
        </Link>
        <Link className="text-white px-4" href="/best-worst-months">
          Best and Worst Months
        </Link>
        <Link className="text-white px-4" href="/best-worst-weeks">
          Best and Worst Weeks
        </Link>
      </nav>
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
          <form onSubmit={handleSubmit}>
            <label className="block font-semibold" htmlFor="symbols">
              Ticker Symbols
            </label>
            <textarea
              className="block p-4 w-full mt-2 text-black"
              id="symbols"
              value={symbols}
              onChange={(e) => setSymbols(e.target.value)}
              required
              rows={3}
            />
            <button
              className="p-4 rounded mt-4 mb-4 w-36 bg-indigo-600 text-white"
              type="submit"
            >
              Submit
            </button>
          </form>
          {Object.keys(data).length > 0 && (
            <div>
              {Object.entries(data).map(([symbol, symbolData]) =>
                renderSymbolData(symbol, symbolData)
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
