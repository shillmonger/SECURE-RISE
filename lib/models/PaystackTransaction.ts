import { ObjectId } from 'mongodb';

export interface PaystackTransaction {
  _id?: ObjectId;
  userId: ObjectId;
  username: string;
  userEmail: string;
  amount: number; // Amount in Naira
  paymentMethod: string; // 'Paystack Bank Transfer'
  status: 'pending' | 'success' | 'failed' | 'processed';
  reference: string; // Paystack reference
  authorizationUrl?: string; // Paystack authorization URL
  paystackTransactionId?: string; // Paystack transaction ID
  customerCode?: string; // Paystack customer code
  transactionId: string; // Internal transaction ID
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
  errorMessage?: string;
  metadata?: {
    [key: string]: any;
  };
}

export const createPaystackTransaction = (transactionData: {
  userId: ObjectId;
  username: string;
  userEmail: string;
  amount: number;
  reference: string;
  authorizationUrl?: string;
}): Omit<PaystackTransaction, '_id' | 'createdAt' | 'updatedAt' | 'processedAt' | 'errorMessage' | 'paystackTransactionId' | 'customerCode' | 'metadata'> => {
  return {
    userId: transactionData.userId,
    username: transactionData.username,
    userEmail: transactionData.userEmail,
    amount: transactionData.amount,
    paymentMethod: 'Paystack Bank Transfer',
    status: 'pending',
    reference: transactionData.reference,
    authorizationUrl: transactionData.authorizationUrl,
    transactionId: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  };
};
