"use client";

import { useState } from "react";
import { getStartOfWeek } from "../api/seasonality/utils";
import { LINKS as links, THRESHOLD_LOWER, THRESHOLD_UPPER } from "../constants";
import { GlobalNav } from "../components/GlobalNav";
import { TickerSymbolForm } from "../components/TickerSymbolForm";

interface SeasonalityAverages {
  [key: string]: {
    label?: string;
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

const WeeklySeasonality = () => {
  const [symbols, setSymbols] = useState("");
  const [data, setData] = useState<SeasonalityData>({});
  const [result, setResult] = useState<{
    positive: { [key: string]: { symbol: string; higherPct: number }[] };
    negative: { [key: string]: { symbol: string; higherPct: number }[] };
  }>({ positive: {}, negative: {} });
  const [activeTab, setActiveTab] = useState("positive");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const symbolsArray = cleanSymbolList(symbols);
    const allData: SeasonalityData = {};

    for (const symbol of symbolsArray) {
      const response = await fetch(
        `/api/seasonality?ticker=${symbol}&type=weekly`
      );
      const result = await response.json();
      allData[symbol] = result;
    }

    setData(allData);
    analyzeData(allData);
  };

  const analyzeData = (allData: SeasonalityData) => {
    const positive: { [key: string]: { symbol: string; higherPct: number }[] } =
      {};
    const negative: { [key: string]: { symbol: string; higherPct: number }[] } =
      {};

    Object.entries(allData).forEach(([symbol, { weekly }]) => {
      Object.entries(weekly).forEach(([week, stats]) => {
        if (stats.higherPct >= 0.75) {
          positive[week] = positive[week]
            ? [...positive[week], { symbol, higherPct: stats.higherPct }]
            : [{ symbol, higherPct: stats.higherPct }];
        }
        if (stats.higherPct <= 0.2) {
          negative[week] = negative[week]
            ? [...negative[week], { symbol, higherPct: stats.higherPct }]
            : [{ symbol, higherPct: stats.higherPct }];
        }
      });
    });

    setResult({ positive, negative });
  };

  const sortedEntries = (
    entries: [string, { symbol: string; higherPct: number }[]][]
  ) =>
    entries
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([week, stocks]) => [
        week,
        stocks.sort((a, b) => b.higherPct - a.higherPct),
      ]);

  const renderTable = (
    entries: [string, { symbol: string; higherPct: number }[]][]
  ) => (
    <>
      {sortedEntries(entries).map(([week, stocks]) => (
        <div
          key={week}
          className="not-prose relative bg-indigo-600 rounded-xl overflow-hidden mb-8"
        >
          <h4 className="text-white p-4 block font-semibold text-center">
            Week {parseFloat(week) + 1} / {getStartOfWeek(week)}
          </h4>
          <div className="shadow-sm overflow-hidden">
            <div className="relative rounded-xl overflow-auto">
              <table className="table-auto border-collapse table-auto w-full text-sm mt-4">
                <thead>
                  <tr>
                    <th className="border-b bg-indigo-600 font-medium p-4 pl-8 pt-0 pb-3 text-white text-left">
                      Ticker
                    </th>
                    <th className="border-b bg-indigo-600 font-medium p-4 pl-8 pt-0 pb-3 text-white text-left">
                      Chance of Being Up
                    </th>
                    <th className="border-b bg-indigo-600 font-medium p-4 pl-8 pt-0 pb-3 text-white text-left">
                      Average Range
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800">
                  {stocks.map((stock) => (
                    <tr key={stock.symbol}>
                      <td className="uppercase border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                        {stock.symbol}
                      </td>
                      <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                        {(stock.higherPct * 100).toFixed(2)}%
                      </td>
                      <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                        {stock.range || "n/a"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <>
      <GlobalNav links={links} />

      <main className="bg-black py-40 sm:py-24 mx-auto min-h-screen">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h1 className="font-bold text-indigo-600">Best and Worst</h1>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            View the best and worst weeks for your stocks
          </p>
          <p className="mt-9 leading-7 text-white">
            Symbols can be comma-separated or entered on a new line.
          </p>
        </div>

        <div className="container xl mt-9 mx-auto p-12 bg-slate-700 rounded-xl shadow-lg text-white">
          <TickerSymbolForm
            handleSubmit={handleSubmit}
            onTextChange={(e) => setSymbols(e.target.value)}
            symbols={symbols}
          />

          <div className="mt-8">
            <button
              className={`p-2 m-2 rounded ${
                activeTab === "positive" ? "bg-indigo-600" : "bg-gray-500"
              } text-white`}
              onClick={() => setActiveTab("positive")}
            >
              Best Weeks
            </button>
            <button
              className={`p-2 m-2 rounded ${
                activeTab === "negative" ? "bg-indigo-600" : "bg-gray-500"
              } text-white`}
              onClick={() => setActiveTab("negative")}
            >
              Worst Weeks
            </button>
          </div>

          {activeTab === "positive" &&
            Object.keys(result.positive).length > 0 && (
              <div>
                <h2 className="text-xl font-bold mt-8">
                  Best Weeks (Positive Probability ≥ 75%)
                </h2>
                {renderTable(Object.entries(result.positive))}
              </div>
            )}
          {activeTab === "negative" &&
            Object.keys(result.negative).length > 0 && (
              <div>
                <h2 className="text-xl font-bold mt-8">
                  Worst Weeks (Positive Probability ≤ 20%)
                </h2>
                {renderTable(Object.entries(result.negative))}
              </div>
            )}
        </div>
      </main>
    </>
  );
};

export default WeeklySeasonality;
