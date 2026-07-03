"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  AlarmClockMinus,
  AlarmClock,
  MessageCircle,
  MailPlus,
  Landmark,
  BarChart3,
  Wallet,
  Settings,
  User,
  ScreenShare,
  CircleDollarSign,
  BadgeCheck,
  Gift,
  LogOut,
  UserCog,
  IdCard,
  Users,
  X,
  ChevronDown,
  Lock,
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

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const basePath = "/admin-dashboard";

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Deposits: true,
    Users: true,
    Finance: true,
    Settings: true,
  });

  const navItems: NavItem[] = [
    { name: "Dashboard", icon: LayoutDashboard, href: `${basePath}/dashboard` },

    {
      name: "Deposits",
      icon: Wallet,
      children: [
        { name: "Crypto Deposit", icon: Wallet, href: `${basePath}/manage-deposite` },
        { name: "Gift Card Deposit", icon: Gift, href: `${basePath}/manage-gift-cards` },
      ],
    },

    {
      name: "Users",
      icon: Users,
      children: [
        { name: "Monitor Users", icon: ScreenShare, href: `${basePath}/monitor-users` },
        { name: "Manage Account", icon: UserCog, href: `${basePath}/manage-account` },
        { name: "KYC Verification", icon: BadgeCheck, href: `${basePath}/kyc-verification` },
        { name: "User Management", icon: Users, href: `${basePath}/user-management` },
        { name: "User Investments", icon: BarChart3, href: `${basePath}/user-investments` },
      ],
    },

    {
      name: "Finance",
      icon: CircleDollarSign,
      children: [
        { name: "Other Payouts", icon: Landmark, href: `${basePath}/other-payouts` },
        { name: "Crypto Payouts", icon: Wallet, href: `${basePath}/crypto-payouts` },
      ],
    },

    {
      name: "Settings",
      icon: Settings,
      children: [
        { name: "Live Chat", icon: MessageCircle, href: `${basePath}/live-chat` },
        { name: "Role Settings", icon: Settings, href: `${basePath}/role-settings` },
        { name: "Live API Alerts", icon: AlarmClock , href: `${basePath}/alerts` },
        { name: "Email Distribution", icon: MailPlus, href: `${basePath}/email-distribution` },
        { name: "Switch to Trader", icon: User, href: "/user-dashboard/dashboard" },
      ],
    },
  ];

  useEffect(() => {
    navItems.forEach((item) => {
      if ("children" in item) {
        const hasActive = item.children.some((child) => pathname === child.href);
        if (hasActive) {
          setOpenGroups((prev) => ({ ...prev, [item.name]: true }));
        }
      }
    });
  }, [pathname]);

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showLogoutConfirm && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setShowLogoutConfirm(false);
      setCountdown(10);
    }
    return () => clearTimeout(timer);
  }, [showLogoutConfirm, countdown]);

  const NavContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-5 space-y-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
      {navItems.map((item) => {
        if ("href" in item) {
          const active = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onLinkClick}
              className={`group flex items-center px-4 py-2.5 rounded-sm transition-all duration-200 ${
                active
                  ? "bg-foreground text-background shadow-lg shadow-black/10"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 mr-5 transition-transform ${active ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="text-[12px] font-black uppercase tracking-widest">{item.name}</span>
            </Link>
          );
        }

        const isOpen = !!openGroups[item.name];
        const hasActiveChild = item.children.some((c) => pathname === c.href);

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
              <item.icon className={`w-5 h-5 mr-5 transition-transform ${hasActiveChild ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="flex-1 text-left text-[12px] font-black uppercase tracking-widest">
                {item.name}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            <div className={`${isOpen ? "block" : "hidden"} transition-all duration-300 ease-in-out`}>
              <div className="ml-4 mt-1 mb-1 pl-4 border-l border-border space-y-0.5">
                {item.children.map((child) => {
                  const childActive = pathname === child.href;
                  return (
                    <Link
                      key={child.name}
                      href={child.href}
                      onClick={onLinkClick}
                      className={`group flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-200 ${
                        childActive
                          ? "bg-foreground text-background shadow-lg shadow-black/10"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <child.icon className={`w-4 h-4 flex-shrink-0 transition-transform ${childActive ? "scale-110" : "group-hover:scale-110"}`} />
                      <span className="text-[11px] font-black uppercase tracking-widest">{child.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-70 border-r h-screen sticky top-0 bg-background flex-col shadow-xl">
        <div className="flex-shrink-0 flex items-center justify-between h-15 px-6 border-b border-border">
          <div className="flex flex-col">
            <h1 className="text-xl font-black uppercase tracking-tighter text-foreground">
              SECURE<span className="text-[#229ED9]"> RISE</span>
            </h1>
            <p className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
              Management Portal
            </p>
          </div>
        </div>

        <NavContent />

        <div className="flex-shrink-0 border-t border-border px-4 py-2">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center cursor-pointer w-full px-4 py-3 text-red-500 hover:bg-red-500/10 transition-all rounded-sm group"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed top-0 left-0 w-full h-full bg-background z-100 flex flex-col shadow-2xl lg:hidden">
            <div className="flex-shrink-0 flex items-center justify-between h-15 px-6 border-b border-border">
              <div className="flex flex-col">
                <h1 className="text-xl font-black uppercase tracking-tighter text-foreground">
                  SECURE<span className="text-[#229ED9]"> RISE</span>
                </h1>
                <p className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                  Management Portal
                </p>
              </div>
              <button className="text-foreground" onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <NavContent onLinkClick={() => setSidebarOpen(false)} />

            <div className="flex-shrink-0 border-t border-border px-4 py-2">
              <button
                onClick={() => { setSidebarOpen(false); setShowLogoutConfirm(true); }}
                className="flex items-center cursor-pointer w-full px-4 py-3 text-red-500 hover:bg-red-500/10 transition-all rounded-sm group"
              >
                <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">Logout</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-background/95 border border-border rounded-[1.5rem] shadow-2xl w-full max-w-sm p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-black uppercase tracking-tighter text-foreground mb-2">Logout?</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to sign out? You'll need to log in again to access your admin panel.
            </p>

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

            <div className="flex flex-row gap-3 mt-6">
              <button
                onClick={() => { setShowLogoutConfirm(false); setCountdown(10); }}
                className="flex-1 px-6 py-3 rounded-lg bg-secondary cursor-pointer text-foreground font-bold text-xs uppercase tracking-widest"
              >
                Stay
              </button>
              <button
                onClick={async () => {
                  try {
                    router.push("/auth-page/login");
                    toast.success("Successfully signed out");
                  } catch (error) {
                    console.error("Error signing out:", error);
                    toast.error("Failed to sign out.");
                  } finally {
                    setShowLogoutConfirm(false);
                    setCountdown(10);
                  }
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