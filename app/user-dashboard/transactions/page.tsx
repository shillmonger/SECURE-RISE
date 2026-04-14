"use client";

import React, { useState } from "react";
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  RefreshCcw, 
  ShoppingBag, 
  Filter, 
  Search,
  ChevronRight,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

// ─── Data & Types ─────────────────────────────────────────────────────────────

type TransactionType = 'deposit' | 'withdrawal' | 'investment' | 'roi';
type TransactionStatus = 'completed' | 'pending' | 'failed';

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  method: string;
  status: TransactionStatus;
  date: string;
  timestamp: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "TXN-99210", type: "roi", amount: 450.00, method: "Daily Profit", status: "completed", date: "Apr 14, 2026", timestamp: "12:45 PM" },
  { id: "TXN-99209", type: "withdrawal", amount: 1200.00, method: "Bitcoin", status: "pending", date: "Apr 13, 2026", timestamp: "09:20 AM" },
  { id: "TXN-99208", type: "investment", amount: 5000.00, method: "Gold Plan", status: "completed", date: "Apr 12, 2026", timestamp: "03:15 PM" },
  { id: "TXN-99207", type: "deposit", amount: 2500.00, method: "USDT TRC20", status: "completed", date: "Apr 10, 2026", timestamp: "11:00 AM" },
  { id: "TXN-99206", type: "roi", amount: 120.50, method: "Starter Plan", status: "completed", date: "Apr 10, 2026", timestamp: "12:00 PM" },
];

export default function TransactionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  const getIcon = (type: TransactionType) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'investment': return <ShoppingBag className="w-4 h-4 text-red-500" />;
      case 'roi': return <RefreshCcw className="w-4 h-4 text-green-500" />;
    }
  };

  const getStatusStyle = (status: TransactionStatus) => {
    switch (status) {
      case 'completed': return { icon: <CheckCircle2 className="w-3 h-3" />, color: "text-green-500 bg-green-500/10" };
      case 'pending': return { icon: <Clock className="w-3 h-3" />, color: "text-amber-700 bg-amber-700/10" };
      case 'failed': return { icon: <XCircle className="w-3 h-3" />, color: "text-red-500 bg-red-500/10" };
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Page Title & Export */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">
                  TRS History
                </h1>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                  Total of {MOCK_TRANSACTIONS.length} processed transactions
                </p>
              </div>
              <button className="hidden md:flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-card border border-border rounded-[1rem] p-4 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search ID or Method..." 
                  className="w-full bg-muted/30 border border-border rounded-xl py-3 pl-12 pr-4 text-xs font-bold focus:outline-none focus:border-foreground transition-all"
                />
              </div>
              
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {['all', 'deposit', 'withdrawal', 'investment', 'roi'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-5 py-3 rounded-xl cursor-pointer text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                      filterType === type 
                        ? "bg-foreground text-background border-foreground shadow-lg" 
                        : "bg-background text-muted-foreground border-border hover:border-muted-foreground/50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              <button className="p-3 border cursor-pointer border-border rounded-xl hover:bg-muted transition-all">
                <Calendar className="w-4 h-4" />
              </button>
              </div>

            </div>

            {/* Transactions List */}
            <div className="space-y-4">
              {MOCK_TRANSACTIONS.map((txn) => {
                const status = getStatusStyle(txn.status);
                return (
                  <div 
                    key={txn.id}
                    className="group bg-card border border-border cursor-pointer rounded-[1rem] p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-foreground/40 transition-all hover:shadow-xl"
                  >
                    {/* Left: Type and Info */}
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-border group-hover:bg-foreground group-hover:text-background transition-all duration-300`}>
                        {getIcon(txn.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-sm font-black italic uppercase tracking-tight">{txn.method}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter flex items-center gap-1 ${status.color}`}>
                            {status.icon} {txn.status}
                          </span>
                        </div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">ID: {txn.id} • {txn.date} at {txn.timestamp}</p>
                      </div>
                    </div>

                    {/* Right: Amount and Action */}
                    <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-border/50">
                      <div className="text-right">
                        <p className={`text-xl font-black italic tracking-tighter ${
                          (txn.type === 'withdrawal' || txn.type === 'investment') ? 'text-red-500' : 
                          (txn.type === 'deposit' || txn.type === 'roi') ? 'text-green-500' : 'text-foreground'
                        }`}>
                          {txn.type === 'withdrawal' || txn.type === 'investment' ? '-' : '+'}${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em]">{txn.type}</p>
                      </div>
                      <button className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-foreground hover:text-background transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Empty State Mockup */}
              {MOCK_TRANSACTIONS.length === 0 && (
                <div className="py-20 text-center space-y-4 opacity-20 border-2 border-dashed border-border rounded-[3rem]">
                   <Filter className="w-12 h-12 mx-auto" />
                   <p className="text-[10px] font-black uppercase tracking-[0.3em]">No transactions found for this filter</p>
                </div>
              )}
            </div>

            {/* Pagination Button */}
            <div className="flex justify-center pt-6">
              <button className="px-10 py-4 bg-muted/30 border border-border cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all">
                Load More Activity
              </button>
            </div>

          </div>
        </main>
      </div>
      <UserNav />
    </div>
  );
}