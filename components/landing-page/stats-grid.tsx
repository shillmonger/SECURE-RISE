"use client";
import { useEffect, useRef, useState } from "react";
import { Headphones, Globe, Users, Trophy, ArrowUpRight } from "lucide-react";

function useCounter(end: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setCount(Math.round(eased * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, active]);
  return count;
}

const TICKER_ITEMS = [
  "$20M+ Rewards", "83,000+ Traders", "160+ Countries",
  "160,000+ Community", "24/7 Support", "< 60s Response",
  "Trusted Worldwide", "Global Platform",
];

export default function StatsGrid() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setActive(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const rewards = useCounter(2, 1600, active);
  const traders = useCounter(900, 2000, active);
  const countries = useCounter(160, 1400, active);
  const community = useCounter(1000, 2200, active);

  const avatars = [
    "https://i.postimg.cc/0yJ0FsJS/LE-MAC.jpg",
    "https://i.pravatar.cc/150?u=21",
    "https://i.postimg.cc/LXVTD3gC/The-secret.jpg",
    "https://i.pravatar.cc/150?u=43",
    "https://i.pravatar.cc/150?u=54",
  ];

  return (
    <section
      ref={ref}
      className="mx-auto max-w-[1400px] px-4 lg:px-8 py-10 w-full"
    >
      {/* --- Header (Matches WhyPlatformSection Style) --- */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
          Numbers that speaks
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
          Join a global community of traders who trust our platform for reliable
          execution, deep liquidity, and industry-leading support.
        </p>
      </div>

      {/* --- Bento Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Rewards */}
        <div className="md:col-span-4 rounded-3xl border bg-card/50 border-primary/10 p-8 flex flex-col justify-between min-h-[280px] transition-all hover:-translate-y-1">
          <div>
            <p className="text-[10px] tracking-[.2em] uppercase text-muted-foreground mb-2 font-mono">
              Total Rewards Paid
            </p>
            <h3 className="text-6xl font-black tracking-tighter">
              ${active ? rewards : 0}<span className="text-primary">M+</span>
            </h3>
            <p className="mt-2 text-xs text-muted-foreground font-mono">
              +12.4% <span className="text-primary">↑</span> this quarter
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-widest uppercase text-muted-foreground/50 font-mono">All time</span>
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.3)]">
              <Trophy className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Traders */}
        <div className="md:col-span-4 rounded-3xl border bg-card/50 border-primary/10 p-8 flex flex-col justify-between min-h-[280px] transition-all hover:-translate-y-1">
          <div>
            <p className="text-[10px] tracking-[.2em] uppercase text-muted-foreground mb-2 font-mono">Active Traders</p>
            <h3 className="text-6xl font-black tracking-tighter">
              {active ? traders.toLocaleString() : "0"}<span className="text-primary">+</span>
            </h3>
          </div>
          <div>
            <p className="text-[10px] tracking-[.2em] uppercase text-muted-foreground mb-3 font-mono">Recently joined</p>
            <div className="flex items-center">
              {avatars.map((url, i) => (
                <img key={i} src={url} alt="trader"
                  className="w-12 h-12 rounded-full border-2 border-background -ml-3 first:ml-0 transition-all" />
              ))}
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-[10px] font-bold bg-primary/10 border-2 border-background text-primary -ml-3 font-mono">
                +82k
              </div>
            </div>
          </div>
        </div>

        {/* Countries */}
        <div className="md:col-span-4 rounded-3xl border bg-card/50 border-primary/10 p-8 flex flex-col justify-between min-h-[280px] relative overflow-hidden transition-all hover:-translate-y-1">
          <div className="relative z-10">
            <p className="text-[10px] tracking-[.2em] uppercase text-muted-foreground mb-2 font-mono">Countries</p>
            <h3 className="text-6xl font-black tracking-tighter">
              {active ? countries : 0}<span className="text-primary">+</span>
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">Global access, zero borders</p>
          </div>
          <Globe className="absolute -right-6 -bottom-6 w-32 h-32 text-primary/5" />
          <div className="relative z-10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] tracking-widest uppercase font-mono text-primary">Live in all regions</span>
          </div>
        </div>

        {/* Community */}
        <div className="md:col-span-7 rounded-3xl border bg-card/50 border-primary/10 p-8 flex  md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:-translate-y-1">
          <div>
            <p className="text-[10px] tracking-[.2em] uppercase text-muted-foreground mb-2 font-mono">Community Members</p>
            <h3 className="text-5xl font-black tracking-tighter">
              {active ? community.toLocaleString() : "0"}<span className="text-primary">+</span>
            </h3>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex gap-2 mb-2">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
               <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"><ArrowUpRight className="w-5 h-5 text-primary-foreground" /></div>
            </div>
            <p className="text-[10px] tracking-widest uppercase text-muted-foreground/40 font-mono">Telegram • X</p>
          </div>
        </div>

        {/* Support */}
        <div className="md:col-span-5 rounded-3xl border bg-card/50 border-primary/10 p-8 flex flex-col justify-between transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] tracking-widest uppercase font-mono text-primary">Online now</span>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">24/7 Expert Support</h3>
            </div>
            <Headphones className="w-8 h-8 text-primary/20" />
          </div>
          <div className="mt-4 rounded-xl px-4 py-2 text-[10px] tracking-widest uppercase font-mono text-muted-foreground bg-primary/5 border border-primary/10">
            Avg response &lt; 60 seconds
          </div>
        </div>
      </div>

      {/* --- Ticker --- */}
      <div className="mt-12 py-4 border-y border-primary/5 overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap animate-[ticker_30s_linear_infinite]">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-[10px] tracking-[.3em] uppercase text-muted-foreground/30 font-mono flex items-center gap-4">
              {item} <span className="w-1 h-1 rounded-full bg-primary/20" />
            </span>
          ))}
        </div>
      </div>

      {/* --- CTA --- */}
      <div className="mt-10 text-center">
        <button className="bg-primary cursor-pointer text-primary-foreground px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform flex items-center gap-3 mx-auto shadow-xl shadow-primary/20">
          Get Started Now
          <ArrowUpRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}