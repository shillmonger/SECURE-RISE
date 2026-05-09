"use client";

import React, { useState, useEffect } from "react";
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
  roi: {
    iconBg: "bg-gradient-to-br from-violet-600/20 to-violet-400/10",
    iconColor: "text-violet-400",
    border: "border-violet-500/30",
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
      {
        id: "first-crypto-address",
        title: "Crypto Starter",
        description: "Connected my first crypto address",
        unlocked: false,
        rarity: "common",
        xp: 75,
      },
      {
        id: "3-crypto-addresses",
        title: "Crypto Enthusiast",
        description: "Connected up to 3 crypto addresses",
        unlocked: false,
        rarity: "rare",
        xp: 150,
      },
      {
        id: "5-crypto-addresses",
        title: "Crypto Master",
        description: "Connected all the 5 crypto addresses",
        unlocked: false,
        rarity: "epic",
        xp: 300,
      },
    ],
  },
  {
    id: "roi",
    label: "ROI",
    icon: <TrendingUp className={`w-4 h-4 ${CATEGORY_CONFIG.roi.iconColor}`} />,
    achievements: [
      {
        id: "first-roi",
        title: "First ROI",
        description: "Earned your first profit from investment",
        unlocked: false,
        rarity: "common",
        xp: 100,
      },
      {
        id: "roi-50",
        title: "Profit Starter",
        description: "Made $50 from ROI",
        unlocked: false,
        rarity: "common",
        xp: 150,
      },
      {
        id: "roi-200",
        title: "Profit Builder",
        description: "Made $200 from ROI",
        unlocked: false,
        rarity: "rare",
        xp: 250,
      },
      {
        id: "roi-700",
        title: "Profit Master",
        description: "Made $700 from ROI",
        unlocked: false,
        rarity: "rare",
        xp: 400,
      },
      {
        id: "roi-1000",
        title: "Profit Expert",
        description: "Made $1,000 from ROI",
        unlocked: false,
        rarity: "epic",
        xp: 600,
      },
      {
        id: "roi-5000",
        title: "Profit Legend",
        description: "Made $5,000 from ROI",
        unlocked: false,
        rarity: "legendary",
        xp: 1200,
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
  const [achievements, setAchievements] = useState<any[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [loading, setLoading] = useState(true);

  // Check for new achievements and fetch current achievements from API
  useEffect(() => {
    const initializeAchievements = async () => {
      try {
        // First, check for any new achievements to unlock
        const checkResponse = await fetch('/api/user-dashboard/achievements/check', {
          method: 'POST'
        });
        
        if (checkResponse.ok) {
          const checkData = await checkResponse.json();
          console.log('New achievements check:', checkData);
          
          if (checkData.newAchievements.length > 0) {
            // Show notification for new achievements
            console.log(`🎉 Unlocked ${checkData.newAchievements.length} new achievement(s)!`);
            checkData.newAchievements.forEach((achievement: any) => {
              console.log(`- ${achievement.title}: ${achievement.description}`);
            });
          }
        }
        
        // Then fetch the current achievements state
        const response = await fetch('/api/user-dashboard/achievements');
        console.log('API Response Status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('API Response Data:', data);
          console.log('Achievements count:', data.achievements?.length);
          console.log('Unlocked achievements count:', data.achievements?.filter((a: any) => a.unlocked).length);
          console.log('Total XP from API:', data.totalXP);
          console.log('AchievementsUnlocked array length:', data.achievementsUnlocked?.length);
          setAchievements(data.achievements);
          setTotalXP(data.totalXP);
        } else {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          console.error('Status:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Failed to initialize achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAchievements();
  }, []);

  // Group achievements by category - merge API data with category structure
  const achievementsByCategory = CATEGORIES.map(category => ({
    ...category,
    achievements: achievements.filter(a => a.category === category.id)
  }));

  const allAchievements = achievements;
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPct = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  // Debug logging
  console.log('Frontend calculation:', {
    achievementsLength: achievements.length,
    unlockedCount,
    totalCount,
    progressPct,
    totalXP
  });

  const displayedAchievements =
    activeCategory === "all"
      ? allAchievements
      : achievementsByCategory.find((c) => c.id === activeCategory)?.achievements ?? [];

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-10 lg:space-y-10">

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
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 bg-muted rounded-lg"></div>
                      <div className="w-12 h-6 bg-muted rounded-full"></div>
                    </div>
                    <div className="w-16 h-8 bg-muted rounded-lg mb-2"></div>
                    <div className="w-20 h-4 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
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
            )}



            {/* Category Filter */}
            {loading ? (
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="w-24 h-14 bg-muted rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : (
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
            )}




            {/* Category Sections */}
            {loading ? (
              <div className="space-y-10">
                {/* Achievement Cards Skeleton */}
                {CATEGORIES.map((category, catIndex) => (
                  <section key={catIndex}>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-xl animate-pulse"></div>
                        <div>
                          <div className="w-20 h-4 bg-muted rounded mb-1"></div>
                          <div className="w-16 h-3 bg-muted rounded"></div>
                        </div>
                      </div>
                      <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-card border border-border rounded-2xl p-4 md:p-5 animate-pulse">
                          <div className="w-10 h-10 bg-muted rounded-xl mb-4"></div>
                          <div className="w-full h-3 bg-muted rounded mb-1"></div>
                          <div className="w-3/4 h-2 bg-muted rounded mb-4"></div>
                          <div className="flex items-center justify-between">
                            <div className="w-12 h-3 bg-muted rounded-full"></div>
                            <div className="w-10 h-3 bg-muted rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : activeCategory === "all" ? (
              <div className="space-y-10">
                {achievementsByCategory.map((cat) => (
                  <section key={cat.id}>
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${CATEGORY_CONFIG[cat.id as keyof typeof CATEGORY_CONFIG].iconBg} ${CATEGORY_CONFIG[cat.id as keyof typeof CATEGORY_CONFIG].border} border-2 flex items-center justify-center`}>
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
                        <AchievementCard key={ach.achievementId || ach.id} achievement={ach} category={cat.id} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <section>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {displayedAchievements.map((ach) => {
                    const category = achievements.find(a => a.achievementId === ach.achievementId)?.category || ach.category || '';
                    return (
                      <AchievementCard key={ach.achievementId || ach.id} achievement={ach} category={category} />
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