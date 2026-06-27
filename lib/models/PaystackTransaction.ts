import { ObjectId } from 'mongodb';

export interface PaystackTransaction {
  _id?: ObjectId;
  userId: ObjectId;
  username: string;
  userEmail: string;
  usdAmount: number; // Amount in USD (what user enters)
  ngnAmount: number; // Amount in NGN (what Paystack processes)
  exchangeRate: number; // USD to NGN exchange rate used
  currency: string; // Always "USD"
  paymentCurrency: string; // Always "NGN"
  paymentMethod: string; // 'Paystack Card Payment'
  status: 'pending' | 'success' | 'failed' | 'processed';
  reference: string; // Paystack reference
  paystackReference?: string; // Paystack transaction reference
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
  usdAmount: number;
  ngnAmount: number;
  exchangeRate: number;
  reference: string;
  authorizationUrl?: string;
}): Omit<PaystackTransaction, '_id' | 'createdAt' | 'updatedAt' | 'processedAt' | 'errorMessage' | 'paystackTransactionId' | 'customerCode' | 'paystackReference' | 'metadata'> => {
  return {
    userId: transactionData.userId,
    username: transactionData.username,
    userEmail: transactionData.userEmail,
    usdAmount: transactionData.usdAmount,
    ngnAmount: transactionData.ngnAmount,
    exchangeRate: transactionData.exchangeRate,
    currency: 'USD',
    paymentCurrency: 'NGN',
    paymentMethod: 'Paystack Card Payment',
    status: 'pending',
    reference: transactionData.reference,
    authorizationUrl: transactionData.authorizationUrl,
    transactionId: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  };
};
