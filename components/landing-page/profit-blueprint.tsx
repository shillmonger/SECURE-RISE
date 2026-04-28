"use client";
import Link from "next/link";

import { Shield, TrendingUp, Laptop, Trophy, Users } from "lucide-react";

export default function InvestmentFeatureGrid() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-10 w-full font-sans">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Bonus and Passive Income */}
        <div className="md:col-span-4 flex flex-col gap-6">
          
          {/* Card 1: Bonus */}
          <div className="rounded-3xl border bg-card/50 border-primary/10 p-8 relative overflow-hidden transition-all hover:-translate-y-1 flex flex-col justify-between min-h-[260px]">
            <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-3">
                Instant $20 Bonus
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[200px]">
                Register today and receive an instant $20 credit. Unlockable with your first investment payout.
              </p>
            </div>
            
            <div className="relative z-10 mt-6">
              <div className="inline-block rounded-xl px-4 py-3 text-[10px] tracking-widest uppercase font-mono text-primary bg-primary/5 border border-primary/10">
                Bonus unlock: 1st Payout
              </div>
            </div>

            {/* Gray Image Trophy Replacement */}
            <img 
              src="https://cdn-icons-png.flaticon.com/512/10443/10443422.png" 
              alt="Trophy"
              className="absolute -right-4 top-8 w-28 h-28 opacity-10 grayscale brightness-200 -rotate-12 pointer-events-none"
            />
          </div>

          {/* Card 2: Passive Income */}
          <div className="rounded-3xl border bg-card/50 border-primary/10 p-8 relative overflow-hidden transition-all hover:-translate-y-1 flex flex-col justify-between min-h-[220px]">
            <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-3">
                Daily Passive Income
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                You invest, we trade. Simple daily returns topped up to your account automatically.
              </p>
            </div>

            <div className="relative z-10 mt-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[10px] tracking-widest uppercase font-mono text-muted-foreground">
                Compounding Daily
              </span>
            </div>

            {/* Gray Image User Replacement */}
            <img 
              src="https://cdn-icons-png.flaticon.com/512/3233/3233483.png" 
              alt="Community"
              className="absolute -right-4 -bottom-4 w-32 h-32 opacity-[0.03] grayscale brightness-200 pointer-events-none"
            />
          </div>
        </div>

        {/* Right Column: Platform/Trading Detail */}
        <div className="md:col-span-8 rounded-3xl border bg-card/50 border-primary/10 overflow-hidden relative transition-all hover:-translate-y-1 min-h-[500px] flex flex-col">
          <div className="p-10 md:p-12 relative z-10 md:max-w-[60%]">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none">
              Expert Trading <br />
              <span className="text-primary">Platforms</span>
            </h2>
            
            <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
              We utilize main-label MT4, MT5, and advanced in-house technology 
              to ensure your capital is managed with industry-leading efficiency and security.
            </p>

            {/* Trading Badges */}
            <div className="flex flex-wrap gap-4 mt-10">
              {['MT4', 'MT5', 'cTrader', 'Match-Trader', 'Trade Locker'].map((tool) => (
                <div key={tool} className="px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-mono font-bold tracking-widest uppercase text-primary">
                  {tool}
                </div>
              ))}
            </div>
          </div>

          {/* Laptop / Dashboard Image Mockup Area */}
          <div className="absolute right-0 bottom-0 w-full md:w-[50%] h-[300px] md:h-full overflow-hidden pointer-events-none">
            <div className="absolute bottom-0 right-0 w-[120%] h-[80%] bg-gradient-to-tl from-primary/20 to-transparent rounded-tl-[100px] blur-3xl opacity-50" />
            <img 
              src="https://i.postimg.cc/Y0Jy39TC/install-pwa.png" // Replace with your actual laptop image URL
              alt="Trading Interface" 
              className="absolute bottom-0 right-0 w-full h-auto object-contain opacity-40 md:opacity-100 translate-x-10 translate-y-10 rotate-[-5deg]"
            />
          </div>

          {/* Background Grid Decoration (Matches your theme) */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
          />
        </div>

      </div>
    </section>
  );
}