"use client";

import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  Clock,
  Search,
  Filter,
  ExternalLink,
  Loader2,
  Gift,
  CreditCard,
  AlertTriangle,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";
import GiftCardsSkeleton from "@/components/LoadingSkeleton/GiftCardsSkeleton";

interface GiftCard {
  _id: string;
  cardType: string;
  country: string;
  amount: number;
  currency: string;
  code: string;
  frontImage?: string;
  backImage?: string;
  description?: string;
  cardImage?: string;
  status: "pending_review" | "processing" | "approved" | "rejected";
  userId: {
    _id: string;
    username: string;
    fullName: string;
    email: string;
    profileImage?: string;
  };
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

// Helpers using brand colors
const getStatusClasses = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "rejected":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    case "processing":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    default:
      return "bg-orange-500/10 text-orange-600 border-orange-500/20";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <Check className="w-3 h-3 mr-1" />;
    case "rejected":
      return <X className="w-3 h-3 mr-1" />;
    case "processing":
      return <Loader2 className="w-3 h-3 mr-1 animate-spin" />;
    default:
      return <Clock className="w-3 h-3 mr-1" />;
  }
};

const getCardIcon = (cardType: string) => {
  switch (cardType) {
    case "Apple":
      return <CreditCard className="w-4 h-4" />;
    case "Amazon":
      return <Gift className="w-4 h-4" />;
    case "Steam":
      return <CreditCard className="w-4 h-4" />;
    case "Google Play":
      return <Gift className="w-4 h-4" />;
    case "Razer Gold":
      return <CreditCard className="w-4 h-4" />;
    default:
      return <Gift className="w-4 h-4" />;
  }
};

export default function AdminGiftCardsPage() {
  // Default profile image constant
  const defaultProfileImage = "https://github.com/shadcn.png";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; action: 'approve' | 'reject'; giftCardId: string; userName: string; amount: number; currency: string } | null>(null);

  useEffect(() => {
    fetchGiftCards();
  }, [statusFilter]);

  const fetchGiftCards = async () => {
    try {
      setLoading(true);
      const url = statusFilter
        ? `/api/admin/gift-cards?status=${statusFilter}`
        : "/api/admin/gift-cards";

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setGiftCards(data.giftCards || []);
      } else {
        toast.error("Failed to fetch gift cards");
      }
    } catch (error) {
      console.error("Error fetching gift cards:", error);
      toast.error("Error loading gift cards");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (giftCardId: string, userName: string) => {
    setActionLoading(giftCardId);
    try {
      const response = await fetch("/api/admin/gift-cards", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          giftCardId,
          action: "approve",
        }),
      });

      if (response.ok) {
        toast.success(`Gift card from ${userName} approved`);
        fetchGiftCards(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to approve gift card");
      }
    } catch (error) {
      console.error("Error approving gift card:", error);
      toast.error("Error approving gift card");
    } finally {
      setActionLoading(null);
      setConfirmModal(null);
    }
  };

  const handleReject = async (giftCardId: string, userName: string) => {
    setActionLoading(giftCardId);
    try {
      const response = await fetch("/api/admin/gift-cards", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          giftCardId,
          action: "reject",
        }),
      });

      if (response.ok) {
        toast.error(`Gift card from ${userName} rejected`);
        fetchGiftCards(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to reject gift card");
      }
    } catch (error) {
      console.error("Error rejecting gift card:", error);
      toast.error("Error rejecting gift card");
    } finally {
      setActionLoading(null);
      setConfirmModal(null);
    }
  };

  const openConfirmModal = (action: 'approve' | 'reject', giftCardId: string, userName: string, amount: number, currency: string) => {
    setConfirmModal({ isOpen: true, action, giftCardId, userName, amount, currency });
  };

  const closeConfirmModal = () => {
    setConfirmModal(null);
  };

  const confirmAction = () => {
    if (!confirmModal) return;

    if (confirmModal.action === 'approve') {
      handleApprove(confirmModal.giftCardId, confirmModal.userName);
    } else {
      handleReject(confirmModal.giftCardId, confirmModal.userName);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Code copied to clipboard");
  };

  const filteredGiftCards = giftCards.filter((giftCard) => {
    const matchesSearch =
      giftCard.userId?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      giftCard.userId?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      giftCard.userId?.username
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).replace(/, /g, ' ');
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const StatusPill = ({ status }: { status: string }) => (
    <div
      className={`flex items-center w-fit px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${getStatusClasses(status)}`}
    >
      {getStatusIcon(status)}
      <span className="ml-1">
        {status === "pending_review"
          ? "Pending"
          : status === "processing"
            ? "Processing"
            : status === "approved"
              ? "Approved"
              : "Rejected"}
      </span>
    </div>
  );

  if (loading && giftCards.length === 0) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
            <GiftCardsSkeleton />
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
        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none flex items-center gap-4">
                Gift Cards Review
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-1">
                <Gift className="w-3 h-3 text-primary" />
                Gift Card Management
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-card border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64 shadow-sm"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-card border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
              >
                <option value="">All Status</option>
                <option value="pending_review">Pending Review</option>
                <option value="processing">Processing</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-foreground font-bold text-sm uppercase tracking-wider">
                Gift Card Submissions
              </h2>
              <Gift className="w-5 h-5 text-primary" />
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <GiftCardsSkeleton />
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-6 py-4">User Details</th>
                      <th className="px-6 py-4">Card Type</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Country</th>
                      <th className="px-6 py-4">Card Code</th>
                      <th className="px-6 py-4">Proof</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredGiftCards.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-12">
                          <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                              <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                              <p className="text-sm font-black uppercase tracking-tighter mb-2">
                                {searchTerm || statusFilter
                                  ? "No gift cards found"
                                  : "No gift cards found"}
                              </p>
                              <p className="text-[10px] text-muted-foreground uppercase mb-6">
                                {searchTerm || statusFilter
                                  ? "Try adjusting your filters"
                                  : "When gift cards are submitted, they will appear here"}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredGiftCards.map((giftCard) => (
                        <tr
                          key={giftCard._id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  giftCard.userId?.profileImage ||
                                  defaultProfileImage
                                }
                                alt={
                                  giftCard.userId?.fullName || "Unknown User"
                                }
                                className="w-10 h-10 rounded-lg object-cover cursor-pointer"
                                onError={(e) => {
                                  // Fallback to initials if image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  target.nextElementSibling?.classList.remove(
                                    "hidden",
                                  );
                                }}
                              />
                              <div
                                className={`w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs hidden`}
                              >
                                {giftCard.userId?.fullName?.charAt(0) || "U"}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-foreground">
                                  {giftCard.userId?.fullName || "Unknown User"}
                                </span>
                                <span className="text-xs text-muted-foreground" title={giftCard.userId?.email || "No email"}>
                                  {truncateText(giftCard.userId?.email || "No email", 20)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {getCardIcon(giftCard.cardType)}
                              <span className="text-sm font-bold text-foreground whitespace-nowrap">
                                {giftCard.cardType}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-bold text-foreground">
                              {giftCard.currency}{" "}
                              <span className="text-sm text-green-600 dark:text-green-400">
                                {giftCard.amount.toLocaleString()}
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted rounded-md">
                              {giftCard.country}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded" title={giftCard.code}>
                                {truncateText(giftCard.code, 5)}
                              </span>
                              <button
                                onClick={() => copyToClipboard(giftCard.code)}
                                className="p-1.5 text-base hover:bg-muted rounded-lg cursor-pointer transition-colors"
                                title="Copy code"
                              >
                                <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {giftCard.frontImage && (
                                <a
                                  href={giftCard.frontImage}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-foreground text-xs font-medium underline flex items-center gap-1 transition-colors"
                                  title="Front Image"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Front
                                </a>
                              )}
                              {giftCard.backImage && (
                                <a
                                  href={giftCard.backImage}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-foreground text-xs font-medium underline flex items-center gap-1 transition-colors"
                                  title="Back Image"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Back
                                </a>
                              )}
                              {giftCard.cardImage && !giftCard.frontImage && !giftCard.backImage && (
                                <a
                                  href={giftCard.cardImage}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-foreground text-xs font-medium underline flex items-center gap-1 transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Proof
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-muted-foreground font-medium">
                              {giftCard.description ? truncateText(giftCard.description, 20) : "—"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                              {formatDate(giftCard.createdAt)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <StatusPill status={giftCard.status} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              {giftCard.status === "pending_review" ? (
                                <>
                                  <button
                                    onClick={() =>
                                      openConfirmModal(
                                        'approve',
                                        giftCard._id,
                                        giftCard.userId?.fullName || "Unknown User",
                                        giftCard.amount,
                                        giftCard.currency
                                      )
                                    }
                                    disabled={actionLoading === giftCard._id}
                                    className="p-3 bg-teal-500/10 text-teal-600 rounded-lg cursor-pointer hover:bg-teal-500 hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      openConfirmModal(
                                        'reject',
                                        giftCard._id,
                                        giftCard.userId?.fullName || "Unknown User",
                                        giftCard.amount,
                                        giftCard.currency
                                      )
                                    }
                                    disabled={actionLoading === giftCard._id}
                                    className="p-3 bg-red-500/10 text-red-500 cursor-pointer rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <span className="text-[10px] font-bold text-muted-foreground uppercase italic">
                                  Locked
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>

        <AdminNav />
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={closeConfirmModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal */}
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
            {/* Icon */}
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              confirmModal.action === 'approve'
                ? 'bg-teal-500/10'
                : 'bg-red-500/10'
            }`}>
              {confirmModal.action === 'approve' ? (
                <Check className="w-8 h-8 text-teal-500" />
              ) : (
                <X className="w-8 h-8 text-red-500" />
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl font-black text-center uppercase tracking-tight mb-2">
              {confirmModal.action === 'approve' ? 'Confirm Gift Card' : 'Reject Gift Card'}
            </h2>

            {/* Warning */}
            <div className="bg-muted/50 border border-border rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This action <strong>cannot be undone</strong>. Please review the details below before confirming.
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">User</span>
                <span className="text-sm font-bold text-foreground">{confirmModal.userName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Amount</span>
                <span className="text-sm font-bold text-foreground">{confirmModal.currency} {confirmModal.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Action</span>
                <span className={`text-sm font-bold uppercase ${
                  confirmModal.action === 'approve' ? 'text-teal-500' : 'text-red-500'
                }`}>
                  {confirmModal.action}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeConfirmModal}
                disabled={actionLoading === confirmModal.giftCardId}
                className="flex-1 px-4 py-3 cursor-pointer bg-muted text-foreground rounded-lg text-xs font-black uppercase tracking-wider hover:bg-muted/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={actionLoading === confirmModal.giftCardId}
                className={`flex-1 px-4 py-3 cursor-pointer rounded-lg text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  confirmModal.action === 'approve'
                    ? 'bg-teal-500 text-white hover:bg-teal-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {actionLoading === confirmModal.giftCardId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {confirmModal.action === 'approve' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    {confirmModal.action === 'approve' ? 'Confirm' : 'Reject'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
