// app/page.tsx
"use client";

import Header from "@/components/landing-page/Header";
import Footer from "@/components/landing-page/Footer";
import CookieConsent from "@/components/landing-page/CookieConsent";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import HeroSection from "@/components/landing-page/hero-section";
import Promo from "@/components/landing-page/promo";
import StatsGrid from "@/components/landing-page/stats-grid";
import WhyPlatformSection from "@/components/landing-page/why-platform-section";
import FAQ from "@/components/landing-page/faq";
import RiskProtection from "@/components/landing-page/risk-protection";

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
        <StatsGrid />

        {/* section 4 */}
        <WhyPlatformSection />

        {/* section 5 */}
        <FAQ />

        {/* section 6 */}
        <RiskProtection />
      </main>

      <Footer />
      <CookieConsent />
    </>
  );
}
