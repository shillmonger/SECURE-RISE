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
  XCircle,
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

interface PaystackTransaction {
  _id: string;
  usdAmount?: number;
  amount?: number;
  status: "pending" | "success" | "processed" | "failed";
  reference: string;
  transactionId: string;
  createdAt: string;
  paymentMethod: string;
}

const GATEWAYS = [
  {
    name: "Paystack",
    tag: "Africa & Global Cards",
    icon: <Landmark className="w-5 h-5" />,
    enabled: true,
    color: "text-[#229ED9]",
    bg: "bg-[#229ED9]/10 border-[#229ED9]/25",
  },
  {
    name: "Flutterwave",
    tag: "Pan-African Gateway",
    icon: <Globe className="w-5 h-5" />,
    enabled: false,
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    name: "Stripe",
    tag: "Global · USD / EUR / GBP",
    icon: <CreditCard className="w-5 h-5" />,
    enabled: false,
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    name: "PayPal",
    tag: "International Transfers",
    icon: <DollarSign className="w-5 h-5" />,
    enabled: false,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
];

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
  const [transactions, setTransactions] = useState<PaystackTransaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const fetchExchangeRate = async (usdAmount: number) => {
    if (!usdAmount || usdAmount <= 0) {
      setExchangeRate({ rate: 0, ngnAmount: 0, loading: false, error: null });
      return;
    }
    setExchangeRate((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch("/api/exchange-rate");
      const data = await response.json();
      if (data.success && data.rate) {
        setExchangeRate({ rate: data.rate, ngnAmount: usdAmount * data.rate, loading: false, error: null });
      } else {
        throw new Error(data.error || "Invalid exchange rate data");
      }
    } catch {
      setExchangeRate((prev) => ({ ...prev, loading: false, error: "Failed to fetch exchange rate." }));
    }
  };

  useEffect(() => {
    const usdAmount = parseFloat(amount);
    if (!isNaN(usdAmount) && usdAmount > 0) fetchExchangeRate(usdAmount);
    else setExchangeRate({ rate: 0, ngnAmount: 0, loading: false, error: null });
  }, [amount]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userResponse = await fetch("/api/user/info");
        if (!userResponse.ok) return;
        const userData = await userResponse.json();
        if (!userData.success || !userData.user) return;
        const res = await fetch(`/api/paystack/transactions?userId=${userData.user.id}`);
        const data = await res.json();
        if (data.success) setTransactions(data.transactions);
      } catch {
        console.error("Error fetching transactions");
      } finally {
        setTransactionsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const isValidAmount = () => {
    const n = parseFloat(amount);
    return !isNaN(n) && n >= MIN_DEPOSIT_USD && n <= MAX_DEPOSIT_USD && exchangeRate.rate > 0 && !exchangeRate.loading && !exchangeRate.error;
  };

  const handleTransfer = async () => {
    if (!isValidAmount()) {
      toast.error(`Amount must be between $${MIN_DEPOSIT_USD} and $${MAX_DEPOSIT_USD.toLocaleString()}`);
      return;
    }
    setIsLoading(true);
    try {
      const userResponse = await fetch("/api/user/info");
      if (!userResponse.ok) { toast.error("Please log in to continue"); return; }
      const userData = await userResponse.json();
      if (!userData.success || !userData.user) { toast.error("Please log in to continue"); return; }

      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usdAmount: parseFloat(amount),
          userId: userData.user.id,
          username: userData.user.username,
          userEmail: userData.user.email,
        }),
      });
      const result = await response.json();
      if (response.ok && result.success && result.authorization_url) {
        window.location.href = result.authorization_url;
      } else {
        toast.error(result.error || "Failed to initialize payment");
      }
    } catch {
      toast.error("Failed to initialize payment. Please try again.");
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
          <div className="max-w-8xl mx-auto space-y-10 lg:space-y-10">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">
                  Bank Transfer
                </h1>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.18em]">
                  Deposit funds securely · Credited in USD
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 bg-card border border-border rounded-xl px-4 py-2.5 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Secured by</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#229ED9]">Paystack</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* ── Main Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">

              {/* ── LEFT: Deposit Form ── */}
              <div className="lg:col-span-3 space-y-4">

                {/* Gateway selector */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/5">
                    <div className="w-2 h-2 rounded-full bg-[#229ED9]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      Select Payment Gateway
                    </span>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-3">
                    {GATEWAYS.map((gw) => (
                      <div
                        key={gw.name}
                        className={`relative flex items-center gap-3 rounded-xl border p-3.5 transition-all duration-200 ${
                          gw.enabled
                            ? `${gw.bg} cursor-pointer`
                            : "bg-muted/10 border-border opacity-40 cursor-not-allowed"
                        }`}
                      >
                        <div className={`p-2 rounded-lg border ${gw.enabled ? gw.bg : "bg-muted/20 border-border"} ${gw.color} shrink-0`}>
                          {gw.icon}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-black ${gw.enabled ? "" : "text-muted-foreground"}`}>
                            {gw.name}
                          </p>
                          <p className="text-[9px] text-muted-foreground truncate">{gw.tag}</p>
                        </div>
                        {gw.enabled ? (
                          <CheckCircle2 className={`w-3.5 h-3.5 ${gw.color} shrink-0 ml-auto`} />
                        ) : (
                          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground border border-border bg-muted/20 px-1.5 py-0.5 rounded-full ml-auto shrink-0">
                            Soon
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amount input */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/5">
                    <div className="w-2 h-2 rounded-full bg-[#229ED9]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      Deposit Amount
                    </span>
                  </div>
                  <div className="p-5 space-y-5">
                    {/* Input */}
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-lg select-none">$</div>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        disabled={isLoading}
                        className="w-full bg-background border border-border rounded-xl pl-10 pr-16 py-4 text-2xl font-black  focus:outline-none focus:ring-1 focus:ring-[#229ED9]/50 transition-all placeholder:text-muted-foreground/30 disabled:opacity-50"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground uppercase tracking-widest select-none">
                        USD
                      </span>
                    </div>

                    {/* Quick amounts */}
                    <div className="space-y-2">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Quick Select</p>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {QUICK_AMOUNTS_USD.map((val) => (
                          <button
                            key={val}
                            onClick={() => setAmount(val.toString())}
                            disabled={isLoading}
                            className={`py-2.5 rounded-xl text-xs font-black border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                              amount === val.toString()
                                ? "bg-[#229ED9] border-[#229ED9] "
                                : "bg-background border-border text-muted-foreground hover:border-[#229ED9]/40 hover:"
                            }`}
                          >
                            ${val}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Limits row */}
                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground px-1">
                      <span>Min <span className="">${MIN_DEPOSIT_USD}</span></span>
                      <div className="flex-1 mx-3 h-px bg-border" />
                      <span>Max <span className="">${MAX_DEPOSIT_USD.toLocaleString()}</span></span>
                    </div>

                    {/* Exchange rate status — frontend only shows generic confirmation */}
                    {amount && (
                      <div className={`rounded-xl border p-4 transition-all ${
                        exchangeRate.error
                          ? "bg-red-500/5 border-red-500/20"
                          : exchangeRate.loading
                          ? "bg-muted/10 border-border"
                          : "bg-emerald-500/5 border-emerald-500/20"
                      }`}>
                        {exchangeRate.loading ? (
                          <div className="flex items-center gap-3">
                            <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                              Verifying exchange rate...
                            </span>
                          </div>
                        ) : exchangeRate.error ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-red-400">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Rate unavailable. Retry.</span>
                            </div>
                            <button
                              onClick={() => fetchExchangeRate(parseFloat(amount))}
                              className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-red-400" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              </div>
                              <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Exchange Rate</p>
                                <p className="text-xs font-black text-emerald-400">Confirmed &amp; Ready</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">You receive</p>
                              <p className="text-lg font-black ">
                                ${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                <span className="text-xs ml-1 text-emerald-400 font-black">USD</span>
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* CTA */}
                    <button
                      onClick={handleTransfer}
                      disabled={!isValidAmount() || isLoading}
                      className="w-full flex items-center cursor-pointer justify-center gap-2.5 bg-[#229ED9] hover:bg-[#1a8bc4]  rounded-xl px-5 py-4 font-black text-[11px] uppercase tracking-widest transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#229ED9]/20"
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

                    {/* Accepted cards */}
                    <div className="flex items-center justify-center gap-4 pt-1">
                      {["Visa", "Mastercard", "Verve"].map((c) => (
                        <div key={c} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          <CreditCard className="w-3 h-3" />
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>




              {/* ── RIGHT: Transaction History ── */}
              <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#229ED9]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      Transaction History
                    </span>
                  </div>
                  {transactionsLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
                </div>

                <div className="flex-1 overflow-y-auto p-3 py-4 lg:p-4 space-y-2">
                  {transactionsLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-16 bg-muted/20 rounded-xl animate-pulse" />
                    ))
                  ) : transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-16 gap-3">
                      <div className="p-4 rounded-2xl bg-muted/10 border border-border">
                        <CreditCard className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        No transactions yet
                      </p>
                    </div>
                  ) : (
                    transactions.map((tx) => {
                      const txAmount = tx.usdAmount || tx.amount || 0;
                      const isProcessed = tx.status === "processed" || tx.status === "success";
                      const isPending = tx.status === "pending";
                      const isFailed = tx.status === "failed";

                      return (
                        <div
                          key={tx._id}
                          className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-background hover:border-border/80 transition-all"
                        >
                          <div className={`p-2 rounded-lg shrink-0 ${
                            isProcessed ? "bg-emerald-500/10 border border-emerald-500/20"
                            : isPending ? "bg-yellow-500/10 border border-yellow-500/20"
                            : "bg-red-500/10 border border-red-500/20"
                          }`}>
                            {isProcessed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : isPending ? (
                              <Clock className="w-4 h-4 text-yellow-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black ">
                              ${txAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                            </p>
                            <p className="text-[9px] text-muted-foreground truncate">{tx.reference}</p>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-[9px] text-muted-foreground">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </p>
                            <p className={`text-[9px] font-black uppercase tracking-widest ${
                              isProcessed ? "text-emerald-400" : isPending ? "text-yellow-400" : "text-red-400"
                            }`}>
                              {tx.status}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <UserNav />
    </div>
  );
}