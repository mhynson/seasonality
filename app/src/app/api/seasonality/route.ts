import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

const calculateSeasonality = (data: any[]) => {
  const monthlyData = {};
  const weeklyData = {};

  data.forEach(entry => {
    const date = new Date(entry.date);
    const month = date.getMonth();
    const week = getWeekNumber(date); // Implement getWeekNumber to calculate the week of the year

    if (!monthlyData[month]) {
      monthlyData[month] = { changes: [], countUp: 0 };
    }
    if (!weeklyData[week]) {
      weeklyData[week] = { changes: [], countUp: 0 };
    }

    const changePercent = ((entry.close - entry.open) / entry.open) * 100;
    monthlyData[month].changes.push(changePercent);
    weeklyData[week].changes.push(changePercent);

    if (changePercent > 0) {
      monthlyData[month].countUp += 1;
      weeklyData[week].countUp += 1;
    }
  });

  const monthly = Object.keys(monthlyData).map(month => {
    const changes = monthlyData[month].changes;
    const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    const probabilityUp = (monthlyData[month].countUp / changes.length) * 100;
    return { month: parseInt(month), avgChange, probabilityUp };
  });

  const weekly = Object.keys(weeklyData).map(week => {
    const changes = weeklyData[week].changes;
    const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    const probabilityUp = (weeklyData[week].countUp / changes.length) * 100;
    return { week: parseInt(week), avgChange, probabilityUp };
  });

  return { monthly, weekly };
};

const getWeekNumber = (date: Date) => {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000);
  const oneDay = 86400000;
  return Math.floor(diff / oneDay / 7);
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get('ticker');

  if (!ticker) {
    return NextResponse.json({ error: 'Invalid ticker' }, { status: 400 });
  }

  // Get the current date and calculate the start date (5 years ago)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 5);
  startDate.setDate(1);
  startDate.setMonth(0);

  // Format dates to YYYY-MM-DD
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  console.log(formattedStartDate);

  try {
    // Fetch historical data from Yahoo Finance
    const queryOptions = { period1: formattedStartDate, period2: formattedEndDate, interval: '1d' };
    const result = await yahooFinance.historical(ticker, queryOptions);

    // Calculate seasonality based on the fetched data
    const seasonality = calculateSeasonality(result);
    return NextResponse.json(seasonality);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
}
