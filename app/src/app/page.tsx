"use client";

import { useState } from "react";

interface SeasonalityAverages {
  [key: string]: {
    averageChange: number;
    lowerCloses: number;
    higherCloses: number;
    count: number;
    higherPct: number;
  };
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
    const symbolsArray = symbols
      .replace(/\n/, ",")
      .split(",")
      .map((s) => s.trim());

    const allData: { [symbol: string]: SymbolData } = {};

    for (const symbol of symbolsArray) {
      const response = await fetch(`/api/seasonality?ticker=${symbol}`);
      const result = await response.json();
      allData[symbol] = { view: "monthly", data: result };
    }

    setData(allData);
  };

  const renderBars = (seasonalityData: SeasonalityAverages) => {
    return Object.entries(seasonalityData).map(([label, stats]) => (
      <div key={label} className="flex items-center mb-4">
        <span className="w-12">{label}</span>
        <div
          className="flex items-center bg-blue-500 h-8 rounded"
          style={{ width: `${stats.higherPct * 100}%` }}
        >
          <span className="text-white text-xs pl-2">
            {(stats.higherPct * 100).toFixed(2)}%
          </span>
        </div>
      </div>
    ));
  };

  const renderSymbolData = (symbol: string, symbolData: SymbolData) => {
    const { view, data } = symbolData;
    return (
      <div key={symbol} className="mt-8">
        <h2 className="text-xl font-bold">{symbol.toUpperCase()}</h2>
        <div className="flex justify-center mt-4">
          <button
            className={`px-4 py-2 ${
              view === "monthly" ? "bg-blue-500 text-white" : "bg-gray-300"
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
            className={`px-4 py-2 ml-2 ${
              view === "weekly" ? "bg-blue-500 text-white" : "bg-gray-300"
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
          {renderBars(data[view])}
        </div>
      </div>
    );
  };

  return (
    <main className="bg-black py-40 sm:py-24 mx-auto min-h-screen">
      <div className="mx-auto max-w-2xl lg:text-center">
        <h1 className="font-bold text-indigo-600">Stock Seasonality</h1>
        <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          View monthly and weekly stock seasonality!
        </p>
        <p className="mt-9 leading-7 text-white">
          Just enter ticker(s) below (comma-separated for multiple symbols)
        </p>
      </div>
      <div className="max-w-2xl mx-auto px-8 py-18 xs:px-12 sm:p-24 bg-slate-300 rounded-4xl">
        <form onSubmit={handleSubmit}>
          <label className="block" htmlFor="symbols">
            Ticker Symbols
          </label>
          <textarea
            className="block p-4 w-full"
            id="symbols"
            value={symbols}
            onChange={(e) => setSymbols(e.target.value)}
            required
            rows={3}
          />
          <button className="p-4 rounded bg-blue-100" type="submit">
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
  );
};

export default Home;
