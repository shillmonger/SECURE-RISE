"use client";

import React, { useState, useEffect } from "react";
import { Check, X, Clock, DollarSign, Search, Filter, ExternalLink, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";
import DepositsSkeleton from "@/components/LoadingSkeleton/DepositsSkeleton";

interface Deposit {
  _id: string;
  paymentMethod: string;
  amount: number;
  proofImageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  userId: {
    _id: string;
    username: string;
    fullName: string;
    email: string;
    profileImage?: string;
  };
  walletAddress: string;
  network: string;
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
    default:
      return "bg-orange-700/10 text-orange-700 border-orange-700/20";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <Check className="w-3 h-3 mr-1" />;
    case "rejected":
      return <X className="w-3 h-3 mr-1" />;
    default:
      return <Clock className="w-3 h-3 mr-1" />;
  }
};

export default function AdminPaymentsPage() {
  // Default profile image constant
  const defaultProfileImage = "https://github.com/shadcn.png";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; action: 'approve' | 'reject'; depositId: string; userName: string; amount: number } | null>(null);

  useEffect(() => {
    fetchDeposits();
  }, [statusFilter]);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const url = statusFilter 
        ? `/api/admin/deposits?status=${statusFilter}`
        : '/api/admin/deposits';
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setDeposits(data.deposits || []);
      } else {
        toast.error('Failed to fetch deposits');
      }
    } catch (error) {
      console.error('Error fetching deposits:', error);
      toast.error('Error loading deposits');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (depositId: string, userName: string) => {
    setActionLoading(depositId);
    try {
      const response = await fetch('/api/admin/deposits', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          depositId,
          action: 'approve'
        }),
      });

      if (response.ok) {
        toast.success(`Payment from ${userName} approved`);
        fetchDeposits(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to approve payment');
      }
    } catch (error) {
      console.error('Error approving deposit:', error);
      toast.error('Error approving payment');
    } finally {
      setActionLoading(null);
      setConfirmModal(null);
    }
  };

  const handleReject = async (depositId: string, userName: string) => {
    setActionLoading(depositId);
    try {
      const response = await fetch('/api/admin/deposits', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          depositId,
          action: 'reject'
        }),
      });

      if (response.ok) {
        toast.error(`Payment from ${userName} rejected`);
        fetchDeposits(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to reject payment');
      }
    } catch (error) {
      console.error('Error rejecting deposit:', error);
      toast.error('Error rejecting payment');
    } finally {
      setActionLoading(null);
      setConfirmModal(null);
    }
  };

  const openConfirmModal = (action: 'approve' | 'reject', depositId: string, userName: string, amount: number) => {
    setConfirmModal({ isOpen: true, action, depositId, userName, amount });
  };

  const closeConfirmModal = () => {
    setConfirmModal(null);
  };

  const confirmAction = () => {
    if (!confirmModal) return;

    if (confirmModal.action === 'approve') {
      handleApprove(confirmModal.depositId, confirmModal.userName);
    } else {
      handleReject(confirmModal.depositId, confirmModal.userName);
    }
  };

  const filteredDeposits = deposits.filter(deposit => {
    const matchesSearch = 
      deposit.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StatusPill = ({ status }: { status: string }) => (
    <div className={`flex items-center w-fit px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${getStatusClasses(status)}`}>
      {getStatusIcon(status)}
      {status}
    </div>
  );

  if (loading && deposits.length === 0) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
            <DepositsSkeleton />
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
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none flex items-center gap-4">Payments Review</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-1">
                <DollarSign className="w-3 h-3 text-primary" />
                Finance Management
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-foreground font-bold text-sm uppercase tracking-wider">Transaction History</h2>
              <DollarSign className="w-5 h-5 text-primary" />
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <DepositsSkeleton />
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-6 py-4">User Details</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Payment Method</th>
                      <th className="px-6 py-4">Proof</th>
                      <th className="px-6 py-4">Submission Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredDeposits.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12">
                          <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                              <p className="text-sm font-black uppercase tracking-tighter mb-2">
                                {searchTerm || statusFilter ? 'No deposits found' : 'No deposits found'}
                              </p>
                              <p className="text-[10px] text-muted-foreground uppercase mb-6">
                                {searchTerm || statusFilter ? 'Try adjusting your filters' : 'When deposits are made, they will appear here'}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredDeposits.map((deposit) => (
                        <tr key={deposit._id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={deposit.userId?.profileImage || defaultProfileImage}
                                alt={deposit.userId?.fullName || 'Unknown User'}
                                className="w-10 h-10 rounded-lg object-cover cursor-pointer"
                                onError={(e) => {
                                  // Fallback to initials if image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                              <div className={`w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs hidden`}>
                                {deposit.userId?.fullName?.charAt(0) || 'U'}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-foreground">{deposit.userId?.fullName || 'Unknown User'}</span>
                                <span className="text-xs text-muted-foreground">{deposit.userId?.email || 'No email'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-foreground">${deposit.amount.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted rounded-md">
                              {deposit.paymentMethod}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <a 
                              href={deposit.proofImageUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:text-foreground text-xs font-medium underline flex items-center gap-1 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View Proof
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-muted-foreground font-medium">{formatDate(deposit.createdAt)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <StatusPill status={deposit.status} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              {deposit.status === "pending" ? (
                                <>
                                  <button
                                    onClick={() => openConfirmModal('approve', deposit._id, deposit.userId?.fullName || 'Unknown User', deposit.amount)}
                                    disabled={actionLoading === deposit._id}
                                    className="p-3 bg-teal-500/10 text-teal-600 rounded-lg cursor-pointer hover:bg-teal-500 hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => openConfirmModal('reject', deposit._id, deposit.userId?.fullName || 'Unknown User', deposit.amount)}
                                    disabled={actionLoading === deposit._id}
                                    className="p-3 bg-red-500/10 text-red-500 cursor-pointer rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <span className="text-[10px] font-bold text-muted-foreground uppercase italic">Locked</span>
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
              {confirmModal.action === 'approve' ? 'Confirm Deposit' : 'Reject Deposit'}
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
                <span className="text-sm font-bold text-foreground">${confirmModal.amount.toLocaleString()}</span>
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
                disabled={actionLoading === confirmModal.depositId}
                className="flex-1 px-4 py-3 cursor-pointer bg-muted text-foreground rounded-lg text-xs font-black uppercase tracking-wider hover:bg-muted/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={actionLoading === confirmModal.depositId}
                className={`flex-1 px-4 py-3 cursor-pointer rounded-lg text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  confirmModal.action === 'approve'
                    ? 'bg-teal-500 text-white hover:bg-teal-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {actionLoading === confirmModal.depositId ? (
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