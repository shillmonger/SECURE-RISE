'use client';

import { CustomThemeProvider } from "./custom-theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CustomThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="printer-theme"
    >
      {children}
    </CustomThemeProvider>
  );
}