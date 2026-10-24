"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginAdmin } from "@/lib/api";

type Ctx = {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  ready: boolean;
};

const AdminAuthContext = createContext<Ctx | null>(null);
const KEY = "arr_admin_token";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem(KEY));
    setReady(true);
  }, []);

  const value = useMemo(
    () => ({
      token,
      ready,
      login: async (username: string, password: string) => {
        const res = await loginAdmin(username, password);
        localStorage.setItem(KEY, res.access);
        setToken(res.access);
      },
      logout: () => {
        localStorage.removeItem(KEY);
        setToken(null);
      },
    }),
    [token, ready],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
