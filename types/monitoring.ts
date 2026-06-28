import React from "react";

export type UserStatus = "online" | "offline" | "away";
export type DeviceType = "desktop" | "mobile" | "tablet";
export type ModalTab = "overview" | "activity" | "security" | "devices" | "navigation" | "timeline" | "statistics";

export interface ActivityEvent {
  time: string;
  action: string;
  icon: React.ElementType;
  category: "navigation" | "action" | "form" | "scroll" | "deposit" | "auth" | "withdraw" | "trading";
  page?: string;
  metadata?: Record<string, any>;
}

export interface LiveUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: "user" | "admin" | "vip";
  status: UserStatus;
  currentPage: string;
  currentUrl: string;
  lastActivity: string;
  device: DeviceType;
  browser: string;
  os: string;
  sessionDuration: string;
  country: string;
  city: string;
  ipAddress: string;
  loginTime: string;
  avatar: string;
  timeOnPage: string;
  activityFeed: ActivityEvent[];
  pageVisitsToday: number;
  scrollProgress: number;
  pagesVisited: string[];
  vpnDetected: boolean;
  newDevice: boolean;
  buttonsClicked: number;
  formsSubmitted: number;
  navigationCount: number;
  activityScore: number;
  connection: "excellent" | "good" | "poor";
  mouseActivity: string;
  keyboardActivity: string;
}
