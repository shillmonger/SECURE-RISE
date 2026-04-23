"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Target, Users, PiggyBank, Wallet, DollarSign, BriefcaseBusiness } from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// ─── Rank Badge Images ────────────────────────────────────────────────────────

const RANK_IMAGES: Record<number, string> = {
  1: "https://i.postimg.cc/SKV9yRnv/Leaderboard-1.png",
  2: "https://i.postimg.cc/zGF7gJLd/Leaderboard-2.png",
  3: "https://i.postimg.cc/jdV43WPn/Leaderboard-3.png",
};

// ─── Data & Types ─────────────────────────────────────────────────────────────

const TOP_THREE = [
  {
    rank: 1,
    username: "marion_stiedemann",
    avatar: "https://github.com/shadcn.png",
    metric: 1671.57,
    metricName: "Total Portfolio",
  },
  {
    rank: 2,
    username: "shannon_kautzer",
    avatar: "https://github.com/shadcn.png",
    metric: 1450.12,
    metricName: "Total Portfolio",
  },
  {
    rank: 3,
    username: "billy_mraz",
    avatar: "https://github.com/shadcn.png",
    metric: 1210.05,
    metricName: "Total Portfolio",
  },
];

// Desktop podium shows 2 → 1 → 3 order
const PODIUM_ORDER = [TOP_THREE[1], TOP_THREE[0], TOP_THREE[2]];

const LEADERBOARD_TABLE_DATA = [
  { rank: 1,  username: "marion_stiedemann", email: "marion.s@mail.net",        balance: 5671.57, withdrawals: 1200.0, investments: 4471.57 },
  { rank: 2,  username: "shannon_kautzer",   email: "shannon.k@securemail.com", balance: 4850.12, withdrawals:  950.0, investments: 3900.12 },
  { rank: 3,  username: "billy_mraz",        email: "billy.m@inbox.io",         balance: 3910.05, withdrawals:  800.0, investments: 3110.05 },
  { rank: 4,  username: "arthur_grimes",     email: "arthur.g@grimes.net",      balance: 2150.00, withdrawals:  500.0, investments: 1650.00 },
  { rank: 5,  username: "bernadette_mcl",    email: "berna.mcl@mail.co",        balance: 1850.50, withdrawals:  250.0, investments: 1600.50 },
  { rank: 6,  username: "alberta_spencer",   email: "alberta.s@mailbox.us",     balance: 1550.00, withdrawals:    0.0, investments: 1550.00 },
  { rank: 7,  username: "leo_ruecker",       email: "leo.r@fastmail.com",       balance: 1200.75, withdrawals:  100.0, investments: 1100.75 },
  { rank: 8,  username: "eloise_hartman",    email: "eloise.h@netmail.io",      balance:  980.00, withdrawals:   50.0, investments:  930.00 },
  { rank: 9,  username: "clark_voss",        email: "clark.v@vossmail.com",     balance:  810.00, withdrawals:    0.0, investments:  810.00 },
  { rank: 10, username: "diana_pruitt",      email: "diana.p@pmail.net",        balance:  650.25, withdrawals:    0.0, investments:  650.25 },
];

const TABLE_HEADERS = ["Rank", "Player", "Email", "Account Balance", "Total Withdrawals", "Total Investments"];

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

// ─── Podium Card (Desktop) ────────────────────────────────────────────────────

function PodiumCard({ player }: { player: (typeof TOP_THREE)[number] }) {
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
      {/* Rank badge image — floats above card */}
      <img
        src={RANK_IMAGES[player.rank]}
        alt={`Rank ${player.rank}`}
        className={[
          "absolute left-1/2 -translate-x-1/2 object-contain drop-shadow-2xl",
          isFirst
            ? "-top-10 w-25 h-25"
            : "-top-10 w-20 h-20",
        ].join(" ")}
      />

      {/* Avatar */}
      <Avatar
        className={[
          "rounded-[1rem] border-2 p-1 mt-10",
          isFirst
            ? "w-25 h-25 border-yellow-500/40"
            : "w-20 h-20",
        ].join(" ")}
      >
        <AvatarImage src={player.avatar} alt={player.username} className="rounded-xl object-contain" />
        <AvatarFallback className="text-2xl font-black rounded-xl">{player.rank}</AvatarFallback>
      </Avatar>

      {/* Username */}
      <p
        className={[
          "font-black uppercase tracking-wider mt-4 mb-5",
          isFirst ? "text-xl text-yellow-300" : "text-base text-foreground",
        ].join(" ")}
        style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
      >
        {player.username}
      </p>

      {/* Metric box */}
      <div
        className={[
          "w-full rounded-xl flex flex-col items-center py-4 px-6 border mt-auto",
          isFirst
            ? "bg-yellow-500/10 border-yellow-500/20 dark:bg-yellow-500/10 dark:border-yellow-500/20"
            : "bg-muted/30 border-border dark:bg-muted/20 dark:border-border",
        ].join(" ")}
      >
        <p
          className={["font-black tracking-tight text-green-400", isFirst ? "text-4xl" : "text-3xl"].join(" ")}
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
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
  const [search, setSearch] = useState("");

  const nextSlide = () => setSlideIdx((p) => (p + 1) % TOP_THREE.length);
  const prevSlide = () => setSlideIdx((p) => (p - 1 + TOP_THREE.length) % TOP_THREE.length);

  const filtered = useMemo(
    () =>
      LEADERBOARD_TABLE_DATA.filter(
        (r) =>
          r.username.toLowerCase().includes(search.toLowerCase()) ||
          r.email.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const active = TOP_THREE[slideIdx];

  return (
    <>
      {/* Bebas Neue font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');`}</style>

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

            <div className="relative z-10 max-w-6xl mx-auto space-y-14">

              {/* ── Page Header ── */}
              <section className="text-center space-y-3 pt-2">
                <div className="flex items-center justify-center gap-4">
                  <h1
                    className="text-5xl md:text-7xl font-black uppercase leading-none bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-800 bg-clip-text text-transparent"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
                  >
                    Capital Leaderboard
                  </h1>
                </div>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                  Compare performance & portfolio metrics against the most successful users
                </p>
              </section>




              {/* ── Mobile Slider ── */}
              <section className="relative flex lg:hidden items-center justify-center pt-14 pb-12 px-8 mt-8 rounded-[1.5rem] bg-card border border-border overflow-visible">
  {/* subtle gold shimmer top */}
  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent rounded-t-[1.5rem]" />

  {/* Rank image — floats above container top-center */}
  <img
    src={RANK_IMAGES[active.rank]}
    alt={`Rank ${active.rank}`}
    className="absolute -top-12 left-15 -translate-x-1/2 w-25 h-25 object-contain drop-shadow-xl z-10"
  />

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

  <div className="flex flex-col items-center gap-5 text-center w-full max-w-xs">
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
      <p
        className="text-3xl font-black text-green-400"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        {fmt(active.metric)}
      </p>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
        {active.metricName}
      </p>
    </div>
  </div>

  {/* Dots */}
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
    {TOP_THREE.map((_, i) => (
      <button
        key={i}
        onClick={() => setSlideIdx(i)}
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
                {PODIUM_ORDER.map((player) => (
                  <PodiumCard key={player.rank} player={player} />
                ))}
              </section>







              {/* ── Leaderboard Table ── */}
              <section className="bg-card border border-border rounded-[1rem] overflow-hidden">
                {/* Table header bar */}
                <div className="flex items-center justify-between gap-4 p-6 md:p-5 border-b border-border flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-2xl">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                      Player Metrics — Updated Hourly
                    </p>
                  </div>
                </div>

                {/* Table */}
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
                      {filtered.map((row) => (
                        <tr
                          key={row.rank}
                          className={[
                            "group transition-colors hover:bg-muted/10",
                            row.rank === 1 ? "bg-yellow-500/[0.04]" : "",
                            row.rank === 2 ? "bg-slate-400/[0.03]" : "",
                            row.rank === 3 ? "bg-orange-700/[0.03]" : "",
                          ].join(" ")}
                        >
                          {/* Rank */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {row.rank <= 3 ? (
                                <img
                                  src={RANK_IMAGES[row.rank]}
                                  alt={`Rank ${row.rank}`}
                                  className="w-10 h-10 object-contain drop-shadow"
                                />
                              ) : null}
                              <span
                                className={[
                                  "font-black text-xl leading-none",
                                  row.rank === 1
                                    ? "text-yellow-400"
                                    : row.rank === 2
                                    ? "text-slate-400"
                                    : row.rank === 3
                                    ? "text-orange-600"
                                    : "text-muted-foreground",
                                ].join(" ")}
                                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                              >
                                {row.rank}
                              </span>
                            </div>
                          </td>

                          {/* Player */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10 rounded-sm border border-border/40 p-0.5 flex-shrink-0">
                                <AvatarImage
                                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${row.username}`}
                                  className="rounded-lg"
                                />
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

                          {/* Email */}
                          <td className="px-6 py-4 text-right text-muted-foreground text-[10px] tracking-wider">
                            {row.email}
                          </td>

                          {/* Balance */}
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <Wallet className="w-3.5 h-3.5 text-primary opacity-50" />
                              <span
                                className="text-base text-foreground"
                                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                              >
                                {fmt(row.balance)}
                              </span>
                            </div>
                          </td>

                          {/* Withdrawals */}
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <DollarSign className="w-3.5 h-3.5 text-amber-500 opacity-50" />
                              <span
                                className="text-sm text-amber-500"
                                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                              >
                                -{fmt(row.withdrawals)}
                              </span>
                            </div>
                          </td>

                          {/* Investments */}
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <BriefcaseBusiness className="w-3.5 h-3.5 text-green-500 opacity-50" />
                              <span
                                className="text-base text-green-400"
                                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                              >
                                {fmt(row.investments)}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-16 text-muted-foreground text-xs tracking-widest uppercase">
                            No players found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

            </div>
          </main>
        </div>

        <UserNav />
      </div>
    </>
  );
}