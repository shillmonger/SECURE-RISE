"use client";

import { useState } from "react";
import {
  Landmark,
  ShieldCheck,
  Loader2,
  ArrowRight,
  Clock,
  CheckCircle2,
  CreditCard,
  Lock,
  Zap,
  Globe,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

const MIN_DEPOSIT = 500;
const MAX_DEPOSIT = 5000000;
const QUICK_AMOUNTS = [1000, 5000, 10000, 20000, 50000, 100000];

export default function BankTransferPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidAmount = () => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount >= MIN_DEPOSIT && numAmount <= MAX_DEPOSIT;
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleTransfer = async () => {
    if (!isValidAmount()) {
      toast.error(`Amount must be between ₦${MIN_DEPOSIT.toLocaleString()} and ₦${MAX_DEPOSIT.toLocaleString()}`);
      return;
    }

    setIsLoading(true);

    try {
      // Get user info
      const userResponse = await fetch('/api/user/info');
      if (!userResponse.ok) {
        toast.error('Please log in to continue');
        return;
      }

      const userData = await userResponse.json();
      if (!userData.success || !userData.user) {
        toast.error('Please log in to continue');
        return;
      }

      // Initialize Paystack transaction
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          userId: userData.user.id,
          username: userData.user.username,
          userEmail: userData.user.email,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success && result.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = result.authorization_url;
      } else {
        toast.error(result.error || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error('Failed to initialize payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-25 p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                Fund Wallet with Bank Transfer
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Deposit funds securely using Paystack.
              </p>
            </div>

            {/* Card */}
            <div className="bg-card border border-border rounded-[1rem] overflow-hidden shadow-2xl">
              <div className="p-6 md:p-8 space-y-8">
                
                {/* Amount Input Section */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    Amount (₦)
                  </label>
                  
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-black text-lg">
                      ₦
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full bg-muted/30 border-2 border-border rounded-xl pl-12 pr-4 py-4 text-lg font-black focus:outline-none focus:border-primary transition-all"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    Quick Select
                  </label>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {QUICK_AMOUNTS.map((value) => (
                      <button
                        key={value}
                        onClick={() => handleQuickAmount(value)}
                        disabled={isLoading}
                        className="bg-muted/30 border-2 border-border rounded-xl py-3 px-2 text-sm font-black hover:border-primary hover:bg-primary/10 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ₦{value.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Limits Info */}
                <div className="flex items-center justify-between gap-4 p-4 bg-muted/20 rounded-xl border border-border">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Minimum: ₦{MIN_DEPOSIT.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Maximum: ₦{MAX_DEPOSIT.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Transfer Button */}
                <button
                  onClick={handleTransfer}
                  disabled={!isValidAmount() || isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Initializing Payment...
                    </>
                  ) : (
                    <>
                      Transfer Now
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-3 bg-card border border-border rounded-xl px-6 py-4">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Secured by
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#229ED9]">
                  Paystack
                </span>
              </div>
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>

          </div>
        </main>
      </div>

      <UserNav />
    </div>
  );
}