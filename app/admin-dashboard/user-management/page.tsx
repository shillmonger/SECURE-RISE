"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  Briefcase,
  Search,
  Filter,
  Trash2,
  Ban,
  MoreVertical,
  Mail,
  Loader2,
  DollarSign,
  ChevronDown,
  Calendar,
  Phone,
  Globe,
  CreditCard,
  TrendingUp,
  ArrowDownUp,
  FileText,
  Shield,
  Wallet,
  User,
  MapPin,
  Building,
  Clock
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

// Types
interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  status: string;
  balance: string;
  profit: string;
  totalDeposit: number;
  totalWithdrawal: number;
  roles: string[];
  country: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields from database
  fullName?: string;
  accountBalance?: number;
  welcomeBonus?: number;
  totalProfit?: number;
  referralBonus?: number;
  totalReferrals?: number;
  activeReferrals?: number;
  myReferralId?: string;
  referralId?: string;
  withdrawalAddresses?: {
    tron: string | null;
    doge: string | null;
    swiftCode: string | null;
    bitcoin: string | null;
    ethereum: string | null;
    litecoin: string | null;
    bnb: string | null;
    usdt: string | null;
  };
  isActive?: boolean;
}

interface KYC {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  countryOfResidence: string;
  documentType: string;
  frontIdUrl: string;
  backIdUrl: string;
  status: string;
  reviewedAt: string;
  reviewedBy: string;
  rejectionReason: string | null;
  submittedAt: string;
}

interface Withdrawal {
  _id: string;
  userId: string;
  amount: number;
  address: string;
  paymentMethod: string;
  status: string;
  charge: number;
  netAmount: number;
  createdAt: string;
}

interface InvestmentPlan {
  _id: string;
  userId: string;
  selectedPlan: string;
  amount: number;
  duration: number;
  profit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  totalProfitEarned: number;
  daysCompleted: number;
}

interface Deposit {
  _id: string;
  paymentMethod: string;
  amount: number;
  proofImageUrl: string;
  status: string;
  userId: string;
  walletAddress: string;
  network: string;
  createdAt: string;
}

interface UserDetails {
  user: User;
  kyc?: KYC;
  withdrawals?: Withdrawal[];
  investmentPlans?: InvestmentPlan[];
  deposits?: Deposit[];
}

export default function AdminUsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState<UserDetails | null>(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState<string | null>(null);
  const [stats, setStats] = useState([
    { label: "Total Users", value: "0", icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active Users", value: "0", icon: UserCheck, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Blocked Users", value: "0", icon: UserMinus, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Invested Users", value: "0", icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
  ]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('auth-token') || 
                   document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      const fetchedUsers = data.users || [];
      setUsers(fetchedUsers);
      
      // Calculate stats
      const activeUsers = fetchedUsers.filter((u: User) => u.status === 'Active').length;
      const blockedUsers = fetchedUsers.filter((u: User) => u.status === 'Blocked').length;
      const investedUsers = fetchedUsers.filter((u: User) => u.totalDeposit > 0).length;
      
      setStats([
        { label: "Total Users", value: fetchedUsers.length.toString(), icon: Users, color: "text-primary", bg: "bg-primary/10" },
        { label: "Active Users", value: activeUsers.toString(), icon: UserCheck, color: "text-teal-600", bg: "bg-teal-50" },
        { label: "Blocked Users", value: blockedUsers.toString(), icon: UserMinus, color: "text-red-500", bg: "bg-red-500/10" },
        { label: "Invested Users", value: investedUsers.toString(), icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
      ]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Suspend/unsuspend user
  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    setUpdatingUserId(userId);
    
    try {
      const token = localStorage.getItem('auth-token') || 
                   document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const newStatus = currentStatus === 'Active' ? false : true;
      
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      const data = await response.json();
      
      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: data.user.status } : u
      ));
      
      toast.success(data.message);
      
      // Refresh stats
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Delete user
  const deleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    setUpdatingUserId(userId);
    
    try {
      const token = localStorage.getItem('auth-token') || 
                   document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      const data = await response.json();
      
      // Remove user from local state
      setUsers(prev => prev.filter(u => u.id !== userId));
      
      toast.success(data.message);
      
      // Refresh stats
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Fetch user detailed information
  const fetchUserDetails = async (userId: string) => {
    setLoadingUserDetails(userId);
    
    try {
      const token = localStorage.getItem('auth-token') || 
                   document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      // Find the user from existing users array
      const currentUser = users.find(u => u.id === userId);
      
      if (currentUser) {
        setSelectedUserDetails({
          user: currentUser,
          kyc: undefined,
          withdrawals: [],
          investmentPlans: [],
          deposits: []
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to fetch user details');
    } finally {
      setLoadingUserDetails(null);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format currency
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 bg-primary rounded-full"></div>
                <h3 className="text-primary font-bold text-xs uppercase tracking-widest">Community Control</h3>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">User Management</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by name/email/username" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-card border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 w-full md:w-64 shadow-sm" 
                />
              </div>
              <button className="p-2 bg-card border border-border rounded-xl text-primary shadow-sm"><Filter className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-card p-4 md:p-5 rounded-2xl border border-border shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-lg md:text-xl font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* User Table */}
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-gray-500">Loading users...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody>
                    <tr>
                      <td colSpan={5} className="px-6 py-12">
                        <div className="flex items-center justify-center py-20">
                          <div className="text-center">
                            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-sm font-black uppercase tracking-tighter mb-2">
                              {searchTerm ? 'No users found' : 'No users found'}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase mb-6">
                              {searchTerm ? 'Try adjusting your search terms' : 'When users register, they will appear here'}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4 hidden md:table-cell">Joined</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 hidden sm:table-cell">Investment</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-sm">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="group hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                  {user.name.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-foreground">{user.name}</span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3"/> {user.email}</span>
                                  <span className="text-xs text-muted-foreground">@{user.username}</span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-96 max-h-96 overflow-y-auto p-0" align="start">
                              {loadingUserDetails === user.id ? (
                                <div className="flex items-center justify-center py-8">
                                  <Loader2 className="w-6 h-6 animate-spin text-[#1D429A]" />
                                  <span className="ml-2 text-gray-500">Loading details...</span>
                                </div>
                              ) : selectedUserDetails?.user.id === user.id ? (
                                <div className="p-4 space-y-4">
                                  {/* User Basic Info */}
                                  <div className="space-y-2">
                                    <h4 className="font-bold text-[#1D429A] text-sm uppercase tracking-wider flex items-center gap-2">
                                      <User className="w-4 h-4" /> User Information
                                    </h4>
                                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Full Name:</span>
                                        <span className="font-medium text-gray-900">{selectedUserDetails.user.fullName || selectedUserDetails.user.name}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Username:</span>
                                        <span className="font-medium text-gray-900">@{selectedUserDetails.user.username}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Email:</span>
                                        <span className="font-medium text-gray-900 text-xs">{selectedUserDetails.user.email}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Phone:</span>
                                        <span className="font-medium text-gray-900">{selectedUserDetails.user.phoneNumber}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Country:</span>
                                        <span className="font-medium text-gray-900">{selectedUserDetails.user.country}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Roles:</span>
                                        <span className="font-medium text-gray-900">{selectedUserDetails.user.roles.join(', ')}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Status:</span>
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                          selectedUserDetails.user.status === 'Active' ? 'bg-teal-50 text-teal-600 border border-teal-100' : 'bg-red-50 text-red-600 border border-red-100'
                                        }`}>
                                          {selectedUserDetails.user.status}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Joined:</span>
                                        <span className="font-medium text-gray-900">{formatDate(selectedUserDetails.user.createdAt)}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Financial Information */}
                                  <div className="space-y-2">
                                    <h4 className="font-bold text-[#1D429A] text-sm uppercase tracking-wider flex items-center gap-2">
                                      <Wallet className="w-4 h-4" /> Financial Information
                                    </h4>
                                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Account Balance:</span>
                                        <span className="font-medium text-green-600">{formatCurrency(selectedUserDetails.user.accountBalance || 0)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Total Deposits:</span>
                                        <span className="font-medium text-green-600">{formatCurrency(selectedUserDetails.user.totalDeposit)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Total Withdrawals:</span>
                                        <span className="font-medium text-red-600">{formatCurrency(selectedUserDetails.user.totalWithdrawal)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Total Profit:</span>
                                        <span className="font-medium text-blue-600">{formatCurrency(selectedUserDetails.user.totalProfit || 0)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Welcome Bonus:</span>
                                        <span className="font-medium text-purple-600">{formatCurrency(selectedUserDetails.user.welcomeBonus || 0)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Referral Bonus:</span>
                                        <span className="font-medium text-purple-600">{formatCurrency(selectedUserDetails.user.referralBonus || 0)}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Referral Information */}
                                  <div className="space-y-2">
                                    <h4 className="font-bold text-[#1D429A] text-sm uppercase tracking-wider flex items-center gap-2">
                                      <TrendingUp className="w-4 h-4" /> Referral Information
                                    </h4>
                                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">My Referral ID:</span>
                                        <span className="font-medium text-gray-900">{selectedUserDetails.user.myReferralId || 'N/A'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Referred By:</span>
                                        <span className="font-medium text-gray-900">{selectedUserDetails.user.referralId || 'N/A'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Total Referrals:</span>
                                        <span className="font-medium text-gray-900">{selectedUserDetails.user.totalReferrals || 0}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Active Referrals:</span>
                                        <span className="font-medium text-gray-900">{selectedUserDetails.user.activeReferrals || 0}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* KYC Status */}
                                  {selectedUserDetails.kyc && (
                                    <div className="space-y-2">
                                      <h4 className="font-bold text-[#1D429A] text-sm uppercase tracking-wider flex items-center gap-2">
                                        <Shield className="w-4 h-4" /> KYC Status
                                      </h4>
                                      <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Status:</span>
                                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            selectedUserDetails.kyc.status === 'approved' ? 'bg-green-50 text-green-600 border border-green-100' : 
                                            selectedUserDetails.kyc.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' : 
                                            'bg-red-50 text-red-600 border border-red-100'
                                          }`}>
                                            {selectedUserDetails.kyc.status}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Document Type:</span>
                                          <span className="font-medium text-gray-900">{selectedUserDetails.kyc.documentType}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Submitted:</span>
                                          <span className="font-medium text-gray-900">{formatDate(selectedUserDetails.kyc.submittedAt)}</span>
                                        </div>
                                        {selectedUserDetails.kyc.reviewedAt && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">Reviewed:</span>
                                            <span className="font-medium text-gray-900">{formatDate(selectedUserDetails.kyc.reviewedAt)}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Recent Activity Summary */}
                                  <div className="space-y-2">
                                    <h4 className="font-bold text-[#1D429A] text-sm uppercase tracking-wider flex items-center gap-2">
                                      <Clock className="w-4 h-4" /> Recent Activity
                                    </h4>
                                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Active Investments:</span>
                                        <span className="font-medium text-gray-900">
                                          {selectedUserDetails.investmentPlans?.filter(plan => plan.isActive).length || 0}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Total Transactions:</span>
                                        <span className="font-medium text-gray-900">
                                          {(selectedUserDetails.deposits?.length || 0) + (selectedUserDetails.withdrawals?.length || 0)}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Pending Withdrawals:</span>
                                        <span className="font-medium text-gray-900">
                                          {selectedUserDetails.withdrawals?.filter(w => w.status === 'pending').length || 0}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <DropdownMenuItem 
                                  onClick={() => fetchUserDetails(user.id)}
                                  className="cursor-pointer"
                                >
                                  <User className="w-4 h-4 mr-2" />
                                  View Full Details
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell text-gray-500 font-medium">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            user.status === 'Active' ? 'bg-teal-500/10 text-teal-600 border-teal-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell font-bold text-[#1D429A]">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            {formatCurrency(user.totalDeposit)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => toggleUserStatus(user.id, user.status)}
                              disabled={updatingUserId === user.id}
                              className={`p-3 cursor-pointer rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                user.status === 'Active' 
                                  ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' 
                                  : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                              }`}
                              title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                            >
                              {updatingUserId === user.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Ban className="w-4 h-4" />
                              )}
                            </button>
                            <button 
                              onClick={() => deleteUser(user.id, user.name)}
                              disabled={updatingUserId === user.id}
                              className="p-3 bg-red-500/10 text-red-500 cursor-pointer hover:bg-red-500/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        <AdminNav />
      </div>
    </div>
  );
}