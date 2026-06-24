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
  Cpu,
  Gift,
  ShieldCheck,
  Headphones,
  BarChart2,
  FileSearch,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

const sections = [
  {
    id: "algorithms",
    title: "Intelligent Trading Algorithms",
    label: "Technology",
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=2070&auto=format&fit=crop",
    stat: "24/7",
    statLabel: "Active trading",
    description:
      "Secure Rise utilizes cutting-edge high-frequency trading algorithms powered by advanced machine learning and quantitative analysis to put your capital to work around the clock. Our proprietary trading systems analyze thousands of market data points per second, executing trades with precision timing that human traders simply cannot match.",
    details:
      "By purchasing assets through our platform, you trigger automated trades that top up your daily income consistently, regardless of market conditions. Our algorithms are designed to identify profitable opportunities across multiple asset classes including cryptocurrencies, forex, commodities, and indices. The system continuously learns and adapts to changing market dynamics, optimizing strategies in real-time to maximize returns while minimizing drawdowns.",
    cta: "Our Methodology",
  },
  {
    id: "bonus",
    title: "The Welcome Bonus",
    label: "Bonus",
    icon: Gift,
    image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=2070&auto=format&fit=crop",
    stat: "$20",
    statLabel: "Instant credit",
    description:
      "Every new user who joins Secure Rise receives an instant $20 welcome bonus credited directly to their account. This bonus is real money you can use to experience our platform's trading capabilities without any initial risk.",
    details:
      "What sets our welcome bonus apart is its withdrawability: unlike many platforms that lock bonus funds indefinitely, your $20 welcome bonus is fully withdrawable alongside your very first investment payout. The bonus is automatically credited upon successful registration, and you can track its performance alongside your other investments in your dashboard.",
    cta: "Claim Bonus",
  },
  {
    id: "security",
    title: "Uncompromising Security",
    label: "Trust",
    icon: ShieldCheck,
    image: "https://i.postimg.cc/y6PG31Lb/Strong-Passwords.jpg",
    stat: "AES-256",
    statLabel: "Encryption standard",
    description:
      "Security is not an afterthought — it's the foundation upon which everything we build. We employ military-grade AES-256 encryption for all data transmission and storage, ensuring your personal information, financial data, and transaction history remain protected at all times.",
    details:
      "Our platform utilizes multi-layer security protocols including two-factor authentication, email OTP verification for sensitive operations, and real-time fraud detection systems. We maintain segregated cold storage wallets for the majority of user funds and regularly undergo third-party security audits and penetration testing. Our servers are hosted in SOC 2 Type II certified data centers with 24/7 physical security and DDoS protection.",
    cta: "Security Protocols",
  },
  {
    id: "support",
    title: "Round-the-Clock Support",
    label: "Global",
    icon: Headphones,
    image: "https://i.postimg.cc/d3t4jCWP/Delivering-247.jpg",
    stat: "<2 min",
    statLabel: "Avg. response time",
    description:
      "Markets never sleep, and neither do we. Our dedicated support team is available 24 hours a day, 7 days a week, 365 days a year. Whether you need help understanding your investment plan, have questions about withdrawals, or encounter technical issues, we're ready.",
    details:
      "Our support team consists of experienced financial experts, technical specialists, and customer service professionals distributed across multiple time zones. We offer multiple channels including live chat, email, and phone support. For our premium investors in the Elite Investor and Secure Partner tiers, we offer dedicated account managers who provide personalized support and priority access.",
    cta: "Meet The Team",
  },
  {
    id: "market",
    title: "Real-Time Market Access",
    label: "Data",
    icon: BarChart2,
    image: "https://i.postimg.cc/g0FsBQM3/Forex.jpg",
    stat: "10ms",
    statLabel: "Data refresh rate",
    description:
      "Gain an edge with live data feeds that provide the same high-level market insights used by institutional traders and hedge funds. Our platform features real-time trading charts, live market data feeds, and comprehensive analytics dashboards.",
    details:
      "Our data feeds cover multiple asset classes including cryptocurrencies, forex pairs, commodities, and stock indices. We provide institutional-grade market analysis including technical indicators, sentiment analysis, and economic calendars. For advanced investors, we offer API access that allows you to integrate our data into your own trading systems or custom dashboards.",
    cta: "Market Insights",
  },
  {
    id: "transparency",
    title: "Financial Transparency",
    label: "Ethics",
    icon: FileSearch,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2070&auto=format&fit=crop",
    stat: "100%",
    statLabel: "Fee transparency",
    description:
      "Transparency is the bedrock of our platform. From fee structures to trading volumes, from daily ROI calculations to withdrawal processing times — we make it all visible so you can track every cent of your growth without hidden costs or surprises.",
    details:
      "Our fee structure is straightforward and clearly communicated upfront — no hidden charges, surprise deductions, or confusing fine print. You can view detailed transaction histories showing every deposit, investment, return, and withdrawal, complete with timestamps and transaction IDs. Our daily ROI reports show exactly how your returns were calculated, including the specific trades that generated your profits.",
    cta: "Transparency Report",
  },
];

export default function AboutUs() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("algorithms");
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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
              "url('https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/90" />

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 backdrop-blur-sm px-4 py-1.5 mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
              About Secure Rise
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-5 text-white leading-none"
          >
            Built to{" "}
            <span className="text-primary">Perform.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="text-sm md:text-base font-light tracking-wide text-white/60 max-w-lg mx-auto leading-relaxed"
          >
            Automated intelligence, institutional security, and complete financial transparency — in one platform.
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
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/35 font-medium">Scroll</span>
          <div className="w-[1px] h-7 bg-gradient-to-b from-white/35 to-transparent" />
        </motion.div>
      </section>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-24 pt-12 flex flex-col lg:flex-row gap-10 w-full">

        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-32 space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-5 px-1">
              Our Platform
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
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0 space-y-6">
          {sections.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                id={item.id}
                className="scroll-mt-32 bg-card border border-border rounded-3xl overflow-hidden"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4 }}
              >
                {/* Card header */}
                <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
                  <span className="text-[10px] font-mono font-bold text-primary/60 tracking-widest leading-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="w-px h-4 bg-border" />
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-base font-bold tracking-tight text-foreground flex-1">
                    {item.title}
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                    <span className="h-1 w-1 rounded-full bg-primary/60" />
                    {item.label}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-5 lg:p-6 space-y-5">

                  {/* Image with floating stat */}
                  <div className="relative aspect-[16/7] overflow-hidden rounded-2xl border border-border/40 group">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Floating stat chip */}
                    <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3">
                      <div className="text-xl font-black text-primary tracking-tighter leading-none">
                        {item.stat}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-white/50 mt-0.5 font-medium">
                        {item.statLabel}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {item.description}
                  </p>

                  {/* Expandable details */}
                  <details className="group/details" open={isDesktop}>
                    <summary className="cursor-pointer list-none">
                      <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground hover:text-primary transition-colors">
                        Read more
                        <span className="inline-block transition-transform group-open/details:rotate-90">→</span>
                      </span>
                    </summary>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-4">
                      {item.details}
                    </p>
                  </details>

                  {/* Card footer */}
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                    <a
                      href="#"
                      className="group/link inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase text-foreground hover:text-primary transition-colors duration-200"
                    >
                      {item.cta}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                    </a>
                    <span className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-wider">
                      {String(index + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* ── CTA footer card ── */}
          <div className="p-8 md:p-10 bg-primary/5 border border-primary/20 rounded-[1.5rem] text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-5">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-black text-2xl uppercase tracking-tighter mb-2">
              Ready to Rise?
            </h4>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm">
              Join thousands of investors already growing their wealth on Secure Rise.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-primary cursor-pointer text-primary-foreground px-6 py-3 rounded-xl font-black uppercase tracking-tighter hover:scale-105 transition-all shadow-lg shadow-primary/20"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* ── Footer strip ── */}
          <div className="flex items-center gap-4 pt-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-medium whitespace-nowrap">
              Secure Rise · About
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