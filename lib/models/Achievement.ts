import { ObjectId } from 'mongodb';

export interface UserAchievement {
  _id?: ObjectId;
  userId: ObjectId;
  achievementId: string;
  title: string;
  description: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp: number;
  unlocked: boolean;
  unlockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserXP {
  _id?: ObjectId;
  userId: ObjectId;
  totalXP: number;
  achievementsUnlocked: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp: number;
  checkFunction: (userData: any, userStats: UserStats) => boolean;
}

export interface UserStats {
  totalDeposits: number;
  totalWithdrawals: number;
  totalInvestments: number;
  totalGiftsSent: number;
  totalGiftsReceived: number;
  depositCount: number;
  withdrawalCount: number;
  investmentCount: number;
  giftSentCount: number;
  giftReceivedCount: number;
  welcomeBonusClaimed: boolean;
}
