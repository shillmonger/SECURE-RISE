"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  UserMinus, 
  UserCheck, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Layers,
  Search,
  Filter,
  DollarSign
} from "lucide-react";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

interface DashboardStats {
  label: string;
  value: string;
  icon: any;
  color: string;
  bg: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  user: string;
  email: string;
  paymentMethod: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const iconMap: { [key: string]: any } = {
    Users,
    UserCheck,
    UserMinus,
    Layers,
    TrendingUp,
    Clock,
    ArrowDownLeft,
    ArrowUpRight
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      
      if (data.success) {
        // Transform stats to include icon components
        const transformedStats = data.stats.map((stat: any) => ({
          ...stat,
          icon: iconMap[stat.icon] || Users
        }));
        
        setStats(transformedStats);
        setRecentTransactions(data.recentTransactions || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set fallback data
      setStats([
        { label: "Total Users", value: "0", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Active Users", value: "0", icon: UserCheck, color: "text-teal-500", bg: "bg-teal-500/10" },
        { label: "Blocked Users", value: "0", icon: UserMinus, color: "text-red-500", bg: "bg-red-500/10" },
        { label: "Investment Plans", value: "0", icon: Layers, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Total Deposit", value: "$0", icon: TrendingUp, color: "text-teal-500", bg: "bg-teal-500/10" },
        { label: "Pending Deposit", value: "$0", icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
        { label: "Total Withdrawal", value: "$0", icon: ArrowDownLeft, color: "text-primary", bg: "bg-primary/10" },
        { label: "Pending Withdrawal", value: "$0", icon: ArrowUpRight, color: "text-red-500", bg: "bg-red-500/10" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-primary rounded-full"></div>
              <h3 className="text-primary font-bold text-xs uppercase tracking-widest">Platform Overview</h3>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {loading ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="bg-card p-5 rounded-2xl border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-xl bg-muted animate-pulse">
                      <div className="w-5 h-5 bg-muted-foreground/20 rounded"></div>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Live</span>
                  </div>
                  <div>
                    <div className="h-3 bg-muted rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : (
              stats.map((stat, index) => (
                <div key={index} className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-xl ${stat.bg}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Live</span>
                  </div>
                  <div>
                    <h4 className="text-muted-foreground text-xs font-medium mb-1">{stat.label}</h4>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recent Transactions Section */}
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-foreground font-bold text-sm uppercase tracking-wider">Recent Transactions</h2>
                <p className="text-xs text-muted-foreground mt-1">Latest financial activities across the platform</p>
              </div>
              <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">
                View All
              </button>
            </div>

            {loading ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-6 py-4">Transaction ID</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[1, 2, 3, 4].map((item) => (
                      <tr key={item} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : recentTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-6 py-4">Transaction ID</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-card-foreground">#{transaction.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <ArrowDownLeft className="w-3 h-3 text-teal-500" />
                            <span className="text-sm text-foreground font-semibold">
                              {transaction.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-foreground">
                          ${transaction.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${
                            transaction.status === 'Approved' 
                              ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
                              : transaction.status === 'Pending'
                              ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
                              : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm font-black uppercase tracking-tighter mb-2">
                    No transactions yet
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase mb-6">
                    Once transactions occur, they will appear here
                  </p>
                  
                </div>
              </div>
            )}
          </div>
        </main>

        <AdminNav />
      </div>
    </div>
  );
}