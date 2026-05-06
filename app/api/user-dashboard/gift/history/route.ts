import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    
    if (!authUser?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Get current user
    const user = await db.collection('users').findOne({ email: authUser.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch gift history where user is either sender or receiver
    const gifts = await db.collection('gifts')
      .find({
        $or: [
          { senderId: user._id },
          { receiverId: user._id }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    // Format gifts for display
    const formattedGifts = gifts.map(gift => {
      const isSender = gift.senderId.toString() === user._id.toString();
      
      return {
        _id: gift._id,
        type: 'gift',
        isSender,
        senderId: gift.senderId.toString(),
        senderName: gift.senderName,
        senderEmail: gift.senderEmail,
        receiverId: gift.receiverId.toString(),
        receiverName: gift.receiverName,
        receiverEmail: gift.receiverEmail,
        amount: gift.amount,
        status: gift.status,
        createdAt: gift.createdAt,
        completedAt: gift.completedAt,
        transactionId: gift.transactionId,
        // Display fields
        title: isSender ? 'Gift Sent' : 'Gift Received',
        subtitle: isSender ? `To ${gift.receiverName}` : `From ${gift.senderName}`,
        amountDisplay: isSender ? `-$${gift.amount.toFixed(2)}` : `+$${gift.amount.toFixed(2)}`,
        amountColor: isSender ? 'text-red-500' : 'text-green-500',
        message: isSender 
          ? `You sent $${gift.amount.toFixed(2)} to ${gift.receiverName} as a gift`
          : `You received $${gift.amount.toFixed(2)} from ${gift.senderName} as a gift`
      };
    });

    return NextResponse.json({
      success: true,
      gifts: formattedGifts
    });
  } catch (error) {
    console.error('Error fetching gift history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gift history' },
      { status: 500 }
    );
  }
}
