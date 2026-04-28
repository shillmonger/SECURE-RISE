import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { User } from '@/lib/models/User';

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

    if (!decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db('secure-rise');
    const usersCollection = db.collection('users');

    // Check if user is admin
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) }) as User;
    
    if (!user || !user.role.includes('admin')) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    // Get dashboard statistics
    const totalUsers = await usersCollection.countDocuments({ role: 'user' });
    const activeUsers = await usersCollection.countDocuments({ role: 'user', isActive: true });
    const blockedUsers = await usersCollection.countDocuments({ role: 'user', isActive: false });

    // Calculate financial statistics
    const financialStats = await usersCollection.aggregate([
      { $match: { role: 'user' } },
      {
        $group: {
          _id: null,
          totalDeposit: { $sum: '$totalDeposit' },
          totalWithdrawal: { $sum: '$totalWithdrawal' },
          totalProfits: { $sum: '$totalProfits' },
          accountBalance: { $sum: '$accountBalance' }
        }
      }
    ]).toArray();

    const stats = financialStats[0] || {
      totalDeposit: 0,
      totalWithdrawal: 0,
      totalProfits: 0,
      accountBalance: 0
    };

    // Get recent transactions (mock data for now)
    const recentTransactions = [
      {
        id: 'TXN001',
        type: 'Deposit',
        amount: 1000.00,
        status: 'Approved',
        user: 'John Doe',
        email: 'john@example.com',
        paymentMethod: 'Bitcoin',
        createdAt: new Date().toISOString()
      },
      {
        id: 'TXN002',
        type: 'Withdrawal',
        amount: 500.00,
        status: 'Pending',
        user: 'Jane Smith',
        email: 'jane@example.com',
        paymentMethod: 'Ethereum',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];

    // Format stats for frontend
    const formattedStats = [
      { label: "Total Users", value: totalUsers.toString(), icon: "Users", color: "text-blue-500", bg: "bg-blue-500/10" },
      { label: "Active Users", value: activeUsers.toString(), icon: "UserCheck", color: "text-teal-500", bg: "bg-teal-500/10" },
      { label: "Blocked Users", value: blockedUsers.toString(), icon: "UserMinus", color: "text-red-500", bg: "bg-red-500/10" },
      { label: "Investment Plans", value: "0", icon: "Layers", color: "text-purple-500", bg: "bg-purple-500/10" },
      { label: "Total Deposit", value: `$${stats.totalDeposit.toFixed(2)}`, icon: "TrendingUp", color: "text-teal-500", bg: "bg-teal-500/10" },
      { label: "Pending Deposit", value: "$0", icon: "Clock", color: "text-orange-500", bg: "bg-orange-500/10" },
      { label: "Total Withdrawal", value: `$${stats.totalWithdrawal.toFixed(2)}`, icon: "ArrowDownLeft", color: "text-primary", bg: "bg-primary/10" },
      { label: "Pending Withdrawal", value: "$0", icon: "ArrowUpRight", color: "text-red-500", bg: "bg-red-500/10" },
    ];

    return NextResponse.json({
      success: true,
      stats: formattedStats,
      recentTransactions
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
