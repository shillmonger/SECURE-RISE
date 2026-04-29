"use client";

import React, { useState, useEffect } from "react";
import { 
  Bell, 
  CheckCircle2, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Zap, 
  Megaphone, 
  Clock, 
  Trash2,
  MoreHorizontal,
  Circle,
  Gift,
  TrendingUp,
  ArrowDownCircle
} from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";
import Link from "next/link";

// ─── Data & Types ──────────────────────────────────────────────────────────────

type NotificationType = 'deposit' | 'withdrawal' | 'roi' | 'investment' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  rawData?: any;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "roi",
    title: "ROI Credited",
    message: "Your Daily ROI of $145.00 from the 'Platinum Plan' has been added to your balance.",
    time: "2 mins ago",
    isRead: false
  },
  {
    id: "2",
    type: "system",
    title: "System Update",
    message: "Cetadel is upgrading its security protocols. Expect minor latency during the next 2 hours.",
    time: "1 hour ago",
    isRead: false
  },
  {
    id: "3",
    type: "deposit",
    title: "Deposit Confirmed",
    message: "Your deposit of 0.045 BTC has been successfully processed and verified.",
    time: "5 hours ago",
    isRead: true
  },
  {
    id: "4",
    type: "withdrawal",
    title: "Withdrawal Sent",
    message: "Your withdrawal request #WID-882 for $500.00 has been completed.",
    time: "1 day ago",
    isRead: true
  }
];

const NotificationsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
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

        const allNotifications: Notification[] = [];

        // Process deposits as notifications
        if (depositsResult.success && depositsResult.deposits) {
          depositsResult.deposits.forEach((deposit: any) => {
            allNotifications.push({
              id: `deposit-${deposit._id}`,
              type: 'deposit',
              title: 'Deposit Received',
              message: `Your deposit of $${deposit.amount.toFixed(2)} via ${deposit.paymentMethod} has been ${deposit.status}.`,
              time: formatTimeAgo(new Date(deposit.createdAt)),
              isRead: deposit.status === 'approved',
              rawData: deposit
            });
          });
        }

        // Process withdrawals as notifications
        if (withdrawalsResult.withdrawals) {
          withdrawalsResult.withdrawals.forEach((withdrawal: any) => {
            allNotifications.push({
              id: `withdrawal-${withdrawal._id}`,
              type: 'withdrawal',
              title: 'Withdrawal ' + withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1),
              message: `Your withdrawal request of $${withdrawal.amount.toFixed(2)} via ${withdrawal.crypto?.name || 'Unknown'} has been ${withdrawal.status}.`,
              time: formatTimeAgo(new Date(withdrawal.createdAt)),
              isRead: withdrawal.status === 'approved',
              rawData: withdrawal
            });
          });
        }

        // Process investments as notifications
        if (investmentsResult.investments) {
          investmentsResult.investments.forEach((investment: any) => {
            // Investment started notification
            allNotifications.push({
              id: `investment-${investment._id}`,
              type: 'investment',
              title: 'Investment Started',
              message: `Your investment of $${investment.investmentAmount.toFixed(2)} in ${investment.planName} is now ${investment.status}.`,
              time: formatTimeAgo(new Date(investment.startDate)),
              isRead: investment.status === 'completed',
              rawData: investment
            });

            // Add profit history as ROI notifications
            if (investment.profitHistory && investment.profitHistory.length > 0) {
              investment.profitHistory.forEach((profit: any) => {
                allNotifications.push({
                  id: `roi-${investment._id}-${profit.timestamp}`,
                  type: 'roi',
                  title: 'ROI Credited',
                  message: `Your ROI of $${profit.amount.toFixed(2)} from ${investment.planName} at ${profit.rate}% rate has been added to your balance.`,
                  time: formatTimeAgo(new Date(profit.timestamp)),
                  isRead: false, // ROI notifications are always unread initially
                  rawData: { ...profit, investment }
                });
              });
            }
          });
        }

        // Sort by date (most recent first)
        allNotifications.sort((a, b) => {
          const dateA = new Date(a.rawData?.createdAt || a.rawData?.timestamp || Date.now());
          const dateB = new Date(b.rawData?.createdAt || b.rawData?.timestamp || Date.now());
          return dateB.getTime() - dateA.getTime();
        });

        setNotifications(allNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to format time ago
  const formatTimeAgo = (date: any) => {
    try {
      // Handle MongoDB date objects and various date formats
      let dateObj: Date;
      
      if (typeof date === 'string') {
        dateObj = new Date(date);
      } else if (date && typeof date === 'object') {
        // Handle MongoDB date format { "$date": "2026-04-29T05:23:33.263Z" }
        if (date.$date) {
          dateObj = new Date(date.$date);
        } else if (date instanceof Date) {
          dateObj = date;
        } else {
          dateObj = new Date(date);
        }
      } else {
        dateObj = new Date(date);
      }

      // Validate the date
      if (isNaN(dateObj.getTime())) {
        return 'Just now';
      }

      const now = new Date();
      const diffInMs = now.getTime() - dateObj.getTime();
      
      // Handle future dates
      if (diffInMs < 0) {
        return 'Just now';
      }
      
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
      
      if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else if (diffInMinutes > 0) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
      } else {
        return 'Just now';
      }
    } catch (error) {
      console.error('Error formatting time ago:', error);
      return 'Just now';
    }
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'deposit': return <ArrowDownCircle className="w-4 h-4 text-green-500" />;
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'roi': return <TrendingUp className="w-4 h-4 text-purple-500" />;
      case 'investment': return <Gift className="w-4 h-4 text-blue-500" />;
      case 'system': return <Megaphone className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">
                  Alert Center
                </h1>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                   Live updates from your financial network
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex-1 md:flex-none cursor-pointer bg-muted/50 text-foreground px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-muted transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Mark All Read
                </button>
                <button className="bg-muted/50 text-foreground cursor-pointer p-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center border-b border-border">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-8 py-4 text-[10px] cursor-pointer font-black uppercase tracking-widest transition-all relative ${activeTab === 'all' ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                All Activity
                {activeTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-1 bg-foreground rounded-t-full" />}
              </button>
              <button 
                onClick={() => setActiveTab('unread')}
                className={`px-8 py-4 text-[10px] cursor-pointer font-black uppercase tracking-widest transition-all relative ${activeTab === 'unread' ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                Unread
                <span className="ml-2 bg-primary text-background px-1.5 py-0.5 rounded text-[8px]">{unreadCount}</span>
                {activeTab === 'unread' && <div className="absolute bottom-0 left-0 w-full h-1 bg-foreground rounded-t-full" />}
              </button>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-card border border-border rounded-[1rem] p-6 animate-pulse">
                      <div className="flex items-start gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-muted flex-shrink-0"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-1/3"></div>
                          <div className="h-3 bg-muted rounded w-2/3"></div>
                          <div className="h-3 bg-muted rounded w-1/4 mt-2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-20 border-2 border-dashed border-border rounded-[3rem]">
                  <Bell className="w-16 h-16" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">
                    {activeTab === 'unread' ? 'No unread notifications' : 'Zero alerts in queue'}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`group relative bg-card border border-border cursor-pointer rounded-[1rem] p-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 transition-all hover:border-foreground/40 hover:shadow-xl ${
                      !notification.isRead ? "bg-muted/10" : ""
                    }`}
                  >
                    {/* Icon Wrapper */}
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-border transition-all group-hover:bg-foreground group-hover:text-background flex-shrink-0 self-start sm:mx-0">
                      {getIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2 text-left sm:text-left">
                      <div className="flex sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                        <h4 className="text-sm font-black italic uppercase tracking-tight flex items-center justify-start sm:justify-start gap-2">
                          {notification.title}
                          {!notification.isRead && (
                            <Circle className="w-2 h-2 fill-primary text-primary" />
                          )}
                        </h4>

                        <div className="flex items-center justify-start sm:justify-end gap-2 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            {notification.time}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-2xl text-left">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination / Load More */}
            <div className="flex justify-center pt-8">
                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                  End of history reached
                </p>
            </div>

          </div>
        </main>
      </div>
      <UserNav />
    </div>
  );
};

export default NotificationsPage;