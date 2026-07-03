"use client";

import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  Eye,
  Clock,
  Wallet,
  Search,
  History,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Copy,
  Landmark,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";
import InvestmentPayoutsSkeleton from "@/components/LoadingSkeleton/InvestmentPayoutsSkeleton";

type MethodId = "bank" | "paypal" | "payoneer" | "momo";

interface WithdrawalDetails {
  // bank transfer
  country?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  swift?: string;
  iban?: string;
  currency?: string;
  // paypal / payoneer
  email?: string;
  // mobile money
  provider?: string;
  phoneNumber?: string;
  accountHolderName?: string;
}

interface OtherWithdrawal {
  _id: string;
  withdrawalId: string;
  userId: string;
  username: string;
  userEmail: string;
  userInfo?: {
    username: string;
    email: string;
    fullName: string;
    profileImage?: string;
  };
  amount: number;
  fee: number;
  receiveAmount: number;
  method: MethodId;
  details: WithdrawalDetails;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  rejectionReason?: string;
}

const METHOD_META: Record<MethodId, { label: string; icon: React.ElementType }> = {
  bank: { label: "Bank Transfer", icon: Landmark },
  paypal: { label: "PayPal", icon: Wallet },
  payoneer: { label: "Payoneer", icon: CreditCard },
  momo: { label: "Mobile Money", icon: Smartphone },
};

export default function AdminOtherPayoutsPage() {
  const defaultProfileImage = "https://github.com/shadcn.png";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [withdrawals, setWithdrawals] = useState<OtherWithdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    rejected: 0,
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: "approve" | "reject";
    withdrawalId: string;
    userName: string;
    amount: number;
    method: MethodId;
  } | null>(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<OtherWithdrawal | null>(null);

  useEffect(() => {
    fetchWithdrawals();
  }, [statusFilter]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/withdrawals/other${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`
      );
      const data = await response.json();

      if (data.withdrawals) {
        setWithdrawals(data.withdrawals);
        calculateStats(data.withdrawals);
      }
    } catch (error) {
      toast.error("Failed to fetch withdrawals");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (withdrawalData: OtherWithdrawal[]) => {
    const newStats = {
      total: withdrawalData.length,
      pending: withdrawalData.filter((w) => w.status === "pending").length,
      completed: withdrawalData.filter((w) => w.status === "approved").length,
      rejected: withdrawalData.filter((w) => w.status === "rejected").length,
    };
    setStats(newStats);
  };

  const handleAction = async (
    withdrawalId: string,
    action: "approve" | "reject"
  ) => {
    setActionLoading(withdrawalId);
    try {
      const response = await fetch("/api/admin/withdrawals/other", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          withdrawalId,
          action,
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error || "Failed to update withdrawal");
      } else {
        toast.success(data.message);
        fetchWithdrawals();
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setActionLoading(null);
      setConfirmModal(null);
    }
  };

  const openConfirmModal = (
    action: "approve" | "reject",
    withdrawalId: string,
    userName: string,
    amount: number,
    method: MethodId
  ) => {
    setConfirmModal({ isOpen: true, action, withdrawalId, userName, amount, method });
  };

  const closeConfirmModal = () => {
    setConfirmModal(null);
  };

  const confirmAction = () => {
    if (!confirmModal) return;
    handleAction(confirmModal.withdrawalId, confirmModal.action);
  };

  const copyToClipboard = (text: string, label = "Copied") => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const statsData = [
    { label: "Total Records", value: stats.total.toString(), icon: History, color: "text-primary", bg: "bg-primary/10" },
    { label: "Pending", value: stats.pending.toString(), icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Approved", value: stats.completed.toString(), icon: CheckCircle2, color: "text-teal-500", bg: "bg-teal-500/10" },
    { label: "Rejected", value: stats.rejected.toString(), icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const matchesSearch =
      searchTerm === "" ||
      withdrawal.userInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.userInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.userInfo?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === "all" || withdrawal.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const formatAmount = (amount: number) => `$${amount.toLocaleString()}`;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const maskAccountNumber = (value: string) => {
    if (!value) return "—";
    if (value.length <= 4) return value;
    return `${"•".repeat(Math.max(value.length - 4, 0))}${value.slice(-4)}`;
  };

  // Primary destination identifier shown in the table row, per method
  const getPrimaryDestination = (withdrawal: OtherWithdrawal) => {
    const { method, details } = withdrawal;
    switch (method) {
      case "bank":
        return {
          label: details.bankName || "Bank Account",
          value: details.accountNumber || "",
          display: maskAccountNumber(details.accountNumber || ""),
        };
      case "paypal":
      case "payoneer":
        return {
          label: METHOD_META[method].label,
          value: details.email || "",
          display: details.email || "—",
        };
      case "momo":
        return {
          label: details.provider || "Mobile Money",
          value: details.phoneNumber || "",
          display: details.phoneNumber || "—",
        };
      default:
        return { label: "—", value: "", display: "—" };
    }
  };

  if (loading && withdrawals.length === 0) {
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
                Payout Requests
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-1">
                <Wallet className="w-3 h-3 text-primary" />
                Bank / PayPal / Payoneer / Mobile Money
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search investor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-card border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 w-full md:w-64"
                />
              </div>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="bg-card border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Methods</option>
                <option value="bank">Bank Transfer</option>
                <option value="paypal">PayPal</option>
                <option value="payoneer">Payoneer</option>
                <option value="momo">Mobile Money</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-card border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
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
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Payouts Table */}
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">Investor</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Destination</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredWithdrawals.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8">
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-sm font-black uppercase tracking-tighter mb-2">
                              No withdrawals found
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase mb-6">
                              When payout requests are made, they will appear here
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredWithdrawals.map((withdrawal) => {
                      const MethodIcon = METHOD_META[withdrawal.method]?.icon || Wallet;
                      const destination = getPrimaryDestination(withdrawal);
                      return (
                        <tr key={withdrawal._id} className="group hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={withdrawal.userInfo?.profileImage || defaultProfileImage}
                                alt={withdrawal.userInfo?.fullName || withdrawal.username || "Unknown User"}
                                className="w-10 h-10 rounded-lg object-cover cursor-pointer"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  target.nextElementSibling?.classList.remove("hidden");
                                }}
                              />
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs hidden">
                                {withdrawal.userInfo?.fullName?.charAt(0) || withdrawal.username?.charAt(0) || "U"}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-foreground">
                                  {withdrawal.userInfo?.fullName || withdrawal.username || "Unknown User"}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] text-muted-foreground">
                                    {withdrawal.userInfo?.email || withdrawal.userEmail || "No email"}
                                  </span>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        withdrawal.userInfo?.email || withdrawal.userEmail || "",
                                        "Email"
                                      )
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
                              <span className="text-sm font-bold text-foreground">{formatAmount(withdrawal.amount)}</span>
                              <span className="text-[10px] text-muted-foreground">
                                Net {formatAmount(withdrawal.receiveAmount)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-muted-foreground" title={destination.value}>
                                {destination.display}
                              </span>
                              {destination.value && (
                                <button
                                  onClick={() => copyToClipboard(destination.value, destination.label)}
                                  className="p-1.5 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                                  title="Copy"
                                >
                                  <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <MethodIcon className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-xs font-medium text-muted-foreground uppercase">
                                {METHOD_META[withdrawal.method]?.label}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div
                              className={`flex items-center w-fit px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${
                                withdrawal.status === "approved"
                                  ? "bg-teal-500/10 text-teal-600 border-teal-500/20"
                                  : withdrawal.status === "rejected"
                                  ? "bg-red-500/10 text-red-600 border-red-500/20"
                                  : "bg-amber-700/10 text-amber-700 border-amber-700/20"
                              }`}
                            >
                              {withdrawal.status === "approved" ? "Approved" : withdrawal.status}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                              {formatDate(withdrawal.createdAt)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setSelectedWithdrawal(withdrawal)}
                                className="p-3 bg-muted text-foreground cursor-pointer rounded-lg hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {withdrawal.status === "pending" ? (
                                <>
                                  <button
                                    onClick={() =>
                                      openConfirmModal(
                                        "approve",
                                        withdrawal.withdrawalId,
                                        withdrawal.userInfo?.fullName || withdrawal.username,
                                        withdrawal.amount,
                                        withdrawal.method
                                      )
                                    }
                                    disabled={actionLoading === withdrawal.withdrawalId}
                                    className="p-3 bg-teal-500/10 text-teal-600 cursor-pointer rounded-lg hover:bg-teal-500 hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Approve"
                                  >
                                    {actionLoading === withdrawal.withdrawalId ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Check className="w-4 h-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() =>
                                      openConfirmModal(
                                        "reject",
                                        withdrawal.withdrawalId,
                                        withdrawal.userInfo?.fullName || withdrawal.username,
                                        withdrawal.amount,
                                        withdrawal.method
                                      )
                                    }
                                    disabled={actionLoading === withdrawal.withdrawalId}
                                    className="p-3 bg-red-500/10 text-red-500 cursor-pointer rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Reject"
                                  >
                                    {actionLoading === withdrawal.withdrawalId ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <X className="w-4 h-4" />
                                    )}
                                  </button>
                                </>
                              ) : (
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter italic px-2 self-center">
                                  Processed
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <AdminNav />
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div onClick={closeConfirmModal} className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
            <div
              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                confirmModal.action === "approve" ? "bg-teal-500/10" : "bg-red-500/10"
              }`}
            >
              {confirmModal.action === "approve" ? (
                <Check className="w-8 h-8 text-teal-500" />
              ) : (
                <X className="w-8 h-8 text-red-500" />
              )}
            </div>

            <h2 className="text-xl font-black text-center uppercase tracking-tight mb-2">
              {confirmModal.action === "approve" ? "Approve Payout" : "Reject Payout"}
            </h2>

            <div className="bg-muted/50 border border-border rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This action <strong>cannot be undone</strong>. Please review the details below before confirming.
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Investor</span>
                <span className="text-sm font-bold text-foreground">{confirmModal.userName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Amount</span>
                <span className="text-sm font-bold text-foreground">
                  ${confirmModal.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Method</span>
                <span className="text-sm font-bold text-foreground">
                  {METHOD_META[confirmModal.method]?.label}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Action</span>
                <span
                  className={`text-sm font-bold uppercase ${
                    confirmModal.action === "approve" ? "text-teal-500" : "text-red-500"
                  }`}
                >
                  {confirmModal.action}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeConfirmModal}
                disabled={actionLoading === confirmModal.withdrawalId}
                className="flex-1 px-4 py-3 cursor-pointer bg-muted text-foreground rounded-lg text-xs font-black uppercase tracking-wider hover:bg-muted/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={actionLoading === confirmModal.withdrawalId}
                className={`flex-1 px-4 py-3 cursor-pointer rounded-lg text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  confirmModal.action === "approve"
                    ? "bg-teal-500 text-white hover:bg-teal-600"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                {actionLoading === confirmModal.withdrawalId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {confirmModal.action === "approve" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    {confirmModal.action === "approve" ? "Approve" : "Reject"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedWithdrawal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedWithdrawal(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">
            {/* Fixed header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
              <div>
                <h2 className="text-sm font-black uppercase tracking-tight">Withdrawal Details</h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                  {selectedWithdrawal.withdrawalId}
                </p>
              </div>
              <button
                onClick={() => setSelectedWithdrawal(null)}
                className="p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Investor */}
              <div className="flex items-center gap-3">
                <img
                  src={selectedWithdrawal.userInfo?.profileImage || defaultProfileImage}
                  alt={selectedWithdrawal.userInfo?.fullName || selectedWithdrawal.username}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <p className="text-sm font-black text-foreground">
                    {selectedWithdrawal.userInfo?.fullName || selectedWithdrawal.username || "Unknown User"}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] text-muted-foreground">
                      {selectedWithdrawal.userInfo?.email || selectedWithdrawal.userEmail}
                    </p>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          selectedWithdrawal.userInfo?.email || selectedWithdrawal.userEmail || "",
                          "Email"
                        )
                      }
                      className="p-1 hover:bg-muted rounded-md cursor-pointer transition-colors"
                    >
                      <Copy className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Amount summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-[9px] font-black uppercase text-muted-foreground">Requested</p>
                  <p className="text-sm font-black">{formatAmount(selectedWithdrawal.amount)}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-[9px] font-black uppercase text-muted-foreground">Fee</p>
                  <p className="text-sm font-black text-red-400">{formatAmount(selectedWithdrawal.fee || 0)}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-[9px] font-black uppercase text-muted-foreground">Net Payout</p>
                  <p className="text-sm font-black text-green-500">
                    {formatAmount(selectedWithdrawal.receiveAmount || selectedWithdrawal.amount)}
                  </p>
                </div>
              </div>

              {/* Method details */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {METHOD_META[selectedWithdrawal.method]?.label} Details
                </p>

                <div className="space-y-2">
                  {selectedWithdrawal.method === "bank" && (
                    <>
                      <DetailRow label="Country" value={selectedWithdrawal.details.country} />
                      <DetailRow label="Bank Name" value={selectedWithdrawal.details.bankName} />
                      <DetailRow label="Account Name" value={selectedWithdrawal.details.accountName} />
                      <DetailRow
                        label="Account Number"
                        value={selectedWithdrawal.details.accountNumber}
                        copyable
                        onCopy={() =>
                          copyToClipboard(selectedWithdrawal.details.accountNumber || "", "Account number")
                        }
                      />
                      {selectedWithdrawal.details.swift && (
                        <DetailRow
                          label="SWIFT / BIC"
                          value={selectedWithdrawal.details.swift}
                          copyable
                          onCopy={() => copyToClipboard(selectedWithdrawal.details.swift || "", "SWIFT/BIC")}
                        />
                      )}
                      {selectedWithdrawal.details.iban && (
                        <DetailRow
                          label="IBAN"
                          value={selectedWithdrawal.details.iban}
                          copyable
                          onCopy={() => copyToClipboard(selectedWithdrawal.details.iban || "", "IBAN")}
                        />
                      )}
                      <DetailRow label="Currency" value={selectedWithdrawal.details.currency} />
                    </>
                  )}

                  {(selectedWithdrawal.method === "paypal" || selectedWithdrawal.method === "payoneer") && (
                    <DetailRow
                      label={`${METHOD_META[selectedWithdrawal.method].label} Email`}
                      value={selectedWithdrawal.details.email}
                      copyable
                      onCopy={() => copyToClipboard(selectedWithdrawal.details.email || "", "Email")}
                    />
                  )}

                  {selectedWithdrawal.method === "momo" && (
                    <>
                      <DetailRow label="Country" value={selectedWithdrawal.details.country} />
                      <DetailRow label="Provider" value={selectedWithdrawal.details.provider} />
                      <DetailRow
                        label="Phone Number"
                        value={selectedWithdrawal.details.phoneNumber}
                        copyable
                        onCopy={() =>
                          copyToClipboard(selectedWithdrawal.details.phoneNumber || "", "Phone number")
                        }
                      />
                      <DetailRow label="Account Holder" value={selectedWithdrawal.details.accountHolderName} />
                    </>
                  )}
                </div>
              </div>

              {/* Status / dates */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="flex justify-between items-center py-1">
                  <span className="text-[10px] font-black uppercase text-muted-foreground">Status</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${
                      selectedWithdrawal.status === "approved"
                        ? "bg-teal-500/10 text-teal-600 border-teal-500/20"
                        : selectedWithdrawal.status === "rejected"
                        ? "bg-red-500/10 text-red-600 border-red-500/20"
                        : "bg-amber-700/10 text-amber-700 border-amber-700/20"
                    }`}
                  >
                    {selectedWithdrawal.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[10px] font-black uppercase text-muted-foreground">Requested</span>
                  <span className="text-xs font-bold text-foreground">
                    {formatDate(selectedWithdrawal.createdAt)}
                  </span>
                </div>
                {selectedWithdrawal.rejectionReason && (
                  <div className="flex justify-between items-start py-1 gap-4">
                    <span className="text-[10px] font-black uppercase text-muted-foreground shrink-0">Reason</span>
                    <span className="text-xs font-bold text-foreground text-right">
                      {selectedWithdrawal.rejectionReason}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed footer */}
            {selectedWithdrawal.status === "pending" && (
              <div className="flex gap-3 px-6 py-5 border-t border-border shrink-0">
                <button
                  onClick={() => {
                    openConfirmModal(
                      "reject",
                      selectedWithdrawal.withdrawalId,
                      selectedWithdrawal.userInfo?.fullName || selectedWithdrawal.username,
                      selectedWithdrawal.amount,
                      selectedWithdrawal.method
                    );
                    setSelectedWithdrawal(null);
                  }}
                  className="flex-1 px-4 py-3 cursor-pointer bg-red-500/10 text-red-500 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
                <button
                  onClick={() => {
                    openConfirmModal(
                      "approve",
                      selectedWithdrawal.withdrawalId,
                      selectedWithdrawal.userInfo?.fullName || selectedWithdrawal.username,
                      selectedWithdrawal.amount,
                      selectedWithdrawal.method
                    );
                    setSelectedWithdrawal(null);
                  }}
                  className="flex-1 px-4 py-3 cursor-pointer bg-teal-500 text-white rounded-lg text-xs font-black uppercase tracking-wider hover:bg-teal-600 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Small helper for the details modal ─────────────────────────────────────

function DetailRow({
  label,
  value,
  copyable,
  onCopy,
}: {
  label: string;
  value?: string;
  copyable?: boolean;
  onCopy?: () => void;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0">
      <span className="text-[10px] font-black uppercase text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-foreground font-mono">{value}</span>
        {copyable && (
          <button
            onClick={onCopy}
            className="p-1 hover:bg-muted rounded-md cursor-pointer transition-colors"
            title="Copy"
          >
            <Copy className="w-3 h-3 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}