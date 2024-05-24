// app/page.tsx
"use client";

import { useState } from "react";

const Home = () => {
  const [ticker, setTicker] = useState("");
  const [data, setData] = useState(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch(`/api/seasonality?ticker=${ticker}`);
    const result = await response.json();
    setData(result);
  };

  return (
    <div>
      <h1>Stock Seasonality App</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="ticker">Ticker Symbol:</label>
        <input
          type="text"
          id="ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {data && (
        <div>
          <h2>Seasonality Data</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Home;
