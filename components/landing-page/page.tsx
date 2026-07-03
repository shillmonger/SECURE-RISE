"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Wallet,
  Gift,
  TrendingUp,
  ArrowDownCircle,
  ChevronRight,
  ChevronLeft,
  ArrowRightLeft,
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
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { getGreeting } from "@/lib/utils";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";
import RecentActivity from "@/components/user-dashboard/RecentActivity";
import PortfolioValue from "@/components/user-dashboard/PortfolioValue";
import LiveMarkets from "@/components/user-dashboard/LiveMarkets";

// Helper function to format numbers with K, M, B notation
const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
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
  const [giftCards, setGiftCards] = useState<any[]>([]);
  const [xpRedemptions, setXpRedemptions] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
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

        // Fetch gift cards
        const giftCardsResponse = await fetch(`/api/user-dashboard/gift-card?userId=${userResult.user.id}`);
        const giftCardsResult = await giftCardsResponse.json();

        if (giftCardsResult.success) {
          setGiftCards(giftCardsResult.giftCards);
        }

        // Fetch XP redemptions
        const redemptionsResponse = await fetch("/api/user-dashboard/redeem-xp/history");
        const redemptionsResult = await redemptionsResponse.json();

        if (redemptionsResult.success) {
          setXpRedemptions(redemptionsResult.redemptions);
        }


        // Fetch predictions
        const predictionsResponse = await fetch("/api/user-dashboard/predictions/history");
        const predictionsResult = await predictionsResponse.json();

        if (predictionsResult.success && predictionsResult.predictions) {
          setPredictions(predictionsResult.predictions);
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

  // Calculate prediction stats
  const totalPredictions = predictions.length;
  const wonPredictions = predictions.filter((p) => p.status === "won").length;
  const winRate = totalPredictions > 0 ? ((wonPredictions / totalPredictions) * 100).toFixed(1) : "0";
  const totalXPEarned = predictions.reduce((sum, p) => sum + (p.xpEarned || 0), 0);
  const highConfidencePredictions = predictions.filter((p) => p.confidence === "High").length;


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
    {
      label: "Predictions",
      value: totalPredictions.toString(),
      icon: Bot,
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
      hoverBg: "group-hover:bg-cyan-500/10",
      hoverColor: "group-hover:text-cyan-500",
      link: "/user-dashboard/predict-market",
    },
    {
      label: "Win Rate",
      value: `${winRate}%`,
      icon: TrendingUp,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      hoverBg: "group-hover:bg-emerald-500/10",
      hoverColor: "group-hover:text-emerald-500",
      link: "/user-dashboard/predict-market",
    },
    {
      label: "XP Earned",
      value: formatNumber(totalXPEarned),
      icon: Zap,
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-500",
      hoverBg: "group-hover:bg-yellow-500/10",
      hoverColor: "group-hover:text-yellow-500",
      link: "/user-dashboard/predict-market",
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
    volume: string;
    marketStatus: string;
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
      volume: "Very High",
      marketStatus: "24/7",
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
      volume: "High",
      marketStatus: "Open",
    },
    {
      symbol: "ETH/USD",
      name: "Ethereum",
      price: 3456.78,
      change: -45.22,
      changePercent: -1.29,
      type: "crypto",
      coinId: "ethereum",
      volume: "High",
      marketStatus: "24/7",
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
      volume: "High",
      marketStatus: "Open",
    },
    {
      symbol: "BNB/USD",
      name: "Binance Coin",
      price: 578.92,
      change: 12.45,
      changePercent: 2.2,
      type: "crypto",
      coinId: "binancecoin",
      volume: "High",
      marketStatus: "24/7",
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
      volume: "High",
      marketStatus: "Open",
    },
    {
      symbol: "SOL/USD",
      name: "Solana",
      price: 178.92,
      change: 8.45,
      changePercent: 4.96,
      type: "crypto",
      coinId: "solana",
      volume: "High",
      marketStatus: "24/7",
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
      volume: "High",
      marketStatus: "Open",
    },
    {
      symbol: "ADA/USD",
      name: "Cardano",
      price: 0.623,
      change: 0.012,
      changePercent: 1.96,
      type: "crypto",
      coinId: "cardano",
      volume: "Medium",
      marketStatus: "24/7",
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
      volume: "Medium",
      marketStatus: "Open",
    },
    {
      symbol: "XRP/USD",
      name: "Ripple",
      price: 0.5234,
      change: -0.0089,
      changePercent: -1.67,
      type: "crypto",
      coinId: "ripple",
      volume: "High",
      marketStatus: "24/7",
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
      volume: "Medium",
      marketStatus: "Open",
    },
    {
      symbol: "DOGE/USD",
      name: "Dogecoin",
      price: 0.1567,
      change: 0.0034,
      changePercent: 2.22,
      type: "crypto",
      coinId: "dogecoin",
      volume: "High",
      marketStatus: "24/7",
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
      volume: "Low",
      marketStatus: "Open",
    },
    {
      symbol: "DOT/USD",
      name: "Polkadot",
      price: 7.892,
      change: -0.156,
      changePercent: -1.94,
      type: "crypto",
      coinId: "polkadot",
      volume: "Medium",
      marketStatus: "24/7",
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
      volume: "Medium",
      marketStatus: "Open",
    },
    {
      symbol: "TRXUSDT",
      name: "TRON",
      price: 0.12,
      change: 0.002,
      changePercent: 1.69,
      type: "crypto",
      coinId: "tron",
      volume: "Medium",
      marketStatus: "24/7",
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
      volume: "Medium",
      marketStatus: "Open",
    },
    {
      symbol: "AVAX/USD",
      name: "Avalanche",
      price: 38.92,
      change: 1.23,
      changePercent: 3.27,
      type: "crypto",
      coinId: "avalanche-2",
      volume: "Medium",
      marketStatus: "24/7",
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
      volume: "Low",
      marketStatus: "Open",
    },
  ];

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const cryptoPairs = allPairs.filter((pair) => pair.type === "crypto");
        const coinIds = cryptoPairs.map((crypto) => crypto.coinId).join(",");

        // Add timeout and better error handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=10&page=1&sparkline=false`,
          {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
            }
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

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
        // Handle AbortError specifically (timeout)
        if (error instanceof Error && error.name === 'AbortError') {
          console.warn("Market data fetch timed out after 5 seconds");
        } else {
          console.error("Error fetching market data:", error);
        }
        // Fallback to default data without images
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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto pb-25 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* Welcome & Investment Snapshot */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-xl md:text-3xl font-black uppercase tracking-tighter  leading-none">
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
                className="hidden md:block bg-primary text-primary-foreground px-4 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl w-full md:w-auto text-center"
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
                  className="bg-card border border-border px-5 py-3 rounded-2xl group hover:border-primary transition-all"
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
                    <p className="text-xl sm:text-2xl md:text-2xl font-black tracking-tighter mb-1">
                      {stat.value}
                    </p>
                  )}
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    {stat.label}
                  </p>
                </Link>
              ))}
            </section>

            <div className="lg:flex lg:items-start grid grid-cols-1 gap-8">
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

                <RecentActivity
                  recentDeposits={recentDeposits}
                  recentWithdrawals={recentWithdrawals}
                  userInvestments={userInvestments}
                  giftHistory={giftHistory}
                  giftCards={giftCards}
                  xpRedemptions={xpRedemptions}
                  activityLoading={activityLoading}
                />
              </div>






              {/* Right Column: Wallet & Notifications */}
              <div className="lg:w-1/3 lg:col-span-4 space-y-8 flex flex-col">
                {/* Account Summary Panel */}
                <section className="bg-card border border-border rounded-3xl p-6">
                  <h2 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-primary" /> Redeem Rewards (XP)
                  </h2>
                  <div className="space-y-4">
                    <p className="text-[10px] text-muted-foreground font-medium uppercase mt-2 leading-relaxed">
                      Convert your earned XP directly into tradeable USDT digital assets sent to your Account balance.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Link
                        href="/user-dashboard/redeem-xp"
                        className="bg-[#229ED9] text-white text-center py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:opacity-90"
                      >
                        Redeem XP
                      </Link>
                      <Link
                        href="/user-dashboard/learn-more"
                        className="border border-border cursor-pointer text-center py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-background"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </section>

                <PortfolioValue
                  userInvestments={userInvestments}
                  giftHistory={giftHistory}
                  recentWithdrawals={recentWithdrawals}
                  xpRedemptions={xpRedemptions}
                  loading={loading}
                />

                {/* Gift Awareness Section */}
                <section className="bg-primary/5 border border-primary/20 rounded-3xl p-6 flex-1 relative overflow-hidden group">
                  {/* Subtle background glow effect */}
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 blur-2xl rounded-full group-hover:bg-primary/20 transition-colors" />
                  <Gift className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-sm font-black uppercase  tracking-tighter">
                    Empower a Fellow Trader
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase mt-2 leading-relaxed">
                    Fuel someone's portfolio. You can now gift capital directly
                    to other members to help them scale.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-6">
                    <Link
                      href="/user-dashboard/gift-member"
                      className="bg-[#229ED9] text-white text-center py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:opacity-90"
                    >
                      Send Gift
                    </Link>
                    <Link
                      href="/user-dashboard/learn-more"
                      className="border border-border cursor-pointer text-center py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-background"
                    >
                      Learn More
                    </Link>
                  </div>
                </section>
              </div>
            </div>

            <LiveMarkets
              marketData={marketData}
              marketLoading={marketLoading}
              formattedTime={formattedTime}
            />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <UserNav />
    </div>
  );
}