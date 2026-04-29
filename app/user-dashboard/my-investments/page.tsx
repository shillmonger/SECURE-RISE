"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart2,
  FileText,
  PlusCircle,
  Briefcase,
  History,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────
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

// ─── Refined Investment Card ──────────────────────────────────────────
function InvestmentCard({ inv }: { inv: Investment }) {
  const [showDetails, setShowDetails] = useState(false);

  const statusColors = {
    active: "bg-green-500",
    completed: "bg-blue-500",
    expired: "bg-red-500",
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col hover:shadow-2xl hover:border-primary/30 transition-all duration-500 group">
      
      {/* Header */}
      <div className="bg-foreground p-6 text-background flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -rotate-45 translate-x-16 -translate-y-16" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full animate-pulse ${statusColors[inv.status]}`} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">{inv.status}</p>
          </div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">{inv.planName}</h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase opacity-60 mb-1">Yield Rate</p>
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs font-black italic">
            {inv.roiRate}% ROI
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Core Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">Principal</span>
            <p className="text-lg font-black text-blue-500 tracking-tighter text-indigo-500">${inv.investmentAmount.toLocaleString()}</p>
          </div>
          <div className="space-y-1 border-x border-border px-4">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">Total Profit</span>
            <p className="text-lg font-black tracking-tighter text-green-500">${inv.profitEarned.toLocaleString()}</p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">Timeline</span>
            <p className="text-lg font-black tracking-tighter text-amber-500">{inv.daysPassed}/{inv.durationDays}d</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Maturity Progress</span>
            <span className="text-xs font-black italic">{inv.completionPercentage}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border">
            <div 
              className="h-full bg-foreground rounded-full transition-all duration-1000"
              style={{ width: `${inv.completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Dynamic Detail Section */}
        {showDetails && (
          <div className="pt-4 border-t border-border animate-in fade-in slide-in-from-top-4 duration-500">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <History className="w-3 h-3" /> Profit Distribution Log
            </h4>
            
            <div className="rounded-xl border border-border overflow-hidden bg-muted/20">
              <table className="w-full text-left border-collapse">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="p-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Date</th>
                    <th className="p-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Rate</th>
                    <th className="p-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {inv.profitHistory.length > 0 ? (
                    inv.profitHistory.map((log, idx) => (
                      <tr key={idx} className="hover:bg-background/50 transition-colors">
                        <td className="p-3 text-[10px] font-medium text-foreground">{log.date}</td>
                        <td className="p-3 text-[10px] font-black text-emerald-500">+{log.rate}%</td>
                        <td className="p-3 text-[10px] font-black text-right text-cyan-500">+${log.amount.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-[10px] font-black uppercase text-muted-foreground italic">
                        No transactions recorded yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="cursor-pointer flex-1 bg-muted hover:bg-muted/80 text-foreground py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            {showDetails ? <><ChevronUp className="w-3 h-3"/> Hide Details</> : <><ChevronDown className="w-3 h-3"/> View Full Details</>}
          </button>
          <Link 
            href="/user-dashboard/invest" 
            className="cursor-pointer px-4 bg-primary text-primary-foreground hover:opacity-90 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Reinvest
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
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await fetch('/api/investments');
      if (response.ok) {
        const data = await response.json();
        setInvestments(data.investments || []);
      } else {
        toast.error('Failed to fetch investments');
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInvestments = activeTab === "all" 
    ? investments 
    : investments.filter(inv => inv.status === activeTab);

  const stats = [
    {
      label: "Total Invested",
      value: `$${investments.reduce((sum, inv) => sum + inv.investmentAmount, 0).toLocaleString()}`,
      icon: Briefcase,
      color: "text-blue-500",
    },
    {
      label: "Cumulative ROI",
      value: `$${investments.reduce((sum, inv) => sum + inv.profitEarned, 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Active Nodes",
      value: investments.filter(i => i.status === 'active').length.toString(),
      icon: ShieldCheck,
      color: "text-orange-500",
    },
    {
      label: "Completed",
      value: investments.filter(i => i.status === 'completed').length.toString(),
      icon: ArrowUpRight,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Portfolio</h1>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-2">Manage your high-yield assets</p>
              </div>

              {/* Tab Switcher */}
              <div className="inline-flex bg-muted/50 p-1 rounded-xl border border-border">
                {["all", "active", "completed"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`cursor-pointer px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === tab
                        ? "bg-foreground text-background shadow-md"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="bg-card border border-border p-5 rounded-2xl hover:border-primary/50 transition-colors">
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-4`} />
                  <p className="text-2xl font-black tracking-tighter italic">{stat.value}</p>
                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Main Display */}
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : filteredInvestments.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredInvestments.map((inv) => (
                  <InvestmentCard key={inv.id} inv={inv} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-border rounded-2xl">
                <BarChart2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Empty Portfolio Segment</p>
              </div>
            )}

          </div>
        </main>
      </div>
      <UserNav />
    </div>
  );
}