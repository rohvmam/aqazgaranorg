"use client";

import { DirectionProvider } from "@radix-ui/react-direction";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({
  children,
  dir,
}: {
  children: React.ReactNode;
  dir: "ltr" | "rtl";
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <DirectionProvider dir={dir}>
        <QueryClientProvider client={queryClient}>
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
          <Toaster position={dir === "rtl" ? "bottom-left" : "bottom-right"} />
        </QueryClientProvider>
      </DirectionProvider>
    </ThemeProvider>
  );
}
