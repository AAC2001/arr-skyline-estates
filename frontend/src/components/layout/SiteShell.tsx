import { fetchSiteSettings } from "@/lib/api";
import { FloatingActions } from "@/components/FloatingActions";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CompareProvider } from "@/context/CompareContext";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const settings = await fetchSiteSettings();

  return (
    <FavoritesProvider>
      <CompareProvider>
        <Header />
        <main>{children}</main>
        <Footer settings={settings} />
        <FloatingActions settings={settings} />
      </CompareProvider>
    </FavoritesProvider>
  );
}
