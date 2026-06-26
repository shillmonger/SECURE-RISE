"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Gift, ShieldCheck, Info, Check } from "lucide-react";

interface CheapPlanProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: {
    hasCompletedProfile: boolean;
    hasKyc: boolean;
    totalWithdrawn: number;
    withdrawnOver500: boolean;
    hasWallet: boolean;
    hasGifted: boolean;
    totalDeposited: number;
    depositedOver3000: boolean;
  };
}

export default function CheapPlan({ isOpen, onClose, userStats }: CheapPlanProps) {
  const [showRequirements, setShowRequirements] = useState(false);

  if (!isOpen) return null;

  const requirements = [
    { label: "Completed Personal Info", met: userStats.hasCompletedProfile },
    { label: "Connected KYC", met: userStats.hasKyc },
    { label: "Withdrawn Over $500", met: userStats.withdrawnOver500 },
    { label: "Connected Wallet Address", met: userStats.hasWallet },
    { label: "Gifted a Member", met: userStats.hasGifted },
    { label: "Deposited over $3,000", met: userStats.depositedOver3000 },
  ];

  const metCount = requirements.filter((r) => r.met).length;
  const progress = Math.round((metCount / requirements.length) * 100);
  const allUnlocked = metCount === requirements.length;

  return (
    <div
      className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={() => {
        if (showRequirements) {
          setShowRequirements(false);
        } else {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        className="relative w-full max-w-[400px] bg-card rounded-[1.5rem] overflow-hidden shadow-2xl border border-border/50 transition-shadow"
        onClick={(e) => {
          if (showRequirements) {
            setShowRequirements(false);
          }
          e.stopPropagation();
        }}
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
              Your $20 Welcome Bonus unlocks $10,000 in platform credits. Earn $7,000 daily (70% ROI) for 14
              days. Total return: $108,000. Platform keeps $0.00. This is a one-time exclusive offer.
            </p>
          </div>


          {/* Plan Breakdown */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-medium">Welcome Bonus</span>
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



          {/* ── Unlock Requirements header + progress bar + info icon ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Unlock Requirements
                </span>
                <span
                  className={`text-[10px] font-bold tabular-nums ${allUnlocked ? "text-green-500" : "text-primary"
                    }`}
                >
                  {metCount}/{requirements.length}
                </span>
              </div>

              {/* Info icon — click to toggle */}
              <div className="relative">
                <button
                  onClick={() => setShowRequirements((v) => !v)}
                  className="w-6 h-6 rounded-full flex items-center cursor-pointer justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>

                {/* Tooltip / popover */}
                <AnimatePresence>
                  {showRequirements && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 bottom-8 z-500 w-60 bg-card border border-border/60 rounded-xl shadow-2xl p-3 space-y-2"
                    >
                      <p className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                        To Activate This Plan
                      </p>
                      {requirements.map((req) => (
                        <div key={req.label} className="flex items-center gap-2">
                          <span
                            className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${req.met
                                ? "bg-primary text-primary-foreground"
                                : "bg-border/30 text-muted-foreground"
                              }`}
                          >
                            <Check className="w-2.5 h-2.5" />
                          </span>
                          <span
                            className={`text-sm font-medium leading-snug ${req.met ? "text-foreground" : "text-muted-foreground"
                              }`}
                          >
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full rounded-full bg-border/40 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`h-full rounded-full ${allUnlocked
                    ? "bg-green-500"
                    : progress >= 50
                      ? "bg-primary"
                      : "bg-yellow-500"
                  }`}
              />
            </div>
          </div>




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
          <button className="group relative w-full cursor-pointer font-bold py-3 px-6 rounded-2xl flex items-center justify-between overflow-hidden transition-all hover:pr-8 active:scale-[0.98] bg-[#229ED9] text-white">
            <span className="relative z-10">Activate Plan Now</span>
            <div className="h-8 w-8 bg-background/20 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}