"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Lock,
  Trophy,
  Activity,
  Zap,
  Target,
  Clock,
  ChevronDown,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Star,
  Flame,
  BarChart3,
  X,
  AlertCircle,
  Crown,
  Medal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TradingPair {
  symbol: string;
  tvSymbol: string;
  name: string;
  type: "crypto" | "forex" | "index";
  baseFlag?: string;
  quoteFlag?: string;
  coinId?: string;
}

interface PredictionSummary {
  pair: string;
  direction: "BUY" | "SELL";
  entryPrice: string;
  submissionTime: string;
  status: "pending" | "won" | "lost";
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  xp: number;
  winRate: number;
  avatar: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SUPPORTED_PAIRS: TradingPair[] = [
  { symbol: "XAUUSD", tvSymbol: "OANDA:XAUUSD", name: "Gold vs USD", type: "forex", baseFlag: "us", quoteFlag: "us" },
  { symbol: "BTCUSDT", tvSymbol: "BINANCE:BTCUSDT", name: "Bitcoin / USDT", type: "crypto", coinId: "bitcoin" },
  { symbol: "ETHUSDT", tvSymbol: "BINANCE:ETHUSDT", name: "Ethereum / USDT", type: "crypto", coinId: "ethereum" },
  { symbol: "SOLUSDT", tvSymbol: "BINANCE:SOLUSDT", name: "Solana / USDT", type: "crypto", coinId: "solana" },
  { symbol: "XRPUSDT", tvSymbol: "BINANCE:XRPUSDT", name: "Ripple / USDT", type: "crypto", coinId: "ripple" },
  { symbol: "EURUSD", tvSymbol: "OANDA:EURUSD", name: "Euro vs USD", type: "forex", baseFlag: "eu", quoteFlag: "us" },
  { symbol: "GBPUSD", tvSymbol: "OANDA:GBPUSD", name: "GBP vs USD", type: "forex", baseFlag: "gb", quoteFlag: "us" },
  { symbol: "USDJPY", tvSymbol: "OANDA:USDJPY", name: "USD vs Yen", type: "forex", baseFlag: "us", quoteFlag: "jp" },
  { symbol: "NAS100", tvSymbol: "OANDA:NAS100USD", name: "Nasdaq 100", type: "index" },
  { symbol: "US30", tvSymbol: "OANDA:US30USD", name: "Dow Jones 30", type: "index" },
];

const MOCK_LEADERBOARD_TODAY: LeaderboardEntry[] = [
  { rank: 1, username: "CryptoKing", xp: 12400, winRate: 87, avatar: "CK" },
  { rank: 2, username: "GoldTrader", xp: 10200, winRate: 82, avatar: "GT" },
  { rank: 3, username: "BullRider", xp: 9800, winRate: 79, avatar: "BR" },
  { rank: 4, username: "PipHunter", xp: 8400, winRate: 75, avatar: "PH" },
  { rank: 5, username: "SolanaMax", xp: 7600, winRate: 71, avatar: "SM" },
];

const MOCK_LEADERBOARD_WEEK: LeaderboardEntry[] = [
  { rank: 1, username: "AlphaWolf", xp: 58000, winRate: 91, avatar: "AW" },
  { rank: 2, username: "QuantEdge", xp: 51000, winRate: 85, avatar: "QE" },
  { rank: 3, username: "CryptoKing", xp: 47000, winRate: 83, avatar: "CK" },
  { rank: 4, username: "ForexFox", xp: 43200, winRate: 78, avatar: "FF" },
  { rank: 5, username: "GoldTrader", xp: 39800, winRate: 74, avatar: "GT" },
];

const MOCK_LEADERBOARD_ALL: LeaderboardEntry[] = [
  { rank: 1, username: "AlphaWolf", xp: 284000, winRate: 89, avatar: "AW" },
  { rank: 2, username: "QuantEdge", xp: 247000, winRate: 86, avatar: "QE" },
  { rank: 3, username: "PipMaster", xp: 218000, winRate: 82, avatar: "PM" },
  { rank: 4, username: "CryptoKing", xp: 196000, winRate: 80, avatar: "CK" },
  { rank: 5, username: "GoldTrader", xp: 178000, winRate: 77, avatar: "GT" },
];

// ─── Countdown Timer ──────────────────────────────────────────────────────────

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = Math.max(0, midnight.getTime() - now.getTime());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-1.5">
      {[timeLeft.h, timeLeft.m, timeLeft.s].map((val, i) => (
        <React.Fragment key={i}>
          <div className="bg-muted rounded-lg px-2 py-1 text-center min-w-[2.2rem]">
            <span className="text-sm font-black tracking-tighter text-foreground">{pad(val)}</span>
          </div>
          {i < 2 && <span className="text-muted-foreground font-black text-xs">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── TradingView Chart ────────────────────────────────────────────────────────

function TradingViewChart({ tvSymbol }: { tvSymbol: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const containerId = "tv-chart-container";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if ((window as any).TradingView && containerRef.current) {
        containerRef.current.innerHTML = "";
        widgetRef.current = new (window as any).TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "transparent",
          enable_publishing: false,
          allow_symbol_change: false,
          container_id: containerId,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          backgroundColor: "rgba(0,0,0,0)",
          gridColor: "rgba(255,255,255,0.04)",
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [tvSymbol]);

  return (
    <div
      id="tv-chart-container"
      ref={containerRef}
      className="w-full h-full min-h-[420px] rounded-2xl overflow-hidden"
    />
  );
}

// ─── Pair Search ──────────────────────────────────────────────────────────────

function PairSearch({
  selected,
  onSelect,
}: {
  selected: TradingPair;
  onSelect: (pair: TradingPair) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = SUPPORTED_PAIRS.filter(
    (p) =>
      p.symbol.toLowerCase().includes(query.toLowerCase()) ||
      p.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const typeBadge = (type: string) => {
    const map: Record<string, string> = {
      crypto: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      forex: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      index: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    };
    return map[type] || "";
  };

  return (
    <div ref={ref} className="relative">
      <div
        className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 cursor-pointer hover:border-primary/50 transition-colors min-w-[200px]"
        onClick={() => setOpen((v) => !v)}
      >
        <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        <span className="text-xs font-black uppercase tracking-widest">
          {selected.symbol}
        </span>
        <span className="text-[10px] text-muted-foreground font-medium truncate flex-1">
          {selected.name}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </div>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 w-72 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pairs..."
                className="bg-transparent text-xs font-medium text-foreground placeholder:text-muted-foreground outline-none flex-1"
              />
              {query && (
                <button onClick={() => setQuery("")}>
                  <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.map((pair) => (
              <div
                key={pair.symbol}
                onClick={() => { onSelect(pair); setOpen(false); setQuery(""); }}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors ${selected.symbol === pair.symbol ? "bg-primary/5" : ""}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-tighter">{pair.symbol}</span>
                    {selected.symbol === pair.symbol && (
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{pair.name}</span>
                </div>
                <span className={`px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-tighter ${typeBadge(pair.type)}`}>
                  {pair.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── User Stats Card ──────────────────────────────────────────────────────────

function UserStatsCard() {
  const stats = [
    { label: "Current XP", value: "4,200", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { label: "Streak", value: "7 Days", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Predictions", value: "34", icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Win Rate", value: "71%", icon: BarChart3, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Correct", value: "24", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Incorrect", value: "10", icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  return (
    <section className="bg-card border border-border rounded-3xl p-5 lg:p-6">
      <h2 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4 text-primary" /> Your Statistics
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="bg-muted/30 rounded-2xl p-3 border border-border/50">
            <div className={`${s.bg} w-7 h-7 rounded-lg flex items-center justify-center mb-2`}>
              <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
            </div>
            <p className="text-base font-black tracking-tighter">{s.value}</p>
            <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Confirmation Dialog ──────────────────────────────────────────────────────

function ConfirmDialog({
  direction,
  pair,
  onConfirm,
  onCancel,
}: {
  direction: "BUY" | "SELL";
  pair: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-card border border-border rounded-3xl p-6 max-w-sm w-full shadow-2xl">
        <div className={`w-12 h-12 rounded-2xl ${direction === "BUY" ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"} flex items-center justify-center mb-4`}>
          <AlertCircle className={`w-6 h-6 ${direction === "BUY" ? "text-green-500" : "text-red-500"}`} />
        </div>
        <h3 className="text-sm font-black uppercase tracking-tighter mb-1">Confirm Prediction</h3>
        <p className="text-[10px] text-muted-foreground font-medium leading-relaxed mb-5">
          You only get <span className="text-foreground font-bold">ONE prediction today</span>. After submitting, you cannot predict another pair until tomorrow. Continue?
        </p>
        <div className="bg-muted/30 rounded-xl p-3 mb-5 border border-border/50">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Pair</span>
            <span className="text-xs font-black">{pair}</span>
          </div>
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Direction</span>
            <span className={`text-xs font-black ${direction === "BUY" ? "text-green-500" : "text-red-500"}`}>{direction}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 border border-border py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${direction === "BUY" ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-500 text-white hover:bg-red-600"}`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MarketOraclePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPair, setSelectedPair] = useState<TradingPair>(SUPPORTED_PAIRS[0]);
  const [direction, setDirection] = useState<"BUY" | "SELL" | null>(null);
  const [entryPrice, setEntryPrice] = useState("2345.67");
  const [confidence, setConfidence] = useState<"Low" | "Medium" | "High">("Medium");
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [prediction, setPrediction] = useState<PredictionSummary | null>(null);
  const [livePrice, setLivePrice] = useState(2345.67);

  // Simulate live price ticks
  useEffect(() => {
    const id = setInterval(() => {
      setLivePrice((p) => parseFloat((p + (Math.random() - 0.5) * p * 0.0008).toFixed(2)));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  // Auto-fill entry price when pair changes
  useEffect(() => {
    setEntryPrice(livePrice.toFixed(2));
  }, [selectedPair]);

  const handleSubmit = () => {
    if (!direction) return;
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    const now = new Date();
    setPrediction({
      pair: selectedPair.symbol,
      direction: direction!,
      entryPrice,
      submissionTime: now.toLocaleTimeString(),
      status: "pending",
    });
    setSubmitted(true);
  };

  const canSubmit = !submitted && direction !== null && entryPrice.trim() !== "";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Page Header */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-xl md:text-3xl font-black uppercase tracking-tighter leading-none flex items-center gap-3">
                  {/* <Star className="w-6 h-6 text-primary" /> */}
                  Market Oracle
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  Predict. Earn. Dominate — One call per day.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Resets in</span>
                <CountdownTimer />
              </div>
            </section>

            {/* Main Split Layout */}
            <div className="flex flex-col lg:flex-row gap-6 items-start mb-15">

              {/* ── Left: Chart ──────────────────────────────────── */}
              <div className="flex-1 lg:w-3/4 space-y-4">

                {/* Pair Toolbar */}
                <div className="bg-card border border-border rounded-2xl px-4 py-3 flex flex-wrap items-center gap-3">
                  <PairSearch selected={selectedPair} onSelect={setSelectedPair} />

                  <div className="h-6 w-px bg-border hidden sm:block" />

                  {/* Live Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price</span>
                    <span className="text-sm font-black tracking-tighter text-foreground">
                      {livePrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="h-6 w-px bg-border hidden sm:block" />

                  {/* Market Status */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Market Open</span>
                  </div>

                  {/* Type Badge */}
                  <div className="ml-auto">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border ${selectedPair.type === "crypto" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" : selectedPair.type === "index" ? "bg-purple-500/10 text-purple-500 border-purple-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"}`}>
                      {selectedPair.type}
                    </span>
                  </div>
                </div>

                {/* TradingView Chart */}
                <div className="bg-card border border-border rounded-3xl overflow-hidden" style={{ height: 510 }}>
                  <TradingViewChart tvSymbol={selectedPair.tvSymbol} />
                </div>
              </div>




              {/* ── Right: Prediction Panel ───────────────────────── */}
              <div className="w-full lg:w-80 lg:sticky lg:top-4 space-y-4">
                <div className={`bg-card border rounded-3xl p-5 transition-all ${submitted ? "border-primary/40" : "border-border"}`}>

                  {/* Panel Title */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" /> Today's Prediction
                    </h2>
                    {submitted && (
                      <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 rounded-lg px-2 py-1">
                        <Lock className="w-3 h-3 text-green-500" />
                        <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Locked</span>
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center bg-muted/30 rounded-lg px-3 py-2 border border-border/50">
                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Pair</span>
                      <span className="text-xs font-black">{selectedPair.symbol}</span>
                    </div>
                    <div className="flex justify-between items-center bg-muted/30 rounded-lg px-3 py-2 border border-border/50">
                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Price</span>
                      <span className="text-xs font-black">{livePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-primary/5 rounded-lg px-3 py-2 border border-primary/20">
                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Reward</span>
                      <span className="text-xs font-black text-primary flex items-center gap-1">
                        <Zap className="w-3 h-3" /> +1000 XP
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-muted/30 rounded-xl px-3 py-2 border border-border/50">
                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Closes in</span>
                      <CountdownTimer />
                    </div>
                  </div>

                  {/* Prediction Submitted Summary */}
                  {submitted && prediction ? (
                    <div className="space-y-3">
                      <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-4 text-center">
                        <Lock className="w-6 h-6 text-green-500 mx-auto mb-2" />
                        <p className="text-xs font-black uppercase tracking-widest text-green-500 mb-3">Prediction Locked</p>
                        <div className="space-y-1.5 text-left">
                          {[
                            ["Pair", prediction.pair],
                            ["Direction", prediction.direction],
                            ["Entry Price", `$${prediction.entryPrice}`],
                            ["Submitted", prediction.submissionTime],
                            ["Status", "Waiting for Market Close"],
                          ].map(([label, val]) => (
                            <div key={label} className="flex justify-between">
                              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{label}</span>
                              <span className={`text-[10px] font-black ${label === "Direction" ? (prediction.direction === "BUY" ? "text-green-500" : "text-red-500") : label === "Status" ? "text-yellow-500" : ""}`}>{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Prediction Form */
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Make Your Prediction</p>

                      {/* BUY / SELL */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => !submitted && setDirection("BUY")}
                          disabled={submitted}
                          className={`flex flex-col items-center gap-1.5 py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-tighter transition-all hover:scale-[1.02] active:scale-[0.98] ${direction === "BUY" ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20" : "bg-green-500/5 border-green-500/20 text-green-500 hover:border-green-500/60"} ${submitted ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <TrendingUp className="w-5 h-5" />
                          BUY
                        </button>
                        <button
                          onClick={() => !submitted && setDirection("SELL")}
                          disabled={submitted}
                          className={`flex flex-col items-center gap-1.5 py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-tighter transition-all hover:scale-[1.02] active:scale-[0.98] ${direction === "SELL" ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20" : "bg-red-500/5 border-red-500/20 text-red-500 hover:border-red-500/60"} ${submitted ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <TrendingDown className="w-5 h-5" />
                          SELL
                        </button>
                      </div>

                      {/* Entry Price */}
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Entry Price</label>
                        <input
                          type="number"
                          step="0.01"
                          value={entryPrice}
                          onChange={(e) => !submitted && setEntryPrice(e.target.value)}
                          disabled={submitted}
                          placeholder="e.g. 2345.67"
                          className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2.5 text-sm font-black text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors disabled:opacity-50"
                        />
                      </div>

                      {/* Confidence */}
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Confidence</label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              disabled={submitted}
                              className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2.5 text-xs font-black text-foreground outline-none focus:border-primary transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-between"
                            >
                              <span>{confidence} Confidence</span>
                              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-full">
                            <DropdownMenuItem
                              onClick={() => !submitted && setConfidence("Low")}
                              disabled={submitted}
                              className={confidence === "Low" ? "bg-muted" : ""}
                            >
                              Low Confidence
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => !submitted && setConfidence("Medium")}
                              disabled={submitted}
                              className={confidence === "Medium" ? "bg-muted" : ""}
                            >
                              Medium Confidence
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => !submitted && setConfidence("High")}
                              disabled={submitted}
                              className={confidence === "High" ? "bg-muted" : ""}
                            >
                              High Confidence
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Submit */}
                      <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="w-full py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      >
                        Submit Prediction
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>









            {/* Bottom: Prediction Rules + Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-border">
              {/* Prediction Rules Card */}
              <section className="bg-card border border-border rounded-3xl p-6">
                <h2 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Prediction Rules
                </h2>
                <ul className="space-y-2">
                  {[
                    "Only one prediction per day.",
                    "Prediction cannot be edited after submission.",
                    "Rewards are processed automatically at 12:00 AM.",
                    "Correct prediction earns +1000 XP.",
                    "Incorrect prediction earns no XP.",
                    "Market close price determines the result.",
                  ].map((rule, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span className="text-[10px] text-muted-foreground font-medium leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <UserStatsCard />
            </div>

          </div>
        </main>
      </div>

      {/* Mobile Nav */}
      <UserNav />

      {/* Confirm Dialog */}
      {showConfirm && direction && (
        <ConfirmDialog
          direction={direction}
          pair={selectedPair.symbol}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}