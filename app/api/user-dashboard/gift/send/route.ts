import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { Gift, createGift } from '@/lib/models/Gift';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    
    if (!authUser?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { receiverId, amount } = body;

    if (!receiverId || !amount || parseFloat(amount) <= 0) {
      return NextResponse.json({ 
        error: 'Invalid receiver ID or amount' 
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Start a session for transaction
    const session = client.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Get sender user
        const sender = await db.collection('users').findOne(
          { email: authUser.email },
          { session }
        );

        if (!sender) {
          throw new Error('Sender not found');
        }

        // Check if sender has sufficient balance
        if (sender.accountBalance < parseFloat(amount)) {
          throw new Error('Insufficient balance');
        }

        // Get receiver user
        const receiver = await db.collection('users').findOne(
          { _id: new ObjectId(receiverId) },
          { session }
        );

        if (!receiver) {
          throw new Error('Receiver not found');
        }

        // Generate transaction ID
        const transactionId = `GIFT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Create gift record
        const giftData = createGift({
          senderId: sender._id,
          senderName: sender.fullName || sender.username,
          senderEmail: sender.email,
          receiverId: receiver._id,
          receiverName: receiver.fullName || receiver.username,
          receiverEmail: receiver.email,
          amount: parseFloat(amount)
        });

        const gift: Omit<Gift, '_id'> = {
          ...giftData,
          status: 'completed',
          createdAt: new Date(),
          completedAt: new Date(),
          transactionId
        };

        // Insert gift record
        await db.collection('gifts').insertOne(gift, { session });

        // Update sender's balance (debit)
        await db.collection('users').updateOne(
          { _id: sender._id },
          { 
            $inc: { accountBalance: -parseFloat(amount) },
            $set: { updatedAt: new Date() }
          },
          { session }
        );

        // Update receiver's balance (credit)
        await db.collection('users').updateOne(
          { _id: receiver._id },
          { 
            $inc: { accountBalance: parseFloat(amount) },
            $set: { updatedAt: new Date() }
          },
          { session }
        );

        return {
          success: true,
          transactionId,
          gift: {
            ...gift,
            senderId: sender._id.toString(),
            receiverId: receiver._id.toString()
          }
        };
      });

      // Send emails after successful transaction
      const sender = await db.collection('users').findOne({ email: authUser.email });
      const receiver = await db.collection('users').findOne({ _id: new ObjectId(receiverId) });

      if (sender && receiver) {
        // Import email functions dynamically to avoid circular dependencies
        const { sendGiftDebitEmail, sendGiftCreditEmail } = await import('@/lib/email');
        
        // Send debit email to sender
        await sendGiftDebitEmail(sender.email, {
          senderName: sender.fullName || sender.username,
          receiverName: receiver.fullName || receiver.username,
          amount: parseFloat(amount),
          transactionId: `GIFT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        });

        // Send credit email to receiver
        await sendGiftCreditEmail(receiver.email, {
          senderName: sender.fullName || sender.username,
          receiverName: receiver.fullName || receiver.username,
          amount: parseFloat(amount),
          transactionId: `GIFT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Gift sent successfully!'
      });

    } finally {
      await session.endSession();
    }

  } catch (error: any) {
    console.error('Error sending gift:', error);
    
    let errorMessage = 'Failed to send gift';
    if (error.message === 'Insufficient balance') {
      errorMessage = 'Insufficient account balance';
    } else if (error.message === 'Receiver not found') {
      errorMessage = 'Recipient not found';
    } else if (error.message === 'Sender not found') {
      errorMessage = 'Sender account not found';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
