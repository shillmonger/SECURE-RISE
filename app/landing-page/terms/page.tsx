"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import GiveAway from "@/components/landing-page/GiveAway";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import CookieConsent from "@/components/landing-page/CookieConsent";
import Footer from "@/components/landing-page/Footer";
import {
  Scale, ShieldCheck, FileText, Gavel,
  AlertCircle, TrendingUp, Landmark, Coins,
  ChevronRight,
} from "lucide-react";

const sections = [
  { id: "introduction", title: "Service Agreement",      icon: FileText },
  { id: "accounts",     title: "Investor Accounts",      icon: ShieldCheck },
  { id: "investment",   title: "Investment Mechanics",   icon: TrendingUp },
  { id: "bonus",        title: "Promotional Incentives", icon: Coins },
  { id: "withdrawals",  title: "Payout Protocols",       icon: Landmark },
  { id: "risk",         title: "Risk Disclosure",        icon: AlertCircle },
  { id: "legal",        title: "Binding Arbitration",    icon: Gavel },
];

export default function TermsAndConditions() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("introduction");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 140;
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

  const activeIndex = sections.findIndex((s) => s.id === activeSection);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      <GiveAway />
      <Header />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative h-[30vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/90" />

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto mt-20">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 backdrop-blur-sm px-4 py-1.5 mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
              Legal Framework
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black uppercase  tracking-tighter mb-5 text-white leading-none"
          >
            Terms of{" "}
            <span className="text-primary">Service</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="text-sm md:text-base font-light tracking-wide text-white/60 max-w-lg mx-auto leading-relaxed"
          >
            Effective March 23, 2026 &nbsp;·&nbsp; This document governs the financial relationship between you and the Secure Rise investment ecosystem.
          </motion.p>

          {/* Section progress dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-1.5 mt-8"
          >
            {sections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                aria-label={s.title}
                className={`h-[3px] rounded-full transition-all duration-300 ${
                  s.id === activeSection
                    ? "bg-primary w-8"
                    : i < activeIndex
                    ? "bg-primary/40 w-4"
                    : "bg-white/20 w-4"
                }`}
              />
            ))}
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/35 font-medium">
            Scroll
          </span>
          <div className="w-[1px] h-7 bg-gradient-to-b from-white/35 to-transparent" />
        </motion.div>
      </section>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-24 pt-12 flex flex-col lg:flex-row gap-10 w-full">

        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-32 space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-5 px-1">
              Legal Framework
            </p>

            {sections.map((item, i) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-md text-xs font-mono shrink-0 transition-colors ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="leading-tight">{item.title}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
                </button>
              );
            })}

            {/* Reading progress */}
            <div className="mt-6 px-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-medium">
                  Progress
                </span>
                <span className="text-[9px] font-mono text-muted-foreground">
                  {activeIndex + 1}/{sections.length}
                </span>
              </div>
              <div className="h-[3px] bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${((activeIndex + 1) / sections.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* ── Mobile sticky nav ── */}
        <div className="lg:hidden sticky top-[72px] z-30 -mx-4 px-4 py-3 bg-background/90 backdrop-blur-md border-b border-border">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                    activeSection === s.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* 1. Service Agreement */}
          <TermsCard id="introduction" number="01" title="Service Agreement" icon={FileText}>
            <Clause number="1.1">
              <strong className="text-foreground">SECURE RISE</strong> (&ldquo;The Platform&rdquo;) provides a sophisticated financial interface that facilitates digital asset trading and automated income generation through high-frequency trading algorithms. By using Secure Rise, you enter into a binding legal contract regarding the management of your capital and agree to abide by all terms, conditions, and policies outlined herein.
            </Clause>
            <Clause number="1.2">
              These terms apply to all transactions, trading cycles, bonus disbursements, and platform interactions. Unauthorized use of this platform, attempts to manipulate our trading algorithms, or any form of exploitation will result in immediate termination of services and potential legal action. Secure Rise reserves the right to suspend or terminate accounts at our sole discretion for any violation of these terms.
            </Clause>
            <Clause number="1.3">
              The Platform acts as an intermediary between users and automated trading systems. While we employ advanced algorithms to optimize returns, we do not guarantee specific performance metrics or fixed returns. All investments are subject to market conditions and the inherent risks associated with cryptocurrency trading and automated investment strategies.
            </Clause>
            <Clause number="1.4">
              Users acknowledge that Secure Rise is not a financial advisor and does not provide personalized investment recommendations. All investment decisions are made at the user's sole discretion and risk. Users should consult with qualified financial advisors before making investment decisions and should only invest capital they can afford to lose.
            </Clause>
          </TermsCard>

          {/* 2. Investor Accounts */}
          <TermsCard id="accounts" number="02" title="Investor Accounts" icon={ShieldCheck}>
            <Clause number="2.1">
              Participation is restricted to individuals aged 18 or older who have the legal capacity to enter into binding contracts. Secure Rise operates a strict anti-money laundering (AML) policy and may request identity verification, proof of address, and additional documentation at any time to ensure compliance with international financial regulations.
            </Clause>
            <Clause number="2.2">
              You are solely responsible for the security of your account, including maintaining the confidentiality of your login credentials, enabling two-factor authentication, and promptly reporting any unauthorized access. Secure Rise will never ask for your password via email, support tickets, or any other communication channel. Any loss resulting from a compromised personal device, weak password management, or failure to enable security features falls under the user's liability.
            </Clause>
            <Clause number="2.3">
              Each individual is permitted to maintain only one account on the Secure Rise platform. Multiple accounts held by the same individual are strictly prohibited and may result in immediate suspension of all associated accounts, forfeiture of funds and bonuses, and permanent termination of services. Corporate or business accounts may be permitted subject to additional verification and approval by our compliance team.
            </Clause>
            <Clause number="2.4">
              Account registration requires accurate and truthful information. Providing false, misleading, or fraudulent information during registration or KYC verification is grounds for immediate account termination and potential legal action. Users must keep their account information current and notify Secure Rise promptly of any changes to personal details or contact information.
            </Clause>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
              {[
                { label: "Minimum Age",   value: "18+" },
                { label: "AML Policy",    value: "Strict" },
                { label: "KYC Required",  value: "Yes" },
              ].map((stat) => (
                <div key={stat.label} className="bg-secondary/60 rounded-2xl p-4 text-center border border-border/50">
                  <div className="text-2xl font-black text-foreground tracking-tight">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </TermsCard>

          {/* 3. Investment Mechanics */}
          <TermsCard id="investment" number="03" title="Investment Mechanics" icon={TrendingUp}>
            <Clause number="3.1">
              When you &ldquo;buy&rdquo; an investment package, you are allocating liquidity to the Secure Rise trading pool. This capital is utilized in high-frequency trading and digital arbitrage across multiple cryptocurrency markets. The platform employs sophisticated algorithms to identify and execute profitable trading opportunities on behalf of investors.
            </Clause>
            <Clause number="3.2">
              The Platform tops user income daily based on trading performance. These accruals are reflected in your dashboard in real-time but are subject to the specific maturity periods of your selected investment tier. Daily returns are automatically credited to your account balance every 24 hours based on the performance of our trading algorithms.
            </Clause>
            <Clause number="3.3">
              Investment tiers range from $100 to $10,000, each with varying levels of trading volume, daily return potential, and exclusive benefits. Higher-tier investments receive priority trade allocation, enhanced trading volumes, and additional features such as dedicated account monitoring and exclusive market insights.
            </Clause>
            <Clause number="3.4">
              All investment cycles have specific maturity periods. Returns are calculated based on the selected investment tier's parameters and the actual performance of our trading algorithms. While we strive to optimize returns, actual performance may vary based on market conditions, volatility, and other factors beyond our control.
            </Clause>
            <blockquote className="border-l-4 border-primary bg-primary/5 px-6 py-5 rounded-r-2xl text-foreground/80 leading-relaxed text-sm">
              &ldquo;The Platform tops user income daily based on trading performance. These accruals are reflected in your dashboard in real-time but are subject to the specific maturity periods of your selected investment tier. Past performance does not guarantee future results.&rdquo;
            </blockquote>
          </TermsCard>

          {/* 4. Promotional Incentives */}
          <TermsCard id="bonus" number="04" title="Promotional Incentives" icon={Coins}>
            <Clause number="4.1">
              <strong className="text-foreground">The $20 Registration Bonus:</strong> Secure Rise offers a one-time $20 credit upon initial registration. This bonus is designed to act as seed capital to be used within the platform environment and facilitate initial engagement with our investment services.
            </Clause>
            <Clause number="4.2">
              The registration bonus is not immediately withdrawable. It becomes eligible for withdrawal only when bundled with the payout of your first successful principal investment cycle. Users may not withdraw the bonus independently without completing at least one active investment cycle and receiving a successful payout.
            </Clause>
            <Clause number="4.3">
              Secure Rise reserves the right to modify, suspend, or terminate bonus programs at any time without prior notice. Bonus structures, eligibility criteria, and withdrawal conditions are subject to change at our sole discretion. Any changes will be effective immediately upon posting to the platform.
            </Clause>
            <Clause number="4.4">
              Bonus abuse, including but not limited to creating multiple accounts to claim bonuses, exploiting promotional offers, or engaging in any form of bonus manipulation, is strictly prohibited. Detected bonus abuse will result in immediate forfeiture of all bonuses, suspension of associated accounts, and potential legal action.
            </Clause>
            {/* Bonus highlight */}
            <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent p-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
              <div className="flex flex-col lg:flex-row items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/15 shrink-0">
                  <Coins className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-3xl font-black text-primary tracking-tight">$20</span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">Welcome Credit</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    The bonus credit becomes eligible for withdrawal only when bundled with the payout of your first successful principal investment cycle. Users may not withdraw the bonus independently without a prior active investment.
                  </p>
                </div>
              </div>
            </div>
          </TermsCard>

          {/* 5. Payout Protocols */}
          <TermsCard id="withdrawals" number="05" title="Payout Protocols" icon={Landmark}>
            <Clause number="5.1">
              Withdrawal requests are processed according to the security protocols of Secure Rise. To prevent fraud and ensure the integrity of our financial systems, certain withdrawal limits and cooling-off periods may apply. All withdrawals are subject to review by our compliance team, and additional documentation may be requested before processing large withdrawals.
            </Clause>
            <Clause number="5.2">
              The minimum withdrawal amount is $100. Withdrawals below this threshold cannot be processed. Users must have completed at least one successful deposit and investment cycle before becoming eligible for withdrawals. The $20 welcome bonus remains locked until your first investment payout is successfully completed.
            </Clause>
            <Clause number="5.3">
              Withdrawals are processed within 0-24 hours of request submission, depending on the withdrawal amount and the cryptocurrency selected. Processing times may be extended during periods of high network congestion or when additional verification is required. Secure Rise supports withdrawals to Bitcoin (BTC), Ethereum (ETH), Solana (SOL), Tether (USDT), and USD Coin (USDC).
            </Clause>
            <Clause number="5.4">
              Users are responsible for providing correct wallet addresses in their profile settings. Secure Rise is not responsible for funds sent to incorrect or unsupported destination addresses provided by the user. All withdrawals require email OTP authentication for security. You must send a one-time password to your registered email before confirming a withdrawal request.
            </Clause>
            <div className="space-y-3 mt-4">
              {[
                { number: "5.5", label: "Fraud Prevention",    detail: "Withdrawal requests are processed according to the security protocols of Secure Rise. To prevent fraud, certain withdrawal limits and cooling-off periods may apply." },
                { number: "5.6", label: "Wallet Accuracy",     detail: "Users are responsible for providing correct wallet addresses. Secure Rise is not responsible for funds sent to incorrect or unsupported destination addresses provided by the user." },
                { number: "5.7", label: "Processing Time",     detail: "Withdrawal requests are processed within 0-24 business hours depending on amount and cryptocurrency selected." },
                { number: "5.8", label: "No Withdrawal Fees",  detail: "Secure Rise charges 0% withdrawal fees - you receive the full amount requested." },
              ].map((item) => (
                <div
                  key={item.number}
                  className="group flex items-start gap-4 p-4 bg-secondary/40 hover:bg-secondary/70 rounded-xl border border-border/40 hover:border-border transition-all duration-200"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                    <Landmark className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-foreground/70 mb-0.5">{item.label}</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </TermsCard>

          {/* 6. Risk Disclosure */}
          <TermsCard id="risk" number="06" title="Risk Disclosure" icon={AlertCircle}>
            <Clause number="6.1">
              Trading digital assets involves substantial risk. Market conditions can be volatile and unpredictable. Secure Rise does not guarantee a fixed percentage of return, as payouts are dependent on daily trading volume and market outcomes. Past performance is not indicative of future results.
            </Clause>
            <Clause number="6.2">
              Cryptocurrency markets are highly volatile and can experience rapid price fluctuations within short periods. The value of digital assets can rise or fall significantly, potentially resulting in substantial gains or losses. Secure Rise's trading algorithms are designed to mitigate risk through diversification and automated stop-loss mechanisms, but no system can completely eliminate market risk.
            </Clause>
            <Clause number="6.3">
              You acknowledge that all investment decisions are made at your own discretion and risk. Secure Rise does not provide personalized financial advice, and you should carefully consider your financial situation, investment objectives, and risk tolerance before investing. Only invest capital that you can afford to lose without impacting your standard of living.
            </Clause>
            <Clause number="6.4">
              External factors beyond Secure Rise's control, including but not limited to regulatory changes, technological failures, cybersecurity incidents, and macroeconomic events, may impact the performance of your investments. Secure Rise is not responsible for losses resulting from such external factors. By using our platform, you agree to assume all risks associated with cryptocurrency trading and automated investment services.
            </Clause>
            <div className="rounded-2xl border border-destructive/25 bg-destructive/5 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-destructive/20 bg-destructive/8">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span className="text-xs font-bold uppercase tracking-widest text-destructive">
                  Financial Responsibility
                </span>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Trading digital assets involves substantial risk. Market conditions can be volatile. Secure Rise does not guarantee a fixed percentage of return, as payouts are dependent on daily trading volume and market outcomes. Past performance is not indicative of future results. By using our platform, you acknowledge and accept these risks.
                </p>
              </div>
            </div>
          </TermsCard>

          {/* 7. Binding Arbitration */}
          <TermsCard id="legal" number="07" title="Binding Arbitration" icon={Gavel}>
            <Clause number="7.1">
              Any dispute arising from the use of Secure Rise shall be resolved through binding arbitration. Users waive their right to participate in class-action lawsuits. All decisions made by the platform's compliance department regarding account audits and fund freezes due to suspected fraud are final and binding.
            </Clause>
            <Clause number="7.2">
              In the event of any dispute, claim, or controversy arising out of or relating to these terms or your use of the Secure Rise platform, you agree to first attempt to resolve the dispute through good faith negotiations with our support team. If the dispute cannot be resolved through negotiation, it shall be settled through binding arbitration in accordance with the rules of the appointed arbitration institution.
            </Clause>
            <Clause number="7.3">
              You waive your right to a trial by jury and agree that any arbitration proceeding shall be conducted on an individual basis, not as a class action or representative action. You expressly waive any right to participate in class action lawsuits or class-wide arbitration against Secure Rise. The arbitrator's decision shall be final and binding, and judgment may be entered in any court having jurisdiction.
            </Clause>
            <Clause number="7.4">
              Secure Rise reserves the right to seek injunctive or other equitable relief in any court of competent jurisdiction to prevent or stop any violation of these terms, unauthorized use of the platform, or any other harm to Secure Rise, its users, or its intellectual property rights. This right is in addition to any other remedies available to Secure Rise under these terms or applicable law.
            </Clause>
            <Clause number="7.5">
              If any provision of these terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable while preserving its original intent to the greatest extent possible.
            </Clause>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/40 border border-border/50">
              <Gavel className="w-5 h-5 text-primary shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                By using Secure Rise, you irrevocably consent to dispute resolution through binding international arbitration and waive any right to a jury trial or class action participation.
              </p>
            </div>
          </TermsCard>

          {/* ── CTA footer card ── */}
          <div className="p-8 md:p-10 bg-primary/5 border border-primary/20 rounded-[1.5rem] text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-5">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-black text-2xl  uppercase tracking-tighter mb-2">
              Secure Your Future
            </h4>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm">
              By clicking &ldquo;Accept&rdquo; or using the platform, you agree to the terms above.
            </p>
            <button className="bg-primary cursor-pointer text-primary-foreground px-5 py-3 rounded-xl font-black uppercase  tracking-tighter hover:scale-105 transition-all shadow-lg shadow-primary/20">
              I Agree to Terms
            </button>
          </div>

          {/* ── Footer strip ── */}
          <div className="flex items-center gap-4 pt-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-medium whitespace-nowrap">
              Secure Rise · Legal
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

/* ── TermsCard ──────────────────────────────────────────────── */
function TermsCard({
  id,
  number,
  title,
  icon: Icon,
  children,
}: {
  id: string;
  number: string;
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      id={id}
      className="scroll-mt-32 bg-card border border-border rounded-3xl overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
    >
      {/* Card header */}
      <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
        <span className="text-[10px] font-mono font-bold text-primary/60 tracking-widest leading-none">
          {number}
        </span>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-base font-bold tracking-tight text-foreground">{title}</h3>
      </div>

      {/* Card body */}
      <div className="p-5 lg:p-6 space-y-5">{children}</div>
    </motion.div>
  );
}

/* ── Numbered clause row ────────────────────────────────────── */
function Clause({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="text-[11px] font-bold text-primary/60 uppercase tracking-widest mt-1 shrink-0 w-6">
        {number}
      </span>
      <p className="text-muted-foreground leading-relaxed text-sm">{children}</p>
    </div>
  );
}