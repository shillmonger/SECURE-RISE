"use client";

import { useState } from "react";
import Image from "next/image";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const LEFT_FEATURES = [
  {
    title: "Daily Predictions",
    desc: "Make one prediction per day on major crypto pairs. Test your market analysis skills with no risk to your capital.",
  },
  {
    title: "Real-Time Price Tracking",
    desc: "Monitor live prices from CoinGecko API. Entry prices are captured automatically at submission for fair outcomes.",
  },
  {
    title: "XP Rewards System",
    desc: "Earn 1000 XP for every correct prediction. Accumulate XP over time and convert to USDT at 50 XP = 1 USDT.",
  },
];

const RIGHT_FEATURES = [
  {
    title: "Risk-Free Trading",
    desc: "No capital required to participate. Predict Market is completely free—only rewards, no losses.",
  },
  {
    title: "Leaderboard Rankings",
    desc: "Compete with other traders for top positions. Track your win rate, total XP, and prediction streaks.",
  },
  {
    title: "Instant Processing",
    desc: "Predictions are processed daily at midnight. Results are emailed automatically and XP credited instantly.",
  },
];

function FeatureItem({
  title,
  desc,
  align,
  index,
  visible,
}: {
  title: string;
  desc: string;
  align: "left" | "right";
  index: number;
  visible: boolean;
}) {
  const isLeft = align === "left";

  return (
    <div
      className="flex items-start gap-4"
      style={{
        flexDirection: isLeft ? "row-reverse" : "row",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(24px)`,
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s`,
      }}
    >
      {/* Dot */}
      <div className="shrink-0 mt-1 h-8 w-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
        <span className="h-2.5 w-2.5 rounded-full bg-primary block" />
      </div>

      {/* Text */}
      <div className={isLeft ? "text-right" : "text-left"}>
        <h3
          className={`${montserrat.className} text-foreground font-extrabold text-base xl:text-lg mb-1.5 leading-tight`}
        >
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px]">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  const visible = true;

  return (
    <section
      className="relative w-full overflow-hidden bg-background py-5 md:py-17"
    >
      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow behind phone */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] z-0" />

      {/* ── SECTION HEADER ── */}
      <div
        className="relative z-10 text-center mb-8 px-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-bold uppercase tracking-widest mb-4">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          Predict Market Features
        </div>
        <h2
          className={`${montserrat.className} text-4xl mb-4 md:text-5xl xl:text-4xl font-black uppercase tracking-tight text-foreground`}
        >
          Core Capabilities
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
          Test your market analysis skills with our risk-free prediction system. Earn XP rewards, climb the leaderboard,
          and convert your predictions to real USDT—all without risking your capital.
        </p>
      </div>

      {/* ── MOBILE LAYOUT (< lg) ── */}
      <div className="lg:hidden relative z-10 px-5 flex flex-col items-center gap-10">
        <div
          className="relative flex justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.7s ease 0.2s",
          }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-100 h-16 bg-primary/20 blur-3xl rounded-full" />
          <Image
            src="https://i.postimg.cc/7YqZDFhS/phone-full.png"
            alt="Scale Rise App"
            width={450}
            height={900}
            className="relative z-10 object-contain drop-shadow-2xl w-[100vw] max-w-[300px]"
            priority
          />
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[...LEFT_FEATURES, ...RIGHT_FEATURES].map((f, i) => (
            <FeatureItem
              key={i}
              title={f.title}
              desc={f.desc}
              align="right"
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>



      {/* ── DESKTOP LAYOUT (lg+) ── */}
      <div className="hidden lg:grid relative z-10 mx-auto max-w-[1440px] px-8 xl:px-12"
        style={{
          gridTemplateColumns: "1fr 400px 1fr", // Increased center column width
          gap: "0 2rem",
          alignItems: "center",
        }}
      >
        {/* LEFT FEATURES */}
        <div className="flex flex-col gap-5 xl:gap-25">
          {LEFT_FEATURES.map((f, i) => (
            <FeatureItem
              key={i}
              title={f.title}
              desc={f.desc}
              align="left"
              index={i}
              visible={visible}
            />
          ))}
        </div>

        {/* CENTER PHONE (Enlarged) */}
        <div
          className="relative flex justify-center items-center py-4"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease 0.1s",
          }}
        >
          {/* <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-10 bg-primary/30 blur-3xl rounded-full z-500" /> */}
          <Image
            src="https://i.postimg.cc/7YqZDFhS/phone-full.png"
            alt="Scale Rise App"
            width={400} 
            height={800}
            className="relative z-10 object-contain drop-shadow-[0_0_40px_rgba(var(--primary),0.15)] w-[360px] xl:w-[400px]"
            priority
          />
        </div>

        {/* RIGHT FEATURES */}
        <div className="flex flex-col gap-5 xl:gap-25">
          {RIGHT_FEATURES.map((f, i) => (
            <FeatureItem
              key={i}
              title={f.title}
              desc={f.desc}
              align="right"
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}