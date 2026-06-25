"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  ArrowUpRight,
  Megaphone,
  Clock,
  Trash2,
  Circle,
  Gift,
  TrendingUp,
  ArrowDownCircle,
  Coins,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

// ─── Types ─────────────────────────────────────────────────────────────────────

type NotificationType =
  | "deposit"
  | "withdrawal"
  | "roi"
  | "investment"
  | "system"
  | "gift"
  | "gift_card"
  | "redeem_xp";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  rawData?: any;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const MESSAGE_PREVIEW_LENGTH = 70;

// ─── Sub-components ────────────────────────────────────────────────────────────

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  const map: Record<NotificationType, { icon: React.ReactNode; bg: string; border: string }> = {
    deposit:     { icon: <ArrowDownCircle className="w-4 h-4" />, bg: "bg-green-500/10",  border: "border-green-500/30"  },
    withdrawal:  { icon: <ArrowUpRight    className="w-4 h-4" />, bg: "bg-red-500/10",    border: "border-red-500/30"    },
    roi:         { icon: <TrendingUp      className="w-4 h-4" />, bg: "bg-purple-500/10", border: "border-purple-500/30" },
    investment:  { icon: <Gift            className="w-4 h-4" />, bg: "bg-blue-500/10",   border: "border-blue-500/30"   },
    gift_card:   { icon: <Gift            className="w-4 h-4" />, bg: "bg-orange-500/10", border: "border-orange-500/30" },
    gift:        { icon: <Gift            className="w-4 h-4" />, bg: "bg-pink-500/10",   border: "border-pink-500/30"   },
    redeem_xp:   { icon: <Coins           className="w-4 h-4" />, bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
    system:      { icon: <Megaphone       className="w-4 h-4" />, bg: "bg-muted",         border: "border-border"        },
  };

  const colorMap: Record<NotificationType, string> = {
    deposit: "text-green-500", withdrawal: "text-red-500", roi: "text-purple-500",
    investment: "text-blue-500", gift_card: "text-orange-500", gift: "text-pink-500",
    redeem_xp: "text-yellow-500", system: "text-muted-foreground",
  };

  const { icon, bg, border } = map[type];
  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${bg} ${border} ${colorMap[type]} flex-shrink-0`}>
      {icon}
    </div>
  );
};

const NotificationCard = ({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = notification.message.length > MESSAGE_PREVIEW_LENGTH;
  const preview = isLong ? notification.message.slice(0, MESSAGE_PREVIEW_LENGTH).trimEnd() + "..." : notification.message;

  const typeBadgeColors: Record<NotificationType, string> = {
    deposit: "bg-green-500/10 text-green-500",
    withdrawal: "bg-red-500/10 text-red-500",
    roi: "bg-purple-500/10 text-purple-500",
    investment: "bg-blue-500/10 text-blue-500",
    gift_card: "bg-orange-500/10 text-orange-500",
    gift: "bg-pink-500/10 text-pink-500",
    redeem_xp: "bg-yellow-500/10 text-yellow-500",
    system: "bg-muted text-muted-foreground",
  };

  return (
    <div
      className={`group relative flex flex-col gap-3 rounded-2xl border p-4 transition-all duration-200 hover:shadow-md hover:border-foreground/20 ${
        !notification.isRead
          ? "bg-card border-border/80"
          : "bg-muted/20 border-border/40"
      }`}
    >
      {/* Unread dot */}
      {!notification.isRead && (
        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary" />
      )}

      {/* Top row: icon + title */}
      <div className="flex items-start gap-3 pr-4">
        <NotificationIcon type={notification.type} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${typeBadgeColors[notification.type]}`}>
              {notification.type.replace("_", " ")}
            </span>
          </div>
          <h4 className="text-sm font-bold leading-tight text-foreground truncate">
            {notification.title}
          </h4>
        </div>
      </div>

      {/* Message */}
      <div className="pl-0">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {expanded ? notification.message : preview}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1.5 flex items-center cursor-pointer gap-1 text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70 transition-opacity"
          >
            {expanded ? (
              <><ChevronUp className="w-3 h-3" /> Show less</>
            ) : (
              <><ChevronDown className="w-3 h-3" /> Read more</>
            )}
          </button>
        )}
      </div>

      {/* Bottom row: time + actions */}
      <div className="flex items-center justify-between pt-1 border-t border-border/40">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="text-[9px] font-black uppercase tracking-widest">{notification.time}</span>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!notification.isRead && (
            <button
              onClick={() => onMarkRead(notification.id)}
              className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" /> Mark read
            </button>
          )}
          <button
            onClick={() => onDelete(notification.id)}
            className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="rounded-2xl border border-border bg-card p-4 animate-pulse space-y-3">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-muted flex-shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="h-3 bg-muted rounded w-1/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
    </div>
    <div className="h-3 bg-muted rounded w-full" />
    <div className="h-3 bg-muted rounded w-3/4" />
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────

const NotificationsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const formatTimeAgo = (date: any): string => {
    try {
      let dateObj: Date;
      if (typeof date === "string") dateObj = new Date(date);
      else if (date && typeof date === "object") {
        if (date.$date) dateObj = new Date(date.$date);
        else if (date instanceof Date) dateObj = date;
        else dateObj = new Date(date);
      } else dateObj = new Date(date);

      if (isNaN(dateObj.getTime())) return "Just now";

      const diffInMs = Date.now() - dateObj.getTime();
      if (diffInMs < 0) return "Just now";

      const mins = Math.floor(diffInMs / 60000);
      const hrs = Math.floor(mins / 60);
      const days = Math.floor(hrs / 24);

      if (days > 0) return `${days}d ago`;
      if (hrs > 0) return `${hrs}h ago`;
      if (mins > 0) return `${mins}m ago`;
      return "Just now";
    } catch {
      return "Just now";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch("/api/user/info");
        const userResult = await userResponse.json();
        if (userResult.success) setUserData(userResult.user);

        const [depositsRes, withdrawalsRes, investmentsRes, giftsRes, giftCardsRes, redemptionsRes] = await Promise.all([
          fetch(`/api/user-dashboard/deposit?userId=${userResult.user.id}`).then(r => r.json()),
          fetch("/api/withdraw").then(r => r.json()),
          fetch("/api/investments").then(r => r.json()),
          fetch("/api/user-dashboard/gift/history").then(r => r.json()),
          fetch(`/api/user-dashboard/gift-card?userId=${userResult.user.id}`).then(r => r.json()),
          fetch("/api/user-dashboard/redeem-xp/history").then(r => r.json()),
        ]);

        const all: Notification[] = [];

        if (depositsRes.success && depositsRes.deposits) {
          depositsRes.deposits.forEach((d: any) => {
            all.push({
              id: `deposit-${d._id}`,
              type: "deposit",
              title: "Deposit Received",
              message: `Your deposit of $${d.amount.toFixed(2)} via ${d.paymentMethod} has been processed and is currently ${d.status}. Funds will be available after verification.`,
              time: formatTimeAgo(new Date(d.createdAt)),
              isRead: d.status === "approved",
              rawData: d,
            });
          });
        }

        if (withdrawalsRes.withdrawals) {
          withdrawalsRes.withdrawals.forEach((w: any) => {
            all.push({
              id: `withdrawal-${w._id}`,
              type: "withdrawal",
              title: `Withdrawal ${w.status.charAt(0).toUpperCase() + w.status.slice(1)}`,
              message: `Your withdrawal of $${w.amount.toFixed(2)} via ${w.crypto?.name || "Unknown"} has been ${w.status}. Funds are being transferred to your wallet.`,
              time: formatTimeAgo(new Date(w.date || Date.now())),
              isRead: w.status === "approved",
              rawData: w,
            });
          });
        }

        if (investmentsRes.investments) {
          investmentsRes.investments.forEach((inv: any) => {
            all.push({
              id: `investment-${inv._id}`,
              type: "investment",
              title: "Investment Started",
              message: `Your investment of $${inv.investmentAmount.toFixed(2)} in the ${inv.planName} plan is now ${inv.status}. Funds are actively generating returns per the plan terms.`,
              time: formatTimeAgo(new Date(inv.startDate)),
              isRead: inv.status === "completed",
              rawData: inv,
            });

            if (inv.profitHistory?.length) {
              inv.profitHistory.forEach((p: any) => {
                all.push({
                  id: `roi-${inv._id}-${p.timestamp}`,
                  type: "roi",
                  title: "ROI Credited",
                  message: `Daily ROI of $${p.amount.toFixed(2)} from the ${inv.planName} plan at ${p.rate}% has been credited to your balance.`,
                  time: formatTimeAgo(new Date(p.timestamp)),
                  isRead: false,
                  rawData: { ...p, inv },
                });
              });
            }
          });
        }

        if (giftCardsRes.success && giftCardsRes.giftCards) {
          giftCardsRes.giftCards.forEach((gc: any) => {
            const statusText = { pending_review: "Pending Review", approved: "Approved", rejected: "Rejected", processing: "Processing" }[gc.status as string] || gc.status;
            all.push({
              id: `gift-card-${gc._id}`,
              type: "gift_card",
              title: `Gift Card ${statusText}`,
              message: `Your ${gc.cardType} gift card worth ${gc.currency} ${gc.amount.toFixed(2)} from ${gc.country} is ${statusText.toLowerCase()}. Details will be sent to your email upon approval.${gc.rejectionReason ? ` Reason: ${gc.rejectionReason}` : ""}`,
              time: formatTimeAgo(new Date(gc.createdAt)),
              isRead: gc.status === "approved" || gc.status === "rejected",
              rawData: gc,
            });
          });
        }

        if (giftsRes.success && giftsRes.gifts) {
          giftsRes.gifts.forEach((g: any) => {
            all.push({
              id: `gift-${g._id}`,
              type: "gift",
              title: g.title || (g.isSender ? "Gift Sent" : "Gift Received"),
              message: g.isSender
                ? `You sent a gift of $${g.amount.toFixed(2)} to ${g.recipientName || g.recipientUsername || "a member"}. The recipient has been notified.`
                : `You received a gift of $${g.amount.toFixed(2)} from ${g.senderName || g.senderUsername || "a member"}. The amount has been added to your balance.`,
              time: formatTimeAgo(new Date(g.createdAt)),
              isRead: false,
              rawData: g,
            });
          });
        }

        if (redemptionsRes.success && redemptionsRes.redemptions) {
          redemptionsRes.redemptions.forEach((r: any) => {
            all.push({
              id: `redemption-${r._id}`,
              type: "redeem_xp",
              title: "XP Redeemed",
              message: `You redeemed ${r.xpAmount.toLocaleString()} ${r.xpType === "daily" ? "Daily Streak" : "Achievement"} XP for $${r.usdtAmount.toFixed(2)} USDT, credited to your account.`,
              time: formatTimeAgo(new Date(r.createdAt)),
              isRead: r.status === "completed",
              rawData: r,
            });
          });
        }

        all.sort((a, b) => {
          const da = new Date(a.rawData?.createdAt || a.rawData?.timestamp || 0).getTime();
          const db = new Date(b.rawData?.createdAt || b.rawData?.timestamp || 0).getTime();
          return db - da;
        });

        setNotifications(all);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const markRead = (id: string) =>
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));

  const deleteNotification = (id: string) =>
    setNotifications(prev => prev.filter(n => n.id !== id));

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

  const deleteAll = () => setNotifications([]);

  const filtered = activeTab === "all" ? notifications : notifications.filter(n => !n.isRead);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Split into two columns for grid layout
  const leftCol = filtered.filter((_, i) => i % 2 === 0);
  const rightCol = filtered.filter((_, i) => i % 2 !== 0);

  const TYPE_LABELS: Record<NotificationType, string> = {
    deposit: "Deposit", withdrawal: "Withdrawal", roi: "ROI", investment: "Investment",
    system: "System", gift: "Gift", gift_card: "Gift Card", redeem_xp: "XP",
  };

  // Summary counts by type
  const typeCounts = notifications.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">
                  Alert Center
                </h1>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1">
                  Live updates from your financial network
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-2 bg-muted/60 hover:bg-muted text-foreground px-4 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mark All Read
                </button>
                <button
                  onClick={deleteAll}
                  className="bg-muted/60 hover:bg-red-500/10 hover:text-red-500 text-muted-foreground p-3 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Summary Strip ── */}
            {!loading && notifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary rounded-full px-3 py-1.5">
                  <Bell className="w-3 h-3" />
                  <span className="text-[9px] font-black uppercase tracking-widest">{unreadCount} Unread</span>
                </div>
                {Object.entries(typeCounts).map(([type, count]) => (
                  <div key={type} className="bg-muted/60 border border-border rounded-full px-3 py-1.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      {TYPE_LABELS[type as NotificationType] || type}: {count}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* ── Tabs ── */}
            <div className="flex items-center border-b border-border">
              {(["all", "unread"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${
                    activeTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "all" ? "All Activity" : (
                    <>Unread <span className="ml-1.5 bg-primary text-background px-1.5 py-0.5 rounded text-[8px]">{unreadCount}</span></>
                  )}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-foreground rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* ── Content ── */}
            {loading ? (
              /* Skeleton — two col on lg */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 border-2 border-dashed border-border rounded-3xl opacity-30">
                <Bell className="w-14 h-14" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">
                  {activeTab === "unread" ? "No unread notifications" : "Nothing here yet"}
                </p>
              </div>
            ) : (
              /* Two-column masonry-style grid */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                {/* Left column */}
                <div className="flex flex-col gap-4">
                  {leftCol.map(n => (
                    <NotificationCard
                      key={n.id}
                      notification={n}
                      onMarkRead={markRead}
                      onDelete={deleteNotification}
                    />
                  ))}
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-4">
                  {rightCol.map(n => (
                    <NotificationCard
                      key={n.id}
                      notification={n}
                      onMarkRead={markRead}
                      onDelete={deleteNotification}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── End of list ── */}
            {!loading && filtered.length > 0 && (
              <div className="flex items-center gap-3 pt-4">
                <div className="flex-1 h-px bg-border" />
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  End of history
                </p>
                <div className="flex-1 h-px bg-border" />
              </div>
            )}
          </div>
        </main>
      </div>

      <UserNav />
    </div>
  );
};

export default NotificationsPage;