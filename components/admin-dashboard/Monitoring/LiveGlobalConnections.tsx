"use client";

import React, { useState, useEffect } from "react";
import { Map } from "lucide-react";
import { UserStatusBadge } from "./MonitoringShared";

const pulseAnimation = `
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
`;

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
  "Nigeria":        { x: 510, y: 310 },
  "United States":  { x: 170, y: 210 },
  "United Kingdom": { x: 455, y: 130 },
  "Germany":        { x: 490, y: 125 },
  "India":          { x: 670, y: 235 },
  "Brazil":         { x: 255, y: 355 },
  "Japan":          { x: 810, y: 185 },
  "Canada":         { x: 160, y: 140 },
  "France":         { x: 468, y: 138 },
  "South Africa":   { x: 515, y: 390 },
  "Australia":      { x: 790, y: 380 },
  "Mexico":         { x: 170, y: 260 },
  "Argentina":      { x: 240, y: 410 },
  "Russia":         { x: 640, y: 110 },
  "China":          { x: 740, y: 200 },
  "Indonesia":      { x: 760, y: 320 },
  "Egypt":          { x: 535, y: 235 },
  "Kenya":          { x: 555, y: 320 },
  "Spain":          { x: 455, y: 158 },
  "Italy":          { x: 497, y: 158 },
  "Pakistan":       { x: 640, y: 215 },
  "Bangladesh":     { x: 686, y: 235 },
  "Ethiopia":       { x: 555, y: 295 },
  "Turkey":         { x: 548, y: 175 },
  "Saudi Arabia":   { x: 575, y: 250 },
  "UAE":            { x: 600, y: 255 },
  "Ghana":          { x: 478, y: 305 },
  "Cameroon":       { x: 500, y: 305 },
  "Senegal":        { x: 455, y: 280 },
  "Tanzania":       { x: 553, y: 340 },
};

export default function LiveGlobalConnections() {
  const [hovered, setHovered] = useState<MapPin | null>(null);
  const [hoveredPos, setHoveredPos] = useState({ x: 0, y: 0 });
  const [mapPins, setMapPins] = useState<MapPin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = pulseAnimation;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/activity');
        if (response.ok) {
          const data = await response.json();
          const users = data.users || [];

          const pins: MapPin[] = users
            .map((user: any, index: number) => {
              let x, y;

              if (user.country && user.country !== 'Unknown' && pinPositions[user.country]) {
                const countryPos = pinPositions[user.country];
                const randomOffset = () => (Math.random() - 0.5) * 40;
                x = countryPos.x + randomOffset();
                y = countryPos.y + randomOffset();
              } else {
                const cols = 8;
                const col = index % cols;
                const row = Math.floor(index / cols) % 5;
                x = 80 + col * 110 + (Math.random() - 0.5) * 40;
                y = 80 + row * 80  + (Math.random() - 0.5) * 30;
              }

              return {
                userId: user.id,
                username: user.username,
                fullName: user.fullName,
                avatar: user.avatar,
                country: user.country || 'Unknown',
                city: user.city || 'Unknown',
                status: user.status,
                device: user.device,
                page: user.currentPage,
                x,
                y,
              };
            })
            .slice(0, 50);

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
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Offline</div>
        </div>
      </div>

      {/* ── Map Stage ── */}
      <div
        className="relative bg-[#07100f]"
        style={{ minHeight: 340 }}
        onMouseLeave={() => setHovered(null)}
      >
        {/* World map — grayscale filter applied */}
        <img
          src="https://i.postimg.cc/1zx34ZSL/map.jpg"
          alt="World Map"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "grayscale(100%)" }}
        />

        {/* Pins layer */}
        <div className="absolute inset-0 p-4">
          {mapPins.map((pin, i) => {
            const borderColor =
              pin.status === "online"  ? "#3b82f6" :
              pin.status === "offline" ? "#ef4444" : "#f97316";

            const leftPercent = (pin.x / 1000) * 100;
            const topPercent  = (pin.y / 500)  * 100;

            return (
              <div
                key={i}
                className="absolute cursor-pointer"
                style={{
                  left: `${leftPercent}%`,
                  top:  `${topPercent}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseEnter={() => {
                  setHovered(pin);
                  setHoveredPos({ x: leftPercent, y: topPercent });
                }}
              >
                {/* Pulse ring for online users */}
                {pin.status === "online" && (
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: 36,
                      height: 36,
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      border: `2px solid #3b82f6`,
                      opacity: 0.4,
                      animation: "pulse 2.5s infinite",
                    }}
                  />
                )}

                {/* ── Avatar: rounded-full, w-10 h-10 ── */}
                <div
                  className="w-10 h-10 rounded-full overflow-hidden"
                  style={{
                    border: `2.5px solid ${borderColor}`,
                    boxShadow: `0 0 8px ${borderColor}60`,
                  }}
                >
                  <img
                    src={pin.avatar}
                    alt={pin.username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${pin.username}`;
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tooltip */}
        {hovered && (
          <div
            className="absolute z-10 bg-card/95 border border-emerald-500/30 rounded-xl p-3 shadow-xl backdrop-blur-sm pointer-events-none min-w-[190px]"
            style={{
              left: `${hoveredPos.x}%`,
              top:  `${hoveredPos.y}%`,
              transform: "translate(-50%, -110%)",
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <UserStatusBadge status={hovered.status} />
              <p className="text-sm font-bold text-foreground">{hovered.fullName}</p>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono px-0.5">@{hovered.username}</p>
            <div className="mt-2 pt-2 border-t border-border space-y-1.5">
              {([
                ["Country", hovered.country],
                ["City",    hovered.city],
                ["Device",  hovered.device],
                ["Page",    hovered.page],
              ] as [string, string][]).map(([l, v]) => (
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
                (e.target as HTMLImageElement).src =
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${pin.username}`;
              }}
            />
            <span>{pin.username}</span>
          </div>
        ))}
      </div>

    </div>
  );
}