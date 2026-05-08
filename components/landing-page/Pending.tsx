"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
});

const IMAGES = [
  "https://i.postimg.cc/ZnDX5Ff3/5.jpg",
  "https://i.postimg.cc/VvF1MffN/Bull-and-Bear.jpg",
  "https://i.postimg.cc/9Q9sc9yF/6.jpg",
];

// ── Forex / Crypto stat rows ─────────────────────────────────────
const MARKET_PAIRS = [
  { pair: "EUR/USD", price: "1.0842", change: "+0.18%", up: true },
  { pair: "GBP/USD", price: "1.2671", change: "-0.09%", up: false },
  { pair: "USD/JPY", price: "157.34", change: "+0.31%", up: true },
];

const CRYPTO_PAIRS = [
  { pair: "BTC/USDT", price: "$67,420", change: "+2.4%", up: true },
  { pair: "ETH/USDT", price: "$3,512", change: "+1.8%", up: true },
  { pair: "SOL/USDT", price: "$172.6", change: "-0.7%", up: false },
];

const SIGNAL_ITEMS = [
  { label: "Strong Buy", pair: "XAU/USD", conf: "94%" },
  { label: "Sell Signal", pair: "EUR/GBP", conf: "81%" },
  { label: "Strong Buy", pair: "BTC/USD", conf: "88%" },
];

export default function AIGenerationSection() {
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const configRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const lightningRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const [imgIndex, setImgIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setImgIndex((i) => (i + 1) % IMAGES.length);
        setFading(false);
      }, 600);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  function getRect(el: HTMLElement, container: HTMLElement) {
    const er = el.getBoundingClientRect();
    const cr = container.getBoundingClientRect();
    return {
      x: er.left - cr.left + er.width / 2,
      y: er.top - cr.top + er.height / 2,
      left: er.left - cr.left,
      right: er.left - cr.left + er.width,
      top: er.top - cr.top,
      bottom: er.top - cr.top + er.height,
      w: er.width,
      h: er.height,
    };
  }

  const drawLines = useCallback(() => {
    const svg = svgRef.current;
    const canvas = canvasRef.current;
    const config = configRef.current;
    const prompt = promptRef.current;
    const lightning = lightningRef.current;
    const settings = settingsRef.current;
    const result = resultRef.current;

    if (!svg || !canvas || !config || !prompt || !lightning || !settings || !result) return;

    const cr = canvas.getBoundingClientRect();
    const W = cr.width;
    const H = cr.height;

    svg.setAttribute("width", String(W));
    svg.setAttribute("height", String(H));
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    // clip lines to stay within canvas bounds — no overflow
    svg.style.overflow = "hidden";
    svg.innerHTML = "";

    const ns = "http://www.w3.org/2000/svg";
    const strokeColor = "hsl(var(--primary))";

    // Clip rectangle — lines won't render outside this
    const clipId = "line-clip";
    const defs = document.createElementNS(ns, "defs");
    const clipPath = document.createElementNS(ns, "clipPath");
    clipPath.setAttribute("id", clipId);
    const clipRect = document.createElementNS(ns, "rect");
    clipRect.setAttribute("x", "0");
    clipRect.setAttribute("y", "0");
    clipRect.setAttribute("width", String(W));
    clipRect.setAttribute("height", String(H));
    clipPath.appendChild(clipRect);
    defs.appendChild(clipPath);
    svg.appendChild(defs);

    const g = document.createElementNS(ns, "g");
    g.setAttribute("clip-path", `url(#${clipId})`);
    svg.appendChild(g);

    function curve(x1: number, y1: number, x2: number, y2: number) {
      const path = document.createElementNS(ns, "path");
      const mx = (x1 + x2) / 2;
      path.setAttribute("d", `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`);
      path.setAttribute("stroke", strokeColor);
      path.setAttribute("stroke-width", "1.5");
      path.setAttribute("fill", "none");
      path.setAttribute("opacity", "0.55");
      g.appendChild(path);
    }

    function straight(x1: number, y1: number, x2: number, y2: number) {
      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", `M${x1},${y1} L${x2},${y2}`);
      path.setAttribute("stroke", strokeColor);
      path.setAttribute("stroke-width", "1.5");
      path.setAttribute("fill", "none");
      path.setAttribute("opacity", "0.55");
      g.appendChild(path);
    }

    function dot(x: number, y: number) {
      // Only draw dot if it's within canvas bounds
      if (x < 0 || x > W || y < 0 || y > H) return;
      const c = document.createElementNS(ns, "circle");
      c.setAttribute("cx", String(x));
      c.setAttribute("cy", String(y));
      c.setAttribute("r", "3.5");
      c.setAttribute("fill", strokeColor);
      c.setAttribute("opacity", "0.9");
      g.appendChild(c);
    }

    const C = getRect(config, canvas);
    const P = getRect(prompt, canvas);
    const L = getRect(lightning, canvas);
    const S = getRect(settings, canvas);
    const R = getRect(result, canvas);

    // Config right → Prompt left
    curve(C.right, C.y, P.left, P.y);
    dot(C.right, C.y);
    dot(P.left, P.y);

    // Prompt bottom → Lightning top
    straight(P.x, P.bottom, L.x, L.top);
    dot(P.x, P.bottom);
    dot(L.x, L.top);

    // Lightning bottom → Settings top
    straight(L.x, L.bottom, S.x, S.top);
    dot(L.x, L.bottom);
    dot(S.x, S.top);

    // Settings right → Result left (upper third of result)
    const resultConnectY = R.top + R.h * 0.3;
    curve(S.right, S.y, R.left, resultConnectY);
    dot(S.right, S.y);
    dot(R.left, resultConnectY);
  }, []);

  useEffect(() => {
    const timer = setTimeout(drawLines, 150);
    window.addEventListener("resize", drawLines);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", drawLines);
    };
  }, [drawLines]);

  return (
    <section className="relative w-full overflow-hidden bg-background py-16 md:py-24">
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[140px] z-0" />

      {/* ── Section Header — left-aligned ── */}
      <div
        className={`relative z-10 mb-16 px-8 xl:px-16 max-w-[1440px] mx-auto ${montserrat.className}`}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          Live Markets
        </div>
        <h2
          className={`${montserrat.className} text-4xl md:text-5xl xl:text-5xl font-black uppercase tracking-tight text-foreground mb-4`}
        >
          Trade Smarter
        </h2>
        <p className="text-muted-foreground max-w-xl text-base md:text-lg">
          Real-time forex &amp; crypto signals, live market data, and AI-driven execution — all in one pipeline.
        </p>
      </div>

      {/* ── MOBILE LAYOUT ── */}
      <div className="lg:hidden relative z-10 px-5 flex flex-col gap-5 items-center max-w-sm mx-auto">
        <MobileCard label="Forex Markets" icon="💱">
          {MARKET_PAIRS.map((p) => (
            <PairRow key={p.pair} {...p} />
          ))}
        </MobileCard>

        <MobileCard label="Signal Engine" icon="⚡">
          {SIGNAL_ITEMS.map((s) => (
            <SignalRow key={s.pair} {...s} />
          ))}
        </MobileCard>

        <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-primary text-lg">
          ⚡
        </div>

        <MobileCard label="Crypto Markets" icon="₿">
          {CRYPTO_PAIRS.map((p) => (
            <PairRow key={p.pair} {...p} />
          ))}
        </MobileCard>

        <MobileCard label="Live Chart" icon="📈">
          <div className="relative h-48 mt-2 rounded-xl overflow-hidden">
            <img
              src={IMAGES[imgIndex]}
              alt="Market chart"
              className="w-full h-full object-cover rounded-xl"
              style={{ opacity: fading ? 0 : 1, transition: "opacity 0.6s ease" }}
            />
          </div>
        </MobileCard>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div
        ref={canvasRef}
        className="hidden lg:grid relative z-10 mx-auto max-w-[1440px] px-8 xl:px-16"
        style={{
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "0 2rem",
          alignItems: "center",
          minHeight: 520,
        }}
      >
        {/* SVG — strictly clipped to canvas, no overflow */}
        <svg
          ref={svgRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 2,
            overflow: "hidden",
          }}
          aria-hidden="true"
        />

        {/* LEFT — Forex Markets */}
        <div className="flex items-center z-10" ref={configRef}>
          <div className="relative w-full rounded-2xl bg-card border border-border p-5">
            <GreenDot />
            <CardLabel>Forex Markets</CardLabel>
            <div className="flex flex-col gap-2.5">
              {MARKET_PAIRS.map((p) => (
                <PairRow key={p.pair} {...p} />
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                Spread
              </span>
              <span className="text-[10px] font-bold text-primary">From 0.0 pips</span>
            </div>
          </div>
        </div>

        {/* CENTER — Signal Engine + lightning + Crypto */}
        <div className="flex flex-col items-center gap-4 z-10">
          {/* Signal Engine */}
          <div
            ref={promptRef}
            className="relative w-full rounded-2xl bg-card border border-border p-5"
          >
            <GreenDot />
            <CardLabel>Signal Engine</CardLabel>
            <div className="flex flex-col gap-2.5">
              {SIGNAL_ITEMS.map((s) => (
                <SignalRow key={s.pair} {...s} />
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary">
                AI-Powered
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary">
                Live Feed
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary">
                24/7
              </span>
            </div>
          </div>

          {/* Lightning Node */}
          <div
            ref={lightningRef}
            className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center z-10 shadow-[0_0_12px_hsl(var(--primary)/0.2)]"
          >
            <span className="text-primary text-lg">⚡</span>
          </div>

          {/* Crypto Markets */}
          <div
            ref={settingsRef}
            className="relative w-full rounded-2xl bg-card border border-border p-5"
          >
            <GreenDot />
            <CardLabel>Crypto Markets</CardLabel>
            <div className="flex flex-col gap-2.5">
              {CRYPTO_PAIRS.map((p) => (
                <PairRow key={p.pair} {...p} />
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                Leverage
              </span>
              <span className="text-[10px] font-bold text-primary">Up to 100×</span>
            </div>
          </div>
        </div>

        {/* RIGHT — Live Chart */}
        <div className="flex items-start justify-end z-10" ref={resultRef}>
          <div className="relative w-full rounded-2xl bg-card border border-border p-5">
            <GreenDot />
            <CardLabel>Live Chart</CardLabel>

            {/* Stacked image */}
            <div className="relative h-56 mt-2">
              <div
                className="absolute rounded-xl bg-card border border-border"
                style={{
                  top: 10, left: 10, right: -8, bottom: -8,
                  transform: "rotate(3.5deg)",
                  zIndex: 0, opacity: 0.45,
                }}
              />
              <div
                className="absolute rounded-xl bg-card border border-border"
                style={{
                  top: 5, left: 5, right: -4, bottom: -4,
                  transform: "rotate(1.5deg)",
                  zIndex: 1, opacity: 0.7,
                }}
              />
              <div
                className="absolute inset-0 rounded-xl overflow-hidden z-10"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <img
                  key={imgIndex}
                  src={IMAGES[imgIndex]}
                  alt="Market chart"
                  className="w-full h-full object-cover"
                  style={{ opacity: fading ? 0 : 1, transition: "opacity 0.6s ease" }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, hsl(var(--background)/0.45) 0%, transparent 55%)",
                  }}
                />
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-1.5 mt-5">
              {IMAGES.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === imgIndex ? 16 : 6,
                    height: 6,
                    background: i === imgIndex ? "hsl(var(--primary))" : "hsl(var(--border))",
                  }}
                />
              ))}
            </div>

            {/* Market summary row */}
            <div className="mt-4 pt-3 border-t border-border grid grid-cols-2 gap-3">
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-0.5">
                  24h Volume
                </p>
                <p className="text-sm font-bold text-foreground">$4.2B</p>
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-0.5">
                  Open Trades
                </p>
                <p className="text-sm font-bold text-foreground">1,284</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Sub-components ── */

function PairRow({
  pair,
  price,
  change,
  up,
}: {
  pair: string;
  price: string;
  change: string;
  up: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
      <div className="flex items-center gap-2">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: up ? "hsl(var(--primary))" : "#ef4444" }}
        />
        <span className="text-xs font-bold text-foreground">{pair}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-muted-foreground">{price}</span>
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded"
          style={{
            color: up ? "hsl(var(--primary))" : "#ef4444",
            background: up ? "hsl(var(--primary)/0.1)" : "rgba(239,68,68,0.1)",
          }}
        >
          {change}
        </span>
      </div>
    </div>
  );
}

function SignalRow({
  label,
  pair,
  conf,
}: {
  label: string;
  pair: string;
  conf: string;
}) {
  const isBuy = label.toLowerCase().includes("buy");
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
      <div className="flex items-center gap-2">
        <span
          className="text-[9px] font-bold px-2 py-0.5 rounded"
          style={{
            color: isBuy ? "hsl(var(--primary))" : "#ef4444",
            background: isBuy ? "hsl(var(--primary)/0.12)" : "rgba(239,68,68,0.12)",
            border: `1px solid ${isBuy ? "hsl(var(--primary)/0.3)" : "rgba(239,68,68,0.3)"}`,
          }}
        >
          {label}
        </span>
        <span className="text-xs font-semibold text-foreground">{pair}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-muted-foreground">Conf.</span>
        <span className="text-[10px] font-bold text-primary">{conf}</span>
      </div>
    </div>
  );
}

function GreenDot() {
  return (
    <div className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_hsl(var(--primary)/0.8)]" />
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
      {children}
    </p>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-2.5 mb-1.5 first:mt-0">
      {children}
    </p>
  );
}

function MobileCard({
  label,
  icon,
  children,
}: {
  label: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full rounded-2xl bg-card border border-border p-4">
      <GreenDot />
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
        {icon} {label}
      </p>
      {children}
    </div>
  );
}