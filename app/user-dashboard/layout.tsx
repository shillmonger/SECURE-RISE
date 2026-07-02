"use client";

import PromotionPopup from "@/components/user-dashboard/PromotionPopup";
import ActivityTracker from "@/components/user-dashboard/ActivityTracker";
import { useState, useEffect } from "react";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isGiftMemberOpen, setIsGiftMemberOpen] = useState(false);

  // Auto-open the gift member modal only on login/signup (not on page navigation)
  useEffect(() => {
    const hasShownPopup = localStorage.getItem('promotionPopupShown');
    
    if (!hasShownPopup) {
      const timer = setTimeout(() => {
        setIsGiftMemberOpen(true);
        localStorage.setItem('promotionPopupShown', 'true');
      }, 2000); // Open after 2 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <ActivityTracker />
      {children}
      <PromotionPopup 
        isOpen={isGiftMemberOpen} 
        onClose={() => setIsGiftMemberOpen(false)} 
      />
    </>
  );
}
