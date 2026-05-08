"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Bell,
  CheckCircle,
  Circle,
  LogOut,
  Plus,
  Settings,
  Loader2,
  Trash2,
  Trash,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import Link from "next/link";
import AddAccountModal from "./AddAccountModal";
import ConfirmModal from "./ConfirmModal";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface UserData {
  name: string;
  email: string;
  profileImage?: string;
  fullName?: string;
}

interface Account {
  id: string;
  email: string;
  fullName?: string;
  username?: string;
  isActive: boolean;
  profileImage?: string;
  isCurrentUser: boolean;
  addedAt?: string;
}

export default function UserHeader({
  sidebarOpen,
  setSidebarOpen,
}: HeaderProps) {
  // Fetch user data from backend
  const [user, setUser] = useState<UserData>({
    name: "Loading...",
    email: "",
    profileImage: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Notification count replaces cart item count
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationLoading, setNotificationLoading] = useState(true);

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Account management state
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountNotifications, setAccountNotifications] = useState<
    Record<string, number>
  >({});

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "remove" | "clear";
    accountId?: string;
    accountName?: string;
  }>({ isOpen: false, type: "remove" });
  const [isRemoving, setIsRemoving] = useState(false);

  // Default profile image constant
  const defaultProfileImage = "https://github.com/shadcn.png";

  // Format time ago helper function (same as notifications page)
  const formatTimeAgo = (date: any) => {
    try {
      let dateObj: Date;

      if (typeof date === "string") {
        dateObj = new Date(date);
      } else if (date && typeof date === "object") {
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

      if (isNaN(dateObj.getTime())) {
        return "Just now";
      }

      const now = new Date();
      const diffInMs = now.getTime() - dateObj.getTime();

      if (diffInMs < 0) {
        return "Just now";
      }

      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
      } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
      } else if (diffInMinutes > 0) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
      } else {
        return "Just now";
      }
    } catch (error) {
      console.error("Error formatting time ago:", error);
      return "Just now";
    }
  };

  // Remove account
  const handleRemoveAccount = async (accountId: string, accountName: string) => {
    setConfirmModal({
      isOpen: true,
      type: "remove",
      accountId,
      accountName,
    });
  };

  // Clear all inactive accounts
  const handleClearAccounts = () => {
    const inactiveAccounts = accounts.filter(account => !account.isActive);
    if (inactiveAccounts.length === 0) {
      toast.info("No inactive accounts to clear");
      return;
    }
    setConfirmModal({
      isOpen: true,
      type: "clear",
    });
  };

  // Confirm action
  const handleConfirmAction = async () => {
    setIsRemoving(true);

    try {
      if (confirmModal.type === "remove" && confirmModal.accountId) {
        // Remove single account
        const response = await fetch('/api/auth/remove-account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accountId: confirmModal.accountId }),
        });

        const data = await response.json();

        if (data.success) {
          toast.success('Account removed successfully');
          fetchAccounts();
        } else {
          toast.error(data.error || 'Failed to remove account');
        }
      } else if (confirmModal.type === "clear") {
        // Clear all inactive accounts
        const response = await fetch('/api/auth/remove-accounts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success) {
          toast.success('All inactive accounts removed successfully');
          fetchAccounts();
        } else {
          toast.error(data.error || 'Failed to clear accounts');
        }
      }
    } catch (error) {
      console.error('Error performing action:', error);
      toast.error('An error occurred while performing the action');
    } finally {
      setIsRemoving(false);
      setConfirmModal({ isOpen: false, type: "remove" });
    }
  };

  // Fetch notification counts for all accounts (using same logic as notifications page)
  const fetchAccountNotifications = async (accountsList: Account[]) => {
    const notifications: Record<string, number> = {};

    for (const account of accountsList) {
      if (account.isActive) continue; // Skip active account, already handled

      try {
        // Fetch all data for this account (same as notifications page)
        const depositsResponse = await fetch(
          `/api/user-dashboard/deposit?userId=${account.id}`,
        );
        const depositsResult = await depositsResponse.json();

        const withdrawalsResponse = await fetch("/api/withdraw");
        const withdrawalsResult = await withdrawalsResponse.json();

        const investmentsResponse = await fetch("/api/investments");
        const investmentsResult = await investmentsResponse.json();

        const giftsResponse = await fetch("/api/user-dashboard/gift/history");
        const giftsResult = await giftsResponse.json();

        const allNotifications: any[] = [];

        // Process deposits as notifications (same logic as notifications page)
        if (depositsResult.success && depositsResult.deposits) {
          depositsResult.deposits.forEach((deposit: any) => {
            allNotifications.push({
              id: `deposit-${deposit._id}`,
              type: "deposit",
              isRead: deposit.status === "approved",
              rawData: deposit,
            });
          });
        }

        // Process withdrawals as notifications (same logic as notifications page)
        if (withdrawalsResult.withdrawals) {
          withdrawalsResult.withdrawals.forEach((withdrawal: any) => {
            const withdrawalDate =
              withdrawal.date || new Date().toLocaleDateString();
            const dateObj = new Date(withdrawalDate);

            allNotifications.push({
              id: `withdrawal-${withdrawal._id}`,
              type: "withdrawal",
              isRead: withdrawal.status === "approved",
              rawData: withdrawal,
            });
          });
        }

        // Process investments as notifications (same logic as notifications page)
        if (investmentsResult.investments) {
          investmentsResult.investments.forEach((investment: any) => {
            // Investment started notification
            allNotifications.push({
              id: `investment-${investment._id}`,
              type: "investment",
              isRead: investment.status === "completed",
              rawData: investment,
            });

            // Add profit history as ROI notifications
            if (
              investment.profitHistory &&
              investment.profitHistory.length > 0
            ) {
              investment.profitHistory.forEach((profit: any) => {
                allNotifications.push({
                  id: `roi-${investment._id}-${profit.timestamp}`,
                  type: "roi",
                  isRead: false, // ROI notifications are always unread initially
                  rawData: { ...profit, investment },
                });
              });
            }
          });
        }

        // Process gifts as notifications (same logic as notifications page)
        if (giftsResult.success && giftsResult.gifts) {
          giftsResult.gifts.forEach((gift: any) => {
            allNotifications.push({
              id: `gift-${gift._id}`,
              type: "gift",
              isRead: false, // Gift notifications are always unread initially
              rawData: gift,
            });
          });
        }

        // Count unread notifications (same as notifications page line 265)
        const unreadCount = allNotifications.filter((n) => !n.isRead).length;
        notifications[account.id] = unreadCount;
      } catch (error) {
        console.error(
          `Error fetching notifications for account ${account.id}:`,
          error,
        );
        notifications[account.id] = 0;
      }
    }

    setAccountNotifications(notifications);
  };

  // Fetch accounts data
  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/auth/accounts");
      const data = await response.json();

      if (data.success) {
        setAccounts(data.accounts);
        // Fetch notifications for inactive accounts
        await fetchAccountNotifications(data.accounts);
      } else {
        console.error("Failed to fetch accounts:", data.error);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setAccountsLoading(false);
    }
  };

  // Switch to another account
  const handleSwitchAccount = async (accountId: string) => {
    try {
      const response = await fetch("/api/auth/switch-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          `Switched to ${data.account.fullName || data.account.username}`,
        );
        setIsDropdownOpen(false);
        // Refresh the page to update user context
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to switch account");
      }
    } catch (error) {
      console.error("Error switching account:", error);
      toast.error("An error occurred while switching accounts");
    }
  };

  // Fetch user data and notification count on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user/info");
        const data = await response.json();

        if (data.success) {
          const userData = data.user;
          setUser({
            name: userData.fullName || userData.username || "User",
            email: userData.email || "",
            profileImage: userData.profileImage || "",
            fullName: userData.fullName || "",
          });

          // Fetch notification count
          await fetchNotificationCount(userData.id);
        } else {
          console.error("Failed to fetch user data:", data.error);
          // Keep default values if fetch fails
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      } finally {
        setIsLoading(false);
        setNotificationLoading(false);
      }
    };

    const fetchNotificationCount = async (userId: string) => {
      try {
        // Fetch deposits
        const depositsResponse = await fetch(
          `/api/user-dashboard/deposit?userId=${userId}`,
        );
        const depositsResult = await depositsResponse.json();

        // Fetch withdrawals
        const withdrawalsResponse = await fetch("/api/withdraw");
        const withdrawalsResult = await withdrawalsResponse.json();

        // Fetch investments
        const investmentsResponse = await fetch("/api/investments");
        const investmentsResult = await investmentsResponse.json();

        // Fetch gifts
        const giftsResponse = await fetch("/api/user-dashboard/gift/history");
        const giftsResult = await giftsResponse.json();

        let unreadCount = 0;

        // Count unread deposits (pending ones)
        if (depositsResult.success && depositsResult.deposits) {
          unreadCount += depositsResult.deposits.filter(
            (d: any) => d.status !== "approved",
          ).length;
        }

        // Count unread withdrawals (pending ones)
        if (withdrawalsResult.withdrawals) {
          unreadCount += withdrawalsResult.withdrawals.filter(
            (w: any) => w.status !== "approved",
          ).length;
        }

        // Count ROI notifications (all profit history items are unread initially)
        if (investmentsResult.investments) {
          investmentsResult.investments.forEach((investment: any) => {
            if (
              investment.profitHistory &&
              investment.profitHistory.length > 0
            ) {
              unreadCount += investment.profitHistory.length;
            }
            // Count active investments as unread
            if (investment.status === "active") {
              unreadCount += 1;
            }
          });
        }

        // Count unread gifts (all gifts are unread initially)
        if (giftsResult.success && giftsResult.gifts) {
          unreadCount += giftsResult.gifts.length;
        }

        setNotificationCount(unreadCount);
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchData();
    fetchAccounts();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="h-15 lg:h-15 border-b border-border flex items-center justify-between gap-4 px-4 sm:px-10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-6 w-6 animate-in fade-in zoom-in duration-300" />
            ) : (
              <Menu className="h-6 w-6 animate-in fade-in zoom-in duration-300" />
            )}
          </button>

          <div className="space-y-0.5">
            <p className="text-[8px] md:text-xs text-muted-foreground font-medium uppercase tracking-widest hidden xs:block">
              Member Experience
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Crypto dropdown removed as requested */}

          {/* Notification Bell replaced the Cart Icon */}
          <Link
            href="/user-dashboard/notifications"
            className="p-2 hover:bg-secondary rounded-full relative cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            {!notificationLoading && notificationCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center border-2 border-background">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 pl-4 border-l border-border transition-colors cursor-pointer"
            >
              <div className="text-right hidden lg:block">
                <p className="text-xs font-black uppercase tracking-tight leading-none text-foreground">
                  {isLoading ? "Loading..." : user.name}
                </p>
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter mt-1">
                  {isLoading ? "" : user.email}
                </p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-foreground/20 rounded-xl p-0.5">
                <AvatarImage
                  src={user.profileImage || defaultProfileImage}
                  className="rounded-lg object-cover"
                />
                <AvatarFallback className="rounded-lg font-bold">
                  {isLoading ? "" : user.name.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-[260px] sm:w-80 overflow-hidden rounded-xl lg:rounded-2xl border border-border bg-background p-2 shadow-xl z-50">
  {/* User Profiles Section */}
  <div className="p-2">
    <div className="mb-2 py-1">
      <h3 className="text-[12px] font-black uppercase tracking-tighter leading-none text-muted-foreground">
        User Profiles
      </h3>

      <p className="mt-1 text-[9px] font-medium uppercase tracking-tighter text-muted-foreground leading-none">
        Switch between your connected accounts
      </p>
    </div>

    {/* Profile Items */}
    <div className="space-y-1">
      {accountsLoading ? (
        <>
          {/* Loading Skeleton */}
          <div className="flex items-center gap-3 p-3">
            <div className="h-10 w-10 rounded-lg bg-secondary animate-pulse"></div>

            <div className="flex-1 space-y-1">
              <div className="h-3 w-3/4 rounded bg-secondary animate-pulse"></div>
              <div className="h-2 w-1/2 rounded bg-secondary animate-pulse"></div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3">
            <div className="h-10 w-10 rounded-lg bg-secondary animate-pulse"></div>

            <div className="flex-1 space-y-1">
              <div className="h-3 w-2/3 rounded bg-secondary animate-pulse"></div>
              <div className="h-2 w-1/3 rounded bg-secondary animate-pulse"></div>
            </div>
          </div>
        </>
      ) : (
        accounts.map((account) => (
          <div
            key={account.id}
            onClick={() =>
              !account.isActive && handleSwitchAccount(account.id)
            }
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              account.isActive
                ? "border border-primary/20 bg-primary/10"
                : "cursor-pointer hover:bg-secondary"
            }`}
          >
            {/* Avatar */}
            <Avatar className="h-10 w-10 rounded-lg shrink-0">
              <AvatarImage
                src={account.profileImage || defaultProfileImage}
                className="rounded-lg object-cover"
              />

              <AvatarFallback className="rounded-lg text-sm font-bold">
                {(account.fullName || account.username || "U")
                  .charAt(0)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex flex-1 items-center justify-between min-w-0">
              {/* Name + Username */}
              <div className="flex flex-col justify-center leading-[1] gap-[5px] min-w-0">
                <span className="truncate text-[10px] font-black uppercase tracking-tight text-foreground">
                  {account.fullName ||
                    account.username ||
                    "Unknown User"}
                </span>

                <span className="truncate text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">
                  @
                  {account.email ||
                    (account.username
                      ? account.username.split("@")[0]
                      : "user")}
                </span>
              </div>

              {/* Status Icon + Remove Button */}
              <div className="flex items-center gap-2 shrink-0">
                {account.isActive ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <>
                    {accountNotifications[account.id] > 0 && (
                      <Circle className="h-2.5 w-2.5 fill-blue-500 text-blue-500" />
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveAccount(
                          account.id,
                          account.fullName ||
                            account.username ||
                            "Unknown User"
                        );
                      }}
                      className="p-1 hover:bg-red-50 cursor-pointer rounded transition-colors group"
                      title="Remove account"
                    >
                      <Trash2 className="h-3 w-3 text-red-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>

  {/* Divider */}
  <div className="border-t border-border" />

  {/* Account Management Section */}
  <div className="p-2">
    <div className="space-y-1">
      {/* Add Account */}
      <button
        onClick={() => {
          setIsModalOpen(true);
          setIsDropdownOpen(false);
        }}
        className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-secondary cursor-pointer"
      >
        <Plus className="h-4 w-4 shrink-0" />

        <span className="text-[11px] font-black uppercase tracking-tight leading-none text-foreground">
          Add an existing account
        </span>
      </button>

      {/* Clear Existing Accounts */}
      <button
        onClick={() => {
          handleClearAccounts();
        }}
        className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-red-50 cursor-pointer group"
      >
        <Trash className="h-4 w-4 shrink-0 text-red-500 group-hover:text-red-600" />

        <span className="text-[11px] font-black uppercase tracking-tight leading-none text-red-500 group-hover:text-red-600">
          Clear existing accounts
        </span>
      </button>

      {/* Logout */}
      <button
        onClick={() => {
          window.location.href = "/auth-page/login";
        }}
        className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-secondary cursor-pointer"
      >
        <LogOut className="h-4 w-4 shrink-0 text-red-500" />

        <span className="text-[11px] font-black uppercase tracking-tight leading-none text-red-500">
          Log out @{isLoading ? "" : user.email.split("@")[0]}
        </span>
      </button>
    </div>
  </div>
</div>
            )}
          </div>
        </div>
      </header>

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccountAdded={() => {
          fetchAccounts(); // Refresh accounts list
          setIsModalOpen(false);
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: "remove" })}
        onConfirm={handleConfirmAction}
        title={confirmModal.type === "remove" ? "Remove Account" : "Clear All Accounts"}
        message={
          confirmModal.type === "remove"
            ? `Are you sure you want to remove "${confirmModal.accountName}" from your accounts?`
            : "Are you sure you want to remove all inactive accounts? This action cannot be undone."
        }
        confirmText={confirmModal.type === "remove" ? "Remove Account" : "Clear All"}
        cancelText="Cancel"
        type="danger"
        isLoading={isRemoving}
      />
    </>
  );
}
