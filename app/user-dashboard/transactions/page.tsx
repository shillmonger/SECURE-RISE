"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowUpRight,
  RefreshCcw,
  Filter,
  Search,
  ChevronRight,
  ChevronLeft,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Gift,
  TrendingUp,
  ArrowDownCircle,
} from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

// ─── Data & Types ─────────────────────────────────────────────────────────────

type TransactionType = "deposit" | "withdrawal" | "investment" | "roi";
type TransactionStatus =
  | "completed"
  | "pending"
  | "failed"
  | "approved"
  | "rejected"
  | "active";

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

const ITEMS_PER_PAGE = 50;

export default function TransactionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch("/api/user/info");
        const userResult = await userResponse.json();

        const depositsResponse = await fetch(
          `/api/user-dashboard/deposit?userId=${userResult.user.id}`
        );
        const depositsResult = await depositsResponse.json();

        const withdrawalsResponse = await fetch(
          `/api/withdraw?userId=${userResult.user.id}`
        );
        const withdrawalsResult = await withdrawalsResponse.json();

        const investmentsResponse = await fetch("/api/investments");
        const investmentsResult = await investmentsResponse.json();

        const allTransactions: Transaction[] = [];

        if (depositsResult.success && depositsResult.deposits) {
          depositsResult.deposits.forEach((deposit: any) => {
            allTransactions.push({
              id: deposit.transactionId || deposit._id,
              type: "deposit",
              amount: deposit.amount,
              method: deposit.paymentMethod,
              status: deposit.status,
              date: new Date(deposit.createdAt).toLocaleDateString(),
              timestamp: new Date(deposit.createdAt).toLocaleTimeString(),
              rawData: deposit,
            });
          });
        }

        if (withdrawalsResult.withdrawals) {
          withdrawalsResult.withdrawals.forEach(
            (withdrawal: any, index: number) => {
              const withdrawalId =
                withdrawal.id || `withdrawal-${index}`;
              const method = withdrawal.method || "Unknown";
              const status = withdrawal.status || "unknown";
              const amount = withdrawal.amount || 0;
              const date =
                withdrawal.date || new Date().toLocaleDateString();
              const dateObj = new Date(date);
              const timestamp = dateObj.toLocaleTimeString();

              allTransactions.push({
                id: withdrawalId,
                type: "withdrawal",
                amount,
                method,
                status,
                date,
                timestamp,
                rawData: withdrawal,
              });
            }
          );
        }

        if (investmentsResult.investments) {
          investmentsResult.investments.forEach((investment: any) => {
            allTransactions.push({
              id: investment._id,
              type: "investment",
              amount: investment.investmentAmount,
              method: investment.planName,
              status: investment.status,
              date: new Date(investment.startDate).toLocaleDateString(),
              timestamp: new Date(
                investment.startDate
              ).toLocaleTimeString(),
              rawData: investment,
            });

            if (
              investment.profitHistory &&
              investment.profitHistory.length > 0
            ) {
              investment.profitHistory.forEach((profit: any) => {
                allTransactions.push({
                  id: `ROI-${investment._id}-${profit.timestamp}`,
                  type: "roi",
                  amount: profit.amount,
                  method: `${investment.planName} - ${profit.rate}% ROI`,
                  status: "completed",
                  date: new Date(profit.timestamp).toLocaleDateString(),
                  timestamp: new Date(
                    profit.timestamp
                  ).toLocaleTimeString(),
                  rawData: { ...profit, investment },
                });
              });
            }
          });
        }

        allTransactions.sort((a, b) => {
          const dateA = new Date(
            a.rawData?.createdAt || a.rawData?.timestamp || Date.now()
          );
          const dateB = new Date(
            b.rawData?.createdAt || b.rawData?.timestamp || Date.now()
          );
          return dateB.getTime() - dateA.getTime();
        });

        setTransactions(allTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ─── Filtering ──────────────────────────────────────────────────────────────
  const filteredTransactions = transactions.filter((txn) => {
    const matchType = filterType === "all" || txn.type === filterType;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      txn.id.toLowerCase().includes(q) ||
      txn.method.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchQuery]);

  // ─── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  );
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const truncateId = (id: string) => {
    if (!id) return "Unknown";
    return id.length > 10 ? id.substring(0, 10) + "…………" : id;
  };

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case "deposit":
        return (
          <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <ArrowDownCircle className="w-4 h-4 text-green-500" />
          </div>
        );
      case "withdrawal":
        return (
          <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-red-500" />
          </div>
        );
      case "investment":
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Gift className="w-4 h-4 text-blue-500" />
          </div>
        );
      case "roi":
        return (
          <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
        );
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    const map: Record<
      TransactionStatus,
      { icon: React.ReactNode; cls: string; label: string }
    > = {
      completed: {
        icon: <CheckCircle2 className="w-3 h-3" />,
        cls: "text-green-400 bg-green-500/10 border border-green-500/20",
        label: "Completed",
      },
      approved: {
        icon: <CheckCircle2 className="w-3 h-3" />,
        cls: "text-green-400 bg-green-500/10 border border-green-500/20",
        label: "Approved",
      },
      pending: {
        icon: <Clock className="w-3 h-3" />,
        cls: "text-amber-400 bg-amber-500/10 border border-amber-500/20",
        label: "Pending",
      },
      failed: {
        icon: <XCircle className="w-3 h-3" />,
        cls: "text-red-400 bg-red-500/10 border border-red-500/20",
        label: "Failed",
      },
      rejected: {
        icon: <XCircle className="w-3 h-3" />,
        cls: "text-red-400 bg-red-500/10 border border-red-500/20",
        label: "Rejected",
      },
      active: {
        icon: <RefreshCcw className="w-3 h-3" />,
        cls: "text-blue-400 bg-blue-500/10 border border-blue-500/20",
        label: "Active",
      },
    };

    const s = map[status] ?? {
      icon: <Clock className="w-3 h-3" />,
      cls: "text-muted-foreground bg-muted border border-border",
      label: status,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${s.cls}`}
      >
        {s.icon}
        {s.label}
      </span>
    );
  };

  const getActionBadge = (type: TransactionType) => {
    const map: Record<TransactionType, { label: string; cls: string }> = {
      deposit: {
        label: "Deposit",
        cls: "text-green-400 bg-green-500/10 border border-green-500/20",
      },
      withdrawal: {
        label: "Withdrawal",
        cls: "text-red-400 bg-red-500/10 border border-red-500/20",
      },
      investment: {
        label: "Investment",
        cls: "text-blue-400 bg-blue-500/10 border border-blue-500/20",
      },
      roi: {
        label: "ROI",
        cls: "text-purple-400 bg-purple-500/10 border border-purple-500/20",
      },
    };

    const a = map[type];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${a.cls}`}
      >
        {a.label}
      </span>
    );
  };

  const getAmountColor = (type: TransactionType) => {
    if (type === "deposit" || type === "roi") return "text-green-400";
    if (type === "withdrawal" || type === "investment") return "text-red-400";
    return "text-foreground";
  };

  const getAmountPrefix = (type: TransactionType) =>
    type === "deposit" || type === "roi" ? "+" : "-";

  // ─── Skeleton rows ───────────────────────────────────────────────────────────
  const SkeletonRow = () => (
    <tr className="border-b border-border/40 animate-pulse">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </td>
      ))}
    </tr>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <UserSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* ── Page Title ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic leading-none">
                  TRS History
                </h1>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  {loading
                    ? "Loading transactions…"
                    : `${filteredTransactions.length} transaction${filteredTransactions.length !== 1 ? "s" : ""}`}
                </p>
              </div>
              <button className="hidden md:flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>

            {/* ── Filter Bar ── */}
            <div className="bg-card border border-border rounded-xl p-4 lg:p-4 flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="flex-1 min-w-[180px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ID or method…"
                  className="w-full bg-muted/30 border border-border rounded-lg py-2.5 pl-10 pr-4 text-xs font-bold focus:outline-none focus:border-foreground transition-all"
                />
              </div>

              {/* Type filters */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-wrap">
                {["all", "deposit", "withdrawal", "investment", "roi"].map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-2.5 rounded-lg cursor-pointer text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                        filterType === type
                          ? "bg-foreground text-background border-foreground shadow-lg"
                          : "bg-background text-muted-foreground border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      {type}
                    </button>
                  )
                )}
                <button className="p-2.5 border border-border rounded-xl hover:bg-muted transition-all">
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Table Card ── */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Table with horizontal scrolling */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/20">
                      <th className="px-5 py-4 text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
                        Icon
                      </th>
                      <th className="px-5 py-4 text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
                        Symbol / Method
                      </th>
                      <th className="px-5 py-4 text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
                        Transaction ID
                      </th>
                      <th className="px-5 py-4 text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
                        Date
                      </th>
                      <th className="px-5 py-4 text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-5 py-4 text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right whitespace-nowrap">
                        Amount
                      </th>
                      <th className="px-5 py-4 text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center whitespace-nowrap">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [...Array(10)].map((_, i) => <SkeletonRow key={i} />)
                    ) : paginatedTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={7}>
                          <div className="py-20 text-center space-y-3 opacity-30">
                            <Filter className="w-10 h-10 mx-auto" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                              No transactions found
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedTransactions.map((txn) => (
                        <tr
                          key={txn.id || Math.random()}
                          className="border-b border-border/30 hover:bg-muted/10 transition-colors group"
                        >
                          {/* Icon */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            {getTypeIcon(txn.type)}
                          </td>

                          {/* Symbol / Method */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <p className="text-sm font-black italic uppercase tracking-tight">
                              {txn.method}
                            </p>
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                              {txn.type}
                            </p>
                          </td>

                          {/* ID */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="text-[12px] font-mono font-bold text-muted-foreground">
                              {truncateId(txn.id)}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <p className="text-sm font-bold">{txn.date}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {txn.timestamp}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            {getStatusBadge(txn.status)}
                          </td>

                          {/* Amount */}
                          <td className="px-5 py-4 text-right whitespace-nowrap">
                            <span
                              className={`text-base font-black italic ${getAmountColor(txn.type)}`}
                            >
                              {getAmountPrefix(txn.type)}$
                              {txn.amount.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-5 py-4 text-center whitespace-nowrap">
                            {getActionBadge(txn.type)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>


              {/* ── Pagination ── */}
              {!loading && filteredTransactions.length > 0 && (
                <div className="border-t border-border/40 px-5 py-4 flex items-center justify-between gap-4">
<p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest"> 
                     Page {currentPage} of {totalPages} &nbsp;·&nbsp;{" "}
                    {filteredTransactions.length} results
                  </p>

                  <div className="flex justify-end items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.max(1, p - 1))
                      }
                      disabled={currentPage === 1}
                      className="w-9 h-9 rounded-xl cursor-pointer border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page number pills */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (p) =>
                          p === 1 ||
                          p === totalPages ||
                          Math.abs(p - currentPage) <= 1
                      )
                      .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                        if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                          acc.push("…");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) =>
                        p === "…" ? (
                          <span
                            key={`ellipsis-${i}`}
                            className="text-[10px] text-muted-foreground px-1"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setCurrentPage(p as number)}
                            className={`w-9 h-9 rounded-xl cursor-pointer border text-[10px] font-black transition-all ${
                              currentPage === p
                                ? "bg-foreground text-background border-foreground"
                                : "border-border hover:bg-muted"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="w-9 h-9 rounded-xl cursor-pointer border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
      <UserNav />
    </div>
  );
}