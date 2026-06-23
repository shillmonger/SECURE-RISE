"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Flame,
  Calendar,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  Target,
  TrendingUp,
  Star,
  Coins,
  Lock,
  PartyPopper,
  AlertTriangle,
  ArrowRightLeft,
  Wallet,
} from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ─── Types & Constants ──────────────────────────────────────────────────────
type XPType = "daily" | "achievement";

interface UserBalanceData {
  dailyXP: number;
  achievementXP: number;
  usdtBalance: number;
  conversionRate: number;
}

const EXCHANGE_RATE = 0.02; // 100 XP = $2 USDT ($0.02 per XP)

// Helper function to format numbers with K, M, B notation
const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

const DailyStreakPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  
  // State for balances
  const [balances, setBalances] = useState<UserBalanceData>({
    dailyXP: 0,
    achievementXP: 0,
    usdtBalance: 0,
    conversionRate: 0.02,
  });

  // Redemption Form State
  const [selectedXPType, setSelectedXPType] = useState<XPType>("daily");
  const [xpInput, setXpInput] = useState<string>("");

  // Calculate live conversion values
  const currentMaxXP = selectedXPType === "daily" ? balances.dailyXP : balances.achievementXP;
  const numericXPInput = Number(xpInput) || 0;
  const estimatedUSDT = (numericXPInput * EXCHANGE_RATE).toFixed(2);

  useEffect(() => {
    const fetchBalanceData = async () => {
      try {
        const response = await fetch("/api/user-dashboard/xp-balance");
        const result = await response.json();

        if (result.success) {
          setBalances({
            dailyXP: result.data.dailyXP,
            achievementXP: result.data.achievementXP,
            usdtBalance: result.data.accountBalance,
            conversionRate: result.data.conversionRate,
          });
        }
      } catch (error) {
        console.error("Error fetching balance data:", error);
        toast.error("Error", {
          description: "Failed to load balance data. Please refresh.",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBalanceData();
  }, []);

  // Handle Max click
  const handleSetMax = () => {
    setXpInput(currentMaxXP.toString());
  };

  // ─── Redemption Handler ────────────────────────────────────────────────────
  const handleRedeemExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (numericXPInput <= 0) {
      toast.error("Invalid Amount", {
        description: "Please enter an XP amount greater than 0.",
        duration: 3000,
      });
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          xpType: selectedXPType,
          xpAmount: numericXPInput,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const convertedUSDT = numericXPInput * EXCHANGE_RATE;
        
        // Update local balances
        setBalances((prev) => ({
          ...prev,
          dailyXP: selectedXPType === "daily" ? prev.dailyXP - numericXPInput : prev.dailyXP,
          achievementXP: selectedXPType === "achievement" ? prev.achievementXP - numericXPInput : prev.achievementXP,
          usdtBalance: prev.usdtBalance + convertedUSDT,
        }));

        toast.success("Redemption Successful!", {
          description: `Successfully exchanged ${numericXPInput.toLocaleString()} ${selectedXPType.toUpperCase()} XP for +${convertedUSDT.toFixed(2)} USDT!`,
          duration: 4000,
        });

        setXpInput("");
      } else {
        toast.error("Redemption Failed", {
          description: result.message || "Something went wrong. Please try again.",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error processing redemption:", error);
      toast.error("Error", {
        description: "Failed to process redemption. Please try again.",
        duration: 4000,
      });
    } finally {
      setRedeeming(false);
    }
  };

  const balanceCards = [
    {
      label: "Account Balance",
      value: `$${formatNumber(balances.usdtBalance)}`,
      unit: "USDT",
      icon: <Wallet className="w-5 h-5 text-green-400" />,
      dark: true,
    },
    {
      label: "Daily XP Balance",
      value: `${formatNumber(balances.dailyXP)}`,
      unit: "XP",
      icon: <Flame className="w-5 h-5 text-orange-400" />,
      dark: false,
    },
    {
      label: "Achv XP Balance",
      value: `${formatNumber(balances.achievementXP)}`,
      unit: "XP",
      icon: <Trophy className="w-5 h-5 text-yellow-400" />,
      dark: false,
    },
    {
      label: "Conversion Rate",
      value: `50 : 1`,
      unit: "XP/USDT",
      icon: <ArrowRightLeft className="w-5 h-5 text-sky-400" />,
      dark: false,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-10 lg:space-y-10">
            
            {/* ── Title ── */}
            <section className="space-y-1.5">
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none flex items-center gap-3">
                Redeem Rewards
              </h1>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <Coins className="w-3 h-3 text-yellow-400" />
                Convert your hard-earned XP directly into tradeable USDT digital assets
              </p>
            </section>

            {/* ── Balance Status Grid ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {balanceCards.map((s, i) => (
                <div
                  key={i}
                  className={`
                    rounded-[1rem] p-4 md:p-5 relative overflow-hidden border
                    ${s.dark
                      ? "bg-foreground text-background border-transparent"
                      : "bg-card border-border"
                    }
                  `}
                >
                  <div className="mb-3">{s.icon}</div>
                  <h3 className="text-2xl font-black tracking-tighter leading-none">
                    {s.value}
                    <span className={`text-xs ml-2 font-black ${s.dark ? "opacity-50" : "text-muted-foreground"}`}>
                      {s.unit}
                    </span>
                  </h3>
                  <p className={`text-[9px] font-black uppercase tracking-[0.18em] mt-1 ${s.dark ? "opacity-55" : "text-muted-foreground"}`}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Exchange / Redemption Box ── */}
            <div className="relative bg-card border border-border rounded-[1rem] p-5 md:p-8 overflow-hidden">
              <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-5 pointer-events-none">
                <ArrowRightLeft className="w-32 h-32 text-foreground" />
              </div>
              
              <div className="max-w-xl">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">XP Swap Engine</p>
                
                <form onSubmit={handleRedeemExchange} className="space-y-5">
                  {/* Dropdown Selection */}
                  <div className="space-y-2">
  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
    Select Source Pool
  </label>

  <Select
    value={selectedXPType}
    onValueChange={(value) => {
      setSelectedXPType(value as XPType);
      setXpInput("");
    }}
  >
    <SelectTrigger className="w-full bg-background border cursor-pointer border-border rounded-lg px-4 py-5 text-xs font-black uppercase tracking-wider focus:ring-1 focus:ring-yellow-400/50">
      <SelectValue placeholder="Select XP type" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem
        value="daily"
        className="px-2 py-2"
      >
        Daily Streak XP ({balances.dailyXP.toLocaleString()} Available)
      </SelectItem>

      <SelectItem
        value="achievement"
        className="px-2 py-2"
      >
        Achievement Milestone XP ({balances.achievementXP.toLocaleString()} Available)
      </SelectItem>
    </SelectContent>
  </Select>
</div>

                  {/* Input field with Max button */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
                        Amount to Convert
                      </label>
                      <button
                        type="button"
                        onClick={handleSetMax}
                        className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 hover:bg-yellow-400 hover:text-black transition-all"
                      >
                        Use Max
                      </button>
                    </div>
                    
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        placeholder="0"
                        value={xpInput}
                        min="0"
                        max={currentMaxXP}
                        onChange={(e) => setXpInput(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl pl-4 pr-16 py-3 text-xl font-black tracking-tight focus:outline-none focus:ring-1 focus:ring-yellow-400/50 transition-all"
                      />
                      <span className="absolute right-4 text-xs font-black text-muted-foreground uppercase tracking-widest select-none">
                        XP
                      </span>
                    </div>
                  </div>

                  {/* Live conversion presentation banner */}
                  <div className="bg-muted/10 border border-border/60 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">You Receive Estimate</p>
                      <p className="text-xl font-black tracking-tight text-green-400 mt-0.5">
                        {estimatedUSDT} <span className="text-xs font-black">USDT</span>
                      </p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-green-950/20 border border-green-500/30 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                  </div>

                  {/* Redeem Processing Button */}
                  <button
                    type="submit"
                    disabled={redeeming || numericXPInput <= 0}
                    className="w-full flex justify-center cursor-pointer flex items-center gap-2.5 bg-foreground text-background transition-all rounded-xl px-5 py-3.5 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01]"
                  >
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {redeeming ? "Executing smart transfer..." : `Confirm Conversion to USDT`}
                    </span>
                  </button>
                </form>
              </div>
            </div>

            {/* ── Rules and Legend Info ── */}
            <div className="bg-card border border-border rounded-[1rem] p-4 md:p-5">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <Star className="w-3 h-3 text-yellow-400" /> Redemption Guidelines
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { title: "Minimum Threshold", desc: "No minimum limits on conversions. Redeem anytime.", color: "bg-green-950/20 border-green-500/20 text-green-400" },
                  { title: "Instant Settled", desc: "USDT settlements deploy instantly directly to internal balances.", color: "bg-yellow-950/20 border-yellow-400/30 text-yellow-300" },
                  { title: "Rate Uniformity", desc: "Both Daily Claims and Milestone items trade at matching flat valuation scales.", color: "bg-muted/10 border-border/40 text-muted-foreground" },
                ].map((item, index) => (
                  <div key={index} className={`flex flex-col gap-1 px-4 py-3 rounded-xl border ${item.color}`}>
                    <span className="text-[9px] font-black uppercase tracking-widest">{item.title}</span>
                    <span className="text-[10px] tracking-normal font-normal opacity-80 normal-case">{item.desc}</span>
                  </div>
                ))}
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