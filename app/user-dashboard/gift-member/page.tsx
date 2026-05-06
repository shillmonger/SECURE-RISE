"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["700", "800", "900"] });

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id: "1", name: "James Okafor",   username: "jamesokafor",  email: "james@example.com",   avatar: "https://i.pravatar.cc/80?img=11" },
  { id: "2", name: "Amaka Eze",      username: "amaka_eze",    email: "amaka@example.com",    avatar: "https://i.pravatar.cc/80?img=47" },
  { id: "3", name: "Tunde Adeyemi",  username: "tunde_dev",    email: "tunde@example.com",    avatar: "https://i.pravatar.cc/80?img=15" },
  { id: "4", name: "Chisom Nwosu",   username: "chisom_n",     email: "chisom@example.com",   avatar: "https://i.pravatar.cc/80?img=32" },
  { id: "5", name: "Fatima Bello",   username: "fatimabello",  email: "fatima@example.com",   avatar: "https://i.pravatar.cc/80?img=44" },
  { id: "6", name: "Emeka Obi",      username: "emeka_obi",    email: "emeka@example.com",    avatar: "https://i.pravatar.cc/80?img=53" },
];

type MockUser = (typeof MOCK_USERS)[number];
type Step = "search" | "amount" | "confirm" | "success";

// ─── TOAST ───────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold transition-all
        ${type === "success" ? "bg-primary/10 border-primary/30 text-primary" : "bg-red-500/10 border-red-500/30 text-red-400"}`}
      style={{ animation: "fadeSlideUp 0.3s ease" }}
    >
      <span className={`h-2 w-2 rounded-full shrink-0 ${type === "success" ? "bg-primary" : "bg-red-400"}`} />
      {msg}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 text-xs">✕</button>
    </div>
  );
}

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

// ─── USER RESULT CARD ────────────────────────────────────────────────────────
function UserCard({
  user,
  selected,
  onClick,
}: {
  user: MockUser;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200
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
function SuccessModal({ recipient, amount, onClose }: { recipient: MockUser; amount: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
      <div
        className="bg-card border border-border rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
        style={{ animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        {/* Animated checkmark */}
        <div className="mx-auto mb-5 h-20 w-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
          <svg className="h-9 w-9 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm hover:opacity-90 transition-opacity"
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
  const [results, setResults] = useState<MockUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<MockUser | null>(null);
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<Step>("search");
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); setSearching(false); return; }
    setSearching(true);
    debounceRef.current = setTimeout(() => {
      const q = query.toLowerCase();
      const found = MOCK_USERS.filter(
        (u) => u.email.includes(q) || u.username.includes(q) || u.name.toLowerCase().includes(q)
      );
      setResults(found);
      setSearching(false);
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const handleSelectUser = (user: MockUser) => {
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
      setToast({ msg: "Please enter a valid amount.", type: "error" });
      return;
    }
    setStep("confirm");
  };

  const handleSend = useCallback(async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSending(false);
    setShowSuccess(true);
  }, []);

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

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
            {/* Page Title */}
            <div className="mb-8" style={{ animation: "fadeSlideUp 0.5s ease" }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-3">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Gift Transfer
              </div>
              <h1 className={`${montserrat.className} text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight`}>
                Send a Gift
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Find a user and send them money instantly.
              </p>
            </div>

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
                    className={`mt-6 w-full py-3.5 rounded-xl font-extrabold text-sm transition-all duration-200
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
                    <button onClick={() => { setStep("search"); setAmount(""); }} className="ml-auto text-xs text-primary font-semibold hover:underline shrink-0">
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
                        className="flex-1 py-2 rounded-lg border border-border bg-background text-xs font-bold text-foreground hover:border-primary hover:bg-primary/8 hover:text-primary transition-all"
                      >
                        +${v}
                      </button>
                    ))}
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
                    className={`w-full py-3.5 rounded-xl font-extrabold text-sm transition-all duration-200
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
                      className="flex-1 py-3.5 rounded-xl border border-border bg-background font-bold text-sm text-foreground hover:bg-muted transition-all"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={sending}
                      className="flex-[2] py-3.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm hover:opacity-90 transition-all relative overflow-hidden"
                    >
                      {sending ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                          Processing…
                        </span>
                      ) : (
                        "Confirm Gift Transfer 🎁"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Help text */}
            <p className="text-center text-xs text-muted-foreground mt-6" style={{ animation: "fadeSlideUp 0.5s ease 0.2s both" }}>
              Need help?{" "}
              <a href="#" className="text-primary hover:underline font-semibold">Contact support</a>
            </p>
          </main>
        </div>
      </div>

      {/* Success modal */}
      {showSuccess && selected && (
        <SuccessModal
          recipient={selected}
          amount={parseFloat(amount).toFixed(2)}
          onClose={() => { handleReset(); setToast({ msg: "Gift sent successfully! 🎉", type: "success" }); }}
        />
      )}

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}