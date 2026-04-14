"use client";

import React, { useState } from "react";
import { Menu, X, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface UserData {
  name: string;
  email: string;
  profileImage?: string;
}

export default function UserHeader({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  // Removed backend fetch logic - using local state/static data
  const [user] = useState<UserData>({
    name: "User Name",
    email: "user@example.com",
    profileImage: "", // Empty string triggers the default shadcn image
  });
  
  // Notification count replaces cart item count
  const [notificationCount] = useState(5); 

  // Default profile image constant
  const defaultProfileImage = "https://github.com/shadcn.png";

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
              {user.name}
            </p>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter mt-1">
              {user.email}
            </p>
          </div>
          <Avatar className="h-9 w-9 border-2 border-foreground/20 rounded-xl p-0.5">
            <AvatarImage 
              src={user.profileImage || defaultProfileImage} 
              className="rounded-lg object-cover" 
            />
            <AvatarFallback className="rounded-lg font-bold">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}