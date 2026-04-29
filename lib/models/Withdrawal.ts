import { ObjectId } from 'mongodb';

export interface Withdrawal {
  _id?: ObjectId;
  userId: ObjectId;
  username: string;
  userEmail: string;
  amount: number;
  crypto: {
    name: string;
    symbol: string;
    icon: string;
  };
  destinationAddress: string;
  status: 'pending' | 'approved' | 'rejected';
  otpCode?: string;
  otpExpires?: Date;
  withdrawalId: string;
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
}

export const generateWithdrawalId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `WID-${timestamp.toUpperCase()}-${random.toUpperCase()}`;
};

export const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};
