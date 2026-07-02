'use client';

import { CustomThemeProvider } from "./custom-theme-provider";
import { SessionProvider } from "next-auth/react";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CurrencyProvider>
        <CustomThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="printer-theme"
        >
          {children}
        </CustomThemeProvider>
      </CurrencyProvider>
    </SessionProvider>
  );
}