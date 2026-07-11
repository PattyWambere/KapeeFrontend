import { createContext, useContext, useState, type ReactNode } from 'react';

export type CurrencyType = "USD" | "EUR" | "GBP" | "RWF";

interface CurrencyContextType {
  currency: CurrencyType;
  symbol: string;
  setCurrency: (currency: CurrencyType) => void;
  convertPrice: (priceInUSD: number) => string;
}

const exchangeRates: Record<CurrencyType, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  RWF: 1300,
};

const currencySymbols: Record<CurrencyType, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  RWF: "FRW ",
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<CurrencyType>(() => {
    const saved = localStorage.getItem("gurafaster_currency");
    return (saved as CurrencyType) || "USD";
  });

  const setCurrency = (newCurrency: CurrencyType) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("gurafaster_currency", newCurrency);
  };

  const convertPrice = (priceInUSD: number): string => {
    const rate = exchangeRates[currency];
    const converted = priceInUSD * rate;
    const symbol = currencySymbols[currency];
    
    // RWF is usually formatted without decimal places
    if (currency === "RWF") {
      return `${symbol}${Math.round(converted).toLocaleString()}`;
    }
    
    return `${symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        symbol: currencySymbols[currency],
        setCurrency,
        convertPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
