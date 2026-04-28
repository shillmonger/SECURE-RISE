import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { uploadImage } from '@/lib/cloudinary';
import { sendDepositNotificationToAdmins } from '@/lib/email';
import { createDeposit } from '@/lib/models/Deposit';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const amount = parseFloat(formData.get('amount') as string);
    const paymentMethod = formData.get('paymentMethod') as string;
    const file = formData.get('proofImage') as File;
    const userId = formData.get('userId') as string;
    const username = formData.get('username') as string;
    const userEmail = formData.get('userEmail') as string;

    // Validate required fields
    if (!amount || !paymentMethod || !file || !userId || !username || !userEmail) {
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

    // Upload proof image to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const cloudinaryResult = await uploadImage(buffer, 'deposit-proofs');
    
    // Connect to database
    const db = await connectToDatabase();
    const depositsCollection = db.collection('deposits');

    // Create deposit record
    const depositData = createDeposit({
      userId: new ObjectId(userId),
      username,
      userEmail,
      amount,
      paymentMethod,
      proofImage: cloudinaryResult.secure_url,
    });

    const result = await depositsCollection.insertOne({
      ...depositData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Send email notification to all admins
    await sendDepositNotificationToAdmins({
      depositId: result.insertedId.toString(),
      username,
      userEmail,
      amount,
      paymentMethod,
      proofImage: cloudinaryResult.secure_url,
      transactionId: depositData.transactionId!,
    });

    return NextResponse.json({
      success: true,
      message: 'Deposit submitted successfully',
      depositId: result.insertedId.toString(),
      transactionId: depositData.transactionId,
    });

  } catch (error) {
    console.error('Deposit submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit deposit' },
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
    const depositsCollection = db.collection('deposits');

    // Get user's deposits
    const deposits = await depositsCollection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      deposits,
    });

  } catch (error) {
    console.error('Get deposits error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deposits' },
      { status: 500 }
    );
  }
}
