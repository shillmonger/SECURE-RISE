"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import CookieConsent from "@/components/landing-page/CookieConsent";
import Footer from "@/components/landing-page/Footer";
import {
  Gavel, Scale, AlertTriangle, Wallet,
  RefreshCcw, ShieldAlert, FileText, Ban,
} from "lucide-react";

const sections = [
  { id: "acceptance",  title: "1. Acceptance of Terms",     icon: <Scale className="w-4 h-4" /> },
  { id: "eligibility", title: "2. User Eligibility",         icon: <FileText className="w-4 h-4" /> },
  { id: "investment",  title: "3. Investment & Bonus",       icon: <Wallet className="w-4 h-4" /> },
  { id: "trading",     title: "4. Trading & Risks",          icon: <AlertTriangle className="w-4 h-4" /> },
  { id: "withdrawals", title: "5. Payouts & Fees",           icon: <RefreshCcw className="w-4 h-4" /> },
  { id: "security",    title: "6. Account Security",         icon: <ShieldAlert className="w-4 h-4" /> },
  { id: "prohibited",  title: "7. Prohibited Conduct",       icon: <Ban className="w-4 h-4" /> },
  { id: "governing",   title: "8. Governing Law",            icon: <Gavel className="w-4 h-4" /> },
];

export default function TermsOfService() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("acceptance");

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
              "url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')",
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
              Legal
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
            Last Updated: March 2026. Please read these terms carefully before engaging with the Secure Rise investment platform.
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
              Legal Sections
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

        {/* Terms Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-card border border-border rounded-[2rem] px-4 py-6 md:p-15 shadow-sm space-y-20">

            {/* ── 1. Acceptance ── */}
            <div id="acceptance" className="scroll-mt-32">
              <SectionHeading>1. Acceptance of Terms</SectionHeading>
              <p className="text-muted-foreground leading-relaxed text-lg">
                By accessing or using <strong className="text-foreground">Secure Rise</strong>, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
              </p>
            </div>

            {/* ── 2. Eligibility ── */}
            <div id="eligibility" className="scroll-mt-32">
              <SectionHeading>2. User Eligibility</SectionHeading>
              <p className="text-muted-foreground leading-relaxed text-lg">
                You must be at least 18 years of age and have the legal capacity to enter into a binding contract to use Secure Rise. By creating an account, you represent and warrant that you meet these requirements and that all information provided is accurate and truthful.
              </p>
            </div>

            {/* ── 3. Investment & Bonus ── */}
            <div id="investment" className="scroll-mt-32">
              <SectionHeading>3. Investment &amp; Registration Bonus</SectionHeading>
              <div className="space-y-6">
                <div className="p-6 bg-primary/5 rounded-3xl border border-primary/20">
                  <h4 className="font-bold text-xl mb-3 text-primary">The $20 Welcome Credit</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    New users are eligible for a one-time $20 registration bonus. This credit is provided to facilitate initial platform engagement and is strictly restricted until the user completes their first successful investment cycle. The bonus becomes withdrawable only upon the first investment payout.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Minimum investment amounts apply to all packages. Secure Rise reserves the right to modify investment tiers and bonus structures at any time without prior notice.
                </p>
              </div>
            </div>

            {/* ── 4. Trading & Risks ── */}
            <div id="trading" className="scroll-mt-32">
              <SectionHeading>4. Trading &amp; Financial Risk</SectionHeading>
              <div className="bg-destructive/5 border border-destructive/20 p-8 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-destructive font-bold uppercase tracking-tighter">
                  <AlertTriangle className="w-5 h-5" />
                  Risk Disclosure
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Trading in financial markets involves significant risk. While Secure Rise utilizes advanced algorithms to optimize returns, past performance does not guarantee future results. You acknowledge that you are investing capital at your own risk and Secure Rise is not liable for any market-driven losses.
                </p>
              </div>
            </div>

            {/* ── 5. Withdrawals ── */}
            <div id="withdrawals" className="scroll-mt-32">
              <SectionHeading>5. Withdrawals &amp; Payouts</SectionHeading>
              <ul className="grid grid-cols-1 gap-4">
                {[
                  "Withdrawal requests are processed within 24–48 business hours.",
                  "Users must meet the minimum withdrawal threshold as defined in the dashboard.",
                  "The registration bonus is locked until the first investment payout is triggered.",
                  "Secure Rise may apply transaction fees to cover blockchain or banking costs.",
                ].map((text, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 p-5 bg-secondary/50 rounded-2xl border border-border/50"
                  >
                    <RefreshCcw className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── 6. Account Security ── */}
            <div id="security" className="scroll-mt-32">
              <SectionHeading>6. Account Security</SectionHeading>
              <p className="text-muted-foreground leading-relaxed text-lg">
                You are responsible for maintaining the confidentiality of your account credentials, including passwords and 2FA keys. Secure Rise will never ask for your password via email or support tickets. Any unauthorized access due to user negligence is the sole responsibility of the account holder.
              </p>
            </div>

            {/* ── 7. Prohibited Conduct ── */}
            <div id="prohibited" className="scroll-mt-32">
              <SectionHeading>7. Prohibited Conduct</SectionHeading>
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                Users are strictly prohibited from engaging in any of the following activities:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Creating multiple accounts to exploit bonuses.",
                  "Using automated bots to scrape or attack the platform API.",
                  "Money laundering or illicit financial activities.",
                  "Providing false identity or financial information.",
                ].map((text, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 bg-card border border-border rounded-2xl text-sm text-muted-foreground"
                  >
                    <Ban className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* ── 8. Governing Law ── */}
            <div id="governing" className="scroll-mt-32">
              <SectionHeading>8. Governing Law</SectionHeading>
              <p className="text-muted-foreground leading-relaxed text-lg">
                These terms are governed by and construed in accordance with international financial regulations. Any disputes arising from the use of the platform shall be subject to the exclusive jurisdiction of the appointed arbitration courts.
              </p>
            </div>

          </div>

          {/* Bottom divider */}
          <div className="flex items-center gap-4 mt-12">
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