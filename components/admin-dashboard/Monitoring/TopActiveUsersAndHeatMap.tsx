"use client";

import React from "react";
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
  activityScore: number;
  pageVisitsToday: number;
}

const MOCK_USERS: LiveUser[] = [
  { id: "user_0", fullName: "Alexis Morgan", username: "alexism", status: "online", currentPage: "Dashboard", sessionDuration: "35s", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alexism", activityScore: 95, pageVisitsToday: 12 },
  { id: "user_1", fullName: "Darius Kane", username: "dkane99", status: "online", currentPage: "Deposit", sessionDuration: "2m 14s", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dkane99", activityScore: 88, pageVisitsToday: 8 },
  { id: "user_2", fullName: "Sofia Reyes", username: "sofiar", status: "online", currentPage: "Trading", sessionDuration: "4m 18s", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofiar", activityScore: 82, pageVisitsToday: 15 },
  { id: "user_3", fullName: "Marcus Bell", username: "marcusb", status: "away", currentPage: "Wallet", sessionDuration: "8m 05s", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcusb", activityScore: 76, pageVisitsToday: 6 },
  { id: "user_4", fullName: "Yuna Park", username: "yunapark", status: "online", currentPage: "Referrals", sessionDuration: "12m 33s", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yunapark", activityScore: 71, pageVisitsToday: 9 },
  { id: "user_5", fullName: "Ethan Cole", username: "ethancole", status: "offline", currentPage: "Profile", sessionDuration: "25m", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ethancole", activityScore: 65, pageVisitsToday: 4 },
  { id: "user_6", fullName: "Priya Sharma", username: "priya_s", status: "online", currentPage: "Verification", sessionDuration: "38m 12s", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya_s", activityScore: 58, pageVisitsToday: 11 },
];

function UserLeaderboard() {
  const top = [...MOCK_USERS].sort((a, b) => b.activityScore - a.activityScore).slice(0, 8);

  return (
    <div className="bg-card border border-border rounded-[1rem] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Top Active Users
        </h3>
      </div>
      <div className="divide-y divide-border/50">
        {top.map((user, i) => {
          const PageIcon = PAGE_ICONS[user.currentPage] || Globe;
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
                  <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all" style={{ width: `${user.activityScore}%` }} />
                </div>
                <span className="text-[9px] font-black text-primary w-7 text-right">{user.activityScore}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HeatMap() {
  const pages = ["Dashboard", "Deposit", "Trading", "Wallet", "Referrals", "Withdraw", "Profile", "Support", "Verification", "Notifications"];
  const visits = [312, 289, 245, 198, 167, 143, 122, 89, 76, 44];
  const max = visits[0];

  const metrics = [
    { label: "Most Visited", value: "Dashboard", sub: "312 visits today" },
    { label: "Least Visited", value: "Notifications", sub: "44 visits today" },
    { label: "Avg Session", value: "18m 32s", sub: "per user" },
    { label: "Avg Scroll", value: "62%", sub: "page depth" },
    { label: "Avg Clicks", value: "27", sub: "per session" },
    { label: "Bounce Rate", value: "14%", sub: "below average ✓" },
    { label: "Peak Hour", value: "14:00", sub: "most active" },
  ];

  return (
    <div className="bg-card border border-border rounded-[1rem] overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          Platform Heat Map
        </h3>
      </div>
      <div className="px-5 py-4 space-y-2 border-b border-border">
        {pages.map((page, i) => (
          <div key={page} className="flex items-center gap-3">
            <span className="text-[9px] font-black uppercase text-muted-foreground w-20 text-right truncate">{page}</span>
            <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${(visits[i] / max) * 100}%`,
                  background: `hsl(${160 - i * 15}, 70%, 50%)`,
                }}
              />
            </div>
            <span className="text-[9px] font-mono text-muted-foreground w-8">{visits[i]}</span>
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
      <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
        {metrics.slice(4).map(({ label, value, sub }) => (
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
