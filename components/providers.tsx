'use client';

import { CustomThemeProvider } from "./custom-theme-provider";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CustomThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        storageKey="printer-theme"
      >
        {children}
      </CustomThemeProvider>
    </SessionProvider>
  );
}