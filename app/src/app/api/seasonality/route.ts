import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

import { calculateSeasonality, formatDate } from "./utils";
import { LOOKBACK_YEARS } from "@/app/constants";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker");

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

    const weeklyResult = await yahooFinance.historical(ticker, {
      ...options,
      interval: "1wk",
    });
    const monthlyResult = await yahooFinance.historical(ticker, {
      ...options,
      interval: "1mo",
    });

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
