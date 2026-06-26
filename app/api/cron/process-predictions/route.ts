import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { Prediction } from '@/lib/models/Prediction';
import { sendPredictionResultEmail } from '@/lib/email';

// Helper function to fetch market price from CoinGecko API
async function fetchCryptoPrice(symbol: string): Promise<number | null> {
  try {
    // Map trading symbols to CoinGecko IDs
    const symbolMap: Record<string, string> = {
      'BTCUSDT': 'bitcoin',
      'ETHUSDT': 'ethereum',
      'SOLUSDT': 'solana',
      'BNBUSDT': 'binancecoin',
    };

    const coinId = symbolMap[symbol];
    if (!coinId) return null;

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
    );
    const data = await response.json();
    
    if (data[coinId] && data[coinId].usd) {
      return data[coinId].usd;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
}

// Helper function to determine if prediction was correct
function determinePredictionResult(
  direction: 'BUY' | 'SELL',
  entryPrice: number,
  closePrice: number
): 'won' | 'lost' {
  if (direction === 'BUY') {
    // BUY is correct if close price > entry price
    return closePrice > entryPrice ? 'won' : 'lost';
  } else {
    // SELL is correct if close price < entry price
    return closePrice < entryPrice ? 'won' : 'lost';
  }
}

// This endpoint should be called by Vercel Cron Jobs daily at 12:00 AM
export async function GET(request: NextRequest) {
  try {
    // Verify this is a cron job call
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('secure-rise');
    const now = new Date();

    // Get yesterday's date in YYYY-MM-DD format
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Find all pending predictions from yesterday
    const pendingPredictions = await db.collection<Prediction>('predictions')
      .find({
        submissionDate: yesterdayStr,
        status: 'pending',
      })
      .toArray();

    if (pendingPredictions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No pending predictions to process',
        data: {
          processed: 0,
          timestamp: now,
        }
      });
    }

    let processedCount = 0;
    let wonCount = 0;
    let lostCount = 0;
    let totalXPAwarded = 0;

    for (const prediction of pendingPredictions) {
      try {
        // Fetch close price (all pairs are now crypto)
        const closePrice = await fetchCryptoPrice(prediction.pair);

        if (closePrice === null) {
          console.error(`Could not fetch close price for ${prediction.pair}, skipping`);
          continue;
        }

        // Determine if prediction was correct
        const result = determinePredictionResult(
          prediction.direction,
          prediction.entryPrice,
          closePrice
        );

        const xpEarned = result === 'won' ? 1000 : 0;

        // Update prediction
        await db.collection<Prediction>('predictions').updateOne(
          { _id: prediction._id },
          {
            $set: {
              status: result,
              closePrice,
              xpEarned,
              processedAt: now,
              updatedAt: now,
            }
          }
        );

        // If won, award XP to user
        if (result === 'won') {
          // Update user XP
          await db.collection('userxp').updateOne(
            { userId: prediction.userId },
            {
              $inc: { totalXP: xpEarned },
              $set: { updatedAt: now }
            },
            { upsert: true }
          );

          totalXPAwarded += xpEarned;
          wonCount++;
        } else {
          lostCount++;
        }

        // Send email notification to user
        try {
          const user = await db.collection('users').findOne({ _id: prediction.userId });
          if (user && user.email && user.username) {
            await sendPredictionResultEmail(user.email, user.username, {
              pair: prediction.pair,
              direction: prediction.direction,
              entryPrice: prediction.entryPrice,
              closePrice,
              confidence: prediction.confidence,
              status: result,
              xpEarned,
              submissionDate: prediction.submissionDate,
            });
          }
        } catch (emailError) {
          console.error(`Failed to send prediction result email for ${prediction._id}:`, emailError);
          // Don't fail the prediction processing if email fails
        }

        processedCount++;

      } catch (error) {
        console.error(`Error processing prediction ${prediction._id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Predictions processed successfully',
      data: {
        processed: processedCount,
        won: wonCount,
        lost: lostCount,
        totalXPAwarded,
        timestamp: now,
      }
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ 
      error: 'Failed to process predictions' 
    }, { status: 500 });
  }
}

// Also support POST method for testing
export async function POST(request: NextRequest) {
  return GET(request);
}
