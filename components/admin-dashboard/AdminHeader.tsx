"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useTheme } from "@/components/custom-theme-provider";
import { useMounted } from "@/hooks/useMounted";

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

export default function AdminHeader({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const [user, setUser] = useState<UserData>({
    name: "Loading...",
    email: "",
    profileImage: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const mounted = useMounted();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const defaultProfileImage = "https://github.com/shadcn.png";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Since auth token is stored as HTTP-only cookie, we don't need to manually add it
        // The browser will automatically include the cookie in the request
        const response = await fetch('/api/user/info', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser({
            name: data.user?.fullName || data.user?.username || "Admin User",
            email: data.user?.email || "admin@example.com",
            profileImage: data.user?.profileImage || "",
            fullName: data.user?.fullName || "",
          });
        } else {
          console.error('Failed to fetch user info');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
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
            Management Portal
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-secondary rounded-full cursor-pointer">
          {mounted && (
            <div
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="cursor-pointer"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </div>
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
              {isLoading ? "" : (user.name.charAt(0) || "A")}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}