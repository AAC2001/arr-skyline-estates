"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const KEY = "arr_favorites";

type Ctx = {
  favorites: string[];
  toggle: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
};

const FavoritesContext = createContext<Ctx | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(favorites));
  }, [favorites]);

  const value = useMemo(
    () => ({
      favorites,
      toggle: (slug: string) =>
        setFavorites((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug])),
      isFavorite: (slug: string) => favorites.includes(slug),
    }),
    [favorites],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
