"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  BarChart3,
  BadgeCheck,
  Trophy,
  TrendingUp,
  CalendarDays,
  ChartNoAxesCombined,
  Award,
  Wallet,
  IdCard,
  CreditCard,
  Gift,
  History,
  Crown,
  Medal,
  PieChart,
  Gem,
  Users,
  Lock,
  HeadphonesIcon,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  PartyPopper,
  MessageSquare,
  X,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

type NavItem =
  | { name: string; icon: React.ElementType; href: string }
  | {
      name: string;
      icon: React.ElementType;
      children: { name: string; icon: React.ElementType; href: string }[];
    };

export default function UserSidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [userRole, setUserRole] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(10);

  // FIX 1: Set Account and Community to true by default
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Account: true,
    Community: true,
  });

  const basePath = "/user-dashboard";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user-dashboard/profile");
        const data = await response.json();
        if (data.success && data.user.role) {
          setUserRole(data.user.role);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showLogoutConfirm && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowLogoutConfirm(false);
      setCountdown(10);
    }
    return () => clearTimeout(timer);
  }, [showLogoutConfirm, countdown]);

  const navItems: NavItem[] = [
    { name: "Dashboard", icon: LayoutDashboard, href: `${basePath}/dashboard` },
    { name: "Deposit Capital", icon: CreditCard, href: `${basePath}/deposit` },
    { name: "Start Investing", icon: BarChart3, href: `${basePath}/invest` },
    { name: "Gift Member", icon: Gift, href: `${basePath}/gift-member` },
    { name: "Investments Hub", icon: ChartNoAxesCombined, href: `${basePath}/my-investments`,},
    { name: "Transactions", icon: History, href: `${basePath}/transactions` },
    { name: "Withdrawals", icon: Wallet, href: `${basePath}/withdraw` },
    { name: "Trade Analytics", icon: PieChart, href: `${basePath}/analytics` },
    {
      name: "Community",
      icon: Users,
      children: [
        { name: "daily streak", icon: PartyPopper, href: `${basePath}/daily-streak` },
        { name: "Achievements", icon: Gem, href: `${basePath}/achievements` },
        { name: "Leaderboard", icon: Trophy, href: `${basePath}/leaderboard` },
        { name: "Testimonials", icon: Crown, href: `${basePath}/testimonials` },
        { name: "Referrals", icon: Users, href: `#` },
        { name: "Give Feedback", icon: BadgeCheck, href: `${basePath}/feedback` },
      ],
    },
    {
      name: "Account",
      icon: Settings,
      children: [
        {
          name: "Notifications",
          icon: Bell,
          href: `${basePath}/notifications`,
        },
        {
          name: "Settings & Profile",
          icon: Settings,
          href: `${basePath}/user-settings`,
        },
        { name: "KYC Verification", icon: IdCard, href: `${basePath}/kyc` },
        {
          name: "Active Support 24/7",
          icon: HeadphonesIcon,
          href: `${basePath}/support`,
        },
        ...(userRole.includes("admin")
          ? [
              {
                name: "Switch to Admin",
                icon: Lock,
                href: `/admin-dashboard/dashboard`,
              },
            ]
          : []),
      ],
    },
  ];

  useEffect(() => {
    navItems.forEach((item) => {
      if ("children" in item) {
        const hasActive = item.children.some(
          (child) => pathname === child.href,
        );
        if (hasActive) {
          setOpenGroups((prev) => ({ ...prev, [item.name]: true }));
        }
      }
    });
  }, [pathname]);

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-100 w-full md:w-70 flex flex-col lg:rounded-none
  transform bg-background border-r border-border 
  transition-transform duration-300 ease-in-out 
  lg:translate-x-0 lg:static lg:inset-0 
  shadow-2xl lg:shadow-none h-screen`}
      >
        <div className="flex-shrink-0 flex items-center justify-between h-15 px-6 border-b border-border">
          <div className="flex flex-col">
            <h1 className="text-xl font-black uppercase tracking-tighter  text-foreground">
              SECURE<span className="text-muted-foreground "> RISE</span>
            </h1>
            <p className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
              Your Investments, Our Traders
            </p>
          </div>
          <button
            className="lg:hidden rounded-lg text-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* FIX 2: Added overflow-y-auto and scrollbar styling to make the nav scrollable */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {navItems.map((item) => {
            if ("href" in item) {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-2.5 rounded-sm transition-all duration-200 ${
                    active
                      ? "bg-foreground text-background shadow-lg shadow-black/10"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`w-5 h-5 mr-5 transition-transform ${
                      active ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  <span className="text-[12px] font-black uppercase tracking-widest">
                    {item.name}
                  </span>
                </Link>
              );
            }

            const isOpen = !!openGroups[item.name];
            const hasActiveChild = item.children.some(
              (c) => pathname === c.href,
            );

            return (
              <div key={item.name} className="flex flex-col">
                <button
                  onClick={() => toggleGroup(item.name)}
                  className={`group w-full flex items-center px-4 py-2.5 rounded-sm transition-all duration-200 cursor-pointer ${
                    hasActiveChild
                      ? "text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 mr-5 transition-transform ${
                      hasActiveChild ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  <span className="flex-1 text-left text-[12px] font-black uppercase tracking-widest">
                    {item.name}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`${
                    isOpen ? "block" : "hidden"
                  } transition-all duration-300 ease-in-out`}
                >
                  <div className="ml-4 mt-1 mb-1 pl-4 border-l border-border space-y-0.5">
                    {item.children.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`group flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-200 ${
                            childActive
                              ? "bg-foreground text-background shadow-lg shadow-black/10"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <child.icon
                            className={`w-4 h-4 flex-shrink-0 transition-transform ${
                              childActive
                                ? "scale-110"
                                : "group-hover:scale-110"
                            }`}
                          />
                          <span className="text-[11px] font-black uppercase tracking-widest">
                            {child.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Logout Section - fixed at bottom only on small screens */}
        <div className="flex-shrink-0 flex items-center justify-center px-4 py-2 lg:py-2 border-t border-border lg:relative fixed bottom-0 left-0 right-0 bg-background z-50 lg:border-t lg:border-border border-t-0">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center cursor-pointer w-full px-4 py-3 text-red-500 hover:bg-red-500/10 transition-all rounded-sm group"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-background/95 border border-border rounded-[1.5rem] shadow-2xl w-full max-w-sm p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-15 h-15 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <LogOut className="w-7 h-7 text-foreground" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-foreground mb-2">
              Logout?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to sign out? You'll need to log in again to
              access your account.
            </p>

            {/* Countdown Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Auto-closing in...</span>
                <span>{countdown}s</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-foreground h-2 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(countdown / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex sm:flex-row gap-3 mt-6">
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  setCountdown(10);
                }}
                className="flex-1 px-6 py-3 rounded-lg bg-secondary cursor-pointer text-foreground font-bold text-xs uppercase tracking-widest"
              >
                Stay
              </button>
              <button
                onClick={() => {
                  router.push("/auth-page/login");
                  toast.success("Successfully signed out");
                  setShowLogoutConfirm(false);
                  setCountdown(10);
                }}
                className="flex-1 px-6 py-3 rounded-lg bg-foreground cursor-pointer text-background font-bold text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
