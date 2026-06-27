"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  Users,
  ChevronRight,
  TrendingUp,
  Send,
  ShieldCheck,
  Target,
  Award,
  DollarSign,
  Globe,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  Calendar,
  Building2,
  GraduationCap,
  Heart,
  Gift,
  BarChart2,
  Link as LinkIcon,
  Star,
} from "lucide-react";
import GiveAway from "@/components/landing-page/GiveAway";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import CookieConsent from "@/components/landing-page/CookieConsent";
import Footer from "@/components/landing-page/Footer";
import Link from "next/link";

const sections = [
  { id: "nlog", title: "NLOG", icon: BookOpen },
  { id: "careers", title: "Careers", icon: Briefcase },
  { id: "affiliate", title: "Affiliate Program", icon: Users },
];

export default function BlogPage() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("nlog");
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
            backgroundImage: "url('https://i.postimg.cc/gkW8VrZk/Banner-1.jpg')",
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
              Blog & Resources
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black uppercase  tracking-tighter mb-5 text-white leading-none"
          >
            Our Blog 
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="text-sm md:text-base font-light tracking-wide text-white/60 max-w-lg mx-auto leading-relaxed"
          >
            Discover insights about NLOG, explore career opportunities, and learn about our lucrative affiliate program.
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
        <div className="flex-1 min-w-0 space-y-6" id="blog-content">
          {/* NLOG Section */}
          <motion.div
            id="nlog"
            className="scroll-mt-32 bg-gradient-to-br from-primary/10 via-card to-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
              <span className="text-[10px] font-mono font-bold text-primary/60 tracking-widest leading-none">
                01
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">NLOG - Next Level of Growth</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                NLOG (Next Level of Growth) is Secure Rise's proprietary trading and investment methodology that combines advanced AI algorithms, professional trading expertise, and institutional-grade risk management to deliver consistent returns for our investors.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Core Principles
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>AI-Driven Analysis:</strong> Machine learning algorithms analyze market trends 24/7</li>
                  <li><strong>Professional Execution:</strong> Expert traders execute strategies on MT4, MT5, and cTrader platforms</li>
                  <li><strong>Risk Management:</strong> Automated stop-loss and position sizing protocols</li>
                  <li><strong>Diversified Portfolio:</strong> Trading across forex, crypto, commodities, and indices</li>
                  <li><strong>Real-Time Monitoring:</strong> Continuous performance tracking and adjustment</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  Security & Protection
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>256-bit AES Encryption:</strong> Military-grade security for all transactions</li>
                  <li><strong>Capital Protection:</strong> 100% capital refund + 20% compensation if losses occur</li>
                  <li><strong>Segregated Accounts:</strong> Investor funds held separately from company operations</li>
                  <li><strong>Regular Audits:</strong> Third-party verification of trading performance</li>
                  <li><strong>Transparent Reporting:</strong> Daily ROI updates and detailed transaction history</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  Performance Metrics
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>10% Average Daily ROI:</strong> Consistent daily returns on investments</li>
                  <li><strong>14-Day Investment Cycle:</strong> Complete ROI payout within two weeks</li>
                  <li><strong>83,000+ Active Traders:</strong> Growing community of successful investors</li>
                  <li><strong>$20M+ Rewards Paid:</strong> Total rewards distributed to our users</li>
                  <li><strong>160+ Countries:</strong> Global reach with diverse investor base</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Investment Tiers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <div className="bg-background/50 p-3 rounded-lg">
                    <p className="text-[10px] font-black uppercase text-green-400 mb-1">Starter ($100 - $499)</p>
                    <p className="text-[9px] text-muted-foreground">Perfect for beginners. Daily ROI payouts with full capital protection.</p>
                  </div>
                  <div className="bg-background/50 p-3 rounded-lg">
                    <p className="text-[10px] font-black uppercase text-blue-400 mb-1">Basic ($500 - $999)</p>
                    <p className="text-[9px] text-muted-foreground">Enhanced returns with priority support and faster withdrawals.</p>
                  </div>
                  <div className="bg-background/50 p-3 rounded-lg">
                    <p className="text-[10px] font-black uppercase text-purple-400 mb-1">Standard ($1,000 - $4,999)</p>
                    <p className="text-[9px] text-muted-foreground">Professional-grade trading with dedicated account manager.</p>
                  </div>
                  <div className="bg-background/50 p-3 rounded-lg">
                    <p className="text-[10px] font-black uppercase text-orange-400 mb-1">Premium ($5,000 - $9,999)</p>
                    <p className="text-[9px] text-muted-foreground">VIP treatment with exclusive investment opportunities.</p>
                  </div>
                  <div className="bg-background/50 p-3 rounded-lg">
                    <p className="text-[10px] font-black uppercase text-pink-400 mb-1">Elite ($10,000 - $49,999)</p>
                    <p className="text-[9px] text-muted-foreground">Institutional-level returns with personalized strategy.</p>
                  </div>
                  <div className="bg-background/50 p-3 rounded-lg">
                    <p className="text-[10px] font-black uppercase text-red-400 mb-1">Titan ($50,000+)</p>
                    <p className="text-[9px] text-muted-foreground">Maximum returns with white-glove service and direct trader access.</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  Trading Platforms
                </h3>
                <p className="text-xs text-muted-foreground">
                  NLOG leverages the world's most trusted trading platforms to execute strategies:
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>MetaTrader 4 (MT4):</strong> Industry-standard forex trading platform</li>
                  <li><strong>MetaTrader 5 (MT5):</strong> Advanced multi-asset trading with enhanced features</li>
                  <li><strong>cTrader:</strong> ECN trading platform with ultra-fast execution</li>
                  <li><strong>Match-Trader:</strong> Innovative trading technology</li>
                  <li><strong>Crypto Exchanges:</strong> Direct integration with major cryptocurrency exchanges</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Careers Section */}
          <motion.div
            id="careers"
            className="scroll-mt-32 bg-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
              <span className="text-[10px] font-mono font-bold text-primary/60 tracking-widest leading-none">
                02
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">
                <Briefcase className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Careers at Secure Rise</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                Join the Secure Rise team and be part of a revolutionary fintech company that's transforming the investment landscape. We're always looking for talented individuals who are passionate about innovation, technology, and helping people achieve financial freedom.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  Why Work With Us
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Remote-First Culture:</strong> Work from anywhere in the world</li>
                  <li><strong>Competitive Compensation:</strong> Above-market salaries and performance bonuses</li>
                  <li><strong>Professional Growth:</strong> Continuous learning opportunities and career advancement</li>
                  <li><strong>Innovation-Driven:</strong> Work with cutting-edge AI and trading technology</li>
                  <li><strong>Global Impact:</strong> Help thousands of investors achieve financial goals</li>
                  <li><strong>Flexible Hours:</strong> Work-life balance that suits your lifestyle</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  Open Positions
                </h3>
                <div className="space-y-3">
                  <div className="bg-background/50 p-3 rounded-lg border-l-2 border-primary">
                    <p className="text-[10px] font-black uppercase text-primary mb-1">Senior Trading Analyst</p>
                    <p className="text-[9px] text-muted-foreground mb-2">Lead market analysis and develop trading strategies using AI-powered tools.</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[8px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Remote</span>
                      <span className="text-[8px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">Full-time</span>
                      <span className="text-[8px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">$80k-$120k</span>
                    </div>
                  </div>
                  <div className="bg-background/50 p-3 rounded-lg border-l-2 border-blue-400">
                    <p className="text-[10px] font-black uppercase text-blue-400 mb-1">AI/ML Engineer</p>
                    <p className="text-[9px] text-muted-foreground mb-2">Build and optimize machine learning models for trading predictions.</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[8px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Remote</span>
                      <span className="text-[8px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">Full-time</span>
                      <span className="text-[8px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">$100k-$150k</span>
                    </div>
                  </div>
                  <div className="bg-background/50 p-3 rounded-lg border-l-2 border-purple-400">
                    <p className="text-[10px] font-black uppercase text-purple-400 mb-1">Full Stack Developer</p>
                    <p className="text-[9px] text-muted-foreground mb-2">Develop and maintain our web platform using Next.js and modern technologies.</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[8px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Remote</span>
                      <span className="text-[8px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">Full-time</span>
                      <span className="text-[8px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">$70k-$100k</span>
                    </div>
                  </div>
                  <div className="bg-background/50 p-3 rounded-lg border-l-2 border-orange-400">
                    <p className="text-[10px] font-black uppercase text-orange-400 mb-1">Customer Success Manager</p>
                    <p className="text-[9px] text-muted-foreground mb-2">Provide exceptional support and guidance to our investor community.</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[8px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Remote</span>
                      <span className="text-[8px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">Full-time</span>
                      <span className="text-[8px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">$50k-$70k</span>
                    </div>
                  </div>
                  <div className="bg-background/50 p-3 rounded-lg border-l-2 border-pink-400">
                    <p className="text-[10px] font-black uppercase text-pink-400 mb-1">Marketing Specialist</p>
                    <p className="text-[9px] text-muted-foreground mb-2">Drive growth through digital marketing, content creation, and community engagement.</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[8px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Remote</span>
                      <span className="text-[8px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">Full-time</span>
                      <span className="text-[8px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">$55k-$75k</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  Our Culture
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Innovation First:</strong> We embrace new ideas and creative solutions</li>
                  <li><strong>Collaboration:</strong> Cross-functional teams working together towards common goals</li>
                  <li><strong>Transparency:</strong> Open communication and honest feedback</li>
                  <li><strong>Diversity & Inclusion:</strong> Welcoming team members from all backgrounds</li>
                  <li><strong>Continuous Learning:</strong> Regular training sessions and skill development</li>
                  <li><strong>Work-Life Balance:</strong> Flexible schedules and generous PTO</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  Benefits & Perks
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Health Insurance:</strong> Comprehensive medical, dental, and vision coverage</li>
                  <li><strong>Retirement Plan:</strong> 401(k) matching and investment options</li>
                  <li><strong>Performance Bonuses:</strong> Quarterly and annual performance-based rewards</li>
                  <li><strong>Learning Budget:</strong> Annual allowance for courses, books, and conferences</li>
                  <li><strong>Equipment Budget:</strong> Latest laptop and home office setup</li>
                  <li><strong>Team Retreats:</strong> Annual company gatherings and team-building events</li>
                  <li><strong>Referral Bonus:</strong> $1,000 for successful candidate referrals</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Send className="w-4 h-4 text-cyan-400" />
                  How to Apply
                </h3>
                <p className="text-xs text-muted-foreground">
                  Ready to join our team? Send your resume and cover letter to careers@securerise.com. In your cover letter, tell us about your experience with fintech/trading and why you're excited about Secure Rise's mission.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Application Review:</strong> Our team reviews applications within 5 business days</li>
                  <li><strong>Initial Interview:</strong> 30-minute video call with HR</li>
                  <li><strong>Technical Assessment:</strong> Role-specific skills evaluation</li>
                  <li><strong>Final Interview:</strong> Meet with team lead and CEO</li>
                  <li><strong>Offer:</strong> Competitive package with growth opportunities</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Affiliate Section */}
          <motion.div
            id="affiliate"
            className="scroll-mt-32 bg-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
              <span className="text-[10px] font-mono font-bold text-primary/60 tracking-widest leading-none">
                03
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Affiliate Program</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                The Secure Rise Affiliate Program offers a lucrative opportunity to earn passive income by referring new investors to our platform. With competitive commission rates, real-time tracking, and dedicated support, our affiliate program is designed to help you maximize your earnings.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  Commission Structure
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>10% First-Level Commission:</strong> Earn 10% on every deposit made by your direct referrals</li>
                  <li><strong>5% Second-Level Commission:</strong> Earn 5% on deposits made by affiliates you refer</li>
                  <li><strong>Unlimited Earnings:</strong> No cap on how much you can earn</li>
                  <li><strong>Lifetime Commissions:</strong> Earn from your referrals as long as they remain active</li>
                  <li><strong>Instant Payouts:</strong> Commissions credited immediately after referral deposits</li>
                </ul>
                <div className="bg-background/50 p-3 rounded-lg mt-2">
                  <p className="text-[9px] text-muted-foreground">
                    <strong>Example:</strong> Refer a user who deposits $1,000 → Earn $100 commission. If that user refers someone who deposits $500 → Earn additional $25 (5% of $500).
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  Affiliate Tiers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                  <div className="bg-background/50 p-3 rounded-lg border border-border">
                    <p className="text-[10px] font-black uppercase text-blue-400 mb-1">Bronze</p>
                    <p className="text-[9px] text-muted-foreground mb-2">0-10 active referrals</p>
                    <ul className="text-[8px] text-muted-foreground space-y-1">
                      <li>• 10% first-level</li>
                      <li>• 5% second-level</li>
                      <li>• Standard support</li>
                    </ul>
                  </div>
                  <div className="bg-background/50 p-3 rounded-lg border border-primary/50">
                    <p className="text-[10px] font-black uppercase text-purple-400 mb-1">Silver</p>
                    <p className="text-[9px] text-muted-foreground mb-2">11-50 active referrals</p>
                    <ul className="text-[8px] text-muted-foreground space-y-1">
                      <li>• 12% first-level</li>
                      <li>• 6% second-level</li>
                      <li>• Priority support</li>
                      <li>• Marketing materials</li>
                    </ul>
                  </div>
                  <div className="bg-background/50 p-3 rounded-lg border border-primary">
                    <p className="text-[10px] font-black uppercase text-yellow-400 mb-1">Gold</p>
                    <p className="text-[9px] text-muted-foreground mb-2">50+ active referrals</p>
                    <ul className="text-[8px] text-muted-foreground space-y-1">
                      <li>• 15% first-level</li>
                      <li>• 7% second-level</li>
                      <li>• Dedicated manager</li>
                      <li>• Custom campaigns</li>
                      <li>• Exclusive bonuses</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-cyan-400" />
                  Marketing Tools
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Unique Referral Links:</strong> Personalized tracking links for all promotions</li>
                  <li><strong>Banner Ads:</strong> High-converting banners in various sizes</li>
                  <li><strong>Email Templates:</strong> Pre-written email campaigns for your audience</li>
                  <li><strong>Social Media Content:</strong> Ready-to-post content for all platforms</li>
                  <li><strong>Landing Pages:</strong> Custom landing pages for your campaigns</li>
                  <li><strong>Analytics Dashboard:</strong> Real-time tracking of clicks, conversions, and earnings</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-purple-400" />
                  Tracking & Analytics
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Real-Time Dashboard:</strong> Live view of your affiliate performance</li>
                  <li><strong>Click Tracking:</strong> Monitor clicks on your referral links</li>
                  <li><strong>Conversion Rates:</strong> Track sign-ups and deposit conversions</li>
                  <li><strong>Earnings Reports:</strong> Detailed breakdown of commissions earned</li>
                  <li><strong>Referral Management:</strong> View and manage your referral network</li>
                  <li><strong>Payout History:</strong> Complete record of all commission payments</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Gift className="w-4 h-4 text-pink-400" />
                  Bonuses & Incentives
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Sign-Up Bonus:</strong> $50 bonus when you refer your first active investor</li>
                  <li><strong>Monthly Contests:</strong> Compete for cash prizes up to $5,000</li>
                  <li><strong>Performance Bonuses:</strong> Extra rewards for hitting referral milestones</li>
                  <li><strong>Leaderboard Rewards:</strong> Top affiliates earn exclusive perks and higher rates</li>
                  <li><strong>Holiday Promotions:</strong> Special commission multipliers during seasonal events</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Getting Started
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Sign Up:</strong> Create your Secure Rise account (it's free)</li>
                  <li><strong>Apply for Affiliate:</strong> Access the affiliate section in your dashboard</li>
                  <li><strong>Get Your Link:</strong> Receive your unique referral link instantly</li>
                  <li><strong>Start Promoting:</strong> Share your link through your chosen channels</li>
                  <li><strong>Track Performance:</strong> Monitor your results in the affiliate dashboard</li>
                  <li><strong>Withdraw Earnings:</strong> Cash out your commissions anytime via supported methods</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  Terms & Conditions
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>No Self-Referrals:</strong> You cannot refer yourself or create multiple accounts</li>
                  <li><strong>Valid Referrals:</strong> Referrals must make a minimum deposit of $100 to qualify</li>
                  <li><strong>Compliance:</strong> All promotional activities must comply with our guidelines</li>
                  <li><strong>Fraud Prevention:</strong> Suspicious activity may result in account suspension</li>
                  <li><strong>Payout Processing:</strong> Commission withdrawals processed within 24-48 hours</li>
                  <li><strong>Program Changes:</strong> Commission rates may be updated with 30-day notice</li>
                </ul>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Pro Tips for Success
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Build trust with your audience before promoting</li>
                  <li>Create educational content about investing and trading</li>
                  <li>Use multiple channels: social media, email, blog, YouTube</li>
                  <li>Share your personal success story with Secure Rise</li>
                  <li>Engage with your referrals and provide ongoing support</li>
                  <li>Stay updated on platform news to share with your network</li>
                  <li>Test different marketing approaches to find what works best</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <ThemeAndScroll />
      <CookieConsent />
      <Footer />
    </main>
  );
}
