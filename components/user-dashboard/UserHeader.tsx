"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

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

export default function UserHeader({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  // Fetch user data from backend
  const [user, setUser] = useState<UserData>({
    name: "Loading...",
    email: "",
    profileImage: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Notification count replaces cart item count
  const [notificationCount] = useState(5);

  // Default profile image constant
  const defaultProfileImage = "https://github.com/shadcn.png";

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user-dashboard/profile');
        const data = await response.json();

        if (data.success) {
          const userData = data.user;
          setUser({
            name: userData.fullName || userData.username || "User",
            email: userData.email || "",
            profileImage: userData.profileImage || "",
            fullName: userData.fullName || "",
          });
        } else {
          console.error('Failed to fetch user data:', data.error);
          // Keep default values if fetch fails
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
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
        <button className="p-2 hover:bg-secondary rounded-full relative cursor-pointer">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center border-2 border-background">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
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
              {isLoading ? "" : (user.name.charAt(0) || "U")}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}