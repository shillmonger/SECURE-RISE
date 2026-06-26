import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';
import { Prediction, createPrediction } from '@/lib/models/Prediction';

// GET - Check if user has submitted today and get current prediction
export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No auth token found' },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db('secure-rise');

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Check if user has submitted a prediction today
    const todayPrediction = await db.collection('predictions').findOne({
      userId: new ObjectId(userId),
      submissionDate: today,
    }) as Prediction | null;

    return NextResponse.json({
      success: true,
      data: {
        hasSubmittedToday: !!todayPrediction,
        todayPrediction: todayPrediction ? {
          pair: todayPrediction.pair,
          direction: todayPrediction.direction,
          entryPrice: todayPrediction.entryPrice,
          confidence: todayPrediction.confidence,
          status: todayPrediction.status,
          submittedAt: todayPrediction.submittedAt,
        } : null,
      }
    });

  } catch (error) {
    console.error('Error checking prediction status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Submit a new prediction
export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No auth token found' },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { pair, direction, entryPrice, confidence } = body;

    // Validate required fields
    if (!pair || !direction || !entryPrice || !confidence) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate direction
    if (direction !== 'BUY' && direction !== 'SELL') {
      return NextResponse.json(
        { success: false, message: 'Invalid direction' },
        { status: 400 }
      );
    }

    // Validate confidence
    if (!['Low', 'Medium', 'High'].includes(confidence)) {
      return NextResponse.json(
        { success: false, message: 'Invalid confidence level' },
        { status: 400 }
      );
    }

    // Validate entry price
    const parsedEntryPrice = parseFloat(entryPrice);
    if (isNaN(parsedEntryPrice) || parsedEntryPrice <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid entry price' },
        { status: 400 }
      );
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db('secure-rise');

    // Check if user has already submitted today
    const today = new Date().toISOString().split('T')[0];
    const existingPrediction = await db.collection('predictions').findOne({
      userId: new ObjectId(userId),
      submissionDate: today,
    });

    if (existingPrediction) {
      return NextResponse.json(
        { success: false, message: 'Already submitted prediction for today' },
        { status: 400 }
      );
    }

    // Create new prediction
    const predictionData = createPrediction({
      userId: new ObjectId(userId),
      pair,
      direction,
      entryPrice: parsedEntryPrice,
      confidence,
    });

    const result = await db.collection('predictions').insertOne({
      ...predictionData,
      status: 'pending',
      xpEarned: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Prediction submitted successfully',
      data: {
        predictionId: result.insertedId,
        pair,
        direction,
        entryPrice: parsedEntryPrice,
        confidence,
        submissionDate: today,
      }
    });

  } catch (error) {
    console.error('Error submitting prediction:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
