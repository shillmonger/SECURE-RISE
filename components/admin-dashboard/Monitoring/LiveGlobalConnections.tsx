"use client";

import React, { useState } from "react";
import { Map, Globe, User } from "lucide-react";
import { UserStatusBadge } from "./MonitoringShared";

interface MapPin {
  country: string;
  city: string;
  lat: number;
  lng: number;
  users: number;
  status: "online" | "offline" | "away";
  topUser: string;
  device: string;
  page: string;
}

const MOCK_MAP_PINS: MapPin[] = [
  { country: "Nigeria", city: "Lagos", lat: 6.5, lng: 3.4, users: 12, status: "online", topUser: "Amara D.", device: "Mobile", page: "Trading" },
  { country: "United States", city: "New York", lat: 40.7, lng: -74, users: 9, status: "online", topUser: "Marcus B.", device: "Desktop", page: "Deposit" },
  { country: "United Kingdom", city: "London", lat: 51.5, lng: -0.1, users: 7, status: "online", topUser: "Isla S.", device: "Desktop", page: "Dashboard" },
  { country: "Germany", city: "Berlin", lat: 52.5, lng: 13.4, users: 5, status: "away", topUser: "Felix B.", device: "Desktop", page: "Wallet" },
  { country: "India", city: "Mumbai", lat: 19.1, lng: 72.9, users: 8, status: "online", topUser: "Priya S.", device: "Mobile", page: "Referrals" },
  { country: "Brazil", city: "São Paulo", lat: -23.5, lng: -46.6, users: 4, status: "online", topUser: "Luna C.", device: "Mobile", page: "Withdraw" },
  { country: "Japan", city: "Tokyo", lat: 35.7, lng: 139.7, users: 6, status: "online", topUser: "Riku T.", device: "Desktop", page: "Trading" },
  { country: "Canada", city: "Toronto", lat: 43.7, lng: -79.4, users: 3, status: "away", topUser: "Ben O.", device: "Tablet", page: "Profile" },
  { country: "France", city: "Paris", lat: 48.9, lng: 2.3, users: 4, status: "online", topUser: "Chloe M.", device: "Desktop", page: "Verification" },
  { country: "South Africa", city: "Johannesburg", lat: -26.2, lng: 28.0, users: 5, status: "online", topUser: "Kwame A.", device: "Mobile", page: "Deposit" },
];

export default function LiveGlobalConnections() {
  const [hovered, setHovered] = useState<MapPin | null>(null);
  const [hoveredPos, setHoveredPos] = useState({ x: 0, y: 0 });

  const pinPositions: Record<string, { x: number; y: number }> = {
    "Nigeria": { x: 500, y: 280 },
    "United States": { x: 190, y: 200 },
    "United Kingdom": { x: 462, y: 150 },
    "Germany": { x: 490, y: 148 },
    "India": { x: 650, y: 240 },
    "Brazil": { x: 270, y: 330 },
    "Japan": { x: 790, y: 195 },
    "Canada": { x: 190, y: 155 },
    "France": { x: 472, y: 158 },
    "South Africa": { x: 510, y: 360 },
  };

  return (
    <div className="bg-card border border-border rounded-[1rem] overflow-hidden relative">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-black uppercase tracking-tight text-foreground flex items-center gap-2">
            <Map className="w-4 h-4 text-primary" />
            Live Global Connections
          </h3>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">
            {MOCK_MAP_PINS.reduce((a, b) => a + b.users, 0)} active connections across {MOCK_MAP_PINS.length} countries
          </p>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Online</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />Away</div>
        </div>
      </div>

      <div className="relative bg-[#0a0e1a] p-4" style={{ minHeight: 320 }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "linear-gradient(rgba(0,200,100,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,100,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />

        <svg viewBox="0 0 1000 500" className="w-full opacity-30" style={{ maxHeight: 280 }}>
          <ellipse cx="190" cy="190" rx="110" ry="80" fill="none" stroke="#1a3a2a" strokeWidth="1.5" />
          <ellipse cx="260" cy="340" rx="60" ry="80" fill="none" stroke="#1a3a2a" strokeWidth="1.5" />
          <ellipse cx="480" cy="155" rx="50" ry="40" fill="none" stroke="#1a3a2a" strokeWidth="1.5" />
          <ellipse cx="505" cy="305" rx="70" ry="90" fill="none" stroke="#1a3a2a" strokeWidth="1.5" />
          <ellipse cx="680" cy="200" rx="160" ry="90" fill="none" stroke="#1a3a2a" strokeWidth="1.5" />
          <ellipse cx="800" cy="360" rx="55" ry="40" fill="none" stroke="#1a3a2a" strokeWidth="1.5" />
        </svg>

        <div className="absolute inset-0 p-4">
          <svg viewBox="0 0 1000 500" className="w-full" style={{ maxHeight: 280 }}>
            {MOCK_MAP_PINS.map((pin, i) => {
              const pos = pinPositions[pin.country] || { x: 500, y: 250 };
              const isOnline = pin.status === "online";
              return (
                <g key={i} style={{ cursor: "pointer" }} onMouseEnter={(e) => {
                  setHovered(pin);
                  const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
                  setHoveredPos({ x: pos.x / 10, y: pos.y / 5 });
                }}>
                  {isOnline && (
                    <>
                      <circle cx={pos.x} cy={pos.y} r="18" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.3">
                        <animate attributeName="r" values="10;22;10" dur="2.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
                      </circle>
                    </>
                  )}
                  <circle cx={pos.x} cy={pos.y} r="6" fill={isOnline ? "#10b981" : "#f59e0b"} opacity="0.9" />
                  <circle cx={pos.x + 10} cy={pos.y - 10} r="9" fill={isOnline ? "#059669" : "#d97706"} />
                  <text x={pos.x + 10} y={pos.y - 7} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{pin.users}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {hovered && (
          <div
            className="absolute z-10 bg-card/95 border border-emerald-500/30 rounded-xl p-3 pointer-events-none min-w-[180px]"
            style={{ left: `${hoveredPos.x}%`, top: `${hoveredPos.y}%`, transform: "translate(-50%, -110%)" }}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center gap-2 mb-2">
              <UserStatusBadge status={hovered.status} />
              <p className="text-xs font-black text-foreground">{hovered.country}</p>
            </div>
            <p className="text-[9px] text-muted-foreground font-mono">{hovered.city}</p>
            <div className="mt-2 pt-2 border-t border-border space-y-1">
              {[["Users", hovered.users], ["Top User", hovered.topUser], ["Device", hovered.device], ["Page", hovered.page]].map(([l, v]) => (
                <div key={l as string} className="flex justify-between gap-3">
                  <span className="text-[9px] text-muted-foreground">{l}</span>
                  <span className="text-[9px] font-bold text-foreground">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-3 border-t border-border flex gap-2 flex-wrap">
        {MOCK_MAP_PINS.map((pin, i) => (
          <div key={i} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-wider transition-all hover:border-primary/40 cursor-default
            ${pin.status === "online" ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-amber-500/5 border-amber-500/20 text-amber-400"}`}>
            <span className="font-mono">{pin.users}</span>
            <span>{pin.country}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
