"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const LEFT_FEATURES = [
  {
    title: "Comprehensive Portfolio",
    desc: "Access detailed analytics that empower you to make informed investment decisions at every step.",
  },
  {
    title: "Real Time Market Data",
    desc: "Monitor trends, track asset performance, and seize opportunities as they unfold in live markets.",
  },
  {
    title: "Trailing Features",
    desc: "Follow price movements and execute sell/buy orders automatically wherever the market moves.",
  },
];

const RIGHT_FEATURES = [
  {
    title: "Speed",
    desc: "Our lightweight data architecture makes Scale Rise one of the fastest platforms for processing transactions.",
  },
  {
    title: "Privacy",
    desc: "Scale Rise will never share your data without your explicit permission. Your security is our priority.",
  },
  {
    title: "Diversified Portfolio",
    desc: "Our risk management approach invests across every sector to deliver consistent returns for our investors.",
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
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-background py-5 md:py-20"
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
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[600px] rounded-full bg-primary/10 blur-[120px] z-0" />

      {/* ── SECTION HEADER ── */}
      <div
        className="relative z-10 text-center mb-10 px-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          Platform Features
        </div>
        <h2
          className={`${montserrat.className} text-4xl mb-6 md:text-5xl xl:text-5xl font-black uppercase tracking-tight text-foreground`}
        >
          Core Capabilities
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
          Connect with an elite network of global investors leveraging our institutional-grade infrastructure for seamless execution, 
          deep market liquidity, and dedicated 24/7 technical expertise
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
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-16 bg-primary/30 blur-3xl rounded-full z-0" />
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