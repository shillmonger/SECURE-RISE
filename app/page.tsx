// app/page.tsx
"use client";

import Header from "@/components/landing-page/Header";
import Footer from "@/components/landing-page/Footer";
import CookieConsent from "@/components/landing-page/CookieConsent";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import HeroSection from "@/components/landing-page/hero-section";
import Promo from "@/components/landing-page/promo";
import NumbersThatSpeaks from "@/components/landing-page/numbers-that-speaks";
import HowItWorks from "@/components/landing-page/how-It-works";
import FAQ from "@/components/landing-page/faq";
import RiskProtection from "@/components/landing-page/risk-protection";
import ProfitBlueprint from "@/components/landing-page/profit-blueprint";

export default function HomePage() {
  return (
    <>
      <ThemeAndScroll />
      <Header />

      <main className="min-h-screen pt-0 md:pt-10">
        {/* section 1  */}
        <HeroSection />

        {/* section 2 */}
        <Promo />

        {/* section 3 */}
        <NumbersThatSpeaks />

        {/* section 4 */}
        <HowItWorks/>

        {/* section 5 */}
        <ProfitBlueprint />

        {/* section 6 */}
        <FAQ />

        {/* section 7 */}
        <RiskProtection />
      </main>

      <Footer />
      <CookieConsent />
    </>
  );
}
