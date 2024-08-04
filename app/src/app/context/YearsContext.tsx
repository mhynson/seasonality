"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { LOOKBACK_YEARS } from "../constants";

export type YearsContextType = {
  years: number;
  setYears: React.Dispatch<React.SetStateAction<number>>;
};

export const YearsContext = createContext<YearsContextType | null>(null);

export const YearsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [years, setYears] = useState<number>(LOOKBACK_YEARS);
  const context: YearsContextType = { years, setYears };
  return (
    <YearsContext.Provider value={context}>{children}</YearsContext.Provider>
  );
};

export const useYears = (): YearsContextType => {
  const context = useContext(YearsContext);
  if (!context) {
    throw new Error("useYears must be used within a YearsProvider");
  }
  return context;
};
