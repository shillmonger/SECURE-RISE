"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import GiveAway from "@/components/landing-page/GiveAway";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import CookieConsent from "@/components/landing-page/CookieConsent";
import Footer from "@/components/landing-page/Footer";
import {
  Gavel,
  Scale,
  AlertTriangle,
  Wallet,
  RefreshCcw,
  ShieldAlert,
  FileText,
  Ban,
  ChevronRight,
} from "lucide-react";

const sections = [
  { id: "acceptance",  title: "Acceptance of Terms",      icon: Scale },
  { id: "eligibility",title: "User Eligibility",          icon: FileText },
  { id: "investment",  title: "Investment & Bonus",        icon: Wallet },
  { id: "trading",     title: "Trading & Risks",           icon: AlertTriangle },
  { id: "withdrawals", title: "Payouts & Fees",            icon: RefreshCcw },
  { id: "security",    title: "Account Security",          icon: ShieldAlert },
  { id: "prohibited",  title: "Prohibited Conduct",        icon: Ban },
  { id: "governing",   title: "Governing Law",             icon: Gavel },
];

export default function TermsOfService() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("acceptance");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
    setSidebarOpen(false);
  };

  const activeIndex = sections.findIndex((s) => s.id === activeSection);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      <GiveAway />
      <Header />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative h-[30vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        {/* Dark gradient overlay */}
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
              Legal Documentation
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black uppercase  tracking-tighter mb-5 text-white leading-none"
          >
            Privacy{" "}
            <span className="text-primary">Policy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="text-sm md:text-base font-light tracking-wide text-white/60 max-w-lg mx-auto leading-relaxed"
          >
            Last Updated: March 2026 &nbsp;·&nbsp; Please read these terms carefully before engaging with the Secure Rise investment platform.
          </motion.p>

          {/* Progress bar — sections overview */}
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
            {/* Header label */}
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-5 px-1">
              Sections
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

          {/* 1. Acceptance */}
          <TermsCard id="acceptance" number="01" title="Acceptance of Terms" icon={Scale}>
            <p className="text-muted-foreground leading-relaxed text-base">
              By accessing or using <strong className="text-foreground font-semibold">Secure Rise</strong>, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform. These terms constitute a legally binding agreement between you and Secure Rise, governing your use of our investment services, trading algorithms, and all related platform features.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Secure Rise reserves the right to modify these terms at any time without prior notice. Any changes will be effective immediately upon posting to the platform. Your continued use of the platform after any modifications to these terms constitutes your acceptance of the revised Terms of Service. It is your responsibility to review these terms periodically for any changes. We recommend that you print a copy of these terms for your records.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              These terms apply to all users of the Secure Rise platform, including but not limited to investors, traders, and visitors. By creating an account, making a deposit, participating in our investment programs, or using any of our services, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions. If you do not agree with these terms, you must not use our platform or services.
            </p>
            <InfoBox>
              Your continued use of the platform after any modifications to these terms constitutes your acceptance of the revised Terms of Service. We recommend checking this page regularly for updates.
            </InfoBox>
          </TermsCard>

          {/* 2. Eligibility */}
          <TermsCard id="eligibility" number="02" title="User Eligibility" icon={FileText}>
            <p className="text-muted-foreground leading-relaxed text-base">
              You must be at least 18 years of age and have the legal capacity to enter into a binding contract to use Secure Rise. By creating an account, you represent and warrant that you meet these requirements and that all information provided is accurate and truthful. Secure Rise strictly prohibits the use of our platform by minors or individuals who lack the legal capacity to enter into contracts.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              To use our investment services, you must complete the Know Your Customer (KYC) verification process. This includes providing valid government-issued identification, proof of address, and other relevant documentation as required by our compliance team. Failure to complete KYC verification may result in limited access to platform features and withdrawal restrictions.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Secure Rise operates in compliance with international financial regulations and anti-money laundering (AML) policies. Users from jurisdictions where cryptocurrency trading or automated investment services are prohibited are not eligible to use our platform. We reserve the right to refuse service to any individual or entity that does not meet our eligibility requirements or violates applicable laws and regulations.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Each individual is permitted to maintain only one account on the Secure Rise platform. Multiple accounts held by the same individual are strictly prohibited and may result in immediate suspension of all associated accounts and forfeiture of any funds or bonuses. Corporate or business accounts may be permitted subject to additional verification and approval by our compliance team.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              {[
                { label: "Minimum Age", value: "18+" },
                { label: "KYC Required", value: "Yes" },
                { label: "Account Type", value: "Individual" },
              ].map((stat) => (
                <div key={stat.label} className="bg-secondary/60 rounded-2xl p-4 text-center border border-border/50">
                  <div className="text-2xl font-black text-foreground tracking-tight">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </TermsCard>

          {/* 3. Investment & Bonus */}
          <TermsCard id="investment" number="03" title="Investment & Registration Bonus" icon={Wallet}>
            {/* Bonus highlight */}
            <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent p-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
              <div className="flex flex-col lg:flex-row items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/15 shrink-0">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-3xl font-black text-primary tracking-tight">$20</span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">Welcome Credit</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    New users receive a one-time registration bonus to facilitate initial platform engagement. This credit is locked until your first successful investment cycle is complete — it becomes withdrawable only upon your first payout.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed text-base">
              Secure Rise offers multiple investment tiers ranging from $100 to $10,000, each with varying levels of trading volume, daily returns, and exclusive benefits. When you purchase an investment package, your capital is allocated to our automated trading pool where it is utilized in high-frequency trading and digital arbitrage strategies across multiple cryptocurrency markets.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Daily returns are automatically credited to your account balance every 24 hours based on the performance of our trading algorithms. The platform tops up your income consistently, providing real-time visibility into your earnings through your dashboard. All investment cycles have specific maturity periods, and returns are calculated based on the selected investment tier's parameters.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Minimum investment amounts apply to all packages. Secure Rise reserves the right to modify investment tiers, bonus structures, and return rates at any time without prior notice. All investments are subject to market risks, and past performance does not guarantee future results. The $20 welcome bonus is a promotional offer and may be discontinued or modified at our sole discretion.
            </p>
          </TermsCard>

          {/* 4. Trading & Risks */}
          <TermsCard id="trading" number="04" title="Trading & Financial Risk" icon={AlertTriangle}>
            {/* Risk disclosure block */}
            <div className="rounded-2xl border border-destructive/25 bg-destructive/5 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-destructive/20 bg-destructive/8">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="text-xs font-bold uppercase tracking-widest text-destructive">
                  Risk Disclosure
                </span>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Trading in financial markets involves significant risk. While Secure Rise utilizes advanced algorithms to optimize returns, past performance does not guarantee future results. You acknowledge that you are investing capital at your own risk and Secure Rise is not liable for any market-driven losses.
                </p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed text-base">
              Cryptocurrency markets are highly volatile and can experience rapid price fluctuations. The value of digital assets can rise or fall significantly within short periods, potentially resulting in substantial gains or losses. Secure Rise's trading algorithms are designed to mitigate risk through diversification and automated stop-loss mechanisms, but no system can completely eliminate market risk.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              You acknowledge that all investment decisions are made at your own discretion and risk. Secure Rise does not provide personalized financial advice, and you should carefully consider your financial situation, investment objectives, and risk tolerance before investing. Only invest capital that you can afford to lose without impacting your standard of living.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              External factors beyond Secure Rise's control, including but not limited to regulatory changes, technological failures, cybersecurity incidents, and macroeconomic events, may impact the performance of your investments. Secure Rise is not responsible for losses resulting from such external factors. By using our platform, you agree to assume all risks associated with cryptocurrency trading and automated investment services.
            </p>
          </TermsCard>

          {/* 5. Withdrawals */}
          <TermsCard id="withdrawals" number="05" title="Withdrawals & Payouts" icon={RefreshCcw}>
            <p className="text-muted-foreground leading-relaxed text-base">
              Withdrawal requests are processed according to the security protocols of Secure Rise. To prevent fraud and ensure the integrity of our financial systems, certain withdrawal limits and cooling-off periods may apply. All withdrawals are subject to review by our compliance team, and additional documentation may be requested before processing large withdrawals.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              The minimum withdrawal amount is $100. Withdrawals below this threshold cannot be processed. Users must have completed at least one successful deposit and investment cycle before becoming eligible for withdrawals. The $20 welcome bonus remains locked until your first investment payout is successfully completed, at which point it becomes withdrawable alongside your principal investment returns.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Withdrawals are processed within 0-24 hours of request submission, depending on the withdrawal amount and the cryptocurrency selected. Processing times may be extended during periods of high network congestion or when additional verification is required. Secure Rise supports withdrawals to Bitcoin (BTC), Ethereum (ETH), Solana (SOL), Tether (USDT), and USD Coin (USDC).
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Users are responsible for providing correct wallet addresses in their profile settings. Secure Rise is not responsible for funds sent to incorrect or unsupported destination addresses provided by the user. All withdrawals require email OTP authentication for security. You must send a one-time password to your registered email before confirming a withdrawal request.
            </p>
            <div className="space-y-3 mt-4">
              {[
                { label: "Processing Time",    detail: "Withdrawal requests are processed within 0–24 business hours." },
                { label: "Minimum Threshold",  detail: "Users must meet the minimum withdrawal threshold of $100." },
                { label: "Bonus Lock",         detail: "The registration bonus is locked until the first investment payout is triggered." },
                { label: "Transaction Fees",   detail: "Secure Rise charges 0% withdrawal fees - you receive the full amount." },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-4 p-4 bg-secondary/40 hover:bg-secondary/70 rounded-xl border border-border/40 hover:border-border transition-all duration-200"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                    <RefreshCcw className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-foreground/70 mb-0.5">{item.label}</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </TermsCard>

          {/* 6. Account Security */}
          <TermsCard id="security" number="06" title="Account Security" icon={ShieldAlert}>
            <p className="text-muted-foreground leading-relaxed text-base">
              You are responsible for maintaining the confidentiality of your account credentials, including passwords, 2FA keys, and any other authentication methods. Secure Rise will never ask for your password via email, support tickets, or any other communication channel. Any unauthorized access resulting from user negligence, weak password management, or failure to enable security features is the sole responsibility of the account holder.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              We strongly recommend enabling two-factor authentication (2FA) on your account to provide an additional layer of security. 2FA requires a second form of verification beyond your password, significantly reducing the risk of unauthorized access even if your password is compromised. Secure Rise supports various 2FA methods including authenticator apps and SMS verification.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              You must immediately notify Secure Rise of any unauthorized use of your account or any other breach of security. Our support team can be contacted through the official support channels listed on our platform. Failure to report unauthorized access promptly may result in loss of funds, and Secure Rise is not liable for losses that occur due to delayed reporting of security incidents.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Secure Rise employs industry-standard security measures including military-grade encryption, secure socket layer (SSL) technology, and regular security audits to protect your data and funds. However, no security system is completely impenetrable. By using our platform, you acknowledge and accept these inherent risks and agree to take all reasonable precautions to protect your account.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: ShieldAlert, label: "2FA Recommended" },
                { icon: Ban,         label: "Never Share Passwords" },
                { icon: AlertTriangle, label: "Report Breaches Immediately" },
              ].map((tip, i) => {
                const TipIcon = tip.icon;
                return (
                  <div key={i} className="flex flex-col items-center gap-2 p-4 bg-secondary/40 rounded-xl border border-border/40 text-center">
                    <TipIcon className="w-5 h-5 text-primary" />
                    <span className="text-xs font-semibold text-foreground/80 leading-tight">{tip.label}</span>
                  </div>
                );
              })}
            </div>
          </TermsCard>

          {/* 7. Prohibited Conduct */}
          <TermsCard id="prohibited" number="07" title="Prohibited Conduct" icon={Ban}>
            <p className="text-muted-foreground leading-relaxed text-base">
              Users are strictly prohibited from engaging in any of the following activities on the Secure Rise platform. Any violation of these prohibited activities may result in immediate account suspension, permanent termination of services, forfeiture of all pending funds, bonuses, and earnings, and potential legal action.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Creating multiple accounts to exploit bonuses, promotions, or referral programs is strictly forbidden. Each individual is limited to one account. Our systems employ advanced fraud detection mechanisms to identify duplicate accounts, and any detected violations will result in the immediate suspension of all associated accounts without warning.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Using automated bots, scripts, or any other software to scrape data, attack our platform API, manipulate trading algorithms, or artificially inflate engagement metrics is prohibited. Such activities compromise the integrity of our platform and may result in permanent bans and legal action for damages.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Money laundering, terrorist financing, or any other illicit financial activities are strictly prohibited and will be reported to relevant authorities. Secure Rise maintains a zero-tolerance policy for any involvement in illegal financial activities. All transactions are monitored for suspicious activity, and any detected violations will be immediately reported.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Providing false, misleading, or fraudulent information during registration, KYC verification, or any other platform interaction is prohibited. This includes using fake identities, stolen documents, or any other form of identity fraud. All user information must be accurate, truthful, and verifiable.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Attempting to manipulate, exploit, or circumvent our trading algorithms, bonus systems, or any other platform features is prohibited. This includes but is not limited to exploiting bugs, using unauthorized third-party tools, or engaging in any form of market manipulation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Creating multiple accounts to exploit bonuses or promotions.",
                "Using automated bots to scrape or attack the platform API.",
                "Money laundering or any illicit financial activities.",
                "Providing false identity or financial information.",
                "Attempting to manipulate trading algorithms or exploit system bugs.",
                "Engaging in market manipulation or wash trading.",
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl border border-destructive/15 bg-destructive/4 hover:bg-destructive/8 transition-colors"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-destructive/15 shrink-0 mt-0.5">
                    <Ban className="w-3 h-3 text-destructive" />
                  </div>
                  <span className="text-sm text-muted-foreground leading-relaxed">{text}</span>
                </div>
              ))}
            </div>
            <InfoBox variant="destructive">
              Violations may result in immediate account suspension and forfeiture of any pending funds or bonuses. Secure Rise reserves the right to pursue legal action against users who engage in prohibited activities.
            </InfoBox>
          </TermsCard>

          {/* 8. Governing Law */}
          <TermsCard id="governing" number="08" title="Governing Law" icon={Gavel}>
            <p className="text-muted-foreground leading-relaxed text-base">
              These terms are governed by and construed in accordance with international financial regulations and the laws of the jurisdiction in which Secure Rise operates. Any disputes arising from the use of the platform shall be subject to the exclusive jurisdiction of the appointed arbitration courts, and you hereby irrevocably consent to such jurisdiction.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              In the event of any dispute, claim, or controversy arising out of or relating to these terms or your use of the Secure Rise platform, you agree to first attempt to resolve the dispute through good faith negotiations with our support team. If the dispute cannot be resolved through negotiation, it shall be settled through binding arbitration in accordance with the rules of the appointed arbitration institution.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              You waive your right to a trial by jury and agree that any arbitration proceeding shall be conducted on an individual basis, not as a class action or representative action. You expressly waive any right to participate in class action lawsuits or class-wide arbitration against Secure Rise. The arbitrator's decision shall be final and binding, and judgment may be entered in any court having jurisdiction.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Secure Rise reserves the right to seek injunctive or other equitable relief in any court of competent jurisdiction to prevent or stop any violation of these terms, unauthorized use of the platform, or any other harm to Secure Rise, its users, or its intellectual property rights. This right is in addition to any other remedies available to Secure Rise under these terms or applicable law.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              If any provision of these terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable while preserving its original intent to the greatest extent possible.
            </p>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/40 border border-border/50">
              <Gavel className="w-5 h-5 text-primary shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                By using Secure Rise, you irrevocably consent to dispute resolution through binding international arbitration and waive any right to a jury trial or class action participation.
              </p>
            </div>
          </TermsCard>

          {/* ── Footer strip ── */}
          <div className="flex items-center gap-4 pt-6">
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

/* ── InfoBox ────────────────────────────────────────────────── */
function InfoBox({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "destructive";
}) {
  const isDestructive = variant === "destructive";
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl text-sm leading-relaxed ${
        isDestructive
          ? "bg-destructive/6 border border-destructive/20 text-destructive/80"
          : "bg-primary/5 border border-primary/15 text-muted-foreground"
      }`}
    >
      {isDestructive ? (
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-destructive" />
      ) : (
        <Scale className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
      )}
      {children}
    </div>
  );
}