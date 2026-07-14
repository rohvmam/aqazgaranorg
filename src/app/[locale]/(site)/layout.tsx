import { getTranslations } from "next-intl/server";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { Footer } from "@/components/site/footer";
import { LoadingScreen } from "@/components/site/loading-screen";
import { Navbar } from "@/components/site/navbar";

// The marketing site is permanently dark-luxury, independent of the
// dashboard theme toggle — hence the forced `dark` scope here.
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("common");

  return (
    <div className="dark bg-background text-foreground min-h-dvh flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-1000 focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
      >
        {t("skipToContent")}
      </a>
      <LoadingScreen />
      <LenisProvider>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </LenisProvider>
    </div>
  );
}
