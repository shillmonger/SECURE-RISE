"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  PieChart,
  Download,
  RefreshCw,
  Zap,
  ShieldCheck,
  Wallet,
  BarChart2,
  Clock,
  ChevronRight,
  Gift,
} from "lucide-react";
import { useTheme } from "next-themes"; // Assuming you use next-themes
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

function useCountUp(target: number, duration = 1400, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const s = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - s) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return val;
}

// ─── sparkline mini SVG ───────────────────────────────────────────────────────
function Sparkline({
  data,
  color,
  w = 80,
  h = 32,
}: {
  data: number[];
  color: string;
  w?: number;
  h?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── animated bar ─────────────────────────────────────────────────────────────
function AnimBar({
  pct,
  color,
  delay = 0,
}: {
  pct: number;
  color: string;
  delay?: number;
}) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ─── loading skeletons ───────────────────────────────────────────────────────
function StatSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-3 w-20 bg-muted rounded animate-pulse"></div>
      <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
      <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
    </div>
  );
}

function BarChartSkeleton() {
  return (
    <div className="flex items-end gap-2 px-1 h-70">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="flex-1">
          <div className="h-full bg-muted rounded animate-pulse" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
          <div className="h-3 w-8 bg-muted rounded animate-pulse mt-2 mx-auto"></div>
        </div>
      ))}
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
          <div className="w-8 h-8 rounded-xl bg-muted animate-pulse"></div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
            <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="text-right space-y-1">
            <div className="h-3 w-16 bg-muted rounded animate-pulse ml-auto"></div>
            <div className="h-3 w-12 bg-muted rounded animate-pulse ml-auto"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PortfolioBreakdownSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-muted animate-pulse"></div>
              <div className="h-3 w-20 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="h-1.5 bg-muted rounded-full animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}

// ─── bar chart column ─────────────────────────────────────────────────────────
function BarCol({
  pct,
  label,
  value,
  delay = 0,
  color,
}: {
  pct: number;
  label: string;
  value: string;
  delay?: number;
  color: string;
}) {
  const [h, setH] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setH(pct), 200 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
        {value}
      </span>
      <div className="w-full flex items-end justify-center" style={{ height: 120 }}>
        <div
          className="w-full rounded-t-[4px] transition-all duration-[1200ms] ease-[cubic-bezier(.4,0,.2,1)] relative group cursor-pointer"
          style={{ height: `${h}%`, background: color, minHeight: 4 }}
        >
          <div
            className="absolute -top-7 left-1/2 -translate-x-1/2 bg-popover/80 backdrop-blur text-popover-foreground
                        text-[9px] font-bold px-2 py-1 rounded-md border border-border
                        opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
          >
            {value}
          </div>
        </div>
      </div>
      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function UserAnalyticsPage() {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState("7d");
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [overviewStats, setOverviewStats] = useState({
    totalInvestments: 0,
    totalProfits: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    activePlans: 0,
    roiPercentage: 0,
  });
  const [investmentBreakdown, setInvestmentBreakdown] = useState<any[]>([]);
  const [profitHistory, setProfitHistory] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper function to get Lucide icon by name
  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp': return TrendingUp;
      case 'ArrowDownRight': return ArrowDownRight;
      case 'ArrowUpRight': return ArrowUpRight;
      case 'Target': return Target;
      case 'Zap': return Zap;
      default: return TrendingUp;
    }
  };

  // Extract fetchAnalyticsData function so it can be called by refresh button
  const fetchAnalyticsData = useCallback(async () => {
    setLoading(true);
    
    try {
      console.log(`Fetching analytics data for timeRange: ${timeRange}`);
      const response = await fetch(`/api/user-dashboard/analytics?timeRange=${timeRange}`, {
        credentials: 'include',
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`Failed to fetch analytics data: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('Analytics data result:', result);

      if (result.success) {
        const data = result.data;
        console.log('Setting overview stats:', data.overview);
        
        setOverviewStats({
          totalInvestments: data.overview.totalInvestments || 0,
          totalProfits: data.overview.totalProfits || 0,
          totalDeposits: data.overview.totalDeposits || 0,
          totalWithdrawals: data.overview.totalWithdrawals || 0,
          activePlans: data.overview.activePlans || 0,
          roiPercentage: data.overview.roiPercentage || 0,
        });

        setInvestmentBreakdown(
          (data.investmentBreakdown || []).map((item: any, index: number) => ({
            name: item.name || 'Unknown',
            value: item.value || 0,
            percentage: item.percentage || 0,
            color: ["#3b82f6", "#a855f7", "#10b981", "#f59e0b"][index % 4],
            count: item.count || 0,
            profit: item.profit || 0
          }))
        );

        setProfitHistory(data.profitHistory || []);

        setRecentActivity(
          (data.recentActivity || []).map((activity: any) => ({
            ...activity,
            icon: getActivityIcon(activity.icon),
            color: activity.color?.replace('text-', 'text-') || 'text-white',
            bgColor: activity.bgColor?.replace('bg-', 'bg-') || 'bg-white/10'
          }))
        );

        setPerformanceMetrics([
          { 
            metric: "Daily ROI", 
            value: data.performanceMetrics?.dailyROI || "0%", 
            change: "+0.3%", 
            positive: true 
          },
          { 
            metric: "Weekly Growth", 
            value: data.performanceMetrics?.weeklyGrowth || "0%", 
            change: "+2.1%", 
            positive: true 
          },
          { 
            metric: "Success Rate", 
            value: data.performanceMetrics?.successRate || "0%", 
            change: "-1.2%", 
            positive: false 
          },
          { 
            metric: "Risk Score", 
            value: data.performanceMetrics?.riskScore || "Low", 
            change: "Stable", 
            positive: true 
          },
        ]);
      } else {
        console.error('Analytics API error:', result.message);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Full error details:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const profits = useCountUp(overviewStats.totalProfits, 1400, mounted);
  const portfolio = useCountUp(overviewStats.totalInvestments, 1600, mounted);
  const deposits = useCountUp(overviewStats.totalDeposits, 1500, mounted);
  const withdrawals = useCountUp(overviewStats.totalWithdrawals, 1300, mounted);

  const timeRanges = ["24h", "7d", "30d", "90d", "1y"];

  // Use real investment breakdown data
  const breakdown = investmentBreakdown.map((item: any) => ({
    name: item.name,
    pct: item.percentage,
    value: fmt(item.value),
    color: item.color,
  }));

  // Use real performance metrics data
  const metrics = performanceMetrics.map((metric: any) => ({
    label: metric.metric,
    value: metric.value,
    delta: metric.change,
    up: metric.positive,
    color: metric.positive ? "#10b981" : "#ef4444",
  }));

  // Use real activity data
  const activity = recentActivity.map((act: any) => ({
    icon: act.icon,
    title: act.title,
    desc: act.description,
    amount: act.amount,
    time: act.time,
    amtColor: act.color,
    bg: act.bgColor,
    ico: act.color,
  }));

  // Generate daily bar chart data
  const barData = profitHistory.slice(0, 7).map((profit: any, index: number) => {
    const date = new Date(profit.timestamp);
    const dayLabel = date.toLocaleDateString('en', { weekday: 'short' });
    const maxValue = Math.max(...profitHistory.slice(0, 7).map((p: any) => p.amount || 0));
    const pct = maxValue > 0 ? ((profit.amount || 0) / maxValue) * 100 : 0;
    
    return {
      label: dayLabel,
      value: fmt(profit.amount || 0),
      pct: Math.round(pct),
    };
  });

  // Generate sparkline data from profit history
  const sparkData = profitHistory.slice(0, 7).map((profit: any) => profit.amount || 0);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Ambient glows (opacity reduced for light mode) */}
        <div className="pointer-events-none absolute top-[-15%] left-[10%] w-[45%] h-[45%] rounded-full bg-blue-500/10 dark:bg-blue-700/8 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-[-10%] right-[5%] w-[30%] h-[40%] rounded-full bg-emerald-500/10 dark:bg-emerald-600/6 blur-[130px]" />

        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 pb-24">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* ── PAGE HEADER ───────────────────────────────────────────── */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border pb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500">
                    Live Market Analytics
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black  tracking-[-2.5px] leading-none
                               bg-gradient-to-r from-foreground via-foreground/80 to-foreground/40 bg-clip-text text-transparent">
                  PERFORMANCE
                </h1>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-2">
                  Track investment growth &amp; trade metrics
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex bg-muted border border-border p-1 rounded-xl gap-1">
                  {timeRanges.map((r) => (
                    <button
                      key={r}
                      onClick={() => setTimeRange(r)}
                      className={`px-3 py-1.5 rounded-lg cursor-pointer text-[10px] font-black uppercase tracking-widest transition-all
                                  ${timeRange === r
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <Button
  variant="outline"
  size="sm"
  onClick={() => {
    setRefreshing(true);
    fetchAnalyticsData().finally(() => {
      setTimeout(() => setRefreshing(false), 500);
    });
  }}
  className="bg-card px-3 py-4 cursor-pointer rounded-lg"
>
  <RefreshCw
    className={`w-3.5 h-3.5 md:mr-1.5 ${
      refreshing || loading ? "animate-spin" : ""
    }`}
  />

  <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">
    Refresh
  </span>
</Button>
              </div>
            </header>

            {/* ── BENTO TOP ROW ─────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="col-span-2 relative overflow-hidden border-0 p-0 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 text-white">
                <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                <div className="relative z-10 p-6 md:p-8 flex flex-col h-full min-h-[180px]">
                  <div className="flex items-start justify-between mb-auto">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/70 mb-1">Total Portfolio Value</p>
                      <h2 className="text-4xl md:text-5xl font-black tracking-[-2px] leading-none">${portfolio.toLocaleString()}</h2>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                      <Wallet size={18} className="text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-6 flex-wrap">
                    <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <TrendingUp size={12} />
                      <span className="text-xs font-black">+18.2%</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Total Profits */}
              <Card className="rounded-2xl p-6 relative overflow-hidden group border-border">
                <div className="absolute bottom-0 right-0 opacity-[0.03] dark:opacity-5 group-hover:opacity-10 transition-opacity">
                  <TrendingUp size={90} className="text-emerald-500" />
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                  <TrendingUp size={16} className="text-emerald-500" />
                </div>
                <div className="relative z-10">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Total Profits</p>
                  <p className="text-3xl font-black tracking-[-1.5px]">${profits.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-3">
                    <div className="flex items-center gap-0.5 text-emerald-500 text-[10px] font-black">
                      <ArrowUpRight size={11} /> +18.2%
                    </div>
                    <div className="ml-auto">
                      <Sparkline data={[12, 15, 13, 18, 14, 20]} color="#10b981" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* ROI */}
              <Card className="rounded-2xl p-6 relative overflow-hidden group border-border">
                <div className="absolute bottom-0 right-0 opacity-[0.03] dark:opacity-5 group-hover:opacity-10 transition-opacity">
                  <PieChart size={90} className="text-amber-500" />
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <PieChart size={16} className="text-amber-500" />
                </div>
                <div className="relative z-10">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Total ROI</p>
                  <p className="text-3xl font-black tracking-[-1.5px] ">{overviewStats.roiPercentage}%</p>
                  <div className="flex items-center gap-1 mt-3">
                    <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-black">
                      <ArrowUpRight size={11} /> +2.4%
                    </div>
                    <div className="ml-auto">
                      <Sparkline data={sparkData} color="#f59e0b" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* ── MIDDLE SECTION ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2 rounded-2xl p-6 border-border">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Daily Profit — {timeRange}</p>
                    {loading ? (
                      <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
                    ) : (
                      <p className="text-2xl font-black tracking-[-1px] text-foreground">${profits.toLocaleString()}</p>
                    )}
                  </div>
                  <BarChart2 size={16} className="text-muted-foreground" />
                </div>

                {loading ? (
                  <BarChartSkeleton />
                ) : barData.length > 0 ? (
                  <div className="flex items-end gap-2 px-1 h-70">
                    {barData.map((b, i) => (
                      <BarCol
                        key={`${b.label}-${i}`}
                        label={b.label}
                        value={b.value}
                        pct={b.pct}
                        delay={i * 60}
                        color={`hsl(${210 + i * 6}, 80%, ${theme === 'dark' ? '48%' : '60%'})`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-70 text-muted-foreground">
                    <div className="text-center">
                      <BarChart2 size={48} className="mx-auto mb-3 opacity-50" />
                      <p className="text-sm font-medium">No profit data available</p>
                      <p className="text-xs mt-1">Profit history will appear here</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-4 gap-3 mt-6 pt-5 border-t border-border">
                  {metrics.map((m) => (
                    <div key={m.label}>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">{m.label}</p>
                      <p className="text-lg font-black tracking-tight " style={{ color: m.color }}>{m.value}</p>
                      <div className={`flex items-center gap-0.5 text-[9px] font-bold mt-0.5 ${m.up ? "text-emerald-500" : "text-red-500"}`}>
                        {m.up ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />} {m.delta}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Activity feed */}
              <Card className="rounded-2xl p-5 flex flex-col border-border">
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground mb-4">Live Feed</p>
                <div className="flex-1 space-y-2">
                  {loading ? (
                    <ActivitySkeleton />
                  ) : activity.length > 0 ? (
                    activity.map((a, i) => (
                      <div key={i} className="group flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border hover:bg-muted transition-all cursor-pointer">
                        <div className={`w-8 h-8 rounded-xl ${a.bg} flex items-center justify-center flex-shrink-0`}>
                          <a.icon size={14} className={a.ico} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black text-foreground leading-none">{a.title}</p>
                          <p className="text-[9px] text-muted-foreground font-bold mt-0.5 truncate">{a.desc}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`text-[11px] font-black ${a.amtColor}`}>{a.amount}</p>
                          <p className="text-[8px] text-muted-foreground font-bold mt-0.5">{a.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-48 text-muted-foreground">
                      <div className="text-center">
                        <Clock size={48} className="mx-auto mb-3 opacity-50" />
                        <p className="text-sm font-medium">No recent activity</p>
                        <p className="text-xs mt-1">Your recent transactions will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
                <Link href="/user-dashboard/transactions">
                  <Button variant="ghost" className="mt-4 cursor-pointer w-full text-muted-foreground hover:text-foreground text-[9px] font-black uppercase tracking-widest rounded-lg">
                    View Full Audit Log <ChevronRight size={12} className="ml-1" />
                  </Button>
                </Link>
              </Card>
            </div>

            {/* ── BOTTOM ROW ────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="rounded-2xl p-6 border-border">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Portfolio Breakdown</p>
                    {loading ? (
                      <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
                    ) : (
                      <p className="text-lg font-black tracking-tight text-foreground">{fmt(overviewStats.totalInvestments)} total</p>
                    )}
                  </div>
                  <Target size={16} className="text-muted-foreground" />
                </div>
                {loading ? (
                  <PortfolioBreakdownSkeleton />
                ) : breakdown.length > 0 ? (
                  <div className="space-y-4">
                    {breakdown.map((b, i) => (
                      <div key={b.name} className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: b.color }} />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{b.name}</span>
                          </div>
                          <span className="text-[11px] font-black" style={{ color: b.color }}>{b.value}</span>
                        </div>
                        <AnimBar pct={b.pct} color={b.color} delay={i * 100} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-25 text-muted-foreground">
                    <div className="text-center">
                      <Target size={48} className="mx-auto mb-3 opacity-50" />
                      <p className="text-sm font-medium">No portfolio data</p>
                      <p className="text-xs mt-1">Your investment breakdown will appear here</p>
                    </div>
                  </div>
                )}
              </Card>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="rounded-2xl bg-emerald-500/5 border-emerald-500/20 p-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400/70 mb-1">Total Deposits</p>
                    <p className="text-2xl font-black tracking-[-1px] text-emerald-600 dark:text-emerald-400">+${deposits.toLocaleString()}</p>
                  </Card>
                  <Card className="rounded-2xl bg-red-500/5 border-red-500/20 p-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-red-600 dark:text-red-400/70 mb-1">Withdrawals</p>
                    <p className="text-2xl font-black tracking-[-1px] text-red-600 dark:text-red-400">-${withdrawals.toLocaleString()}</p>
                  </Card>
                </div>

                <Card className="rounded-2xl p-4 border-border">
                  <div className="grid grid-cols-3 gap-0 divide-x divide-border">
                    {[
                      { icon: ShieldCheck, label: "Capital Safe", value: "100%", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                      { icon: Clock, label: "Coverage", value: "24/7", color: "text-blue-500", bg: "bg-blue-500/10" },
                      { icon: Gift, label: "Bonuses", value: "3 Active", color: "text-amber-500", bg: "bg-amber-500/10" },
                    ].map((s) => (
                      <div key={s.label} className="flex flex-col items-center text-center px-3 py-2">
                        <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
                          <s.icon size={14} className={s.color} />
                        </div>
                        <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

          </div>
        </main>
      </div>

      <UserNav />
    </div>
  );
}