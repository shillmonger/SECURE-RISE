"use client";

import React from "react";
import {
  Coins,
  Gift,
  ArrowRightLeft,
  Flame,
  Trophy,
  Wallet,
  Send,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  User,
  FileText,
  CreditCard,
  ShoppingBag,
  TrendingUp,
  Calculator,
  AlertTriangle,
  Clock,
  Star,
} from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";
import ReadAloud from "@/components/user-dashboard/read-aloud";
import Link from "next/link";

export default function LearnMorePage() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div
            id="learn-more-content"
            className="max-w-4xl mx-auto space-y-12"
          >
            {/* Page Header */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">
                    Learn More
                  </h1>

                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                    Detailed information about our platform features
                  </p>
                </div>

                <ReadAloud targetId="learn-more-content" />
              </div>
            </section>

            {/* XP Redemption Section */}
            <section className="bg-card border border-border rounded-[1rem] p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                  <Coins className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Redeem Rewards (XP)
                  </h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Convert your XP into tradeable USDT
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  The XP Redemption system allows you to convert your hard-earned Experience Points (XP) directly into USDT digital assets that can be used for trading or withdrawn. This feature provides a tangible way to benefit from your daily engagement and achievements on the platform.
                </p>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    Daily Streak XP
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Earn XP by maintaining your daily login streak. Each consecutive day of logging in rewards you with XP that accumulates over time. The longer your streak, the more XP you earn. This XP can be redeemed at any time through the XP Redemption page.
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    Achievement Milestone XP
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Unlock achievements by completing specific milestones on the platform. Each achievement grants you XP that can be redeemed. Achievements range from making your first deposit to reaching certain investment milestones, providing multiple ways to earn XP.
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-sky-400" />
                    Conversion Rate
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    The conversion rate is set at 50 XP = 1 USDT. This means for every 50 XP you redeem, you receive 1 USDT in your account balance. The rate applies uniformly to both Daily Streak XP and Achievement Milestone XP.
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-green-400" />
                    How It Works
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li>Navigate to the XP to USDT (Redeem) page from your dashboard</li>
                    <li>Select which XP pool you want to redeem from (Daily or Achievement)</li>
                    <li>Enter the amount of XP you wish to convert</li>
                    <li>Review the estimated USDT you will receive</li>
                    <li>Confirm the conversion to instantly receive USDT in your balance</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Redemption Guidelines
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Minimum Threshold:</strong> No minimum limits on conversions. Redeem anytime.</li>
                    <li><strong>Instant Settlement:</strong> USDT settlements deploy instantly directly to your internal balances.</li>
                    <li><strong>Rate Uniformity:</strong> Both Daily Claims and Milestone items trade at matching flat valuation scales.</li>
                    <li><strong>Transaction History:</strong> All redemptions are logged and can be viewed in your transaction history page.</li>
                  </ul>
                </div>
              </div>

              <Link
                href="/user-dashboard/redeem-xp"
                className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all cursor-pointer"
              >
                <Coins className="w-4 h-4 text-yellow-400" />
                Go to Redeem Rewards
              </Link>
            </section>

            {/* Gift Member Section */}
            <section className="bg-card border border-border rounded-[1rem] p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Empower a Fellow Trader
                  </h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Send gifts to other platform members
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  The Gift Transfer feature allows you to send USDT directly to other members of the Secure Rise platform. This is a great way to help fellow traders scale their portfolios, support friends, or participate in community initiatives. Plus, you earn rewards for every gift you send!
                </p>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Send className="w-4 h-4 text-primary" />
                    How to Send a Gift
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li>Navigate to the Gift Member page from your dashboard</li>
                    <li>Search for the recipient by their username or email</li>
                    <li>Select the user from the search results</li>
                    <li>Enter the amount you wish to send</li>
                    <li>Review the transfer details including your commission</li>
                    <li>Confirm the transfer to send the gift instantly</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    5% Commission Reward
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    For every gift you send, you earn a 5% commission on the amount sent. This commission is credited back to your account instantly. For example, if you send $100 to another user, you receive $5 back as a reward. This incentivizes community engagement and helps you grow your balance while supporting others.
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-green-400" />
                    Balance Requirements
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    You can only send gifts from your available account balance. The system will check your balance before allowing a transfer. Your available balance is displayed on the Gift Member page, along with your total earnings from gift commissions.
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Important Notes
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Irreversible Transfers:</strong> All gift transfers are final and cannot be reversed. Ensure recipient details are correct before confirming.</li>
                    <li><strong>No Fees:</strong> There are no transaction fees for sending gifts. The full amount reaches the recipient.</li>
                    <li><strong>Instant Delivery:</strong> Gifts are delivered instantly to the recipient's account balance.</li>
                    <li><strong>Transaction History:</strong> All gift transactions are logged and can be viewed in your transaction history.</li>
                    <li><strong>Search Privacy:</strong> You can only search for users by their registered email or username on the platform.</li>
                  </ul>
                </div>
              </div>

              <Link
                href="/user-dashboard/gift-member"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all cursor-pointer"
              >
                <Gift className="w-4 h-4" />
                Go to Gift Member
              </Link>
            </section>

            {/* Withdraw Section */}
            <section className="bg-card border border-border rounded-[1rem] p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                  <ArrowUpRight className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Withdraw Funds
                  </h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Securely withdraw your earnings to crypto wallets
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  The Withdrawal feature allows you to cash out your earnings securely to your linked cryptocurrency wallets. We support multiple cryptocurrencies including Bitcoin, Ethereum, Solana, USDT, and USDC. All withdrawals are processed with security measures to protect your funds.
                </p>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-green-400" />
                    Supported Cryptocurrencies
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    We support withdrawals to Bitcoin (BTC), Ethereum (ETH), Solana (SOL), Tether (USDT), and USD Coin (USDC). You must have your crypto wallet addresses linked to your profile before withdrawing.
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    Withdrawal Rules
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Minimum Amount:</strong> The minimum withdrawal amount is $100.</li>
                    <li><strong>Processing Fee:</strong> 0% - we don't charge any withdrawal fees.</li>
                    <li><strong>Deposit Requirement:</strong> You must have made at least one deposit before withdrawing.</li>
                    <li><strong>Processing Time:</strong> Withdrawals are processed within 0-24 hours.</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    Security & Authentication
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    All withdrawals require email OTP authentication for security. You must send an OTP to your registered email before confirming a withdrawal. The destination wallet address is pulled from your profile settings and cannot be modified during withdrawal.
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    How to Withdraw
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li>Navigate to the Withdraw page from your dashboard</li>
                    <li>Select your payout cryptocurrency</li>
                    <li>Enter the amount you wish to withdraw (minimum $100)</li>
                    <li>Click "Send OTP" to receive a verification code via email</li>
                    <li>Enter the 4-digit OTP code</li>
                    <li>Confirm the withdrawal request</li>
                    <li>Track your withdrawal status in the withdrawal logs</li>
                  </ul>
                </div>
              </div>

              <Link
                href="/user-dashboard/withdraw"
                className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4 text-red-400" />
                Go to Withdraw
              </Link>
            </section>

            {/* Achievements Section */}
            <section className="bg-card border border-border rounded-[1rem] p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                  <Trophy className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Achievements
                  </h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Unlock rewards by reaching platform milestones
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  The Achievements system rewards you for your activity on the platform. Complete various milestones to unlock achievements and earn XP. Achievements are organized into categories and have different rarity levels, with higher rarity achievements granting more XP.
                </p>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Achievement Categories
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Welcome:</strong> Initial setup tasks like claiming welcome bonus and connecting crypto addresses</li>
                    <li><strong>ROI:</strong> Profit milestones from your investment returns</li>
                    <li><strong>Deposits:</strong> Deposit amount and frequency milestones</li>
                    <li><strong>Investments:</strong> Investment amount and portfolio building milestones</li>
                    <li><strong>Withdrawals:</strong> Withdrawal amount and frequency milestones</li>
                    <li><strong>Gifts:</strong> Sending and receiving gift milestones</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    Rarity Levels
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Common:</strong> Basic achievements (50-150 XP)</li>
                    <li><strong>Rare:</strong> Intermediate milestones (150-400 XP)</li>
                    <li><strong>Epic:</strong> Advanced achievements (400-750 XP)</li>
                    <li><strong>Legendary:</strong> Elite milestones (750-1500 XP)</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    How It Works
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Achievements unlock automatically when you complete the required actions. The system checks for new achievements when you visit the Achievements page. Once unlocked, you can view your progress and see which achievements are still available. All XP earned from achievements can be redeemed for USDT.
                  </p>
                </div>
              </div>

              <Link
                href="/user-dashboard/achievements"
                className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-purple-400" />
                Go to Achievements
              </Link>
            </section>

            {/* Daily Streak Section */}
            <section className="bg-card border border-border rounded-[1rem] p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Daily Streak
                  </h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Log in daily to earn XP rewards
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  The Daily Streak feature rewards you for consistent platform engagement. Log in every day to claim 100 XP and build your streak. The longer your streak, the more XP you accumulate. Your streak progress is tracked in a calendar view, showing completed, missed, and upcoming days.
                </p>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    XP Rewards
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    You earn 100 XP for each day you successfully claim your daily streak. This XP accumulates in your Daily Streak XP pool, which can be redeemed for USDT at any time through the XP Redemption page.
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    Streak Tracking
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    The calendar view shows your entire month with color-coded days: green for completed, red for missed, yellow for today (claimable), and gray for upcoming. Your current streak and longest streak are displayed at the top of the page.
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Important Rules
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>One Claim Per Day:</strong> You can only claim XP once per calendar day.</li>
                    <li><strong>Streak Reset:</strong> Missing a day resets your current streak to 0.</li>
                    <li><strong>No Backdating:</strong> You cannot claim XP for missed days.</li>
                    <li><strong>Timezone:</strong> Claims are based on your local timezone.</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    How to Claim
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li>Navigate to the Daily Streak page from your dashboard</li>
                    <li>Find today's date highlighted in yellow on the calendar</li>
                    <li>Click on today's day card to claim your +100 XP</li>
                    <li>Your streak will update automatically</li>
                    <li>Return daily to maintain and grow your streak</li>
                  </ul>
                </div>
              </div>

              <Link
                href="/user-dashboard/daily-streak"
                className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all cursor-pointer"
              >
                <Flame className="w-4 h-4 text-orange-400" />
                Go to Daily Streak
              </Link>
            </section>

            {/* KYC Section */}
            <section className="bg-card border border-border rounded-[1rem] p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <ShieldCheck className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    KYC Verification
                  </h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Verify your identity to unlock full platform access
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  KYC (Know Your Customer) verification is required to access certain platform features and increase withdrawal limits. The verification process involves submitting personal information and government-issued ID documents for review by our compliance team.
                </p>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    Verification Steps
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Step 1 - Personal Information:</strong> Enter your full name, date of birth, nationality, and address details</li>
                    <li><strong>Step 2 - ID Verification:</strong> Select document type, enter ID number, and upload front/back images</li>
                    <li><strong>Step 3 - Review:</strong> Review all information before submission</li>
                    <li><strong>Step 4 - Status:</strong> Track your verification status and timeline</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-400" />
                    Accepted Documents
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    We accept National ID Cards, International Passports, Driver's Licenses, and Residence Permits. Documents must be clear, not expired, and show all four corners. Blurry or cropped images will be rejected.
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    Processing Timeline
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    KYC verification typically takes 24-48 hours to process. You can track your status on the KYC page. Statuses include: Pending Review, Under Review, Approved, or Rejected (with reason).
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Benefits of Verification
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li>Unlock higher withdrawal limits</li>
                    <li>Access to all platform features</li>
                    <li>Increased trust and credibility</li>
                    <li>Faster withdrawal processing</li>
                    <li>Unlock the "Verify KYC" achievement (200 XP)</li>
                  </ul>
                </div>
              </div>

              <Link
                href="/user-dashboard/kyc"
                className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Go to KYC Verification
              </Link>
            </section>

            {/* Deposit Section */}
            <section className="bg-card border border-border rounded-[1rem] p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                  <CreditCard className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Fund Balance
                  </h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Add funds to your account using cryptocurrency
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  The Deposit feature allows you to fund your account balance using various cryptocurrencies. Simply enter the amount you wish to deposit, select your preferred cryptocurrency, and proceed to checkout to receive payment instructions. Deposits are credited to your account after confirmation.
                </p>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-green-400" />
                    Supported Cryptocurrencies
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    We support USDT-TRC20, Bitcoin, Ethereum, Solana, Dogecoin, Cardano, XRP, USDC ERC20, Litecoin, and BNB BEP20. Choose the cryptocurrency that works best for you.
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    How to Deposit
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li>Navigate to the Fund Balance page from your dashboard</li>
                    <li>Enter the amount you wish to deposit (in USD)</li>
                    <li>Select your preferred cryptocurrency from the dropdown</li>
                    <li>Click "Proceed to Checkout" to view payment details</li>
                    <li>Send the cryptocurrency to the provided wallet address</li>
                    <li>Wait for blockchain confirmation (typically 10-60 minutes)</li>
                    <li>Your balance will be credited automatically</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    Security & Processing
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    All deposits are processed securely through our multi-chain deposit system. Each deposit generates a unique transaction ID for tracking. Deposit history is available on the page for your reference.
                  </p>
                </div>
              </div>

              <Link
                href="/user-dashboard/deposit"
                className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-green-400" />
                Go to Deposit
              </Link>
            </section>

            {/* Gift Card Section */}
            <section className="bg-card border border-border rounded-[1rem] p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20">
                  <ShoppingBag className="w-6 h-6 text-pink-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Gift Card Deposit
                  </h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Convert gift cards into account balance
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  The Gift Card Deposit feature allows you to convert physical or digital gift cards into account balance. We accept gift cards from major retailers including Apple, Xbox, Amazon, Steam, Razer Gold, and Google Play. Simply follow the 5-step verification process to submit your gift card.
                </p>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-pink-400" />
                    Supported Gift Cards
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    We accept Apple, Xbox, Amazon, Steam, Razer Gold, and Google Play gift cards. Each card type may have different regional availability and currency support.
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    5-Step Submission Process
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Step 1 - Card Type:</strong> Select your gift card brand (Apple, Xbox, Amazon, etc.)</li>
                    <li><strong>Step 2 - Country:</strong> Select the card's region/country for currency conversion</li>
                    <li><strong>Step 3 - Amount:</strong> Enter the exact denomination printed on the card</li>
                    <li><strong>Step 4 - Upload:</strong> Upload a clear image of the gift card showing the full card and code</li>
                    <li><strong>Step 5 - Code:</strong> Enter the gift card code exactly as shown on the card</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    Image Requirements
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Gift card images must be clear, show the full card, have the code visible, and not be blurry or cropped. Good lighting is essential for verification. Images that don't meet these requirements will be rejected.
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    Processing Timeline
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Gift card submissions go through a verification process. Statuses include: Pending Review, Processing, Approved, or Rejected. Approved cards are credited to your balance at the card's face value.
                  </p>
                </div>
              </div>

              <Link
                href="/user-dashboard/gift-card"
                className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-pink-400" />
                Go to Gift Card Deposit
              </Link>
            </section>

            {/* Investment Section */}
            <section className="bg-card border border-border rounded-[1rem] p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                  <TrendingUp className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Investment Plans
                  </h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Grow your wealth with our high-yield investment plans
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  Our Investment Plans offer a straightforward way to grow your wealth with a fixed 50% daily ROI. Choose from 6 different plan tiers based on your investment amount. All plans run for 7 days with daily ROI payouts credited to your account balance.
                </p>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-cyan-400" />
                    Investment Calculator
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Use our built-in investment calculator to estimate your returns. Adjust the investment amount and duration (1-30 days) to see projected daily earnings, total profit, and total return. The calculator uses the 50% daily ROI rate for accurate projections.
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Plan Tiers
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Starter Rise ($100-199):</strong> Basic plan with daily ROI payouts and email support</li>
                    <li><strong>Basic Growth ($200-499):</strong> Priority support and growth dashboard</li>
                    <li><strong>Pro Trader ($500-999):</strong> 24/7 support, advanced analytics, and fast withdrawals</li>
                    <li><strong>Advanced Wealth ($1000-4999):</strong> AI trading bot, dedicated manager, and instant withdrawals</li>
                    <li><strong>Elite Investor ($5000-9999):</strong> Copy trading, VIP support, bonus rewards</li>
                    <li><strong>Secure Partner ($10000+):</strong> Funded account access, personal broker, corporate benefits</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    How It Works
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li>Navigate to the Investment Plans page from your dashboard</li>
                    <li>Review the available plans and their perks</li>
                    <li>Select a plan that matches your investment amount</li>
                    <li>Click "Invest Now" to open the investment modal</li>
                    <li>Enter your investment amount (must meet plan minimum)</li>
                    <li>Confirm the investment to activate the plan</li>
                    <li>Receive daily ROI payouts for 7 days</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    Investment Security
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    All investments are insured and secured. Plans activate immediately after deposit. You can track your active investments and ROI history in your transactions page.
                  </p>
                </div>
              </div>

              <Link
                href="/user-dashboard/invest"
                className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Go to Investment Plans
              </Link>
            </section>

          </div>
        </main>
      </div>
      <UserNav />
    </div>
  );
}
