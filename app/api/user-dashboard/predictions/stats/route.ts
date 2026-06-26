import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';
import { Prediction } from '@/lib/models/Prediction';

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

    // Fetch all predictions for this user
    const predictions = await db.collection('predictions')
      .find({ userId: new ObjectId(userId) })
      .sort({ submittedAt: -1 })
      .toArray() as Prediction[];

    // Calculate stats
    const totalPredictions = predictions.length;
    const correctPredictions = predictions.filter(p => p.status === 'won').length;
    const incorrectPredictions = predictions.filter(p => p.status === 'lost').length;
    const pendingPredictions = predictions.filter(p => p.status === 'pending').length;
    const totalXPEarned = predictions.reduce((sum, p) => sum + (p.xpEarned || 0), 0);

    // Calculate win rate (only for completed predictions)
    const completedPredictions = correctPredictions + incorrectPredictions;
    const winRate = completedPredictions > 0 
      ? Math.round((correctPredictions / completedPredictions) * 100) 
      : 0;

    // Calculate current streak (consecutive wins)
    let currentStreak = 0;
    for (const prediction of predictions) {
      if (prediction.status === 'won') {
        currentStreak++;
      } else if (prediction.status === 'lost') {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    for (const prediction of predictions) {
      if (prediction.status === 'won') {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else if (prediction.status === 'lost') {
        tempStreak = 0;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalPredictions,
        correctPredictions,
        incorrectPredictions,
        pendingPredictions,
        totalXPEarned,
        winRate,
        currentStreak,
        longestStreak,
      }
    });

  } catch (error) {
    console.error('Error fetching prediction stats:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
