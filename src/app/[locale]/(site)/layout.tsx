import { LenisProvider } from "@/components/providers/lenis-provider";

// The marketing site is permanently dark-luxury, independent of the
// dashboard theme toggle — hence the forced `dark` scope here.
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark bg-background text-foreground min-h-dvh flex flex-col">
      <LenisProvider>{children}</LenisProvider>
    </div>
  );
}
