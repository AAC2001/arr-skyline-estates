"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const KEY = "arr_compare";

type Ctx = {
  compare: string[];
  toggle: (slug: string) => void;
  isCompared: (slug: string) => boolean;
  clear: () => void;
};

const CompareContext = createContext<Ctx | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compare, setCompare] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setCompare(JSON.parse(raw));
    } catch {
      setCompare([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(compare));
  }, [compare]);

  const value = useMemo(
    () => ({
      compare,
      toggle: (slug: string) =>
        setCompare((prev) => {
          if (prev.includes(slug)) return prev.filter((s) => s !== slug);
          if (prev.length >= 4) return prev;
          return [...prev, slug];
        }),
      isCompared: (slug: string) => compare.includes(slug),
      clear: () => setCompare([]),
    }),
    [compare],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
