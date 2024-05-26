"use client";

import { useState } from "react";

const Home = () => {
  const [ticker, setTicker] = useState("");
  const [data, setData] = useState<any | null>(null);
  const [view, setView] = useState<"monthly" | "weekly">("monthly");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch(`/api/seasonality?ticker=${ticker}`);
    const result = await response.json();
    setData(result);
  };

  const renderBars = (data: any) => {
    return Object.entries(data).map(([label, stats]: [string, any]) => (
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

  return (
    <main className="bg-black py-40 sm:py-24 mx-auto min-h-screen">
      <div className="mx-auto max-w-2xl lg:text-center">
        <h1 className="font-bold text-indigo-600">Stock Seasonality</h1>
        <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          View monthly and weekly stock seasonality!
        </p>
        <p className="mt-9 leading-7 text-white">Just enter ticker(s) below</p>
      </div>
      <div className="max-w-2xl mx-auto px-8 py-18 xs:px-12 sm:p-24 bg-slate-300 rounded-4xl">
        <form onSubmit={handleSubmit}>
          <label className="block" htmlFor="ticker">
            Ticker Symbol
          </label>
          <input
            className="block p-4 w-full"
            type="text"
            id="ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            required
          />
          <button className="p-4 rounded bg-blue-100" type="submit">
            Submit
          </button>
        </form>
        {data && (
          <div>
            <div className="flex justify-center mt-8">
              <button
                className={`px-4 py-2 ${
                  view === "monthly" ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
                onClick={() => setView("monthly")}
              >
                Monthly View
              </button>
              <button
                className={`px-4 py-2 ml-2 ${
                  view === "weekly" ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
                onClick={() => setView("weekly")}
              >
                Weekly View
              </button>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-bold">
                {view === "monthly"
                  ? "Monthly Seasonality"
                  : "Weekly Seasonality"}
              </h2>
              {renderBars(data[view])}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
