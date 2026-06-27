"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ChevronLeft, Trophy, ChevronRight, Users, Wallet, DollarSign, BriefcaseBusiness } from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LeaderboardSkeleton from "@/components/LoadingSkeleton/LeaderboardSkeleton";

// ─── Rank Badge Images ────────────────────────────────────────────────────────

const RANK_IMAGES: Record<number, string> = {
  1: "https://i.postimg.cc/SKV9yRnv/Leaderboard-1.png",
  2: "https://i.postimg.cc/zGF7gJLd/Leaderboard-2.png",
  3: "https://i.postimg.cc/jdV43WPn/Leaderboard-3.png",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

interface LeaderboardUser {
  rank: number;
  username: string;
  email: string;
  balance: number;
  totalDeposit: number;
  totalWithdrawal: number;
  totalProfits: number;
  profileImage: string;
  fullName: string;
}

interface TopThreeUser {
  rank: number;
  username: string;
  avatar: string;
  metric: number;
  metricName: string;
}

const TOP_THREE_DEFAULT: TopThreeUser[] = [
  { rank: 1, username: "Loading...", avatar: "https://github.com/shadcn.png", metric: 0, metricName: "Total Withdrawals" },
  { rank: 2, username: "Loading...", avatar: "https://github.com/shadcn.png", metric: 0, metricName: "Total Withdrawals" },
  { rank: 3, username: "Loading...", avatar: "https://github.com/shadcn.png", metric: 0, metricName: "Total Withdrawals" },
];

const LEADERBOARD_TABLE_DATA_DEFAULT: LeaderboardUser[] = [];

const TABLE_HEADERS = ["Rank", "Player", "Email", "Account Balance", "Total Withdrawals", "Total Profits", "Total Deposits"];

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

// ─── Podium Card (Desktop) ────────────────────────────────────────────────────
// ─── Podium Card (Desktop Only) ───────────────────────────────────────────────
// Compact luxury desktop design: narrow cards, refined proportions.
// Mobile styling completely ignored - desktop-first approach.

const RANK_CONFIG = {
  1: {
    border: "border-yellow-500/40",
    gradient: "bg-gradient-to-b from-yellow-500/[0.06] via-card to-card",
    innerBg: "bg-yellow-500/8 border-yellow-500/20",
    avatarBorder: "border-yellow-500/50",
    nameColor: "text-yellow-300 text-xl",
    scoreColor: "text-yellow-300 text-4xl",
    podiumOffset: "-translate-y-4",
    scale: "flex-[1.15] w-44", // Narrow 11rem width
    badgeSize: "w-12 h-12",
    avatarSize: "w-20 h-20",
    nameSize: "text-xl",
    scoreSize: "text-4xl",
    shimmer: true,
    topAccent: "before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-transparent before:via-yellow-400/60 before:to-transparent before:rounded-t-[1.5rem]",
  },
  2: {
    border: "border-slate-400/30",
    gradient: "bg-gradient-to-b from-slate-400/[0.04] via-card to-card",
    innerBg: "bg-slate-500/8 border-slate-400/15",
    avatarBorder: "border-slate-400/40",
    nameColor: "text-slate-300 text-lg",
    scoreColor: "text-slate-200 text-3xl",
    podiumOffset: "translate-y-0",
    scale: "flex-1 w-40", // Narrow 10rem width
    badgeSize: "w-10 h-10",
    avatarSize: "w-18 h-18",
    nameSize: "text-lg",
    scoreSize: "text-3xl",
    shimmer: false,
    topAccent: "before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-transparent before:via-slate-400/40 before:to-transparent before:rounded-t-[1.5rem]",
  },
  3: {
    border: "border-amber-700/30",
    gradient: "bg-gradient-to-b from-amber-800/[0.05] via-card to-card",
    innerBg: "bg-amber-800/8 border-amber-700/15",
    avatarBorder: "border-amber-700/40",
    nameColor: "text-amber-400 text-lg",
    scoreColor: "text-amber-300 text-3xl",
    podiumOffset: "translate-y-0",
    scale: "flex-1 w-40", // Narrow 10rem width
    badgeSize: "w-10 h-10",
    avatarSize: "w-18 h-18",
    nameSize: "text-lg",
    scoreSize: "text-3xl",
    shimmer: false,
    topAccent: "before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-transparent before:via-amber-600/40 before:to-transparent before:rounded-t-[1.5rem]",
  },
} as const;

function PodiumCard({ player }: { player: TopThreeUser }) {
  const cfg = RANK_CONFIG[player.rank as 1 | 2 | 3];
  const isFirst = player.rank === 1;

  return (
    <div
      className={[
        // ── Compact desktop layout ──
        "relative flex flex-col cursor-pointer items-center text-center rounded-[1.5rem] p-3 border-2 transition-all duration-500",
        
        // ── Fixed narrow widths + flex scaling ──
        cfg.scale,
        cfg.podiumOffset,

        // ── Desktop rank styling ──
        "border-border bg-card",
        cfg.border,
        cfg.gradient,

        // ── Subtle hover ──
        "hover:-translate-y-1 hover:scale-[1.01]",

        // ── Top accent ──
        "before:content-[''] before:rounded-t-[1.5rem]",
        cfg.topAccent,
      ].join(" ")}
    >
      {/* ── Rank badge ── */}
      <div
        className={[
          "absolute left-1/2 -translate-x-1/2 -top-5 z-10",
          isFirst ? "animate-bounce [animation-duration:3s]" : "",
        ].join(" ")}
      >
        <img
          src={RANK_IMAGES[player.rank]}
          alt={`Rank ${player.rank}`}
          className={[
            "object-contain",
            cfg.badgeSize,
          ].join(" ")}
        />
      </div>

      {/* ── Avatar ── */}
      <Avatar
        className={[
          "rounded-[1rem] border-2 p-1 mt-8",
          cfg.avatarSize,
          cfg.avatarBorder,
        ].join(" ")}
      >
        <AvatarImage
          src={player.avatar}
          alt={player.username}
          className="rounded-xl object-contain"
        />
        <AvatarFallback className="text-2xl font-black rounded-xl">
          {player.rank}
        </AvatarFallback>
      </Avatar>

      {/* ── Username ── */}
      <p
        className={[
          "font-black uppercase tracking-wider mt-2 mb-3 px-1",
          "text-foreground",
          cfg.nameColor,
        ].join(" ")}
        style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
      >
        {player.username}
      </p>

      {/* ── Score panel ── */}
      <div
        className={[
          "w-full rounded-xl flex flex-col items-center py-2.5 px-4 border mt-auto relative overflow-hidden",
          cfg.innerBg,
        ].join(" ")}
      >
        {/* Subtle shimmer on 1st */}
        {isFirst && cfg.shimmer && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(234,179,8,0.06) 50%, transparent 60%)",
              animation: "shimmer 4s ease-in-out infinite",
            }}
          />
        )}

        <p
          className={[
            "font-black tracking-tight text-green-400 relative z-10",
            cfg.scoreColor,
          ].join(" ")}
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {fmt(player.metric)}
        </p>

        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1 pt-1 border-t border-border/50 w-full text-center relative z-10">
          {player.metricName}
        </p>
      </div>

      {/* Shimmer keyframe */}
      {isFirst && cfg.shimmer && (
        <style>{`
          @keyframes shimmer {
            0%   { transform: translateX(-100%); }
            50%  { transform: translateX(100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [slideIdx, setSlideIdx] = useState(1);
  const [animKey, setAnimKey] = useState(0);
  const [slideDir, setSlideDir] = useState<"left" | "right">("left");
  const [search, setSearch] = useState("");
  const [topThree, setTopThree] = useState<TopThreeUser[]>(TOP_THREE_DEFAULT);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>(LEADERBOARD_TABLE_DATA_DEFAULT);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard data from API
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch('/api/user-dashboard/leaderboard');
        const result = await response.json();
        
        if (result.success) {
          setTopThree(result.data.topThree);
          setLeaderboardData(result.data.leaderboard);
        }
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const goTo = (next: number, dir: "left" | "right") => {
    setSlideDir(dir);
    setSlideIdx(next);
    setAnimKey((k) => k + 1);
  };

  const nextSlide = () => goTo((slideIdx + 1) % topThree.length, "left");
  const prevSlide = () => goTo((slideIdx - 1 + topThree.length) % topThree.length, "right");
  const jumpTo = (i: number) => {
    if (i === slideIdx) return;
    goTo(i, i > slideIdx ? "left" : "right");
  };

  const filtered = useMemo(
    () =>
      leaderboardData.filter(
        (r) =>
          r.username.toLowerCase().includes(search.toLowerCase()) ||
          r.email.toLowerCase().includes(search.toLowerCase())
      ),
    [search, leaderboardData]
  );

  const PODIUM_ORDER = [topThree[1], topThree[0], topThree[2]];
  const active = topThree[slideIdx];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        @keyframes slideInFromRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }

        .slide-enter-left  { animation: slideInFromRight 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        .slide-enter-right { animation: slideInFromLeft  0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
      `}</style>

      <div className="flex h-screen overflow-hidden bg-background">
        <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden text-foreground">
          <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 overflow-y-auto pb-25 p-4 md:p-8">
            {/* Subtle background grid */}
            <div
              className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
              style={{
                backgroundImage:
                  "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
              }}
            />

            <div className="relative z-10 max-w-6xl mx-auto">
              {loading ? (
                <LeaderboardSkeleton />
              ) : (
                <div className="space-y-14">

              {/* ── Page Header ── */}
              <section className="text-center space-y-3 pt-2">
                <div className="flex items-center justify-center gap-4">
                  <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter  leading-none flex items-center gap-4">
                Leaderboard
              </h1>
                </div>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
                <p className="text-[10px] font-black flex justify-center text-muted-foreground uppercase tracking-[0.2em] flex items-center text-center gap-2">
                                 Compare performance & portfolio metrics against the most successful users
                              </p>
              </section>




              {/* ── Mobile Top 3 Slider (Peek Design) ── */}

{/* ── Mobile Top 3 Slider (2nd-1st-3rd Order) ── */}
<section className="relative lg:hidden pb-6 overflow-hidden">
  {/* Section label */}
  <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted-foreground/30 text-center mb-5">
    Top Players This Season
  </p>

  {/* ── Track outer: clips overflow so only 80% + 10% peeks show ── */}
  <div className="w-full overflow-hidden">
    <div
      className="flex transition-transform duration-[420ms] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform"
      style={{
        // 80% per slide, offset by 10% so first card centers
        transform: `translateX(calc(-${slideIdx * 80}% + 10%))`,
      }}
    >
      {[topThree[1], topThree[0], topThree[2]].map((player, i) => {
        const isActive = i === slideIdx;
        const isFirst = player.rank === 1;

        // Rank-specific tokens (NO SHADOWS)
        const rankStyle = {
          1: {
            card:        "border-yellow-500/45 bg-gradient-to-b from-yellow-500/[0.08] via-card to-card",
            topLine:     "via-yellow-500/70",
            avatarBorder:"border-yellow-500/55",
            badgeGlow:   "",
            username:    "text-yellow-300",
            panel:       "bg-yellow-500/[0.07] border-yellow-500/20",
            score:       "text-yellow-300",
          },
          2: {
            card:        "border-slate-400/30 bg-gradient-to-b from-slate-400/[0.05] via-card to-card",
            topLine:     "via-slate-400/45",
            avatarBorder:"border-slate-400/40",
            badgeGlow:   "",
            username:    "text-slate-300",
            panel:       "bg-slate-400/[0.06] border-slate-400/15",
            score:       "text-slate-200",
          },
          3: {
            card:        "border-amber-700/30 bg-gradient-to-b from-amber-800/[0.06] via-card to-card",
            topLine:     "via-amber-600/45",
            avatarBorder:"border-amber-700/40",
            badgeGlow:   "",
            username:    "text-amber-400",
            panel:       "bg-amber-800/[0.07] border-amber-700/16",
            score:       "text-amber-300",
          },
        }[player.rank as 1 | 2 | 3];

        return (
          <div
            key={player.rank}
            // Each slide takes 80% of the track width
            className="flex-[0_0_80%] px-1 transition-all duration-350"
            style={{
              opacity:   isActive ? 1 : 0.45,
              transform: isActive ? "scale(1)" : "scale(0.93)",
            }}
          >
            {/* Card */}
            <div
              className={[
                "relative rounded-[1.25rem] border-[1.5px] overflow-hidden",
                rankStyle.card,
              ].join(" ")}
            >
              {/* Top accent line */}
              <div
                className={[
                  "absolute inset-x-0 top-0 h-[1.5px] rounded-t-[1.25rem]",
                  "bg-gradient-to-r from-transparent to-transparent",
                  rankStyle.topLine,
                ].join(" ")}
              />

              <div className="flex flex-col items-center gap-0 px-5 pt-7 pb-6 text-center relative z-10">
                {/* Rank badge */}
                <img
                  src={RANK_IMAGES[player.rank]}
                  alt={`Rank ${player.rank}`}
                  className={[
                    "object-contain mb-3",
                    isFirst ? "w-14 h-14" : "w-11 h-11",
                    rankStyle.badgeGlow,
                    isFirst ? "animate-[float_3s_ease-in-out_infinite]" : "",
                  ].join(" ")}
                />

                {/* Avatar */}
                <Avatar
                  className={[
                    "rounded-[0.875rem] border-2 p-0.5 mb-4",
                    "w-16 h-16",
                    rankStyle.avatarBorder,
                  ].join(" ")}
                >
                  <AvatarImage
                    src={player.avatar}
                    alt={player.username}
                    className="rounded-[0.75rem] object-cover"
                  />
                  <AvatarFallback
                    className="rounded-[0.75rem] text-xl font-black"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {player.rank}
                  </AvatarFallback>
                </Avatar>

                {/* Username */}
                <p
                  className={["font-black uppercase tracking-[0.1em] mb-4", rankStyle.username].join(" ")}
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.1rem",
                  }}
                >
                  {player.username}
                </p>

                {/* Score panel */}
                <div
                  className={[
                    "w-full rounded-xl border flex flex-col items-center py-3.5 px-5 gap-1.5",
                    rankStyle.panel,
                  ].join(" ")}
                >
                  <p
                    className={["font-black leading-none", rankStyle.score].join(" ")}
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "2rem",
                    }}
                  >
                    {fmt(player.metric)}
                  </p>
                  <p className="text-[8px] font-black uppercase tracking-[0.22em] text-muted-foreground pt-1.5 border-t border-border w-full text-center">
                    {player.metricName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>

  {/* ── Controls: arrow · dots · arrow (always below card) ── */}
  <div className="flex items-center justify-center gap-4 mt-5 px-5">
    {/* Prev arrow */}
    <button
      onClick={prevSlide}
      aria-label="Previous"
      className="w-9 h-9 rounded-[0.625rem] border border-border bg-muted/10 hover:bg-muted/30 hover:border-border/60 active:scale-90 transition-all duration-150 flex items-center justify-center text-muted-foreground hover:text-foreground"
    >
      <ChevronLeft className="w-4 h-4" />
    </button>

    {/* Dots - Rank colored */}
    <div className="flex items-center gap-1.5">
      {[topThree[1], topThree[0], topThree[2]].map((player, i) => {
        const isActive = i === slideIdx;
        const dotColor = {
          1: isActive ? "bg-yellow-400/85"    : "bg-muted-foreground/25",
          2: isActive ? "bg-slate-400/75"     : "bg-muted-foreground/25",
          3: isActive ? "bg-amber-500/80"     : "bg-muted-foreground/25",
        }[player.rank as 1 | 2 | 3];

        return (
          <button
            key={i}
            onClick={() => jumpTo(i)}
            aria-label={`Go to rank ${player.rank}`}
            className={[
              "h-[5px] rounded-full transition-all duration-300",
              isActive ? "w-5" : "w-[5px]",
              dotColor,
            ].join(" ")}
          />
        );
      })}
    </div>

    {/* Next arrow */}
    <button
      onClick={nextSlide}
      aria-label="Next"
      className="w-9 h-9 rounded-[0.625rem] border border-border bg-muted/10 hover:bg-muted/30 hover:border-border/60 active:scale-90 transition-all duration-150 flex items-center justify-center text-muted-foreground hover:text-foreground"
    >
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>

  {/* Float animation for 1st place badge */}
  <style jsx>{`
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-3px); }
    }
  `}</style>
</section>




              {/* ── Desktop Podium: 2 – 1 – 3 ── */}
              <section className="hidden lg:flex items-end mx-auto px-25 justify-center gap-5 pt-10">
                {PODIUM_ORDER.map((player: TopThreeUser) => (
                  <PodiumCard key={player.rank} player={player} />
                ))}
              </section>




              {/* ── Leaderboard Table ── */}
              <section className="bg-card border border-border rounded-[1rem] overflow-hidden">
                <div className="flex items-center justify-between gap-2 p-3 md:p-4 md:gap-4 border-b border-border flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-2xl">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                      Top 10 Traders — 24/7 Update
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-black uppercase tracking-tight">
                    <thead>
                      <tr className="border-b border-border/50">
                        {TABLE_HEADERS.map((h, i) => (
                          <th
                            key={h}
                            className={[
                              "px-6 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap",
                              i <= 1 ? "text-left" : "text-right",
                            ].join(" ")}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y cursor-pointer divide-border/20">
                      {filtered.map((row: LeaderboardUser) => (
                        <tr
                          key={row.rank}
                          className={[
                            "group transition-colors hover:bg-muted/10",
                            row.rank === 1 ? "bg-yellow-500/[0.04]" : "",
                            row.rank === 2 ? "bg-slate-400/[0.03]" : "",
                            row.rank === 3 ? "bg-orange-700/[0.03]" : "",
                          ].join(" ")}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {row.rank <= 3 && (
                                <img src={RANK_IMAGES[row.rank]} alt={`Rank ${row.rank}`} className="w-10 h-10 object-contain drop-shadow" />
                              )}
                              <span
                                className={[
                                  "font-black text-xl leading-none",
                                  row.rank === 1 ? "text-yellow-400" : row.rank === 2 ? "text-slate-400" : row.rank === 3 ? "text-orange-600" : "text-muted-foreground",
                                ].join(" ")}
                                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                              >
                                {row.rank}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12 rounded-xl border border-border/40 p-0.5 flex-shrink-0">
                                <AvatarImage src={row.profileImage} className="rounded-lg" />
                                <AvatarFallback className="text-xs rounded-sm">{row.rank}</AvatarFallback>
                              </Avatar>
                              <span
                                className="font-black text-sm text-foreground group-hover:text-primary transition-colors"
                                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
                              >
                                {row.username}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-right text-muted-foreground text-[10px] tracking-wider">
                            {row.email.substring(0, 5)}{row.email.substring(4, row.email.indexOf('@')).replace(/./g, '.')}@{row.email.substring(row.email.indexOf('@') + 1)}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <Wallet className="w-3.5 h-3.5 text-primary opacity-50" />
                              <span className="text-base text-foreground" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{fmt(row.balance)}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <DollarSign className="w-3.5 h-3.5 text-amber-500 opacity-50" />
                              <span className="text-sm text-amber-500" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>-{fmt(row.totalWithdrawal)}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <Trophy className="w-3.5 h-3.5 text-blue-500 opacity-50" />
                              <span className="text-sm text-blue-400" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{fmt(row.totalProfits)}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <BriefcaseBusiness className="w-3.5 h-3.5 text-green-500 opacity-50" />
                              <span className="text-base text-green-400" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{fmt(row.totalDeposit)}</span>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-16 text-muted-foreground text-xs tracking-widest uppercase">
                            No players found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

                </div>
              )}
            </div>
          </main>
        </div>

        <UserNav />
      </div>
    </>
  );
}