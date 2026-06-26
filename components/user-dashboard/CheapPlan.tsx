"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Gift, ShieldCheck } from "lucide-react";

interface CheapPlanProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: {
    hasFirstDeposit: boolean;
    hasKyc: boolean;
    totalDeposited: number;
    totalWithdrawn: number;
    hasWallet: boolean;
    hasGifted: boolean;
    hasCompletedProfile: boolean;
  };
}

export default function CheapPlan({ isOpen, onClose, userStats }: CheapPlanProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        className="relative w-full max-w-[400px] bg-card rounded-[1.5rem] overflow-hidden shadow-2xl border border-border/50 transition-shadow"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Content Section */}
        <div className="p-5 px-4 lg:p-6 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-tighter">
              <Gift className="w-4 h-4" />
              <span>Cheapest Plan</span>
            </div>
            <h2 className="text-2xl font-black text-foreground leading-tight tracking-tight">
              $20 → $10,000
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed font-medium">
              Pay only $20 and receive $10,000 platform credits. Earn $7,000 daily (70% ROI) for 14 days. Total return: $108,000. Platform keeps $0.00. This is a one-time exclusive offer.
            </p>
          </div>

          {/* Plan Breakdown */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-medium">You Pay</span>
              <span className="text-sm font-black text-foreground">$20</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-medium">Investment Capital</span>
              <span className="text-sm font-black text-primary">$10,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-medium">Daily Earnings (70%)</span>
              <span className="text-sm font-black text-green-500">$7,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-medium">Platform Keeps</span>
              <span className="text-sm font-black text-green-500">$0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-medium">Plan Duration</span>
              <span className="text-sm font-black text-foreground">14 Days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-medium">ROI (for 14 days)</span>
              <span className="text-sm font-black text-primary">70%</span>
            </div>
            <div className="h-px bg-border/50" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-bold uppercase">Total Return</span>
              <span className="text-lg font-black text-primary">$108,000</span>
            </div>
          </div>


        {/* Header */}
        <div className="relative pb-0 flex items-start justify-between">
          <div className="flex gap-2 justify-between w-full">
            <span className="px-3 py-1 bg-muted border border-border rounded-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Special Offer
            </span>
            <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> 1-Time Only
            </span>
          </div>
        </div>


          {/* Action Button */}
          <button
            className="group relative w-full cursor-pointer font-bold py-3 px-6 rounded-2xl flex items-center justify-between overflow-hidden transition-all hover:pr-8 active:scale-[0.98] bg-[#229ED9] text-white"
          >
            <span className="relative z-10">
              Activate Plan Now
            </span>
            <div className="h-8 w-8 bg-background/20 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}