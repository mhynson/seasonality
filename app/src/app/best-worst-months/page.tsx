"use client";

import { useState } from "react";
import { LINKS as links, THRESHOLD_LOWER, THRESHOLD_UPPER } from "../constants";
import { GlobalNav } from "../components/GlobalNav";
import { TickerSymbolForm } from "../components/TickerSymbolForm";
import { BestWorstHeader } from "../components/BestWorstHeader";
import { ButtonTabs } from "../components/ButtonTabs";
import { TickerTable } from "./TickerTable";
import { cleanSymbolList } from "../api/seasonality/utils";

interface ChangeData {
  up: boolean;
  change: number;
  open: number;
  close: number;
  range: number;
  date: string;
}
interface SeasonalityAverages {
  label: string;
  averageChange: number;
  averageRange: number;
  lowerCloses: number;
  higherCloses: number;
  count: number;
  higherPct: number;
  changes: ChangeData;
}

interface SeasonalityResults {
  [key: string]: SeasonalityData[];
}
interface SeasonalityData {
  timeframe: "weekly" | "monthly";
  results: SeasonalityAverages[];
}

const monthNames: { [key: string]: string } = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
};

const getFullMonthName = (abbr: string) => monthNames[abbr] || abbr;

const monthOrder = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MonthlySeasonality = () => {
  const [symbols, setSymbols] = useState("");
  const [data, setData] = useState<SeasonalityResults>([]);
  const [result, setResult] = useState<{
    best: { [key: string]: { symbol: string; higherPct: number }[] };
    worst: { [key: string]: { symbol: string; higherPct: number }[] };
  }>({ best: {}, worst: {} });
  const [activeTab, setActiveTab] = useState("best");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const symbolsArray = cleanSymbolList(symbols);
    const allData: SeasonalityResults = {};

    for (const symbol of symbolsArray) {
      const response = await fetch(
        `/api/seasonality?ticker=${symbol}&timeframe=monthly`
      );
      const result = await response.json();
      allData[symbol] = result;
    }

    setData(allData);
    analyzeData(allData);
  };

  const analyzeData = (allData: SeasonalityResults) => {
    const best: {
      [key: string]: { label: string; symbol: string; higherPct: number }[];
    } = {};
    const worst: {
      [key: string]: { label: string; symbol: string; higherPct: number }[];
    } = {};

    Object.entries(allData).forEach(([symbol, timeframes]) => {
      timeframes.forEach(({ timeframe, results }) => {
        results.forEach(({ label, higherPct }) => {
          if (higherPct >= THRESHOLD_UPPER) {
            const result = { label, symbol, higherPct };
            best[label] = best[label] ? [...best[label], result] : [result];
          }
          if (higherPct >= THRESHOLD_LOWER) {
            const result = { label, symbol, higherPct };
            worst[label] = worst[label] ? [...worst[label], result] : [result];
          }
        });
      });
    });

    setResult({ best, worst });
  };

  const sortedEntries = (
    entries: [string, { symbol: string; higherPct: number }[]][]
  ) =>
    entries
      .sort(([a], [b]) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
      .map(([month, stocks]) => [
        month,
        stocks.sort((a, b) => b.higherPct - a.higherPct),
      ]);

  return (
    <>
      <GlobalNav links={links} />

      <main className="bg-black py-40 sm:py-24 mx-auto min-h-screen">
        <BestWorstHeader view="months" />

        <div className="container xl mt-9 mx-auto p-12 bg-slate-700 rounded-xl shadow-lg text-white">
          <TickerSymbolForm
            handleSubmit={handleSubmit}
            onTextChange={(e) => setSymbols(e.target.value)}
            symbols={symbols}
          />
          {Object.keys(result.best).length > 0 ||
          Object.keys(result.worst).length > 0 ? (
            <div>
              <div className="flex justify-center mt-8">
                <ButtonTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  tabs={[
                    {
                      label: "Best Months",
                      key: "best",
                    },
                    {
                      label: "Worst Months",
                      key: "worst",
                    },
                  ]}
                />
              </div>
              {activeTab === "best" && (
                <>
                  {Object.keys(result.best).length > 0 ? (
                    <>
                      <h2 className="text-xl font-bold mt-8">
                        Best Months (Positive Probability ≥ 75%)
                      </h2>
                      {sortedEntries(Object.entries(result.best)).map(
                        ([month, stocks]) => (
                          <TickerTable
                            key={month}
                            tableId={month}
                            label={getFullMonthName(month)}
                            data={stocks}
                          />
                        )
                      )}
                    </>
                  ) : (
                    <>
                      None of the symbols have positive probability higher than
                      75%;
                    </>
                  )}
                </>
              )}
              {activeTab === "worst" && (
                <>
                  {Object.keys(result.worst).length > 0 ? (
                    <>
                      <h2 className="text-xl font-bold mt-8">
                        Worst Months (Positive Probability ≤ 20%)
                      </h2>
                      {sortedEntries(Object.entries(result.worst)).map(
                        ([month, stocks]) => (
                          <TickerTable
                            key={month}
                            tableId={month}
                            label={getFullMonthName(month)}
                            data={stocks}
                          />
                        )
                      )}
                    </>
                  ) : (
                    <>
                      None of the symbols have positive probability lower than
                      20%;
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <p className="text-white">No results to display.</p>
          )}
        </div>
      </main>
    </>
  );
};

export default MonthlySeasonality;
