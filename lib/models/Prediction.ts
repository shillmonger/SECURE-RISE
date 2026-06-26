import { ObjectId } from 'mongodb';

export interface Prediction {
  _id?: ObjectId;
  userId: ObjectId;
  pair: string; // e.g., "BTCUSDT", "XAUUSD"
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  confidence: 'Low' | 'Medium' | 'High';
  status: 'pending' | 'won' | 'lost';
  xpEarned: number; // 1000 if won, 0 if lost
  closePrice?: number; // Market close price
  submissionDate: string; // Format: YYYY-MM-DD
  submittedAt: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const createPrediction = (predictionData: {
  userId: ObjectId;
  pair: string;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  confidence: 'Low' | 'Medium' | 'High';
}): Omit<Prediction, '_id' | 'status' | 'xpEarned' | 'closePrice' | 'processedAt' | 'createdAt' | 'updatedAt'> => {
  const now = new Date();
  const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
  
  return {
    userId: predictionData.userId,
    pair: predictionData.pair,
    direction: predictionData.direction,
    entryPrice: predictionData.entryPrice,
    confidence: predictionData.confidence,
    submissionDate: today,
    submittedAt: now,
  };
};
