import { ObjectId } from 'mongodb';

export interface Gift {
  _id?: ObjectId;
  senderId: ObjectId;
  senderName: string;
  senderEmail: string;
  receiverId: ObjectId;
  receiverName: string;
  receiverEmail: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  transactionId?: string;
  errorMessage?: string;
}

export const createGift = (giftData: {
  senderId: ObjectId;
  senderName: string;
  senderEmail: string;
  receiverId: ObjectId;
  receiverName: string;
  receiverEmail: string;
  amount: number;
}): Omit<Gift, '_id' | 'createdAt' | 'status'> => {
  return {
    senderId: giftData.senderId,
    senderName: giftData.senderName,
    senderEmail: giftData.senderEmail,
    receiverId: giftData.receiverId,
    receiverName: giftData.receiverName,
    receiverEmail: giftData.receiverEmail,
    amount: giftData.amount,
  };
};
