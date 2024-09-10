# Stock Seasonality App

## Overview

The Stock Seasonality App allows users to enter a ticker symbol for any stock and view the stock's monthly and weekly seasonality. The app uses the past 5 years of data by default and also allows the user to configure a different amount of time (between 1 and 50 years). There are two levels of seasonality available: monthly and weekly.

Each seasonality result displays:

- probability that the stock price will go up for each month
- average percent change for the month
- drawdown percentage for each month

There are also pages to display the best and worst weeks and months for a given stock.

Note that all symbols are based on those used by Yahoo Finance.

## Objectives

- Allow users to input a list of stock ticker symbols.
- Display the stocks' monthly and weekly seasonality data.
- Display the best and worst months and weeks for stocks.
- Allow users to configure the time range for the data analysis.

## Project Setup

### Prerequisites

- Node.js
- Yarn package manager

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/mhynson/seasonality.git
   cd seasonality
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

### Development

1. **Start the development server:**

   ```bash
   yarn dev
   ```

2. **Open the app in your browser:**
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
.
├── README.md
├── TODO.md
├── app
│   ├── public
│   ├── src
│   │   └── app
│   │       ├── api
│   │       │   └── seasonality
│   │       │       ├── route.ts
│   │       │       └── utils.ts
│   │       ├── best-worst-months
│   │       │   └── page.tsx
│   │       ├── best-worst-weeks
│   │       │   └── page.tsx
│   │       ├── components
│   │       ├── constants.ts
│   │       ├── favicon.ico
│   │       ├── globals.css
│   │       ├── interfaces.ts
│   │       ├── layout.tsx
│   │       ├── logo.svg
│   │       ├── page.tsx
│   │       └── types.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── yarn.lock
├── docs
│   └── setup.md
```

### Frontend

- **React with Next.js**: The frontend is built using React with Next.js. We are using the App Router for routing.
- **TypeScript**: We use TypeScript for type safety and better development experience.

### Backend

- **Next.js API Routes**: The backend logic is handled using Next.js API routes. This eliminates the need for a separate Express server.
- **Yahoo Finance API**: We use the `yahoo-finance2` package to fetch a stock's chart data and convert it to historical data. See https://github.com/gadicc/node-yahoo-finance2/issues/795

## Technical Architecture

### Frontend

- **Next.js**: Utilizes the App Router for modular and file-based routing.
- **React**: Handles the client-side rendering and interactive components.
- **TypeScript**: Provides static type checking to improve code quality.

### Backend

- **Next.js API Routes**: Handles server-side logic and API endpoints.
- **Yahoo Finance API**: Fetches historical stock data for analysis.
- **TypeScript**: Ensures type safety and better code maintainability.

---
