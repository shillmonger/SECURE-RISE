"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// import { signOut } from "next-auth/react";
import { toast } from "sonner";
import {
  LayoutDashboard,
  BarChart3,
  BriefcaseBusiness,
  Trophy,
  Wallet,
  CreditCard,
  History,
  Crown,
  Swords,
  Users,
  BadgeDollarSign,
  HeadphonesIcon,
  Bell,
  Settings,
  LogOut,
  X,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function UserSidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const basePath = "/user-dashboard";

  // Navigation Items updated to your specific list
  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: `${basePath}/dashboard` },
    { name: "Start Investing", icon: BarChart3, href: `${basePath}/invest` },
    { name: "Deposit Capital", icon: CreditCard, href: `${basePath}/deposit` },
    { name: "Transactions", icon: History, href: `${basePath}/transactions` },
    { name: "Live Investments", icon: BriefcaseBusiness, href: `${basePath}/my-investments` },
    { name: "Profit Withdrawal", icon: Wallet, href: `${basePath}/withdraw` },
    { name: "Testimonials", icon: Crown, href: `${basePath}/testimonials` },
    { name: "Top Leaderboard", icon: Trophy, href: `${basePath}/leaderboard` },
    { name: "Trending Challenges", icon: Swords, href: `#` },
    { name: "Referrals & Affiliate", icon: Users, href: `${basePath}/referrals` },
    { name: "Active Support 24/7", icon: HeadphonesIcon, href: `${basePath}/support` },
    { name: "Notifications", icon: Bell, href: `${basePath}/notifications` },
    { name: "Settings & Profile", icon: Settings, href: `${basePath}/user-settings` },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-70 md:w-70 transform bg-background border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-2xl lg:shadow-none`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-15 lg:h-15 px-6 border-b border-border">
          <div className="flex flex-col">
            <h1 className="text-xl font-black uppercase tracking-tighter italic text-foreground">
              SECURE<span className="text-muted-foreground italic">RISE</span>
            </h1>
            <p className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
              You Investments, Our Traders
            </p>
          </div>
          
          <button   
            className="lg:hidden p-2 rounded-xl bg-secondary text-foreground" 
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col justify-between h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)]">
          <nav className="px-4 py-6 space-y-1 overflow-y-auto">
            {sidebarItems.map(({ name, icon: Icon, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={name}
                  href={href}
                  className={`group flex items-center px-4 py-2.5 rounded-sm transition-all duration-200 ${
                    active
                      ? "bg-foreground text-background shadow-lg shadow-black/10"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`w-5 h-5 mr-5 transition-transform ${active ? "scale-110" : "group-hover:scale-110"}`} />
                  <span className="text-[12px] font-black uppercase tracking-widest">{name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Section */}
          <div className="p-4 border-t border-border">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center cursor-pointer w-full px-4 py-3 text-red-500 hover:bg-red-500/10 transition-all rounded-xl group"
            >
              <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/0 backdrop-blur-md p-4">
          <div className="bg-background border border-border rounded-[1.5rem] shadow-2xl w-full max-w-sm p-8 text-center">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <LogOut className="w-8 h-8 text-foreground" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-foreground mb-2">Logout?</h2>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 px-6 py-3 rounded-lg bg-secondary cursor-pointer text-foreground font-bold text-xs uppercase tracking-widest">
                Stay
              </button>
              <button 
                onClick={async () => {
                  try {
                    // await signOut({ redirect: false });
                    router.push("/auth-page/login");
                    toast.success("Successfully signed out");
                  } catch (error) {
                    console.error('Error signing out:', error);
                    toast.error("Failed to sign out.");
                  } finally {
                    setShowLogoutConfirm(false);
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