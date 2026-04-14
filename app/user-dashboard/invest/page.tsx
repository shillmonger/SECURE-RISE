"use client";
import React, { useState, useRef } from "react";
import {
  Zap,
  TrendingUp,
  ShieldCheck,
  Bot,
  Users,
  Building,
  Calculator,
  Star,
  ArrowRight,
  DollarSign,
  Clock,
  BarChart2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

// ─── Plan Data ────────────────────────────────────────────────────────────────
const plans = [
  {
    id: 1,
    name: "Starter Rise",
    min: 100,
    max: 199,
    roiPerDay: 20,
    duration: 7,
    icon: <Zap className="w-5 h-5" />,
    color: "from-yellow-500/20 to-yellow-500/5",
    accent: "text-yellow-500",
    border: "border-yellow-500/30",
    badge: null,
    perks: ["Daily ROI payouts", "Email support", "Basic analytics"],
  },
  {
    id: 2,
    name: "Basic Growth",
    min: 200,
    max: 499,
    roiPerDay: 20,
    duration: 7,
    icon: <TrendingUp className="w-5 h-5" />,
    color: "from-green-500/20 to-green-500/5",
    accent: "text-green-500",
    border: "border-green-500/30",
    badge: null,
    perks: ["Daily ROI payouts", "Priority support", "Growth dashboard"],
  },
  {
    id: 3,
    name: "Pro Trader",
    min: 500,
    max: 999,
    roiPerDay: 20,
    duration: 7,
    icon: <ShieldCheck className="w-5 h-5" />,
    color: "from-blue-500/20 to-blue-500/5",
    accent: "text-blue-500",
    border: "border-blue-500/30",
    badge: "Popular",
    perks: ["Daily ROI payouts", "24/7 support", "Advanced analytics", "Fast withdrawals"],
  },
  {
    id: 4,
    name: "Advanced Wealth",
    min: 1000,
    max: 4999,
    roiPerDay: 20,
    duration: 7,
    icon: <Bot className="w-5 h-5" />,
    color: "from-purple-500/20 to-purple-500/5",
    accent: "text-purple-500",
    border: "border-purple-500/30",
    badge: null,
    perks: ["Daily ROI payouts", "AI trading bot", "Dedicated manager", "Instant withdrawals"],
  },
  {
    id: 5,
    name: "Elite Investor",
    min: 5000,
    max: 9999,
    roiPerDay: 20,
    duration: 7,
    icon: <Users className="w-5 h-5" />,
    color: "from-orange-500/20 to-orange-500/5",
    accent: "text-orange-500",
    border: "border-orange-500/30",
    badge: "Top Tier",
    perks: ["Daily ROI payouts", "Copy trading", "VIP support", "Bonus rewards", "Instant withdrawals"],
  },
  {
    id: 6,
    name: "Secure Partner",
    min: 10000,
    max: null,
    roiPerDay: 20,
    duration: 7,
    icon: <Building className="w-5 h-5" />,
    color: "from-cyan-500/20 to-cyan-500/5",
    accent: "text-cyan-500",
    border: "border-cyan-500/30",
    badge: "Exclusive",
    perks: ["Daily ROI payouts", "Funded account access", "Personal broker", "Corporate benefits", "Priority everything"],
  },
];

// ─── Calculator ────────────────────────────────────────────────────────────────
// MATH:
//   Daily earnings  = amount × 20%          → $100 × 0.20 = $20/day
//   Total profit    = dailyEarnings × days  → $20  × 2    = $40
//   Total returned  = amount + totalProfit  → $100 + $40  = $140
function InvestmentCalculator() {
  const [amount, setAmount] = useState(500);
  const [days, setDays] = useState(7);

  const ROI_PER_DAY = 0.20; // 20% per day
  const dailyEarnings = amount * ROI_PER_DAY;
  const totalProfit   = dailyEarnings * days;
  const totalReturn   = amount + totalProfit;

  return (
    <section className="bg-card border border-border rounded-3xl p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Calculator className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest">Investment Calculator</h2>
          <p className="text-[10px] text-muted-foreground uppercase font-bold">
            20% daily ROI · drag both sliders to estimate your returns
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Inputs ── */}
        <div className="space-y-6">

          {/* Amount Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Investment Amount
              </label>
              <span className="text-sm font-black text-primary">${amount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={100}
              max={10000}
              step={100}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-primary h-1.5 rounded-full cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-muted-foreground font-bold uppercase">$100</span>
              <span className="text-[9px] text-muted-foreground font-bold uppercase">$10,000</span>
            </div>
          </div>

          {/* Duration Slider — draggable 1–30 days */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Duration
              </label>
              <span className="text-sm font-black text-primary">
                {days} {days === 1 ? "Day" : "Days"}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full accent-primary h-1.5 rounded-full cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-muted-foreground font-bold uppercase">1 Day</span>
              <span className="text-[9px] text-muted-foreground font-bold uppercase">30 Days</span>
            </div>
          </div>

          {/* Rate breakdown box */}
          <div className="bg-muted/40 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground font-bold uppercase">Daily ROI Rate</span>
              <span className="font-black text-primary">20% per day</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground font-bold uppercase">Earnings per day</span>
              <span className="font-black">+${dailyEarnings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground font-bold uppercase">Duration selected</span>
              <span className="font-black">{days} {days === 1 ? "day" : "days"}</span>
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="bg-foreground text-background rounded-2xl p-6 flex flex-col justify-between gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Projected Returns</p>

          <div className="space-y-4">
            {/* Daily earnings */}
            <div>
              <p className="text-[9px] uppercase font-black opacity-50 mb-0.5">Daily Earnings</p>
              <p className="text-2xl font-black italic tracking-tighter">
                +${dailyEarnings.toFixed(2)}
                <span className="text-sm font-bold opacity-50">/day</span>
              </p>
              <p className="text-[9px] opacity-40 font-bold uppercase mt-0.5">
                ${amount.toLocaleString()} × 20%
              </p>
            </div>

            <div className="h-px bg-background/20" />

            {/* Total profit */}
            <div>
              <p className="text-[9px] uppercase font-black opacity-50 mb-0.5">
                Total Profit After {days} {days === 1 ? "Day" : "Days"}
              </p>
              <p className="text-2xl font-black italic tracking-tighter">
                +${totalProfit.toFixed(2)}
              </p>
              <p className="text-[9px] opacity-40 font-bold uppercase mt-0.5">
                ${dailyEarnings.toFixed(2)} × {days} {days === 1 ? "day" : "days"}
              </p>
            </div>

            <div className="h-px bg-background/20" />

            {/* Total returned */}
            <div>
              <p className="text-[9px] uppercase font-black opacity-50 mb-0.5">Total Returned to Wallet</p>
              <p className="text-3xl font-black italic tracking-tighter">
                ${totalReturn.toFixed(2)}
              </p>
              <p className="text-[9px] opacity-40 font-bold uppercase mt-0.5">
                ${amount.toLocaleString()} + ${totalProfit.toFixed(2)}
              </p>
            </div>
          </div>

          <Link
            href="/user-dashboard/deposit"
            className="w-full text-center bg-primary text-primary-foreground py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
          >
            Invest ${amount.toLocaleString()} Now →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Plan Card ────────────────────────────────────────────────────────────────
function PlanCard({ plan }: { plan: (typeof plans)[0] }) {
  const dailyEarnings = plan.min * 0.20;
  const totalProfit   = dailyEarnings * plan.duration;
  const totalReturn   = plan.min + totalProfit;

  return (
    <div
      className={`relative bg-card border ${plan.border} rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-300`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${plan.color.replace("/20", "").replace("/5", "")}`} />

      {plan.badge && (
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1">
          <Star className="w-2.5 h-2.5 fill-current" />
          {plan.badge}
        </div>
      )}

      <div className="p-6 space-y-5">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${plan.color} ${plan.accent} border ${plan.border}`}>
            {plan.icon}
          </div>
          <div>
            <h3 className="text-sm font-black uppercase italic tracking-tight leading-none">{plan.name}</h3>
            <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">
              Min: ${plan.min.toLocaleString()}
              {plan.max ? ` – $${plan.max.toLocaleString()}` : "+"}
            </p>
          </div>
        </div>

        <div className="bg-muted/30 rounded-2xl p-4 text-center">
          <p className={`text-4xl font-black italic tracking-tighter ${plan.accent}`}>
            {plan.roiPerDay}%
          </p>
          <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mt-0.5">
            Daily ROI · {plan.duration} Days
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted/20 rounded-xl p-2">
            <p className={`text-xs font-black ${plan.accent}`}>+${dailyEarnings.toLocaleString()}</p>
            <p className="text-[8px] uppercase font-bold text-muted-foreground mt-0.5">Per Day</p>
          </div>
          <div className="bg-muted/20 rounded-xl p-2">
            <p className="text-xs font-black">{plan.duration}d</p>
            <p className="text-[8px] uppercase font-bold text-muted-foreground mt-0.5">Duration</p>
          </div>
          <div className="bg-muted/20 rounded-xl p-2">
            <p className="text-xs font-black">${totalReturn.toLocaleString()}</p>
            <p className="text-[8px] uppercase font-bold text-muted-foreground mt-0.5">Returned</p>
          </div>
        </div>

        {/* Example earnings note */}
        <p className="text-[9px] text-muted-foreground uppercase font-bold text-center bg-muted/20 rounded-xl py-2 px-3">
          ${plan.min.toLocaleString()} deposit → +${totalProfit.toLocaleString()} profit in {plan.duration} days
        </p>

        <ul className="space-y-1.5">
          {plan.perks.map((perk, i) => (
            <li key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground">
              <CheckCircle2 className={`w-3 h-3 ${plan.accent} shrink-0`} />
              {perk}
            </li>
          ))}
        </ul>

        <Link
          href={`/user-dashboard/deposit?plan=${plan.id}`}
          className="block w-full text-center bg-primary text-primary-foreground py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-primary/20"
        >
          Invest Now <ArrowRight className="inline w-3 h-3 ml-1" />
        </Link>

        <p className="text-center text-[9px] text-muted-foreground uppercase font-bold">
          Min deposit: ${plan.min.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function InvestPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const calcRef = useRef<HTMLDivElement>(null);

  const scrollToCalc = () => {
    calcRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-10">

            {/* Page Hero */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic leading-none">
                  Investment Plans
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  20% Daily ROI · 7-Day Plans · Daily Payouts
                </p>
              </div>
              <button
                onClick={scrollToCalc}
                className="flex items-center cursor-pointer gap-2 border border-border px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all w-full md:w-auto justify-center"
              >
                <Calculator className="w-4 h-4" />
                Calculate Returns
              </button>
            </section>

        

            {/* Plans Grid */}
            <section className="space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-primary" /> Choose Your Plan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </section>

            {/* Calculator */}
            <div ref={calcRef}>
              <InvestmentCalculator />
            </div>

            {/* Trust strip */}
            <section className="border-t border-border pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {[
                { icon: ShieldCheck,  title: "Secure & Protected",  desc: "All investments are insured and secured" },
                { icon: Zap,          title: "Instant Activation",   desc: "Plans activate immediately after deposit" },
                { icon: CheckCircle2, title: "Daily Withdrawals",    desc: "Withdraw your earnings every 7 days" },
              ].map((t, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-4">
                  <t.icon className="w-6 h-6 text-primary" />
                  <p className="text-xs font-black uppercase tracking-tight">{t.title}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{t.desc}</p>
                </div>
              ))}
            </section>

          </div>
        </main>
      </div>
      <UserNav />
    </div>
  );
}