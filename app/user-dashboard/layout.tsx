"use client";

import PromotionPopup from "@/components/user-dashboard/PromotionPopup";
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
      <PromotionPopup 
        isOpen={isGiftMemberOpen} 
        onClose={() => setIsGiftMemberOpen(false)} 
      />
    </>
  );
}
