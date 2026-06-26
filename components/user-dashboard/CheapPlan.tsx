"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Check, Gift, ShieldCheck, Wallet, User, FileText, CreditCard, Send } from "lucide-react";

const IMAGES = [
  "https://i.postimg.cc/gkW8VrZk/Banner-1.jpg",
  "https://i.postimg.cc/jS8fYX3G/Banner-2.jpg",
  "https://i.postimg.cc/7LdTfLkX/Banner-3.jpg",
  "https://i.postimg.cc/15BnDBSY/Banner-4.webp",
  "https://i.postimg.cc/gjdjZXBs/Banner-5.jpg",
  "https://i.postimg.cc/Zqd5sFG6/Banner-6.jpg",
];

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Automatic Image Slider
  useEffect(() => {
    if (isOpen) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
      }, 4000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isOpen]);

  const requirements = [
    { key: "hasCompletedProfile", label: "Completed Personal Info", icon: User, checked: userStats.hasCompletedProfile },
    { key: "hasKyc", label: "Connected KYC", icon: ShieldCheck, checked: userStats.hasKyc },
    { key: "totalWithdrawn", label: "Withdrawn Over $500", icon: ArrowUpRight, checked: userStats.totalWithdrawn >= 500 },
    { key: "hasWallet", label: "Connected Wallet", icon: Wallet, checked: userStats.hasWallet },
    { key: "hasGifted", label: "Gifted a Member", icon: Send, checked: userStats.hasGifted },
    { key: "hasFirstDeposit", label: "Deposited over $3,000", icon: CreditCard, checked: userStats.hasFirstDeposit },
  ];

  const allRequirementsMet = requirements.every(req => req.checked);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        className="relative w-full max-w-[500px] bg-card rounded-[1.5rem] overflow-hidden shadow-2xl border border-border/50 transition-shadow"
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

          {/* Requirements Section */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
              Unlock Requirements
            </p>
            <div className="grid grid-cols-2 gap-2">
              {requirements.map((req, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                    req.checked 
                      ? "bg-green-500/10 border border-green-500/20" 
                      : "bg-muted/30 border border-border/50"
                  }`}
                >
                  <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                    req.checked ? "bg-green-500" : "bg-muted"
                  }`}>
                    {req.checked ? (
                      <Check className="w-3 h-3 text-white" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                    )}
                  </div>
                  <span className={`text-xs font-medium ${req.checked ? "text-green-500" : "text-muted-foreground"}`}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            className="group relative w-full cursor-pointer font-bold py-3 px-6 rounded-2xl flex items-center justify-between overflow-hidden transition-all hover:pr-8 active:scale-[0.98] bg-[#229ED9] text-white"
          >
            <span className="relative z-10">
              Activate Plan
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
