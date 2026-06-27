import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { User } from '@/lib/models/User';
import { Target, CreditCard, TrendingUp, Zap } from 'lucide-react';

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

    // Get real deposit transactions
    const depositsCollection = db.collection('deposits');
    const deposits = await depositsCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    // Calculate pending deposits amount
    const pendingDepositsData = await depositsCollection.find({ status: 'pending' }).toArray();
    const pendingDepositsTotal = pendingDepositsData.reduce((sum, deposit) => sum + deposit.amount, 0);

    // Get user information for deposits
    const userIds = deposits.map(d => d.userId);
    const users = await usersCollection.find({ _id: { $in: userIds } }).toArray();
    const userMap: { [key: string]: any } = {};
    users.forEach(user => {
      userMap[user._id.toString()] = user;
    });

    // Get withdrawal transactions
    const withdrawalsCollection = db.collection('withdrawals');
    const withdrawals = await withdrawalsCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    // Calculate pending withdrawals amount
    const pendingWithdrawalsData = await withdrawalsCollection.find({ status: 'pending' }).toArray();
    const pendingWithdrawalsTotal = pendingWithdrawalsData.reduce((sum, withdrawal) => sum + withdrawal.amount, 0);

    // Calculate total approved withdrawals (payouts)
    const approvedWithdrawalsData = await withdrawalsCollection.find({ status: 'approved' }).toArray();
    const totalPayout = approvedWithdrawalsData.reduce((sum, withdrawal) => sum + withdrawal.amount, 0);

    // Get user information for withdrawals
    const withdrawalUserIds = withdrawals.map(w => w.userId);
    const withdrawalUsers = await usersCollection.find({ _id: { $in: withdrawalUserIds } }).toArray();
    const withdrawalUserMap: { [key: string]: any } = {};
    withdrawalUsers.forEach(user => {
      withdrawalUserMap[user._id.toString()] = user;
    });

    // Format withdrawal transactions
    const withdrawalTransactions = withdrawals.map(withdrawal => {
      const user = withdrawalUserMap[withdrawal.userId.toString()];
      const method = withdrawal.crypto?.symbol || withdrawal.method || 'Unknown';
      return {
        id: withdrawal.withdrawalId || withdrawal._id.toString(),
        type: `Withdrawal - ${method}`,
        amount: withdrawal.amount,
        status: withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1),
        user: user?.fullName || user?.username || 'Unknown User',
        email: user?.email || 'unknown@example.com',
        paymentMethod: method,
        createdAt: withdrawal.createdAt
      };
    });

    // Format deposit transactions
    const depositTransactions = deposits.map(deposit => {
      const user = userMap[deposit.userId.toString()];
      const method = deposit.paymentMethod || 'Unknown';
      let transactionType = 'Deposit';
      
      // Determine specific type based on payment method
      if (method.toLowerCase().includes('crypto') || method.toLowerCase().includes('usdt') || method.toLowerCase().includes('btc') || method.toLowerCase().includes('eth')) {
        transactionType = 'Crypto Deposit';
      } else if (method.toLowerCase().includes('bank') || method.toLowerCase().includes('transfer')) {
        transactionType = 'Bank Transfer';
      } else if (method.toLowerCase().includes('paystack')) {
        transactionType = 'Card Payment';
      } else {
        transactionType = `Deposit - ${method}`;
      }
      
      return {
        id: deposit.transactionId || deposit._id.toString(),
        type: transactionType,
        amount: deposit.amount,
        status: deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1),
        user: user?.fullName || user?.username || 'Unknown User',
        email: user?.email || 'unknown@example.com',
        paymentMethod: method,
        createdAt: deposit.createdAt
      };
    });

    // Get investment plans count
    const investmentsCollection = db.collection('investments');
    const investmentPlansCount = await investmentsCollection.countDocuments();

    // Get KYC submissions count
    const kycCollection = db.collection('kyc');
    const totalKycSubmissions = await kycCollection.countDocuments();

    // Get total gifts count
    const giftsCollection = db.collection('gifts');
    const totalGifts = await giftsCollection.countDocuments();

    // Get gift cards statistics
    const giftCardsCollection = db.collection('giftcards');
    const pendingGiftCards = await giftCardsCollection.countDocuments({ status: 'pending_review' });
    const approvedGiftCards = await giftCardsCollection.countDocuments({ status: 'approved' });
    const rejectedGiftCards = await giftCardsCollection.countDocuments({ status: 'rejected' });

    // Get recent gift cards transactions
    const recentGiftCards = await giftCardsCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    // Get user information for gift cards
    const giftCardUserIds = recentGiftCards.map(g => g.userId);
    const giftCardUsers = await usersCollection.find({ _id: { $in: giftCardUserIds } }).toArray();
    const giftCardUserMap: { [key: string]: any } = {};
    giftCardUsers.forEach(user => {
      giftCardUserMap[user._id.toString()] = user;
    });

    // Format gift card transactions
    const giftCardTransactions = recentGiftCards.map(giftCard => {
      const user = giftCardUserMap[giftCard.userId.toString()];
      return {
        id: giftCard.transactionId,
        type: `Gift Card - ${giftCard.cardType}`,
        amount: giftCard.amount,
        status: giftCard.status.charAt(0).toUpperCase() + giftCard.status.slice(1),
        user: user?.fullName || user?.username || 'Unknown User',
        email: user?.email || 'unknown@example.com',
        paymentMethod: `${giftCard.cardType} (${giftCard.country})`,
        createdAt: giftCard.createdAt
      };
    });

    // Get user achievements count
    const userAchievementsCollection = db.collection('userachievements');
    const totalUserAchievements = await userAchievementsCollection.countDocuments();

    // Get total user XP
    const userXpCollection = db.collection('userxp');
    const userXpStats = await userXpCollection.aggregate([
      {
        $group: {
          _id: null,
          totalXP: { $sum: '$totalXP' }
        }
      }
    ]).toArray();
    const totalUserXP = userXpStats[0]?.totalXP || 0;

    // Get XP redemption statistics
    const xpRedemptionCollection = db.collection('xpredemptions');
    
    // Total completed redemptions
    const totalRedeemed = await xpRedemptionCollection.countDocuments({ status: 'completed' });
    
    // Total USDT redeemed (sum of usdtAmount for completed redemptions)
    const usdtRedeemedStats = await xpRedemptionCollection.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalUSDT: { $sum: '$usdtAmount' }
        }
      }
    ]).toArray();
    const totalUSDTRedeemed = usdtRedeemedStats[0]?.totalUSDT || 0;
    
    // Total XP redeemed (sum of xpAmount for completed redemptions)
    const xpRedeemedStats = await xpRedemptionCollection.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalXP: { $sum: '$xpAmount' }
        }
      }
    ]).toArray();
    const totalXPRedeemed = xpRedeemedStats[0]?.totalXP || 0;
    
    // Total Daily XP (sum of xpAmount where xpType is 'daily')
    const dailyXPStats = await xpRedemptionCollection.aggregate([
      { $match: { status: 'completed', xpType: 'daily' } },
      {
        $group: {
          _id: null,
          totalDailyXP: { $sum: '$xpAmount' }
        }
      }
    ]).toArray();
    const totalDailyXP = dailyXPStats[0]?.totalDailyXP || 0;
    
    // Total Achievements XP (sum of xpAmount where xpType is 'achievement')
    const achievementXPStats = await xpRedemptionCollection.aggregate([
      { $match: { status: 'completed', xpType: 'achievement' } },
      {
        $group: {
          _id: null,
          totalAchievementXP: { $sum: '$xpAmount' }
        }
      }
    ]).toArray();
    const totalAchievementXP = achievementXPStats[0]?.totalAchievementXP || 0;

    // Get Predictions statistics
    const predictionsCollection = db.collection('predictions');
    const totalPredictions = await predictionsCollection.countDocuments();
    const wonPredictions = await predictionsCollection.countDocuments({ status: 'won' });
    const lostPredictions = await predictionsCollection.countDocuments({ status: 'lost' });
    const pendingPredictions = await predictionsCollection.countDocuments({ status: 'pending' });

    // Total XP earned from predictions
    const predictionXPStats = await predictionsCollection.aggregate([
      {
        $group: {
          _id: null,
          totalXPEarned: { $sum: '$xpEarned' }
        }
      }
    ]).toArray();
    const totalPredictionXP = predictionXPStats[0]?.totalXPEarned || 0;

    // Get Paystack transaction statistics
    const paystackCollection = db.collection('paystackTransactions');
    const totalPaystackTransactions = await paystackCollection.countDocuments();
    const processedPaystackTransactions = await paystackCollection.countDocuments({ status: 'processed' });
    const pendingPaystackTransactions = await paystackCollection.countDocuments({ status: 'pending' });

    // Total USD amount from Paystack
    const paystackUSDStats = await paystackCollection.aggregate([
      {
        $group: {
          _id: null,
          totalUSD: { $sum: '$usdAmount' }
        }
      }
    ]).toArray();
    const totalPaystackUSD = paystackUSDStats[0]?.totalUSD || 0;

    // Total NGN amount from Paystack
    const paystackNGNStats = await paystackCollection.aggregate([
      {
        $group: {
          _id: null,
          totalNGN: { $sum: '$ngnAmount' }
        }
      }
    ]).toArray();
    const totalPaystackNGN = paystackNGNStats[0]?.totalNGN || 0;

    // Get recent Paystack transactions
    const recentPaystackTransactions = await paystackCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();
    console.log('Paystack transactions fetched:', recentPaystackTransactions.length);

    // Get user information for Paystack transactions
    const paystackUserIds = recentPaystackTransactions.map(p => p.userId);
    const paystackUsers = await usersCollection.find({ _id: { $in: paystackUserIds } }).toArray();
    const paystackUserMap: { [key: string]: any } = {};
    paystackUsers.forEach(user => {
    paystackUserMap[user._id.toString()] = user;
    });

    // Format Paystack transactions
    const paystackTransactions = recentPaystackTransactions.map(paystack => {
      const user = paystackUserMap[paystack.userId.toString()];
      const formatted = {
        id: paystack.transactionId || paystack._id.toString(),
        type: 'Card Payment',
        amount: paystack.usdAmount,
        status: paystack.status.charAt(0).toUpperCase() + paystack.status.slice(1),
        user: user?.fullName || user?.username || paystack.username || 'Unknown User',
        email: user?.email || paystack.userEmail || 'unknown@example.com',
        paymentMethod: paystack.paymentMethod,
        createdAt: paystack.createdAt
      };
      console.log('Formatted Paystack transaction:', formatted);
      return formatted;
    });

    // Format stats for frontend
    const formattedStats = [
      { label: "Total Users", value: totalUsers.toString(), icon: "Users", color: "text-blue-500", bg: "bg-blue-500/10" },
      { label: "Active Users", value: activeUsers.toString(), icon: "UserCheck", color: "text-teal-500", bg: "bg-teal-500/10" },
      { label: "Blocked Users", value: blockedUsers.toString(), icon: "UserMinus", color: "text-red-500", bg: "bg-red-500/10" },
      { label: "Investment Plans", value: investmentPlansCount.toString(), icon: "Layers", color: "text-purple-500", bg: "bg-purple-500/10" },
      { label: "Total Deposit", value: `$${stats.totalDeposit.toFixed(2)}`, icon: "TrendingUp", color: "text-teal-500", bg: "bg-teal-500/10" },
      { label: "Pending Deposit", value: `$${pendingDepositsTotal.toFixed(2)}`, icon: "Clock", color: "text-orange-500", bg: "bg-orange-500/10" },
      { label: "Pending Withdrawal", value: `$${pendingWithdrawalsTotal.toFixed(2)}`, icon: "ArrowUpRight", color: "text-red-500", bg: "bg-red-500/10" },
      { label: "Total Payout", value: `$${totalPayout.toFixed(2)}`, icon: "ArrowDownLeft", color: "text-green-500", bg: "bg-green-500/10" },
      { label: "Total KYC Submitted", value: totalKycSubmissions.toString(), icon: "Shield", color: "text-indigo-500", bg: "bg-indigo-500/10" },
      { label: "Pending Gift Cards", value: pendingGiftCards.toString(), icon: "Gift", color: "text-orange-500", bg: "bg-orange-500/10" },
      { label: "Approved Gift Cards", value: approvedGiftCards.toString(), icon: "Gift", color: "text-green-500", bg: "bg-green-500/10" },
      { label: "Rejected Gift Cards", value: rejectedGiftCards.toString(), icon: "Gift", color: "text-red-500", bg: "bg-red-500/10" },
      { label: "Total Gifts", value: totalGifts.toString(), icon: "Gift", color: "text-pink-500", bg: "bg-pink-500/10" },
      { label: "User Achievements", value: totalUserAchievements.toString(), icon: "Trophy", color: "text-yellow-500", bg: "bg-yellow-500/10" },
      { label: "Total User XP", value: totalUserXP.toString(), icon: "Star", color: "text-purple-500", bg: "bg-purple-500/10" },
      { label: "Total Redeemed", value: totalRedeemed.toString(), icon: "Star", color: "text-green-500", bg: "bg-green-500/10" },
      { label: "USDT Redeemed", value: `$${totalUSDTRedeemed.toFixed(2)}`, icon: "DollarSign", color: "text-teal-500", bg: "bg-teal-500/10" },
      { label: "XP Redeemed", value: totalXPRedeemed.toString(), icon: "Star", color: "text-purple-500", bg: "bg-purple-500/10" },
      { label: "Total Daily XP", value: totalDailyXP.toString(), icon: "Star", color: "text-blue-500", bg: "bg-blue-500/10" },
      { label: "Total Achievements XP", value: totalAchievementXP.toString(), icon: "Trophy", color: "text-yellow-500", bg: "bg-yellow-500/10" },
      { label: "Total Predictions", value: totalPredictions.toString(), icon: "Target", color: "text-cyan-500", bg: "bg-cyan-500/10" },
      { label: "Won Predictions", value: wonPredictions.toString(), icon: "TrendingUp", color: "text-green-500", bg: "bg-green-500/10" },
      { label: "Lost Predictions", value: lostPredictions.toString(), icon: "TrendingUp", color: "text-red-500", bg: "bg-red-500/10" },
      { label: "Prediction XP Earned", value: totalPredictionXP.toString(), icon: "Zap", color: "text-yellow-500", bg: "bg-yellow-500/10" },
      { label: "Paystack Transactions", value: totalPaystackTransactions.toString(), icon: "CreditCard", color: "text-emerald-500", bg: "bg-emerald-500/10" },
      { label: "Paystack USD Total", value: `$${totalPaystackUSD.toFixed(2)}`, icon: "DollarSign", color: "text-teal-500", bg: "bg-teal-500/10" },
      { label: "Processed Paystack", value: processedPaystackTransactions.toString(), icon: "CreditCard", color: "text-green-500", bg: "bg-green-500/10" },
      { label: "Pending Paystack", value: pendingPaystackTransactions.toString(), icon: "Clock", color: "text-orange-500", bg: "bg-orange-500/10" },
    ];

    // Combine and sort all transactions by date
    const allTransactions = [...depositTransactions, ...withdrawalTransactions, ...giftCardTransactions, ...paystackTransactions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50); // Keep only 50 most recent
    console.log('Total transactions combined:', allTransactions.length);
    console.log('Transaction types:', allTransactions.map(t => t.type));

    return NextResponse.json({
      success: true,
      stats: formattedStats,
      recentTransactions: allTransactions
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
