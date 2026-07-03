import { ObjectId } from 'mongodb';

export interface OtherWithdrawal {
  _id?: ObjectId;
  userId: ObjectId;
  username: string;
  userEmail: string;
  amount: number;
  fee: number;
  receiveAmount: number;
  method: 'bank' | 'paypal' | 'payoneer' | 'momo';
  details: {
    // Bank transfer details
    country?: string;
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    swift?: string;
    iban?: string;
    currency?: string;
    // PayPal details
    email?: string;
    // Payoneer details
    payoneerEmail?: string;
    // Mobile money details
    provider?: string;
    phoneNumber?: string;
    accountHolderName?: string;
  };
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

export const generateOtherWithdrawalId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `OWD-${timestamp.toUpperCase()}-${random.toUpperCase()}`;
};

export const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};
