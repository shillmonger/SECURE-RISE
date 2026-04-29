"use client";

import React, { useState, useEffect } from "react";
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
  Plus,
  Loader2
} from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DepositRecord {
  _id: string;
  transactionId: string;
  paymentMethod: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  proofImage?: string;
}

const PAYMENT_METHODS = [
  { name: "USDT TRC20", ticker: "USDT" },
  { name: "Bitcoin", ticker: "BTC" },
  { name: "Ethereum", ticker: "ETH" },
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
  const [deposits, setDeposits] = useState<DepositRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      // Get user info from server using auth token
      const userResponse = await fetch('/api/user/info');
      
      if (!userResponse.ok) {
        console.log('User not authenticated, skipping deposit fetch');
        setLoading(false);
        return;
      }
      
      const userData = await userResponse.json();
      
      if (!userData.success || !userData.user) {
        console.log('Invalid user data, skipping deposit fetch');
        setLoading(false);
        return;
      }
      
      const user = userData.user;
      const response = await fetch(`/api/user-dashboard/deposit?userId=${user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setDeposits(data.deposits || []);
      }
    } catch (error) {
      console.error('Error fetching deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalApproved = deposits
    .filter((d: DepositRecord) => d.status === 'approved')
    .reduce((acc: number, curr: DepositRecord) => acc + curr.amount, 0);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "approved": return { icon: <CheckCircle2 className="w-3 h-3 text-green-500" />, text: "text-green-500" };
      case "rejected": return { icon: <XCircle className="w-3 h-3 text-red-500" />, text: "text-red-500" };
      default: return { icon: <Clock className="w-3 h-3 text-orange-700" />, text: "text-orange-700" };
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
                <div className="bg-card border border-border rounded-[1rem] p-5 md:p-7 shadow-sm">
                  
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
                          className={`flex items-center justify-between cursor-pointer px-5 py-3  rounded-xl border-2 transition-all duration-300 ${
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
                  <Link href={`/user-dashboard/deposit/${selectedMethod.toLowerCase().replace(/\s+/g, '-')}?amount=${amount}`}>
                    <button className="w-full bg-foreground cursor-pointer text-background py-5 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl">
                      Proceed to Checkout <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right Side: Sidebar Stats */}
              <div className="w-full lg:w-[380px] space-y-6">
                
                {/* Total Funded Card */}
                <div className="bg-foreground text-background p-5 md:p-6 rounded-[1rem] relative overflow-hidden group">
                  <DollarSign className="absolute -right-4 -top-4 w-24 h-24 opacity-10" />
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Total Funded Balance</p>
                  <h3 className="text-4xl font-black italic tracking-tighter">
                    ${totalApproved.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h3>
                </div>

                {/* History Section */}
                <div className="bg-card border border-border rounded-[1rem] p-5 md:p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-muted-foreground" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Recent Activity</p>
                    </div>
                    <button className="text-[9px] font-black uppercase tracking-widest text-primary border-b border-primary/30">View All</button>
                  </div>

                  <div className="space-y-3">
                    {loading ? (
                      <div className="flex items-center justify-center py-10 opacity-40">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Loading...</p>
                      </div>
                    ) : deposits.length > 0 ? (
                      deposits.slice(0, 5).map((deposit: DepositRecord) => {
                        const style = getStatusStyles(deposit.status);
                        const formattedDate = new Date(deposit.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        });
                        return (
                          <div key={deposit._id} className="bg-muted/30 border border-border/50 p-4 rounded-lg flex items-center justify-between group hover:border-foreground/20 transition-all">
                            <div>
                              <p className="text-xs font-black uppercase italic tracking-tight">{deposit.paymentMethod}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {style.icon}
                                <span className="text-[9px] font-black uppercase text-muted-foreground">{formattedDate}</span>
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
                      })
                    ) : (
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