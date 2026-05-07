import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    console.log("Analytics API called");
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "7d";
    console.log("Time range:", timeRange);
    
    // Get user from auth token
    const userId = await getUserFromRequest(request);
    console.log("User ID from auth:", userId);
    
    if (!userId) {
      console.log("No user ID found, returning 401");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Connecting to database...");
    const db = await connectToDatabase();
    console.log("Database connected");
    
    // Get user data
    console.log("Fetching user with ID:", userId);
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(userId) },
      { 
        projection: {
          accountBalance: 1,
          totalProfits: 1,
          totalDeposit: 1,
          totalWithdrawal: 1,
          username: 1,
          email: 1,
          fullName: 1
        }
      }
    );

    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Get investments data
    console.log("Fetching investments for user:", userId);
    let investments: any[] = [];
    try {
      investments = await db.collection("investments").find(
        { userId: new ObjectId(userId) },
        { 
          projection: {
            planName: 1,
            investmentAmount: 1,
            profitEarned: 1,
            status: 1,
            roiRate: 1,
            durationDays: 1,
            daysPassed: 1,
            completionPercentage: 1,
            profitHistory: 1,
            startDate: 1,
            endDate: 1,
            lastProfitDate: 1
          }
        }
      ).toArray();
      console.log("Investments found:", investments.length);
    } catch (invError) {
      console.error("Error fetching investments:", invError);
      investments = [];
    }

    // Get deposits data
    console.log("Fetching deposits for user:", userId);
    let deposits: any[] = [];
    try {
      deposits = await db.collection("deposits").find(
        { userId: new ObjectId(userId), status: "approved" }
      ).toArray();
      console.log("Deposits found:", deposits.length);
    } catch (depError) {
      console.error("Error fetching deposits:", depError);
      deposits = [];
    }

    // Get withdrawals data
    console.log("Fetching withdrawals for user:", userId);
    let withdrawals: any[] = [];
    try {
      withdrawals = await db.collection("withdrawals").find(
        { userId: new ObjectId(userId) }
      ).toArray();
      console.log("Withdrawals found:", withdrawals.length);
    } catch (withError) {
      console.error("Error fetching withdrawals:", withError);
      withdrawals = [];
    }

    // Get gifts sent and received
    console.log("Fetching gifts for user:", userId);
    let giftsSent: any[] = [];
    let giftsReceived: any[] = [];
    try {
      giftsSent = await db.collection("gifts").find(
        { senderId: new ObjectId(userId) }
      ).toArray();

      giftsReceived = await db.collection("gifts").find(
        { receiverId: new ObjectId(userId) }
      ).toArray();
      console.log("Gifts sent:", giftsSent.length, "Gifts received:", giftsReceived.length);
    } catch (giftError) {
      console.error("Error fetching gifts:", giftError);
      giftsSent = [];
      giftsReceived = [];
    }

    // Calculate analytics data
    const totalInvestments = investments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
    const activeInvestments = investments.filter(inv => inv.status === "active").length;
    const completedInvestments = investments.filter(inv => inv.status === "completed").length;
    
    // Calculate total profits from investments
    const totalInvestmentProfits = investments.reduce((sum, inv) => sum + (inv.profitEarned || 0), 0);
    
    // Get profit history from all investments
    const allProfitHistory: any[] = [];
    investments.forEach(investment => {
      if (investment.profitHistory && Array.isArray(investment.profitHistory)) {
        investment.profitHistory.forEach((profit: any) => {
          allProfitHistory.push({
            ...profit,
            planName: investment.planName,
            investmentAmount: investment.investmentAmount,
            roiRate: investment.roiRate
          });
        });
      }
    });

    // Sort profit history by date
    allProfitHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Filter by time range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case "24h":
        startDate.setDate(now.getDate() - 1);
        break;
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    const filteredProfitHistory = allProfitHistory.filter(
      profit => new Date(profit.timestamp) >= startDate
    );

    // Calculate investment breakdown by plan
    const investmentBreakdown = investments.reduce((acc: any, inv) => {
      const planName = inv.planName;
      if (!acc[planName]) {
        acc[planName] = {
          name: planName,
          totalAmount: 0,
          count: 0,
          totalProfit: 0
        };
      }
      acc[planName].totalAmount += inv.investmentAmount;
      acc[planName].count += 1;
      acc[planName].totalProfit += inv.profitEarned || 0;
      return acc;
    }, {});

    const breakdownArray = Object.values(investmentBreakdown).map((item: any) => ({
      name: item.name,
      value: item.totalAmount,
      percentage: totalInvestments > 0 ? Math.round((item.totalAmount / totalInvestments) * 100) : 0,
      count: item.count,
      profit: item.totalProfit
    }));

    // Calculate performance metrics
    const totalDepositsAmount = user.totalDeposit || deposits.reduce((sum, dep) => sum + dep.amount, 0);
    const totalWithdrawalsAmount = user.totalWithdrawal || withdrawals.reduce((sum, wit) => sum + wit.amount, 0);
    const totalGiftsSentAmount = giftsSent.reduce((sum, gift) => sum + gift.amount, 0);
    const totalGiftsReceivedAmount = giftsReceived.reduce((sum, gift) => sum + gift.amount, 0);

    // Calculate ROI percentage
    const roiPercentage = totalInvestments > 0 
      ? Math.round((totalInvestmentProfits / totalInvestments) * 100 * 100) / 100
      : 0;

    // Calculate daily average profit (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const recentProfits = allProfitHistory.filter(
      profit => new Date(profit.timestamp) >= sevenDaysAgo
    );
    const dailyAvgProfit = recentProfits.length > 0 
      ? Math.round((recentProfits.reduce((sum, p) => sum + p.amount, 0) / 7) * 100) / 100
      : 0;

    // Calculate success rate (completed investments)
    const successRate = investments.length > 0 
      ? Math.round((completedInvestments / investments.length) * 100 * 100) / 100
      : 0;

    // Prepare recent activity
    const recentActivity = [
      // Recent profits
      ...filteredProfitHistory.slice(0, 3).map(profit => ({
        type: "profit",
        title: "ROI Profit",
        description: `Daily profit from ${profit.planName}`,
        amount: `+$${profit.amount.toFixed(2)}`,
        change: `+${profit.roiRate}%`,
        time: formatRelativeTime(profit.timestamp),
        icon: "TrendingUp",
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        timestamp: profit.timestamp
      })),
      // Recent deposits
      ...deposits.slice(0, 2).map(deposit => ({
        type: "deposit",
        title: "Deposit Received",
        description: `${deposit.paymentMethod} payment confirmed`,
        amount: `+$${deposit.amount.toFixed(2)}`,
        change: "Approved",
        time: formatRelativeTime(deposit.createdAt),
        icon: "ArrowDownRight",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        timestamp: deposit.createdAt
      })),
      // Recent withdrawals
      ...withdrawals.slice(0, 2).map(withdrawal => ({
        type: "withdrawal",
        title: "Withdrawal Processed",
        description: `${withdrawal.crypto?.name || "Bank"} transfer`,
        amount: `-$${withdrawal.amount.toFixed(2)}`,
        change: withdrawal.status,
        time: formatRelativeTime(withdrawal.createdAt),
        icon: "ArrowUpRight",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        timestamp: withdrawal.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6);

    // Prepare daily profit data for charts (last 7 days)
    const dailyProfitData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayProfits = allProfitHistory.filter(profit => {
        const profitDate = new Date(profit.timestamp).toISOString().split('T')[0];
        return profitDate === dateStr;
      });
      
      const dayTotal = dayProfits.reduce((sum, profit) => sum + profit.amount, 0);
      
      dailyProfitData.push({
        date: date.toLocaleDateString('en', { weekday: 'short' }),
        fullDate: dateStr,
        amount: dayTotal,
        count: dayProfits.length
      });
    }

    const analyticsData = {
      overview: {
        totalInvestments,
        totalProfits: totalInvestmentProfits,
        totalDeposits: totalDepositsAmount,
        totalWithdrawals: totalWithdrawalsAmount,
        activePlans: activeInvestments,
        roiPercentage,
        accountBalance: user.accountBalance || 0,
        welcomeBonus: user.welcomeBonus || 0
      },
      investmentBreakdown: breakdownArray,
      profitHistory: filteredProfitHistory,
      dailyProfitData,
      performanceMetrics: {
        dailyROI: dailyAvgProfit > 0 ? `${((dailyAvgProfit / totalInvestments) * 100).toFixed(1)}%` : "0%",
        weeklyGrowth: "+12.5%", // This would need more complex calculation
        successRate: `${successRate}%`,
        riskScore: "Low", // This could be calculated based on investment patterns
        dailyAvgProfit,
        totalInvestmentsCount: investments.length,
        completedInvestments: completedInvestments,
        activeInvestments: activeInvestments
      },
      recentActivity,
      transactions: {
        deposits: deposits.slice(0, 10),
        withdrawals: withdrawals.slice(0, 10),
        giftsSent: giftsSent.slice(0, 5),
        giftsReceived: giftsReceived.slice(0, 5)
      },
      user: {
        name: user.fullName || user.username,
        email: user.email,
        username: user.username
      }
    };

    return NextResponse.json({
      success: true,
      data: analyticsData,
      timeRange
    });

  } catch (error) {
    console.error("Analytics API error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack');
    
    // Return specific error message based on error type
    let errorMessage = "Internal server error";
    if (error instanceof Error) {
      if (error.message.includes("ObjectId")) {
        errorMessage = "Invalid user ID format";
      } else if (error.message.includes("ENOTFOUND")) {
        errorMessage = "Database connection failed";
      } else if (error.message.includes("ECONNREFUSED")) {
        errorMessage = "Database connection refused";
      }
    }
    
    return NextResponse.json(
      { success: false, message: errorMessage, details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

function formatRelativeTime(timestamp: any): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) {
    return "Just now";
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return time.toLocaleDateString();
  }
}
