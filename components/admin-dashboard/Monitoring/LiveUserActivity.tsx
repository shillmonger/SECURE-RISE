"use client";

import React, { useState, useEffect } from "react";
import { Users, Clock, Globe, Smartphone, Laptop, Eye, BarChart2, ArrowDownToLine, Activity, Share2, User, ShieldCheck, Bell, Wallet, HeadphonesIcon, LogIn, CreditCard } from "lucide-react";
import { UserStatusBadge } from "./MonitoringShared";
import { LiveUser, UserStatus, ActivityEvent } from "@/types/monitoring";

const PAGE_ICONS: Record<string, React.ElementType> = {
  Dashboard: BarChart2, Deposit: ArrowDownToLine, Withdraw: CreditCard,
  Trading: Activity, Referrals: Share2, Profile: User, Verification: ShieldCheck,
  Notifications: Bell, Wallet: Wallet, Support: HeadphonesIcon, "Login Page": LogIn,
};


interface LiveUserActivityProps {
  filterStatus: "all" | UserStatus;
  setFilterStatus: (status: "all" | UserStatus) => void;
  onMonitor: (user: LiveUser) => void;
  activeFilters?: string[];
}

export default function LiveUserActivity({ filterStatus, setFilterStatus, onMonitor, activeFilters = [] }: LiveUserActivityProps) {
  const [users, setUsers] = useState<LiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/activity`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      let filteredUsers = data.users || [];

      // Apply status filter
      if (filterStatus !== 'all') {
        filteredUsers = filteredUsers.filter((u: LiveUser) => u.status === filterStatus);
      }

      // Apply quick filters
      if (activeFilters.length > 0) {
        filteredUsers = filteredUsers.filter((u: LiveUser) => {
          return activeFilters.some(filter => {
            // Status filters
            if (filter === 'Online' && u.status === 'online') return true;
            if (filter === 'Offline' && u.status === 'offline') return true;
            if (filter === 'Idle' && u.status === 'away') return true;
            
            // Device filters
            if (filter === 'Desktop' && u.device === 'desktop') return true;
            if (filter === 'Mobile' && u.device === 'mobile') return true;
            if (filter === 'Chrome' && u.browser?.toLowerCase().includes('chrome')) return true;
            if (filter === 'Edge' && u.browser?.toLowerCase().includes('edge')) return true;
            if (filter === 'Firefox' && u.browser?.toLowerCase().includes('firefox')) return true;
            
            // Page filters
            if (filter === 'Deposit' && u.currentPage?.toLowerCase().includes('deposit')) return true;
            if (filter === 'Withdraw' && u.currentPage?.toLowerCase().includes('withdraw')) return true;
            if (filter === 'Trading' && u.currentPage?.toLowerCase().includes('trading')) return true;
            if (filter === 'Wallet' && u.currentPage?.toLowerCase().includes('wallet')) return true;
            if (filter === 'Verification' && u.currentPage?.toLowerCase().includes('verification')) return true;
            if (filter === 'Support' && u.currentPage?.toLowerCase().includes('support')) return true;
            
            return false;
          });
        });
      }

      setUsers(filteredUsers);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load user activity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    
    // Refresh every 50 seconds
    const interval = setInterval(fetchUsers, 50000);
    
    return () => clearInterval(interval);
  }, [filterStatus, activeFilters]);

  return (
    <div className="bg-card border border-border rounded-[1rem] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Live User Activity
        </h3>
        <div className="flex gap-1">
          {(["all", "online", "away", "offline"] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 cursor-pointer rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                filterStatus === status ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      
      {loading && (
        <div className="p-20 text-center">
          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Users className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-black uppercase text-muted-foreground">Loading user activity...</h3>
        </div>
      )}
      
      {error && (
        <div className="p-20 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-sm font-black uppercase italic text-red-400">{error}</h3>
        </div>
      )}
      
      {!loading && !error && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-muted-foreground text-[10px] uppercase tracking-[0.15em] font-black border-b border-border">
                  <th className="px-4 py-5 w-10">Status</th>
                  <th className="px-4 py-5">User</th>
                  <th className="px-4 py-5">Role</th>
                  <th className="px-4 py-5">Current Page</th>
                  <th className="px-4 py-5">Last Activity</th>
                  <th className="px-4 py-5">Device</th>
                  <th className="px-4 py-5">Session</th>
                  <th className="px-4 py-5">Flags</th>
                  <th className="px-4 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => {
                  const PageIcon = PAGE_ICONS[user.currentPage] || Globe;
                  const DeviceIcon = user.device === "mobile" ? Smartphone : Laptop;
                  const roleColors: Record<string, string> = {
                    vip: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                    admin: "bg-violet-500/10 text-violet-400 border-violet-500/20",
                    user: "bg-muted/40 text-muted-foreground border-border",
                  };
                  return (
                    <tr key={user.id} className="group hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-4"><div className="flex justify-center"><UserStatusBadge status={user.status} /></div></td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0">
                            <img src={user.avatar} alt={user.fullName} className="w-9 h-9 rounded-lg border border-border object-cover bg-muted" />
                          </div>
                          <div>
                            <p className="text-sm font-black italic tracking-tight text-foreground leading-none mb-0.5">{user.fullName}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4"><span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${roleColors[user.role]}`}>{user.role}</span></td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className="p-1 bg-primary/10 rounded-md"><PageIcon className="w-3 h-3 text-primary" /></div>
                          <span className="text-[10px] font-black uppercase tracking-tight text-foreground">{user.currentPage}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span className="text-[10px] font-black uppercase">{user.lastActivity}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <DeviceIcon className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-[10px] font-black uppercase text-muted-foreground">{user.device}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4"><span className="text-[10px] font-black font-mono text-foreground">{user.sessionDuration}</span></td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1">
                          {user.vpnDetected && <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-black rounded">VPN</span>}
                          {user.newDevice && <span className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black rounded">NEW</span>}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end">
                          <button onClick={() => onMonitor(user)} className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary transition-all cursor-pointer">
                            <Eye className="w-3.5 h-3.5" />Monitor
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-black uppercase italic text-muted-foreground">No matching users found</h3>
            </div>
          )}
        </>
      )}
    </div>
  );
}
