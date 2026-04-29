"use client";

import React, { useState, useEffect } from "react";
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
  XCircle,
  Gift,
  TrendingUp,
  ArrowDownCircle
} from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";
import Link from "next/link";

// ─── Data & Types ─────────────────────────────────────────────────────────────

type TransactionType = 'deposit' | 'withdrawal' | 'investment' | 'roi';
type TransactionStatus = 'completed' | 'pending' | 'failed' | 'approved' | 'rejected' | 'active';

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  method: string;
  status: TransactionStatus;
  date: string;
  timestamp: string;
  rawData?: any;
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  // Fetch real data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch("/api/user/info");
        const userResult = await userResponse.json();
        
        if (userResult.success) {
          setUserData(userResult.user);
        }

        // Fetch deposits
        const depositsResponse = await fetch(`/api/user-dashboard/deposit?userId=${userResult.user.id}`);
        const depositsResult = await depositsResponse.json();
        
        // Fetch withdrawals
        const withdrawalsResponse = await fetch("/api/withdraw");
        const withdrawalsResult = await withdrawalsResponse.json();
        
        // Fetch investments
        const investmentsResponse = await fetch("/api/investments");
        const investmentsResult = await investmentsResponse.json();

        const allTransactions: Transaction[] = [];

        // Process deposits
        if (depositsResult.success && depositsResult.deposits) {
          depositsResult.deposits.forEach((deposit: any) => {
            allTransactions.push({
              id: deposit.transactionId || deposit._id,
              type: 'deposit',
              amount: deposit.amount,
              method: deposit.paymentMethod,
              status: deposit.status,
              date: new Date(deposit.createdAt).toLocaleDateString(),
              timestamp: new Date(deposit.createdAt).toLocaleTimeString(),
              rawData: deposit
            });
          });
        }

        // Process withdrawals
        if (withdrawalsResult.withdrawals) {
          withdrawalsResult.withdrawals.forEach((withdrawal: any) => {
            allTransactions.push({
              id: withdrawal.withdrawalId || withdrawal._id,
              type: 'withdrawal',
              amount: withdrawal.amount,
              method: `${withdrawal.crypto?.name || 'Unknown'} - ${withdrawal.crypto?.symbol || ''}`,
              status: withdrawal.status,
              date: new Date(withdrawal.createdAt).toLocaleDateString(),
              timestamp: new Date(withdrawal.createdAt).toLocaleTimeString(),
              rawData: withdrawal
            });
          });
        }

        // Process investments
        if (investmentsResult.investments) {
          investmentsResult.investments.forEach((investment: any) => {
            allTransactions.push({
              id: investment._id,
              type: 'investment',
              amount: investment.investmentAmount,
              method: investment.planName,
              status: investment.status,
              date: new Date(investment.startDate).toLocaleDateString(),
              timestamp: new Date(investment.startDate).toLocaleTimeString(),
              rawData: investment
            });

            // Add profit history as ROI transactions
            if (investment.profitHistory && investment.profitHistory.length > 0) {
              investment.profitHistory.forEach((profit: any) => {
                allTransactions.push({
                  id: `ROI-${investment._id}-${profit.timestamp}`,
                  type: 'roi',
                  amount: profit.amount,
                  method: `${investment.planName} - ${profit.rate}% ROI`,
                  status: 'completed',
                  date: new Date(profit.timestamp).toLocaleDateString(),
                  timestamp: new Date(profit.timestamp).toLocaleTimeString(),
                  rawData: { ...profit, investment }
                });
              });
            }
          });
        }

        // Sort by date (most recent first)
        allTransactions.sort((a, b) => {
          const dateA = new Date(a.rawData?.createdAt || a.rawData?.timestamp || Date.now());
          const dateB = new Date(b.rawData?.createdAt || b.rawData?.timestamp || Date.now());
          return dateB.getTime() - dateA.getTime();
        });

        setTransactions(allTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTransactions = filterType === 'all' 
    ? transactions 
    : transactions.filter(txn => txn.type === filterType);

  const getIcon = (type: TransactionType) => {
    switch (type) {
      case 'deposit': return <ArrowDownCircle className="w-4 h-4 text-green-500" />;
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'investment': return <Gift className="w-4 h-4 text-blue-500" />;
      case 'roi': return <TrendingUp className="w-4 h-4 text-purple-500" />;
    }
  };

  const getStatusStyle = (status: TransactionStatus) => {
    switch (status) {
      case 'completed': 
      case 'approved': 
        return { icon: <CheckCircle2 className="w-3 h-3" />, color: "text-green-500 bg-green-500/10" };
      case 'pending': 
        return { icon: <Clock className="w-3 h-3" />, color: "text-amber-700 bg-amber-700/10" };
      case 'failed':
      case 'rejected': 
        return { icon: <XCircle className="w-3 h-3" />, color: "text-red-500 bg-red-500/10" };
      case 'active': 
        return { icon: <RefreshCcw className="w-3 h-3" />, color: "text-blue-500 bg-blue-500/10" };
      default:
        return { icon: <Clock className="w-3 h-3" />, color: "text-gray-500 bg-gray-500/10" };
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
                  {loading ? 'Loading transactions...' : `Total of ${filteredTransactions.length} processed transactions`}
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
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-card border border-border rounded-[1rem] p-4 md:p-6 animate-pulse">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-muted"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-1/3"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                        <div className="h-6 bg-muted rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="py-20 text-center space-y-4 opacity-20 border-2 border-dashed border-border rounded-[3rem]">
                   <Filter className="w-12 h-12 mx-auto" />
                   <p className="text-[10px] font-black uppercase tracking-[0.3em]">No transactions found for this filter</p>
                </div>
              ) : (
                filteredTransactions.map((txn) => {
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
                })
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