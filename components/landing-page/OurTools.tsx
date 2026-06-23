"use client";
import React from "react";

// ─────────────────────────────────────────────
// TRADING PLATFORMS, AI & CODE TOOLS ICONS DATA
// level: 0 = front (fully visible), 1, 2, 3 = progressively further back
// ─────────────────────────────────────────────
const icons = [
  // ── Front row (level 0) - Core Trading & Platforms ──
  { id: 3, src: "https://i.postimg.cc/pLhcx2Vd/bitcoin-128.png", alt: "MT4", level: 0 },
  { id: 1, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", alt: "Python AI", level: 0 },
  { id: 5, src: "https://i.postimg.cc/nLKkcr6W/tether-128.png", alt: "USDT Trading", level: 0 },
  { id: 4, src: "https://i.postimg.cc/FzHG6vnh/solana-128.png", alt: "MT5", level: 0 },
  { id: 6, src: "https://i.postimg.cc/gJNH85kG/ethereum-128.png", alt: "BTC Analytics", level: 0 },
  { id: 2, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg", alt: "VS Code", level: 0 },
  { id: 7, src: "https://i.postimg.cc/NGCx0WzT/usdc-128.png", alt: "ETH Analytics", level: 0 },
  { id: 8, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", alt: "Tailwind", level: 0 },

  // ── Second row (level 1) - Brokerages & Web APIs ──
  { id: 12, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", alt: "Node.js API", level: 1 },
  { id: 13, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", alt: "JS Engines", level: 1 },
  { id: 14, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", alt: "TypeScript Execution", level: 1 },
  { id: 15, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", alt: "MongoDB", level: 1 },
  { id: 16, src: "https://i.postimg.cc/FzxYYWzf/apple.jpg", alt: "Express.js Engine", level: 1 },
  { id: 17, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg", alt: "FastAPI AI", level: 1 },
  { id: 18, src: "https://i.postimg.cc/hGxPJyZH/XBOX.jpg", alt: "Git Versioning", level: 1 },

  // ── Third row (level 2) - Supplementary Infrastructure ──
  { id: 24, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg", alt: "Redis Cache", level: 2 },
  { id: 25, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", alt: "PostgreSQL Engine", level: 2 },
  { id: 26, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", alt: "Docker", level: 2 },
  { id: 27, src: "https://i.postimg.cc/3RXRqSg2/Google-Play.jpg", alt: "AWS Servers", level: 2 },
  { id: 28, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg", alt: "Google Cloud Engine", level: 2 },
  { id: 29, src: "https://i.postimg.cc/VNb5qL58/Steam.jpg", alt: "GitHub Automation", level: 2 },

  // ── Fourth row (level 3) - Core Low Level Frameworks ──
  { id: 34, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg", alt: "Linux OS", level: 3 },
  { id: 35, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", alt: "C++ HFT Systems", level: 3 },
  { id: 36, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg", alt: "C# Automated Scripts", level: 3 },
  { id: 37, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg", alt: "Nginx Loadbalancer", level: 3 },
];

// ─────────────────────────────────────────────
// LEVEL CONFIG  – depth layers matching layout
// ─────────────────────────────────────────────
const levelConfig: Record<number, {
  opacity: number;
  blur: number;
  scale: number;
  zIndex: number;
  cardSize: number;
  verticalShift: number;
  floatAmplitude: number;
}> = {
  0: { opacity: 1,    blur: 0,   scale: 1,    zIndex: 40, cardSize: 72, verticalShift: 0,    floatAmplitude: 4 },
  1: { opacity: 0.65, blur: 0.5, scale: 0.84,  zIndex: 30, cardSize: 60, verticalShift: -60,  floatAmplitude: 5 },
  2: { opacity: 0.35, blur: 1.5, scale: 0.68,  zIndex: 20, cardSize: 50, verticalShift: -110, floatAmplitude: 6 },
  3: { opacity: 0.15, blur: 3.0, scale: 0.55,  zIndex: 10, cardSize: 42, verticalShift: -150, floatAmplitude: 4 },
};

function getArcOffset(indexInRow: number, rowLength: number, curvature = 24) {
  const t = rowLength <= 1 ? 0 : (indexInRow / (rowLength - 1)) * 2 - 1; 
  return curvature * t * t; 
}

export default function TradingToolsSection() {
  // Group icons by depth level
  const byLevel = [0, 1, 2, 3].map((lvl) =>
    icons.filter((ic) => ic.level === lvl)
  );

  return (
    <section id="tools" className="mx-auto max-w-[1400px] px-0 lg:px-8 pb-10 w-full">
      {/* Dynamic Style Injection for Floating Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatCard {
          from { transform: translateY(0px); }
          to   { transform: translateY(var(--float-gap, 5px)); }
        }
      `}} />

      {/* Header Container */}
     <div className="text-center mb-0 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-[.2em] mb-4 text-primary">
          Ecosystem
        </div>
        <h2 className="text-4xl md:text-4xl font-black uppercase tracking-tighter mb-6 leading-none">
          Trading <span className="text-primary">Tools</span>
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto text-base md:text-lg font-light leading-relaxed">
          Everything you need to know about the SECURE RISE ecosystem. 
          From registration bonuses to our institutional-grade trading cycles.
        </p>
      </div>

      {/* Interactive Visual Icon Stage */}
      <div className="relative w-full overflow-hidden flex items-end justify-center min-h-[300px] -mt-5 md:-mt-3">
        <div className="relative w-full max-w-7xl mx-auto px-4 h-[300px]">

          {/* Render layers stack back-to-front (3 -> 0) */}
          {[3, 2, 1, 0].map((lvl) => {
            const cfg = levelConfig[lvl];
            return (
              <div
                key={lvl}
                className="absolute left-0 right-0 bottom-0 flex items-end justify-center gap-4 sm:gap-6 md:gap-8"
                style={{ zIndex: cfg.zIndex, paddingBottom: "24px" }}
              >
                {byLevel[lvl].map((icon, i) => {
                  const arcY = getArcOffset(i, byLevel[lvl].length, 26);
                  const floatDur = 5 + ((icon.id * 7) % 4);
                  const floatDelay = (icon.id * 0.35) % 4;

                  return (
                    <div
                      key={icon.id}
                      className="relative flex-shrink-0 transition-transform duration-300"
                      style={{
                        zIndex: cfg.zIndex,
                        transform: `translateY(${-(cfg.verticalShift === 0 ? 0 : -cfg.verticalShift) - arcY}px)`,
                      }}
                    >
                      <div
                        style={{
                          opacity: cfg.opacity,
                          filter: cfg.blur > 0 ? `blur(${cfg.blur}px)` : undefined,
                          width: cfg.cardSize,
                          height: cfg.cardSize,
                          animation: `floatCard ${floatDur}s ease-in-out ${floatDelay}s infinite alternate`,
                          // Assign custom property value to feed CSS keyframe template
                          StylePropertyMap: `calc(${cfg.floatAmplitude}px)`
                        } as React.CSSProperties}
                      >
                        <div
                          className={`w-full h-full rounded-2xl flex items-center justify-center border transition-colors ${
                            lvl === 0
                              ? "bg-card border-primary/40 shadow-xl shadow-primary/5"
                              : "bg-card/40 border-primary/10"
                          }`}
                          style={{
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          <img
                            src={icon.src}
                            alt={icon.alt}
                            draggable={false}
                            className="object-contain select-none transition-opacity duration-300"
                            style={{
                              width: cfg.cardSize * 0.54,
                              height: cfg.cardSize * 0.54,
                            }}
                            onError={(e) => {
                              e.currentTarget.style.opacity = "0.2";
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Clean Bottom Gradient Blend Line */}
          <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none bg-gradient-to-t from-background to-transparent" />
        </div>
      </div>
    </section>
  );
}