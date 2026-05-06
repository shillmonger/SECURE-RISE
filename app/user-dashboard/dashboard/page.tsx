"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Wallet,
  Gift,
  TrendingUp,
  ArrowDownCircle,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  PiggyBank,
  Clock,
  Bell,
  BarChart3,
  HelpCircle,
  ShieldCheck,
  ShoppingCart,
  ArrowRight,
  ArrowUpRight,
  Lock,
  Zap,
  Bot,
  Users,
  Building,
  Activity,
  TrendingDown,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { getGreeting } from "@/lib/utils";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

// Helper function to format numbers with K notation
const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};

export default function UserOverviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalDeposit, setTotalDeposit] = useState(0);

  const [userData, setUserData] = useState({
    name: "Investor",
    country: "Global",
  });

  const [financialData, setFinancialData] = useState({
    accountBalance: 0,
    welcomeBonus: 0,
    totalProfits: 0,
    totalWithdrawal: 0,
    totalDeposit: 0,
  });

  const [recentDeposits, setRecentDeposits] = useState<any[]>([]);
  const [recentWithdrawals, setRecentWithdrawals] = useState<any[]>([]);
  const [activeInvestments, setActiveInvestments] = useState(0);
  const [userInvestments, setUserInvestments] = useState<any[]>([]);
  const [giftHistory, setGiftHistory] = useState<any[]>([]);
  const [activityPage, setActivityPage] = useState(1);
  const itemsPerPage = 6;
  const [alertsPage, setAlertsPage] = useState(1);
  const alertsPerPage = 3;
  const [activityLoading, setActivityLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch("/api/user/info");
        const userResult = await userResponse.json();

        if (userResult.success) {
          setUserData({
            name: userResult.user.username || userResult.user.fullName,
            country: userResult.user.country || "Global",
          });
        }

        const financialResponse = await fetch(
          "/api/user-dashboard/financial-data",
        );
        const financialResult = await financialResponse.json();

        if (financialResult.success) {
          setFinancialData({
            accountBalance: financialResult.financialData.accountBalance,
            welcomeBonus: financialResult.financialData.welcomeBonus,
            totalProfits: financialResult.financialData.totalProfits,
            totalWithdrawal: financialResult.financialData.totalWithdrawal,
            totalDeposit: financialResult.financialData.totalDeposit,
          });
        }

        const depositsResponse = await fetch(
          "/api/user-dashboard/deposit?userId=" + userResult.user.id,
        );
        const depositsResult = await depositsResponse.json();

        if (depositsResult.success) {
          setRecentDeposits(depositsResult.deposits.slice(0, 5));
        }

        const investmentsResponse = await fetch("/api/investments");
        const investmentsResult = await investmentsResponse.json();

        console.log("Investments API response:", investmentsResult);

        const investments = investmentsResult.investments || [];

        // Fetch withdrawals
        const withdrawalsResponse = await fetch("/api/withdraw");
        const withdrawalsResult = await withdrawalsResponse.json();

        console.log("Withdrawals API response:", withdrawalsResult);

        if (withdrawalsResult.withdrawals) {
          setRecentWithdrawals(withdrawalsResult.withdrawals.slice(0, 5));
        }

        // Fetch gift history
        const giftsResponse = await fetch("/api/user-dashboard/gift/history");
        const giftsResult = await giftsResponse.json();

        if (giftsResult.success) {
          setGiftHistory(giftsResult.gifts);
        }

        if (Array.isArray(investments)) {
          const activeCount = investments.filter(
            (inv) => inv.status === "active",
          ).length;
          setActiveInvestments(activeCount);
          setUserInvestments(investments);
          console.log("Active investments count:", activeCount);
          console.log("All investments:", investments);
        } else {
          console.log("Investments API returned non-array:", investmentsResult);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
        setActivityLoading(false);
        setAlertsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const stats = [
    {
      label: "Acc Balance",
      value: `$${formatNumber(financialData.accountBalance)}`,
      icon: Wallet,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      hoverBg: "group-hover:bg-blue-500/10",
      hoverColor: "group-hover:text-blue-500",
      link: "#",
    },
    {
      label: "Total Profits",
      value: `$${formatNumber(financialData.totalProfits)}`,
      icon: TrendingUp,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
      hoverBg: "group-hover:bg-green-500/10",
      hoverColor: "group-hover:text-green-500",
      link: "#",
    },
    {
      label: "Total Deposits",
      value: `$${formatNumber(financialData.totalDeposit)}`,
      icon: ArrowDownCircle,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
      hoverBg: "group-hover:bg-orange-500/10",
      hoverColor: "group-hover:text-orange-500",
      link: "#",
    },
    {
      label: "My Withdrawals",
      value: `$${formatNumber(financialData.totalWithdrawal)}`,
      icon: ArrowUpRight,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
      hoverBg: "group-hover:bg-purple-500/10",
      hoverColor: "group-hover:text-purple-500",
      link: "#",
    },
  ];

  interface MarketData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    type: "forex" | "crypto";
    image?: string;
    coinId?: string;
    baseFlag?: string;
    quoteFlag?: string;
  }

  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [marketLoading, setMarketLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");

  const allPairs: MarketData[] = [
    {
      symbol: "BTC/USD",
      name: "Bitcoin",
      price: 67432.5,
      change: 1234.5,
      changePercent: 1.87,
      type: "crypto",
      coinId: "bitcoin",
    },
    {
      symbol: "XAUUSD",
      name: "Gold vs US Dollar",
      price: 2345.67,
      change: 12.34,
      changePercent: 0.53,
      type: "forex",
      baseFlag: "us",
      quoteFlag: "us",
    },
    {
      symbol: "ETH/USD",
      name: "Ethereum",
      price: 3456.78,
      change: -45.22,
      changePercent: -1.29,
      type: "crypto",
      coinId: "ethereum",
    },
    {
      symbol: "EURUSD",
      name: "Euro vs US Dollar",
      price: 1.0845,
      change: 0.0023,
      changePercent: 0.21,
      type: "forex",
      baseFlag: "eu",
      quoteFlag: "us",
    },
    {
      symbol: "BNB/USD",
      name: "Binance Coin",
      price: 578.92,
      change: 12.45,
      changePercent: 2.2,
      type: "crypto",
      coinId: "binancecoin",
    },
    {
      symbol: "GBPUSD",
      name: "British Pound vs US Dollar",
      price: 1.2723,
      change: -0.0089,
      changePercent: -0.7,
      type: "forex",
      baseFlag: "gb",
      quoteFlag: "us",
    },
    {
      symbol: "SOL/USD",
      name: "Solana",
      price: 178.92,
      change: 8.45,
      changePercent: 4.96,
      type: "crypto",
      coinId: "solana",
    },
    {
      symbol: "USDJPY",
      name: "US Dollar vs Japanese Yen",
      price: 149.87,
      change: 0.45,
      changePercent: 0.3,
      type: "forex",
      baseFlag: "us",
      quoteFlag: "jp",
    },
    {
      symbol: "ADA/USD",
      name: "Cardano",
      price: 0.623,
      change: 0.012,
      changePercent: 1.96,
      type: "crypto",
      coinId: "cardano",
    },
    {
      symbol: "AUDUSD",
      name: "Australian Dollar vs US Dollar",
      price: 0.6543,
      change: -0.0034,
      changePercent: -0.52,
      type: "forex",
      baseFlag: "au",
      quoteFlag: "us",
    },
    {
      symbol: "XRP/USD",
      name: "Ripple",
      price: 0.5234,
      change: -0.0089,
      changePercent: -1.67,
      type: "crypto",
      coinId: "ripple",
    },
    {
      symbol: "USDCAD",
      name: "US Dollar vs Canadian Dollar",
      price: 1.3654,
      change: 0.0067,
      changePercent: 0.49,
      type: "forex",
      baseFlag: "us",
      quoteFlag: "ca",
    },
    {
      symbol: "DOGE/USD",
      name: "Dogecoin",
      price: 0.1567,
      change: 0.0034,
      changePercent: 2.22,
      type: "crypto",
      coinId: "dogecoin",
    },
    {
      symbol: "NZDUSD",
      name: "New Zealand Dollar vs US Dollar",
      price: 0.6123,
      change: 0.0012,
      changePercent: 0.2,
      type: "forex",
      baseFlag: "nz",
      quoteFlag: "us",
    },
    {
      symbol: "DOT/USD",
      name: "Polkadot",
      price: 7.892,
      change: -0.156,
      changePercent: -1.94,
      type: "crypto",
      coinId: "polkadot",
    },
    {
      symbol: "USDCHF",
      name: "US Dollar vs Swiss Franc",
      price: 0.8976,
      change: -0.0023,
      changePercent: -0.26,
      type: "forex",
      baseFlag: "us",
      quoteFlag: "ch",
    },
    {
      symbol: "TRXUSDT",
      name: "TRON",
      price: 0.12,
      change: 0.002,
      changePercent: 1.69,
      type: "crypto",
      coinId: "tron",
    },
    {
      symbol: "EURGBP",
      name: "Euro vs British Pound",
      price: 0.8523,
      change: 0.0015,
      changePercent: 0.18,
      type: "forex",
      baseFlag: "eu",
      quoteFlag: "gb",
    },
    {
      symbol: "AVAX/USD",
      name: "Avalanche",
      price: 38.92,
      change: 1.23,
      changePercent: 3.27,
      type: "crypto",
      coinId: "avalanche-2",
    },
    {
      symbol: "USDHKD",
      name: "US Dollar vs Hong Kong Dollar",
      price: 7.8234,
      change: -0.0012,
      changePercent: -0.02,
      type: "forex",
      baseFlag: "us",
      quoteFlag: "hk",
    },
  ];

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const cryptoPairs = allPairs.filter((pair) => pair.type === "crypto");
        const coinIds = cryptoPairs.map((crypto) => crypto.coinId).join(",");
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=10&page=1&sparkline=false`,
        );
        const data = await response.json();

        const cryptoImageMap = new Map();
        cryptoPairs.forEach((crypto) => {
          const coinGeckoData = data.find(
            (item: any) => item.id === crypto.coinId,
          );
          cryptoImageMap.set(crypto.coinId, coinGeckoData?.image || "");
        });

        const updatedData = allPairs.map((pair) => {
          if (pair.type === "crypto" && pair.coinId) {
            return {
              ...pair,
              image: cryptoImageMap.get(pair.coinId) || "",
            };
          }
          return pair;
        });

        setMarketData(updatedData);
        setMarketLoading(false);
      } catch (error) {
        console.error("Error fetching market data:", error);
        setMarketData(allPairs);
        setMarketLoading(false);
      }
    };

    fetchMarketData();

    const updateTime = () => {
      const now = new Date();
      setFormattedTime(now.toLocaleTimeString());
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    const priceInterval = setInterval(() => {
      setMarketData((prevData) =>
        prevData.map((item) => ({
          ...item,
          price: item.price + (Math.random() - 0.5) * item.price * 0.001,
          change: (Math.random() - 0.5) * item.price * 0.002,
          changePercent: (Math.random() - 0.5) * 2,
        })),
      );
      setLastUpdate(new Date().toISOString());
    }, 2000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(priceInterval);
    };
  }, []);

  const formatPrice = (price: number, type: "forex" | "crypto") => {
    if (type === "crypto") {
      return price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return price.toFixed(4);
  };

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    return (
      <div
        className={`flex items-center gap-1 whitespace-nowrap ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        {isPositive ? (
          <TrendingUp className="w-3 h-3 flex-shrink-0" />
        ) : (
          <TrendingDown className="w-3 h-3 flex-shrink-0" />
        )}
        <span className="font-medium text-xs">
          {isPositive ? "+" : ""}
          {changePercent.toFixed(2)}%
        </span>
      </div>
    );
  };

  const MiniSparkline = ({ isPositive }: { isPositive: boolean }) => {
    const generateSparklineData = () => {
      const points = 8;
      const data = [];
      let baseValue = 50;
      for (let i = 0; i < points; i++) {
        const volatility = Math.random() * 20 - 10;
        const trend = isPositive ? i * 2 : -i * 2;
        baseValue += volatility + trend * 0.5;
        data.push(Math.max(10, Math.min(90, baseValue)));
      }
      return data;
    };

    const sparklineData = generateSparklineData();
    const maxData = Math.max(...sparklineData);
    const minData = Math.min(...sparklineData);
    const range = maxData - minData || 1;

    const pathData = sparklineData
      .map((value, index) => {
        const x = (index / (sparklineData.length - 1)) * 100;
        const y = ((maxData - value) / range) * 80 + 10;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    return (
      <div className="relative w-12 h-6">
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          <path
            d={pathData}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
          <circle
            cx="100"
            cy={
              ((maxData - sparklineData[sparklineData.length - 1]) / range) *
                80 +
              10
            }
            r="3"
            fill="currentColor"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Welcome & Investment Snapshot */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic leading-none">
                  {loading ? (
                    <div className="h-10 w-64 bg-muted rounded animate-pulse"></div>
                  ) : (
                    getGreeting(userData?.name || "User")
                  )}
                </h1>
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <ShieldCheck className="w-3 h-3 text-primary" /> Secure
                    Rise: Your account is currently protected
                  </span>
                </div>
              </div>
              <Link
                href="/user-dashboard/invest"
                className="hidden md:block bg-primary text-primary-foreground px-4 py-4 rounded-lg text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl w-full md:w-auto text-center"
              >
                Start Investing
              </Link>
            </section>

            {/* Quick Stats Summary */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <Link
                  key={i}
                  href={stat.link}
                  className="bg-card border border-border p-5 rounded-2xl group hover:border-primary transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div
                      className={`p-2 ${stat.iconBg} rounded-lg ${stat.hoverBg} ${stat.hoverColor} transition-colors`}
                    >
                      <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {loading ? (
                    <div className="h-8 w-16 bg-muted rounded animate-pulse mb-1"></div>
                  ) : (
                    <p className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter mb-1">
                      {stat.value}
                    </p>
                  )}
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    {stat.label}
                  </p>
                </Link>
              ))}
            </section>

            <div className="lg:flex lg:items-stretch grid grid-cols-1 gap-8">
              {/* Left Column: Active Plans & History */}
              <div className="lg:flex-1 lg:w-2/3 flex flex-col space-y-10">
                {/* Active Investment Plans (Alert Style) */}
                <section className="relative group bg-card border border-border rounded-3xl p-6 overflow-hidden">
                  {/* Glow Effect */}
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 blur-2xl rounded-full group-hover:bg-primary/20 transition-colors" />

                  <h2 className="relative z-10 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Capital
                    Protection
                  </h2>

                  <div className="relative z-10 space-y-4">
                    <p className="text-[11px] leading-relaxed text-muted-foreground font-medium">
                      We stand by our strategies. If a trade results in a loss
                      of capital,
                      <span className="text-foreground font-bold">
                        {" "}
                        SECURE RISE covers it 100%
                      </span>
                      . We refund your full investment plus an additional
                      <span className="text-primary font-bold">
                        {" "}
                        20% compensation
                      </span>
                      —withdrawable immediately.
                    </p>

                    <div className="pt-2">
                      <Link
                        href="/user-dashboard/invest"
                        className="block w-full text-center py-3 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/10"
                      >
                        Trade Now
                      </Link>
                    </div>
                  </div>
                </section>

                {/* Recent Transactions Section */}
                <section className="space-y-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-end">
                    <h2 className="text-sm font-black uppercase tracking-widest">
                      Recent Activity
                    </h2>
                    <Link
                      href="/user-dashboard/transactions"
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                    >
                      Full Ledger
                    </Link>
                  </div>

                  <div className="bg-card border border-border rounded-3xl overflow-hidden flex-1">
                    {activityLoading ? (
                      // Loading skeleton for Recent Activity
                      <div className="p-4 space-y-4">
                        {[...Array(6)].map((_, index) => (
                          <div key={index} className="animate-pulse">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-muted rounded-lg" />
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-muted rounded w-24" />
                                <div className="h-3 bg-muted rounded w-32" />
                                <div className="h-3 bg-muted rounded w-40" />
                              </div>
                              <div className="space-y-2">
                                <div className="h-4 bg-muted rounded w-16" />
                                <div className="h-6 bg-muted rounded w-20" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      (() => {
                        // Combine deposits and investment activities
                        const activities: any[] = [];

                        // Add deposits
                        recentDeposits.forEach((deposit) => {
                          activities.push({
                            type: "deposit",
                            data: deposit,
                            date: new Date(deposit.createdAt),
                            icon: ArrowDownCircle,
                            iconBg: "bg-green-500/10",
                            iconColor: "text-green-500",
                            title: "Deposit",
                            subtitle: deposit.paymentMethod,
                            amount: `+$${deposit.amount.toFixed(2)}`,
                            amountColor: "text-green-500",
                            status: deposit.status,
                          });
                        });

                        // Add withdrawals
                        recentWithdrawals.forEach((withdrawal) => {
                          activities.push({
                            type: "withdrawal",
                            data: withdrawal,
                            date: new Date(withdrawal.date),
                            icon: TrendingDown,
                            iconBg: "bg-red-500/10",
                            iconColor: "text-red-500",
                            title: "Withdrawal",
                            subtitle: `${withdrawal.method || "Unknown"} - ${withdrawal.id}`,
                            amount: `-$${withdrawal.amount.toFixed(2)}`,
                            amountColor: "text-red-500",
                            status: withdrawal.status,
                          });
                        });

                        // Add investments
                        userInvestments.forEach((investment) => {
                          activities.push({
                            type: "investment",
                            data: investment,
                            date: new Date(investment.startDate),
                            icon: Gift,
                            iconBg: "bg-blue-500/10",
                            iconColor: "text-blue-500",
                            title: "Investment",
                            subtitle: investment.planName,
                            amount: `$${investment.investmentAmount.toFixed(2)}`,
                            amountColor: "text-blue-500",
                            status: investment.status,
                          });
                        });

                        // Add profit history from investments
                        userInvestments.forEach((investment) => {
                          if (
                            investment.profitHistory &&
                            investment.profitHistory.length > 0
                          ) {
                            investment.profitHistory.forEach((profit: any) => {
                              activities.push({
                                type: "profit",
                                data: {
                                  ...profit,
                                  planName: investment.planName,
                                },
                                date: new Date(profit.timestamp),
                                icon: TrendingUp,
                                iconBg: "bg-purple-500/10",
                                iconColor: "text-purple-500",
                                title: "ROI Profit",
                                subtitle: `${investment.planName} - ${profit.rate}%`,
                                amount: `+$${profit.amount.toFixed(2)}`,
                                amountColor: "text-purple-500",
                                status: "completed",
                              });
                            });
                          }
                        });

                        // Add gift history
                        giftHistory.forEach((gift) => {
                          activities.push({
                            type: "gift",
                            data: gift,
                            date: new Date(gift.createdAt),
                            icon: Gift,
                            iconBg: gift.isSender ? "bg-red-500/10" : "bg-green-500/10",
                            iconColor: gift.isSender ? "text-red-500" : "text-green-500",
                            title: gift.title,
                            subtitle: gift.subtitle,
                            amount: gift.amountDisplay,
                            amountColor: gift.amountColor,
                            status: gift.status,
                          });
                        });

                        // Sort by date (most recent first)
                        activities.sort(
                          (a, b) => b.date.getTime() - a.date.getTime(),
                        );

                        const totalPages = Math.ceil(
                          activities.length / itemsPerPage,
                        );
                        const startIndex = (activityPage - 1) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const paginatedActivities = activities.slice(
                          startIndex,
                          endIndex,
                        );
                        const hasMoreActivities =
                          activities.length > itemsPerPage;

                        if (
                          paginatedActivities.length === 0 &&
                          activityPage === 1
                        ) {
                          return (
                            <div className="p-12 text-center">
                              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                              <p className="text-sm font-black uppercase tracking-tighter mb-2">
                                No activity yet
                              </p>
                              <p className="text-[10px] text-muted-foreground uppercase mb-6">
                                Once you deposit or invest, they will appear
                                here
                              </p>
                              <Link
                                href="/user-dashboard/deposit"
                                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                              >
                                Get Started
                              </Link>
                            </div>
                          );
                        }

                        return (
                          <div>
                            <div className="divide-y divide-border">
                              {paginatedActivities.map((activity, index) => (
                                <div
                                  key={index}
                                  className="p-4 hover:bg-muted/30 transition-colors"
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                      <div
                                        className={`p-2 ${activity.iconBg} rounded-lg`}
                                      >
                                        <activity.icon
                                          className={`w-4 h-4 ${activity.iconColor}`}
                                        />
                                      </div>
                                      <div>
                                        <p className="text-sm font-black uppercase tracking-tighter">
                                          {activity.title}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground uppercase">
                                          {activity.subtitle}
                                        </p>
                                        <p className="text-[9px] text-muted-foreground uppercase mt-1">
                                          {activity.date.toLocaleDateString()} •{" "}
                                          {activity.date.toLocaleTimeString()}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p
                                        className={`text-sm font-black ${activity.amountColor}`}
                                      >
                                        {activity.amount}
                                      </p>
                                      {activity.type === "deposit" && (
                                        <span
                                          className={`inline-block px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border ${
                                            activity.status === "approved"
                                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                                              : activity.status === "rejected"
                                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                                : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                          }`}
                                        >
                                          {activity.status}
                                        </span>
                                      )}
                                      {activity.type === "investment" && (
                                        <span
                                          className={`inline-block px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border ${
                                            activity.status === "active"
                                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                              : activity.status === "completed"
                                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                                : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                                          }`}
                                        >
                                          {activity.status}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {totalPages > 1 && (
                              <div className="flex items-center justify-between p-3 border-t border-border bg-muted/30">
                                <button
                                  onClick={() =>
                                    setActivityPage(
                                      Math.max(1, activityPage - 1),
                                    )
                                  }
                                  disabled={activityPage === 1}
                                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                    activityPage === 1
                                      ? "text-muted-foreground cursor-not-allowed"
                                      : "text-foreground hover:bg-muted/50"
                                  }`}
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </button>

                                <span className="text-xs font-medium text-muted-foreground">
                                  Page {activityPage} of {totalPages}
                                </span>

                                <button
                                  onClick={() =>
                                    setActivityPage(
                                      Math.min(totalPages, activityPage + 1),
                                    )
                                  }
                                  disabled={activityPage === totalPages}
                                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                    activityPage === totalPages
                                      ? "text-muted-foreground cursor-not-allowed"
                                      : "text-foreground hover:bg-muted/50"
                                  }`}
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })()
                    )}
                  </div>
                </section>
              </div>

              {/* Right Column: Wallet & Notifications */}
              <div className="lg:w-1/3 lg:col-span-4 space-y-8 flex flex-col">
                {/* Account Summary Panel */}
                <section className="bg-card border border-border rounded-3xl p-6">
                  <h2 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <PiggyBank className="w-4 h-4 text-primary" /> Account
                    Summary
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium uppercase text-[10px]">
                        Active Trades
                      </span>
                      <span className="font-black text-[10px]">
                        {activeInvestments}
                      </span>
                    </div>
                    <Link
                      href="/user-dashboard/support"
                      className="block w-full text-center py-3 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-colors mt-4"
                    >
                      Contact Support
                    </Link>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex justify-between items-end">
                    <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                      <Bell className="w-4 h-4 text-primary" />
                      Alerts
                    </h2>
                    <Link
                      href="/user-dashboard/alerts"
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="bg-card border border-border rounded-3xl overflow-hidden">
                    {alertsLoading ? (
                      // Loading skeleton for Alerts
                      <div className="p-4 space-y-4">
                        {[...Array(3)].map((_, index) => (
                          <div key={index} className="animate-pulse">
                            <div className="flex gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-muted mt-2" />
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-muted rounded w-32" />
                                <div className="h-3 bg-muted rounded w-full" />
                                <div className="h-3 bg-muted rounded w-20" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      (() => {
                        // Combine all alerts
                        const allAlerts: any[] = [];

                        // Welcome bonus alert (always first)
                        allAlerts.push({
                          id: "welcome-bonus",
                          type: "welcome",
                          isNew: true,
                          title: "Welcome to Secure Rise",
                          message:
                            "Your $20 registration bonus has been added to your balance.",
                          time: "Just Now",
                        });

                        // Add profit alerts
                        userInvestments.forEach((investment) => {
                          if (
                            investment.profitHistory &&
                            investment.profitHistory.length > 0
                          ) {
                            investment.profitHistory.forEach(
                              (profit: any, index: number) => {
                                allAlerts.push({
                                  id: `${investment._id}-profit-${index}`,
                                  type: "profit",
                                  isNew: false,
                                  title: "Daily Profit Added",
                                  message: `$${profit.amount.toFixed(2)} added from ${investment.planName} plan (${profit.rate}% ROI)`,
                                  time: new Date(
                                    profit.timestamp,
                                  ).toLocaleDateString(),
                                  timestamp: new Date(profit.timestamp),
                                });
                              },
                            );
                          }
                        });

                        // Show investment active message if no profits yet
                        if (
                          userInvestments.length > 0 &&
                          userInvestments.every(
                            (inv) =>
                              !inv.profitHistory ||
                              inv.profitHistory.length === 0,
                          )
                        ) {
                          allAlerts.push({
                            id: "investment-active",
                            type: "investment",
                            isNew: false,
                            title: "Investment Active",
                            message:
                              "Your investments are active. Daily profits will be added here.",
                            time: "Pending",
                          });
                        }

                        // Add withdrawal alerts
                        recentWithdrawals.forEach((withdrawal, index) => {
                          allAlerts.push({
                            id: `withdrawal-${index}`,
                            type: "withdrawal",
                            isNew: false,
                            title: `Withdrawal ${withdrawal.status === "approved" ? "Approved" : withdrawal.status === "rejected" ? "Rejected" : "Pending"}`,
                            message:
                              withdrawal.status === "approved"
                                ? `$${withdrawal.amount.toFixed(2)} has been sent to your ${withdrawal.method || "crypto"} wallet`
                                : withdrawal.status === "rejected"
                                  ? `Your withdrawal request for $${withdrawal.amount.toFixed(2)} was rejected`
                                  : `Your withdrawal request for $${withdrawal.amount.toFixed(2)} is being processed`,
                            time: withdrawal.id,
                          });
                        });

                        // Add gift alerts
                        giftHistory.forEach((gift, index) => {
                          allAlerts.push({
                            id: `gift-${gift._id}`,
                            type: "gift",
                            isNew: false,
                            title: gift.title,
                            message: gift.message,
                            time: new Date(gift.createdAt).toLocaleDateString(),
                            timestamp: new Date(gift.createdAt),
                          });
                        });

                        // Sort by date (newest first) - keep welcome bonus at top
                        const sortedAlerts = [
                          allAlerts[0],
                          ...allAlerts.slice(1).sort((a, b) => {
                            if (a.timestamp && b.timestamp) {
                              return (
                                b.timestamp.getTime() - a.timestamp.getTime()
                              );
                            }
                            return 0;
                          }),
                        ];

                        // Pagination logic
                        const totalAlertPages = Math.ceil(
                          sortedAlerts.length / alertsPerPage,
                        );
                        const startIndex = (alertsPage - 1) * alertsPerPage;
                        const endIndex = startIndex + alertsPerPage;
                        const paginatedAlerts = sortedAlerts.slice(
                          startIndex,
                          endIndex,
                        );

                        return (
                          <>
                            <div className="divide-y divide-border">
                              {paginatedAlerts.length > 0 ? (
                                paginatedAlerts.map((alert) => (
                                  <div
                                    key={alert.id}
                                    className="p-4 hover:bg-muted/30 transition-colors flex gap-3"
                                  >
                                    <div className="flex-shrink-0 mt-1.5">
                                      {alert.isNew ? (
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                      ) : (
                                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-foreground">
                                        {alert.title}
                                      </p>
                                      <p
                                        className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed"
                                        dangerouslySetInnerHTML={{
                                          __html: alert.message.replace(
                                            /(\$\d+\.\d{2})/g,
                                            '<span class="text-green-500 font-semibold">$1</span>',
                                          ),
                                        }}
                                      />
                                      <p className="text-[10px] text-muted-foreground mt-2">
                                        {alert.time}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="p-8 text-center">
                                  <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                                  <p className="text-sm font-medium">
                                    No alerts yet
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Pagination Controls for Alerts */}
                            {totalAlertPages > 1 && (
                              <div className="flex items-center justify-between p-3 border-t border-border bg-muted/30">
                                <button
                                  onClick={() =>
                                    setAlertsPage(Math.max(1, alertsPage - 1))
                                  }
                                  disabled={alertsPage === 1}
                                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                    alertsPage === 1
                                      ? "text-muted-foreground cursor-not-allowed"
                                      : "text-foreground hover:bg-muted/50"
                                  }`}
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </button>

                                <span className="text-xs font-medium text-muted-foreground">
                                  Page {alertsPage} of {totalAlertPages}
                                </span>

                                <button
                                  onClick={() =>
                                    setAlertsPage(
                                      Math.min(totalAlertPages, alertsPage + 1),
                                    )
                                  }
                                  disabled={alertsPage === totalAlertPages}
                                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                    alertsPage === totalAlertPages
                                      ? "text-muted-foreground cursor-not-allowed"
                                      : "text-foreground hover:bg-muted/50"
                                  }`}
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </>
                        );
                      })()
                    )}
                  </div>
                </section>

                {/* Gift Awareness Section */}
                <section className="bg-primary/5 border border-primary/20 rounded-3xl p-6 flex-1 relative overflow-hidden group">
                  {/* Subtle background glow effect */}
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 blur-2xl rounded-full group-hover:bg-primary/20 transition-colors" />
                  <Gift className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-sm font-black uppercase italic tracking-tighter">
                    Empower a Fellow Trader
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase mt-2 leading-relaxed">
                    Fuel someone's portfolio. You can now gift capital directly
                    to other members to help them scale their trading and
                    investment goals.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-6">
                    <Link
                      href="/user-dashboard/gift-member"
                      className="bg-foreground text-background text-center py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:opacity-90"
                    >
                      Send Gift
                    </Link>
                    <button className="border border-border text-center py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-background">
                      Learn More
                    </button>
                  </div>
                </section>
              </div>
            </div>

            {/* Live Markets */}
            <section className="pt-10 border-t border-border relative">
              {/* Header Section */}
              <div className="flex justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                    <Activity className="w-6 h-6 text-primary" />
                    Live Markets
                  </h2>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Real-time Cryptocurrency Prices
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                  <RefreshCw className="w-3 h-3 animate-spin text-primary" />
                  <span className="hidden sm:inline">Last Update:</span>{" "}
                  {formattedTime}
                </div>
              </div>

              {/* Market Data Container */}
              <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <div className="min-w-[600px] w-full">
                    {/* Header Row */}
                    <div className="flex justify-between items-center bg-muted/50 border-b border-border px-6 py-4">
                      <div className="flex-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        Asset
                      </div>
                      <div className="flex-1 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        Price
                      </div>
                      <div className="flex-1 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        24h Change
                      </div>
                      <div className="flex-1 text-center text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        Trend
                      </div>
                      <div className="flex-1 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        Type
                      </div>
                    </div>

                    {/* Data Rows */}
                    <div className="divide-y divide-border/50">
                      {marketLoading
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center px-6 py-4 animate-pulse"
                            >
                              <div className="flex-1 h-4 bg-muted rounded w-24"></div>
                              <div className="flex-1 h-4 bg-muted rounded w-16 ml-auto"></div>
                              <div className="flex-1 h-4 bg-muted rounded w-16 ml-auto"></div>
                              <div className="flex-1 h-4 bg-muted rounded w-12 mx-auto"></div>
                              <div className="flex-1 h-4 bg-muted rounded w-10 ml-auto"></div>
                            </div>
                          ))
                        : marketData.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center px-6 py-4 hover:bg-muted/30 transition-colors flex-nowrap"
                            >
                              {/* 1. Asset */}
                              <div className="flex-1 flex items-center gap-3 min-w-0">
                                <div className="relative flex-shrink-0">
                                  {item.type === "crypto" ? (
                                    item.image ? (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-8 h-8 rounded-full object-cover border border-border"
                                      />
                                    ) : (
                                      <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20">
                                        <span className="text-[10px] font-black text-orange-500">
                                          {item.symbol.slice(0, 2)}
                                        </span>
                                      </div>
                                    )
                                  ) : (
                                    <div className="flex -space-x-2">
                                      {item.baseFlag && (
                                        <img
                                          src={`https://flagcdn.com/${item.baseFlag}.svg`}
                                          alt="Base currency"
                                          className="w-6 h-6 rounded-full object-cover border-2 border-background"
                                          onError={(e) => {
                                            e.currentTarget.style.display =
                                              "none";
                                          }}
                                        />
                                      )}
                                      {item.quoteFlag && (
                                        <img
                                          src={`https://flagcdn.com/${item.quoteFlag}.svg`}
                                          alt="Quote currency"
                                          className="w-6 h-6 rounded-full object-cover border-2 border-background"
                                          onError={(e) => {
                                            e.currentTarget.style.display =
                                              "none";
                                          }}
                                        />
                                      )}
                                      {(!item.baseFlag || !item.quoteFlag) && (
                                        <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                                          <span className="text-[10px] font-black text-blue-500">
                                            {item.symbol.slice(0, 2)}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="truncate">
                                  <div className="font-black text-sm uppercase tracking-tighter leading-none">
                                    {item.symbol}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground font-medium truncate">
                                    {item.name}
                                  </div>
                                </div>
                              </div>

                              {/* 2. Price */}
                              <div className="flex-1 text-right">
                                <div className="font-bold text-sm tracking-tight">
                                  {formatPrice(item.price, item.type)}
                                </div>
                              </div>

                              {/* 3. Change */}
                              <div className="flex-1 text-right">
                                <div className="inline-block">
                                  {formatChange(
                                    item.change,
                                    item.changePercent,
                                  )}
                                </div>
                              </div>

                              {/* 4. Trend */}
                              <div className="flex-1 flex justify-center">
                                <div className="w-16">
                                  <MiniSparkline
                                    isPositive={item.changePercent >= 0}
                                  />
                                </div>
                              </div>

                              {/* 5. Type */}
                              <div className="flex-1 flex justify-end">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border ${
                                    item.type === "crypto"
                                      ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                      : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                  }`}
                                >
                                  {item.type}
                                </span>
                              </div>
                            </div>
                          ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <UserNav />
    </div>
  );
}
