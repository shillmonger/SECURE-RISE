import { Db, Collection, ObjectId } from 'mongodb';
import { sendDepositStatusEmail } from './email';

/**
 * Reusable function to credit user wallet after a successful deposit
 * This is used by both Crypto Deposit approval and Paystack webhook
 */
export const creditWalletAfterDeposit = async ({
  db,
  userId,
  amount,
  username,
  userEmail,
  paymentMethod,
  transactionId,
  approvedBy,
}: {
  db: Db;
  userId: ObjectId;
  amount: number;
  username: string;
  userEmail: string;
  paymentMethod: string;
  transactionId: string;
  approvedBy?: ObjectId;
}) => {
  const usersCollection = db.collection('users');
  const now = new Date();

  // Credit user wallet
  await usersCollection.updateOne(
    { _id: userId },
    {
      $inc: {
        accountBalance: amount,
        totalDeposit: amount,
      },
      $set: { updatedAt: now },
    }
  );

  // Send email notification to user
  await sendDepositStatusEmail(userEmail, {
    username,
    amount,
    paymentMethod,
    transactionId,
    status: 'approved',
  });

  return { success: true };
};
