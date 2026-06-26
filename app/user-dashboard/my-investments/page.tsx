"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart2,
  EllipsisVertical,
  PlusCircle,
  Briefcase,
  History,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  ChevronRight,
  TextAlignJustify,
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";
import TradingView from "@/components/landing-page/trading-view-slide";
import { InvestmentSlidePanel } from "@/components/user-dashboard/InvestmentSlidePanel";

import Link from "next/link";

// ─── Image Constants ───────────────────────────────────────────────────────
const IMAGES = [
  "https://i.postimg.cc/gkW8VrZk/Banner-1.jpg",
  "https://i.postimg.cc/jS8fYX3G/Banner-2.jpg",
  "https://i.postimg.cc/7LdTfLkX/Banner-3.jpg",
  "https://i.postimg.cc/15BnDBSY/Banner-4.webp",
  "https://i.postimg.cc/gjdjZXBs/Banner-5.jpg",
  "https://i.postimg.cc/Zqd5sFG6/Banner-6.jpg",
];

// ─── Helper Functions ───────────────────────────────────────────────────────
function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  if (num < 1000000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
}

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
  endDate: string | Date;
  lastProfitDate?: string | Date;
}

// ─── Refined Investment Card ──────────────────────────────────────────
function InvestmentCard({ inv, index, onDelete, onRefresh }: { inv: Investment; index: number; onDelete: (id: string) => void; onRefresh: () => void }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResuming, setIsResuming] = useState(false);

  // Check if investment is outdated (stopped adding ROI before completion)
  const isOutdated = () => {
    const now = new Date();
    const endDate = new Date(inv.endDate);
    const lastProfitDate = inv.lastProfitDate ? new Date(inv.lastProfitDate) : null;

    // Investment is outdated if:
    // 1. Status is active (not completed)
    // 2. Current date is past the end date OR
    // 3. Days passed is less than duration days AND last profit was more than 2 days ago
    const isPastEndDate = now > endDate;
    const hasMissingDays = inv.daysPassed < inv.durationDays;
    const lastProfitOld = lastProfitDate ? (now.getTime() - lastProfitDate.getTime()) > (2 * 24 * 60 * 60 * 1000) : false;

    return inv.status === 'active' && (isPastEndDate || (hasMissingDays && lastProfitOld));
  };

  const statusColors = {
    active: "bg-green-500",
    completed: "bg-blue-500",
    expired: "bg-red-500",
  };

  // Cycle through images based on index
  const backgroundImage = IMAGES[index % IMAGES.length];

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/investments/${inv.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Investment deleted successfully');
        onDelete(inv.id);
        setShowDeleteModal(false);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete investment');
      }
    } catch (error) {
      console.error('Error deleting investment:', error);
      toast.error('An error occurred while deleting the investment');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResume = async () => {
    setIsResuming(true);
    try {
      const response = await fetch(`/api/investments/${inv.id}/resume`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'Investment resumed successfully');
        setShowDeleteModal(false);
        // Refresh the investments to show updated data
        onRefresh();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to resume investment');
      }
    } catch (error) {
      console.error('Error resuming investment:', error);
      toast.error('An error occurred while resuming the investment');
    } finally {
      setIsResuming(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col hover:shadow-2xl hover:border-primary/30 transition-all duration-500 group">
      {/* Header */}
      <div
        className="px-4 py-10 lg:px-5 lg:py-5 text-background flex justify-between items-center relative overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 -rotate-45 translate-x-16 -translate-y-16" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${statusColors[inv.status]}`}
            />
            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-70">
              {inv.status}
            </p>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-none">
            {inv.planName}
          </h3>
        </div>
        <div className="text-right relative z-10">
          <p className="text-[10px] font-black text-white uppercase opacity-60 mb-1">
            Yield Rate
          </p>
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs font-black ">
            {inv.roiRate}% ROI
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-5">
        {/* Core Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">
              Principal
            </span>
            <p className="text-lg font-black text-blue-500 tracking-tighter text-indigo-500">
              ${inv.investmentAmount.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1 border-x border-border px-4">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">
              Profit
            </span>
            <p className="text-lg font-black tracking-tighter text-green-500">
              ${inv.profitEarned.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">
              Timeline
            </span>
            <p className="text-lg font-black tracking-tighter text-amber-500">
              {inv.daysPassed}/{inv.durationDays}d
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Maturity Progress
            </span>
            <span className="text-xs font-black ">
              {Math.round(inv.completionPercentage)}%
            </span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-foreground rounded-full transition-all duration-1000"
              style={{ width: `${inv.completionPercentage}%` }}
            />
          </div>
        </div>


        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowDetailsModal(true)}
            className="cursor-pointer flex-1 bg-muted hover:bg-muted/80 text-foreground py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            View ROI History
          </button>
          <Link
  href="/user-dashboard/invest"
  className="cursor-pointer bg-primary text-primary-foreground hover:opacity-90 rounded-lg transition-all flex items-center justify-center gap-2 h-10 w-10 sm:h-auto sm:w-auto sm:px-4 py-3"
>
  <PlusCircle className="w-4 h-4 shrink-0" />
  <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">
    Reinvest
  </span>
</Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="cursor-pointer px-3 bg-[#229ED9] text-white py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            title="Delete investment"
          >
            <EllipsisVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Profit Distribution Log Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-500 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="hidden lg:block p-2 bg-blue-500/10 rounded-lg">
                  <History className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tighter">
                  Profit Distribution Log
                </h3>
              </div>
              {/* <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button> */}
            </div>

            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">{inv.planName}</span> - ${inv.investmentAmount.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl border border-border overflow-hidden bg-muted/20">
              <table className="w-full text-left border-collapse">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="p-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      Date
                    </th>
                    <th className="p-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      Rate
                    </th>
                    <th className="p-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {inv.profitHistory.length > 0 ? (
                    inv.profitHistory.map((log, idx) => (
                      <tr
                        key={`${inv.id}-log-${idx}`}
                        className="hover:bg-background/50 transition-colors"
                      >
                        <td className="p-3 text-[10px] font-medium text-foreground">
                          {log.date}
                        </td>
                        <td className="p-3 text-[10px] font-black text-emerald-500">
                          +{log.rate}%
                        </td>
                        <td className="p-3 text-[10px] font-black text-right text-cyan-500">
                          +${log.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-8 text-center text-[10px] font-black uppercase text-muted-foreground "
                      >
                        No transactions recorded yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-3 bg-foreground text-background rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter">
                Delete Investment
              </h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this investment? This action cannot be undone and will permanently remove all investment data including profit history.
            </p>

            {inv.status === "active" ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="flex-1 bg-muted hover:bg-muted/80 text-foreground py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
                >
                  Cancel
                </button>
                {isOutdated() && (
                  <button
                    onClick={handleResume}
                    disabled={isResuming || isDeleting}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isResuming ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Resuming...
                      </>
                    ) : (
                      'Resume'
                    )}
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      Confirm
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="flex-1 bg-muted hover:bg-muted/80 text-foreground py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      Confirm
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MyInvestmentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<InvestmentStatus | "all">("all");
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSlidePanel, setShowSlidePanel] = useState(false);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await fetch("/api/investments");
      if (response.ok) {
        const data = await response.json();
        setInvestments(data.investments || []);
      } else {
        toast.error("Failed to fetch investments");
      }
    } catch (error) {
      console.error("Error fetching investments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInvestment = (investmentId: string) => {
    setInvestments((prev) => prev.filter((inv) => inv.id !== investmentId));
  };

  const filteredInvestments =
    activeTab === "all"
      ? [...investments].sort((a, b) => {
        // Active investments first, then completed, then expired
        const statusOrder = { active: 0, completed: 1, expired: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      })
      : investments.filter((inv) => inv.status === activeTab);

  const stats = [
    {
      label: "Total Invested",
      value: `$${formatCompactNumber(investments.reduce((sum, inv) => sum + inv.investmentAmount, 0))}`,
      icon: Briefcase,
      color: "text-blue-500",
      iconBg: "bg-blue-500/10",
      hoverBg: "group-hover:bg-blue-500/20",
      hoverColor: "group-hover:text-blue-500",
    },
    {
      label: "Cumulative ROI",
      value: `$${formatCompactNumber(investments.reduce((sum, inv) => sum + inv.profitEarned, 0))}`,
      icon: TrendingUp,
      color: "text-green-500",
      iconBg: "bg-green-500/10",
      hoverBg: "group-hover:bg-green-500/20",
      hoverColor: "group-hover:text-green-500",
    },
    {
      label: "Active Nodes",
      value: investments.filter((i) => i.status === "active").length.toString(),
      icon: ShieldCheck,
      color: "text-orange-500",
      iconBg: "bg-orange-500/10",
      hoverBg: "group-hover:bg-orange-500/20",
      hoverColor: "group-hover:text-orange-500",
    },
    {
      label: "Completed",
      value: investments
        .filter((i) => i.status === "completed")
        .length.toString(),
      icon: ArrowUpRight,
      color: "text-purple-500",
      iconBg: "bg-purple-500/10",
      hoverBg: "group-hover:bg-purple-500/20",
      hoverColor: "group-hover:text-purple-500",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-20 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter ">
                  Live Investments
                </h1>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-1">
                  Manage your high-yield assets
                </p>
              </div>

        <div className="flex items-center gap-3">
  {/* Tab Switcher */}
  <div className="inline-flex flex-1 sm:flex-none bg-muted/50 p-1 rounded-xl border border-border">
    {["all", "active", "completed"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab as any)}
        className={`cursor-pointer flex-1 sm:flex-none px-3 sm:px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all text-center ${
          activeTab === tab
            ? "bg-foreground text-background shadow-md"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>

  {/* Toggle Button */}
  <button
    onClick={() => setShowSlidePanel(true)}
    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50 transition-colors hover:bg-muted cursor-pointer"
  >
    <TextAlignJustify className="h-4 w-4" />
  </button>
</div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className={`bg-card border border-border px-5 py-3 cursor-pointer rounded-2xl hover:border-primary/50 transition-colors group ${stat.hoverBg} ${stat.hoverColor}`}
                >
                  {/* Icon container */}
                  <div
                    className={`inline-flex w-fit p-2 ${stat.iconBg} rounded-lg transition-colors`}
                  >
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>

                  <p className="text-2xl font-black tracking-tighter mt-2">
                    {stat.value}
                  </p>

                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* <TradingView /> */}


            {/* Main Display */}
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-2xl p-6 animate-pulse"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-2">
                        <div className="h-6 bg-muted rounded w-32" />
                        <div className="h-4 bg-muted rounded w-24" />
                      </div>
                      <div className="w-2 h-2 bg-muted rounded-full" />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded w-16" />
                        <div className="h-8 bg-muted rounded w-20" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded w-16" />
                        <div className="h-8 bg-muted rounded w-20" />
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded w-24" />
                      <div className="h-2 bg-muted rounded-full w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredInvestments.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredInvestments.map((inv, index) => (
                  <InvestmentCard key={inv.id} inv={inv} index={index} onDelete={handleDeleteInvestment} onRefresh={fetchInvestments} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-border rounded-2xl">
                <BarChart2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Empty Portfolio Segment
                </p>
              </div>
            )}
          </div>
          {/* <TradingView /> */}
        </main>


      </div>
      <UserNav />

      {/* Investment Slide Panel */}
      <InvestmentSlidePanel
        isOpen={showSlidePanel}
        onClose={() => setShowSlidePanel(false)}
        investments={investments}
      />
    </div>
  );

}
