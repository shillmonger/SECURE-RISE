"use client";

import React, { useState, useEffect } from "react";
import { PieChart } from "lucide-react";

export default function DeviceAnalytics() {
  const [donutData, setDonutData] = useState<{ label: string; value: number; color: string }[]>([]);
  const [osData, setOsData] = useState<{ label: string; value: number; color: string }[]>([]);
  const [browserData, setBrowserData] = useState<{ label: string; value: number; color: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e", "#3b82f6", "#8b5cf6", "#06b6d4", "#f97316"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/activity');
        if (response.ok) {
          const data = await response.json();
          const users = data.users || [];

          // Count devices
          const deviceCount = new Map<string, number>();
          users.forEach((user: any) => {
            deviceCount.set(user.device, (deviceCount.get(user.device) || 0) + 1);
          });

          const deviceTotal = users.length;
          const newDonutData = Array.from(deviceCount.entries())
            .map(([label, count], i) => ({
              label: label.charAt(0).toUpperCase() + label.slice(1),
              value: Math.round((count / deviceTotal) * 100),
              color: colors[i % colors.length],
            }))
            .sort((a, b) => b.value - a.value);

          setDonutData(newDonutData);

          // Count OS
          const osCount = new Map<string, number>();
          users.forEach((user: any) => {
            osCount.set(user.os, (osCount.get(user.os) || 0) + 1);
          });

          const osTotal = users.length;
          const newOsData = Array.from(osCount.entries())
            .map(([label, count], i) => ({
              label,
              value: Math.round((count / osTotal) * 100),
              color: colors[i % colors.length],
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

          setOsData(newOsData);

          // Count browsers
          const browserCount = new Map<string, number>();
          users.forEach((user: any) => {
            const browserName = user.browser.split(' ')[0];
            browserCount.set(browserName, (browserCount.get(browserName) || 0) + 1);
          });

          const browserTotal = users.length;
          const newBrowserData = Array.from(browserCount.entries())
            .map(([label, count], i) => ({
              label,
              value: Math.round((count / browserTotal) * 100),
              color: colors[i % colors.length],
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

          setBrowserData(newBrowserData);
        }
      } catch (error) {
        console.error('Error fetching device data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 50000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-[1rem] overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
            <PieChart className="w-4 h-4 text-violet-400" />
            Device Analytics
          </h3>
        </div>
        <div className="p-5 text-center text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  function DonutChart({ data, size = 80 }: { data: typeof donutData; size?: number }) {
    const r = (size - 16) / 2;
    const c = size / 2;
    let cumulative = 0;
    const total = data.reduce((s, d) => s + d.value, 0);

    const slices = data.map(d => {
      const angle = (d.value / total) * 2 * Math.PI;
      const x1 = c + r * Math.sin(cumulative);
      const y1 = c - r * Math.cos(cumulative);
      cumulative += angle;
      const x2 = c + r * Math.sin(cumulative);
      const y2 = c - r * Math.cos(cumulative);
      const largeArc = angle > Math.PI ? 1 : 0;
      return { ...d, d: `M ${c} ${c} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z` };
    });

    return (
      <svg width={size} height={size} className="flex-shrink-0">
        {slices.map((s, i) => <path key={i} d={s.d} fill={s.color} opacity="0.85" />)}
        <circle cx={c} cy={c} r={r * 0.55} fill="var(--card)" />
      </svg>
    );
  }

  function BarList({ data }: { data: typeof osData }) {
    return (
      <div className="space-y-2 flex-1">
        {data.map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase text-muted-foreground w-16 truncate">{label}</span>
            <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
            </div>
            <span className="text-[9px] font-mono text-muted-foreground w-7 text-right">{value}%</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-[1rem] overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
          <PieChart className="w-4 h-4 text-violet-400" />
          Device Analytics
        </h3>
      </div>
      <div className="p-5 grid grid-cols-3 gap-6 divide-x divide-border">
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3">Device</p>
          <div className="flex items-center gap-3">
            <DonutChart data={donutData} />
            <div className="space-y-1.5">
              {donutData.map(d => (
                <div key={d.label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-[9px] font-black text-muted-foreground">{d.label}</span>
                  <span className="text-[9px] font-mono text-foreground ml-auto pl-2">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="pl-6">
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3">Operating System</p>
          <BarList data={osData} />
        </div>
        <div className="pl-6">
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3">Browser</p>
          <BarList data={browserData} />
        </div>
      </div>
    </div>
  );
}
