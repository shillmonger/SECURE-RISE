"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Wallet,
  Settings,
  User,
  Briefcase,
  Gift,
  LogOut,
  UserCog,
  IdCard,
  Users,
  X,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const basePath = "/admin-dashboard";

  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: `${basePath}/dashboard` },
    { name: "Manage Deposite", icon: Wallet, href: `${basePath}/manage-deposite` },
    { name: "Gift Card Deposite", icon: Gift, href: `${basePath}/manage-gift-cards` },
    { name: "Manage Account", icon: UserCog, href: `${basePath}/manage-account` },
    { name: "User Management", icon: Users, href: `${basePath}/user-management` },
    { name: "Investor Payouts", icon: Briefcase, href: `${basePath}/investment-payouts` },
    { name: "Role Settings", icon: Settings, href: `${basePath}/role-settings` },
    { name: "KYC Verification", icon: IdCard, href: `${basePath}/kyc-verification` },
    { name: "Switch to User", icon: User, href: "/user-dashboard/dashboard" },
  ];

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
        } fixed inset-y-0 left-0 z-100 w-full md:w-65 transform bg-background border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-2xl lg:shadow-none`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-15 lg:h-15 px-6 border-b border-border">
          <div className="flex flex-col">
            <h1 className="text-xl font-black uppercase tracking-tighter italic text-foreground">
              SECURE<span className="text-muted-foreground italic"> RISE</span>
            </h1>
            <p className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
              Management Portal
            </p>
          </div>
          
          <button   
            className="lg:hidden text-foreground" 
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col justify-between h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)]">
          <nav className="px-4 py-5 space-y-1 overflow-y-auto">
            {sidebarItems.map(({ name, icon: Icon, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={name}
                  href={href}
                  className={`group flex items-center px-3 py-2.5 rounded-sm transition-all duration-200 ${
                    active
                      ? "bg-foreground text-background shadow-lg shadow-black/10"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`w-5 h-5 mr-3 transition-transform ${active ? "scale-110" : "group-hover:scale-110"}`} />
                  <span className="text-[12px] font-black uppercase tracking-widest">{name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Section */}
         <div className="flex-shrink-0 flex items-center justify-center px-4 py-3 lg:py-2 border-t border-border">
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
        </div>
      </aside>

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
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <LogOut className="w-8 h-8 text-foreground" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-foreground mb-2">Logout?</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to sign out? You'll need to log in again to access your admin panel.
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
            
            <div className="flex flex-row sm:flex-row gap-3 mt-6">
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
                onClick={async () => {
                  try {
                    router.push("/auth-page/login");
                    toast.success("Successfully signed out");
                  } catch (error) {
                    console.error('Error signing out:', error);
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