"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Flame,
  TrendingUpDown,
  Trophy,
  ArrowRightLeft,
  Wallet,
  Coins,
  Star,
  CheckCircle2,
  ChevronDown,
  Zap,
} from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

// ─── Types & Constants ──────────────────────────────────────────────────────
type XPType = "daily" | "achievement" | "prediction";

interface UserBalanceData {
  dailyXP: number;
  achievementXP: number;
  predictionXP: number;
  usdtBalance: number;
  conversionRate: number;
}

const EXCHANGE_RATE = 0.02;

const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};

// ─── XP Pool Config ─────────────────────────────────────────────────────────
const XP_POOLS: { type: XPType; label: string; shortLabel: string; icon: React.ReactNode; color: string; glow: string; bg: string }[] = [
  {
    type: "daily",
    label: "Daily Streak XP",
    shortLabel: "Daily XP",
    icon: <Flame className="w-4 h-4" />,
    color: "text-orange-400",
    glow: "shadow-orange-500/30",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    type: "achievement",
    label: "Achievement XP",
    shortLabel: "Achievement XP",
    icon: <Trophy className="w-4 h-4" />,
    color: "text-yellow-400",
    glow: "shadow-yellow-500/30",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    type: "prediction",
    label: "Prediction XP",
    shortLabel: "Prediction XP",
    icon: <TrendingUpDown className="w-4 h-4" />,
    color: "text-[#229ED9]",
    glow: "shadow-[#229ED9]/30",
    bg: "bg-[#229ED9]/10 border-[#229ED9]/20",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
const DailyStreakPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [balances, setBalances] = useState<UserBalanceData>({
    dailyXP: 0,
    achievementXP: 0,
    predictionXP: 0,
    usdtBalance: 0,
    conversionRate: 0.02,
  });

  const [selectedXPType, setSelectedXPType] = useState<XPType>("daily");
  const [xpInput, setXpInput] = useState<string>("");

  const selectedPool = XP_POOLS.find((p) => p.type === selectedXPType)!;
  const currentMaxXP =
    selectedXPType === "daily"
      ? balances.dailyXP
      : selectedXPType === "achievement"
      ? balances.achievementXP
      : balances.predictionXP;

  const numericXPInput = Number(xpInput) || 0;
  const estimatedUSDT = (numericXPInput * EXCHANGE_RATE).toFixed(2);
  const progressPct = currentMaxXP > 0 ? Math.min((numericXPInput / currentMaxXP) * 100, 100) : 0;

  useEffect(() => {
    const fetchBalanceData = async () => {
      try {
        const response = await fetch("/api/user-dashboard/xp-balance");
        const result = await response.json();
        if (result.success) {
          setBalances({
            dailyXP: result.data.dailyXP,
            achievementXP: result.data.achievementXP,
            predictionXP: result.data.predictionXP || 0,
            usdtBalance: result.data.accountBalance,
            conversionRate: result.data.conversionRate,
          });
        }
      } catch (error) {
        console.error("Error fetching balance data:", error);
        toast.error("Error", { description: "Failed to load balance data. Please refresh.", duration: 3000 });
      } finally {
        setLoading(false);
      }
    };
    fetchBalanceData();
  }, []);

  const handleSetMax = () => setXpInput(currentMaxXP.toString());

  const handleRedeemExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numericXPInput <= 0) {
      toast.error("Invalid Amount", { description: "Please enter an XP amount greater than 0.", duration: 3000 });
      return;
    }
    if (numericXPInput > currentMaxXP) {
      toast.error("Insufficient Balance", {
        description: `You don't have enough ${selectedXPType} XP to complete this conversion.`,
        duration: 4000,
      });
      return;
    }
    setRedeeming(true);
    try {
      const response = await fetch("/api/user-dashboard/redeem-xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xpType: selectedXPType, xpAmount: numericXPInput }),
      });
      const result = await response.json();
      if (result.success) {
        const convertedUSDT = numericXPInput * EXCHANGE_RATE;
        setBalances((prev) => ({
          ...prev,
          dailyXP: selectedXPType === "daily" ? prev.dailyXP - numericXPInput : prev.dailyXP,
          achievementXP: selectedXPType === "achievement" ? prev.achievementXP - numericXPInput : prev.achievementXP,
          predictionXP: selectedXPType === "prediction" ? prev.predictionXP - numericXPInput : prev.predictionXP,
          usdtBalance: prev.usdtBalance + convertedUSDT,
        }));
        toast.success("Redemption Successful!", {
          description: `Exchanged ${numericXPInput.toLocaleString()} ${selectedXPType.toUpperCase()} XP → +$${convertedUSDT.toFixed(2)} USDT`,
          duration: 4000,
        });
        setXpInput("");
      } else {
        toast.error("Redemption Failed", { description: result.message || "Something went wrong. Please try again.", duration: 4000 });
      }
    } catch {
      toast.error("Error", { description: "Failed to process redemption. Please try again.", duration: 4000 });
    } finally {
      setRedeeming(false);
    }
  };

  // ─── Stat Cards (4 only) ─────────────────────────────────────────────────
  const statCards = [
    {
      label: "Account Balance",
      value: `$${formatNumber(balances.usdtBalance)}`,
      sub: "USDT",
      icon: <Wallet className="w-4 h-4 text-emerald-400" />,
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      accent: "text-emerald-400",
    },
    {
      label: "Daily XP",
      value: formatNumber(balances.dailyXP),
      sub: "XP",
      icon: <Flame className="w-4 h-4 text-orange-400" />,
      iconBg: "bg-orange-500/10 border-orange-500/20",
      accent: "text-orange-400",
    },
    {
      label: "Achievement XP",
      value: formatNumber(balances.achievementXP),
      sub: "XP",
      icon: <Trophy className="w-4 h-4 text-yellow-400" />,
      iconBg: "bg-yellow-500/10 border-yellow-500/20",
      accent: "text-yellow-400",
    },
    {
      label: "Prediction XP",
      value: formatNumber(balances.predictionXP),
      sub: "XP",
      icon: <TrendingUpDown className="w-4 h-4 text-[#229ED9]" />,
      iconBg: "bg-[#229ED9]/10 border-[#229ED9]/20",
      accent: "text-[#229ED9]",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-25 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1 mt-3 lg:mt-0">
                {/* <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#229ED9] border border-[#229ED9]/30 bg-[#229ED9]/10 px-2.5 py-1 rounded-full">
                    XP Exchange
                  </span>
                </div> */}
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">
                  Redeem Rewards
                </h1>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.18em]">
                  Convert XP into tradeable USDT · Instant settlement
                </p>
              </div>

              {/* Live rate badge */}
<div className="flex items-center justify-between gap-2 bg-card border border-border rounded-xl px-4 py-2.5 w-full sm:w-auto cursor-pointer">
  {/* Left: dot + label */}
  <div className="flex items-center gap-2">
    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Live Rate</span>
  </div>

  {/* Right: rate */}
  <div className="flex items-center gap-2">
    <span className="text-xs font-black">50 XP</span>
    <ArrowRightLeft className="w-3 h-3 text-muted-foreground" />
    <span className="text-xs font-black text-emerald-400">$1.00 USDT</span>
  </div>
</div>
            </div>

            {/* ── 4 Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {statCards.map((card, i) => (
                <div
                  key={i}
                  className="relative rounded-2xl p-4 border bg-card border-border overflow-hidden transition-all duration-300 hover:border-border/80 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 rounded-lg border ${card.iconBg}`}>{card.icon}</div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black tracking-tighter leading-none">
                      {card.value}
                    </span>
                    <span className={`text-[10px] font-black ${card.accent}`}>{card.sub}</span>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                    {card.label}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Main Exchange Panel (two-column on lg) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

              {/* Left: Swap Engine */}
              <div className="lg:col-span-3 bg-card border border-border rounded-2xl overflow-hidden">
                {/* Terminal header bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#229ED9]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      XP → USDT Swap Engine
                    </span>
                  </div>
                  <Zap className="w-3.5 h-3.5 text-[#229ED9]" />
                </div>

                <div className="p-5 md:p-7 space-y-5">
                  {/* FROM: XP Pool selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        From
                      </label>
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        Available:{" "}
                        <span className={`${selectedPool.color}`}>
                          {currentMaxXP.toLocaleString()} XP
                        </span>
                      </span>
                    </div>

                    {/* Custom Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen((o) => !o)}
                        className="w-full flex items-center justify-between gap-3 bg-background border border-border rounded-xl px-4 py-3 hover:border-[#229ED9]/40 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg border ${selectedPool.bg} ${selectedPool.color}`}>
                            {selectedPool.icon}
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-black">{selectedPool.label}</p>
                            <p className="text-[9px] text-muted-foreground font-semibold">
                              {currentMaxXP.toLocaleString()} XP available
                            </p>
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                      </button>

                      {dropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-xl overflow-hidden z-50 shadow-xl">
                          {XP_POOLS.map((pool) => {
                            const bal = pool.type === "daily" ? balances.dailyXP : pool.type === "achievement" ? balances.achievementXP : balances.predictionXP;
                            return (
                              <button
                                key={pool.type}
                                type="button"
                                onClick={() => {
                                  setSelectedXPType(pool.type);
                                  setXpInput("");
                                  setDropdownOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/10 transition-colors cursor-pointer ${selectedXPType === pool.type ? "bg-muted/5" : ""}`}
                              >
                                <div className={`p-1.5 rounded-lg border ${pool.bg} ${pool.color}`}>{pool.icon}</div>
                                <div className="text-left flex-1">
                                  <p className="text-xs font-black">{pool.label}</p>
                                  <p className="text-[9px] text-muted-foreground">{bal.toLocaleString()} XP</p>
                                </div>
                                {selectedXPType === pool.type && <CheckCircle2 className="w-4 h-4 text-[#229ED9]" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>



                    {/* XP Amount Input */}
                    <div className="relative mt-1">
                      <input
                        type="number"
                        placeholder="0"
                        value={xpInput}
                        min="0"
                        max={currentMaxXP}
                        onChange={(e) => setXpInput(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl pl-4 pr-20 py-3 text-2xl font-black tracking-tight focus:outline-none focus:ring-1 focus:ring-[#229ED9]/50 transition-all placeholder:text-muted-foreground/30"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSetMax}
                          className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-[#229ED9]/15 text-[#229ED9] border border-[#229ED9]/30 hover:bg-[#229ED9] hover:text-white transition-all cursor-pointer"
                        >
                          Max
                        </button>
                        <span className="text-[10px] font-black text-muted-foreground">XP</span>
                      </div>
                    </div>



                    {/* Progress bar */}
                    <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          progressPct >= 90 ? "bg-orange-400" : "bg-[#229ED9]"
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-muted-foreground font-semibold text-right">
                      {progressPct.toFixed(0)}% of balance
                    </p>
                  </div>




                  {/* Arrow divider */}
<div className="flex items-center gap-3">
  {/* XP Icon */}
  <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/25 shrink-0">
    <Coins className="w-4 h-4 text-yellow-400" />
  </div>

  {/* Line */}
  <div className="flex-1 h-px bg-border" />

  {/* Swap Arrow */}
  <div className="p-2 rounded-xl bg-[#229ED9]/10 border border-[#229ED9]/25 shrink-0">
    <ArrowRightLeft className="w-4 h-4 text-[#229ED9]" />
  </div>

  {/* Line */}
  <div className="flex-1 h-px bg-border" />

  {/* Dollar Icon */}
  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 shrink-0">
    <Wallet className="w-4 h-4 text-emerald-400" />
  </div>
</div>




                  {/* TO: USDT output */}
                  <div className="space-y-2">
  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
    To
  </label>
  <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-3 py-3">
    <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0">
      <Wallet className="w-4 h-4 text-emerald-400" />
    </div>

    <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
      <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest shrink-0">
        You receive
      </p>
      <p className="text-2xl font-black tracking-tighter text-emerald-400 leading-tight truncate">
        {estimatedUSDT}
        <span className="text-sm ml-2 font-black text-emerald-500/70">USDT</span>
      </p>
    </div>

    {/* {numericXPInput > 0 && (
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
    )} */}
  </div>
</div>



                  {/* Conversion Rate inline */}
                  <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground px-1">
                    <span>Rate</span>
                    <span>50 XP = <span className="text-white">$1.00 USDT</span></span>
                    <span>Fee</span>
                    <span className="text-emerald-400">None</span>
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleRedeemExchange}
                    disabled={redeeming || numericXPInput <= 0}
                    className="w-full flex items-center justify-center gap-2.5 bg-[#229ED9] hover:bg-[#1a8bc4] text-white rounded-xl px-5 py-4 font-black text-[11px] uppercase tracking-widest transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <Coins className="w-4 h-4 text-white" />
                    {redeeming ? "Executing Swap..." : "Confirm Swap"}
                  </button>
                </div>
              </div>

              {/* Right: Info Panel */}
              <div className="lg:col-span-2 flex flex-col gap-4">

                {/* Market rate card */}
                <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Star className="w-3 h-3 text-yellow-400" /> Exchange Info
                  </p>

                  <div className="space-y-3">
                    {[
                      { label: "Settlement", value: "Instant", color: "text-emerald-400" },
                      { label: "Network Fee", value: "Zero", color: "text-emerald-400" },
                      { label: "Minimum", value: "1 XP", color: "text-white" },
                      { label: "Rate Lock", value: "Real-time", color: "text-[#229ED9]" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground font-semibold">{row.label}</span>
                        <span className={`text-[10px] font-black ${row.color}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-border" />

                  {/* Pool breakdown */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Your XP Pools</p>
                    {XP_POOLS.map((pool) => {
                      const bal = pool.type === "daily" ? balances.dailyXP : pool.type === "achievement" ? balances.achievementXP : balances.predictionXP;
                      const usdVal = (bal * EXCHANGE_RATE).toFixed(2);
                      return (
                        <div key={pool.type} className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg border ${pool.bg} ${pool.color} shrink-0`}>
                            {pool.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-white">{pool.shortLabel}</span>
                              <span className="text-[10px] font-black text-white">{bal.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`text-[9px] font-semibold ${pool.color}`}>≈ ${usdVal}</span>
                              <span className="text-[9px] text-muted-foreground">XP</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Guidelines */}
                <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Guidelines</p>
                  {[
                    { icon: "✦", text: "No minimum. Redeem any amount, anytime.", color: "text-emerald-400" },
                    { icon: "✦", text: "USDT settles instantly to your internal balance.", color: "text-yellow-400" },
                    { icon: "✦", text: "All XP pools share the same flat conversion rate.", color: "text-[#229ED9]" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className={`text-[10px] mt-0.5 shrink-0 ${item.color}`}>{item.icon}</span>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
      <UserNav />
    </div>
  );
};

export default DailyStreakPage;