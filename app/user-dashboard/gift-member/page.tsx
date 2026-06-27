"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";
import { Montserrat } from "next/font/google";
import {
  Wallet,
  Gift,
  Send,
  History,
  Users,
  DollarSign,
} from "lucide-react";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["700", "800", "900"] });

// ─── TYPES ───────────────────────────────────────────────────────────────
type SearchResult = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
};

type Step = "search" | "amount" | "confirm" | "success";


// ─── SKELETON ────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border animate-pulse">
      <div className="h-11 w-11 rounded-full bg-muted shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-32 bg-muted rounded" />
        <div className="h-2.5 w-44 bg-muted rounded" />
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-card border border-border px-5 py-3 rounded-2xl animate-pulse">
          <div className="h-8 w-8 rounded-lg bg-muted mb-2" />
          <div className="h-8 w-20 bg-muted rounded mb-2" />
          <div className="h-3 w-24 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

// ─── USER RESULT CARD ────────────────────────────────────────────────────────
function UserCard({
  user,
  selected,
  onClick,
}: {
  user: SearchResult;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer
        ${selected
          ? "border-primary bg-primary/8 shadow-[0_0_0_2px_hsl(var(--primary)/0.25)]"
          : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
        }`}
    >
      <div className="relative shrink-0">
        <img src={user.avatar} alt={user.name} className="h-11 w-11 rounded-full object-cover border-2 border-border" />
        {selected && (
          <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
            <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
        <p className="text-xs text-muted-foreground truncate">@{user.username} · {user.email}</p>
      </div>
    </button>
  );
}

// ─── SUCCESS MODAL ───────────────────────────────────────────────────────────
function SuccessModal({ recipient, amount, onClose }: { recipient: SearchResult; amount: string; onClose: () => void }) {
  const commission = parseFloat(amount) * 0.05;
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/10 backdrop-blur-sm px-4">
      <div
        className="bg-card border border-border rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
        style={{ animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
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
        <h3 className={`${montserrat.className} text-2xl font-black text-foreground mb-1`}>Gift Sent! 🎉</h3>
        <p className="text-muted-foreground text-sm mb-6">
          You successfully sent <span className="text-primary font-bold">${amount}</span> to{" "}
          <span className="text-foreground font-semibold">{recipient.name}</span>.
        </p>
        <div className="bg-muted/50 rounded-2xl p-4 mb-6 text-left space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Recipient</span>
            <span className="text-foreground font-semibold">{recipient.name}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Username</span>
            <span className="text-foreground font-semibold">@{recipient.username}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="text-primary font-black text-base">${amount}</span>
          </div>
          <div className="flex items-center justify-between text-sm bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-2">
            <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Your 5% Commission</span>
            <span className="text-emerald-600 font-black text-base">+${commission.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm hover:opacity-90 transition-opacity cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ─── STEP INDICATOR ──────────────────────────────────────────────────────────
const STEPS = ["Find User", "Set Amount", "Confirm"];
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300
                  ${done ? "bg-primary text-primary-foreground" : active ? "border-2 border-primary text-primary bg-primary/10" : "border-2 border-border text-muted-foreground bg-background"}`}
              >
                {done ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (i + 1)}
              </div>
              <span className={`text-[10px] font-semibold whitespace-nowrap ${active ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 mb-4 transition-all duration-500 ${done ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function GiftUserPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<Step>("search");
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [balance, setBalance] = useState(0);
  const [giftPercents, setGiftPercents] = useState(0);
  const [totalSent, setTotalSent] = useState(0);
  const [giftHistory, setGiftHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(2);
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch user balance on mount
  useEffect(() => {
    const fetchBalance = async () => {
      setLoadingBalance(true);
      try {
        const response = await fetch('/api/user-dashboard/gift/balance');
        const data = await response.json();
        if (data.success) {
          setBalance(data.balance);
          setGiftPercents(data.giftPercents);
          setTotalSent(data.totalSent || 0);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setLoadingBalance(false);
      }
    };
    fetchBalance();
  }, []);

  // Fetch gift history
  useEffect(() => {
    const fetchGiftHistory = async () => {
      setLoadingHistory(true);
      try {
        const response = await fetch('/api/user-dashboard/gift/history');
        const data = await response.json();
        if (data.success) {
          setGiftHistory(data.gifts || []);
        }
      } catch (error) {
        console.error('Error fetching gift history:', error);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchGiftHistory();
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); setSearching(false); return; }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/user-dashboard/gift/search?q=${encodeURIComponent(query.trim())}`);
        const data = await response.json();
        if (data.success) {
          setResults(data.users);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Error searching users:', error);
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const handleSelectUser = (user: SearchResult) => {
    setSelected(user);
  };

  const handleProceedToAmount = () => {
    if (!selected) return;
    setStep("amount");
  };

  const handleAddAmount = (add: number) => {
    setAmount((prev) => String((parseFloat(prev) || 0) + add));
  };

  const handleProceedToConfirm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    if (parseFloat(amount) > balance) {
      toast.error("Insufficient balance. Your current balance is $" + balance.toFixed(2));
      return;
    }
    setStep("confirm");
  };

  const handleSend = useCallback(async () => {
    if (!selected) return;
    
    setSending(true);
    try {
      const response = await fetch('/api/user-dashboard/gift/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: selected.id,
          amount: parseFloat(amount)
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Gift sent successfully!");
        setShowSuccess(true);
        // Update balance and giftPercents
        const commission = parseFloat(amount) * 0.05;
        setBalance(prev => prev - parseFloat(amount) + commission);
        setGiftPercents(prev => prev + commission);
      } else {
        toast.error(data.error || "Failed to send gift");
      }
    } catch (error) {
      console.error('Error sending gift:', error);
      toast.error("Failed to send gift. Please try again.");
    } finally {
      setSending(false);
    }
  }, [selected, amount]);

  const handleReset = () => {
    setQuery("");
    setResults([]);
    setSelected(null);
    setAmount("");
    setStep("search");
    setShowSuccess(false);
  };

  const stepIndex = step === "search" ? 0 : step === "amount" ? 1 : 2;

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
      `}</style>

    <div className="flex h-screen overflow-hidden bg-background font-sans">
        <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
          <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <UserNav />

        <main className="flex-1 overflow-y-auto pb-25 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-5">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter ">
                  Gift Transfer
                </h1>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-1">
                  Send money to other users
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            {loadingBalance ? (
              <StatsSkeleton />
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {/* Available Balance */}
              <div className="bg-card border border-border px-5 py-3 cursor-pointer rounded-2xl hover:border-primary/50 transition-colors">
                <div className="inline-flex w-fit p-2 bg-emerald-500/10 rounded-lg transition-colors">
                  <Wallet className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-2xl font-black tracking-tighter mt-2">
                  ${formatNumber(balance)}
                </p>
                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                  Available Balance
                </p>
              </div>

              {/* Total Earnings */}
              <div className="bg-card border border-border px-5 py-3 cursor-pointer rounded-2xl hover:border-primary/50 transition-colors">
                <div className="inline-flex w-fit p-2 bg-[#229ED9]/10 rounded-lg transition-colors">
                  <Gift className="w-5 h-5 text-[#229ED9]" />
                </div>
                <p className="text-2xl font-black tracking-tighter mt-2">
                  ${formatNumber(giftPercents)}
                </p>
                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                  Total Earnings
                </p>
              </div>

              {/* Gifted Members */}
              <div className="bg-card border border-border px-5 py-3 cursor-pointer rounded-2xl hover:border-primary/50 transition-colors">
                <div className="inline-flex w-fit p-2 bg-blue-500/10 rounded-lg transition-colors">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-2xl font-black tracking-tighter mt-2">
                  {giftHistory.length}
                </p>
                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                  Gifted Members
                </p>
              </div>

              {/* Amount Spent */}
              <div className="bg-card border border-border px-5 py-3 cursor-pointer rounded-2xl hover:border-primary/50 transition-colors">
                <div className="inline-flex w-fit p-2 bg-purple-500/10 rounded-lg transition-colors">
                  <DollarSign className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-2xl font-black tracking-tighter mt-2">
                  ${formatNumber(giftHistory.reduce((sum, gift) => sum + (gift.amount || 0), 0))}
                </p>
                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                  Amount Spent
                </p>
              </div>
              </div>
            )}

            {/* Card */}
            <div
              className="mx-auto max-w-lg w-full bg-card border border-border rounded-3xl shadow-xl p-6 sm:p-8"
              style={{ animation: "fadeSlideUp 0.5s ease 0.1s both" }}
            >
              {/* Step indicator — hide on success */}
              {step !== "success" && <StepIndicator current={stepIndex} />}

              {/* ── STEP 1: SEARCH ── */}
              {step === "search" && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <h2 className={`${montserrat.className} text-base font-extrabold text-foreground mb-4`}>
                    Find Recipient
                  </h2>

                  {/* Search input */}
                  <div className="relative mb-4">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
                      placeholder="Search user by email or username…"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    {searching && (
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Results */}
                  {searching ? (
                    <div className="space-y-2">
                      <SkeletonCard /><SkeletonCard />
                    </div>
                  ) : query && results.length === 0 ? (
                    <div className="flex flex-col items-center py-8 text-center">
                      <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-3">
                        <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-foreground">No users found</p>
                      <p className="text-xs text-muted-foreground mt-1">Try a different email or username.</p>
                    </div>
                  ) : results.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {results.map((user) => (
                        <UserCard
                          key={user.id}
                          user={user}
                          selected={selected?.id === user.id}
                          onClick={() => handleSelectUser(user)}
                        />
                      ))}
                    </div>
                  ) : null}

                  {/* Proceed button */}
                  <button
                    onClick={handleProceedToAmount}
                    disabled={!selected}
                    className={`mt-6 w-full py-3.5 rounded-xl font-extrabold text-sm transition-all duration-200 cursor-pointer
                      ${selected
                        ? "bg-primary text-primary-foreground hover:opacity-90 hover:scale-[1.01]"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                  >
                    {selected ? `Continue with ${selected.name.split(" ")[0]} →` : "Select a recipient to continue"}
                  </button>
                </div>
              )}

              {/* ── STEP 2: AMOUNT ── */}
              {step === "amount" && selected && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  {/* Selected user preview */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/8 border border-primary/20 mb-6">
                    <img src={selected.avatar} alt={selected.name} className="h-10 w-10 rounded-full object-cover border-2 border-primary/30 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{selected.name}</p>
                      <p className="text-xs text-muted-foreground truncate">@{selected.username}</p>
                    </div>
                    <button
                      onClick={() => { setStep("search"); setAmount(""); }}
                      className="ml-auto text-xs text-primary font-semibold hover:underline shrink-0 cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  <h2 className={`${montserrat.className} text-base font-extrabold text-foreground mb-4`}>
                    Enter Amount
                  </h2>

                  {/* Amount input */}
                  <div className="relative mb-4">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg pointer-events-none">$</span>
                    <input
                      type="number"
                      min="0"
                      value={amount}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (parseFloat(val) < 0) return;
                        setAmount(val);
                      }}
                      placeholder="0.00"
                      className="w-full pl-9 pr-16 py-4 rounded-xl bg-background border border-border text-2xl font-black text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-lg">USD</span>
                  </div>

                  {/* Quick-add buttons */}
                  <div className="flex gap-2 mb-6">
                    {[10, 50, 100, 200].map((v) => (
                      <button
                        key={v}
                        onClick={() => handleAddAmount(v)}
                        className="flex-1 py-2 rounded-lg border border-border bg-background text-xs font-bold text-foreground hover:border-primary hover:bg-primary/8 hover:text-primary transition-all cursor-pointer"
                      >
                        +${v}
                      </button>
                    ))}
                  </div>

                  {/* Commission note */}
                  <div className="flex gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 mb-4">
                    <svg className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300 leading-relaxed">
                      <span className="font-bold">You'll earn 5% commission!</span> For every gift you send, you receive 5% of the amount back as a reward.
                    </p>
                  </div>

                  {/* Disclaimer */}
                  <div className="flex gap-2 p-3 rounded-xl bg-muted/50 border border-border mb-6">
                    <svg className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2z" />
                    </svg>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      All transfers are final and cannot be reversed. Ensure recipient details are correct before confirming.
                    </p>
                  </div>

                  <button
                    onClick={handleProceedToConfirm}
                    disabled={!amount || parseFloat(amount) <= 0}
                    className={`w-full py-3.5 rounded-xl font-extrabold text-sm transition-all duration-200 cursor-pointer
                      ${amount && parseFloat(amount) > 0
                        ? "bg-primary text-primary-foreground hover:opacity-90 hover:scale-[1.01]"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                  >
                    Review Transfer →
                  </button>
                </div>
              )}

              {/* ── STEP 3: CONFIRM ── */}
              {step === "confirm" && selected && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <h2 className={`${montserrat.className} text-base font-extrabold text-foreground mb-5`}>
                    Confirm Transfer
                  </h2>

                  {/* Summary card */}
                  <div className="rounded-2xl border border-border bg-background overflow-hidden mb-6">
                    {/* Recipient row */}
                    <div className="flex items-center gap-3 p-4 border-b border-border">
                      <img src={selected.avatar} alt={selected.name} className="h-12 w-12 rounded-full object-cover border-2 border-border shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">Sending to</p>
                        <p className="text-sm font-bold text-foreground">{selected.name}</p>
                        <p className="text-xs text-muted-foreground">{selected.email}</p>
                      </div>
                    </div>

                    {/* Amount row */}
                    <div className="p-4 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Gift Amount</p>
                      <p className={`${montserrat.className} text-3xl font-black text-primary`}>
                        ${parseFloat(amount).toFixed(2)}
                      </p>
                    </div>

                    {/* Commission row */}
                    <div className="px-4 pb-4 flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/20">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold">Your 5% Commission</p>
                      </div>
                      <p className="text-lg font-black text-emerald-600">
                        +${(parseFloat(amount) * 0.05).toFixed(2)}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="px-4 pb-4 space-y-2 border-t border-border pt-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Username</span>
                        <span className="text-foreground font-semibold">@{selected.username}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Transfer type</span>
                        <span className="text-foreground font-semibold">Gift Transfer</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Fee</span>
                        <span className="text-primary font-semibold">Free</span>
                      </div>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="flex gap-2 p-3 rounded-xl bg-muted/50 border border-border mb-6">
                    <svg className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      <span className="font-bold text-foreground">This action is irreversible.</span> All transfers are final. Ensure recipient details are correct before confirming.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep("amount")}
                      className="flex-1 py-3.5 rounded-xl border border-border bg-background font-bold text-sm text-foreground hover:bg-muted transition-all cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={sending}
                      className="flex-[2] py-3.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm hover:opacity-90 transition-all relative overflow-hidden cursor-pointer"
                    >
                      {sending ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                          Processing…
                        </span>
                      ) : (
                        "Confirm Transfer 🎁"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Help text */}
            <p className="text-center text-xs text-muted-foreground mt-6" style={{ animation: "fadeSlideUp 0.5s ease 0.2s both" }}>
              Need help?{" "}
              <a href="#" className="text-primary hover:underline font-semibold cursor-pointer">Contact support</a>
            </p>

            {/* Gift History Section */}
            <div
              className="mt-10"
              style={{ animation: "fadeSlideUp 0.5s ease 0.3s both" }}
            >
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                <h2
                  className={`${montserrat.className} text-xl font-black text-foreground uppercase`}
                >
                  Gift History
                </h2>
              </div>
              <p className="text-[13px] text-muted-foreground mb-4">
                Showing your latest 10 gift transactions
              </p>

              {loadingHistory ? (
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            Recipient
                          </th>
                          <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            Email
                          </th>
                          <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            Amount
                          </th>
                          <th className="text-center px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            Status
                          </th>
                          <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                          <tr key={i} className="animate-pulse">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-muted" />
                                <div className="h-4 bg-muted rounded w-24" />
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-4 bg-muted rounded w-32" />
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="h-4 bg-muted rounded w-16 ml-auto" />
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="h-6 bg-muted rounded w-20 mx-auto" />
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="h-4 bg-muted rounded w-20 ml-auto" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : giftHistory.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-12 text-center">
                  <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-semibold mb-2">No gifts sent yet</p>
                  <p className="text-sm text-muted-foreground">
                    Start sending gifts to see your history here.
                  </p>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            Recipient
                          </th>
                          <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            Email
                          </th>
                          <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            Amount
                          </th>
                          <th className="text-center px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            Status
                          </th>
                          <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            Date
                          </th>
                        </tr>
                      </thead>
                     <tbody className="divide-y divide-border">
  {giftHistory.slice(0, 10).map((gift) => (
    <tr key={gift._id} className="hover:bg-muted/30 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3 flex-nowrap">
          <img
            src={gift.receiverProfileImage || "https://github.com/shadcn.png"}
            alt={gift.receiverName}
            className="h-10 w-10 rounded-xl object-cover border-2 border-border shrink-0"
          />
          <span className="text-sm font-semibold text-foreground whitespace-nowrap truncate max-w-[120px] sm:max-w-none">
            {gift.receiverName}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-muted-foreground">
          {gift.receiverEmail}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <span className="text-sm font-black text-primary">
          ${gift.amount}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            gift.status === 'completed'
              ? 'bg-emerald-500/10 text-emerald-500'
              : gift.status === 'pending'
              ? 'bg-amber-500/10 text-amber-500'
              : 'bg-red-500/10 text-red-500'
          }`}
        >
          {gift.status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <span className="text-xs text-muted-foreground">
          {new Date(gift.createdAt).toLocaleDateString()}
        </span>
      </td>
    </tr>
  ))}
</tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
        </div>
      </div>

      {/* Success modal */}
      {showSuccess && selected && (
        <SuccessModal
          recipient={selected}
          amount={parseFloat(amount).toFixed(2)}
          onClose={() => { handleReset(); toast.success("Gift sent successfully! 🎉"); }}
        />
      )}

      {/* Toast */}
      {/* Sonner toasts are rendered globally */}
    </>
  );
}