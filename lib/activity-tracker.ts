export type DeviceType = "desktop" | "mobile" | "tablet";

export interface DeviceInfo {
  device: DeviceType;
  browser: string;
  operatingSystem: string;
}

// Throttle function to limit execution frequency
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return function (...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

// Debounce function to delay execution
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Generate unique session ID
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Detect device type
export function detectDevice(): DeviceType {
  const userAgent = navigator.userAgent;
  
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return "tablet";
  }
  
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(userAgent)) {
    return "mobile";
  }
  
  return "desktop";
}

// Detect browser
export function detectBrowser(): string {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes("Firefox") && !userAgent.includes("Seamonkey")) {
    const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
    return match ? `Firefox ${match[1]}` : "Firefox";
  }
  
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
    return match ? `Chrome ${match[1]}` : "Chrome";
  }
  
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    const match = userAgent.match(/Version\/(\d+\.\d+)/);
    return match ? `Safari ${match[1]}` : "Safari";
  }
  
  if (userAgent.includes("Edg")) {
    const match = userAgent.match(/Edg\/(\d+\.\d+)/);
    return match ? `Edge ${match[1]}` : "Edge";
  }
  
  return "Unknown";
}

// Detect operating system
export function detectOS(): string {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes("Windows NT 10.0")) return "Windows 10";
  if (userAgent.includes("Windows NT 6.3")) return "Windows 8.1";
  if (userAgent.includes("Windows NT 6.2")) return "Windows 8";
  if (userAgent.includes("Windows NT 6.1")) return "Windows 7";
  if (userAgent.includes("Windows NT")) return "Windows";
  
  if (userAgent.includes("Mac OS X")) {
    const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
    return match ? `macOS ${match[1].replace("_", ".")}` : "macOS";
  }
  
  if (userAgent.includes("Linux")) return "Linux";
  
  if (userAgent.includes("Android")) {
    const match = userAgent.match(/Android (\d+\.\d+)/);
    return match ? `Android ${match[1]}` : "Android";
  }
  
  if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    const match = userAgent.match(/OS (\d+[._]\d+)/);
    return match ? `iOS ${match[1].replace("_", ".")}` : "iOS";
  }
  
  return "Unknown";
}

// Get current page name from URL
export function getPageNameFromPath(path: string): string {
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return "Dashboard";
  
  const pageMap: Record<string, string> = {
    "dashboard": "Dashboard",
    "deposit": "Deposit",
    "withdraw": "Withdraw",
    "invest": "Investments",
    "predict": "Trading",
    "referrals": "Referrals",
    "profile": "Profile",
    "user-settings": "Profile",
    "kyc": "Verification",
    "notifications": "Notifications",
    "transactions": "Transactions",
    "wallet": "Wallet",
    "gift-card": "Gift Cards",
    "achievements": "Achievements",
    "leaderboard": "Leaderboard",
    "analytics": "Analytics",
  };
  
  const lastSegment = segments[segments.length - 1];
  return pageMap[lastSegment] || lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
}

// Calculate scroll milestone
export function calculateScrollMilestone(): number {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
  
  if (scrollPercent >= 100) return 100;
  if (scrollPercent >= 75) return 75;
  if (scrollPercent >= 50) return 50;
  if (scrollPercent >= 25) return 25;
  return 0;
}

// Format time for events
export function formatEventTime(): string {
  const now = new Date();
  return now.toTimeString().split(" ")[0]; // HH:MM:SS
}

// Format session duration
export function formatSessionDuration(startTime: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - new Date(startTime).getTime()) / 1000);
  
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ${diff % 60}s`;
  return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
}

// Format relative time
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
  
  if (diff < 5) return "Just now";
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

// Get device info object
export function getDeviceInfo(): DeviceInfo {
  return {
    device: detectDevice(),
    browser: detectBrowser(),
    operatingSystem: detectOS(),
  };
}
