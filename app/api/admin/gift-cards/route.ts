import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Connect to database
    const db = await connectToDatabase();
    const giftCardsCollection = db.collection('giftcards');

    // Build query based on status filter
    const query: any = {};
    if (status) {
      query.status = status;
    }

    // Get gift cards with user details
    const giftCards = await giftCardsCollection
      .aggregate([
        {
          $match: query
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
            pipeline: [
              {
                $project: {
                  _id: 1,
                  username: 1,
                  email: 1,
                  profileImage: 1,
                  fullName: 1
                }
              }
            ]
          }
        },
        {
          $unwind: '$user'
        },
        {
          $addFields: {
            userId: '$user'
          }
        },
        {
          $project: {
            user: 0
          }
        }
      ])
      .toArray();

    return NextResponse.json({
      success: true,
      giftCards,
    });

  } catch (error) {
    console.error('Get gift cards error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gift cards' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { giftCardId, action, rejectionReason } = body;

    if (!giftCardId || !action) {
      return NextResponse.json(
        { error: 'Gift card ID and action are required' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await connectToDatabase();
    const giftCardsCollection = db.collection('giftcards');
    const usersCollection = db.collection('users');

    const giftCard = await giftCardsCollection.findOne({ _id: new ObjectId(giftCardId) });

    if (!giftCard) {
      return NextResponse.json(
        { error: 'Gift card not found' },
        { status: 404 }
      );
    }

    // Update gift card status
    const updateData: any = {
      updatedAt: new Date(),
      [action]: true,
    };

    if (action === 'approve') {
      console.log('Processing approval for gift card:', giftCardId);
      console.log('Gift card details:', giftCard);
      
      updateData.approvedAt = new Date();
      updateData.status = 'approved';
      
      // Update user balance with USD amount (fallback to amount for backward compatibility)
      const amountToCredit = giftCard.usdAmount || giftCard.amount;
      console.log('Updating user balance for userId:', giftCard.userId, 'usdAmount:', amountToCredit);
      const balanceUpdate = await usersCollection.updateOne(
        { _id: giftCard.userId },
        { 
          $inc: { accountBalance: amountToCredit },
          $set: { updatedAt: new Date() }
        }
      );
      console.log('Balance update result:', balanceUpdate);

      // Send approval email to user
      const user = await usersCollection.findOne({ _id: giftCard.userId });
      console.log('Found user for email:', user);
      if (user) {
        try {
          const { sendGiftCardStatusEmail } = await import('@/lib/email');
          await sendGiftCardStatusEmail(user.email, {
            username: user.username,
            cardType: giftCard.cardType,
            amount: giftCard.amount,
            currency: giftCard.currency,
            transactionId: giftCard.transactionId,
            status: 'approved',
            usdAmount: giftCard.usdAmount
          });
          console.log('Email sent successfully to:', user.email);
        } catch (emailError) {
          console.error('Error sending email:', emailError);
        }
      }
    } else if (action === 'reject') {
      updateData.rejectedAt = new Date();
      updateData.status = 'rejected';
      updateData.rejectionReason = rejectionReason || 'Gift card rejected by admin';

      // Send rejection email to user
      const user = await usersCollection.findOne({ _id: giftCard.userId });
      if (user) {
        const { sendGiftCardStatusEmail } = await import('@/lib/email');
        await sendGiftCardStatusEmail(user.email, {
          username: user.username,
          cardType: giftCard.cardType,
          amount: giftCard.amount,
          currency: giftCard.currency,
          transactionId: giftCard.transactionId,
          status: 'rejected',
          rejectionReason
        });
      }
    }

    await giftCardsCollection.updateOne(
      { _id: new ObjectId(giftCardId) },
      { $set: updateData }
    );

    return NextResponse.json({
      success: true,
      message: `Gift card ${action}d successfully`,
    });

  } catch (error) {
    console.error('Update gift card error:', error);
    return NextResponse.json(
      { error: 'Failed to update gift card' },
      { status: 500 }
    );
  }
}
