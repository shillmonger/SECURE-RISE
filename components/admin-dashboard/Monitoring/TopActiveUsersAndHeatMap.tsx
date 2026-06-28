"use client";

import React, { useState, useEffect } from "react";
import { Award, Flame, Globe, BarChart2, ArrowDownToLine, Activity, Share2, User, ShieldCheck, Bell, Wallet, HeadphonesIcon, LogIn, CreditCard } from "lucide-react";
import { UserStatusBadge } from "./MonitoringShared";

const PAGE_ICONS: Record<string, React.ElementType> = {
  Dashboard: BarChart2, Deposit: ArrowDownToLine, Withdraw: CreditCard,
  Trading: Activity, Referrals: Share2, Profile: User, Verification: ShieldCheck,
  Notifications: Bell, Wallet: Wallet, Support: HeadphonesIcon, "Login Page": LogIn,
};

interface LiveUser {
  id: string;
  fullName: string;
  username: string;
  status: "online" | "offline" | "away";
  currentPage: string;
  sessionDuration: string;
  avatar: string;
  pageVisitsToday: number;
  timeOnPage: string;
}


function UserLeaderboard() {
  const [users, setUsers] = useState<LiveUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/activity');
        if (response.ok) {
          const data = await response.json();
          const allUsers = data.users || [];
          // Calculate activity score based on page visits and time on page
          const usersWithScore = allUsers.map((user: any) => ({
            ...user,
            activityScore: Math.min(100, (user.pageVisitsToday * 10) + (parseInt(user.timeOnPage) / 10))
          }));
          // Sort by activity score and take top 5
          setUsers(usersWithScore.sort((a: any, b: any) => b.activityScore - a.activityScore).slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-[1rem] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Top Active Users
          </h3>
        </div>
        <div className="p-5 text-center text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-[1rem] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Top Active Users
        </h3>
      </div>
      <div className="divide-y divide-border/50">
        {users.map((user: any, i) => {
          const PageIcon = PAGE_ICONS[user.currentPage] || Globe;
          const activityScore = Math.min(100, (user.pageVisitsToday * 10) + (parseInt(user.timeOnPage) / 10));
          return (
            <div key={user.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
              <span className={`text-[10px] font-black w-5 text-center ${i === 0 ? "text-amber-400" : i === 1 ? "text-slate-300" : i === 2 ? "text-amber-700" : "text-muted-foreground"}`}>
                {i + 1}
              </span>
              <div className="relative flex-shrink-0">
                <img src={user.avatar} alt={user.fullName} className="w-8 h-8 rounded-lg border border-border object-cover bg-muted" />
                <span className="absolute -bottom-0.5 -right-0.5"><UserStatusBadge status={user.status} /></span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black italic text-foreground leading-none">{user.fullName}</p>
                <p className="text-[9px] text-muted-foreground">@{user.username}</p>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-[9px] font-black uppercase text-muted-foreground">{user.sessionDuration}</p>
                <p className="text-[8px] text-muted-foreground/60">{user.pageVisitsToday} pages</p>
              </div>
              <div className="hidden lg:flex items-center gap-1 px-2 py-1 bg-muted/20 rounded-lg border border-border">
                <PageIcon className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-black uppercase text-muted-foreground">{user.currentPage}</span>
              </div>
              <div className="flex items-center gap-1 w-20">
                <div className="flex-1 h-1.5 bg-muted/40 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all" style={{ width: `${activityScore}%` }} />
                </div>
                <span className="text-[9px] font-black text-primary w-7 text-right">{Math.round(activityScore)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HeatMap() {
  const [pageData, setPageData] = useState<{ page: string; visits: number }[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/activity');
        if (response.ok) {
          const data = await response.json();
          const users = data.users || [];
          
          // Count page visits
          const pageCount = new Map<string, number>();
          users.forEach((user: any) => {
            user.pagesVisited.forEach((page: string) => {
              pageCount.set(page, (pageCount.get(page) || 0) + 1);
            });
          });

          const sortedPages = Array.from(pageCount.entries())
            .map(([page, visits]) => ({ page, visits }))
            .sort((a, b) => b.visits - a.visits)
            .slice(0, 10);

          setPageData(sortedPages);

          // Calculate metrics
          const allPages = sortedPages;
          const totalVisits = allPages.reduce((sum, p) => sum + p.visits, 0);
          const avgVisits = totalVisits / (allPages.length || 1);
          
          const newMetrics = [
            { label: "Most Visited", value: allPages[0]?.page || "N/A", sub: `${allPages[0]?.visits || 0} visits today` },
            { label: "Least Visited", value: allPages[allPages.length - 1]?.page || "N/A", sub: `${allPages[allPages.length - 1]?.visits || 0} visits today` },
            { label: "Active Users", value: users.length.toString(), sub: "currently online" },
            { label: "Avg Pages/Session", value: avgVisits.toFixed(1), sub: "per user" },
          ];

          setMetrics(newMetrics);
        }
      } catch (error) {
        console.error('Error fetching heatmap data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-[1rem] overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            Platform Heat Map
          </h3>
        </div>
        <div className="p-5 text-center text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  const max = pageData[0]?.visits || 1;

  return (
    <div className="bg-card border border-border rounded-[1rem] overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          Platform Heat Map
        </h3>
      </div>
      <div className="px-5 py-4 space-y-2 border-b border-border">
        {pageData.map((item, i) => (
          <div key={item.page} className="flex items-center gap-3">
            <span className="text-[9px] font-black uppercase text-muted-foreground w-20 text-right truncate">{item.page}</span>
            <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${(item.visits / max) * 100}%`,
                  background: `hsl(${160 - i * 15}, 70%, 50%)`,
                }}
              />
            </div>
            <span className="text-[9px] font-mono text-muted-foreground w-8">{item.visits}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 divide-x divide-border border-t border-border">
        {metrics.slice(0, 4).map(({ label, value, sub }) => (
          <div key={label} className="px-4 py-3 hover:bg-muted/10 transition-colors">
            <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
            <p className="text-sm font-black tracking-tighter text-foreground">{value}</p>
            <p className="text-[8px] text-muted-foreground/60 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TopActiveUsersAndHeatMap() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UserLeaderboard />
      <HeatMap />
    </div>
  );
}
