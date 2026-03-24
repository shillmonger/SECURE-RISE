// components/landing-page/hero-section.tsx
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

export default function HeroSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative mx-auto max-w-[1400px] min-h-[110vh] lg:px-8 flex items-center justify-center overflow-hidden">
      {/* BACKGROUND IMAGE WITH OVERLAY */}
      <div className="absolute inset-0 z-0 flex justify-end">
        {isMounted && (
          <div className="w-full md:w-3/4 lg:w-4/5 relative h-full">
            <Image
              src="https://i.postimg.cc/DfYmtbhw/Chat-GPT-Image-Mar-22-2026-11-49-57-PM.png"
              alt="SECURE RISE Trading"
              fill
              className="object-cover object-center transition-opacity duration-700"
              priority
            />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent dark:via-background/80" />
        <div className="absolute inset-0 bg-black/0 md:bg-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* TAGLINE */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            You Invest • We Trade
          </div>

          {/* MAIN HEADING */}
          <h1
            className={`${montserrat.className} text-4xl md:text-7xl lg:text-7xl font-black leading-[1.1] tracking-tight text-foreground mb-6 uppercase`}
          >
            Scale Your CAPITALS <br />
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              On SCALE RISE
            </span>
          </h1>

          {/* SUBTEXT */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
            Invest in high-performance assets. We trade. You earn.
            Experience daily income growth backed by institutional-grade
            security.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto px-8 py-7 cursor-pointer text-md font-extrabold rounded-xl hover:scale-105 transition-transform"
            >
              <Link
                href="/auth-page/register"
                className="flex items-center gap-2"
              >
                $20 Claim
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8 py-7 cursor-pointer text-md font-bold rounded-xl border-border bg-background/50 backdrop-blur-md hover:bg-muted transition-all"
            >
              <Link href="/auth-page/login" className="flex items-center gap-2">
                SIGN IN
              </Link>
            </Button>
          </div>

          {/* TRUST INDICATOR */}
          <div className="mt-10 flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-6 opacity-90">
            {/* STATS GROUP */}
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground leading-none mb-1">
                  10%
                </span>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                  Avg. Daily ROI
                </span>
              </div>

              <div className="h-8 w-[1px] bg-border" />

              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground leading-none mb-1">
                  256-bit
                </span>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                  AES Encryption
                </span>
              </div>
            </div>

            {/* MOBILE SEPARATOR (Optional, only shows on mobile) */}
            <div className="h-[1px] w-full bg-border md:hidden opacity-50" />
            <div className="hidden md:block h-8 w-[1px] bg-border" />

            {/* AVATAR STACK GROUP */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3 overflow-hidden">
                {[
                  "https://i.postimg.cc/0yJ0FsJS/LE-MAC.jpg",
                  "https://i.postimg.cc/rFsJGWVf/Kamala-Harris.jpg",
                  "https://i.postimg.cc/mZ8jFVsy/Nailed-it.jpg",
                  "https://i.postimg.cc/LXVTD3gC/The-secret.jpg",
                ].map((src, i) => (
                  <div
                    key={i}
                    className="inline-block h-13 w-13 rounded-full border-2 border-primary bg-background overflow-hidden flex items-center justify-center"
                  >
                    {src ? (
                      <img
                        src={src}
                        alt="User avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-primary/10" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground leading-none mb-1">
                  1.2K+
                </span>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                  Realtime Users
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
