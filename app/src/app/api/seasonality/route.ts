import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

import { calculateSeasonality, formatDate } from "./utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker");

  if (!ticker) {
    return NextResponse.json(
      { error: "Must enter a ticker!" },
      { status: 400 }
    );
  }

  // Get the current date and calculate the start date (5 years ago)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 4);
  startDate.setDate(1);
  startDate.setMonth(0);

  try {
    // Fetch historical data from Yahoo Finance
    const options = {
      period1: formatDate(startDate),
      period2: formatDate(endDate),
    };

    const weeklyResult = await yahooFinance.historical(ticker, {
      ...options,
      interval: "1wk",
    });
    const monthlyResult = await yahooFinance.historical(ticker, {
      ...options,
      interval: "1mo",
    });

    // Calculate seasonality based on the fetched data
    const weeklySeasonality = calculateSeasonality("weekly", weeklyResult);
    const monthlySeasonality = calculateSeasonality("monthly", monthlyResult);
    return NextResponse.json({
      weekly: weeklySeasonality,
      monthly: monthlySeasonality,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}
