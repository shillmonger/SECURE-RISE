import { ObjectId } from 'mongodb';

export type UserStatus = "online" | "offline" | "away";
export type DeviceType = "desktop" | "mobile" | "tablet";
export type EventCategory = "navigation" | "action" | "form" | "scroll" | "deposit" | "auth" | "withdraw" | "trading";

export interface ActivityEvent {
  time: string;
  action: string;
  category: EventCategory;
  page?: string;
  metadata?: Record<string, any>;
}

export interface UserActivity {
  _id?: ObjectId;
  userId: string; // Reference to users collection
  sessionId: string; // Unique session identifier
  currentPage: string;
  currentRoute: string;
  currentUrl: string;
  status: UserStatus;
  device: DeviceType;
  browser: string;
  operatingSystem: string;
  country?: string;
  city?: string;
  ipAddress?: string;
  loginTime: Date;
  lastHeartbeat: Date;
  lastActivity: Date;
  timeOnPage: number; // in seconds
  scrollMilestone: number; // 0, 25, 50, 75, 100
  activityEvents: ActivityEvent[];
  pagesVisited: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateActivitySession {
  userId: string;
  sessionId: string;
  currentPage: string;
  currentRoute: string;
  currentUrl: string;
  device: DeviceType;
  browser: string;
  operatingSystem: string;
  country?: string;
  city?: string;
  ipAddress?: string;
}

export interface UpdateActivitySession {
  currentPage?: string;
  currentRoute?: string;
  currentUrl?: string;
  status?: UserStatus;
  timeOnPage?: number;
  scrollMilestone?: number;
  pagesVisited?: string[];
}

export interface ActivityEventInput {
  action: string;
  category: EventCategory;
  page?: string;
  metadata?: Record<string, any>;
}
