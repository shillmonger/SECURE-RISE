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
  Eye,
  XCircle,
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
  phone: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields from database
  fullName?: string;
  accountBalance?: number;
  welcomeBonus?: number;
  totalProfits?: number;
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
  profileImage?: string;
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
  // Default profile image constant
  const defaultProfileImage = "https://github.com/shadcn.png";
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState<string | null>(null);
  const [stats, setStats] = useState([
    { label: "Total Users", value: "0", icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active Users", value: "0", icon: UserCheck, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Blocked Users", value: "0", icon: UserMinus, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Total Deposited Users", value: "0", icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
  ]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (data.success) {
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
          { label: "Total Deposited Users", value: investedUsers.toString(), icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
        ]);
      } else {
        toast.error(data.error || 'Failed to fetch users');
      }
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
      const newStatus = currentStatus === 'Active' ? false : true;
      
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      const data = await response.json();
      
      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: data.status } : u
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

    setUpdatingUserId(userId);
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
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

      // Find the user from existing users array
      const currentUser = users.find(u => u.id === userId);
      
      if (currentUser) {
        console.log('User data for debugging:', currentUser);
        console.log('totalProfits:', currentUser.totalProfits);
        console.log('welcomeBonus:', currentUser.welcomeBonus);
        setSelectedUser({
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
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none flex items-center gap-4">User Management</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-1">
                <Users className="w-3 h-3 text-primary" />
                Community Control
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by name/email/username" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-card border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 w-full md:w-64 shadow-sm" 
                />
              </div>
              <button className="p-3 bg-card border border-border rounded-xl text-primary shadow-sm"><Filter className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-card p-4 md:p-5 md:py-4 rounded-2xl border border-border shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-lg md:text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
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
                      <th className="px-6 py-4 hidden sm:table-cell">Account Balance</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-sm">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="group hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.profileImage || defaultProfileImage}
                              alt={user.name}
                              className="w-10 h-10 rounded-lg object-cover cursor-pointer"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className={`w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs hidden`}>
                              {user.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold  text-sm text-foreground">{user.name}</span>
                              <span className="text-xs text-muted-foreground">@{user.username}</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3"/> {user.email}</span>
                            </div>
                          </div>
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
                            {formatCurrency(user.accountBalance || user.balance || 0)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => fetchUserDetails(user.id)}
                              disabled={loadingUserDetails === user.id}
                              className="p-3 bg-blue-500/10 text-blue-500 cursor-pointer hover:bg-blue-500/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="View User Details"
                            >
                              {loadingUserDetails === user.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/10 backdrop-blur-sm px-4">
          <div
            className="bg-card border border-border rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            style={{ animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter">
              User Details
            </h3>
            <button
              onClick={() => setSelectedUser(null)}
              className="p-3 bg-muted/50 rounded-lg text-muted-foreground transition-all cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-muted/30 rounded-xl">
            <img 
              src={selectedUser.user.profileImage || defaultProfileImage} 
              alt={selectedUser.user.fullName || selectedUser.user.name}
              className="w-16 h-16 rounded-xl object-cover border border-border"
            />
            <div>
              <p className="text-sm text-muted-foreground">
                @{selectedUser.user.username}
              </p>
              <h4 className="font-black text-sm text-foreground">
                {selectedUser.user.fullName || selectedUser.user.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {selectedUser.user.email}
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-black text-blue-600 uppercase tracking-tighter">
              Personal Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Full Name
                </p>
                <p className="font-black text-sm text-foreground">
                  {selectedUser.user.fullName || selectedUser.user.name}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Phone Number
                </p>
                <p className="font-black text-sm text-foreground">
                  {selectedUser.user.phone}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Country
                </p>
                <p className="font-black text-sm text-foreground">
                  {selectedUser.user.country}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Status
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    selectedUser.user.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                  }`}
                >
                  {selectedUser.user.status}
                </span>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Joined
                </p>
                <p className="font-black text-sm text-foreground">
                  {formatDate(selectedUser.user.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-black text-green-600 uppercase tracking-tighter">
              Financial Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Account Balance
                </p>
                <p className="font-black text-sm text-foreground">
                  {formatCurrency(selectedUser.user.accountBalance || selectedUser.user.balance || 0)}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Total Deposits
                </p>
                <p className="font-black text-sm text-foreground">
                  {formatCurrency(selectedUser.user.totalDeposit)}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Total Withdrawals
                </p>
                <p className="font-black text-sm text-foreground">
                  {formatCurrency(selectedUser.user.totalWithdrawal)}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Total Profit
                </p>
                <p className="font-black text-sm text-foreground">
                  {formatCurrency(selectedUser.user.totalProfits || 0)}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Welcome Bonus
                </p>
                <p className="font-black text-sm text-foreground">
                  {formatCurrency(selectedUser.user.welcomeBonus || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Role Information */}
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-black text-purple-600 uppercase tracking-tighter">
              Role Information
            </h4>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                Roles
              </p>
              <p className="font-black text-sm text-foreground">
                {selectedUser.user.roles?.join(', ') || 'N/A'}
              </p>
            </div>
          </div>

          {/* Referral Information */}
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-black text-orange-600 uppercase tracking-tighter">
              Referral Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  My Referral ID
                </p>
                <p className="font-black text-sm text-foreground">
                  {selectedUser.user.myReferralId || 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Referred By
                </p>
                <p className="font-black text-sm text-foreground">
                  {selectedUser.user.referralId || 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Total Referrals
                </p>
                <p className="font-black text-sm text-foreground">
                  {selectedUser.user.totalReferrals || 0}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Active Referrals
                </p>
                <p className="font-black text-sm text-foreground">
                  {selectedUser.user.activeReferrals || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}