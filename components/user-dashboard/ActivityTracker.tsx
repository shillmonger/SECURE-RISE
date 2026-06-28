"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  generateSessionId, 
  getDeviceInfo, 
  getPageNameFromPath, 
  calculateScrollMilestone, 
  throttle, 
  debounce,
  formatEventTime 
} from "@/lib/activity-tracker";
import { EventCategory } from "@/lib/models/UserActivity";

export default function ActivityTracker() {
  const pathname = usePathname();
  const router = useRouter();
  const sessionIdRef = useRef<string>("");
  const currentPageRef = useRef<string>("");
  const scrollMilestoneRef = useRef<number>(0);
  const timeOnPageRef = useRef<number>(0);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeOnPageIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(false);

  // Initialize session
  const initializeSession = useCallback(async () => {
    try {
      const sessionId = generateSessionId();
      sessionIdRef.current = sessionId;
      
      const deviceInfo = getDeviceInfo();
      const currentPage = getPageNameFromPath(pathname);
      currentPageRef.current = currentPage;
      
      await fetch("/api/activity/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          currentPage,
          currentRoute: pathname,
          currentUrl: window.location.href,
          device: deviceInfo.device,
          browser: deviceInfo.browser,
          operatingSystem: deviceInfo.operatingSystem,
        }),
      });
      
      // Start heartbeat (every 20 seconds)
      heartbeatIntervalRef.current = setInterval(() => {
        sendHeartbeat();
      }, 20000);
      
      // Start time on page counter
      timeOnPageIntervalRef.current = setInterval(() => {
        timeOnPageRef.current += 1;
        updateTimeOnPage();
      }, 1000);
      
    } catch (error) {
      console.error("Failed to initialize activity session:", error);
    }
  }, [pathname]);

  // Send heartbeat
  const sendHeartbeat = useCallback(async () => {
    try {
      await fetch("/api/activity/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          status: document.hidden ? "away" : "online",
        }),
      });
    } catch (error) {
      console.error("Heartbeat failed:", error);
    }
  }, []);

  // Update time on page
  const updateTimeOnPage = useCallback(async () => {
    try {
      await fetch("/api/activity/session", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          timeOnPage: timeOnPageRef.current,
        }),
      });
    } catch (error) {
      console.error("Failed to update time on page:", error);
    }
  }, []);

  // Log activity event
  const logEvent = useCallback(async (action: string, category: EventCategory, metadata?: Record<string, any>) => {
    try {
      await fetch("/api/activity/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          action,
          category,
          page: currentPageRef.current,
          metadata,
        }),
      });
    } catch (error) {
      console.error("Failed to log event:", error);
    }
  }, []);

  // Handle page change
  const handlePageChange = useCallback(async (newPath: string) => {
    try {
      const newPage = getPageNameFromPath(newPath);
      currentPageRef.current = newPage;
      scrollMilestoneRef.current = 0;
      timeOnPageRef.current = 0;
      
      await fetch("/api/activity/session", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          currentPage: newPage,
          currentRoute: newPath,
          currentUrl: window.location.href,
          timeOnPage: 0,
          scrollMilestone: 0,
        }),
      });
      
      await logEvent(`Opened ${newPage}`, "navigation");
    } catch (error) {
      console.error("Failed to handle page change:", error);
    }
  }, [logEvent]);

  // Throttled scroll handler
  const handleScroll = useCallback(
    throttle(() => {
      const newMilestone = calculateScrollMilestone();
      if (newMilestone !== scrollMilestoneRef.current && newMilestone > 0) {
        scrollMilestoneRef.current = newMilestone;
        logEvent(`Scrolled to ${newMilestone}%`, "scroll");
        
        fetch("/api/activity/session", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            scrollMilestone: newMilestone,
          }),
        }).catch(console.error);
      }
    }, 500),
    [logEvent]
  );

  // Button click handler
  const handleButtonClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const button = target.closest("button");
    
    if (!button) return;
    
    const buttonText = button.textContent?.trim() || "Button";
    const buttonId = button.id || "";
    const buttonClass = button.className || "";
    
    // Detect important button clicks
    const importantKeywords = ["deposit", "withdraw", "submit", "save", "buy", "sell", "trade", "invest", "transfer", "send"];
    const isImportant = importantKeywords.some(keyword => 
      buttonText.toLowerCase().includes(keyword) || 
      buttonId.toLowerCase().includes(keyword) ||
      buttonClass.toLowerCase().includes(keyword)
    );
    
    if (isImportant) {
      logEvent(`Clicked ${buttonText}`, "action", { 
        buttonText,
        buttonId,
        page: currentPageRef.current 
      });
    }
  }, [logEvent]);

  // Visibility change handler
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      logEvent("Window hidden", "navigation");
    } else {
      logEvent("Window focused", "navigation");
    }
  }, [logEvent]);

  // Setup event listeners
  useEffect(() => {
    if (isMountedRef.current) return;
    isMountedRef.current = true;

    // Initialize session on mount
    initializeSession();

    // Add event listeners
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("click", handleButtonClick);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      if (timeOnPageIntervalRef.current) {
        clearInterval(timeOnPageIntervalRef.current);
      }
      
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleButtonClick);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      
      // Mark user as offline on unmount
      fetch("/api/activity/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          status: "offline",
        }),
      }).catch(console.error);
    };
  }, [initializeSession, handleScroll, handleButtonClick, handleVisibilityChange]);

  // Handle route changes
  useEffect(() => {
    if (sessionIdRef.current && currentPageRef.current !== getPageNameFromPath(pathname)) {
      handlePageChange(pathname);
    }
  }, [pathname, handlePageChange]);

  return null; // This component doesn't render anything
}
