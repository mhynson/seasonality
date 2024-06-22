"use client";

import { useState } from "react";
import {
  LINKS as links,
  monthOrder,
  THRESHOLD_LOWER,
  THRESHOLD_UPPER,
} from "../constants";
import { GlobalNav } from "../components/GlobalNav";
import { TickerSymbolForm } from "../components/TickerSymbolForm";
import { BestWorstHeader } from "../components/BestWorstHeader";
import { ButtonTabs } from "../components/ButtonTabs";
import { TickerTable } from "./TickerTable";
import {
  cleanSymbolList,
  getLabelForTimeframe,
  TSeasonalityAverageEntryWithSymbol,
  TSymbolGroupedTimeframeSeasonality,
} from "../api/seasonality/utils";

type TGroupedSeasonalityAverages = {
  [key: string]: TSeasonalityAverageEntryWithSymbol[];
};

type TSeasonalitySorter = (
  a: TSeasonalityAverageEntryWithSymbol[],
  b: TSeasonalityAverageEntryWithSymbol[]
) => number;
interface IBestWorstPageProps {
  timeframe: "weekly" | "monthly";
}

export const BestWorstPage = ({ timeframe }: IBestWorstPageProps) => {
  const pluralizedTimeframe = timeframe.replace("ly", "s");
  const [symbols, setSymbols] = useState("");
  const [data, setData] = useState<TSymbolGroupedTimeframeSeasonality>({});
  const [result, setResult] = useState<{
    best: TSeasonalityAverageEntryWithSymbol[][];
    worst: TSeasonalityAverageEntryWithSymbol[][];
  }>({ best: [], worst: [] });
  const [activeTab, setActiveTab] = useState("best");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const symbolsArray = cleanSymbolList(symbols);
    const allData: TSymbolGroupedTimeframeSeasonality = {};

    for (const symbol of symbolsArray) {
      const response = await fetch(
        `/api/seasonality?ticker=${symbol}&timeframe=${timeframe}`
      );
      const result = await response.json();
      allData[symbol] = result;
    }

    setData(allData);
    analyzeData(allData);
  };

  const sortByDateAscending: TSeasonalitySorter = (
    [{ label: labelA }],
    [{ label: labelB }]
  ) => monthOrder.indexOf(labelA) - monthOrder.indexOf(labelB);

  const sortByPercentDescending: TSeasonalitySorter = (
    [{ higherPct: pctA }],
    [{ higherPct: pctB }]
  ) => pctB - pctA;

  const analyzeData = (allData: TSymbolGroupedTimeframeSeasonality) => {
    const best: TGroupedSeasonalityAverages = {};
    const worst: TGroupedSeasonalityAverages = {};

    Object.entries(allData).forEach(([symbol, timeframes]) => {
      timeframes.forEach(({ results }) => {
        results.forEach((result) => {
          const { label, higherPct } = result;
          const resultWithSymbol = { ...result, symbol };

          if (higherPct >= THRESHOLD_UPPER) {
            best[label] = best[label]
              ? [...best[label], resultWithSymbol]
              : [resultWithSymbol];
          }
          if (higherPct <= THRESHOLD_LOWER) {
            worst[label] = worst[label]
              ? [...worst[label], resultWithSymbol]
              : [resultWithSymbol];
          }
        });
      });
    });

    const sortedBest = Object.values(best)
      .sort(sortByDateAscending)
      .sort(sortByPercentDescending);
    const sortedWorst = Object.values(worst)
      .sort(sortByDateAscending)
      .sort(sortByPercentDescending);

    setResult({ best: sortedBest, worst: sortedWorst });
  };

  return (
    <>
      <GlobalNav links={links} />

      <main className="bg-black py-40 sm:py-24 mx-auto min-h-screen">
        <BestWorstHeader {...{ timeframe }} />

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
                      label: `Best ${pluralizedTimeframe}`,
                      key: "best",
                    },
                    {
                      label: `Worst ${pluralizedTimeframe}`,
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
                        Best {pluralizedTimeframe}
                      </h2>
                      <h4 className="text-sm">(Positive Probability ≥ 75%)</h4>
                      {result.best.map((data) => {
                        const label = data[0].label;
                        return (
                          <TickerTable
                            key={label}
                            tableId={label}
                            label={getLabelForTimeframe(label, timeframe)}
                            data={data}
                          />
                        );
                      })}
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
                        Worst {pluralizedTimeframe}
                      </h2>
                      <h4 className="text-sm">
                        (Positive Probability ≥ ≤ 20%)
                      </h4>
                      {result.worst.map((data) => {
                        const label = data[0].label;
                        return (
                          <TickerTable
                            key={label}
                            tableId={label}
                            label={getLabelForTimeframe(label, timeframe)}
                            data={data}
                          />
                        );
                      })}
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
