import { createContext, useContext, useState } from "react";

const MAX_COMPARE = 4;

interface CompareProduct {
  id: string | number;
  [key: string]: any;
}

interface CompareContextType {
  compareList: CompareProduct[];
  toggleCompare: (product: CompareProduct) => void;
  isInCompare: (id: string | number) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | null>(null);

export const CompareProvider = ({ children }: { children: React.ReactNode }) => {
  const [compareList, setCompareList] = useState<CompareProduct[]>([]);

  const toggleCompare = (product: CompareProduct) => {
    setCompareList((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev.filter((item) => item.id !== product.id);
      if (prev.length >= MAX_COMPARE) {
        alert(`You can compare up to ${MAX_COMPARE} products at a time.`);
        return prev;
      }
      return [...prev, product];
    });
  };

  const isInCompare = (id: string | number) =>
    compareList.some((item) => item.id === id);

  const clearCompare = () => setCompareList([]);

  return (
    <CompareContext.Provider value={{ compareList, toggleCompare, isInCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used inside CompareProvider");
  return context;
};
