import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { uploadImage } from '@/lib/cloudinary';
import { sendGiftCardNotificationToAdmins } from '@/lib/email';
import { createGiftCard } from '@/lib/models/GiftCard';
import { ObjectId } from 'mongodb';

async function convertToUSD(amount: number, fromCurrency: string): Promise<number> {
  if (fromCurrency === 'USD') return amount;

  try {
    const response = await fetch(`https://api.frankfurter.app/latest?from=${fromCurrency}&to=USD`);
    const data = await response.json();
    
    if (data.rates && data.rates.USD) {
      return amount * data.rates.USD;
    }
  } catch (error) {
    console.error('Frankfurter API failed, trying backup:', error);
  }

  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    const data = await response.json();
    
    if (data.rates && data.rates.USD) {
      return amount * data.rates.USD;
    }
  } catch (error) {
    console.error('Backup API also failed:', error);
  }

  // Fallback rates
  const fallbackRates: Record<string, number> = {
    EUR: 1.09,
    GBP: 1.27,
    CAD: 0.74,
    AUD: 0.65,
    JPY: 0.0067,
    SGD: 0.75,
    AED: 0.27,
    SEK: 0.096,
    CHF: 1.14,
  };

  const rate = fallbackRates[fromCurrency];
  if (rate) {
    return amount * rate;
  }

  // If no rate found, return original amount (assume USD)
  return amount;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const cardType = formData.get('cardType') as string;
    const country = formData.get('country') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const currency = formData.get('currency') as string;
    const code = formData.get('code') as string;
    const frontFile = formData.get('frontImage') as File;
    const backFile = formData.get('backImage') as File;
    const description = formData.get('description') as string;
    const userId = formData.get('userId') as string;
    const username = formData.get('username') as string;
    const userEmail = formData.get('userEmail') as string;

    // Validate required fields
    if (!cardType || !country || !amount || !currency || !code || !frontFile || !backFile || !userId || !username || !userEmail) {
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
    const validCardTypes = ['Apple', 'Amazon', 'Steam', 'Google Play', 'Razer Gold', 'Xbox'];
    if (!validCardTypes.includes(cardType)) {
      return NextResponse.json(
        { error: 'Invalid gift card type' },
        { status: 400 }
      );
    }

    // Validate country
    const validCountries = [
      'USA', 'UK', 'Canada', 'Australia',
      'Germany', 'France', 'Netherlands', 'Italy', 'Spain',
      'Ireland', 'Switzerland', 'Sweden',
      'UAE', 'Japan', 'Singapore'
    ];
    if (!validCountries.includes(country)) {
      return NextResponse.json(
        { error: 'Invalid country' },
        { status: 400 }
      );
    }

    // Upload front and back images to Cloudinary
    const frontBytes = await frontFile.arrayBuffer();
    const frontBuffer = Buffer.from(frontBytes);
    const frontCloudinaryResult = await uploadImage(frontBuffer, 'gift-card-proofs');

    const backBytes = await backFile.arrayBuffer();
    const backBuffer = Buffer.from(backBytes);
    const backCloudinaryResult = await uploadImage(backBuffer, 'gift-card-proofs');

    // Convert amount to USD
    const usdAmount = await convertToUSD(amount, currency);
    
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
      usdAmount,
      code,
      frontImage: frontCloudinaryResult.secure_url,
      backImage: backCloudinaryResult.secure_url,
      description: description || undefined,
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
      cardImage: frontCloudinaryResult.secure_url,
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
