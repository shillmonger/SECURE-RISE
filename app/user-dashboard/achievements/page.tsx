"use client";

import React, { useState } from "react";
import {
  Trophy,
  Star,
  Lock,
  Gift,
  TrendingUp,
  Wallet,
  ArrowDownToLine,
  Send,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
  xp: number;
}

interface AchievementCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  achievements: Achievement[];
}

// ─── Category Config ───────────────────────────────────────────────────────────
const CATEGORY_CONFIG = {
  welcome: {
    iconBg: "bg-gradient-to-br from-indigo-600/20 to-indigo-400/10",
    iconColor: "text-indigo-400",
    border: "border-indigo-500/30",
  },
  deposits: {
    iconBg: "bg-gradient-to-br from-blue-600/20 to-blue-400/10",
    iconColor: "text-blue-400",
    border: "border-blue-500/30",
  },
  investments: {
    iconBg: "bg-gradient-to-br from-green-600/20 to-green-400/10",
    iconColor: "text-green-400",
    border: "border-green-500/30",
  },
  withdrawals: {
    iconBg: "bg-gradient-to-br from-orange-600/20 to-orange-400/10",
    iconColor: "text-orange-400",
    border: "border-orange-500/30",
  },
  gifts: {
    iconBg: "bg-gradient-to-br from-pink-600/20 to-pink-400/10",
    iconColor: "text-pink-400",
    border: "border-pink-500/30",
  },
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES: AchievementCategory[] = [
  {
    id: "welcome",
    label: "Welcome",
    icon: <Sparkles className={`w-4 h-4 ${CATEGORY_CONFIG.welcome.iconColor}`} />,
    achievements: [
      {
        id: "welcome-bonus",
        title: "Welcome Bonus",
        description: "Claimed your welcome bonus on first login",
        unlocked: true,
        rarity: "common",
        xp: 50,
      },
    ],
  },
  {
    id: "deposits",
    label: "Deposits",
    icon: <ArrowDownToLine className={`w-4 h-4 ${CATEGORY_CONFIG.deposits.iconColor}`} />,
    achievements: [
      {
        id: "first-deposit",
        title: "First Deposit",
        description: "Made your very first deposit",
        unlocked: true,
        rarity: "common",
        xp: 100,
      },
      {
        id: "3-deposits",
        title: "On a Roll",
        description: "Completed up to 3 deposits",
        unlocked: true,
        rarity: "common",
        xp: 150,
      },
      {
        id: "deposit-100",
        title: "Century Mark",
        description: "Deposited up to $100 in total",
        unlocked: true,
        rarity: "rare",
        xp: 200,
      },
      {
        id: "deposit-500",
        title: "High Roller",
        description: "Deposited up to $500 in total",
        unlocked: false,
        rarity: "rare",
        xp: 350,
      },
      {
        id: "deposit-1000",
        title: "Grand Depositor",
        description: "Deposited up to $1,000 in total",
        unlocked: false,
        rarity: "epic",
        xp: 500,
      },
      {
        id: "deposit-5000",
        title: "Whale Status",
        description: "Deposited up to $5,000 in total",
        unlocked: false,
        rarity: "legendary",
        xp: 1000,
      },
    ],
  },
  {
    id: "investments",
    label: "Investments",
    icon: <TrendingUp className={`w-4 h-4 ${CATEGORY_CONFIG.investments.iconColor}`} />,
    achievements: [
      {
        id: "first-investment",
        title: "First Investment",
        description: "Placed your very first investment",
        unlocked: true,
        rarity: "common",
        xp: 100,
      },
      {
        id: "3-investments",
        title: "Portfolio Builder",
        description: "Completed up to 3 investments",
        unlocked: false,
        rarity: "common",
        xp: 150,
      },
      {
        id: "invest-100",
        title: "Seed Capital",
        description: "Invested up to $100 in total",
        unlocked: false,
        rarity: "rare",
        xp: 200,
      },
      {
        id: "invest-500",
        title: "Growth Investor",
        description: "Invested up to $500 in total",
        unlocked: false,
        rarity: "rare",
        xp: 350,
      },
      {
        id: "invest-1000",
        title: "Power Investor",
        description: "Invested up to $1,000 in total",
        unlocked: false,
        rarity: "epic",
        xp: 500,
      },
      {
        id: "invest-5000",
        title: "Market Titan",
        description: "Invested up to $5,000 in total",
        unlocked: false,
        rarity: "legendary",
        xp: 1000,
      },
    ],
  },
  {
    id: "withdrawals",
    label: "Withdrawals",
    icon: <Wallet className={`w-4 h-4 ${CATEGORY_CONFIG.withdrawals.iconColor}`} />,
    achievements: [
      {
        id: "first-withdrawal",
        title: "First Cash Out",
        description: "Completed your first withdrawal",
        unlocked: false,
        rarity: "common",
        xp: 100,
      },
      {
        id: "3-withdrawals",
        title: "Frequent Withdrawer",
        description: "Completed up to 3 withdrawals",
        unlocked: false,
        rarity: "common",
        xp: 150,
      },
      {
        id: "withdraw-300",
        title: "Pocket Money",
        description: "Withdrew up to $300 in total",
        unlocked: false,
        rarity: "rare",
        xp: 200,
      },
      {
        id: "withdraw-500",
        title: "Half Thousand",
        description: "Withdrew up to $500 in total",
        unlocked: false,
        rarity: "rare",
        xp: 350,
      },
      {
        id: "withdraw-1000",
        title: "Grand Exit",
        description: "Withdrew up to $1,000 in total",
        unlocked: false,
        rarity: "epic",
        xp: 500,
      },
      {
        id: "withdraw-5000",
        title: "Big Liquidator",
        description: "Withdrew up to $5,000 in total",
        unlocked: false,
        rarity: "legendary",
        xp: 1000,
      },
    ],
  },
  {
    id: "gifts",
    label: "Gifts",
    icon: <Gift className={`w-4 h-4 ${CATEGORY_CONFIG.gifts.iconColor}`} />,
    achievements: [
      {
        id: "first-gift-received",
        title: "First Gift",
        description: "Received your first gift",
        unlocked: true,
        rarity: "common",
        xp: 75,
      },
      {
        id: "3-gifts-received",
        title: "Gift Collector",
        description: "Received up to 3 gifts",
        unlocked: false,
        rarity: "common",
        xp: 150,
      },
      {
        id: "first-gift-sent",
        title: "Generous Soul",
        description: "Sent your first gift to someone",
        unlocked: true,
        rarity: "common",
        xp: 100,
      },
      {
        id: "3-gifts-sent",
        title: "Gift Giver",
        description: "Sent up to 3 gifts",
        unlocked: false,
        rarity: "common",
        xp: 150,
      },
      {
        id: "gift-sent-50",
        title: "Thoughtful",
        description: "Sent a gift worth $50",
        unlocked: false,
        rarity: "rare",
        xp: 200,
      },
      {
        id: "gift-sent-100",
        title: "Big Heart",
        description: "Sent a gift worth $100",
        unlocked: false,
        rarity: "rare",
        xp: 300,
      },
      {
        id: "gift-sent-300",
        title: "Benefactor",
        description: "Sent a gift worth $300",
        unlocked: false,
        rarity: "rare",
        xp: 400,
      },
      {
        id: "gift-sent-500",
        title: "Patron",
        description: "Sent a gift worth $500",
        unlocked: false,
        rarity: "epic",
        xp: 500,
      },
      {
        id: "gift-sent-1000",
        title: "Grand Patron",
        description: "Sent a gift worth $1,000",
        unlocked: false,
        rarity: "epic",
        xp: 750,
      },
      {
        id: "gift-sent-5000",
        title: "Legendary Giver",
        description: "Sent a gift worth $5,000",
        unlocked: false,
        rarity: "legendary",
        xp: 1500,
      },
    ],
  },
];

// ─── Rarity Config ─────────────────────────────────────────────────────────────
const RARITY_CONFIG = {
  common: {
    label: "Common",
    gradient: "from-zinc-600/30 to-zinc-500/10",
    border: "border-zinc-500/30",
    badge: "bg-zinc-700/60 text-zinc-300",
    glow: "",
    iconBg: "bg-zinc-700/50",
    iconColor: "text-zinc-300",
  },
  rare: {
    label: "Rare",
    gradient: "from-blue-600/30 to-blue-400/10",
    border: "border-blue-500/40",
    badge: "bg-blue-700/40 text-blue-300",
    glow: "",
    iconBg: "bg-blue-700/40",
    iconColor: "text-blue-300",
  },
  epic: {
    label: "Epic",
    gradient: "from-purple-600/30 to-purple-400/10",
    border: "border-purple-500/40",
    badge: "bg-purple-700/40 text-purple-300",
    glow: "shadow-purple-900/30",
    iconBg: "bg-purple-700/40",
    iconColor: "text-purple-300",
  },
  legendary: {
    label: "Legendary",
    gradient: "from-amber-600/40 to-amber-400/10",
    border: "border-amber-500/50",
    badge: "bg-amber-700/40 text-amber-300",
    glow: "shadow-amber-900/40",
    iconBg: "bg-amber-600/30",
    iconColor: "text-amber-300",
  },
};

// ─── Achievement Card ──────────────────────────────────────────────────────────
const AchievementCard = ({ achievement, category }: { achievement: Achievement; category: string }) => {
  const cfg = RARITY_CONFIG[achievement.rarity];
  const categoryCfg = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];

  return (
    <div
      className={`
        relative rounded-2xl border-2 p-4 md:p-5 transition-all duration-300 cursor-pointer group
        bg-gradient-to-br ${achievement.unlocked ? categoryCfg.iconBg : cfg.gradient} ${achievement.unlocked ? categoryCfg.border : cfg.border}
        ${achievement.unlocked ? `shadow-lg ${cfg.glow} hover:scale-[1.02] hover:shadow-xl` : "opacity-50 grayscale hover:opacity-60"}
      `}
    >
      {/* Lock overlay */}
      {!achievement.unlocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl z-10">
          <div className="bg-background/60 backdrop-blur-sm rounded-full p-3">
            <Lock className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      )}

      {/* Unlocked badge */}
      {achievement.unlocked && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
        </div>
      )}

      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl ${achievement.unlocked ? categoryCfg.iconBg : cfg.iconBg} flex items-center justify-center mb-4`}>
        <Trophy className={`w-5 h-5 ${achievement.unlocked ? categoryCfg.iconColor : cfg.iconColor}`} />
      </div>

      {/* Title */}
      <h3 className="text-sm font-black italic uppercase tracking-tight leading-tight mb-1">
        {achievement.title}
      </h3>

      {/* Description */}
      <p className="text-[10px] text-muted-foreground font-medium leading-relaxed mb-4">
        {achievement.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${cfg.badge}`}>
          {cfg.label}
        </span>
        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1">
          <Star className="w-2.5 h-2.5 text-amber-400" />
          {achievement.xp} XP
        </span>
      </div>
    </div>
  );
};

// ─── Page ──────────────────────────────────────────────────────────────────────
const AchievementsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const allAchievements = CATEGORIES.flatMap((c) => c.achievements);
  const unlockedCount = allAchievements.filter((a) => a.unlocked).length;
  const totalCount = allAchievements.length;
  const totalXP = allAchievements
    .filter((a) => a.unlocked)
    .reduce((acc, a) => acc + a.xp, 0);
  const progressPct = Math.round((unlockedCount / totalCount) * 100);

  const displayedAchievements =
    activeCategory === "all"
      ? allAchievements
      : CATEGORIES.find((c) => c.id === activeCategory)?.achievements ?? [];

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-10">

            {/* Page Title */}
            <section className="space-y-2">
              <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic leading-none flex items-center gap-4">
                Achievements
              </h1>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-primary" />
                Unlock rewards by reaching milestones
              </p>
            </section>



            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Unlocked */}
              <div className="bg-foreground text-background p-5 rounded-2xl relative overflow-hidden group cursor-pointer hover:opacity-90 transition-all">
                <Trophy className="absolute -right-3 -top-3 w-20 h-20 opacity-10" />
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">
                  Achievements Unlocked
                </p>
                <h3 className="text-3xl font-black tracking-tighter">
                  {unlockedCount}
                  <span className="text-lg opacity-50">/{totalCount}</span>
                </h3>
              </div>

              {/* XP */}
              <div className="bg-card border border-border p-5 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-foreground/20 transition-all">
                <Star className="absolute -right-3 -top-3 w-20 h-20 opacity-5 text-amber-400" />
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Total XP Earned
                </p>
                <h3 className="text-3xl font-black tracking-tighter text-amber-400">
                  {totalXP.toLocaleString()}
                  <span className="text-sm text-muted-foreground font-black ml-1 not-italic">XP</span>
                </h3>
              </div>

              {/* Progress */}
              <div className="bg-card border border-border p-5 rounded-2xl cursor-pointer hover:border-foreground/20 transition-all">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Completion
                </p>
                <h3 className="text-3xl font-black tracking-tighter mb-3">
                  {progressPct}%
                </h3>
                <div className="w-full bg-muted/50 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-foreground rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Categories Completed */}
              <div className="bg-card border border-border p-5 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-foreground/20 transition-all">
                <ShieldCheck className="absolute -right-3 -top-3 w-20 h-20 opacity-5 text-primary" />
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Categories Completed
                </p>
                <h3 className="text-3xl font-black tracking-tighter text-primary">
                  {CATEGORIES.filter(cat => cat.achievements.every(ach => ach.unlocked)).length}
                  <span className="text-lg text-muted-foreground font-black ml-1 not-italic">/{CATEGORIES.length}</span>
                </h3>
              </div>
            </div>




            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveCategory("all")}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest border-2 transition-all cursor-pointer ${
                  activeCategory === "all"
                    ? "bg-foreground text-background border-transparent"
                    : "bg-card border-border text-muted-foreground hover:border-foreground/30"
                }`}
              >
                <Trophy className="w-4 h-4" /> All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest border-2 transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-foreground text-background border-transparent"
                      : "bg-card border-border text-muted-foreground hover:border-foreground/30"
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>





            {/* Category Sections */}
            {activeCategory === "all" ? (
              <div className="space-y-10">
                {CATEGORIES.map((cat) => (
                  <section key={cat.id}>
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl ${CATEGORY_CONFIG[cat.id as keyof typeof CATEGORY_CONFIG].iconBg} ${CATEGORY_CONFIG[cat.id as keyof typeof CATEGORY_CONFIG].border} border-2 flex items-center justify-center`}>
                          {cat.icon}
                        </div>
                        <div>
                          <h2 className="text-sm font-black uppercase italic tracking-tight">
                            {cat.label}
                          </h2>
                          <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">
                            {cat.achievements.filter((a) => a.unlocked).length}/{cat.achievements.length} unlocked
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveCategory(cat.id)}
                        className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary border-b border-primary/30 cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        View All <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                      {cat.achievements.map((ach) => (
                        <AchievementCard key={ach.id} achievement={ach} category={cat.id} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <section>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {displayedAchievements.map((ach) => {
                    const category = CATEGORIES.find(c => c.achievements.some(a => a.id === ach.id))?.id || '';
                    return (
                      <AchievementCard key={ach.id} achievement={ach} category={category} />
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
      <UserNav />
    </div>
  );
};

export default AchievementsPage;