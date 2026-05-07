"use client";

import React from "react";
import { Montserrat } from "next/font/google";
import { LayoutDashboard, TrendingUp } from "lucide-react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export default function AnalyticsWelcome() {
  // You could pull the user's name from your auth state here
  const userName = "Trader"; 

  return (
    <div className="relative mb-8 p-8 rounded-[2rem] bg-card border border-border/50 overflow-hidden group">
      {/* Background Glow Effect */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/10 transition-colors duration-700" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              System Live • Analytics Portal
            </span>
          </div>

          <h1 className={`${montserrat.className} text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground`}>
            Welcome, <span className="text-primary italic">{userName}</span>
          </h1>
          
          <p className="mt-2 text-sm text-muted-foreground font-medium max-w-md">
            Your real-time market performance and portfolio metrics are ready for review.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end mr-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Rank</span>
            <span className="text-xl font-black text-foreground">#1,284</span>
          </div>
          
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}