import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getAuthUser } from '@/lib/auth';
import { sendBroadcastEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipients, subject, body } = await request.json();

    if (!subject || !body) {
      return NextResponse.json({ error: 'Subject and body are required' }, { status: 400 });
    }

    if (!recipients || (Array.isArray(recipients) && recipients.length === 0)) {
      return NextResponse.json({ error: 'At least one recipient is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Verify user is admin
    const user = await usersCollection.findOne({ email: authUser.email });
    if (!user || !user.role?.includes('admin')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    let recipientEmails: string[] = [];
    let recipientCount = 0;

    if (recipients === 'all') {
      // Get all users
      const allUsers = await usersCollection.find({}, { projection: { email: 1, username: 1, fullName: 1 } }).toArray();
      recipientEmails = allUsers.map((u: any) => u.email);
      recipientCount = allUsers.length;
    } else {
      // Get specific users by IDs
      const users = await usersCollection.find({ _id: { $in: recipients } }, { projection: { email: 1, username: 1, fullName: 1 } }).toArray();
      recipientEmails = users.map((u: any) => u.email);
      recipientCount = users.length;
    }

    if (recipientEmails.length === 0) {
      return NextResponse.json({ error: 'No valid recipients found' }, { status: 404 });
    }

    // Send broadcast email
    await sendBroadcastEmail(recipientEmails, subject, body);

    return NextResponse.json({ 
      message: `Email sent to ${recipientCount} recipient(s)`,
      recipientCount 
    });
  } catch (error) {
    console.error('Error sending broadcast email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
