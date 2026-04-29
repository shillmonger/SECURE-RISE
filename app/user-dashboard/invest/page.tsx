"use client";
import React, { useState, useRef, useEffect } from "react";
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
import { toast } from "sonner";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";
import InvestmentModal from "@/components/user-dashboard/InvestmentModal";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Plan {
  id: number;
  name: string;
  min: number;
  max: number | null;
  roiPerDay: number;
  duration: number;
  icon: React.ReactNode;
  color: string;
  accent: string;
  border: string;
  badge: string | null;
  perks: string[];
}

// ─── Plan Data ────────────────────────────────────────────────────────────────
const plans: Plan[] = [
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
function InvestmentCalculator({ setSelectedPlan, setIsModalOpen }: { setSelectedPlan: (plan: Plan) => void; setIsModalOpen: (isOpen: boolean) => void }) {
  const [amount, setAmount] = useState(500);
  const [days, setDays] = useState(7);

  const ROI_PER_DAY = 0.20; // 20% per day
  const dailyEarnings = amount * ROI_PER_DAY;
  const totalProfit = dailyEarnings * days;
  const totalReturn = amount + totalProfit;

  return (
    <section className="space-y-6">
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
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 space-y-6 space-y-6">

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
        </div>
      </div>
    </section>
  );
}

// ─── Plan Card ────────────────────────────────────────────────────────────────
function PlanCard({ plan, onInvestClick }: { plan: Plan; onInvestClick: (plan: Plan) => void }) {
  const dailyEarnings = plan.min * 0.20;
  const totalProfit = dailyEarnings * plan.duration;
  const totalReturn = plan.min + totalProfit;

  return (
    <div
      className={`relative bg-card border ${plan.border} rounded-3xl cursor-pointer overflow-hidden group hover:scale-[1.02] hover:shadow-xl hover:shadow-${plan.accent.split('-')[1]}-500/10 transition-all duration-500 ease-out`}
    >
      {/* Top gradient line */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${plan.color.replace("/20", "").replace("/5", "")}`} />

      {/* Badge */}
      {plan.badge && (
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-primary/20 animate-pulse">
          <Star className="w-3 h-3 fill-current" />
          {plan.badge}
        </div>
      )}

      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${plan.color} ${plan.accent} border ${plan.border} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            {plan.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black uppercase italic tracking-tight leading-tight">{plan.name}</h3>
            <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">
              Min: ${plan.min.toLocaleString()}
              {plan.max ? ` – $${plan.max.toLocaleString()}` : "+"}
            </p>
          </div>
        </div>

        {/* ROI Display */}
        <div className={`bg-gradient-to-br ${plan.color} rounded-2xl p-5 text-center border ${plan.border} shadow-inner`}>
          <p className={`text-5xl font-black italic tracking-tighter ${plan.accent} drop-shadow-sm`}>
            {plan.roiPerDay}%
          </p>
          <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mt-1">
            Daily ROI · {plan.duration} Days
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-muted/40 rounded-xl p-3 text-center border border-border/50 hover:bg-muted/60 transition-colors">
            <p className={`text-sm font-black ${plan.accent}`}>+${dailyEarnings.toLocaleString()}</p>
            <p className="text-[8px] uppercase font-bold text-muted-foreground mt-0.5">Per Day</p>
          </div>
          <div className="bg-muted/40 rounded-xl p-3 text-center border border-border/50 hover:bg-muted/60 transition-colors">
            <p className="text-sm font-black">{plan.duration}d</p>
            <p className="text-[8px] uppercase font-bold text-muted-foreground mt-0.5">Duration</p>
          </div>
          <div className="bg-muted/40 rounded-xl p-3 text-center border border-border/50 hover:bg-muted/60 transition-colors">
            <p className="text-sm font-black">${totalReturn.toLocaleString()}</p>
            <p className="text-[8px] uppercase font-bold text-muted-foreground mt-0.5">Returned</p>
          </div>
        </div>

        {/* Example Note */}
        <div className="bg-muted/30 rounded-xl py-3 px-4 border border-border/30">
          <p className="text-[9px] text-muted-foreground uppercase font-bold text-center leading-relaxed">
            ${plan.min.toLocaleString()} deposit → <span className={plan.accent}>+${totalProfit.toLocaleString()}</span> profit in {plan.duration} days
          </p>
        </div>

        {/* Perks */}
        <ul className="space-y-2">
          {plan.perks.map((perk: string, i: number) => (
            <li key={i} className="flex items-center gap-2.5 text-[10px] font-bold uppercase text-muted-foreground hover:text-foreground transition-colors">
              <div className={`p-0.5 rounded-full bg-${plan.accent.split('-')[1]}-500/10`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${plan.accent}`} />
              </div>
              {perk}
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          onClick={() => onInvestClick(plan)}
          className="block w-full text-center cursor-pointer bg-primary text-primary-foreground py-4 rounded-xl text-[11px] font-black uppercase tracking-widest hover:opacity-90 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          Invest Now
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>

        {/* Min Deposit */}
        <p className="text-center text-[9px] text-muted-foreground uppercase font-bold opacity-70">
          Minimum deposit: ${plan.min.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function InvestPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const calcRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserBalance();
  }, []);

  const fetchUserBalance = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUserBalance(data.user.accountBalance || 0);
      }
    } catch (error) {
      console.error('Error fetching user balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToCalc = () => {
    calcRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInvestClick = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleInvestConfirm = async (planId: number, amount: number) => {
    try {
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId, amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Investment failed');
      }

      // Update user balance
      setUserBalance(prev => prev - amount);
      
      return data;
    } catch (error) {
      throw error;
    }
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
                  <PlanCard key={plan.id} plan={plan} onInvestClick={handleInvestClick} />
                ))}
              </div>
            </section>

            {/* Calculator */}
            <div ref={calcRef}>
              <InvestmentCalculator setSelectedPlan={setSelectedPlan} setIsModalOpen={setIsModalOpen} />
            </div>

            {/* Trust strip */}
            <section className="border-t border-border pt-8 grid grid-cols-2 sm:grid-cols-2 gap-4 text-center">
              {[
                { icon: ShieldCheck,  title: "Secure & Protected",  desc: "All investments are insured and secured" },
                { icon: Zap,          title: "Instant Activation",   desc: "Plans activate immediately after deposit" },
                // { icon: CheckCircle2, title: "Daily Withdrawals",    desc: "Withdraw your earnings every 7 days" },
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
      
      {/* Investment Modal */}
      {selectedPlan && (
        <InvestmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          plan={selectedPlan}
          userBalance={userBalance}
          onConfirm={handleInvestConfirm}
        />
      )}
    </div>
  );
}