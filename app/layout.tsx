import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { Geist, Geist_Mono } from "next/font/google";
import GoogleOneTap from "@/components/GoogleOneTap";

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
  title: "Secure Rise - Investment Platform",
  description: "You Invest, We Trade - Professional investment platform",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Secure Rise",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Secure Rise",
    title: "Secure Rise - Investment Platform",
    description: "You Invest, We Trade - Professional investment platform",
  },
  twitter: {
    card: "summary",
    title: "Secure Rise - Investment Platform",
    description: "You Invest, We Trade - Professional investment platform",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-152x152.png", sizes: "152x152", type: "image/png" },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
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
      <head>
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans">
        <Providers>
          <GoogleOneTap />
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
