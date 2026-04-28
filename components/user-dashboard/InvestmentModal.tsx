"use client";
import React, { useState } from "react";
import { X, DollarSign, TrendingUp, Calendar, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    id: number;
    name: string;
    min: number;
    max: number | null;
    roiPerDay: number;
    duration: number;
  };
  userBalance: number;
  onConfirm: (planId: number, amount: number) => Promise<void>;
}

export default function InvestmentModal({ 
  isOpen, 
  onClose, 
  plan, 
  userBalance,
  onConfirm 
}: InvestmentModalProps) {
  const [amount, setAmount] = useState(plan.min);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const dailyEarnings = amount * (plan.roiPerDay / 100);
  const totalProfit = dailyEarnings * plan.duration;
  const totalReturn = amount + totalProfit;

  const handleConfirm = async () => {
    if (amount < plan.min) {
      toast.error(`Minimum investment is $${plan.min}`);
      return;
    }

    if (plan.max && amount > plan.max) {
      toast.error(`Maximum investment is $${plan.max}`);
      return;
    }

    if (amount > userBalance) {
      toast.error("Insufficient balance. Please deposit funds first.");
      return;
    }

    setIsProcessing(true);
    try {
      await onConfirm(plan.id, amount);
      toast.success("Investment created successfully!");
      onClose();
    } catch (error) {
      console.error("Investment error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create investment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tighter">Confirm Investment</h3>
                <p className="text-sm text-muted-foreground">{plan.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-xl transition-colors"
              disabled={isProcessing}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Investment Amount */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
              Investment Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={plan.min}
                max={plan.max || userBalance}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-foreground focus:border-primary focus:outline-none transition-colors"
                disabled={isProcessing}
              />
            </div>
            <div className="flex justify-between mt-2 text-[9px] text-muted-foreground">
              <span>Min: ${plan.min}</span>
              <span>Max: ${plan.max || userBalance}</span>
            </div>
          </div>

          {/* Returns Summary */}
          <div className="bg-muted/30 rounded-2xl p-4 space-y-3">
            <h4 className="text-sm font-black uppercase tracking-widest">Projected Returns</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Daily Earnings</span>
                <span className="font-black text-primary">+${dailyEarnings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-black">{plan.duration} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Profit</span>
                <span className="font-black text-primary">+${totalProfit.toFixed(2)}</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between text-base">
                <span className="font-black">Total Return</span>
                <span className="font-black text-primary">${totalReturn.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Plan Details */}
          <div className="bg-foreground text-background rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{plan.roiPerDay}% Daily ROI</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{plan.duration}-Day Plan</span>
            </div>
          </div>

          {/* Balance Warning */}
          {amount > userBalance && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3">
              <p className="text-[10px] text-destructive font-black uppercase text-center">
                Insufficient balance! Current: ${userBalance.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="py-3 px-4 border border-border text-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing || amount > userBalance || amount < plan.min}
              className="py-3 px-4 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  Invest ${amount.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
