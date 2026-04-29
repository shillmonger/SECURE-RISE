"use client";

import React, { useState, useEffect } from "react";
import { 
  Check, 
  X, 
  Clock, 
  Wallet, 
  Filter, 
  Search, 
  History,
  CheckCircle2,
  XCircle,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

interface Withdrawal {
  _id: string;
  withdrawalId: string;
  userId: string;
  username: string;
  userEmail: string;
  userInfo?: {
    username: string;
    email: string;
    fullName: string;
  };
  amount: number;
  crypto: {
    name: string;
    symbol: string;
    icon: string;
  };
  destinationAddress: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export default function AdminPayoutsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    rejected: 0
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWithdrawals();
  }, [statusFilter]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/withdrawals${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`);
      const data = await response.json();
      
      if (data.withdrawals) {
        setWithdrawals(data.withdrawals);
        calculateStats(data.withdrawals);
      }
    } catch (error) {
      toast.error('Failed to fetch withdrawals');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (withdrawalData: Withdrawal[]) => {
    const newStats = {
      total: withdrawalData.length,
      pending: withdrawalData.filter(w => w.status === 'pending').length,
      completed: withdrawalData.filter(w => w.status === 'approved').length,
      rejected: withdrawalData.filter(w => w.status === 'rejected').length
    };
    setStats(newStats);
  };

  const handleAction = async (withdrawalId: string, action: 'approve' | 'reject', userName: string) => {
    try {
      const response = await fetch('/api/admin/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          withdrawalId,
          action
        })
      });

      const data = await response.json();
      
      if (data.error) {
        toast.error(data.error || 'Failed to update withdrawal');
      } else {
        toast.success(data.message);
        // Refresh the data
        fetchWithdrawals();
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  };

  const statsData = [
    { label: "Total Records", value: stats.total.toString(), icon: History, color: "text-primary", bg: "bg-primary/10" },
    { label: "Pending", value: stats.pending.toString(), icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Approved", value: stats.completed.toString(), icon: CheckCircle2, color: "text-teal-500", bg: "bg-teal-500/10" },
    { label: "Rejected", value: stats.rejected.toString(), icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = searchTerm === '' || 
      withdrawal.userInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.userInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.userInfo?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatAmount = (amount: number) => `$${amount.toLocaleString()}`;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 bg-primary rounded-full"></div>
                <h3 className="text-primary font-bold text-xs uppercase tracking-widest">Payout Requests</h3>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Investment Payouts</h1>
            </div>

            <div className="flex items-center gap-2">
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
              <div key={i} className="bg-card p-5 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl ${stat.bg}`}><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
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
                    <th className="px-6 py-4">Address</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                        Loading withdrawals...
                      </td>
                    </tr>
                  ) : filteredWithdrawals.length === 0 ? (
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
                    filteredWithdrawals.map((withdrawal) => (
                      <tr key={withdrawal._id} className="group hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground">{withdrawal.userInfo?.fullName || withdrawal.username || 'Unknown User'}</span>
                            <span className="text-[11px] text-muted-foreground">{withdrawal.userInfo?.email || withdrawal.userEmail || 'No email'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground">{formatAmount(withdrawal.amount)}</span>
                            <span className="text-[10px] text-muted-foreground">{withdrawal.crypto.symbol}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Wallet className="w-3 h-3" />
                            <span className="text-xs font-mono">{withdrawal.destinationAddress}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-muted-foreground uppercase">{withdrawal.crypto.symbol}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`flex items-center w-fit px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${
                            withdrawal.status === 'approved' ? 'bg-teal-500/10 text-teal-600 border-teal-500/20' : 
                            withdrawal.status === 'rejected' ? 'bg-red-500/10 text-red-600 border-red-500/20' : 
                            'bg-primary/10 text-primary border-primary/20'
                          }`}>
                            {withdrawal.status === 'approved' ? 'Approved' : withdrawal.status}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-muted-foreground font-medium">{formatDate(withdrawal.createdAt)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            {withdrawal.status === "pending" ? (
                              <>
                                <button 
                                  onClick={() => handleAction(withdrawal.withdrawalId, 'approve', withdrawal.userInfo?.fullName || withdrawal.username)}
                                  className="p-3 bg-teal-500/10 text-teal-600 cursor-pointer rounded-lg hover:bg-teal-500 hover:text-white transition-all shadow-sm"
                                  title="Approve"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleAction(withdrawal.withdrawalId, 'reject', withdrawal.userInfo?.fullName || withdrawal.username)}
                                  className="p-3 bg-red-500/10 text-red-500 cursor-pointer rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                  title="Reject"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter italic px-2">Processed</span>
                            )}
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
    </div>
  );
}