import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

import { calculateSeasonality, formatDate } from "./utils";
import { LOOKBACK_YEARS } from "@/app/constants";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker");
  const timeframeType = searchParams.get("timeframe");

  if (!ticker) {
    return NextResponse.json(
      { error: "Must enter a ticker!" },
      { status: 400 }
    );
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - LOOKBACK_YEARS);

  try {
    const options = {
      period1: formatDate(startDate),
      period2: formatDate(endDate),
    };

    const results = [];

    if (timeframeType === "weekly" || !timeframeType) {
      const timeframe = "weekly";
      const weeklyResult = await yahooFinance.historical(ticker, {
        ...options,
        interval: "1wk",
      });
      results.push({
        timeframe,
        results: calculateSeasonality(timeframe, weeklyResult),
      });
    }

    if (timeframeType === "monthly" || !timeframeType) {
      const timeframe = "monthly";
      const monthlyResult = await yahooFinance.historical(ticker, {
        ...options,
        interval: "1mo",
      });
      results.push({
        timeframe,
        results: calculateSeasonality(timeframe, monthlyResult),
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}
