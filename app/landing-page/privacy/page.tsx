"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import CookieConsent from "@/components/landing-page/CookieConsent";
import Footer from "@/components/landing-page/Footer";
import { motion } from "framer-motion";
import { 
  Gavel, Scale, AlertTriangle, Wallet, 
  RefreshCcw, ShieldAlert, FileText, Ban 
} from "lucide-react";

export default function TermsOfService() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("acceptance");

  const sections = [
    { id: "acceptance", title: "1. Acceptance of Terms", icon: <Scale className="w-4 h-4" /> },
    { id: "eligibility", title: "2. User Eligibility", icon: <FileText className="w-4 h-4" /> },
    { id: "investment", title: "3. Investment & Bonus", icon: <Wallet className="w-4 h-4" /> },
    { id: "trading", title: "4. Trading & Risks", icon: <AlertTriangle className="w-4 h-4" /> },
    { id: "withdrawals", title: "5. Payouts & Fees", icon: <RefreshCcw className="w-4 h-4" /> },
    { id: "security", title: "6. Account Security", icon: <ShieldAlert className="w-4 h-4" /> },
    { id: "prohibited", title: "7. Prohibited Conduct", icon: <Ban className="w-4 h-4" /> },
    { id: "governing", title: "8. Governing Law", icon: <Gavel className="w-4 h-4" /> },
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />

      {/* Hero Header */}
      <section className="pt-32 pb-12 bg-background relative overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] -z-10 rounded-full" />
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter mb-4 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent"
          >
            Terms of Service
          </motion.h2>
          <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed">
            Last Updated: March 2026. Please read these terms carefully before engaging with the Secure Rise investment platform.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-24 flex flex-col lg:flex-row gap-12">
        
        {/* Sticky Sidebar */}
        <aside className="hidden lg:block w-80 sticky top-32 h-fit">
          <div className="bg-card border border-border rounded-3xl p-6 space-y-2 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4 px-2">Legal Sections</p>
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

        {/* Terms Content */}
        <div className="flex-1 max-w-4xl">
          <div className="bg-card border border-border rounded-[2.5rem] p-5 md:p-16 shadow-sm">
            
            {/* Section 1: Acceptance */}
            <div id="acceptance" className="scroll-mt-32 mb-20">
              <h3 className="text-3xl font-black italic tracking-tighter mb-8 flex items-center gap-4">
                <span className="w-2 h-10 bg-primary rounded-full" />
                1. Acceptance of Terms
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                By accessing or using **Secure Rise**, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
              </p>
            </div>

            {/* Section 2: Eligibility */}
            <div id="eligibility" className="scroll-mt-32 mb-20">
              <h3 className="text-3xl font-black italic tracking-tighter mb-8 flex items-center gap-4">
                <span className="w-2 h-10 bg-primary rounded-full" />
                2. User Eligibility
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                You must be at least 18 years of age and have the legal capacity to enter into a binding contract to use Secure Rise. By creating an account, you represent and warrant that you meet these requirements and that all information provided is accurate and truthful.
              </p>
            </div>

            {/* Section 3: Investment & Bonus */}
            <div id="investment" className="scroll-mt-32 mb-20">
              <h3 className="text-3xl font-black italic tracking-tighter mb-8 flex items-center gap-4">
                <span className="w-2 h-10 bg-primary rounded-full" />
                3. Investment & Registration Bonus
              </h3>
              <div className="space-y-6">
                <div className="p-6 bg-secondary/30 rounded-3xl border border-border">
                  <h4 className="font-bold text-xl mb-4 text-primary">The $20 Welcome Credit</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    New users are eligible for a one-time $20 registration bonus. This credit is provided to facilitate initial platform engagement and is strictly restricted until the user completes their first successful investment cycle. The bonus becomes withdrawable only upon the first investment payout.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Minimum investment amounts apply to all packages. Secure Rise reserves the right to modify investment tiers and bonus structures at any time without prior notice.
                </p>
              </div>
            </div>

            {/* Section 4: Risks */}
            <div id="trading" className="scroll-mt-32 mb-20">
              <h3 className="text-3xl font-black italic tracking-tighter mb-8 flex items-center gap-4">
                <span className="w-2 h-10 bg-primary rounded-full" />
                4. Trading & Financial Risk
              </h3>
              <div className="bg-destructive/5 border border-destructive/20 p-8 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-destructive font-bold uppercase tracking-tighter">
                  <AlertTriangle className="w-6 h-6" />
                  Risk Disclosure
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Trading in financial markets involves significant risk. While Secure Rise utilizes advanced algorithms to optimize returns, past performance does not guarantee future results. You acknowledge that you are investing capital at your own risk and Secure Rise is not liable for any market-driven losses.
                </p>
              </div>
            </div>

            {/* Section 5: Withdrawals */}
            <div id="withdrawals" className="scroll-mt-32 mb-20">
              <h3 className="text-3xl font-black italic tracking-tighter mb-8 flex items-center gap-4">
                <span className="w-2 h-10 bg-primary rounded-full" />
                5. Withdrawals & Payouts
              </h3>
              <ul className="grid grid-cols-1 gap-4">
                {[
                  "Withdrawal requests are processed within 24-48 business hours.",
                  "Users must meet the minimum withdrawal threshold as defined in the dashboard.",
                  "The registration bonus is locked until the first investment payout is triggered.",
                  "Secure Rise may apply transaction fees to cover blockchain or banking costs."
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-4 p-5 bg-secondary/50 rounded-2xl border border-border/50">
                    <RefreshCcw className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <span className="text-muted-foreground text-lg">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 6: Account Security */}
            <div id="security" className="scroll-mt-32 mb-20">
              <h3 className="text-3xl font-black italic tracking-tighter mb-8 flex items-center gap-4">
                <span className="w-2 h-10 bg-primary rounded-full" />
                6. Account Security
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                You are responsible for maintaining the confidentiality of your account credentials, including passwords and 2FA keys. Secure Rise will never ask for your password via email or support tickets. Any unauthorized access due to user negligence is the sole responsibility of the account holder.
              </p>
            </div>

            {/* Section 7: Prohibited Conduct */}
            <div id="prohibited" className="scroll-mt-32 mb-20">
              <h3 className="text-3xl font-black italic tracking-tighter mb-8 flex items-center gap-4">
                <span className="w-2 h-10 bg-primary rounded-full" />
                7. Prohibited Conduct
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                Users are strictly prohibited from:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-card border border-border rounded-2xl text-sm text-muted-foreground">
                  • Creating multiple accounts to exploit bonuses.
                </div>
                <div className="p-4 bg-card border border-border rounded-2xl text-sm text-muted-foreground">
                  • Using automated bots to scrap or attack platform API.
                </div>
                <div className="p-4 bg-card border border-border rounded-2xl text-sm text-muted-foreground">
                  • Money laundering or illicit financial activities.
                </div>
                <div className="p-4 bg-card border border-border rounded-2xl text-sm text-muted-foreground">
                  • Providing false identity or financial information.
                </div>
              </div>
            </div>

            {/* Section 8: Governing Law */}
            <div id="governing" className="scroll-mt-32">
              <h3 className="text-3xl font-black italic tracking-tighter mb-8 flex items-center gap-4">
                <span className="w-2 h-10 bg-primary rounded-full" />
                8. Governing Law
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                These terms are governed by and construed in accordance with international financial regulations. Any disputes arising from the use of the platform shall be subject to the exclusive jurisdiction of the appointed arbitration courts.
              </p>
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