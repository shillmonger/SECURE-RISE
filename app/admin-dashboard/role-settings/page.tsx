"use client";

import React, { useState, useEffect } from "react";
import { Users, UserCheck, UserMinus, Mail, MoreVertical, ChevronDown, DollarSign, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

// Shadcn UI Imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  balance: string;
  profit: string;
  roles: string[];
  username: string;
  country: string;
  phoneNumber: string;
  welcomeBonus: number;
  referralBonus: number;
  totalWithdrawal: number;
  totalDeposit: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminRolesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

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
      setUsers(data.users || []);
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

  // Update user role
  const changeRole = async (userId: string, newRoles: string[]) => {
    setUpdatingUserId(userId);
    
    try {
      const token = localStorage.getItem('auth-token') || 
                   document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roles: newRoles })
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      const data = await response.json();
      
      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, roles: newRoles } : u
      ));
      
      toast.success(`Role updated to ${newRoles.includes('admin') ? 'Admin' : 'User'}`);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    } finally {
      setUpdatingUserId(null);
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

  // Get display role
  const getDisplayRole = (roles: string[]) => {
    return roles.includes('admin') ? 'Admin' : 'User';
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
                <h3 className="text-primary font-bold text-xs uppercase tracking-widest">Permissions</h3>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Role Management</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search by name/email/username" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-card border border-border rounded-xl py-2 pl-4 pr-4 text-sm focus:ring-2 focus:ring-primary/50 w-full md:w-64 shadow-sm" 
                />
              </div>
            </div>
          </div>

          {/* Users Table */}
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
                      <td colSpan={6} className="px-6 py-12">
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
                <table className="w-full text-left">
                  <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Account Balance</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-sm">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="group hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-foreground block">{user.name}</span>
                              <span className="text-xs text-muted-foreground">@{user.username}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-green-600">{formatCurrency(user.balance)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            user.status === 'Active' ? 'bg-teal-500/10 text-teal-600 border-teal-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {/* Shadcn Role Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger disabled={updatingUserId === user.id} className="flex items-center gap-2 bg-card border border-border cursor-pointer rounded-lg px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                              {updatingUserId === user.id ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                <>
                                  {getDisplayRole(user.roles)}
                                  <ChevronDown className="w-3 h-3 text-gray-400" />
                                </>
                              )}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="bg-card border-border rounded-xl shadow-xl">
                              <DropdownMenuItem 
                                className="text-xs font-medium py-2 px-4 cursor-pointer focus:bg-teal-500/10 focus:text-teal-600"
                                onClick={() => changeRole(user.id, ['user'])}
                                disabled={user.roles.length === 1 && user.roles[0] === 'user'}
                              >
                                User
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-xs font-medium py-2 px-4 cursor-pointer focus:bg-teal-500/10 focus:text-teal-600"
                                onClick={() => changeRole(user.id, ['user', 'admin'])}
                                disabled={user.roles.includes('admin')}
                              >
                                Admin
                              </DropdownMenuItem>
                              {user.roles.includes('admin') && (
                                <DropdownMenuItem 
                                  className="text-xs font-medium py-2 px-4 cursor-pointer focus:bg-red-500/10 focus:text-red-600"
                                  onClick={() => changeRole(user.id, ['user'])}
                                >
                                  Remove Admin Role
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              onClick={() => toast.info(`User: ${user.name} | Balance: ${formatCurrency(user.balance)} | Total Deposit: ${formatCurrency(user.totalDeposit)} | Total Withdrawal: ${formatCurrency(user.totalWithdrawal)}`)}
                            >
                              <MoreVertical className="w-4 h-4" />
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