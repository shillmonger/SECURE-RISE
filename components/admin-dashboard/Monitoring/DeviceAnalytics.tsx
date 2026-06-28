"use client";

import React from "react";
import { PieChart } from "lucide-react";

export default function DeviceAnalytics() {
  const donutData = [
    { label: "Desktop", value: 52, color: "#6366f1" },
    { label: "Mobile", value: 38, color: "#10b981" },
    { label: "Tablet", value: 10, color: "#f59e0b" },
  ];
  const osData = [
    { label: "Windows 11", value: 38, color: "#3b82f6" },
    { label: "macOS 14", value: 24, color: "#8b5cf6" },
    { label: "Android 14", value: 18, color: "#10b981" },
    { label: "iOS 17", value: 14, color: "#f43f5e" },
    { label: "Linux", value: 6, color: "#f59e0b" },
  ];
  const browserData = [
    { label: "Chrome", value: 56, color: "#f59e0b" },
    { label: "Safari", value: 22, color: "#3b82f6" },
    { label: "Firefox", value: 12, color: "#f97316" },
    { label: "Edge", value: 8, color: "#06b6d4" },
    { label: "Brave", value: 2, color: "#6366f1" },
  ];

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
