"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLoginPage() {
  const { login, token } = useAdminAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) router.replace("/dashboard");
  }, [token, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(username, password);
      router.push("/dashboard");
    } catch {
      setError("Invalid credentials. Use your Django staff account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="font-display text-2xl text-navy-900">ARR Skyline Admin</h1>
        <p className="mt-2 text-sm text-navy-600">Secure staff login — credentials are never stored in frontend code.</p>
        <div className="mt-6 space-y-4">
          <input className="field" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input
            className="field"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} className="mt-6 w-full">
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
