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
  onConfirm,
}: InvestmentModalProps) {
  const [amount, setAmount] = useState<string | number>(plan.min);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const numericAmount =
    typeof amount === "string" ? (amount === "" ? 0 : Number(amount)) : amount;
  const dailyEarnings = numericAmount * (plan.roiPerDay / 100);
  const totalProfit = dailyEarnings * plan.duration;
  const totalReturn = numericAmount + totalProfit;

  const handleConfirm = async () => {
    if (numericAmount < plan.min) {
      toast.error(`Minimum investment is $${plan.min}`);
      return;
    }

    if (plan.max && numericAmount > plan.max) {
      toast.error(`Maximum investment is $${plan.max}`);
      return;
    }

    if (numericAmount > userBalance) {
      toast.error("Insufficient balance. Please deposit funds first.");
      return;
    }

    setIsProcessing(true);
    try {
      await onConfirm(plan.id, numericAmount);
      setShowSuccess(true);
    } catch (error) {
      console.error("Investment error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create investment");
    } finally {
      setIsProcessing(false);
    }
  };

  // Success Modal
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4" onClick={() => {
        setShowSuccess(false);
        onClose();
      }}>
        <div
          className="bg-card border border-border rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
          style={{ animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated checkmark */}
          <div className="mx-auto mb-5 h-20 w-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
            <svg
              className="h-9 w-9 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-foreground mb-1">Investment Successful! 🎉</h3>
          <p className="text-muted-foreground text-sm mb-6">
            You successfully invested <span className="text-primary font-bold">${numericAmount.toFixed(2)}</span> in{" "}
            <span className="text-foreground font-semibold">{plan.name}</span>.
          </p>
          <div className="bg-muted/50 rounded-2xl p-4 mb-6 text-left space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Investment Plan</span>
              <span className="text-foreground font-semibold">{plan.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="text-primary font-black text-base">${numericAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Daily Return</span>
              <span className="text-foreground font-semibold">+${dailyEarnings.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Duration</span>
              <span className="text-foreground font-semibold">{plan.duration} days</span>
            </div>
          </div>
          <button
            onClick={() => {
              setShowSuccess(false);
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm hover:opacity-90 transition-opacity cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100 flex items-center justify-center p-4" onClick={() => !isProcessing && onClose()}>
      <div className="bg-card border border-border rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tighter">
                  Confirm Investment
                </h3>
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
                onChange={(e) =>
                  setAmount(e.target.value === "" ? "" : Number(e.target.value))
                }
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
            <h4 className="text-sm font-black uppercase tracking-widest">
              Projected Returns
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Daily Earnings</span>
                <span className="font-black text-primary">
                  +${dailyEarnings.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-black">{plan.duration} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Profit</span>
                <span className="font-black text-primary">
                  +${totalProfit.toFixed(2)}
                </span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between text-base">
                <span className="font-black">Total Return</span>
                <span className="font-black text-primary">
                  ${totalReturn.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Plan Details */}
          <div className="bg-foreground text-background rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {plan.roiPerDay}% Daily ROI
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {plan.duration}-Day Plan
              </span>
            </div>
          </div>

          {/* Balance Warning */}
          {numericAmount > userBalance && (
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
              className="py-3 px-4 border cursor-pointer border-border text-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={
                isProcessing ||
                numericAmount > userBalance ||
                numericAmount < plan.min
              }
              className="py-3 px-4 bg-primary cursor-pointer text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  Invest ${numericAmount.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
