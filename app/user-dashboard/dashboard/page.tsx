"use client";

import React, { useState, useEffect } from "react";
import {
  Wallet,
  Gift,
  TrendingUp,
  ArrowDownCircle,
  ChevronRight,
  AlertCircle,
  PiggyBank,
  Clock,
  Bell,
  BarChart3,
  HelpCircle,
  ShieldCheck,
  ShoppingCart,
  ArrowRight,
  Lock,
  Zap,
  Bot,
  Users,
  Building,
} from "lucide-react";

import Link from "next/link";
import { getGreeting } from "@/lib/utils";

import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

export default function UserOverviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalDeposit, setTotalDeposit] = useState(0);

  // Mock data states (Remove backend logic as requested)
  const [userData, setUserData] = useState({
    name: "Investor",
    country: "Global",
  });

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Updated Stats for Secure Rise
  const stats = [
    {
      label: "Account Balance",
      value: "$0.00",
      icon: Wallet,
      link: "/user-dashboard/deposit",
    },
    {
      label: "Welcome Bonus",
      value: "$20.00",
      icon: Gift,
      link: "/user-dashboard/earnings",
    },
    {
      label: "Total Profits",
      value: "$0.00",
      icon: TrendingUp,
      link: "/user-dashboard/earnings",
    },
    {
      label: "Total Deposits",
      value: "$0.00",
      icon: ArrowDownCircle,
      link: "/user-dashboard/transactions",
    },
  ];

  // 2. Dummy Data Array
  const unlockables = [
    {
      id: 1,
      title: "$20 Welcome Bonus",
      minDeposit: 0,
      reward: "After Registration - Unlock Now",
      icon: <Gift className="w-5 h-5 text-green-500" />,
      image:
        "https://i.postimg.cc/1XLMdWCC/1.jpg",
    },
    {
      id: 2,
      title: "Growth Multiplier",
      minDeposit: 200,
      reward: "2x ROI for 3 days + Fast Payouts",
      icon: <TrendingUp className="w-5 h-5 text-green-500" />,
      image:
        "https://i.postimg.cc/9MLnLYjW/2.jpg",
    },
    {
      id: 3,
      title: "Pro Boost Package",
      minDeposit: 500,
      reward: "2x ROI for 4 days + Advanced Plans",
      icon: <ShieldCheck className="w-5 h-5 text-blue-500" />,
      image:
        "https://i.postimg.cc/YSfVWwnH/3.jpg",
    },
    {
      id: 4,
      title: "Elite Trading Access",
      minDeposit: 1000,
      reward: "2.5x ROI for 5 days + AI Bot",
      icon: <Bot className="w-5 h-5 text-purple-500" />,
      image:
        "https://i.postimg.cc/ZKC1D2Rx/4.jpg",
    },
    {
      id: 5,
      title: "Institutional Edge",
      minDeposit: 5000,
      reward: "3x ROI for 7 days + Copy Trading",
      icon: <Users className="w-5 h-5 text-orange-500" />,
      image:
      "https://i.postimg.cc/9Q9sc9yF/6.jpg",
    },
    {
      id: 6,
      title: "Corporate Privileges",
      minDeposit: 10000,
      reward: "3x ROI for 10 days + Funded Account",
      icon: <Building className="w-5 h-5 text-cyan-500" />,
      image:
      "https://i.postimg.cc/ZnDX5Ff3/5.jpg",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            {/*Welcome & Investment Snapshot */}
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
                className="bg-primary text-primary-foreground px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl w-full md:w-auto block text-center"
              >
                Start Investing
              </Link>
            </section>

            {/*Quick Stats Summary */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <Link
                  key={i}
                  href={stat.link}
                  className="bg-card border border-border p-5 rounded-2xl group hover:border-primary transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {loading ? (
                    <div className="h-8 w-16 bg-muted rounded animate-pulse mb-1"></div>
                  ) : (
                    <p className="text-xl sm:text-2xl md:text-3xl font-black italic tracking-tighter mb-1">
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
                {/*Active Investment Plans (Alert Style) */}
                <section className="bg-card border border-border rounded-3xl p-6">
                  <h2 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Capital
                    Protection
                  </h2>

                  <div className="space-y-4">
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
                        href="/user-dashboard/trades"
                        className="block w-full text-center py-3 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/10"
                      >
                        Trade Now
                      </Link>
                    </div>
                  </div>
                </section>

                {/*Recent Transactions Section - NOW STRETCHED TO FILL SPACE */}
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
                  <div className="bg-card border border-border rounded-3xl overflow-hidden divide-y divide-border flex-1 flex items-center justify-center">
                    <div className="p-12 text-center">
                      <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm font-black uppercase tracking-tighter mb-2">
                        No transactions yet
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase mb-6">
                        Once you deposit or earn, they will appear here
                      </p>
                      <Link
                        href="/user-dashboard/deposit"
                        className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                      >
                        Make First Deposit
                      </Link>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: Wallet & Notifications */}
              <div className="lg:w-1/3 lg:col-span-4 space-y-8 flex flex-col">
                {/*Account Summary Panel */}
                <section className="bg-card border border-border rounded-3xl p-6">
                  <h2 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <PiggyBank className="w-4 h-4 text-primary" /> Account
                    Summary
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium uppercase text-[10px]">
                        Verification
                      </span>
                      <span className="font-black text-[10px] text-yellow-500 uppercase">
                        Pending
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium uppercase text-[10px]">
                        Active Trades
                      </span>
                      <span className="font-black text-[10px]">0</span>
                    </div>
                    <Link
                      href="/user-dashboard/support"
                      className="block w-full text-center py-3 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-colors mt-4"
                    >
                      Contact Support
                    </Link>
                  </div>
                </section>

                {/*Notifications Panel */}
                <section className="bg-card border border-border rounded-3xl p-6">
                  <h2 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" /> Alerts
                  </h2>
                  <div className="space-y-6">
                    <div className="flex gap-3 relative">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-tight">
                          Welcome to Secure Rise
                        </p>
                        <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                          Your $20 registration bonus has been added to your
                          balance.
                        </p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">
                          Just Now
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/*Help & Support Shortcut*/}
                <section className="bg-primary/5 border border-primary/20 rounded-3xl p-6 flex-1">
                  <HelpCircle className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-sm font-black uppercase italic tracking-tighter">
                    Need Assistance?
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase mt-2 leading-relaxed">
                    Our support team is available 24/7 for disputes or
                    questions.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-6">
                    <Link
                      href="#"
                      className="bg-foreground text-background text-center py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:opacity-90"
                    >
                      Open Dispute
                    </Link>
                    <button className="border border-border text-center py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-background">
                      Help Center
                    </button>
                  </div>
                </section>
              </div>
            </div>

            {/* Unlockable Rewards */}
            <section className="pt-10 border-t border-border relative">
              {/* Header Section */}
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                    Rewards
                  </h2>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Current Total Deposit:{" "}
                    <span className="text-primary">
                      ${totalDeposit.toLocaleString()}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => setTotalDeposit(15000)} // Testing button - unlock all
                  className="text-[10px] font-black uppercase tracking-widest cursor-pointer flex items-center gap-1 group bg-secondary px-3 py-1.5 rounded-lg border border-border hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  View Tiers{" "}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Grid of Tiers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {unlockables.map((item) => {
                  const isLocked = totalDeposit < item.minDeposit;

                  return (
                    <div
                      key={item.id}
                      className={`relative overflow-hidden bg-card border rounded-3xl p-4 transition-all duration-500 group
                ${isLocked ? "border-border opacity-70 grayscale" : "border-primary/50 shadow-[0_0_20px_rgba(var(--primary),0.1)] grayscale-0"}
              `}
                    >
                      {/* Image Header */}
                      <div className="aspect-[16/9] rounded-2xl mb-4 overflow-hidden relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          className={`w-full h-full cursor-pointer object-cover transition-transform duration-700 ${!isLocked && "group-hover:scale-110"}`}
                        />
                        {isLocked && (
                          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
                            <div className="bg-background/80 p-3 rounded-full border border-border shadow-xl">
                              <Lock className="w-6 h-6 text-muted-foreground" />
                            </div>
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[9px] font-black px-2 py-1 rounded-full uppercase text-white border border-white/10">
                          Min. Deposit: ${item.minDeposit}
                        </div>
                      </div>

                      {/* Reward Content */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-black uppercase italic leading-none mb-1 flex items-center gap-2">
                            {item.icon}
                            {item.title}
                          </h3>
                          <p
                            className={`text-[11px] font-bold uppercase ${isLocked ? "text-muted-foreground" : "text-primary"}`}
                          >
                            {item.reward}
                          </p>
                        </div>

                        <div
                          className={`p-3 rounded-lg border transition-all ${isLocked ? "bg-muted border-border text-muted-foreground" : "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 cursor-pointer hover:scale-110"}`}
                        >
                          {isLocked ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <Zap className="w-4 h-4 fill-current" />
                          )}
                        </div>
                      </div>

                      {/* Progress Indicator */}
                      <div className="mt-4 pt-3 border-t border-border/50">
                        <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full transition-all duration-1000"
                            style={{
                              width: `${item.minDeposit === 0 ? 100 : Math.min((totalDeposit / item.minDeposit) * 100, 100)}%`,
                            }}
                          />
                        </div>
                        <p className="text-[8px] font-black uppercase text-muted-foreground mt-1 text-right">
                          {item.minDeposit === 0 ? "100% Unlocked" : isLocked ? `${Math.floor((totalDeposit / item.minDeposit) * 100)}% to Unlock` : "100% Unlocked"}
                        </p>
                      </div>
                    </div>
                  );
                })}
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
