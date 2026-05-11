import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { uploadImage } from '@/lib/cloudinary';
import { sendGiftCardNotificationToAdmins } from '@/lib/email';
import { createGiftCard } from '@/lib/models/GiftCard';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const cardType = formData.get('cardType') as string;
    const country = formData.get('country') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const currency = formData.get('currency') as string;
    const code = formData.get('code') as string;
    const file = formData.get('cardImage') as File;
    const userId = formData.get('userId') as string;
    const username = formData.get('username') as string;
    const userEmail = formData.get('userEmail') as string;

    // Validate required fields
    if (!cardType || !country || !amount || !currency || !code || !file || !userId || !username || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Validate card type
    const validCardTypes = ['Apple', 'Amazon', 'Steam', 'Google Play', 'Razer Gold'];
    if (!validCardTypes.includes(cardType)) {
      return NextResponse.json(
        { error: 'Invalid gift card type' },
        { status: 400 }
      );
    }

    // Validate country
    const validCountries = ['USA', 'UK', 'Canada', 'Australia'];
    if (!validCountries.includes(country)) {
      return NextResponse.json(
        { error: 'Invalid country' },
        { status: 400 }
      );
    }

    // Upload card image to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const cloudinaryResult = await uploadImage(buffer, 'gift-card-proofs');
    
    // Connect to database
    const db = await connectToDatabase();
    const giftCardsCollection = db.collection('giftcards');

    // Create gift card record
    const giftCardData = createGiftCard({
      userId: new ObjectId(userId),
      username,
      userEmail,
      cardType,
      country,
      amount,
      currency,
      code,
      cardImage: cloudinaryResult.secure_url,
    });

    const result = await giftCardsCollection.insertOne({
      ...giftCardData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Send email notification to all admins
    await sendGiftCardNotificationToAdmins({
      giftCardId: result.insertedId.toString(),
      username,
      userEmail,
      cardType,
      country,
      amount,
      currency,
      code,
      cardImage: cloudinaryResult.secure_url,
      transactionId: giftCardData.transactionId!,
    });

    
    return NextResponse.json({
      success: true,
      message: 'Gift card submitted successfully',
      giftCardId: result.insertedId.toString(),
      transactionId: giftCardData.transactionId,
    });

  } catch (error) {
    console.error('Gift card submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit gift card' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await connectToDatabase();
    const giftCardsCollection = db.collection('giftcards');

    // Get user's gift cards
    const giftCards = await giftCardsCollection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
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
