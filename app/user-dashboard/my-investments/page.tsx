"use client";
import React, { useState } from "react";
import {
  BarChart2,
  FileText,
  PlusCircle,
  Briefcase,
  History,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";
import Link from "next/link";

// ─── Types & Mock Data ────────────────────────────────────────────────────────
type InvestmentStatus = "active" | "completed" | "expired";

interface ProfitHistory {
  date: string;
  rate: number;
  amount: number;
}

interface Investment {
  id: string;
  planName: string;
  roiRate: number;
  investmentAmount: number;
  durationDays: number;
  daysPassed: number;
  profitEarned: number;
  completionPercentage: number;
  status: InvestmentStatus;
  profitHistory: ProfitHistory[];
}

const mockInvestments: Investment[] = [
  {
    id: "INV-001",
    planName: "Rudiments Plan",
    roiRate: 4,
    investmentAmount: 450.0,
    durationDays: 45,
    daysPassed: 6,
    profitEarned: 108.0,
    completionPercentage: 13,
    status: "active",
    profitHistory: Array(6).fill({
        date: "Apr 14, 2026",
        rate: 4,
        amount: 18.00
    })
  },
  {
    id: "INV-002",
    planName: "Starter Rise",
    roiRate: 20,
    investmentAmount: 150.0,
    durationDays: 7,
    daysPassed: 7,
    profitEarned: 210.0,
    completionPercentage: 100,
    status: "completed",
    profitHistory: Array(7).fill({
        date: "Apr 07, 2026",
        rate: 20,
        amount: 30.00
    })
  },
  {
    id: "INV-003",
    planName: "Pro Trader",
    roiRate: 20,
    investmentAmount: 500.0,
    durationDays: 7,
    daysPassed: 2,
    profitEarned: 200.0,
    completionPercentage: 28,
    status: "active",
    profitHistory: Array(2).fill({
        date: "Apr 14, 2026",
        rate: 20,
        amount: 100.00
    })
  },
  {
    id: "INV-004",
    planName: "Basic Growth",
    roiRate: 20,
    investmentAmount: 250.0,
    durationDays: 7,
    daysPassed: 0,
    profitEarned: 0.0,
    completionPercentage: 0,
    status: "active",
    profitHistory: []
  },
  {
    id: "INV-005",
    planName: "Elite Investor",
    roiRate: 20,
    investmentAmount: 6000.0,
    durationDays: 7,
    daysPassed: 7,
    profitEarned: 8400.0,
    completionPercentage: 100,
    status: "expired",
    profitHistory: Array(7).fill({
        date: "Mar 20, 2026",
        rate: 20,
        amount: 1200.00
    })
  },
  {
    id: "INV-006",
    planName: "Secure Partner",
    roiRate: 20,
    investmentAmount: 12000.0,
    durationDays: 7,
    daysPassed: 1,
    profitEarned: 2400.0,
    completionPercentage: 14,
    status: "active",
    profitHistory: Array(1).fill({
        date: "Apr 14, 2026",
        rate: 20,
        amount: 2400.00
    })
  },
];

// ─── Sub-Components ──────────────────────────────────────────────────────────

function InvestmentCard({ inv }: { inv: Investment }) {
  const statusLabels: Record<InvestmentStatus, string> = {
      active: "Active Strategy",
      completed: "Matured Plan",
      expired: "Plan Expired"
  }

  const historySample = inv.profitHistory[0] || {
    date: inv.daysPassed > 0 ? "Recent" : "Pending",
    rate: inv.roiRate,
    amount: (inv.investmentAmount * inv.roiRate) / 100
  };

  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col hover:border-primary/40 transition-all duration-500 group">
      
      {/* Header Section: Black & White Theme */}
      <div className="bg-foreground p-6 text-background flex justify-between items-start">
        <div>
          <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none">{inv.planName}</h3>
          <div className="flex items-center gap-1.5 mt-2">
            <ShieldCheck className="w-3 h-3 opacity-60" />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{statusLabels[inv.status]}</p>
          </div>
        </div>
        <div className="bg-background/10 border border-background/20 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
          {inv.roiRate}% ROI
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6 flex-1 flex flex-col">
        
        {/* Data Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Principal", value: `$${inv.investmentAmount.toLocaleString()}` },
            { label: "Duration", value: `${inv.durationDays} Days` },
            { label: "Cycle", value: `${inv.daysPassed}d / ${inv.durationDays}d` },
            { label: "Total Earned", value: `$${inv.profitEarned.toLocaleString()}`, highlight: true },
          ].map((item, i) => (
            <div key={i} className="bg-muted/30 p-3 rounded-2xl border border-border/50">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">
                {item.label}
              </span>
              <span className={`text-base font-black italic tracking-tight ${item.highlight ? 'text-primary' : 'text-foreground'}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Progress Bar Section */}
        <div className="space-y-2 px-1">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-muted-foreground">Completion</span>
                <span>{inv.completionPercentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                    className="h-full bg-foreground transition-all duration-1000 ease-out"
                    style={{ width: `${inv.completionPercentage}%` }}
                />
            </div>
        </div>

         {/* Profit History Block - Styled as requested */}
        <div className="bg-muted/20 border border-border rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <History className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Recent Profit History</p>
                </div>
                <span className="text-[10px] font-black text-muted-foreground">({inv.daysPassed} TOTAL)</span>
            </div>
            
            {inv.daysPassed > 0 ? (
                 <div className="flex justify-between items-center bg-background border border-border p-3 rounded-xl tabular-nums group-hover:border-primary/20 transition-colors">
                    <span className="text-[10px] font-black uppercase text-muted-foreground">{historySample.date}</span>
                    <span className="text-[10px] font-black text-foreground">+{historySample.rate}%</span>
                    <span className="text-sm font-black italic text-primary">+${historySample.amount.toFixed(2)}</span>
                </div>
            ) : (
                <div className="text-center py-3 text-[10px] text-muted-foreground font-black uppercase italic border border-dashed border-border rounded-xl bg-background/50">
                    Awaiting distribution...
                </div>
            )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2 mt-auto">
            <Link href={`/user-dashboard/my-investments/${inv.id}`} className="bg-foreground text-background text-center py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <FileText className="w-3.5 h-3.5" />
                View Plan
            </Link>
            <Link href="/user-dashboard/invest" className="border border-border text-foreground text-center py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all flex items-center justify-center gap-2">
                <PlusCircle className="w-3.5 h-3.5" />
                New Plan
            </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MyInvestmentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<InvestmentStatus | "all">("active");

  const filteredInvestments = activeTab === "all" 
    ? mockInvestments 
    : mockInvestments.filter(inv => inv.status === activeTab);

  const totalPlans = mockInvestments.length;
  const totalProfit = mockInvestments.reduce((sum, inv) => sum + inv.profitEarned, 0);
  const totalWithdrawal = mockInvestments
    .filter(inv => inv.status === 'completed' || inv.status === 'expired')
    .reduce((sum, inv) => sum + inv.investmentAmount + inv.profitEarned, 0);

  const totalToday = filteredInvestments
    .filter(inv => inv.status === 'active')
    .reduce((sum, inv) => sum + (inv.profitHistory[0]?.amount || 0), 0);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* Header Section */}
            <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-border pb-8">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-none flex items-center gap-4">
                  My Portfolio
                </h1>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-primary" />
                  Real-time Asset Performance & Profit Logs
                </p>
              </div>

              {/* Tabs - Monochrome Style */}
              <div className="flex bg-muted/40 p-1 rounded-2xl border border-border w-full lg:w-auto">
                {["all", "active", "completed", "expired"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as InvestmentStatus | "all")}
                    className={`flex-1 lg:px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                      activeTab === tab 
                      ? "bg-foreground text-background shadow-xl" 
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </section>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               {[
                   { label: "Live Plans", value: totalPlans.toString(), icon: Briefcase },
                   { label: "Net Profit", value: `$${totalProfit.toLocaleString()}`, icon: TrendingUp },
                   { label: "P/L Today", value: `+$${totalToday.toLocaleString()}`, icon: ArrowUpRight },
                   { label: "Total Out", value: `$${totalWithdrawal.toLocaleString()}`, icon: ShieldCheck },
               ].map((stat, i) => (
                <div key={i} className="bg-card border border-border p-6 rounded-3xl space-y-3 relative overflow-hidden group">
                    <stat.icon className="absolute -right-2 -top-2 w-12 h-12 text-muted-foreground/10 group-hover:text-primary/10 transition-colors" />
                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.15em]">{stat.label}</p>
                    <p className="text-2xl md:text-3xl font-black italic tracking-tighter tabular-nums">{stat.value}</p>
                </div>
               ))}
            </div>

            {/* Investments Grid */}
            {filteredInvestments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filteredInvestments.map((inv) => (
                  <InvestmentCard key={inv.id} inv={inv} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 border border-dashed border-border rounded-[3rem] bg-card/50">
                <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart2 className="text-muted-foreground w-10 h-10" />
                </div>
                <h3 className="text-lg font-black uppercase italic tracking-tighter">No Records Found</h3>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-2 max-w-xs mx-auto">
                  You don't have any {activeTab} investments at this moment.
                </p>
                <Link href="/user-dashboard/invest" className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-8 hover:scale-105 transition-all">
                    Start Investing
                    <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            )}

          </div>
        </main>
      </div>
      <UserNav />
    </div>
  );
}