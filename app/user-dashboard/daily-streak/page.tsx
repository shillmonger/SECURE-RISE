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
} from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

// ─── Types ─────────────────────────────────────────────────────────────────
type DayStatus = "completed" | "missed" | "today" | "upcoming";

interface UserXPData {
  totalXP: number;
  dailyClaims: { date: string; claimed: boolean; xp: number }[];
  currentStreak: number;
  longestStreak: number;
}

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
  year: number;
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
function buildMonthData(year: number, monthIndex: number, today: Date, userClaims: { date: string; claimed: boolean }[] = []): MonthData {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const allDays: DayEntry[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, monthIndex, d);
    const dayOfWeek = date.getDay();
    const dateString = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isToday =
      d === today.getDate() &&
      monthIndex === today.getMonth() &&
      year === today.getFullYear();

    let status: DayStatus;
    const claim = userClaims.find(c => c.date === dateString);
    
    if (claim && claim.claimed) {
      status = "completed";
    } else if (isToday) {
      status = "today";
    } else if (isPast) {
      status = "missed";
    } else {
      status = "upcoming";
    }

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

  return { month: MONTH_NAMES[monthIndex], year, weeks };
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
function handleDayClick(day: DayEntry, claimFunction: (date: string) => Promise<void>, claiming: boolean) {
  const date = new Date();
  const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`;
  
  switch (day.status) {
    case "today":
      if (!claiming) {
        claimFunction(dateString);
      }
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
function DayCard({ day, onClaim, claiming }: { day: DayEntry; onClaim: (date: string) => Promise<void>; claiming: boolean }) {
  const cfg = statusConfig[day.status];
  const badgeLabel =
    day.status === "upcoming" ? "—"
    : day.status === "today" ? (claiming ? "Claiming..." : "Claim")
    : day.status === "missed" ? "Missed"
    : "+100 XP";

  return (
    <div
      onClick={() => handleDayClick(day, onClaim, claiming)}
      className={`
        cursor-pointer select-none
        flex flex-col items-center justify-between
        rounded-2xl border-2 p-3 gap-1.5
        transition-all duration-200
        hover:scale-[1.06] hover:shadow-lg
        ${cfg.border} ${cfg.bg} ${cfg.glow}
        ${day.status === "today" ? "ring-1 ring-yellow-400/30" : ""}
        ${claiming && day.status === "today" ? "opacity-50 cursor-not-allowed" : ""}
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
  const [userXP, setUserXP] = useState<UserXPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);
  const today = new Date();

  // Fetch user XP data
  useEffect(() => {
    fetchUserXP();
  }, []);

  const fetchUserXP = async () => {
    try {
      const response = await fetch('/api/user/xp');
      const data = await response.json();
      
      if (data.success) {
        setUserXP({
          totalXP: data.userXP.totalXP,
          dailyClaims: data.userXP.dailyClaims,
          currentStreak: data.userXP.currentStreak,
          longestStreak: data.userXP.longestStreak
        });
      }
    } catch (error) {
      console.error('Error fetching user XP:', error);
      toast.error('Failed to load XP data');
    } finally {
      setLoading(false);
    }
  };

  const claimDailyXP = async (date: string) => {
    if (claiming) return;
    
    setClaiming(true);
    try {
      const response = await fetch('/api/user/xp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        await fetchUserXP(); // Refresh data
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error claiming XP:', error);
      toast.error('Failed to claim XP');
    } finally {
      setClaiming(false);
    }
  };

  // Build month data with offset for navigation
  const getMonthData = (offset: number = 0) => {
    const targetDate = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    return buildMonthData(
      targetDate.getFullYear(), 
      targetDate.getMonth(), 
      today, 
      userXP?.dailyClaims || []
    );
  };

  const currentMonthData = getMonthData(currentMonthOffset);
  const isCurrentMonth = currentMonthOffset === 0;
  const isPastMonth = currentMonthOffset < 0;
  const isFutureMonth = currentMonthOffset > 0;

  const allDays = currentMonthData.weeks.flatMap((w) => w.days);
  const completedCount = allDays.filter((d) => d.status === "completed").length;
  const missedCount = allDays.filter((d) => d.status === "missed").length;
  const totalXP = userXP?.totalXP || 0;
  const upcomingCount = allDays.filter((d) => d.status === "upcoming" || d.status === "today").length;

  // Check if current month is fully completed to auto-navigate
  useEffect(() => {
    if (isCurrentMonth && completedCount === allDays.length && allDays.length > 0) {
      // Current month is completed, show next month
      setCurrentMonthOffset(1);
    }
  }, [completedCount, allDays.length, isCurrentMonth]);

  const stats = [
    {
      label: "Total XP Earned",
      value: `${totalXP.toLocaleString()}`,
      unit: "XP",
      icon: <Coins className="w-5 h-5 text-yellow-400" />,
      dark: true,
    },
    {
      label: "Current Streak",
      value: `${userXP?.currentStreak || 0}`,
      unit: "Days",
      icon: <Flame className="w-5 h-5 text-orange-400" />,
      dark: false,
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

        <main className="flex-1 overflow-y-auto pb-25 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-10 lg:space-y-10">



            {/* ── Title ── */}
            <section className="space-y-1.5">
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter  leading-none flex items-center gap-3">
                {/* <Flame className="w-8 h-8 text-yellow-400" /> */}
                Daily Streak
              </h1>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <Coins className="w-3 h-3 text-yellow-400" />
                Log in every day to earn 100 XP &mdash; don&apos;t break the chain
              </p>
            </section>




            {/* ── Stats ── */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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



            {/* ── Today Banner ── */}
            <div className="relative bg-foreground text-background rounded-[1rem] p-5 md:p-6 overflow-hidden">
              {/* decorative coin cluster */}
              <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-15 pointer-events-none">
                <Coins className="w-16 h-16" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-55 mb-1">Today</p>
                  <h3 className="text-xl font-black  tracking-tighter">
                    {FULL_DAY_NAMES[today.getDay()]},{" "}
                    {today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </h3>
                  {userXP && (
                    <p className="text-sm font-black mt-1 opacity-75">
                      Current Streak: {userXP.currentStreak} days | Longest: {userXP.longestStreak} days
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                    claimDailyXP(dateString);
                  }}
                  disabled={claiming}
                  className="w-full lg:w-auto flex justify-center cursor-pointer flex items-center gap-2.5 bg-background/25 transition-all rounded-xl px-5 py-3 border border-background/20 self-start sm:self-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Coins className="w-4 h-4 text-yellow-300" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {claiming ? "Claiming..." : "Claim Today +100 XP"}
                  </span>
                </button>
              </div>
            </div>



            {/* ── Month Navigation ── */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentMonthOffset(Math.max(-1, currentMonthOffset - 1))}
                disabled={currentMonthOffset <= -1}
                className="p-2 rounded-lg border cursor-pointer border-border bg-card hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-muted/30 border border-border flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase  tracking-tight">
                    {currentMonthData.month} {currentMonthData.year}
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">
                    {completedCount}/{allDays.length} days completed
                    {isCurrentMonth && " • Current"}
                    {isPastMonth && " • Past"}
                    {isFutureMonth && " • Future"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCurrentMonthOffset(currentMonthOffset + 1)}
                className="p-2 rounded-lg cursor-pointer border border-border bg-card hover:bg-muted transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>



            {/* ── Month Content ── */}
            <div className="space-y-6">
              {/* Weeks - All displayed inline with dividers */}
              <div className="space-y-6">
                {currentMonthData.weeks.map((week, wi) => {
                  const weekCompleted = week.days.filter((d) => d.status === "completed").length;
                  const hasToday = week.days.some((d) => d.status === "today");

                  return (
                    <div key={wi}>
                      {/* Week Header */}
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
                        <div className="flex items-center gap-2.5">
                          <Trophy className={`w-4 h-4 ${hasToday ? "text-yellow-400" : "text-muted-foreground"}`} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{week.label}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            ({week.days[0].date}–{week.days[week.days.length - 1].date})
                          </span>
                          {hasToday && (
                            <span className="text-[8px] font-black uppercase tracking-widest bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-400/30">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Coins className="w-5 h-5 text-yellow-400" />
                          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                            {weekCompleted * 100} XP
                          </span>
                        </div>
                      </div>

                      {/* Days Grid */}
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 mb-6">
                        {week.days.map((day, di) => (
                          <DayCard 
                            key={di} 
                            day={day} 
                            onClaim={claimDailyXP}
                            claiming={claiming}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
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
