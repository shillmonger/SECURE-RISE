import { ObjectId } from 'mongodb';

export interface Deposit {
  _id?: ObjectId;
  userId: ObjectId;
  username: string;
  userEmail: string;
  amount: number;
  paymentMethod: string;
  proofImage?: string; // Cloudinary URL
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  transactionId?: string; // Unique transaction ID
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  approvedBy?: ObjectId; // Admin who approved
  rejectedAt?: Date;
  rejectedBy?: ObjectId; // Admin who rejected
}

export const createDeposit = (depositData: {
  userId: ObjectId;
  username: string;
  userEmail: string;
  amount: number;
  paymentMethod: string;
  proofImage?: string;
}): Omit<Deposit, '_id' | 'createdAt' | 'updatedAt' | 'approvedAt' | 'approvedBy' | 'rejectedAt' | 'rejectedBy'> => {
  return {
    userId: depositData.userId,
    username: depositData.username,
    userEmail: depositData.userEmail,
    amount: depositData.amount,
    paymentMethod: depositData.paymentMethod,
    proofImage: depositData.proofImage,
    status: 'pending',
    transactionId: `DEP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  };
};
