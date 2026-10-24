"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/Logo";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/properties", label: "Properties" },
  { href: "/dashboard/enquiries", label: "Enquiries" },
  { href: "/dashboard/content", label: "Content & Contact" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { token, ready, logout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/dashboard/login";

  useEffect(() => {
    if (!ready || isLogin) return;
    if (!token) router.replace("/dashboard/login");
  }, [ready, token, router, isLogin]);

  if (isLogin) return <>{children}</>;

  if (!ready || !token) {
    return <div className="flex min-h-screen items-center justify-center bg-navy-50">Loading admin...</div>;
  }

  return (
    <div className="min-h-screen bg-navy-50 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-r border-navy-100 bg-white p-6">
        <Logo />
        <p className="mt-2 text-xs uppercase tracking-widest text-gold-600">Admin Dashboard</p>
        <nav className="mt-8 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm font-medium",
                pathname === link.href ? "bg-navy-900 text-white" : "text-navy-700 hover:bg-navy-50",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="mt-8 text-sm font-semibold text-red-600 hover:underline">
          Sign out
        </button>
      </aside>
      <main className="p-6 lg:p-10">{children}</main>
    </div>
  );
}
