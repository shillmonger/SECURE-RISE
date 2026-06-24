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
  RotateCcw, ShieldCheck, FileText, AlertCircle,
  Clock, CreditCard, Wallet, XCircle, CheckCircle,
  ChevronRight,
} from "lucide-react";

const sections = [
  { id: "overview",    title: "Refund Overview",       icon: RotateCcw },
  { id: "eligibility",  title: "Eligibility Criteria",  icon: ShieldCheck },
  { id: "deposits",     title: "Deposit Refunds",       icon: CreditCard },
  { id: "investments",  title: "Investment Refunds",    icon: Wallet },
  { id: "bonus",        title: "Bonus Policy",          icon: FileText },
  { id: "process",      title: "Refund Process",         icon: Clock },
  { id: "exceptions",   title: "Exceptions",            icon: XCircle },
];

export default function RefundPolicy() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("overview");

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
              "url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2070&auto=format&fit=crop')",
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
              Financial Policy
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black uppercase  tracking-tighter mb-5 text-white leading-none"
          >
            Refund{" "}
            <span className="text-primary">Policy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="text-sm md:text-base font-light tracking-wide text-white/60 max-w-lg mx-auto leading-relaxed"
          >
            Effective March 23, 2026 &nbsp;·&nbsp; This document outlines the refund and withdrawal policies governing transactions on the Secure Rise platform.
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
              Financial Policy
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
        <div className="lg:hidden sticky top-[80px] z-30 -mx-4 px-4 py-3 bg-background/90 backdrop-blur-md border-b border-border">
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

          {/* 1. Refund Overview */}
          <TermsCard id="overview" number="01" title="Refund Overview" icon={RotateCcw}>
            <Clause number="1.1">
              <strong className="text-foreground">SECURE RISE</strong> operates primarily as an investment platform where users allocate funds to automated trading systems. Due to the nature of cryptocurrency trading and high-frequency investment strategies, traditional refund policies do not apply in the same manner as e-commerce or service-based platforms.
            </Clause>
            <Clause number="1.2">
              Once funds are deposited and allocated to an investment plan, they are immediately deployed into active trading cycles. These funds are used to execute trades across multiple cryptocurrency markets, making them unavailable for immediate withdrawal or refund until the investment cycle matures or specific conditions are met.
            </Clause>
            <Clause number="1.3">
              Secure Rise maintains a clear distinction between deposits (which can be refunded under specific circumstances) and investments (which are subject to trading cycle completion and performance-based returns). Users should carefully review this policy before making any financial commitments to the platform.
            </Clause>
            <Clause number="1.4">
              This policy applies to all user accounts, regardless of investment tier or account status. By using the Secure Rise platform, you acknowledge that you have read, understood, and agreed to these refund terms. Secure Rise reserves the right to modify this policy at any time with appropriate notice to users.
            </Clause>
          </TermsCard>

          {/* 2. Eligibility Criteria */}
          <TermsCard id="eligibility" number="02" title="Eligibility Criteria" icon={ShieldCheck}>
            <Clause number="2.1">
              Refund requests are only considered for deposits that have not yet been allocated to an active investment plan. Once funds are assigned to an investment tier and trading has commenced, they are no longer eligible for refund and must follow the standard withdrawal process upon cycle completion.
            </Clause>
            <Clause number="2.2">
              Users must submit refund requests within 24 hours of the initial deposit. Deposits older than 24 hours that have not been allocated to an investment plan may still be eligible for refund at Secure Rise's discretion, subject to a processing fee of up to 5% of the deposit amount.
            </Clause>
            <Clause number="2.3">
              To be eligible for a refund, users must have completed KYC (Know Your Customer) verification. Unverified accounts are not eligible for refunds, as Secure Rise must ensure compliance with anti-money laundering (AML) regulations before returning funds to any external wallet address.
            </Clause>
            <Clause number="2.4">
              Refund requests must be submitted through the official support channel with a valid reason for the refund. Common valid reasons include accidental deposits, duplicate transactions, or technical errors during the deposit process. Change of mind or market volatility are not considered valid reasons for refund requests.
            </Clause>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
              {[
                { label: "Request Window", value: "24 Hours" },
                { label: "KYC Required",  value: "Yes" },
                { label: "Processing Fee", value: "Up to 5%" },
              ].map((stat) => (
                <div key={stat.label} className="bg-secondary/60 rounded-2xl p-4 text-center border border-border/50">
                  <div className="text-2xl font-black text-foreground tracking-tight">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </TermsCard>

          {/* 3. Deposit Refunds */}
          <TermsCard id="deposits" number="03" title="Deposit Refunds" icon={CreditCard}>
            <Clause number="3.1">
              Deposits that have not been allocated to an investment plan may be eligible for refund within the 24-hour window. To request a deposit refund, users must contact support through the official channel with their transaction ID, deposit amount, and a valid reason for the refund request.
            </Clause>
            <Clause number="3.2">
              Deposit refunds are processed back to the original payment method or cryptocurrency wallet address used for the deposit. Secure Rise cannot process refunds to different wallet addresses or payment methods than those used for the original transaction, except in cases where the original wallet is no longer accessible (subject to additional verification).
            </Clause>
            <Clause number="3.3">
              Cryptocurrency deposits are subject to network transaction fees during the refund process. While Secure Rise does not charge a refund fee, users will receive the net amount after deducting any applicable blockchain network fees. These fees vary depending on the cryptocurrency and current network conditions.
            </Clause>
            <Clause number="3.4">
              Refund processing times typically range from 24-48 hours from approval. The approval process includes verification of the refund request, confirmation that funds have not been allocated to trading, and compliance checks. Users will receive email notification when their refund is approved and when it has been processed.
            </Clause>
            <div className="space-y-3 mt-4">
              {[
                { number: "3.5", label: "Original Payment Method", detail: "Refunds are processed back to the original payment method or cryptocurrency wallet address used for the deposit." },
                { number: "3.6", label: "Network Fees", detail: "Cryptocurrency refunds are subject to blockchain network transaction fees deducted from the refund amount." },
                { number: "3.7", label: "Processing Time", detail: "Refund processing typically takes 24-48 hours from approval, including verification and compliance checks." },
                { number: "3.8", label: "Transaction ID Required", detail: "Users must provide their deposit transaction ID when requesting a refund for verification purposes." },
              ].map((item) => (
                <div
                  key={item.number}
                  className="group flex items-start gap-4 p-4 bg-secondary/40 hover:bg-secondary/70 rounded-xl border border-border/40 hover:border-border transition-all duration-200"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                    <CreditCard className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-foreground/70 mb-0.5">{item.label}</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </TermsCard>

          {/* 4. Investment Refunds */}
          <TermsCard id="investments" number="04" title="Investment Refunds" icon={Wallet}>
            <Clause number="4.1">
              Once funds are allocated to an investment plan and trading has commenced, they are no longer eligible for refund. Investments are subject to the terms of the selected investment tier, including daily ROI calculations, trading cycle duration, and maturity periods. Users must wait for the investment cycle to complete before accessing their funds.
            </Clause>
            <Clause number="4.2">
              Investment returns are generated through automated trading activities and are credited to user accounts daily based on the performance of Secure Rise's trading algorithms. These returns are not guaranteed and may vary based on market conditions, volatility, and other factors beyond Secure Rise's control.
            </Clause>
            <Clause number="4.3">
              Users may withdraw their investment principal and accumulated returns upon completion of the investment cycle, subject to the platform's withdrawal policies. The minimum withdrawal amount is $100, and withdrawals require email OTP authentication for security. The $20 welcome bonus is withdrawable only with the first successful investment payout.
            </Clause>
            <Clause number="4.4">
              Early termination of investment cycles is not permitted under normal circumstances. In exceptional cases where early termination may be considered (such as platform-wide technical issues or regulatory changes), Secure Rise reserves the right to process early withdrawals at its sole discretion, subject to applicable fees and adjustments.
            </Clause>
            <blockquote className="border-l-4 border-primary bg-primary/5 px-6 py-5 rounded-r-2xl text-foreground/80 leading-relaxed text-sm">
              &ldquo;Once funds are allocated to an investment plan and trading has commenced, they are no longer eligible for refund. Users must wait for the investment cycle to complete before accessing their funds through the standard withdrawal process.&rdquo;
            </blockquote>
          </TermsCard>

          {/* 5. Bonus Policy */}
          <TermsCard id="bonus" number="05" title="Bonus Policy" icon={FileText}>
            <Clause number="5.1">
              <strong className="text-foreground">The $20 Welcome Bonus:</strong> The $20 registration bonus provided by Secure Rise is not eligible for independent refund or withdrawal. This bonus is designed as seed capital to facilitate initial engagement with the platform and must be used within the platform environment.
            </Clause>
            <Clause number="5.2">
              The welcome bonus becomes eligible for withdrawal only when bundled with the payout of the user's first successful principal investment cycle. Users cannot withdraw the bonus independently without completing at least one active investment cycle and receiving a successful payout from that cycle.
            </Clause>
            <Clause number="5.3">
              XP (Experience Points) earned through daily streaks and achievements are not eligible for refund. XP can only be redeemed for USDT through the XP Redemption feature at the established conversion rate of 50 XP = 1 USDT. Once XP is converted to USDT, it becomes part of the user's withdrawable balance.
            </Clause>
            <Clause number="5.4">
              Gift transfers and commissions earned from sending gifts are not eligible for refund. Once a gift transfer is completed, it is irreversible. The 5% commission earned by the sender is credited instantly and becomes part of the user's withdrawable balance.
            </Clause>
            {/* Bonus highlight */}
            <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent p-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
              <div className="flex flex-col lg:flex-row items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/15 shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-3xl font-black text-primary tracking-tight">$20</span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">Bonus Policy</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    The welcome bonus is not eligible for independent refund. It becomes withdrawable only when bundled with the payout of your first successful principal investment cycle.
                  </p>
                </div>
              </div>
            </div>
          </TermsCard>

          {/* 6. Refund Process */}
          <TermsCard id="process" number="06" title="Refund Process" icon={Clock}>
            <Clause number="6.1">
              To initiate a refund request, users must contact Secure Rise support through the official support channel available on the platform. The request must include the user's registered email, transaction ID, deposit amount, and a detailed explanation of the reason for the refund request.
            </Clause>
            <Clause number="6.2">
              Upon receiving a refund request, the support team will review the request within 24-48 hours. The review process includes verifying the transaction details, confirming that funds have not been allocated to trading, checking the user's KYC status, and validating the reason provided for the refund.
            </Clause>
            <Clause number="6.3">
              If the refund request is approved, the user will receive an email notification with the refund details, including the amount to be refunded, the destination wallet address, and the estimated processing time. The user must confirm the refund details before the refund is processed.
            </Clause>
            <Clause number="6.4">
              Once confirmed, refunds are processed within 24-48 hours. Cryptocurrency refunds are subject to blockchain confirmation times, which may vary depending on network congestion. Users can track their refund status through their account dashboard or by contacting support.
            </Clause>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/40 border border-border/50">
              <Clock className="w-5 h-5 text-primary shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Refund requests are reviewed within 24-48 hours. Processing takes an additional 24-48 hours after approval. Total turnaround time is typically 2-4 business days from request submission.
              </p>
            </div>
          </TermsCard>

          {/* 7. Exceptions */}
          <TermsCard id="exceptions" number="07" title="Exceptions" icon={XCircle}>
            <Clause number="7.1">
              Secure Rise reserves the right to deny refund requests that do not meet the eligibility criteria outlined in this policy. This includes requests for funds that have already been allocated to investment plans, requests submitted after the 24-hour window, or requests from unverified accounts.
            </Clause>
            <Clause number="7.2">
              In cases of suspected fraud, bonus abuse, or violation of platform terms and conditions, Secure Rise reserves the right to suspend refund processing pending investigation. Accounts under investigation may have refund requests delayed or denied until the investigation is complete.
            </Clause>
            <Clause number="7.3">
              Force majeure events, including but not limited to natural disasters, wars, government regulations, cryptocurrency market crashes, or other events beyond Secure Rise's control, may affect the ability to process refunds. In such cases, Secure Rise will communicate with affected users and process refunds as soon as reasonably possible.
            </Clause>
            <Clause number="7.4">
              Secure Rise is not responsible for delays or failures in refund processing caused by third-party service providers, including cryptocurrency exchanges, payment processors, or blockchain networks. Users acknowledge that refund processing times may be extended due to factors outside Secure Rise's control.
            </Clause>
            <div className="rounded-2xl border border-destructive/25 bg-destructive/5 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-destructive/20 bg-destructive/8">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span className="text-xs font-bold uppercase tracking-widest text-destructive">
                  Important Notice
                </span>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Secure Rise reserves the right to deny refund requests that do not meet eligibility criteria. Cases of suspected fraud or terms violations may result in suspended refund processing pending investigation.
                </p>
              </div>
            </div>
          </TermsCard>

          {/* ── CTA footer card ── */}
          {/* <div className="p-8 md:p-10 bg-primary/5 border border-primary/20 rounded-[1.5rem] text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-5">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-black text-2xl  uppercase tracking-tighter mb-2">
              Understand Your Rights
            </h4>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm">
              By using Secure Rise, you acknowledge that you have read and understood this refund policy.
            </p>
            <button className="bg-primary cursor-pointer text-primary-foreground px-5 py-3 rounded-xl font-black uppercase  tracking-tighter hover:scale-105 transition-all shadow-lg shadow-primary/20">
              I Understand
            </button>
          </div> */}

          {/* ── Footer strip ── */}
          <div className="flex items-center gap-4 pt-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-medium whitespace-nowrap">
              Secure Rise · Financial Policy
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