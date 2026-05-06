// app/page.tsx
"use client";

import Header from "@/components/landing-page/Header";
import Footer from "@/components/landing-page/Footer";
import CookieConsent from "@/components/landing-page/CookieConsent";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import FAQ from "@/components/landing-page/faq";
import HeroSection from "@/components/landing-page/hero-section";
import Promo from "@/components/landing-page/promo";
import LiveMarkets from "@/components/landing-page/LiveMarkets";
import HowItWorks from "@/components/landing-page/how-It-works";
import TradingTools from "@/components/landing-page/trading-tools";
import RiskProtection from "@/components/landing-page/risk-protection";
import TradingView from "@/components/landing-page/trading-view-slide";
import ProfitBlueprint from "@/components/landing-page/profit-blueprint";

export default function HomePage() {
  return (
    <>
      <ThemeAndScroll />
      <Header />

      <main className="min-h-screen pt-0 md:pt-10">
        {/* section 1  */}
        <HeroSection />
        <TradingView />
        <Promo />
        <HowItWorks />
        <TradingTools />
        <LiveMarkets />
        <ProfitBlueprint />
        <FAQ />
        <RiskProtection />
        <TradingView />
      </main>

      <Footer />
      <CookieConsent />
    </>
  );
}
