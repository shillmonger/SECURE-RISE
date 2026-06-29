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

// Sound functions
const SOUNDS: Record<string, () => void> = {
  "Notification Bell": () => {
    const audio = new Audio("/sounds/notification-bell.mp3");
    audio.play();
  },
  "Cash Register": () => {
    const audio = new Audio("/sounds/cash-register.mp3");
    audio.play();
  },
  "Chime": () => {
    const audio = new Audio("/sounds/chime.mp3");
    audio.play();
  },
  "Ding": () => {
    const audio = new Audio("/sounds/ding.mp3");
    audio.play();
  },
  "Alert": () => {
    const audio = new Audio("/sounds/alert.mp3");
    audio.play();
  },
  "Success": () => {
    const audio = new Audio("/sounds/success.mp3");
    audio.play();
  },
  "Pop": () => {
    const audio = new Audio("/sounds/pop.mp3");
    audio.play();
  },
};

const DEFAULT_EVENTS: EventConfig[] = [
  { key: "newUser", label: "New User", emoji: "👤", countKey: "totalUsers", enabled: true, sound: "Notification Bell" },
  { key: "newDeposit", label: "New Deposit", emoji: "💰", countKey: "totalDeposits", enabled: true, sound: "Cash Register" },
  { key: "newWithdrawal", label: "New Withdrawal", emoji: "💸", countKey: "totalWithdrawals", enabled: true, sound: "Chime" },
  { key: "newGiftCard", label: "New Gift Card", emoji: "🎁", countKey: "totalGiftCards", enabled: true, sound: "Ding" },
  { key: "newInvestment", label: "New Investment", emoji: "📈", countKey: "totalInvestments", enabled: true, sound: "Alert" },
  { key: "newKYC", label: "New KYC", emoji: "🪪", countKey: "totalKYC", enabled: true, sound: "Success" },
  { key: "newPaystack", label: "New Paystack Txn", emoji: "💳", countKey: "totalPaystack", enabled: true, sound: "Pop" },
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
              // Notify header that alerts are active
              localStorage.setItem('alerts-active', 'true');
              window.dispatchEvent(new CustomEvent('alerts-activity', { detail: 'active' }));
              
              for (let i = 0; i < diff; i++) {
                const alertId = `${Date.now()}-${Math.random()}`;
                
                if (!muted) {
                  const soundFn = SOUNDS[cfg.sound] ?? SOUNDS["Notification Bell"];
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
