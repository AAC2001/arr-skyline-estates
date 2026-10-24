import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { AdminShell } from "@/components/dashboard/AdminShell";

export const metadata = { title: "Admin Dashboard" };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
