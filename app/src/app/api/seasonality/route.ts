import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

import { LOOKBACK_YEARS } from "@/app/constants";
import { HistoricalRowHistory } from "@/app/interfaces";

import { calculateSeasonality, formatDate } from "./utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker");
  const timeframeType = searchParams.get("timeframe");
  const yearsParams = searchParams.get("years");

  const years = parseInt(yearsParams || `${LOOKBACK_YEARS}`, 10);

  if (!ticker) {
    return NextResponse.json([{ error: "Must enter a ticker!" }], {
      status: 400,
    });
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - years);

  try {
    const options = {
      period1: formatDate(startDate),
      period2: formatDate(endDate),
    };

    const results = [];

    if (timeframeType === "weekly" || !timeframeType) {
      const timeframe = "weekly";
      const weeklyResult = await yahooFinance.chart(ticker, {
        ...options,
        interval: "1wk",
      });

      const quotes = weeklyResult.quotes
        .map((quote) => ({
          ...quote,
          open: quote.open || null,
          high: quote.high || null,
          low: quote.low || null,
          close: quote.close || null,
          volume: quote.volume || null,
        }))
        .filter(
          (dailyQuote) => dailyQuote.low !== null || dailyQuote.high !== null
        ) as HistoricalRowHistory[];

      results.push({
        timeframe,
        results: calculateSeasonality(timeframe, quotes, years),
      });
    }

    if (timeframeType === "monthly" || !timeframeType) {
      const timeframe = "monthly";
      const monthlyResult = await yahooFinance.chart(ticker, {
        ...options,
        interval: "1mo",
      });

      const quotes = monthlyResult.quotes
        .map((quote) => ({
          ...quote,
          open: quote.open || null,
          high: quote.high || null,
          low: quote.low || null,
          close: quote.close || null,
          volume: quote.volume || null,
        }))
        .filter(
          (dailyQuote) => dailyQuote.low !== null || dailyQuote.high !== null
        ) as HistoricalRowHistory[];

      results.push({
        timeframe,
        results: calculateSeasonality(timeframe, quotes, years),
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      [{ error: `No stock data for ticker: "${ticker}".` }],
      {
        status: 500,
      }
    );
  }
}
