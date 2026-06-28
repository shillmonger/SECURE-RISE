"use client";

import React from "react";
import { LineChart } from "lucide-react";

export default function TrafficOverview() {
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
  const usersData = [4, 6, 5, 3, 2, 3, 8, 14, 18, 22, 26, 28, 30, 27, 25, 24, 26, 28, 24, 20, 16, 12, 8, 5];
  const requestsData = [120, 140, 110, 80, 60, 90, 200, 340, 410, 480, 520, 560, 580, 540, 500, 480, 510, 540, 470, 390, 310, 230, 170, 110];
  const clicksData = [20, 30, 25, 18, 12, 22, 60, 110, 145, 180, 210, 225, 230, 215, 200, 190, 205, 215, 190, 160, 130, 90, 60, 35];

  function Sparkline({ data, color, height = 60 }: { data: number[]; color: string; height?: number }) {
    const max = Math.max(...data);
    const w = 600;
    const h = height;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 8)}`).join(" ");
    const areaPoints = `0,${h} ` + points + ` ${w},${h}`;
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
        <defs>
          <linearGradient id={`grad_${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#grad_${color.replace("#", "")})`} />
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  const charts = [
    { label: "Users Online", data: usersData, color: "#10b981", suffix: "" },
    { label: "Requests/min", data: requestsData, color: "#6366f1", suffix: "" },
    { label: "Clicks/min", data: clicksData, color: "#f59e0b", suffix: "" },
  ];

  return (
    <div className="bg-card border border-border rounded-[1rem] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
          <LineChart className="w-4 h-4 text-blue-400" />
          Traffic Overview — Last 24 Hours
        </h3>
      </div>
      <div className="grid grid-cols-3 divide-x divide-border">
        {charts.map(({ label, data, color }) => (
          <div key={label} className="p-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
            <p className="text-xl font-black tracking-tighter" style={{ color }}>{Math.max(...data)}</p>
            <div className="mt-3">
              <Sparkline data={data} color={color} height={56} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[8px] text-muted-foreground/60">00:00</span>
              <span className="text-[8px] text-muted-foreground/60">23:00</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
