"use client";

import { useState, useEffect } from "react";
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
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

const MIN_DEPOSIT_USD = 10;
const MAX_DEPOSIT_USD = 10000;
const QUICK_AMOUNTS_USD = [50, 100, 200, 500, 1000, 2000];

interface ExchangeRateData {
  rate: number;
  ngnAmount: number;
  loading: boolean;
  error: string | null;
}

export default function BankTransferPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateData>({
    rate: 0,
    ngnAmount: 0,
    loading: false,
    error: null,
  });

  const fetchExchangeRate = async (usdAmount: number) => {
    if (!usdAmount || usdAmount <= 0) {
      setExchangeRate({ rate: 0, ngnAmount: 0, loading: false, error: null });
      return;
    }

    setExchangeRate(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/exchange-rate');
      const data = await response.json();

      if (data.success && data.rate) {
        const rate = data.rate;
        const ngnAmount = usdAmount * rate;
        setExchangeRate({
          rate,
          ngnAmount,
          loading: false,
          error: null,
        });
      } else {
        throw new Error(data.error || 'Invalid exchange rate data');
      }
    } catch (error) {
      console.error('Exchange rate fetch error:', error);
      setExchangeRate(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch exchange rate. Please try again.',
      }));
    }
  };

  useEffect(() => {
    const usdAmount = parseFloat(amount);
    if (!isNaN(usdAmount) && usdAmount > 0) {
      fetchExchangeRate(usdAmount);
    } else {
      setExchangeRate({ rate: 0, ngnAmount: 0, loading: false, error: null });
    }
  }, [amount]);

  const isValidAmount = () => {
    const numAmount = parseFloat(amount);
    return (
      !isNaN(numAmount) &&
      numAmount >= MIN_DEPOSIT_USD &&
      numAmount <= MAX_DEPOSIT_USD &&
      exchangeRate.rate > 0 &&
      !exchangeRate.loading &&
      !exchangeRate.error
    );
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleTransfer = async () => {
    if (!isValidAmount()) {
      toast.error(`Amount must be between $${MIN_DEPOSIT_USD.toLocaleString()} and $${MAX_DEPOSIT_USD.toLocaleString()}`);
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

      // Initialize Paystack transaction with USD amount
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usdAmount: parseFloat(amount),
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
                Pay with Card
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground max-w-2xl">
                Deposit funds securely using your Visa, Mastercard or Verve card. Users worldwide can pay with supported international cards. Your investment will always be credited in USD.
              </p>
            </div>

            {/* Card */}
            <div className="bg-card border border-border rounded-[1rem] overflow-hidden shadow-2xl">
              <div className="p-6 md:p-8 space-y-8">
                
                {/* Amount Input Section */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    Deposit Amount (USD)
                  </label>
                  
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-black text-lg">
                      $
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="100"
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
                    {QUICK_AMOUNTS_USD.map((value) => (
                      <button
                        key={value}
                        onClick={() => handleQuickAmount(value)}
                        disabled={isLoading}
                        className="bg-muted/30 border-2 border-border rounded-xl py-3 px-2 text-sm font-black hover:border-primary hover:bg-primary/10 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ${value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exchange Rate Card */}
                {amount && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-300">
                          Exchange Rate
                        </span>
                      </div>
                      {exchangeRate.loading && (
                        <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
                      )}
                      {exchangeRate.error && (
                        <button
                          onClick={() => fetchExchangeRate(parseFloat(amount))}
                          className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
                        >
                          <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </button>
                      )}
                    </div>

                    {exchangeRate.loading ? (
                      <div className="space-y-2">
                        <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded animate-pulse" />
                        <div className="h-3 bg-blue-200 dark:bg-blue-800 rounded animate-pulse w-3/4" />
                      </div>
                    ) : exchangeRate.error ? (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-semibold">{exchangeRate.error}</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="text-lg font-black text-green-700 dark:text-green-300">
                            Exchange rate ready
                          </span>
                        </div>
                        
                        <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                            Your account will be credited
                          </p>
                          <p className="text-2xl font-black text-green-600 dark:text-green-400">
                            ${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>

                        <p className="text-[9px] font-semibold text-muted-foreground flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Exchange rates are updated automatically before payment.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Payment Methods Info */}
                <div className="bg-muted/20 border border-border rounded-xl p-5 space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground mb-3">
                      Accepted Payment Methods
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <CreditCard className="w-4 h-4" />
                        <span>Visa</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <CreditCard className="w-4 h-4" />
                        <span>Mastercard</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <CreditCard className="w-4 h-4" />
                        <span>Verve</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <Globe className="w-4 h-4" />
                        <span>International debit and credit cards</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-border">
                    <p className="text-[9px] font-semibold text-muted-foreground leading-relaxed">
                      Users outside Nigeria can also pay using supported international cards. Your payment is processed in Nigerian Naira (NGN), while your Secure Rise account is credited in US Dollars (USD).
                    </p>
                  </div>
                </div>

                {/* Limits Info */}
                <div className="flex items-center justify-between gap-4 p-4 bg-muted/20 rounded-xl border border-border">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Minimum: ${MIN_DEPOSIT_USD.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Maximum: ${MAX_DEPOSIT_USD.toLocaleString()}
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
                      Continue to Secure Payment
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