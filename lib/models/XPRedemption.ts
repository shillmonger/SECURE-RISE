import { ObjectId } from 'mongodb';

export interface XPRedemption {
  _id?: ObjectId;
  userId: ObjectId;
  xpType: 'daily' | 'achievement' | 'prediction';
  xpAmount: number;
  usdtAmount: number;
  conversionRate: number; // e.g., 0.02 for 100 XP = $2
  transactionId: string;
  status: 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export const createDefaultXPRedemption = (redemptionData: {
  userId: ObjectId;
  xpType: 'daily' | 'achievement' | 'prediction';
  xpAmount: number;
  usdtAmount: number;
  conversionRate: number;
  transactionId: string;
}): Omit<XPRedemption, '_id' | 'createdAt' | 'updatedAt'> => {
  return {
    userId: redemptionData.userId,
    xpType: redemptionData.xpType,
    xpAmount: redemptionData.xpAmount,
    usdtAmount: redemptionData.usdtAmount,
    conversionRate: redemptionData.conversionRate,
    transactionId: redemptionData.transactionId,
    status: 'completed',
  };
};
