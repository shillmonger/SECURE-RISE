"use client";
import React, { useState } from "react";
import {
  ArrowDownCircle,
  TrendingDown,
  Gift,
  TrendingUp,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coins,
} from "lucide-react";
import Link from "next/link";

interface ActivityItem {
  type: "deposit" | "withdrawal" | "investment" | "profit" | "gift" | "giftcard" | "redeem_xp";
  data: any;
  date: Date;
  icon: any;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  amount: string;
  amountColor: string;
  status: string;
}

interface RecentActivityProps {
  recentDeposits: any[];
  recentWithdrawals: any[];
  userInvestments: any[];
  giftHistory: any[];
  giftCards: any[];
  xpRedemptions: any[];
  activityLoading: boolean;
}

export default function RecentActivity({
  recentDeposits,
  recentWithdrawals,
  userInvestments,
  giftHistory,
  giftCards,
  xpRedemptions,
  activityLoading,
}: RecentActivityProps) {
  const [activityPage, setActivityPage] = useState(1);
  const itemsPerPage = 6;

  // Combine all activities
  const activities: ActivityItem[] = [];

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
    if (investment.profitHistory && investment.profitHistory.length > 0) {
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

  // Add gift cards
  giftCards.forEach((giftCard) => {
    activities.push({
      type: "giftcard",
      data: giftCard,
      date: new Date(giftCard.createdAt),
      icon: ShoppingCart,
      iconBg: giftCard.status === "approved" ? "bg-green-500/10" : giftCard.status === "rejected" ? "bg-red-500/10" : "bg-yellow-500/10",
      iconColor: giftCard.status === "approved" ? "text-green-500" : giftCard.status === "rejected" ? "text-red-500" : "text-yellow-500",
      title: "Gift Card Deposit",
      subtitle: `${giftCard.cardType} - ${giftCard.country}`,
      amount: `$${giftCard.amount.toFixed(2)}`,
      amountColor: "text-blue-500",
      status: giftCard.status,
    });
  });

  // Add XP redemptions
  xpRedemptions.forEach((redemption) => {
    activities.push({
      type: "redeem_xp",
      data: redemption,
      date: new Date(redemption.createdAt),
      icon: Coins,
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-500",
      title: "XP Redemption",
      subtitle: `${redemption.xpType === 'daily' ? 'Daily Streak' : 'Achievement'} XP - ${redemption.xpAmount.toLocaleString()} XP`,
      amount: `+$${redemption.usdtAmount.toFixed(2)}`,
      amountColor: "text-green-500",
      status: redemption.status,
    });
  });


  // Sort by date (most recent first)
  activities.sort((a, b) => b.date.getTime() - a.date.getTime());

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (activityPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedActivities = activities.slice(startIndex, endIndex);
  const hasMoreActivities = activities.length > itemsPerPage;

  return (
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
          // Loading skeleton
          <div className="p-4 space-y-4">
            {[...Array(8)].map((_, index) => (
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
        ) : paginatedActivities.length === 0 && activityPage === 1 ? (
          // Empty state
          <div className="p-12 text-center">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm font-black uppercase tracking-tighter mb-2">
              No activity yet
            </p>
            <p className="text-[10px] text-muted-foreground uppercase mb-6">
              Once you deposit or invest, they will appear here
            </p>
            <Link
              href="/user-dashboard/deposit"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
            >
              Get Started
            </Link>
          </div>
        ) : (
          // Data
          <div>
            <div className="divide-y divide-border">
              {paginatedActivities.map((activity, index) => (
                <div
                  key={index}
                  className="p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 ${activity.iconBg} rounded-lg`}>
                        <activity.icon className={`w-4 h-4 ${activity.iconColor}`} />
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
                      <p className={`text-sm font-black ${activity.amountColor}`}>
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
                  onClick={() => setActivityPage(Math.max(1, activityPage - 1))}
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
                  onClick={() => setActivityPage(Math.min(totalPages, activityPage + 1))}
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
        )}
      </div>
    </section>
  );
}
