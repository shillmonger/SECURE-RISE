"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Package, 
  ShieldCheck, 
  Zap, 
  Clock, 
  PieChart, 
  RefreshCcw,
  Target
} from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

// ─── Data Types ──────────────────────────────────────────────────────────────

interface ProfitStat {
  label: string;
  value: string;
  trend: string;
  isUp: boolean;
}

interface PlanPerformance {
  name: string;
  activeInvestment: string;
  totalEarned: string;
  roiProgress: number;
}

// ─── Mock Data (Frontend Only) ──────────────────────────────────────────────

const PROFIT_STATS: ProfitStat[] = [
  { label: "Total Net Profit", value: "$0.00", trend: "+15.2%", isUp: true },
  { label: "Today's ROI", value: "$0.00", trend: "+2.5%", isUp: true },
  { label: "Ref. Commissions", value: "$0.00", trend: "+10.1%", isUp: true },
  { label: "Active Capital", value: "$0.00", trend: "Stable", isUp: true },
];

const PLAN_PERFORMANCE: PlanPerformance[] = [
  { name: "Platinum Alpha Plan", activeInvestment: "$10,000", totalEarned: "$2,400", roiProgress: 75 },
  { name: "Gold Standard Plan", activeInvestment: "$5,000", totalEarned: "$850", roiProgress: 45 },
  { name: "Starter Node", activeInvestment: "$1,000", totalEarned: "$120", roiProgress: 12 },
];

const DAILY_ROI_FLOW = [45, 80, 55, 95, 70, 85, 60, 110, 75, 90, 65, 120];

export default function EarningsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState("30D");

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 pb-32">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">
                  My Earnings
                </h1>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-primary" /> Real-time capital growth & yield tracking
                </p>
              </div>

<div className="hidden lg:flex flex-wrap gap-3 w-full lg:w-auto">
                    <div className="flex bg-card border border-border rounded-2xl p-1.5 shadow-sm">
                  {["3D", "7D", "30D", "ALL"].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${
                        timeRange === range ? "bg-foreground text-background shadow-lg" : "hover:bg-muted"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* High-Level Profit Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
              {PROFIT_STATS.map((stat, i) => (
                <div key={i} className="bg-card border border-border p-8 rounded-[1rem] shadow-sm group hover:border-foreground transition-all">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-3">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-black italic tracking-tighter leading-none">{stat.value}</h3>
                    <div className={`flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-lg ${
                      stat.isUp ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <RefreshCcw className="w-3 h-3 animate-spin-slow" />}
                      {stat.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
              
              {/* ROI Growth Chart */}
              <div className="lg:col-span-8 bg-card border border-border rounded-[1.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-12 relative z-10">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" /> Yield
                    </h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">ROI Performance</p>
                  </div>
                  <div className="flex items-center gap-4 text-[9px] font-black uppercase opacity-50">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> Active</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-muted-foreground/30" /> Projected</div>
                  </div>
                </div>
                
                {/* Bar Chart Section */}
                <div className="h-[320px] w-full flex items-end justify-between gap-2 px-2 relative z-10">
                  {DAILY_ROI_FLOW.map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end h-full group relative">
                      <div 
                        className="w-full bg-muted/20 absolute bottom-0 rounded-t-lg transition-all" 
                        style={{ height: `${height * 0.7}%` }} 
                      />
                      <div 
                        className="w-full bg-foreground/10 group-hover:bg-primary transition-all rounded-t-lg relative z-10" 
                        style={{ height: `${height}%` }} 
                      />
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-tighter opacity-40">
                        {i + 1} Apr
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan Performance Leaderboard */}
              <div className="lg:col-span-4 bg-foreground text-background rounded-[1.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-10 flex items-center gap-2 relative z-10">
                  <Package className="w-6 h-6" /> Performance Index
                </h3>
                
                <div className="space-y-8 relative z-10">
                  {PLAN_PERFORMANCE.map((plan, i) => (
                    <div key={i} className="space-y-3 group cursor-default">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">
                            {plan.name}
                          </p>
                          <p className="text-[9px] font-bold text-background/50 uppercase tracking-widest">Active: {plan.activeInvestment}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black italic">{plan.totalEarned}</p>
                          <p className="text-[8px] font-black uppercase text-primary">Profit</p>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-background/10 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary transition-all duration-1000" 
                            style={{ width: `${plan.roiProgress}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-background/10 relative z-10">
                    <button className="w-full py-4 bg-background text-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2">
                        Compound Earnings <ArrowUpRight className="w-3 h-3" />
                    </button>
                </div>
                <Zap className="absolute -right-10 -bottom-10 w-48 h-48 text-background/5 rotate-12" />
              </div>
            </div>

            {/* System Security / Trust Section */}
             <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="hidden md:flex w-12 h-12 rounded-2xl bg-primary/10 items-center justify-center">
  <ShieldCheck className="w-6 h-6 text-primary" />
</div>

                 <div className="space-y-1">
                  <h4 className="text-sm font-black uppercase italic tracking-tighter">Yield Integrity Protocols</h4>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.1em] max-w-md">
                    Earnings are processed every 24 hours through our automated ledger. Historical data is immutable.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase text-muted-foreground mb-1 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" /> Next Payout
                  </p>
                  <p className="text-2xl font-black italic tracking-tight">14:22:05</p>
                </div>
                <div className="h-12 w-[2px] bg-border" />
                <PieChart className="w-10 h-10 text-muted-foreground opacity-30" />
              </div>
            </div>
          </div>
        </main>

        <UserNav />
      </div>
    </div>
  );
}