"use client";
import React, { useState } from "react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface AlertItem {
  id: string;
  type: "welcome" | "profit" | "withdrawal" | "gift" | "giftcard" | "investment" | "redeem_xp";
  isNew: boolean;
  title: string;
  message: string;
  time: string;
  timestamp?: Date;
}

interface AlertsProps {
  userInvestments: any[];
  giftHistory: any[];
  giftCards: any[];
  recentWithdrawals: any[];
  xpRedemptions: any[];
  alertsLoading: boolean;
}

export default function Alerts({
  userInvestments,
  giftHistory,
  giftCards,
  recentWithdrawals,
  xpRedemptions,
  alertsLoading,
}: AlertsProps) {
  const [alertsPage, setAlertsPage] = useState(1);
  const alertsPerPage = 3;

  // Combine all alerts
  const allAlerts: AlertItem[] = [];

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
    if (investment.profitHistory && investment.profitHistory.length > 0) {
      investment.profitHistory.forEach((profit: any, index: number) => {
        allAlerts.push({
          id: `${investment._id}-profit-${index}`,
          type: "profit",
          isNew: false,
          title: "Daily Profit Added",
          message: `$${profit.amount.toFixed(2)} added from ${investment.planName} plan (${profit.rate}% ROI)`,
          time: new Date(profit.timestamp).toLocaleDateString(),
          timestamp: new Date(profit.timestamp),
        });
      });
    }
  });

  // Show investment active message if no profits yet
  if (
    userInvestments.length > 0 &&
    userInvestments.every(
      (inv) => !inv.profitHistory || inv.profitHistory.length === 0,
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

  // Add gift card alerts
  giftCards.forEach((giftCard, index) => {
    allAlerts.push({
      id: `giftcard-${giftCard._id}`,
      type: "giftcard",
      isNew: false,
      title: `Gift Card ${giftCard.status === "approved" ? "Approved" : giftCard.status === "rejected" ? "Rejected" : "Pending"}`,
      message: `${giftCard.cardType} gift card for $${giftCard.amount.toFixed(2)} ${giftCard.currency} has been ${giftCard.status === "approved" ? "approved" : giftCard.status === "rejected" ? "rejected" : "submitted for review"}${giftCard.status === "rejected" && giftCard.rejectionReason ? `: ${giftCard.rejectionReason}` : ""}`,
      time: new Date(giftCard.createdAt).toLocaleDateString(),
      timestamp: new Date(giftCard.createdAt),
    });
  });

  // Add XP redemption alerts
  xpRedemptions.forEach((redemption, index) => {
    allAlerts.push({
      id: `redemption-${redemption._id}`,
      type: "redeem_xp",
      isNew: false,
      title: "XP Redemption Successful",
      message: `Successfully redeemed ${redemption.xpAmount.toLocaleString()} ${redemption.xpType === 'daily' ? 'Daily Streak' : 'Achievement'} XP for $${redemption.usdtAmount.toFixed(2)}`,
      time: new Date(redemption.createdAt).toLocaleDateString(),
      timestamp: new Date(redemption.createdAt),
    });
  });

  // Sort by date (newest first)
const sortedAlerts = allAlerts.sort((a, b) => {
  if (a.timestamp && b.timestamp) {
    return b.timestamp.getTime() - a.timestamp.getTime();
  }
  return 0;
});

  // Pagination logic
  const totalAlertPages = Math.ceil(sortedAlerts.length / alertsPerPage);
  const startIndex = (alertsPage - 1) * alertsPerPage;
  const endIndex = startIndex + alertsPerPage;
  const paginatedAlerts = sortedAlerts.slice(startIndex, endIndex);

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-end">
        <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          Alerts
        </h2>
        <Link
          href="/user-dashboard/notifications"
          className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden">
        {alertsLoading ? (
          // Loading skeleton
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
        ) : paginatedAlerts.length === 0 ? (
          // Empty state
          <div className="p-8 text-center">
            <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium">
              No alerts yet
            </p>
          </div>
        ) : (
          // Data
          <>
            <div className="divide-y divide-border">
              {paginatedAlerts.map((alert) => (
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
              ))}
            </div>

            {/* Pagination Controls */}
            {totalAlertPages > 1 && (
              <div className="flex items-center justify-between p-3 border-t border-border bg-muted/30">
                <button
                  onClick={() => setAlertsPage(Math.max(1, alertsPage - 1))}
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
                  onClick={() => setAlertsPage(Math.min(totalAlertPages, alertsPage + 1))}
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
        )}
      </div>
    </section>
  );
}
