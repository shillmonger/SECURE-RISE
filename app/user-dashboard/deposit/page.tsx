"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  DollarSign, 
  History, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Plus
} from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DepositRecord {
  id: string;
  paymentMethod: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_DEPOSITS: DepositRecord[] = [
  { id: "DEP-101", paymentMethod: "USDT TRC20", amount: 1500, status: "pending", date: "Apr 14, 2026" },
  { id: "DEP-102", paymentMethod: "Bitcoin", amount: 500, status: "approved", date: "Apr 10, 2026" },
  { id: "DEP-103", paymentMethod: "Ethereum", amount: 2400, status: "rejected", date: "Apr 05, 2026" },
];

const PAYMENT_METHODS = [
  { name: "Bitcoin", ticker: "BTC" },
  { name: "Ethereum", ticker: "ETH" },
  { name: "USDT TRC20", ticker: "USDT" },
  { name: "USDT ERC20", ticker: "USDT" },
  { name: "Solana", ticker: "SOL" },
  { name: "Litecoin", ticker: "LTC" },
  { name: "XRP", ticker: "XRP" },
  { name: "Doge", ticker: "DOGE" },
  { name: "Binance Coin", ticker: "BNB" },
  { name: "Cardano", ticker: "ADA" },
];

const DepositPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [amount, setAmount] = useState("100");
  const [selectedMethod, setSelectedMethod] = useState("USDT TRC20");

  const totalApproved = MOCK_DEPOSITS
    .filter(d => d.status === 'approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "approved": return { icon: <CheckCircle2 className="w-3 h-3 text-primary" />, text: "text-primary" };
      case "rejected": return { icon: <XCircle className="w-3 h-3 text-red-500" />, text: "text-red-500" };
      default: return { icon: <Clock className="w-3 h-3 text-muted-foreground" />, text: "text-muted-foreground" };
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* Page Title */}
            <section className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-none flex items-center gap-4">
                Fund Balance
              </h1>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-primary" />
                Secure multi-chain deposit system
              </p>
            </section>

            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left Side: Form */}
              <div className="flex-1 space-y-8">
                <div className="bg-card border border-border rounded-[1.5rem] p-5 md:p-7 shadow-sm">
                  
                  {/* Amount Input */}
                  <div className="space-y-4 mb-10">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <CreditCard className="w-3 h-3" /> 01. Enter Deposit Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black italic text-muted-foreground">$</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-muted/30 border-2 border-border rounded-xl p-3 pl-12 text-xl font-black italic tracking-tighter focus:border-foreground focus:outline-none transition-all"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Payment Methods Grid */}
                  <div className="space-y-4 mb-10">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Plus className="w-3 h-3" /> 02. Select Asset
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                      {PAYMENT_METHODS.map((method) => (
                        <button
                          key={method.name}
                          onClick={() => setSelectedMethod(method.name)}
                          className={`flex items-center justify-between cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                            selectedMethod === method.name
                              ? "bg-foreground border-foreground shadow-xl scale-[1.02]"
                              : "bg-background border-border hover:border-muted-foreground/50"
                          }`}
                        >
                          <div className="text-left">
                            <p className={`text-[10px] font-black uppercase tracking-widest ${selectedMethod === method.name ? "text-background/60" : "text-muted-foreground"}`}>
                              {method.ticker}
                            </p>
                            <p className={`text-sm font-black italic uppercase ${selectedMethod === method.name ? "text-background" : "text-foreground"}`}>
                              {method.name}
                            </p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedMethod === method.name ? "border-background" : "border-muted"
                          }`}>
                            {selectedMethod === method.name && <div className="w-2.5 h-2.5 bg-background rounded-full" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <Link href={`/user-dashboard/deposit/${selectedMethod.toLowerCase().replace(/\s+/g, '-')}`}>
                    <button className="w-full bg-foreground cursor-pointer text-background py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl">
                      Proceed to Checkout <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right Side: Sidebar Stats */}
              <div className="w-full lg:w-[380px] space-y-6">
                
                {/* Total Funded Card */}
                <div className="bg-foreground text-background p-5 md:p-6 rounded-[1.5rem] relative overflow-hidden group">
                  <DollarSign className="absolute -right-4 -top-4 w-24 h-24 opacity-10" />
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Total Funded Balance</p>
                  <h3 className="text-4xl font-black italic tracking-tighter">
                    ${totalApproved.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h3>
                </div>

                {/* History Section */}
                <div className="bg-card border border-border rounded-[1.5rem] p-5 md:p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-muted-foreground" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Recent Activity</p>
                    </div>
                    <button className="text-[9px] font-black uppercase tracking-widest text-primary border-b border-primary/30">View All</button>
                  </div>

                  <div className="space-y-3">
                    {MOCK_DEPOSITS.map((deposit) => {
                      const style = getStatusStyles(deposit.status);
                      return (
                        <div key={deposit.id} className="bg-muted/30 border border-border/50 p-4 rounded-2xl flex items-center justify-between group hover:border-foreground/20 transition-all">
                          <div>
                            <p className="text-xs font-black uppercase italic tracking-tight">{deposit.paymentMethod}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {style.icon}
                              <span className="text-[9px] font-black uppercase text-muted-foreground">{deposit.date}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black italic tracking-tighter">${deposit.amount.toLocaleString()}</p>
                            <p className={`text-[8px] font-black uppercase tracking-widest ${style.text}`}>
                              {deposit.status}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {MOCK_DEPOSITS.length === 0 && (
                      <div className="text-center py-10 opacity-40">
                        <Wallet className="w-10 h-10 mx-auto mb-2" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No history found</p>
                      </div>
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
};

export default DepositPage;