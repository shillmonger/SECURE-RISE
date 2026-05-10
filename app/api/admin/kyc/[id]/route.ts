import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { sendKYCStatusEmail } from '@/lib/email';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, rejectionReason } = body;

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('secure-rise');
    const kycCollection = db.collection('kyc');

    // Update KYC status
    const updateData: any = {
      status: action === 'approve' ? 'approved' : 'rejected',
      updatedAt: new Date(),
      reviewedAt: new Date()
    };

    if (action === 'reject' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const result = await kycCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'KYC submission not found' },
        { status: 404 }
      );
    }

    // Fetch KYC data to get user email
    const kycData = await kycCollection.findOne({ _id: new ObjectId(id) });
    if (!kycData) {
      return NextResponse.json(
        { success: false, error: 'KYC data not found' },
        { status: 404 }
      );
    }

    // Send email notification to user
    try {
      await sendKYCStatusEmail(
        kycData.userEmail,
        kycData.username || `${kycData.firstName} ${kycData.lastName}`,
        action === 'approve' ? 'approved' : 'rejected',
        rejectionReason
      );
    } catch (emailError) {
      console.error('Error sending KYC status email:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      message: `KYC submission ${action}d successfully`,
      status: action === 'approve' ? 'approved' : 'rejected'
    });

  } catch (error) {
    console.error('Error updating KYC status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update KYC status' },
      { status: 500 }
    );
  }
}
