"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Wallet,
  ArrowUpRight,
  History,
  ShieldCheck,
  Info,
  Lock,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

// Types
interface CryptoAddress {
  id: string;
  crypto: {
    name: string;
    symbol: string;
    icon: string;
  };
  address: string;
}

interface WithdrawalHistory {
  id: string;
  amount: number;
  method: string;
  status: "pending" | "approved" | "rejected";
  date: string;
  destinationAddress: string;
}

interface UserData {
  accountBalance: number;
  cryptoAddresses: CryptoAddress[];
  withdrawals: WithdrawalHistory[];
}

// ─── Data & Types ─────────────────────────────────────────────────────────────

const SUPPORTED_CRYPTOS = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    icon: "https://i.postimg.cc/pLhcx2Vd/bitcoin-128.png",
    address: "bc1qnw5qxtvsayve32042dkruqnrcwx32r8vw4yfmd",
  },
  {
    name: "Solana",
    symbol: "SOL",
    icon: "https://i.postimg.cc/FzHG6vnh/solana-128.png",
    address: "Cgt3agGCp4ce5SfSuixJn3N1ByizfvLcNJeeYDWJha4D",
  },
  {
    name: "Tether",
    symbol: "USDT",
    icon: "https://i.postimg.cc/nLKkcr6W/tether-128.png",
    address: "TBdVHRagTQvoZ1o38Q3Gn5wUHFWFdLWuGX",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    icon: "https://i.postimg.cc/gJNH85kG/ethereum-128.png",
    address: "0xc28938a688215b45328068A6B5204f33e3051440",
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    icon: "https://i.postimg.cc/NGCx0WzT/usdc-128.png",
    address: "0xc28938a688215b45328068A6B5204f33e3051440",
  },
];

const WITHDRAW_HISTORY = [
  {
    id: "WID-882",
    amount: 500.0,
    method: "USDT",
    status: "completed",
    date: "Apr 12, 2026",
  },
  {
    id: "WID-129",
    amount: 120.0,
    method: "BTC",
    status: "pending",
    date: "Apr 14, 2026",
  },
  {
    id: "WID-119",
    amount: 350.0,
    method: "SOL",
    status: "rejected",
    date: "Apr 14, 2026",
  },
];

export default function WithdrawPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(SUPPORTED_CRYPTOS[0]);
  const [amount, setAmount] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawalHistory, setWithdrawalHistory] = useState<
    WithdrawalHistory[]
  >([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/withdraw");
      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setUserData({
        accountBalance: data.accountBalance,
        cryptoAddresses: data.cryptoAddresses,
        withdrawals: data.withdrawals,
      });
      setWithdrawalHistory(data.withdrawals);
    } catch (error) {
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const getUserAddressForCrypto = (cryptoSymbol: string) => {
    if (!userData?.cryptoAddresses) return "";
    const address = userData.cryptoAddresses.find(
      (addr) => addr.crypto.symbol === cryptoSymbol,
    );
    return address?.address || "";
  };

  const handleSendOtp = async () => {
    if (!amount || parseFloat(amount) < 100) {
      toast.error("Minimum withdrawal amount is $100");
      return;
    }

    if (userData && parseFloat(amount) > userData.accountBalance) {
      toast.error("Insufficient balance");
      return;
    }

    const destinationAddress = getUserAddressForCrypto(selectedCrypto.symbol);
    if (!destinationAddress) {
      toast.error(`No ${selectedCrypto.name} address found in your profile`);
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await fetch("/api/withdraw/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          crypto: selectedCrypto,
          destinationAddress,
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("OTP sent to your email");
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) < 100) {
      toast.error("Minimum withdrawal amount is $100");
      return;
    }

    if (!otp || otp.length !== 4) {
      toast.error("Please enter the 4-digit OTP");
      return;
    }

    const destinationAddress = getUserAddressForCrypto(selectedCrypto.symbol);
    if (!destinationAddress) {
      toast.error(`No ${selectedCrypto.name} address found in your profile`);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          crypto: selectedCrypto,
          destinationAddress,
          otp,
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Withdrawal request submitted successfully");
        // Reset form
        setAmount("");
        setOtp("");
        // Refresh data
        fetchUserData();
      }
    } catch (error) {
      toast.error("Failed to submit withdrawal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <section className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-none flex items-center gap-4">
                Withdraw Funds
              </h1>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-primary" /> Secure Capital
                Withdrawal
              </p>
            </section>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Withdrawal Form */}
              <div className="flex-1">
                <form
                  onSubmit={handleWithdraw}
                  className="bg-card border border-border rounded-[1rem] p-6 md:p-10 shadow-sm space-y-8"
                >
                  {/* Currency Selection */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      01. Payout Currency
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="w-full flex cursor-pointer items-center justify-between gap-3 bg-muted/30 border-2 border-border rounded-xl px-5 py-3 hover:border-foreground/50 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-background border flex items-center justify-center">
                              <img
                                src={selectedCrypto.icon}
                                alt={selectedCrypto.name}
                                className="w-10"
                              />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-black italic uppercase leading-none">
                                {selectedCrypto.name}
                              </p>
                              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                                {selectedCrypto.symbol}
                              </p>
                            </div>
                          </div>
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[300px] bg-card border-border rounded-xl">
                        {SUPPORTED_CRYPTOS.map((coin) => (
                          <DropdownMenuItem
                            key={coin.symbol}
                            onClick={() => setSelectedCrypto(coin)}
                            className="flex items-center gap-3 p-3 cursor-pointer focus:bg-muted/50 transition-colors"
                          >
                            <img
                              src={coin.icon}
                              alt={coin.name}
                              className="w-6 h-6"
                            />
                            <span className="font-black text-xs uppercase italic">
                              {coin.name}
                            </span>
                            <span className="ml-auto text-[10px] font-black text-muted-foreground">
                              {coin.symbol}
                            </span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Non-Editable Address */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      02. Destination Wallet Address
                    </label>
                    <div className="relative group">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
                      <input
                        type="text"
                        readOnly
                        value={getUserAddressForCrypto(selectedCrypto.symbol)}
                        placeholder={
                          loading
                            ? "Loading..."
                            : `No ${selectedCrypto.name} address found`
                        }
                        className="w-full bg-muted/20 border-2 border-border rounded-xl p-4 pr-12 text-xs font-black italic tracking-tighter text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                    <p className="text-[9px] font-black uppercase text-primary tracking-widest px-1">
                      Note: address linked to your profile settings
                    </p>
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        03. Amount to Cashout
                      </label>
                      <p className="text-[10px] font-black uppercase text-muted-foreground">
                        Available:{" "}
                        <span className="text-foreground">
                          $
                          {loading
                            ? "Loading..."
                            : userData?.accountBalance?.toLocaleString() || "0"}
                        </span>
                      </p>
                    </div>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black italic text-muted-foreground">
                        $
                      </span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-muted/30 border-2 border-border rounded-xl p-2 pl-12 text-xl font-black italic tracking-tighter focus:border-foreground focus:outline-none transition-all"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* OTP Section */}
                  {/* OTP Section */}
                  <div className="space-y-3 pt-4 border-t border-border/50">
                    {/* Flex container for Label and Button */}
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        04. Email Authentication
                      </label>

                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp}
                        className="bg-primary text-primary-foreground cursor-pointer px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all border border-primary flex items-center justify-center disabled:opacity-50"
                      >
                        {isSendingOtp ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          "Send OTP"
                        )}
                      </button>
                    </div>

                    <div className="flex">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-muted/30 border-2 border-border rounded-xl p-3 text-center text-lg font-black tracking-[0.5em] focus:border-primary focus:outline-none transition-all"
                        placeholder="****"
                      />
                    </div>
                  </div>

                  <button
                    disabled={isSubmitting || !amount || !otp}
                    className="w-full bg-foreground cursor-pointer text-background py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl disabled:opacity-20"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Request Withdrawal <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Right: Stats & History */}
              <div className="w-full lg:w-[400px] space-y-6">
                {/* Withdrawal Rules */}
                <div className="bg-foreground text-background p-4 md:p-5 rounded-[1rem] space-y-6 relative overflow-hidden">
                  <Info className="absolute -right-4 -top-4 w-24 h-24 opacity-10" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                    Withdrawal Rules
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-background/10 pb-2">
                      <span className="text-[11px] font-black uppercase italic tracking-tighter opacity-80">
                        Minimum Amount
                      </span>
                      <span className="text-sm font-black italic">$100.00</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-background/10 pb-2">
                      <span className="text-[11px] font-black uppercase italic tracking-tighter opacity-80">
                        Processing Fee
                      </span>
                      <span className="text-sm font-black italic">0%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black uppercase italic tracking-tighter opacity-80">
                        Timeframe
                      </span>
                      <span className="text-sm font-black italic">
                        0-24 Hours
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-muted-foreground" />
                      <p className="text-[10px] font-black uppercase tracking-widest">
                        Withdrawal Logs
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {loading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                        <p className="text-xs">Loading withdrawal history...</p>
                      </div>
                    ) : withdrawalHistory.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-xs">No withdrawals yet</p>
                      </div>
                    ) : (
                      withdrawalHistory.map((log) => (
                        <div
                          key={log.id}
                          className="bg-muted/30 border border-border/50 p-4 rounded-xl flex items-center justify-between group hover:border-foreground/20 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-background rounded-lg">
                              <Wallet className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase italic tracking-tight">
                                {log.method} Payout
                              </p>
                              <p className="text-[9px] font-black uppercase text-muted-foreground">
                                {log.date}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black italic tracking-tighter">
                              -${log.amount.toLocaleString()}
                            </p>
                            <div className="flex items-center justify-end gap-1">
                              {log.status === "approved" ? (
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                              ) : log.status === "pending" ? (
                                <Clock className="w-3 h-3 text-amber-700" />
                              ) : (
                                <XCircle className="w-3 h-3 text-red-500" />
                              )}
                              <p
                                className={`text-[8px] font-black uppercase tracking-widest ${
                                  log.status === "approved"
                                    ? "text-green-500"
                                    : log.status === "pending"
                                      ? "text-amber-700"
                                      : "text-red-500"
                                }`}
                              >
                                {log.status}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
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
