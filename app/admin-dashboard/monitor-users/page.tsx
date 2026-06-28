"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search, RefreshCw, Users, Wifi, WifiOff, Clock, Navigation, ScrollText, Shield, BarChart,
  X, Smartphone, Laptop, Globe, Eye, ShieldCheck, Zap, EyeOff, Network, 
  BarChart2, Activity, Layers, Radar, Terminal, Play, Pause,
  SlidersHorizontal, Info, CheckCircle, AlertTriangle, AlertCircle, ShieldAlert,
} from "lucide-react";
import { toast, Toaster } from "sonner";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

import LiveGlobalConnections from "@/components/admin-dashboard/Monitoring/LiveGlobalConnections";
import TrafficOverview from "@/components/admin-dashboard/Monitoring/TrafficOverview";
import DeviceAnalytics from "@/components/admin-dashboard/Monitoring/DeviceAnalytics";
import TopActiveUsersAndHeatMap from "@/components/admin-dashboard/Monitoring/TopActiveUsersAndHeatMap";
import LiveUserActivity from "@/components/admin-dashboard/Monitoring/LiveUserActivity";
import { LiveUser, UserStatus, ActivityEvent, ModalTab, DeviceType } from "@/types/monitoring";


// ─── Helper Components ────────────────────────────────────────────────────────

function UserStatusBadge({ status }: { status: UserStatus }) {
  if (status === "online") return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
    </span>
  );
  if (status === "away") return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
    </span>
  );
  return <span className="inline-flex rounded-full h-2.5 w-2.5 bg-rose-500/70" />;
}


// ─── SECTION 1: Global Live Stats ─────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}{suffix}</span>;
}

function LiveStats() {
  const [stats, setStats] = useState({
    online: 0,
    offline: 0,
    away: 0,
    countries: 0,
    sessions: 0,
    totalEvents: 0,
    totalPageVisits: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/activity');
        if (response.ok) {
          const data = await response.json();
          const users = data.users || [];
          const totalEvents = users.reduce((sum: number, u: any) => sum + (u.activityFeed?.length || 0), 0);
          const totalPageVisits = users.reduce((sum: number, u: any) => sum + (u.pagesVisited?.length || 0), 0);
          
          setStats({
            online: users.filter((u: LiveUser) => u.status === 'online').length,
            offline: users.filter((u: LiveUser) => u.status === 'offline').length,
            away: users.filter((u: LiveUser) => u.status === 'away').length,
            countries: new Set(users.map((u: LiveUser) => u.country)).size,
            sessions: users.length,
            totalEvents,
            totalPageVisits,
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 50000);
    return () => clearInterval(interval);
  }, []);

  const statsArray = [
    { label: "Active Users", value: stats.online, icon: Wifi, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Offline", value: stats.offline, icon: WifiOff, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { label: "Idle / Away", value: stats.away, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: "Countries", value: stats.countries, icon: Globe, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { label: "Active Sessions", value: stats.sessions, icon: Layers, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
    { label: "Total Events", value: stats.totalEvents, icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Page Visits", value: stats.totalPageVisits, icon: Zap, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { label: "Security Score", value: 94, suffix: "%", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  ];

  return (
    <div className="space-y-3">
      {/* Column Headers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 px-2">
        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</div>
        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</div>
        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</div>
        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Location</div>
        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Sessions</div>
        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Activity</div>
        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Pages</div>
        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Security</div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {statsArray.map((s, i) => (
          <div key={i} className={`bg-card border ${s.border} rounded-xl px-4 py-3 hover:scale-[1.02] transition-all group relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "radial-gradient(ellipse at top left, rgba(255,255,255,0.02), transparent 70%)" }} />
            <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className={`text-xl font-black tracking-tighter ${s.color}`}>
              <AnimatedCounter target={s.value} suffix={(s as any).suffix || ""} />
            </p>
            <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}






// ─── SECTION 9: Float Notifications ───────────────────────────────────────────
type Severity = "info" | "success" | "warning" | "danger" | "critical";
interface FloatNotif { id: string; text: string; severity: Severity; }

function NotificationCenter({ notifications, onDismiss }: { notifications: FloatNotif[]; onDismiss: (id: string) => void }) {
  const colorMap: Record<Severity, string> = {
    info: "border-blue-500/30 bg-blue-500/10", success: "border-emerald-500/30 bg-emerald-500/10",
    warning: "border-amber-500/30 bg-amber-500/10", danger: "border-rose-500/30 bg-rose-500/10",
    critical: "border-red-500/40 bg-red-500/15",
  };
  const iconMap: Record<Severity, React.ElementType> = {
    info: Info, success: CheckCircle, warning: AlertTriangle, danger: AlertCircle, critical: ShieldAlert,
  };
  const textMap: Record<Severity, string> = {
    info: "text-blue-400", success: "text-emerald-400", warning: "text-amber-400", danger: "text-rose-400", critical: "text-red-400",
  };

  return (
    <div className="fixed bottom-24 right-4 z-[300] flex flex-col gap-2 w-72 pointer-events-none">
      {notifications.map((n) => {
        const Icon = iconMap[n.severity];
        return (
          <div
            key={n.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-md pointer-events-auto ${colorMap[n.severity]}`}
            style={{ animation: "slideInRight 0.3s ease" }}
          >
            <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${textMap[n.severity]}`} />
            <p className="text-[11px] text-foreground flex-1 leading-snug">{n.text}</p>
            <button onClick={() => onDismiss(n.id)} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── SECTION 10+11: Quick Filters + Search Bar ──────────────────────────────────
function QuickFilters({ active, onToggle, onReset }: { active: string[]; onToggle: (f: string) => void; onReset: () => void }) {
  const groups = [
    { label: "Status", chips: ["Online", "Offline", "Idle"] },
    { label: "Device", chips: ["Desktop", "Mobile", "Chrome", "Edge", "Firefox"] },
    { label: "Page", chips: ["Deposit", "Withdraw", "Trading", "Wallet", "Verification", "Support"] },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {groups.map(({ label, chips }) => (
        <div key={label} className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{label}:</span>
          {chips.map(chip => (
            <button
              key={chip}
              onClick={() => onToggle(chip)}
              className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                active.includes(chip)
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-muted/20 border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      ))}
      {active.length > 0 && (
        <button
          onClick={onReset}
          className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
        >
          Reset
        </button>
      )}
    </div>
  );
}

// ─── SECTION 12: Enhanced Monitor Modal ───────────────────────────────────────
function LiveMonitorModal({ user, onClose }: { user: LiveUser; onClose: () => void }) {
  const [tab, setTab] = useState<ModalTab>("overview");
  const [currentUser, setCurrentUser] = useState<LiveUser>(user);
  const [isPaused, setIsPaused] = useState(false);
  const [seenEventIds, setSeenEventIds] = useState<Set<string>>(new Set());
  const activityScrollRef = useRef<HTMLDivElement>(null);

  // Refresh user data every 10 seconds when not paused
  useEffect(() => {
    if (isPaused) return;

    const refreshUserData = async () => {
      try {
        // Save scroll position before refresh
        const scrollPosition = activityScrollRef.current?.scrollTop || 0;

        const response = await fetch('/api/admin/activity');
        if (response.ok) {
          const data = await response.json();
          const updatedUser = data.users?.find((u: LiveUser) => u.id === user.id);
          if (updatedUser) {
            setCurrentUser(updatedUser);
            
            // Mark all current events as seen
            const newSeenIds = new Set(seenEventIds);
            updatedUser.activityFeed.forEach((ev: any) => {
              const eventId = `${ev.time}_${ev.action}_${ev.page}`;
              newSeenIds.add(eventId);
            });
            setSeenEventIds(newSeenIds);

            // Restore scroll position after refresh
            setTimeout(() => {
              if (activityScrollRef.current) {
                activityScrollRef.current.scrollTop = scrollPosition;
              }
            }, 0);
          }
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    };

    refreshUserData();
    const interval = setInterval(refreshUserData, 20000);
    return () => clearInterval(interval);
  }, [user.id, isPaused, seenEventIds]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const tabs: { key: ModalTab; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Overview", icon: Eye },
    { key: "activity", label: "Activity", icon: Activity },
    { key: "security", label: "Security", icon: Shield },
    { key: "devices", label: "Devices", icon: Laptop },
    { key: "navigation", label: "Navigation", icon: Navigation },
    { key: "timeline", label: "Timeline", icon: ScrollText },
    { key: "statistics", label: "Statistics", icon: BarChart },
  ];

  function OverviewTab() {
    const items = [
      { l: "Full Name", v: currentUser.fullName }, { l: "Username", v: `@${currentUser.username}` },
      { l: "Email", v: currentUser.email }, { l: "Role", v: currentUser.role.toUpperCase() },
      { l: "Country", v: currentUser.country }, { l: "City", v: currentUser.city },
      { l: "IP Address", v: currentUser.ipAddress }, { l: "Login Time", v: currentUser.loginTime },
      { l: "Session", v: currentUser.sessionDuration }, { l: "Current Page", v: currentUser.currentPage },
      { l: "Browser", v: currentUser.browser }, { l: "OS", v: currentUser.os },
    ];
    return (
      <div className="grid grid-cols-2 gap-2">
        {items.map(({ l, v }) => (
          <div key={l} className="p-3 bg-muted/20 rounded-xl border border-border hover:border-primary/20 transition-all">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{l}</p>
            <p className="text-xs font-bold text-foreground mt-0.5 truncate">{v}</p>
          </div>
        ))}
      </div>
    );
  }

  function ActivityTab() {
    const catColor: Record<string, string> = {
      navigation: "text-cyan-400", action: "text-emerald-400", form: "text-violet-400",
      scroll: "text-amber-400", deposit: "text-emerald-300", auth: "text-rose-400",
    };

    // Format activity text to be more descriptive
    const formatActivityText = (ev: any) => {
      const username = currentUser.fullName || currentUser.username;
      switch (ev.category) {
        case "navigation":
          return `${username} navigated to ${ev.page || ev.action}`;
        case "form":
          return `${username} submitted form on ${ev.page || ev.action}`;
        case "scroll":
          return `${username} scrolled to ${ev.action} on ${ev.page}`;
        case "deposit":
          return `${username} made a deposit action`;
        case "auth":
          return `${username} performed authentication activity`;
        default:
          return `${username}: ${ev.action}`;
      }
    };

    // Check if event is new (not seen before)
    const isNewEvent = (ev: any) => {
      const eventId = `${ev.time}_${ev.action}_${ev.page}`;
      return !seenEventIds.has(eventId);
    };

    return (
      <div ref={activityScrollRef} className="bg-black/40 rounded-xl border border-emerald-500/20 p-4 h-full overflow-y-auto" style={{ minHeight: 300 }}>
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-emerald-500/20">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 text-[10px] font-bold tracking-widest font-mono">ACTIVITY_STREAM v2.4.1</span>
          <span className={`ml-auto inline-block w-2 h-3 ${isPaused ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`} />
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${isPaused ? "border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20" : "border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20"}`}
            title={isPaused ? "Resume refresh" : "Pause refresh"}
          >
            {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
          </button>
        </div>
        {currentUser.activityFeed.map((ev, i) => {
          const isNew = isNewEvent(ev);
          const col = isNew ? "text-emerald-400" : "text-amber-700"; // Green for new, brown for old
          const formattedText = formatActivityText(ev);
          return (
            <div key={i} className={`flex items-start gap-3 py-2 border-b ${isNew ? "border-emerald-500/10" : "border-amber-900/20"} last:border-0 group hover:bg-emerald-500/5 transition-all px-2 rounded-lg`}>
              <span className={`${isNew ? "text-emerald-500/60" : "text-amber-700/60"} text-[10px] font-mono shrink-0 w-16 pt-0.5`}>{ev.time}</span>
              <Globe className={`w-3 h-3 shrink-0 mt-0.5 ${col}`} />
              <span className={`${col} text-[11px] font-mono leading-snug`}>{formattedText}</span>
            </div>
          );
        })}
      </div>
    );
  }

  function SecurityTab() {
    const flags = [
      { label: "VPN Detected", value: currentUser.vpnDetected, icon: EyeOff },
      { label: "New Device", value: currentUser.newDevice, icon: Smartphone },
      { label: "Multiple IPs", value: false, icon: Network },
      { label: "Failed Logins", value: false, icon: Shield },
    ];
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {flags.map(({ label, value, icon: Icon }) => (
            <div key={label} className={`flex items-center gap-3 p-3 rounded-xl border ${value ? "border-rose-500/30 bg-rose-500/5" : "border-emerald-500/20 bg-emerald-500/5"}`}>
              <Icon className={`w-4 h-4 ${value ? "text-rose-400" : "text-emerald-400"}`} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-foreground">{label}</p>
                <p className={`text-[9px] font-bold ${value ? "text-rose-400" : "text-emerald-400"}`}>{value ? "Detected" : "Clear"}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-muted/20 rounded-xl border border-border">
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">IP Address</p>
          <p className="text-sm font-mono font-bold text-foreground">{currentUser.ipAddress}</p>
          <p className="text-[9px] text-muted-foreground mt-1">Geolocation: {currentUser.city}, {currentUser.country}</p>
        </div>
      </div>
    );
  }

  function DevicesTab() {
    return (
      <div className="space-y-3">
        <div className="p-4 bg-muted/20 rounded-xl border border-primary/20 flex items-start gap-4">
          {currentUser.device === "mobile" ? <Smartphone className="w-8 h-8 text-primary" /> : <Laptop className="w-8 h-8 text-primary" />}
          <div>
            <p className="text-xs font-black text-foreground uppercase tracking-tight">Current Device</p>
            <p className="text-sm font-bold text-primary">{currentUser.device.charAt(0).toUpperCase() + currentUser.device.slice(1)}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{currentUser.os} · {currentUser.browser}</p>
            <p className="text-[9px] font-mono text-muted-foreground mt-0.5">{currentUser.ipAddress}</p>
            {currentUser.newDevice && <span className="inline-block mt-1.5 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-black uppercase rounded">New Device</span>}
          </div>
        </div>
        <div className="p-3 bg-muted/20 rounded-xl border border-border">
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">Session Info</p>
          <div className="grid grid-cols-2 gap-2">
            {[["Login Time", currentUser.loginTime], ["Duration", currentUser.sessionDuration], ["Browser", currentUser.browser], ["OS", currentUser.os]].map(([l, v]) => (
              <div key={l}><p className="text-[9px] text-muted-foreground">{l}</p><p className="text-xs font-bold text-foreground">{v}</p></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function NavigationTab() {
    return (
      <div className="space-y-3">
        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Pages Visited This Session</p>
        <div className="space-y-2">
          {currentUser.pagesVisited.map((page, i) => {
            return (
              <div key={page} className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl border border-border hover:border-primary/20 transition-all">
                <span className="text-[9px] text-muted-foreground font-mono w-4">{i + 1}</span>
                <div className="p-1.5 bg-primary/10 rounded-lg"><Globe className="w-3.5 h-3.5 text-primary" /></div>
                <span className="text-xs font-black uppercase tracking-tight text-foreground">{page}</span>
                {i === 0 && <span className="ml-auto text-[8px] font-black uppercase text-muted-foreground">current</span>}
              </div>
            );
          })}
        </div>
        <div className="p-3 bg-muted/20 rounded-xl border border-border">
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">Navigation Stats</p>
          <div className="grid grid-cols-2 gap-2">
            {[["Pages Today", currentUser.pageVisitsToday], ["Current", currentUser.currentPage]].map(([l, v]) => (
              <div key={l as string}><p className="text-[9px] text-muted-foreground">{l}</p><p className="text-sm font-black text-foreground">{v}</p></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function TimelineTab() {
    return (
      <div className="relative pl-5">
        <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
        {currentUser.activityFeed.map((ev, i) => {
          return (
            <div key={i} className="relative mb-4 last:mb-0">
              <div className="absolute -left-3 w-3 h-3 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
              <div className="ml-3 p-3 bg-muted/20 rounded-xl border border-border hover:border-primary/20 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-foreground">{ev.action}</span>
                </div>
                <p className="text-[9px] font-mono text-muted-foreground">{ev.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function StatisticsTab() {
    const stats = [
      { label: "Page Visits Today", value: currentUser.pageVisitsToday, max: 30, color: "#6366f1" },
      { label: "Scroll Progress", value: currentUser.scrollProgress, max: 100, color: "#f43f5e", suffix: "%" },
    ];
    return (
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, max, color, suffix }) => (
          <div key={label} className="p-3 bg-muted/20 rounded-xl border border-border">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
            <p className="text-xl font-black tracking-tighter" style={{ color }}>{value}{suffix || ""}</p>
            <div className="mt-2 h-1.5 bg-muted/40 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(value / max) * 100}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const tabContent: Record<ModalTab, React.ReactNode> = {
    overview: <OverviewTab />,
    activity: <ActivityTab />,
    security: <SecurityTab />,
    devices: <DevicesTab />,
    navigation: <NavigationTab />,
    timeline: <TimelineTab />,
    statistics: <StatisticsTab />,
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div
        className="relative bg-card border border-border flex flex-col overflow-hidden"
        style={{ width: "100%", height: "100vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow top line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-border bg-black/20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={user.avatar} alt={user.fullName} className="w-10 h-10 rounded-xl border border-border object-cover bg-muted" />
              <span className="absolute -bottom-1 -right-1"><UserStatusBadge status={user.status} /></span>
            </div>
            <div>
              <p className="text-sm font-black tracking-tight text-foreground">{user.fullName}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">@{user.username} · {user.country}</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-muted/30 border border-border rounded-lg">
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-wider text-foreground">{user.currentPage}</span>
            </div>
            {user.vpnDetected && (
              <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-black uppercase rounded-lg flex items-center gap-1">
                <EyeOff className="w-3 h-3" />VPN
              </span>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 flex gap-1 px-4 py-2 border-b border-border bg-muted/10 overflow-x-auto">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                tab === key ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {tabContent[tab]}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-t border-border bg-black/10">
          <p className="text-[9px] font-mono text-muted-foreground">Session: {user.sessionDuration} · IP: {user.ipAddress} · {user.browser}</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:opacity-80 transition-opacity cursor-pointer">Flag User</button>
            <button className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:opacity-80 transition-opacity cursor-pointer">Terminate Session</button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── SOC HEADER ───────────────────────────────────────────────────────────────
function SOCHeader({ searchTerm, setSearchTerm, onRefresh, isRefreshing, activeFilters, onToggleFilter, onResetFilters }: {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  activeFilters: string[];
  onToggleFilter: (f: string) => void;
  onResetFilters: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">
                SOC Dashboard
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-0.5">
                <Terminal className="w-3 h-3 text-primary" />
                Security Operations Center — Rise Platform
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search user, IP, country, page..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-muted/30 border-2 border-border rounded-xl py-2.5 pl-10 pr-4 text-xs font-black italic tracking-tight focus:border-foreground focus:outline-none transition-all w-full md:w-72"
            />
          </div>
          <button onClick={onRefresh} className="p-2.5 bg-muted/30 border-2 border-border rounded-xl text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-all cursor-pointer">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
          <button className="p-2.5 bg-muted/30 border-2 border-border rounded-xl text-muted-foreground hover:border-foreground/40 transition-all cursor-pointer">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live</span>
          </div>
        </div>
      </div>
      <QuickFilters active={activeFilters} onToggle={onToggleFilter} onReset={onResetFilters} />
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function AdminSOCPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | UserStatus>("all");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<LiveUser | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<FloatNotif[]>([]);
  const seenEventIdsRef = useRef<Set<string>>(new Set());

  // Fetch real activity data for notifications and detect new events
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch('/api/admin/activity');
        if (response.ok) {
          const data = await response.json();
          const users = data.users || [];
          
          // Collect all activity events from all users
          const allEvents: any[] = [];
          users.forEach((user: any) => {
            if (user.activityFeed && user.activityFeed.length > 0) {
              user.activityFeed.forEach((event: any) => {
                allEvents.push({
                  ...event,
                  username: user.username,
                  fullName: user.fullName,
                  eventId: `${user.username}_${event.time}_${event.action}` // Unique identifier
                });
              });
            }
          });

          // Sort by time (most recent first)
          allEvents.sort((a, b) => b.time.localeCompare(a.time));

          // Filter events to only those within 50 seconds
          const now = new Date();
          const recentEvents = allEvents.filter(event => {
            const eventTime = new Date(event.time);
            const diffSeconds = (now.getTime() - eventTime.getTime()) / 1000;
            return diffSeconds <= 50;
          });

          // Find new events (events we haven't seen before)
          const newEvents = recentEvents.filter(event => !seenEventIdsRef.current.has(event.eventId));

          // Deduplicate events with same action, page, and time (within 2 seconds)
          const deduplicatedEvents = newEvents.filter((event, index, self) => {
            const isDuplicate = self.slice(0, index).some(other => 
              other.action === event.action &&
              other.page === event.page &&
              other.username === event.username &&
              Math.abs(new Date(other.time).getTime() - new Date(event.time).getTime()) <= 2000
            );
            return !isDuplicate;
          });

          // Show notifications for new events immediately
          deduplicatedEvents.forEach(event => {
            const id = `notif_${Date.now()}_${Math.random()}`;
            let severity: Severity = "info";
            let text = "";

            // Determine severity and format text based on event category
            switch (event.category) {
              case "form":
                severity = "success";
                text = `${event.fullName} submitted form on ${event.page}`;
                break;
              case "navigation":
                severity = "info";
                text = `${event.fullName} navigated to ${event.page}`;
                break;
              case "scroll":
                severity = "info";
                text = `${event.fullName} scrolled on ${event.page}`;
                break;
              case "deposit":
                severity = "success";
                text = `${event.fullName} made a deposit`;
                break;
              case "auth":
                severity = "warning";
                text = `${event.fullName} authentication activity`;
                break;
              default:
                severity = "info";
                text = `${event.fullName}: ${event.action}`;
            }

            setNotifications(prev => [...prev, { id, text, severity }]);
            setTimeout(() => setNotifications(prev => prev.filter(x => x.id !== id)), 5000);
          });

          // Update seen events (keep only last 100 to avoid memory issues)
          const newSeenIds = new Set(allEvents.slice(0, 100).map(e => e.eventId));
          seenEventIdsRef.current = newSeenIds;
        }
      } catch (error) {
        console.error('Error fetching activity data:', error);
      }
    };

    fetchActivity();
    const interval = setInterval(fetchActivity, 50000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  }, []);

  const toggleFilter = (f: string) => {
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  };

  const resetFilters = () => {
    setActiveFilters([]);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <Toaster position="top-center" richColors />
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
          <div className="max-w-[1600px] mx-auto space-y-8">

            {/* SOC Header */}
            <SOCHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
              activeFilters={activeFilters}
              onToggleFilter={toggleFilter}
              onResetFilters={resetFilters}
            />

            {/* Section 1: Live Stats */}
            <LiveStats />

            {/* Section 2: World Map */}
            <LiveGlobalConnections />

            {/* Section 8: Traffic Charts */}
            <TrafficOverview />

            {/* Section 7: Device Analytics */}
            <DeviceAnalytics />

            {/* Section 5+6: Leaderboard + Heatmap */}
            <TopActiveUsersAndHeatMap />

            {/* Main Activity Table */}
            <LiveUserActivity 
              filterStatus={filterStatus} 
              setFilterStatus={setFilterStatus} 
              onMonitor={(user) => setSelectedUser(user)} 
              activeFilters={activeFilters}
            />

          </div>
        </main>

        <AdminNav />
      </div>

      {/* Monitor Modal */}
      {selectedUser && <LiveMonitorModal user={selectedUser} onClose={() => setSelectedUser(null)} />}

      {/* Float Notifications */}
      <NotificationCenter notifications={notifications} onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} />

      <style jsx global>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}