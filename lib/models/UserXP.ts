import { ObjectId } from 'mongodb';

export interface DailyClaim {
  date: string; // Format: YYYY-MM-DD
  claimed: boolean;
  xp: number;
  claimedAt?: Date;
}

export interface UserXP {
  _id?: ObjectId;
  userId: ObjectId;
  totalXP: number;
  achievementsUnlocked: string[];
  dailyClaims: DailyClaim[]; // Track daily claims
  currentStreak: number; // Current consecutive days
  longestStreak: number; // Longest streak achieved
  createdAt: Date;
  updatedAt: Date;
}

export const createDefaultUserXP = (userId: ObjectId): Omit<UserXP, '_id' | 'createdAt' | 'updatedAt'> => {
  return {
    userId,
    totalXP: 0,
    achievementsUnlocked: [],
    dailyClaims: [],
    currentStreak: 0,
    longestStreak: 0,
  };
};
