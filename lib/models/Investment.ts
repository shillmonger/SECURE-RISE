import { ObjectId } from 'mongodb';

export interface ProfitHistory {
  date: string;
  rate: number;
  amount: number;
  timestamp: Date;
}

export interface Investment {
  _id?: ObjectId;
  userId: ObjectId;
  planId: number;
  planName: string;
  roiRate: number;
  investmentAmount: number;
  durationDays: number;
  daysPassed: number;
  profitEarned: number;
  completionPercentage: number;
  status: 'active' | 'completed' | 'expired';
  profitHistory: ProfitHistory[];
  startDate: Date;
  endDate: Date;
  lastProfitDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvestmentPlan {
  id: number;
  name: string;
  min: number;
  max: number | null;
  roiPerDay: number;
  duration: number;
  icon: string;
  color: string;
  accent: string;
  border: string;
  badge: string | null;
  perks: string[];
}

export const createInvestment = (
  userId: ObjectId,
  plan: InvestmentPlan,
  investmentAmount: number
): Omit<Investment, '_id' | 'createdAt' | 'updatedAt'> => {
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + plan.duration);

  return {
    userId,
    planId: plan.id,
    planName: plan.name,
    roiRate: plan.roiPerDay,
    investmentAmount,
    durationDays: plan.duration,
    daysPassed: 0,
    profitEarned: 0,
    completionPercentage: 0,
    status: 'active',
    profitHistory: [],
    startDate,
    endDate,
    lastProfitDate: startDate,
  };
};
