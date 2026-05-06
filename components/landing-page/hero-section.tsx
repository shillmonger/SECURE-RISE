"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const AVATARS = [
  "https://i.postimg.cc/0yJ0FsJS/LE-MAC.jpg",
  "https://i.postimg.cc/rFsJGWVf/Kamala-Harris.jpg",
  "https://i.postimg.cc/mZ8jFVsy/Nailed-it.jpg",
  "https://i.postimg.cc/LXVTD3gC/The-secret.jpg",
];

const BOTTOM_STATS = [
  {
    label: "Stat Overview",
    value: "Scale Rise",
    sub: "New Opportunities",
  },
  { label: "#1 Platform", value: "Top Rated", sub: "Investment Platform" },
  { label: "Trading Plans", value: "250+", sub: "Investment Options" },
  // { label: "Active Users", value: "1.2K+", sub: "Trading" },
  { label: "Avg Daily ROI", value: "10%", sub: "Daily Returns" },
];

const Counter = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count.toLocaleString()}</>;
};

export default function HeroSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="min-h-screen bg-background" />;

  return (
    <section className="relative w-full bg-background flex flex-col min-h-screen">
      {/* MAIN CONTENT GRID - Adjusted to 5-4-3 layout */}
      <div className="flex-1 relative z-10 mx-auto w-full max-w-[1440px] px-6 lg:px-12 flex flex-col lg:grid lg:grid-cols-12 gap-0 pt-20 lg:pt-5 items-center">



        {/* LEFT COLUMN: Expanded to span 5 columns */}
        <div className="lg:col-span-6 space-y-8 lg:text-left z-20 py-10 lg:pt-30 lg:pb-20">
          {/* TAGLINE */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            You Invest • We Trade
          </div>

          <div className="space-y-5">
            <h1
              className={`${montserrat.className} text-3xl md:text-5xl xl:text-5xl font-black leading-[1.1] uppercase`}
            >
              We connect your funds to {" "}
              <span className="text-blue-500">skilled traders.</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto lg:mx-0">
              Trade on Bitcoin, Gold, Oil, Apple, Tesla and 6,400+ other
              world-renowned markets. Our institutional-grade platform ensures
              your capital scales with precision.
            </p>
          </div>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4">
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8 py-6 cursor-pointer text-sm font-bold rounded-xl border-border bg-background/50 backdrop-blur-md hover:bg-muted transition-all"
            >
              <Link href="/auth-page/login" className="flex items-center gap-2">
                SIGN IN NOW
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto px-8 py-6 cursor-pointer text-sm font-extrabold rounded-xl hover:scale-105 transition-transform"
            >
              <Link
                href="/auth-page/register"
                className="flex items-center gap-2"
              >
                $20 ON SIGNUP
              </Link>
            </Button>

          </div>

          <div className="flex items-center justify-start lg:justify-start gap-4 flex-wrap pt-2">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground leading-none mb-1">
                10%
              </span>
              <span className="text-[9px] uppercase tracking-widest font-semibold text-muted-foreground">
                Avg. Daily ROI
              </span>
            </div>
            <div className="h-7 w-px bg-border" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground leading-none mb-1">
                256-bit
              </span>
              <span className="text-[9px] uppercase tracking-widest font-semibold text-muted-foreground">
                AES Encryption
              </span>
            </div>
            <div className="h-7 w-px bg-border" />
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2.5">
                {AVATARS.map((src, i) => (
                  <div
                    key={i}
                    className="h-12 w-12 cursor-pointer rounded-full border-2 border-primary bg-background overflow-hidden"
                  >
                    <img
                      src={src}
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground leading-none mb-1">
                  10.2K+
                </span>
                <span className="text-[9px] uppercase tracking-widest font-semibold text-muted-foreground">
                  Realtime Users
                </span>
              </div>
            </div>
          </div>
        </div>




        {/* CENTER COLUMN: Spans 4 columns */}
        <div className="lg:col-span-4 flex justify-center items-end h-full relative min-h-[450px] lg:min-h-100">
          <div className="relative w-full max-w-[320px] lg:max-w-[350px] h-full flex items-end justify-center">
            <Image
              src="https://i.postimg.cc/QxmVCMZ7/phone-half.png"
              alt="Trading Interface"
              width={450}
              height={900}
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>




        {/* RIGHT COLUMN: Narrowed to 3 columns */}
        <div className="lg:col-span-2 space-y-10 py-10 lg:py-0 lg:pl-x0 z-20 lg:text-left">
          <div>
            <h2
              className={`${montserrat.className} text-4xl xl:text-4xl font-black`}
            >
              <Counter target={10000} /> +
            </h2>
            <p className="text-primary font-bold text-sm tracking-widest uppercase mt-2">
              Global Traders
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold uppercase leading-tight">
              Advanced technology
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mx-auto lg:mx-0">
              We are bringing the future of AI trading technology to companies
              worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM STATS BAR */}
      <div className="relative z-30 border-t border-border bg-background w-full pb-5 lg:pb-15">
        <div className="mx-auto max-w-[1440px] px-0 lg:px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
            {BOTTOM_STATS.map((item, i) => (
              <div key={i} className="flex flex-col p-6 space-y-1">
                <span className="text-sm lg:text-sm font-bold uppercase tracking-tighter text-foreground">
                  {item.label}
                </span>
                <span className="text-sm text-muted-foreground leading-none">
                  {item.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
