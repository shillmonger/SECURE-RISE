// app/page.tsx
"use client";

import GiveAway from "@/components/landing-page/GiveAway";
import Header from "@/components/landing-page/Header";
import Footer from "@/components/landing-page/Footer";
import CookieConsent from "@/components/landing-page/CookieConsent";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import HeroSection from "@/components/landing-page/PredictMarketPage/HeroSection";
import Promo from "@/components/landing-page/promo";
import LiveMarkets from "@/components/landing-page/LiveMarkets";
import NumbersThatSpeaks from "@/components/landing-page/PredictMarketPage/numbers-that-speaks";
import HowItWorks from "@/components/landing-page/PredictMarketPage/how-It-works";
import CoreCapabilities from "@/components/landing-page/PredictMarketPage/CoreCapabilities";
import Network from "@/components/landing-page/PredictMarketPage/Network";
import TradingView from "@/components/landing-page/trading-view-slide";
import FAQ from "@/components/landing-page/PredictMarketPage/faq";
import JoinTelegram from "@/components/landing-page/JoinTelegram";


export default function HomePage() {
  return (
    <>
      <GiveAway />
      <ThemeAndScroll />
      <Header />

      <main className="min-h-screen pt-0 md:pt-10">
        {/* section 1  */}
        <HeroSection />
        <TradingView />
        <Promo />
        <HowItWorks />
        <CoreCapabilities /> 
        <Network /> 
        <LiveMarkets />
        <NumbersThatSpeaks />
        <FAQ />
        <JoinTelegram />
        <TradingView />
      </main>

      <Footer />
      <CookieConsent />
    </>
  );
}
