Sure! Here's the updated README to reflect that we're using Next.js with the App Router.

---

# Stock Seasonality App

## Overview

The Stock Seasonality App allows users to enter a ticker symbol for any stock and view the stock's monthly and weekly seasonality. The app uses the past 5 years of data by default but allows the user to configure a different amount of time (e.g., 2 years, 20 years, 10 years, etc.). The monthly seasonality displays each of the 12 months, the average percent change for the month, and the probability that the stock price will go up for each month. The weekly seasonality displays data for each of the 52 weeks in a year and includes the average percent change and the probability that the stock price will go up for each week.

## Objectives

- Allow users to input a stock ticker symbol.
- Display the stock's monthly seasonality data.
- Display the stock's weekly seasonality data.
- Allow users to configure the time range for the data analysis.

## Project Setup

### Prerequisites

- Node.js
- Yarn package manager

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/stock-seasonality-app.git
   cd stock-seasonality-app
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
stock-seasonality-app
│
├── app
│   ├── api
│   │   └── seasonality
│   │       └── route.ts
│   └── page.tsx
│
├── node_modules
├── public
├── styles
├── .gitignore
├── next-env.d.ts
├── next.config.js
├── package.json
├── tsconfig.json
└── yarn.lock
```

### Frontend

- **React with Next.js**: The frontend is built using React with Next.js. We are using the App Router for routing.
- **TypeScript**: We use TypeScript for type safety and better development experience.

### Backend

- **Next.js API Routes**: The backend logic is handled using Next.js API routes. This eliminates the need for a separate Express server.
- **Yahoo Finance API**: We use the `yahoo-finance2` package to fetch historical stock data.

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
