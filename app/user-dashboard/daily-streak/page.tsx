"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  Flame,
  Calendar,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Trophy,
  Target,
  TrendingUp,
  Star,
  Coins,
  Lock,
  PartyPopper,
  AlertTriangle,
} from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

// ─── Types ─────────────────────────────────────────────────────────────────
type DayStatus = "completed" | "missed" | "today" | "upcoming";

interface DayEntry {
  day: string;
  date: number;
  status: DayStatus;
  xp: number;
}

interface Week {
  label: string;
  days: DayEntry[];
}

interface MonthData {
  month: string;
  weeks: Week[];
}

// ─── Constants ──────────────────────────────────────────────────────────────
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FULL_DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ─── Build Month ─────────────────────────────────────────────────────────────
function buildMonthData(year: number, monthIndex: number, today: Date): MonthData {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const allDays: DayEntry[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, monthIndex, d);
    const dayOfWeek = date.getDay();
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isToday =
      d === today.getDate() &&
      monthIndex === today.getMonth() &&
      year === today.getFullYear();

    let status: DayStatus;
    if (isToday) status = "today";
    else if (isPast) status = Math.random() > 0.25 ? "completed" : "missed";
    else status = "upcoming";

    allDays.push({ day: DAY_NAMES[dayOfWeek], date: d, status, xp: 100 });
  }

  const weeks: Week[] = [];
  let weekNum = 1;
  let i = 0;
  while (i < allDays.length) {
    weeks.push({ label: `Week ${weekNum}`, days: allDays.slice(i, i + 7) });
    weekNum++;
    i += 7;
  }

  return { month: MONTH_NAMES[monthIndex], weeks };
}

// ─── Status Styles ───────────────────────────────────────────────────────────
const statusConfig: Record<DayStatus, {
  border: string; bg: string; text: string; badge: string; glow: string;
}> = {
  completed: {
    border: "border-green-500/50",
    bg: "bg-green-950/30",
    text: "text-green-400",
    badge: "bg-green-900/70 text-green-300",
    glow: "hover:shadow-green-900/40",
  },
  missed: {
    border: "border-red-500/30",
    bg: "bg-red-950/20",
    text: "text-red-400",
    badge: "bg-red-900/60 text-red-300",
    glow: "hover:shadow-red-900/30",
  },
  today: {
    border: "border-yellow-400/80",
    bg: "bg-yellow-950/20",
    text: "text-yellow-300",
    badge: "bg-yellow-400 text-yellow-950",
    glow: "hover:shadow-yellow-800/40",
  },
  upcoming: {
    border: "border-border/40",
    bg: "bg-muted/5",
    text: "text-muted-foreground",
    badge: "bg-muted/30 text-muted-foreground",
    glow: "",
  },
};

// ─── Day Click Handler ────────────────────────────────────────────────────────
function handleDayClick(day: DayEntry) {
  switch (day.status) {
    case "today":
      toast.success("Successfully Claimed!", {
        description: `You've claimed +100 XP for today (${day.day} ${day.date}). Keep the streak alive!`,
        duration: 4000,
      });
      break;
    case "completed":
      toast.success("Already Claimed", {
        description: `You already claimed +100 XP on ${day.day} ${day.date}. Great consistency!`,
        duration: 3000,
      });
      break;
    case "missed":
      toast.error("Day Missed", {
        description: `You missed your streak on ${day.day} ${day.date}. Don't let it happen again — log in daily!`,
        duration: 4000,
      });
      break;
    case "upcoming":
      toast.info("Not Yet Available", {
        description: `${day.day} ${day.date} hasn't arrived yet. Come back then to claim your +100 XP!`,
        duration: 3000,
      });
      break;
  }
}

// ─── Status Icon ─────────────────────────────────────────────────────────────
function DayIcon({ status }: { status: DayStatus }) {
  if (status === "completed") return <CheckCircle2 className="w-5 h-5 text-green-400" />;
  if (status === "missed") return <XCircle className="w-5 h-5 text-red-400" />;
  if (status === "today") return <Coins className="w-5 h-5 text-yellow-400" />;
  return <Lock className="w-4 h-4 text-muted-foreground/50" />;
}

// ─── Day Card ────────────────────────────────────────────────────────────────
function DayCard({ day }: { day: DayEntry }) {
  const cfg = statusConfig[day.status];
  const badgeLabel =
    day.status === "upcoming" ? "—"
    : day.status === "today" ? "Claim"
    : day.status === "missed" ? "Missed"
    : "+100 XP";

  return (
    <div
      onClick={() => handleDayClick(day)}
      className={`
        cursor-pointer select-none
        flex flex-col items-center justify-between
        rounded-2xl border-2 p-3 gap-1.5
        transition-all duration-200
        hover:scale-[1.06] hover:shadow-lg
        ${cfg.border} ${cfg.bg} ${cfg.glow}
        ${day.status === "today" ? "ring-1 ring-yellow-400/30" : ""}
      `}
    >
      <span className={`text-[9px] font-black uppercase tracking-widest ${cfg.text}`}>
        {day.day}
      </span>
      <div className="my-0.5">
        <DayIcon status={day.status} />
      </div>
      <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full whitespace-nowrap ${cfg.badge}`}>
        {badgeLabel}
      </span>
      <span className={`text-[11px] font-black ${cfg.text}`}>{day.date}</span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
const DailyStreakPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const today = new Date();

  const months: MonthData[] = [0, 1, 2].map((offset) => {
    const d = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    return buildMonthData(d.getFullYear(), d.getMonth(), today);
  });

  const [expandedMonths, setExpandedMonths] = useState<Record<number, boolean>>({
    0: true, 1: false, 2: false,
  });
  // Find which week in month 0 contains today, open that one by default
  const activeWeekIndex = months[0].weeks.findIndex((w) =>
    w.days.some((d) => d.status === "today")
  );
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({
    [`0-${activeWeekIndex >= 0 ? activeWeekIndex : 0}`]: true,
  });

  const toggleMonth = (mi: number) =>
    setExpandedMonths((prev) => ({ ...prev, [mi]: !prev[mi] }));
  const toggleWeek = (mi: number, wi: number) =>
    setExpandedWeeks((prev) => ({ ...prev, [`${mi}-${wi}`]: !prev[`${mi}-${wi}`] }));

  const allDays = months.flatMap((m) => m.weeks.flatMap((w) => w.days));
  const completedCount = allDays.filter((d) => d.status === "completed").length;
  const missedCount = allDays.filter((d) => d.status === "missed").length;
  const totalXP = completedCount * 100;
  const upcomingCount = allDays.filter((d) => d.status === "upcoming" || d.status === "today").length;

  const stats = [
    {
      label: "Total XP Earned",
      value: `${totalXP.toLocaleString()}`,
      unit: "XP",
      icon: <Coins className="w-5 h-5 text-yellow-400" />,
      dark: true,
    },
    {
      label: "Total Completed",
      value: `${completedCount}`,
      unit: "Days",
      icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,
      dark: false,
    },
    {
      label: "Days Missed",
      value: `${missedCount}`,
      unit: "Days",
      icon: <XCircle className="w-5 h-5 text-red-400" />,
      dark: false,
    },
    {
      label: "Ahead to Claim",
      value: `${upcomingCount}`,
      unit: "Days",
      icon: <Target className="w-5 h-5 text-sky-400" />,
      dark: false,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-8">

            {/* ── Title ── */}
            <section className="space-y-1.5">
              <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic leading-none flex items-center gap-3">
                <Flame className="w-8 h-8 text-yellow-400" />
                Daily Streak
              </h1>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <Coins className="w-3 h-3 text-yellow-400" />
                Log in every day to earn 100 XP &mdash; don&apos;t break the chain
              </p>
            </section>

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s, i) => (
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
                  <p className={`text-[9px] font-black uppercase tracking-[0.18em] mb-1 ${s.dark ? "opacity-55" : "text-muted-foreground"}`}>
                    {s.label}
                  </p>
                  <h3 className="text-2xl font-black italic tracking-tighter leading-none">
                    {s.value}
                    <span className={`text-xs ml-1 font-black ${s.dark ? "opacity-50" : "text-muted-foreground"}`}>
                      {s.unit}
                    </span>
                  </h3>
                  <TrendingUp className="absolute -right-3 -bottom-3 w-16 h-16 opacity-[0.04]" />
                </div>
              ))}
            </div>

            {/* ── Today Banner ── */}
            <div className="relative bg-foreground text-background rounded-[1rem] p-5 md:p-6 overflow-hidden">
              {/* decorative coin cluster */}
              <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-15 pointer-events-none">
                <Coins className="w-16 h-16" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-55 mb-1">Today</p>
                  <h3 className="text-xl font-black italic tracking-tighter">
                    {FULL_DAY_NAMES[today.getDay()]},{" "}
                    {today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </h3>
                </div>
                <button
                  onClick={() =>
                    toast.success("🎉 Successfully Claimed!", {
                      description: "You've claimed +100 XP for today. Keep the streak alive!",
                      duration: 4000,
                    })
                  }
                  className="cursor-pointer flex items-center gap-2.5 bg-background/15 hover:bg-background/25 transition-all rounded-xl px-5 py-3 border border-background/20 self-start sm:self-center"
                >
                  <Coins className="w-4 h-4 text-yellow-300" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Claim Today +100 XP</span>
                  <PartyPopper className="w-4 h-4 opacity-70" />
                </button>
              </div>
            </div>

            {/* ── Months ── */}
            <div className="space-y-4">
              {months.map((month, mi) => {
                const monthOpen = expandedMonths[mi];
                const monthDays = month.weeks.flatMap((w) => w.days);
                const monthCompleted = monthDays.filter((d) => d.status === "completed").length;
                const monthTotal = monthDays.length;
                const pct = Math.round((monthCompleted / monthTotal) * 100);

                return (
                  <div key={mi} className="bg-card border border-border rounded-[1rem] overflow-hidden">
                    {/* Month Header */}
                    <button
                      onClick={() => toggleMonth(mi)}
                      className="cursor-pointer w-full flex items-center justify-between p-5 hover:bg-muted/20 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-muted/30 border border-border flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black uppercase italic tracking-tight">{month.month}</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">
                            {monthCompleted}/{monthTotal} days &bull; {(monthCompleted * 100).toLocaleString()} XP
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2">
                          <div className="w-28 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-foreground rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[9px] font-black text-muted-foreground uppercase w-8">
                            {pct}%
                          </span>
                        </div>
                        <div className="w-7 h-7 rounded-lg bg-muted/30 flex items-center justify-center">
                          {monthOpen
                            ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                            : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                          }
                        </div>
                      </div>
                    </button>

                    {/* Weeks */}
                    {monthOpen && (
                      <div className="px-4 pb-4 space-y-2.5">
                        {month.weeks.map((week, wi) => {
                          const weekKey = `${mi}-${wi}`;
                          const weekOpen = expandedWeeks[weekKey];
                          const weekCompleted = week.days.filter((d) => d.status === "completed").length;
                          const hasToday = week.days.some((d) => d.status === "today");

                          return (
                            <div
                              key={wi}
                              className={`
                                border rounded-2xl overflow-hidden transition-all
                                ${hasToday ? "border-yellow-400/30" : "border-border/50"}
                              `}
                            >
                              {/* Week Header */}
                              <button
                                onClick={() => toggleWeek(mi, wi)}
                                className="cursor-pointer w-full flex items-center justify-between px-4 py-3 bg-muted/10 hover:bg-muted/30 transition-all"
                              >
                                <div className="flex items-center gap-2.5">
                                  <Trophy className={`w-3.5 h-3.5 ${hasToday ? "text-yellow-400" : "text-muted-foreground"}`} />
                                  <span className="text-[10px] font-black uppercase tracking-widest">{week.label}</span>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                    ({week.days[0].date}–{week.days[week.days.length - 1].date})
                                  </span>
                                  {hasToday && (
                                    <span className="text-[8px] font-black uppercase tracking-widest bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-400/30">
                                      Current
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2.5">
                                  <div className="flex items-center gap-1">
                                    <Coins className="w-3 h-3 text-yellow-400" />
                                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                      {weekCompleted * 100} XP
                                    </span>
                                  </div>
                                  {weekOpen
                                    ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                                    : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                                  }
                                </div>
                              </button>

                              {/* Days Grid */}
                              {weekOpen && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 p-3">
                                  {week.days.map((day, di) => (
                                    <DayCard key={di} day={day} />
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Legend ── */}
            <div className="bg-card border border-border rounded-[1rem] p-4 md:p-5">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <Star className="w-3 h-3 text-yellow-400" /> Legend
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { status: "completed" as DayStatus, label: "Completed — +100 XP claimed", color: "bg-green-950/40 border-green-500/40 text-green-400" },
                  { status: "today" as DayStatus, label: "Today — Claim your XP now", color: "bg-yellow-950/30 border-yellow-400/60 text-yellow-300" },
                  { status: "missed" as DayStatus, label: "Missed — Streak broken", color: "bg-red-950/30 border-red-500/30 text-red-400" },
                  { status: "upcoming" as DayStatus, label: "Upcoming — Not yet available", color: "bg-muted/10 border-border/40 text-muted-foreground" },
                ].map((item) => (
                  <div key={item.status} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest ${item.color}`}>
                    <DayIcon status={item.status} />
                    <span>{item.label}</span>
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