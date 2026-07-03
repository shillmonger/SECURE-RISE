"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Trash2,
  Clock,
  Search,
  History,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Loader2,
  Copy,
  Layers,
  DollarSign,
  Calendar,
  Percent,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";
import InvestmentPayoutsSkeleton from "@/components/LoadingSkeleton/InvestmentPayoutsSkeleton";

type InvestmentStatus = "active" | "completed" | "cancelled";

interface ProfitHistoryEntry {
  date: string;
  rate: number;
  amount: number;
  timestamp: string;
}

interface Investment {
  _id: string;
  userId: string;
  userInfo?: {
    username: string;
    email: string;
    fullName: string;
    profileImage?: string;
  };
  planId: number;
  planName: string;
  roiRate: number;
  investmentAmount: number;
  durationDays: number;
  daysPassed: number;
  profitEarned: number;
  completionPercentage: number;
  status: InvestmentStatus;
  profitHistory: ProfitHistoryEntry[];
  startDate: string;
  endDate: string;
  lastProfitDate: string;
  updatedAt: string;
}

export default function AdminInvestmentsPage() {
  const defaultProfileImage = "https://github.com/shadcn.png";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    totalInvested: 0,
    totalProfitPaid: 0,
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteInvestment, setDeleteInvestment] = useState<Investment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchInvestments();
  }, [statusFilter]);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/investments${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`
      );
      const data = await response.json();

      if (data.investments) {
        setInvestments(data.investments);
        calculateStats(data.investments);
      }
    } catch (error) {
      toast.error("Failed to fetch investments");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (investmentData: Investment[]) => {
    const newStats = {
      total: investmentData.length,
      active: investmentData.filter((i) => i.status === "active").length,
      completed: investmentData.filter((i) => i.status === "completed").length,
      totalInvested: investmentData.reduce((sum, i) => sum + (i.investmentAmount || 0), 0),
      totalProfitPaid: investmentData.reduce((sum, i) => sum + (i.profitEarned || 0), 0),
    };
    setStats(newStats);
  };

  const copyToClipboard = (text: string, label = "Copied") => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleDelete = async () => {
    if (!deleteInvestment) return;

    try {
      setIsDeleting(true);
      const response = await fetch('/api/admin/investments', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ investmentId: deleteInvestment._id }),
      });

      if (response.ok) {
        toast.success('Investment deleted successfully');
        setDeleteInvestment(null);
        fetchInvestments();
      } else {
        toast.error('Failed to delete investment');
      }
    } catch (error) {
      toast.error('Failed to delete investment');
    } finally {
      setIsDeleting(false);
    }
  };

  const statsData = [
    { label: "Total Investments", value: stats.total.toString(), icon: History, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active", value: stats.active.toString(), icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Completed", value: stats.completed.toString(), icon: CheckCircle2, color: "text-teal-500", bg: "bg-teal-500/10" },
    { label: "Total Payout", value: `$${stats.totalProfitPaid.toLocaleString()}`, icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  const plans = Array.from(new Set(investments.map((i) => i.planName))).filter(Boolean);

  const filteredInvestments = investments.filter((investment) => {
    const matchesSearch =
      searchTerm === "" ||
      investment.userInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.userInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.userInfo?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.planName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = planFilter === "all" || investment.planName === planFilter;
    return matchesSearch && matchesPlan;
  });

  const formatAmount = (amount: number) => `$${amount.toLocaleString()}`;
  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  const formatDateTime = (dateString: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && investments.length === 0) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
            <InvestmentPayoutsSkeleton />
          </main>
          <AdminNav />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none flex items-center gap-4">
                Investments
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-1">
                <TrendingUp className="w-3 h-3 text-primary" />
                Investment Tracking &amp; Overview
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search investor or plan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-card border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 w-full md:w-64"
                />
              </div>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="bg-card border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Plans</option>
                {plans.map((plan) => (
                  <option key={plan} value={plan}>
                    {plan}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-card border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsData.map((stat, i) => (
              <div key={i} className="bg-card px-5 py-3 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Live</span>
                </div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Total invested banner */}
          <div className="bg-card border border-border rounded-2xl px-6 py-4 mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  Total Capital Invested
                </p>
                <p className="text-lg font-black text-foreground">{formatAmount(stats.totalInvested)}</p>
              </div>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Across {stats.total} investment{stats.total === 1 ? "" : "s"}
            </p>
          </div>

          {/* Investments Table */}
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">Investor</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">ROI Rate</th>
                    <th className="px-6 py-4">Progress</th>
                    <th className="px-6 py-4">Profit Earned</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Start Date</th>
                    <th className="px-6 py-4 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredInvestments.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-8">
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-sm font-black uppercase tracking-tighter mb-2">
                              No investments found
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase mb-6">
                              When users invest, their plans will appear here
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredInvestments.map((investment) => (
                      <tr key={investment._id} className="group hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={investment.userInfo?.profileImage || defaultProfileImage}
                              alt={investment.userInfo?.fullName || "Unknown User"}
                              className="w-10 h-10 rounded-lg object-cover cursor-pointer"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                target.nextElementSibling?.classList.remove("hidden");
                              }}
                            />
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs hidden">
                              {investment.userInfo?.fullName?.charAt(0) || "U"}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-foreground">
                                {investment.userInfo?.fullName || investment.userInfo?.username || "Unknown User"}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] text-muted-foreground">
                                  {investment.userInfo?.email || "No email"}
                                </span>
                                <button
                                  onClick={() =>
                                    copyToClipboard(investment.userInfo?.email || "", "Email")
                                  }
                                  className="p-1 hover:bg-muted rounded-md cursor-pointer transition-colors"
                                  title="Copy email"
                                >
                                  <Copy className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground">{investment.planName}</span>
                            <span className="text-[10px] text-muted-foreground">Plan #{investment.planId}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-foreground">
                            {formatAmount(investment.investmentAmount)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                            <Percent className="w-3 h-3" />
                            {investment.roiRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5 min-w-[110px]">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-muted-foreground">
                                {investment.daysPassed}/{investment.durationDays}d
                              </span>
                              <span className="text-[10px] font-bold text-foreground">
                                {investment.completionPercentage}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  investment.status === "completed" ? "bg-teal-500" : "bg-primary"
                                }`}
                                style={{ width: `${Math.min(investment.completionPercentage, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-green-500">
                            {formatAmount(investment.profitEarned)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`flex items-center w-fit px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${
                              investment.status === "completed"
                                ? "bg-teal-500/10 text-teal-600 border-teal-500/20"
                                : investment.status === "cancelled"
                                ? "bg-red-500/10 text-red-600 border-red-500/20"
                                : "bg-amber-700/10 text-amber-700 border-amber-700/20"
                            }`}
                          >
                            {investment.status}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                            {formatDate(investment.startDate)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end">
                            <button
                              onClick={() => setDeleteInvestment(investment)}
                              className="p-3 bg-red-500/10 text-red-500 cursor-pointer rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                              title="Delete Investment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <AdminNav />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteInvestment && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            onClick={() => setDeleteInvestment(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-red-500/10">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-foreground">Delete Investment</h2>
                  <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-xl p-4 mb-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[10px] font-black uppercase text-muted-foreground">Plan</span>
                  <span className="text-sm font-bold text-foreground">{deleteInvestment.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] font-black uppercase text-muted-foreground">Amount</span>
                  <span className="text-sm font-bold text-foreground">{formatAmount(deleteInvestment.investmentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] font-black uppercase text-muted-foreground">Investor</span>
                  <span className="text-sm font-bold text-foreground">
                    {deleteInvestment.userInfo?.fullName || deleteInvestment.userInfo?.username || 'Unknown'}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                Are you sure you want to permanently delete this investment? This will remove all associated data including profit history.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteInvestment(null)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 cursor-pointer bg-muted text-foreground font-bold rounded-xl hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 cursor-pointer bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}