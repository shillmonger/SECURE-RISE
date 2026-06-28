"use client";

import React, { useState, useEffect } from "react";
import { Map } from "lucide-react";
import { UserStatusBadge } from "./MonitoringShared";

interface MapPin {
  userId: string;
  username: string;
  fullName: string;
  avatar: string;
  country: string;
  city: string;
  status: "online" | "offline" | "away";
  device: string;
  page: string;
  x: number;
  y: number;
}

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

export default function LiveGlobalConnections() {
  const [hovered, setHovered] = useState<MapPin | null>(null);
  const [hoveredPos, setHoveredPos] = useState({ x: 0, y: 0 });
  const [mapPins, setMapPins] = useState<MapPin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/activity');
        if (response.ok) {
          const data = await response.json();
          const users = data.users || [];

          // Create individual user pins scattered across the map
          const pins: MapPin[] = users
            .filter((user: any) => user.country !== 'Unknown')
            .map((user: any) => {
              const countryPos = pinPositions[user.country] || { x: 500, y: 250 };
              // Add some randomness to scatter users within country area
              const randomOffset = () => (Math.random() - 0.5) * 40;
              return {
                userId: user.id,
                username: user.username,
                fullName: user.fullName,
                avatar: user.avatar,
                country: user.country,
                city: user.city || 'Unknown',
                status: user.status,
                device: user.device,
                page: user.currentPage,
                x: countryPos.x + randomOffset(),
                y: countryPos.y + randomOffset(),
              };
            })
            .slice(0, 50); // Limit to 50 users to avoid overcrowding

          setMapPins(pins);
        }
      } catch (error) {
        console.error('Error fetching map data:', error);
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
      <div className="bg-card border border-border rounded-[1rem] overflow-hidden relative shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Map className="w-4 h-4 text-primary" />
              Live Global Connections
            </h3>
          </div>
        </div>
        <div className="p-5 text-center text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-[1rem] overflow-hidden relative shadow-sm">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Map className="w-4 h-4 text-primary" />
            Live Global Connections
          </h3>
          <p className="text-xs font-medium text-muted-foreground mt-0.5">
            {mapPins.length} users across the globe
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Online</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />Away</div>
        </div>
      </div>

      {/* ── Map Stage ── */}
      <div
        className="relative bg-[#07100f]"
        style={{ minHeight: 340 }}
        onMouseLeave={() => setHovered(null)}
      >
        {/* World map background image */}
        <img
          src="https://i.postimg.cc/1zx34ZSL/map.jpg"
          alt="World Map"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Pins layer */}
        <div className="absolute inset-0 p-4">
          <svg viewBox="0 0 1000 500" className="w-full" style={{ maxHeight: 300 }}>
            <defs>
              <clipPath id="avatarClip">
                <rect x="0" y="0" width="40" height="80" rx="8" />
              </clipPath>
            </defs>
            {mapPins.map((pin, i) => {
              const borderColor = pin.status === "online" ? "#3b82f6" : pin.status === "offline" ? "#ef4444" : "#f97316";
              return (
                <g
                  key={i}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => {
                    setHovered(pin);
                    setHoveredPos({ x: pin.x / 10, y: pin.y / 5 });
                  }}
                >
                  {/* Animated pulse for online users */}
                  {pin.status === "online" && (
                    <circle cx={pin.x} cy={pin.y} r="30" fill="none" stroke="#3b82f6" strokeWidth="1.2" opacity="0.3">
                      <animate attributeName="r" values="20;35;20" dur="2.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* User profile image with colored border */}
                  <foreignObject x={pin.x - 20} y={pin.y - 40} width="40" height="80">
                    <div
                      className="relative w-10 h-20 rounded-lg overflow-hidden"
                      style={{ 
                        border: `3px solid ${borderColor}`,
                        boxShadow: `0 0 10px ${borderColor}40`
                      }}
                    >
                      <img
                        src={pin.avatar}
                        alt={pin.username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${pin.username}`;
                        }}
                      />
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Tooltip */}
        {hovered && (
          <div
            className="absolute z-10 bg-card/95 border border-emerald-500/30 rounded-xl p-3 shadow-xl backdrop-blur-sm pointer-events-none min-w-[190px]"
            style={{
              left: `${hoveredPos.x}%`,
              top: `${hoveredPos.y}%`,
              transform: "translate(-50%, -110%)",
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <UserStatusBadge status={hovered.status} />
              <p className="text-sm font-bold text-foreground">{hovered.fullName}</p>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono px-0.5">@{hovered.username}</p>
            <div className="mt-2 pt-2 border-t border-border space-y-1.5">
              {([["Country", hovered.country], ["City", hovered.city], ["Device", hovered.device], ["Page", hovered.page]] as [string, string][]).map(([l, v]) => (
                <div key={l} className="flex justify-between gap-3 items-center">
                  <span className="text-[11px] text-muted-foreground">{l}</span>
                  <span className="text-[11px] font-semibold text-foreground">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── User chips ── */}
      <div className="px-6 py-4 border-t border-border flex gap-2 flex-wrap bg-muted/20">
        {mapPins.slice(0, 20).map((pin, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border text-xs font-bold transition-all hover:border-primary/40 cursor-default shadow-sm
              ${pin.status === "online"
                ? "bg-blue-500/5 border-blue-500/20 text-blue-400"
                : pin.status === "offline"
                ? "bg-red-500/5 border-red-500/20 text-red-400"
                : "bg-orange-500/5 border-orange-500/20 text-orange-400"
              }`}
          >
            <img
              src={pin.avatar}
              alt={pin.username}
              className="w-5 h-5 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${pin.username}`;
              }}
            />
            <span>{pin.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}