"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import CookieConsent from "@/components/landing-page/CookieConsent";
import Footer from "@/components/landing-page/Footer";
import { motion } from "framer-motion";
import { Scale, ShieldCheck, FileText, Gavel, AlertCircle, TrendingUp, Landmark, Coins } from "lucide-react";

export default function TermsAndConditions() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("introduction");

  const sections = [
    { id: "introduction", title: "1. Service Agreement", icon: <FileText className="w-4 h-4" /> },
    { id: "accounts", title: "2. Investor Accounts", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "investment", title: "3. Investment Mechanics", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "bonus", title: "4. Promotional Incentives", icon: <Coins className="w-4 h-4" /> },
    { id: "withdrawals", title: "5. Payout Protocols", icon: <Landmark className="w-4 h-4" /> },
    { id: "risk", title: "6. Risk Disclosure", icon: <AlertCircle className="w-4 h-4" /> },
    { id: "legal", title: "7. Binding Arbitration", icon: <Gavel className="w-4 h-4" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />

      {/* Hero Header */}
      <section className="pt-32 pb-12 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] -z-10 rounded-full" />
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent"
          >
            Terms of Service
          </motion.h2>
          <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed">
            Effective March 23, 2026. This document governs the financial relationship between you and the SECURE RISE investment ecosystem.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-24 flex flex-col lg:flex-row gap-12">
        
        {/* Sticky Sidebar */}
        <aside className="hidden lg:block w-72 sticky top-32 h-fit">
          <div className="bg-card border border-border rounded-3xl p-6 space-y-2 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4 px-2">Legal Framework</p>
            {sections.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  setActiveSection(item.id);
                }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-medium ${
                  activeSection === item.id
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {item.icon}
                {item.title}
              </a>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 max-w-3xl">
          <div className="bg-card border border-border rounded-[2.5rem] p-5 md:p-12 shadow-sm relative">
            
            <div id="introduction" className="scroll-mt-32 mb-16">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                1. Service Agreement
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                1.1. **SECURE RISE** (&quot;The Platform&quot;) provides a sophisticated financial interface that facilitates digital asset trading and automated income topping. By using SECURE RISE, you enter into a binding legal contract regarding the management of your capital.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                1.2. These terms apply to all transactions, trading cycles, and bonus disbursements. Unauthorized use of this platform or attempts to manipulate our trading algorithms will result in immediate termination of services.
              </p>
            </div>

            <div id="accounts" className="scroll-mt-32 mb-16">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                2. Investor Accounts
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                2.1. Participation is restricted to individuals aged 18 or older. SECURE RISE operates a strict anti-money laundering (AML) policy and may request verification at any time.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                2.2. You are solely responsible for the security of your account. SECURE RISE will never ask for your password. Any loss resulting from a compromised personal device or weak password management falls under the user&apos;s liability.
              </p>
            </div>

            <div id="investment" className="scroll-mt-32 mb-16">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                3. Investment Mechanics
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                3.1. When you &quot;buy&quot; an investment package, you are allocating liquidity to the SECURE RISE trading pool. This capital is utilized in high-frequency trading and digital arbitrage.
              </p>
              <blockquote className="border-l-4 border-primary bg-primary/5 p-6 rounded-r-3xl italic text-foreground mb-6">
                &quot;The Platform tops user income daily based on trading performance. These accruals are reflected in your dashboard in real-time but are subject to the specific maturity periods of your selected investment tier.&quot;
              </blockquote>
            </div>

            <div id="bonus" className="scroll-mt-32 mb-16">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                4. Promotional Incentives
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                4.1. **The $20 Registration Bonus:** SECURE RISE offers a non-withdrawable $20 credit upon initial registration. This bonus is designed to act as seed capital to be used within the platform environment.
              </p>
              <div className="p-6 bg-secondary/50 border border-border rounded-2xl">
                <p className="text-sm font-bold text-primary mb-2 uppercase tracking-wide">Withdrawal Eligibility:</p>
                <p className="text-muted-foreground text-sm">
                  The $20 bonus credit becomes eligible for withdrawal only when it is bundled with the payout of your first successful principal investment cycle. Users may not withdraw the bonus independently without a prior active investment.
                </p>
              </div>
            </div>

            <div id="withdrawals" className="scroll-mt-32 mb-16">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                5. Payout Protocols
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                5.1. Withdrawal requests are processed according to the security protocols of SECURE RISE. To prevent fraud, certain withdrawal limits and &quot;cooling-off&quot; periods may apply.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                5.2. Users are responsible for providing correct wallet addresses. SECURE RISE is not responsible for funds sent to incorrect or unsupported destination addresses provided by the user.
              </p>
            </div>

            <div id="risk" className="scroll-mt-32 mb-16">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                6. Risk Disclosure
              </h3>
              <div className="p-8 bg-destructive/5 border border-destructive/20 rounded-[2rem]">
                <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive" /> Financial Responsibility
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Trading digital assets involves substantial risk. Market conditions can be volatile. SECURE RISE does not guarantee a fixed percentage of return, as payouts are dependent on daily trading volume and market outcomes. Past performance is not indicative of future results.
                </p>
              </div>
            </div>

            <div id="legal" className="scroll-mt-32 mb-16">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                7. Binding Arbitration
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                7.1. Any dispute arising from the use of SECURE RISE shall be resolved through binding arbitration. Users waive their right to participate in class-action lawsuits. All decisions made by the platform&apos;s compliance department regarding account audits and fund freezes due to suspected fraud are final.
              </p>
            </div>

          </div>

          <div className="mt-12 p-8 bg-primary/5 border border-primary/20 rounded-[2.5rem] text-center">
            <h4 className="font-bold text-xl mb-2">Secure Your Future</h4>
            <p className="text-muted-foreground mb-6">By clicking &quot;Accept&quot; or using the platform, you agree to the terms above.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-primary-foreground px-10 py-4 rounded-2xl font-black uppercase italic tracking-tighter hover:scale-105 transition-all shadow-lg shadow-primary/20">
                I Agree to Terms
              </button>
            </div>
          </div>
        </div>
      </section>

      <ThemeAndScroll />
      <CookieConsent />
      <Footer />
    </main>
  );
}