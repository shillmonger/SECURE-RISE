"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

interface PlatformStats {
  totalUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalGiftCards: number;
  totalInvestments: number;
  totalKYC: number;
  totalPaystack: number;
}

interface EventConfig {
  key: string;
  label: string;
  emoji: string;
  countKey: keyof PlatformStats;
  enabled: boolean;
  sound: string;
}

interface AlertEvent {
  id: string;
  type: string;
  emoji: string;
  label: string;
  detail: string;
  timestamp: Date;
}

interface AdminAlertContextType {
  stats: PlatformStats | null;
  alerts: AlertEvent[];
  muted: boolean;
  setMuted: (muted: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  pollingInterval: number;
  setPollingInterval: (interval: number) => void;
  events: EventConfig[];
  setEvents: (events: EventConfig[]) => void;
  desktopNotifs: boolean;
  setDesktopNotifs: (enabled: boolean) => void;
  clearAlerts: () => void;
}

const AdminAlertContext = createContext<AdminAlertContextType | undefined>(undefined);

// ─── Sound Engine (Web Audio API) ─────────────────────────────────────────────
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

const SOUNDS: Record<string, () => void> = {
  "Notification Bell": () => playTone([880, 1100, 880], [0.12, 0.08, 0.1]),
  "Cash Register": () => playTone([1200, 1600, 1400, 1800], [0.06, 0.06, 0.06, 0.1]),
  "Soft Ping": () => playTone([1000], [0.25]),
  "Double Beep": () => { playTone([800], [0.08]); setTimeout(() => playTone([800], [0.08]), 180); },
  "Alert Chime": () => playTone([523, 659, 784, 1047], [0.1, 0.1, 0.1, 0.2]),
  "Low Buzz": () => playTone([300, 250], [0.15, 0.15]),
  "Success Tone": () => playTone([523, 784, 1047], [0.1, 0.1, 0.2]),
  "Chime": () => playTone([523, 659, 784], [0.15, 0.15, 0.2]),
  "Ding": () => playTone([1200], [0.3]),
  "Alert": () => playTone([440, 880], [0.1, 0.2]),
  "Success": () => playTone([523, 659, 784, 1047], [0.1, 0.1, 0.1, 0.25]),
  "Pop": () => playTone([800], [0.05]),
};

const DEFAULT_EVENTS: EventConfig[] = [
  { key: "newDeposit", label: "New Deposit", emoji: "�", countKey: "totalDeposits", enabled: true, sound: "Cash Register" },
  { key: "newWithdrawal", label: "New Withdrawal", emoji: "�", countKey: "totalWithdrawals", enabled: true, sound: "Alert Chime" },
  { key: "newUser", label: "New User", emoji: "�", countKey: "totalUsers", enabled: true, sound: "Notification Bell" },
  { key: "newKYC", label: "New KYC", emoji: "🛡️", countKey: "totalKYC", enabled: true, sound: "Soft Ping" },
  { key: "newInvestment", label: "New Investment", emoji: "📈", countKey: "totalInvestments", enabled: true, sound: "Success Tone" },
  { key: "newGiftCard", label: "New Gift Card", emoji: "🎁", countKey: "totalGiftCards", enabled: true, sound: "Double Beep" },
  { key: "newPaystack", label: "New Paystack Txn", emoji: "💳", countKey: "totalPaystack", enabled: true, sound: "Notification Bell" },
];

export function AdminAlertProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [pollingInterval, setPollingInterval] = useState(30);
  const [desktopNotifs, setDesktopNotifs] = useState(false);
  const [events, setEvents] = useState<EventConfig[]>(DEFAULT_EVENTS);

  const prevStatsRef = useRef<PlatformStats | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const soundIntervalRef = useRef<Record<string, NodeJS.Timeout>>({});

  console.log('[Alert Context] Provider mounted');

  // Fetch alert settings from database
  const fetchAlertSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/alert-settings');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          setMuted(data.settings.muted);
          setVolume(data.settings.volume);
          setPollingInterval(data.settings.pollingInterval);
          setDesktopNotifs(data.settings.desktopNotifs);
          setEvents(data.settings.events);
        }
      }
    } catch (error) {
      console.error('Failed to fetch alert settings:', error);
    }
  }, []);

  // Save alert settings to database
  const saveAlertSettings = useCallback(async () => {
    try {
      await fetch('/api/admin/alert-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          muted,
          volume,
          globalSound: "Notification Bell",
          pollingInterval,
          desktopNotifs,
          events,
        }),
      });
    } catch (error) {
      console.error('Failed to save alert settings:', error);
    }
  }, [muted, volume, pollingInterval, desktopNotifs, events]);

  // Fetch stats
  const fetchStats = useCallback(async (silent = false) => {
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) {
        throw new Error("Failed to fetch stats");
      }
      const data = await res.json();
      
      if (data.success && data.stats) {
        const newStats: PlatformStats = {
          totalUsers: data.stats.totalUsers,
          totalDeposits: data.stats.totalDeposits,
          totalWithdrawals: data.stats.totalWithdrawals,
          totalGiftCards: data.stats.totalGiftCards,
          totalInvestments: data.stats.totalInvestments,
          totalKYC: data.stats.totalKYC,
          totalPaystack: data.stats.totalPaystack,
        };

        // Compare with previous & fire alerts
        const prev = prevStatsRef.current;
        if (prev) {
          const checks: { key: keyof PlatformStats; cfg: EventConfig }[] = events.map((e) => ({
            key: e.countKey,
            cfg: e,
          }));

          for (const { key, cfg } of checks) {
            if (!cfg.enabled) continue;
            const diff = (newStats[key] as number) - (prev[key] as number);
            if (diff > 0) {
              console.log(`[Alert Context] New data detected: ${cfg.label}, diff: ${diff}, sound: ${cfg.sound}`);
              
              // Notify header that alerts are active
              localStorage.setItem('alerts-active', 'true');
              window.dispatchEvent(new CustomEvent('alerts-activity', { detail: 'active' }));
              
              for (let i = 0; i < diff; i++) {
                const alertId = `${Date.now()}-${Math.random()}`;
                
                if (!muted) {
                  const soundFn = SOUNDS[cfg.sound] ?? SOUNDS["Notification Bell"];
                  console.log(`[Alert Context] Playing sound: ${cfg.sound}`);
                  // Play sound immediately
                  soundFn();
                  // Start repeating sound every 3 seconds for 1 minute
                  soundIntervalRef.current[alertId] = setInterval(() => {
                    if (!muted) {
                      soundFn();
                    }
                  }, 3000);
                  // Stop after 1 minute
                  setTimeout(() => {
                    if (soundIntervalRef.current[alertId]) {
                      clearInterval(soundIntervalRef.current[alertId]);
                      delete soundIntervalRef.current[alertId];
                    }
                  }, 60000);
                }
                
                const newAlert: AlertEvent = {
                  id: alertId,
                  type: cfg.key,
                  emoji: cfg.emoji,
                  label: cfg.label,
                  detail: `+${diff} new record${diff > 1 ? "s" : ""}`,
                  timestamp: new Date(),
                };
                setAlerts((prev) => [newAlert, ...prev].slice(0, 50));
                if (desktopNotifs && "Notification" in window && Notification.permission === "granted") {
                  new Notification(`${cfg.emoji} ${cfg.label}`, { body: newAlert.detail });
                }
              }
            }
          }
        }

        prevStatsRef.current = newStats;
        setStats(newStats);
      }
    } catch (err) {
      if (!silent) console.error("Failed to refresh stats:", err);
    }
  }, [events, muted, desktopNotifs]);

  // Clear alerts
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Initialize settings on mount
  useEffect(() => {
    fetchAlertSettings();
  }, [fetchAlertSettings]);

  // Save settings whenever they change
  useEffect(() => {
    saveAlertSettings();
  }, [saveAlertSettings]);

  // Clear sound intervals when muted
  useEffect(() => {
    if (muted) {
      Object.values(soundIntervalRef.current).forEach(interval => clearInterval(interval));
      soundIntervalRef.current = {};
    }
  }, [muted]);

  // Polling
  useEffect(() => {
    fetchStats();
    pollingRef.current = setInterval(() => fetchStats(true), pollingInterval * 1000);
    return () => { 
      if (pollingRef.current) clearInterval(pollingRef.current);
      Object.values(soundIntervalRef.current).forEach(interval => clearInterval(interval));
      soundIntervalRef.current = {};
    };
  }, [pollingInterval, fetchStats]);

  const value: AdminAlertContextType = {
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
  };

  return <AdminAlertContext.Provider value={value}>{children}</AdminAlertContext.Provider>;
}

export function useAdminAlerts() {
  const context = useContext(AdminAlertContext);
  if (context === undefined) {
    throw new Error("useAdminAlerts must be used within an AdminAlertProvider");
  }
  return context;
}
