import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { Geist, Geist_Mono } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: "variable",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: "variable",
});

export const metadata = {
  title: "Secure Rise",
  description: "You Invest, We Trade",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground font-sans">
        <Providers>
          <div className="min-h-screen transition-colors duration-300">
            {children}

            <Toaster
              position="top-center"
              closeButton={false}
              richColors={false}
              toastOptions={{
                className: `
      bg-transparent
      border-0
      shadow-none
      rounded-none
      p-0
      text-sm
      font-medium
    `,
                classNames: {
                  toast: "!text-foreground",
                  success: "!text-green-500",
                  error: "!text-red-500",
                  info: "!text-yellow-500",
                  description: "hidden",
                  actionButton: "hidden",
                  cancelButton: "hidden",
                },
              }}
            />
          </div>
        </Providers>
      </body>
    </html>
  );
}
