"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import CookieConsent from "@/components/landing-page/CookieConsent";
import Footer from "@/components/landing-page/Footer";
import {
  Scale, ShieldCheck, FileText, Gavel,
  AlertCircle, TrendingUp, Landmark, Coins,
} from "lucide-react";

const sections = [
  { id: "introduction", title: "1. Service Agreement",       icon: <FileText className="w-4 h-4" /> },
  { id: "accounts",     title: "2. Investor Accounts",       icon: <ShieldCheck className="w-4 h-4" /> },
  { id: "investment",   title: "3. Investment Mechanics",    icon: <TrendingUp className="w-4 h-4" /> },
  { id: "bonus",        title: "4. Promotional Incentives",  icon: <Coins className="w-4 h-4" /> },
  { id: "withdrawals",  title: "5. Payout Protocols",        icon: <Landmark className="w-4 h-4" /> },
  { id: "risk",         title: "6. Risk Disclosure",         icon: <AlertCircle className="w-4 h-4" /> },
  { id: "legal",        title: "7. Binding Arbitration",     icon: <Gavel className="w-4 h-4" /> },
];

export default function TermsAndConditions() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("introduction");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 120;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight) {
          setActiveSection(section.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      <Header />

      {/* ── Hero (same style as About Us) ────────────────────────── */}
      <section className="relative h-[55vh] w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/80" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-3 py-1.5 mb-5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-white/80">
              Legal Framework
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-5 text-white"
          >
            Terms of Service
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base md:text-lg font-light tracking-wide text-white/75 max-w-xl mx-auto leading-relaxed"
          >
            Effective March 23, 2026. This document governs the financial relationship between you and the Secure Rise investment ecosystem.
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">
            Scroll
          </span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </section>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-20 flex flex-col lg:flex-row gap-12 w-full">

        {/* Sticky Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-32 bg-card border border-border rounded-3xl p-6 shadow-sm space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 px-2">
              Legal Framework
            </p>
            {sections.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-primary/10 text-primary border-primary pl-2"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.title}
              </button>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0 space-y-6">
          <div className="bg-card border border-border rounded-[2rem] px-4 py-6 md:p-15 shadow-sm space-y-20">

            {/* ── 1. Service Agreement ── */}
            <div id="introduction" className="scroll-mt-32">
              <SectionHeading>1. Service Agreement</SectionHeading>
              <div className="space-y-4">
                <Clause number="1.1">
                  <strong className="text-foreground">SECURE RISE</strong> (&ldquo;The Platform&rdquo;) provides a sophisticated financial interface that facilitates digital asset trading and automated income generation. By using Secure Rise, you enter into a binding legal contract regarding the management of your capital.
                </Clause>
                <Clause number="1.2">
                  These terms apply to all transactions, trading cycles, and bonus disbursements. Unauthorized use of this platform or attempts to manipulate our trading algorithms will result in immediate termination of services.
                </Clause>
              </div>
            </div>

            {/* ── 2. Investor Accounts ── */}
            <div id="accounts" className="scroll-mt-32">
              <SectionHeading>2. Investor Accounts</SectionHeading>
              <div className="space-y-4">
                <Clause number="2.1">
                  Participation is restricted to individuals aged 18 or older. Secure Rise operates a strict anti-money laundering (AML) policy and may request identity verification at any time.
                </Clause>
                <Clause number="2.2">
                  You are solely responsible for the security of your account. Secure Rise will never ask for your password. Any loss resulting from a compromised personal device or weak password management falls under the user&apos;s liability.
                </Clause>
              </div>
            </div>

            {/* ── 3. Investment Mechanics ── */}
            <div id="investment" className="scroll-mt-32">
              <SectionHeading>3. Investment Mechanics</SectionHeading>
              <div className="space-y-6">
                <Clause number="3.1">
                  When you &ldquo;buy&rdquo; an investment package, you are allocating liquidity to the Secure Rise trading pool. This capital is utilized in high-frequency trading and digital arbitrage.
                </Clause>
                <blockquote className="border-l-4 border-primary bg-primary/5 px-6 py-5 rounded-r-3xl italic text-foreground/80 leading-relaxed">
                  &ldquo;The Platform tops user income daily based on trading performance. These accruals are reflected in your dashboard in real-time but are subject to the specific maturity periods of your selected investment tier.&rdquo;
                </blockquote>
              </div>
            </div>

            {/* ── 4. Promotional Incentives ── */}
            <div id="bonus" className="scroll-mt-32">
              <SectionHeading>4. Promotional Incentives</SectionHeading>
              <div className="space-y-6">
                <Clause number="4.1">
                  <strong className="text-foreground">The $20 Registration Bonus:</strong> Secure Rise offers a one-time $20 credit upon initial registration. This bonus is designed to act as seed capital to be used within the platform environment.
                </Clause>
                <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl space-y-2">
                  <p className="text-sm font-bold text-primary uppercase tracking-widest">
                    Withdrawal Eligibility
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    The $20 bonus credit becomes eligible for withdrawal only when bundled with the payout of your first successful principal investment cycle. Users may not withdraw the bonus independently without a prior active investment.
                  </p>
                </div>
              </div>
            </div>

            {/* ── 5. Payout Protocols ── */}
            <div id="withdrawals" className="scroll-mt-32">
              <SectionHeading>5. Payout Protocols</SectionHeading>
              <div className="space-y-4">
                <Clause number="5.1">
                  Withdrawal requests are processed according to the security protocols of Secure Rise. To prevent fraud, certain withdrawal limits and &ldquo;cooling-off&rdquo; periods may apply.
                </Clause>
                <Clause number="5.2">
                  Users are responsible for providing correct wallet addresses. Secure Rise is not responsible for funds sent to incorrect or unsupported destination addresses provided by the user.
                </Clause>
              </div>
            </div>

            {/* ── 6. Risk Disclosure ── */}
            <div id="risk" className="scroll-mt-32">
              <SectionHeading>6. Risk Disclosure</SectionHeading>
              <div className="p-8 bg-destructive/5 border border-destructive/20 rounded-[2rem] space-y-4">
                <div className="flex items-center gap-2 text-destructive font-bold uppercase tracking-tighter">
                  <AlertCircle className="w-5 h-5" />
                  Financial Responsibility
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Trading digital assets involves substantial risk. Market conditions can be volatile. Secure Rise does not guarantee a fixed percentage of return, as payouts are dependent on daily trading volume and market outcomes. Past performance is not indicative of future results.
                </p>
              </div>
            </div>

            {/* ── 7. Binding Arbitration ── */}
            <div id="legal" className="scroll-mt-32">
              <SectionHeading>7. Binding Arbitration</SectionHeading>
              <Clause number="7.1">
                Any dispute arising from the use of Secure Rise shall be resolved through binding arbitration. Users waive their right to participate in class-action lawsuits. All decisions made by the platform&apos;s compliance department regarding account audits and fund freezes due to suspected fraud are final.
              </Clause>
            </div>

          </div>

          {/* ── CTA footer card ── */}
          <div className="p-8 md:p-10 bg-primary/5 border border-primary/20 rounded-[1.5rem] text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-5">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-black text-2xl italic uppercase tracking-tighter mb-2">
              Secure Your Future
            </h4>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              By clicking &ldquo;Accept&rdquo; or using the platform, you agree to the terms above.
            </p>
            <button className="bg-primary cursor-pointer text-primary-foreground px-10 py-4 rounded-2xl font-black uppercase italic tracking-tighter hover:scale-105 transition-all shadow-lg shadow-primary/20">
              I Agree to Terms
            </button>
          </div>

          {/* Bottom divider */}
          <div className="flex items-center gap-4 mt-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium whitespace-nowrap">
              Secure Rise
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>
      </section>

      <ThemeAndScroll />
      <CookieConsent />
      <Footer />
    </main>
  );
}

/* ── Reusable section heading ───────────────────────────────── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-2xl font-black tracking-tighter mb-8 flex items-center gap-4">
      <span className="w-1 h-10 bg-primary rounded-full shrink-0" />
      {children}
    </h3>
  );
}

/* ── Numbered clause row ────────────────────────────────────── */
function Clause({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="text-[11px] font-bold text-primary/60 uppercase tracking-widest mt-1 shrink-0 w-6">
        {number}
      </span>
      <p className="text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}