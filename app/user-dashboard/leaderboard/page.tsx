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

function PodiumCard({ player }: { player: TopThreeUser }) {
  const isFirst = player.rank === 1;
  return (
    <div
      className={[
        "relative flex flex-col cursor-pointer items-center text-center rounded-[1.5rem] p-5 px-5 border-2 transition-all duration-300",
        isFirst
          ? "flex-[1.15] border-yellow-500/40 bg-gradient-to-b from-card to-muted/20"
          : "flex-1 border-border bg-card hover:border-primary/20 hover:-translate-y-1",
      ].join(" ")}
    >
      <img
        src={RANK_IMAGES[player.rank]}
        alt={`Rank ${player.rank}`}
        className={[
          "absolute left-1/2 -translate-x-1/2 object-contain drop-shadow-2xl",
          isFirst ? "-top-10 w-25 h-25" : "-top-10 w-20 h-20",
        ].join(" ")}
      />
      <Avatar
        className={[
          "rounded-[1rem] border-2 p-1 mt-10",
          isFirst ? "w-25 h-25 border-yellow-500/40" : "w-20 h-20",
        ].join(" ")}
      >
        <AvatarImage src={player.avatar} alt={player.username} className="rounded-xl object-contain" />
        <AvatarFallback className="text-2xl font-black rounded-xl">{player.rank}</AvatarFallback>
      </Avatar>
      <p
        className={["font-black uppercase tracking-wider mt-4 mb-5", isFirst ? "text-xl text-yellow-300" : "text-base text-foreground"].join(" ")}
        style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
      >
        {player.username}
      </p>
      <div
        className={[
          "w-full rounded-xl flex flex-col items-center py-4 px-6 border mt-auto",
          isFirst
            ? "bg-yellow-500/10 border-yellow-500/20"
            : "bg-muted/30 border-border",
        ].join(" ")}
      >
        <p className={["font-black tracking-tight text-green-400", isFirst ? "text-4xl" : "text-3xl"].join(" ")} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          {fmt(player.metric)}
        </p>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1 pt-1 border-t border-border w-full text-center">
          {player.metricName}
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
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

          <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
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
                                <Trophy className="w-3 h-3 text-primary" />                  
                                 Compare performance & portfolio metrics against the most successful users
                              </p>
              </section>




              {/* ── Mobile Slider ── */}
              <section className="relative flex lg:hidden items-center justify-center pb-12 px-5 mt-8 rounded-[1.5rem] bg-card border border-border overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent rounded-t-[1.5rem]" />

                <button
                  onClick={prevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-muted/20 hover:bg-muted border border-border transition-all z-10"
                >
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-muted/20 hover:bg-muted border border-border transition-all z-10"
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>

                {/* Clipping container — card slides within this */}
                <div className="w-full overflow-hidden">
                  <div
                    key={animKey}
                    className={slideDir === "left" ? "slide-enter-left" : "slide-enter-right"}
                  >
                    <div className="flex flex-col items-center gap-5 text-center w-full max-w-xs mx-auto">
                      <img
                        src={RANK_IMAGES[active.rank]}
                        alt={`Rank ${active.rank}`}
                        className="w-20 h-20 object-contain drop-shadow-xl"
                      />
                      <Avatar className="w-24 h-24 rounded-[1.5rem] border-2 border-yellow-500/30 p-1">
                        <AvatarImage src={active.avatar} alt={active.username} className="rounded-xl object-contain" />
                        <AvatarFallback className="text-2xl font-black rounded-xl">{active.rank}</AvatarFallback>
                      </Avatar>
                      <p
                        className="text-xl font-black uppercase text-yellow-300 tracking-widest"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      >
                        {active.username}
                      </p>
                      <div className="border border-yellow-500/20 bg-yellow-500/[0.05] px-10 py-5 rounded-xl flex flex-col items-center gap-1.5 w-full">
                        <p className="text-3xl font-black text-green-400" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                          {fmt(active.metric)}
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                          {active.metricName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                  {topThree.map((_, i: number) => (
                    <button
                      key={i}
                      onClick={() => jumpTo(i)}
                      className={[
                        "rounded-full transition-all",
                        i === slideIdx ? "w-4 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-muted-foreground/30",
                      ].join(" ")}
                    />
                  ))}
                </div>
              </section>




              {/* ── Desktop Podium: 2 – 1 – 3 ── */}
              <section className="hidden lg:flex items-end mx-auto px-25 justify-center gap-5 pt-10">
                {PODIUM_ORDER.map((player: TopThreeUser) => (
                  <PodiumCard key={player.rank} player={player} />
                ))}
              </section>




              {/* ── Leaderboard Table ── */}
              <section className="bg-card border border-border rounded-[1rem] overflow-hidden">
                <div className="flex items-center justify-between gap-4 p-6 md:p-5 border-b border-border flex-wrap">
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
                                <AvatarImage src={row.profileImage} className="rounded-xl" />
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