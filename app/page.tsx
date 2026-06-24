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
import CoreCapabilities from "@/components/landing-page/CoreCapabilities";
import RiskProtection from "@/components/landing-page/risk-protection";
import OurTools from "@/components/landing-page/OurTools";
import TradingView from "@/components/landing-page/trading-view-slide";
import ProfitBlueprint from "@/components/landing-page/profit-blueprint";
import NumbersThatSpeaks from "@/components/landing-page/numbers-that-speaks";


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
        <CoreCapabilities />
        <NumbersThatSpeaks />
        <TradingView />
        <ProfitBlueprint />
        {/* <LiveMarkets /> */}
       <div className="hidden lg:block">
  <OurTools />
</div>
        <RiskProtection />
        <FAQ />
        <TradingView />
      </main>

      <Footer />
      <CookieConsent />
    </>
  );
}
