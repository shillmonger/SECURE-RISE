"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  RefreshCw,
  Users,
  DollarSign,
  ArrowDownCircle,
  Gift,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Activity,
  Zap,
  ChevronDown,
} from "lucide-react";
import { toast, Toaster } from "sonner";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";
import { useAdminAlerts } from "@/contexts/AdminAlertContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlatformStats {
  totalUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalGiftCards: number;
  totalInvestments: number;
  totalKYC: number;
}

interface AlertEvent {
  id: string;
  type: string;
  emoji: string;
  label: string;
  detail: string;
  timestamp: Date;
}

interface EventConfig {
  key: string;
  label: string;
  emoji: string;
  enabled: boolean;
  sound: string;
  apiKey: string;
  countKey: keyof PlatformStats;
}

// ─── Sound Engine ─────────────────────────────────────────────────────────────
const SOUNDS: Record<string, () => void> = {
  "Notification Bell": () => playTone([880, 1100, 880], [0.12, 0.08, 0.1]),
  "Cash Register": () => playTone([1200, 1600, 1400, 1800], [0.06, 0.06, 0.06, 0.1]),
  "Soft Ping": () => playTone([1000], [0.25]),
  "Double Beep": () => { playTone([800], [0.08]); setTimeout(() => playTone([800], [0.08]), 180); },
  "Alert Chime": () => playTone([523, 659, 784, 1047], [0.1, 0.1, 0.1, 0.2]),
  "Low Buzz": () => playTone([300, 250], [0.15, 0.15]),
  "Success Tone": () => playTone([523, 784, 1047], [0.1, 0.1, 0.2]),
};

const SOUND_OPTIONS = Object.keys(SOUNDS);

let audioCtx: AudioContext | null = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return audioCtx;
}

function playTone(freqs: number[], durations: number[], volume = 0.4) {
  try {
    const ctx = getAudioCtx();
    let t = ctx.currentTime;
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + durations[i]);
      osc.start(t);
      osc.stop(t + durations[i]);
      t += durations[i] * 0.9;
    });
  } catch (_) {}
}

// ─── Default event configs ─────────────────────────────────────────────────────
const DEFAULT_EVENTS: EventConfig[] = [
  { key: "deposits",    label: "New Deposit",          emoji: "💰", enabled: true, sound: "Cash Register",    apiKey: "totalDeposits",    countKey: "totalDeposits" },
  { key: "withdrawals", label: "New Withdrawal",        emoji: "📤", enabled: true, sound: "Alert Chime",      apiKey: "totalWithdrawals", countKey: "totalWithdrawals" },
  { key: "users",       label: "New User Registration", emoji: "👤", enabled: true, sound: "Notification Bell", apiKey: "totalUsers",       countKey: "totalUsers" },
  { key: "kyc",         label: "New KYC Submission",    emoji: "🛡️", enabled: true, sound: "Soft Ping",        apiKey: "totalKYC",         countKey: "totalKYC" },
  { key: "investments", label: "New Investment",        emoji: "📈", enabled: true, sound: "Success Tone",     apiKey: "totalInvestments", countKey: "totalInvestments" },
  { key: "giftcards",   label: "New Gift Card",         emoji: "🎁", enabled: true, sound: "Double Beep",      apiKey: "totalGiftCards",   countKey: "totalGiftCards" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminNotificationCenterPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [openSoundDropdowns, setOpenSoundDropdowns] = useState<Record<string, boolean>>({});
  const [globalDropdownOpen, setGlobalDropdownOpen] = useState(false);
  const [intervalDropdownOpen, setIntervalDropdownOpen] = useState(false);
  const [globalSound, setGlobalSound] = useState("Notification Bell");

  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Use the global alert context
  const {
    stats,
    alerts,
    muted,
    setMuted,
    volume,
    setVolume,
    pollingInterval,
    setPollingInterval,
    events,
    setEvents,
    desktopNotifs,
    setDesktopNotifs,
    clearAlerts,
  } = useAdminAlerts();

  // ─── Manual refresh ─────────────────────────────────────────────────────────────
  const handleManualRefresh = () => {
    setLastRefresh(new Date());
    toast.success('Refreshed successfully');
  };

  const testSound = (soundName?: string) => {
    if (muted) { toast.info("Unmute to test sound"); return; }
    const fn = SOUNDS[soundName ?? globalSound] ?? SOUNDS["Notification Bell"];
    fn();
    toast.success('Sound test played');
  };

  const toggleEvent = (key: string) => {
    const updated = events.map((e) => e.key === key ? { ...e, enabled: !e.enabled } : e);
    setEvents(updated);
    const event = updated.find(e => e.key === key);
    if (event) {
      toast.success(`${event.label} ${event.enabled ? 'disabled' : 'enabled'}`);
    }
  };

  const setEventSound = (key: string, sound: string) => {
    const updated = events.map((e) => e.key === key ? { ...e, sound } : e);
    setEvents(updated);
    setOpenSoundDropdowns({});
    toast.success(`Sound updated to ${sound}`);
  };

  const requestDesktopPerms = async (checked: boolean) => {
    console.log('[Alerts Page] requestDesktopPerms called with:', checked);
    if (checked && "Notification" in window) {
      const perm = await Notification.requestPermission();
      console.log('[Alerts Page] Notification permission:', perm);
      const granted = perm === "granted";
      setDesktopNotifs(granted);
      if (granted) {
        toast.success('Desktop notifications enabled');
      } else {
        toast.error("Desktop notifications blocked by browser");
      }
    } else {
      setDesktopNotifs(false);
      toast.success('Desktop notifications disabled');
    }
  };

  // ─── Countdown ticker ─────────────────────────────────────────────────────────
  useEffect(() => {
    setCountdown(pollingInterval);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => (c <= 1 ? pollingInterval : c - 1));
    }, 1000);
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [pollingInterval]);

  // ─── Stats config ─────────────────────────────────────────────────────────
  const statCards = [
    { label: "Total Users",       value: stats?.totalUsers ?? 0,       icon: Users,          color: "text-blue-500",    bg: "bg-blue-500/10" },
    { label: "Total Deposits",    value: stats?.totalDeposits ?? 0,    icon: DollarSign,     color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Total Withdrawals", value: stats?.totalWithdrawals ?? 0, icon: ArrowDownCircle,color: "text-rose-500",    bg: "bg-rose-500/10" },
    { label: "Total Gift Cards",  value: stats?.totalGiftCards ?? 0,   icon: Gift,           color: "text-purple-500",  bg: "bg-purple-500/10" },
    { label: "Total Investments", value: stats?.totalInvestments ?? 0, icon: TrendingUp,     color: "text-amber-500",   bg: "bg-amber-500/10" },
    { label: "Total KYC",         value: stats?.totalKYC ?? 0,         icon: ShieldCheck,    color: "text-cyan-500",    bg: "bg-cyan-500/10" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <Toaster position="top-center" richColors />
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">
                  Live Api Alertd Center
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-1">
                  <Activity className="w-3 h-3 text-primary" />
                  Monitor live platform events and receive audio alerts for new activity
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Live indicator */}
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                    Live · {countdown}s
                  </span>
                </div>

                {/* Manual refresh */}
                <button
                  onClick={handleManualRefresh}
                  disabled={refreshing}
                  className="p-2.5 bg-muted/30 border-2 border-border rounded-xl text-muted-foreground hover:border-foreground/40 transition-all disabled:opacity-50 cursor-pointer"
                  title="Refresh now"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                </button>

                {/* Mute toggle */}
                <button
                  onClick={() => {
                    const newState = !muted;
                    setMuted(newState);
                    toast.success(newState ? 'Muted successfully' : 'Unmuted successfully');
                  }}
                  className={`p-2.5 border-2 rounded-xl transition-all cursor-pointer ${muted ? "bg-rose-500/10 border-rose-500/30 text-rose-500" : "bg-muted/30 border-border text-muted-foreground hover:border-foreground/40"}`}
                  title={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {statCards.map((s, i) => (
                <div key={i} className="bg-card border border-border rounded-[1rem] px-4 py-3 shadow-sm hover:shadow-md transition-all">
                  <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <p className="text-2xl font-black tracking-tighter text-foreground">
                    {stats ? s.value.toLocaleString() : "—"}
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground leading-tight mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Main content: Events + Alerts ── */}
            <div className="flex flex-col lg:flex-row gap-7">

              {/* LEFT: Events Table */}
              <div className="lg:w-[60%] bg-card border border-border rounded-[1rem] shadow-sm overflow-visible">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-tight text-foreground">Event Alerts</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">
                      Configure which events trigger a sound
                    </p>
                  </div> 
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-muted-foreground text-[10px] uppercase tracking-[0.15em] font-black border-b border-border">
                        <th className="px-6 py-4">Event</th>
                        <th className="px-6 py-4">Sound</th>
                        <th className="px-6 py-4 text-center">Enabled</th>
                        <th className="px-6 py-4 text-right">Test</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {events.map((ev, index) => (
                        <tr key={ev.key} className="group hover:bg-muted/30 transition-colors">
                          {/* Event label */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black uppercase tracking-tight text-foreground">
                                {ev.label}
                              </span>
                            </div>
                          </td>

                          {/* Sound dropdown */}
                          <td className="px-6 py-4">
                            <div className="relative">
                              <button
                                onClick={() => setOpenSoundDropdowns((s) => ({ ...s, [ev.key]: !s[ev.key] }))}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 border border-border rounded-lg text-[10px] font-black uppercase tracking-tight hover:border-foreground/40 transition-all cursor-pointer"
                              >
                                <Volume2 className="w-3 h-3 text-muted-foreground" />
                                <span className="truncate max-w-[90px]">{ev.sound}</span>
                                <ChevronDown className="w-3 h-3 text-muted-foreground" />
                              </button>
                              {openSoundDropdowns[ev.key] && (
                                <div className={`absolute z-500 left-0 ${index < 3 ? 'top-full mt-1' : 'bottom-full mb-1'} bg-card border border-border rounded-xl shadow-xl overflow-visible min-w-[160px]`}>
                                  {SOUND_OPTIONS.map((s) => (
                                    <button
                                      key={s}
                                      onClick={() => setEventSound(ev.key, s)}
                                      className={`w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-tight hover:bg-muted/50 transition-colors cursor-pointer ${ev.sound === s ? "text-primary" : "text-foreground"}`}
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Toggle */}
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => toggleEvent(ev.key)}
                              className={`w-11 h-6 rounded-full border-2 relative transition-all cursor-pointer ${ev.enabled ? "bg-emerald-500 border-emerald-500" : "bg-muted/50 border-border"}`}
                            >
                              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${ev.enabled ? "left-5" : "left-0.5"}`} />
                            </button>
                          </td>

                          {/* Test */}
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => testSound(ev.sound)}
                              className="p-2 bg-muted/50 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* RIGHT: Status Card + Recent Alerts */}
              <div className="lg:w-[40%] flex flex-col gap-5">

                {/* Status card */}
                <div className="bg-card border border-border rounded-[1rem] shadow-sm p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-primary" />
                      <h2 className="text-sm font-black uppercase tracking-tight text-foreground">Notifications</h2>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                      Active
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-muted-foreground font-black uppercase tracking-wider">Status</span>
                      <span className="font-black text-emerald-500">{muted ? "Muted" : "Listening"}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-muted-foreground font-black uppercase tracking-wider">Sound</span>
                      <span className="font-black text-foreground">{muted ? "Disabled" : "Enabled"}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-muted-foreground font-black uppercase tracking-wider">Volume</span>
                      <span className="font-black text-foreground">{Math.round(volume * 100)}%</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-muted-foreground font-black uppercase tracking-wider">Last refresh</span>
                      <span className="font-black text-foreground">{lastRefresh.toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => testSound()}
                      className="flex-1 py-2.5 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all cursor-pointer"
                    >
                      Test Sound
                    </button>
                    <button
                      onClick={() => {
                        const newState = !muted;
                        setMuted(newState);
                        toast.success(newState ? 'Muted successfully' : 'Unmuted successfully');
                      }}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all cursor-pointer ${muted ? "border-emerald-500 text-emerald-500 hover:bg-emerald-500/10" : "border-rose-500 text-rose-500 hover:bg-rose-500/10"}`}
                    >
                      {muted ? "Unmute" : "Mute"}
                    </button>
                  </div>
                </div>

                {/* Recent alerts feed */}
                <div className="bg-card border border-border rounded-[1rem] shadow-sm overflow-hidden flex-1">
                  <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="text-sm font-black uppercase tracking-tight text-foreground">Recent Alerts</h2>
                    {alerts.length > 0 && (
                      <button onClick={() => {
                        clearAlerts();
                        toast.success('Alerts cleared');
                      }} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-border">
                    {alerts.length === 0 ? (
                      <div className="p-10 text-center">
                        <div className="w-10 h-10 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Bell className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          No alerts yet — monitoring...
                        </p>
                      </div>
                    ) : (
                      alerts.map((a) => (
                        <div key={a.id} className="px-5 py-3 hover:bg-muted/30 transition-colors">
                          <div className="flex items-start gap-3">
                            <span className="text-base mt-0.5">{a.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black uppercase tracking-tight text-foreground">{a.label}</p>
                              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider mt-0.5">{a.detail}</p>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex-shrink-0">
                              {a.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Settings Card ── */}
            <div className="bg-card border border-border rounded-[1rem] shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-black uppercase tracking-tight text-foreground">Settings</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Toggles */}
                <div className="space-y-4">
                  {[
                    { label: "Play sound on new event", value: !muted, onChange: (v: boolean) => {
                      setMuted(!v);
                      toast.success(!v ? 'Sound enabled' : 'Sound disabled');
                    } },
                    { label: "Desktop notifications", value: desktopNotifs, onChange: requestDesktopPerms },
                  ].map(({ label, value, onChange }) => (
                    <label key={label} className="flex items-center justify-between cursor-pointer group">
                      <span className="text-xs font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">{label}</span>
                      <button
                        onClick={() => onChange(!value)}
                        className={`w-11 h-6 rounded-full border-2 relative transition-all cursor-pointer ${value ? "bg-emerald-500 border-emerald-500" : "bg-muted/50 border-border"}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${value ? "left-5" : "left-0.5"}`} />
                      </button>
                    </label>
                  ))}

                  {/* Volume */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between">
                      <span className="text-xs font-black uppercase tracking-tight text-foreground">Volume</span>
                      <span className="text-xs font-black text-muted-foreground">{Math.round(volume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0} max={1} step={0.05}
                      value={volume}
                      onChange={(e) => {
                        const newVolume = parseFloat(e.target.value);
                        setVolume(newVolume);
                        toast.success(`Volume set to ${Math.round(newVolume * 100)}%`);
                      }}
                      className="w-full accent-foreground"
                    />
                  </div>
                </div>

                {/* Right: Dropdowns */}
                <div className="space-y-4">
                  {/* Global default sound */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-tight text-foreground">Default Alert Sound</label>
                    <div className="relative">
                      <button
                        onClick={() => setGlobalDropdownOpen((o) => !o)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 border-2 border-border rounded-xl text-xs font-black uppercase tracking-tight hover:border-foreground/40 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
                          {globalSound}
                        </div>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </button>
                      {globalDropdownOpen && (
                        <div className="absolute z-50 w-full bottom-full mb-1 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                          {SOUND_OPTIONS.map((s) => (
                            <button
                              key={s}
                              onClick={() => {
                                setGlobalSound(s);
                                setGlobalDropdownOpen(false);
                                toast.success(`Default sound set to ${s}`);
                              }}
                              className={`w-full text-left px-4 py-3 text-xs font-black uppercase tracking-tight hover:bg-muted/50 transition-colors cursor-pointer ${globalSound === s ? "text-primary" : "text-foreground"}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Polling interval */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-tight text-foreground">Polling Interval</label>
                    <div className="relative">
                      <button
                        onClick={() => setIntervalDropdownOpen((o) => !o)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 border-2 border-border rounded-xl text-xs font-black uppercase tracking-tight hover:border-foreground/40 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          {pollingInterval} seconds
                        </div>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </button>
                      {intervalDropdownOpen && (
                        <div className="absolute z-50 w-full bottom-full mb-1 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                          {[5, 10, 15, 30, 60].map((sec) => (
                            <button
                              key={sec}
                              onClick={() => {
                                setPollingInterval(sec);
                                setIntervalDropdownOpen(false);
                                toast.success(`Polling interval set to ${sec} seconds`);
                              }}
                              className={`w-full text-left px-4 py-3 text-xs font-black uppercase tracking-tight hover:bg-muted/50 transition-colors cursor-pointer ${pollingInterval === sec ? "text-primary" : "text-foreground"}`}
                            >
                              {sec} seconds
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>

        <AdminNav />
      </div>
    </div>
  );
}