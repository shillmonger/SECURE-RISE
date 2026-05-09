"use client";

import GiftMember from "@/components/user-dashboard/GiftMember";
import { useState, useEffect } from "react";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isGiftMemberOpen, setIsGiftMemberOpen] = useState(false);

  // Auto-open the gift member modal after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGiftMemberOpen(true);
    }, 2000); // Open after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {children}
      <GiftMember 
        isOpen={isGiftMemberOpen} 
        onClose={() => setIsGiftMemberOpen(false)} 
      />
    </>
  );
}
