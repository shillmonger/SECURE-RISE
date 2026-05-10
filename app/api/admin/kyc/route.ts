import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('secure-rise');
    
    // Fetch all KYC submissions
    const kycCollection = db.collection('kyc');
    const kycSubmissions = await kycCollection.find({}).sort({ createdAt: -1 }).toArray();
    
    // Fetch user data for each KYC submission
    const usersCollection = db.collection('users');
    const enrichedSubmissions = await Promise.all(
      kycSubmissions.map(async (kyc: any) => {
        try {
          // Find the user who submitted this KYC
          const user = await usersCollection.findOne(
            { _id: new ObjectId(kyc.userId) },
            { 
              projection: { 
                _id: 1, 
                username: 1, 
                email: 1, 
                profileImage: 1,
                fullName: 1
              } 
            }
          );
          
          return {
            ...kyc,
            _id: kyc._id.toString(),
            userId: kyc.userId.toString(),
            userProfile: user ? {
              _id: user._id.toString(),
              username: user.username || 'Unknown',
              email: user.email || 'Unknown',
              profileImage: user.profileImage || 'https://github.com/shadcn.png',
              fullName: user.fullName || `${kyc.firstName} ${kyc.lastName}`
            } : {
              _id: kyc.userId,
              username: 'Unknown',
              email: 'Unknown',
              profileImage: 'https://github.com/shadcn.png',
              fullName: `${kyc.firstName} ${kyc.lastName}`
            }
          };
        } catch (error) {
          console.error('Error fetching user for KYC:', kyc.userId, error);
          return {
            ...kyc,
            _id: kyc._id.toString(),
            userId: kyc.userId.toString(),
            userProfile: {
              _id: kyc.userId,
              username: 'Unknown',
              email: 'Unknown',
              profileImage: 'https://github.com/shadcn.png',
              fullName: `${kyc.firstName} ${kyc.lastName}`
            }
          };
        }
      })
    );
    
    return NextResponse.json({
      success: true,
      kycSubmissions: enrichedSubmissions
    });
    
  } catch (error) {
    console.error('Error fetching KYC submissions:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch KYC submissions' 
      },
      { status: 500 }
    );
  }
}
