"use client";

import React, { useState, useEffect } from "react";
import { Map } from "lucide-react";
import { UserStatusBadge } from "./MonitoringShared";

interface MapPin {
  country: string;
  city: string;
  users: number;
  status: "online" | "offline" | "away";
  topUser: string;
  device: string;
  page: string;
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

/**
 * Simplified but recognisable world-map continent paths
 * projected onto a 1000×500 equirectangular canvas.
 * These are hand-simplified outlines — enough to read as a real map.
 */
function WorldMapBackground() {
  const continentStyle = {
    fill: "rgba(0,180,90,0.07)",
    stroke: "rgba(0,200,100,0.22)",
    strokeWidth: 1,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };

  return (
    <svg
      viewBox="0 0 1000 500"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      {/* ── North America ── */}
      <path
        {...continentStyle}
        d="
          M 130,60  L 200,50  L 260,55  L 290,70
          L 310,90  L 305,115 L 285,130 L 270,145
          L 255,160 L 240,180 L 230,200 L 220,220
          L 215,240 L 225,260 L 235,270 L 240,285
          L 230,295 L 215,290 L 200,275 L 185,260
          L 170,245 L 155,225 L 145,200 L 135,175
          L 120,155 L 110,130 L 108,105 L 115,80
          Z
        "
      />
      {/* Alaska nub */}
      <path
        {...continentStyle}
        d="M 108,80 L 95,70 L 80,65 L 70,75 L 82,85 L 100,88 Z"
      />
      {/* Florida + Gulf */}
      <path
        {...continentStyle}
        d="M 215,240 L 220,255 L 210,268 L 205,260 L 208,248 Z"
      />

      {/* ── Central America / Caribbean bridge ── */}
      <path
        {...continentStyle}
        d="M 215,270 L 225,278 L 232,288 L 240,300 L 248,308 L 242,312 L 232,305 L 220,292 L 210,280 Z"
      />

      {/* ── South America ── */}
      <path
        {...continentStyle}
        d="
          M 248,308 L 265,298 L 285,295 L 305,298
          L 320,310 L 328,330 L 325,355 L 315,378
          L 300,400 L 282,415 L 265,420 L 252,410
          L 242,390 L 238,365 L 240,340 L 245,320
          Z
        "
      />

      {/* ── Greenland ── */}
      <path
        {...continentStyle}
        d="M 340,30 L 380,22 L 405,30 L 400,55 L 380,65 L 355,60 L 338,48 Z"
      />

      {/* ── Europe ── */}
      <path
        {...continentStyle}
        d="
          M 445,100 L 470,95  L 500,98  L 520,108
          L 525,125 L 515,138 L 500,145 L 485,148
          L 470,155 L 458,162 L 448,155 L 440,142
          L 438,125 L 440,110 Z
        "
      />
      {/* Iberian Peninsula */}
      <path
        {...continentStyle}
        d="M 445,145 L 455,148 L 458,162 L 448,168 L 438,158 L 440,148 Z"
      />
      {/* Scandinavia */}
      <path
        {...continentStyle}
        d="M 470,95 L 475,75 L 488,68 L 498,80 L 490,98 L 480,100 Z"
      />

      {/* ── Africa ── */}
      <path
        {...continentStyle}
        d="
          M 458,162 L 478,158 L 505,155 L 530,158
          L 548,170 L 555,192 L 552,218 L 542,242
          L 530,268 L 518,292 L 508,318 L 500,340
          L 490,358 L 478,368 L 465,362 L 455,345
          L 448,320 L 445,295 L 447,268 L 450,242
          L 450,215 L 452,188 Z
        "
      />

      {/* ── Russia / N.Asia ── */}
      <path
        {...continentStyle}
        d="
          M 520,98  L 560,88  L 610,82  L 660,80
          L 710,85  L 750,90  L 790,98  L 820,108
          L 830,125 L 820,140 L 800,148 L 770,145
          L 740,142 L 710,145 L 680,148 L 650,145
          L 620,142 L 595,138 L 570,132 L 548,128
          L 532,118 Z
        "
      />

      {/* ── Middle East ── */}
      <path
        {...continentStyle}
        d="
          M 548,170 L 565,162 L 590,158 L 612,165
          L 620,180 L 615,198 L 600,208 L 580,210
          L 562,205 L 550,192 Z
        "
      />

      {/* ── South / SE Asia ── */}
      <path
        {...continentStyle}
        d="
          M 612,165 L 645,158 L 680,155 L 715,158
          L 740,168 L 748,185 L 740,202 L 720,215
          L 698,222 L 672,222 L 648,218 L 628,208
          L 615,195 Z
        "
      />
      {/* Indian subcontinent */}
      <path
        {...continentStyle}
        d="
          M 628,208 L 645,218 L 658,238 L 660,260
          L 650,278 L 635,285 L 622,278 L 615,258
          L 615,238 Z
        "
      />

      {/* ── SE Asia peninsula + islands ── */}
      <path
        {...continentStyle}
        d="
          M 720,215 L 738,225 L 748,245 L 742,265
          L 728,272 L 715,265 L 710,248 L 715,232 Z
        "
      />
      {/* Borneo */}
      <path {...continentStyle} d="M 755,265 L 775,258 L 788,272 L 782,290 L 762,295 L 750,282 Z" />
      {/* Sumatra */}
      <path {...continentStyle} d="M 700,278 L 725,268 L 740,280 L 732,298 L 710,302 L 698,292 Z" />
      {/* Java */}
      <path {...continentStyle} d="M 720,308 L 748,305 L 762,312 L 752,320 L 722,318 Z" />

      {/* ── China / E.Asia ── */}
      <path
        {...continentStyle}
        d="
          M 740,142 L 775,138 L 808,142 L 830,155
          L 832,172 L 820,188 L 800,198 L 778,202
          L 755,198 L 738,185 L 735,168 Z
        "
      />

      {/* ── Japan ── */}
      <path {...continentStyle} d="M 818,155 L 832,150 L 840,162 L 832,175 L 818,170 Z" />
      <path {...continentStyle} d="M 832,170 L 845,165 L 850,178 L 840,185 L 830,180 Z" />

      {/* ── Australia ── */}
      <path
        {...continentStyle}
        d="
          M 778,335 L 810,322 L 842,325 L 865,340
          L 872,362 L 865,385 L 845,400 L 818,405
          L 790,398 L 772,380 L 768,358 Z
        "
      />
      {/* Tasmania */}
      <path {...continentStyle} d="M 825,408 L 838,405 L 842,418 L 828,420 Z" />

      {/* ── New Zealand ── */}
      <path {...continentStyle} d="M 878,375 L 888,365 L 895,378 L 885,390 Z" />

      {/* ── Antarctica (thin strip) ── */}
      <path
        {...continentStyle}
        d="M 80,480 Q 250,470 500,472 Q 750,470 920,480 L 920,490 Q 750,485 500,483 Q 250,485 80,490 Z"
      />

      {/* ── Graticule: subtle lat/lng lines ── */}
      {/* Equator */}
      <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(0,200,100,0.08)" strokeWidth="0.8" strokeDasharray="4 6" />
      {/* Tropics */}
      <line x1="0" y1="205" x2="1000" y2="205" stroke="rgba(0,200,100,0.05)" strokeWidth="0.6" strokeDasharray="3 8" />
      <line x1="0" y1="295" x2="1000" y2="295" stroke="rgba(0,200,100,0.05)" strokeWidth="0.6" strokeDasharray="3 8" />
      {/* Prime meridian */}
      <line x1="500" y1="0" x2="500" y2="500" stroke="rgba(0,200,100,0.05)" strokeWidth="0.6" strokeDasharray="3 8" />
    </svg>
  );
}

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

          // Group users by country
          const countryMap: Record<string, { users: any[]; online: number }> = {};
          users.forEach((user: any) => {
            const country = user.country || 'Unknown';
            if (!countryMap[country]) {
              countryMap[country] = { users: [], online: 0 };
            }
            const group = countryMap[country];
            group.users.push(user);
            if (user.status === 'online') {
              group.online++;
            }
          });

          // Convert to map pins
          const pins: MapPin[] = Object.entries(countryMap)
            .map(([country, group]: [string, { users: any[]; online: number }]) => {
              const topUser = group.users[0];
              const onlineCount = group.online;
              const status: "online" | "offline" | "away" = onlineCount > 0 ? 'online' : 'away';
              return {
                country,
                city: topUser.city || 'Unknown',
                users: group.users.length,
                status,
                topUser: topUser.username || 'Unknown',
                device: topUser.device || 'Unknown',
                page: topUser.currentPage || 'Unknown',
              };
            })
            .filter((pin) => pin.country !== 'Unknown')
            .slice(0, 10);

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
            {mapPins.reduce((a, b) => a + b.users, 0)} active connections across {mapPins.length} countries
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
        {/* World map background */}
        <WorldMapBackground />

        {/* Pins layer */}
        <div className="absolute inset-0 p-4">
          <svg viewBox="0 0 1000 500" className="w-full" style={{ maxHeight: 300 }}>
            {mapPins.map((pin, i) => {
              const pos = pinPositions[pin.country] || { x: 500, y: 250 };
              const isOnline = pin.status === "online";
              return (
                <g
                  key={i}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => {
                    setHovered(pin);
                    setHoveredPos({ x: pos.x / 10, y: pos.y / 5 });
                  }}
                >
                  {isOnline && (
                    <circle cx={pos.x} cy={pos.y} r="22" fill="none" stroke="#10b981" strokeWidth="1.2" opacity="0.3">
                      <animate attributeName="r" values="12;26;12" dur="2.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={pos.x} cy={pos.y} r="7" fill={isOnline ? "#10b981" : "#f59e0b"} opacity="0.9" />
                  <circle cx={pos.x + 12} cy={pos.y - 12} r="12" fill={isOnline ? "#059669" : "#d97706"} />
                  <text
                    x={pos.x + 12}
                    y={pos.y - 12}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize="15"
                    fontWeight="700"
                  >
                    {pin.users}
                  </text>
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
              <p className="text-sm font-bold text-foreground">{hovered.country}</p>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono px-0.5">{hovered.city}</p>
            <div className="mt-2 pt-2 border-t border-border space-y-1.5">
              {([["Users", hovered.users], ["Top User", hovered.topUser], ["Device", hovered.device], ["Page", hovered.page]] as [string, string | number][]).map(([l, v]) => (
                <div key={l} className="flex justify-between gap-3 items-center">
                  <span className="text-[11px] text-muted-foreground">{l}</span>
                  <span className="text-[11px] font-semibold text-foreground">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Country chips ── */}
      <div className="px-6 py-4 border-t border-border flex gap-2 flex-wrap bg-muted/20">
        {mapPins.map((pin, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all hover:border-primary/40 cursor-default shadow-sm
              ${pin.status === "online"
                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                : "bg-amber-500/5 border-amber-500/20 text-amber-400"
              }`}
          >
            <span className="font-mono bg-background/40 px-1.5 py-0.5 rounded text-[11px]">{pin.users}</span>
            <span>{pin.country}</span>
          </div>
        ))}
      </div>
    </div>
  );
}