import { ObjectId } from 'mongodb';

export interface GiftCard {
  _id?: ObjectId;
  userId: ObjectId;
  username: string;
  userEmail: string;
  cardType: string; // Apple, Amazon, Steam, Google Play, Razer Gold
  country: string; // USA, UK, Canada, Australia
  amount: number;
  currency: string; // USD, GBP, CAD, AUD
  code: string; // Gift card code
  cardImage?: string; // Cloudinary URL
  status: 'pending_review' | 'processing' | 'approved' | 'rejected';
  rejectionReason?: string;
  transactionId?: string; // Unique transaction ID
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  approvedBy?: ObjectId; // Admin who approved
  rejectedAt?: Date;
  rejectedBy?: ObjectId; // Admin who rejected
}

export const createGiftCard = (giftCardData: {
  userId: ObjectId;
  username: string;
  userEmail: string;
  cardType: string;
  country: string;
  amount: number;
  currency: string;
  code: string;
  cardImage?: string;
}): Omit<GiftCard, '_id' | 'createdAt' | 'updatedAt' | 'approvedAt' | 'approvedBy' | 'rejectedAt' | 'rejectedBy'> => {
  return {
    userId: giftCardData.userId,
    username: giftCardData.username,
    userEmail: giftCardData.userEmail,
    cardType: giftCardData.cardType,
    country: giftCardData.country,
    amount: giftCardData.amount,
    currency: giftCardData.currency,
    code: giftCardData.code,
    cardImage: giftCardData.cardImage,
    status: 'pending_review',
    transactionId: `GC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  };
};
