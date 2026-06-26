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
  "https://github.com/shadcn.png",
  "https://github.com/shadcn.png",
  "https://github.com/shadcn.png",
  "https://github.com/shadcn.png",
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
  const [userAvatars, setUserAvatars] = useState(AVATARS);

  useEffect(() => {
    setIsMounted(true);
    fetchRandomUsers();
  }, []);

  const fetchRandomUsers = async () => {
    try {
      const response = await fetch('/api/users/random');
      const data = await response.json();
      if (data.success && data.users) {
        const avatarUrls = data.users.map((user: any) => user.profileImage);
        setUserAvatars(avatarUrls);
      }
    } catch (error) {
      console.error('Failed to fetch random users:', error);
      // Keep using default avatars on error
    }
  };

  if (!isMounted) return <div className="min-h-screen bg-background" />;

  return (
    <section className="relative w-full bg-background flex flex-col min-h-screen">
      {/* MAIN CONTENT GRID - Adjusted to 5-4-3 layout */}
      <div className="flex-1 relative z-10 mx-auto w-full max-w-[1440px] px-6 lg:px-12 flex flex-col lg:grid lg:grid-cols-12 gap-0 pt-20 lg:pt-5 items-center">



        {/* LEFT COLUMN */}
        <div className="lg:col-span-6 space-y-8 lg:text-left z-20 py-10 lg:pt-30 lg:pb-20">
          {/* TAGLINE */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Predict • Earn • Dominate
          </div>

          <div className="space-y-5">
            <h1
              className={`${montserrat.className} text-3xl md:text-5xl xl:text-5xl font-black leading-[1.1] uppercase`}
            >
              Predict the market.{" "}
              <span className="text-[#229ED9]">Get rewarded with $20 every day.</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto lg:mx-0">
              Predict whether crypto or forex pairs will close bullish or bearish. One prediction per day — get it right and earn <strong className="text-foreground">+1000 XP</strong> instantly. Rewards are processed automatically at midnight.
            </p>
          </div>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8 py-7 cursor-pointer text-sm font-bold rounded-xl border-border bg-background/50 backdrop-blur-md hover:bg-muted transition-all"
            >
              <Link href="/auth-page/login" className="flex items-center gap-2">
                SIGN IN NOW
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto px-8 py-7 cursor-pointer text-sm font-extrabold rounded-xl hover:scale-105 transition-transform"
            >
              <Link
                href="/auth-page/register"
                className="flex items-center gap-2"
              >
                START PREDICTING
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-start lg:justify-start gap-4 flex-wrap pt-2">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground leading-none mb-1">
                +1000
              </span>
              <span className="text-[9px] uppercase tracking-widest font-semibold text-muted-foreground">
                XP Per Correct Call
              </span>
            </div>
            <div className="h-7 w-px bg-border" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground leading-none mb-1">
                12:00 AM
              </span>
              <span className="text-[9px] uppercase tracking-widest font-semibold text-muted-foreground">
                Daily Reset
              </span>
            </div>
            <div className="h-7 w-px bg-border" />
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2.5">
                {userAvatars.map((src, i) => (
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
                  Active Predictors
                </span>
              </div>
            </div>
          </div>
        </div>




{/* CENTER COLUMN */}
        <div className="lg:col-span-4 flex justify-center items-end h-full relative min-h-[450px] lg:min-h-100">
          <div className="relative w-full max-w-[320px] lg:max-w-[350px] h-full flex items-end justify-center">
            <Image
              src="https://i.postimg.cc/QxmVCMZ7/phone-half.png"
              alt="Market Oracle Interface"
              width={450}
              height={900}
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>




        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-10 py-10 lg:py-0 lg:pl-x0 z-20 lg:text-left">
          <div>
            <h2
              className={`${montserrat.className} text-4xl xl:text-4xl font-black`}
            >
              <Counter target={2000} /> +
            </h2>
            <p className="text-primary font-bold text-sm tracking-widest uppercase mt-2">
              Daily Predictors
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold uppercase leading-tight">
              One prediction. Rewards.
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mx-auto lg:mx-0">
              Call BUY or SELL on any supported pair. If the market closes in your direction, you earn 1000 XP.
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
