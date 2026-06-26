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
  Users,
  Link as LinkIcon,
  UserPlus,
  Search,
  BarChart2,
  Target,
  RefreshCw,
  TrendingUpDown,
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
            className="max-w-7xl mx-auto space-y-12"
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

            {/* Welcome to Secure Rise Section */}
            <section className="bg-gradient-to-br from-primary/10 via-card to-card border border-border rounded-[1rem] p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/20 rounded-xl border border-primary/30">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Welcome to Secure Rise
                  </h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Your Trading & Investment Hub
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  Secure Rise is a premier trading and investment platform that connects your capital with skilled professional traders. Our platform offers institutional-grade trading infrastructure, advanced AI technology, and comprehensive risk protection to help you grow your wealth safely and efficiently.
                </p>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Core Features
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Professional Trading:</strong> Your funds are managed by expert traders using MT4, MT5, cTrader, and other top platforms</li>
                    <li><strong>10% Average Daily ROI:</strong> Consistent daily returns on your investments</li>
                    <li><strong>256-bit AES Encryption:</strong> Military-grade security for all transactions and data</li>
                    <li><strong>Full Capital Refund:</strong> If capital is lost, we refund 100% + 20% compensation</li>
                    <li><strong>Instant $20 Bonus:</strong> Welcome bonus credited upon first investment payout</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    How It Works
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Create Account:</strong> Sign up and claim your $20 welcome bonus</li>
                    <li><strong>Add Capital:</strong> Fund your account using cryptocurrency or gift cards</li>
                    <li><strong>Choose Plan:</strong> Select from 6 investment tiers ($100 to $10,000+)</li>
                    <li><strong>Professional Trading:</strong> Our experts trade on your behalf</li>
                    <li><strong>Daily Accumulation:</strong> Receive daily ROI payouts for 14 days</li>
                    <li><strong>Easy Withdrawals:</strong> Cash out your earnings anytime</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Platform Statistics
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>$20M+ Rewards Paid:</strong> Total rewards distributed to users</li>
                    <li><strong>83,000+ Traders:</strong> Active traders on the platform</li>
                    <li><strong>160+ Countries:</strong> Global presence and reach</li>
                    <li><strong>160,000+ Community:</strong> Growing community of investors</li>
                    <li><strong>24/7 Support:</strong> Round-the-clock customer assistance</li>
                    <li><strong>&lt; 60s Response:</strong> Average response time for support</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-green-400" />
                    Supported Trading Platforms
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    We trade on the most reputable platforms including MT4, MT5, cTrader, Match-Trader, Ethereum, Exness, Tether, Bitcoin, Solana, Trade Locker, and Meme Coins. This diversified approach ensures maximum profit opportunities across various markets.
                  </p>
                </div>
              </div>

              <Link
                href="/user-dashboard/dashboard"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all cursor-pointer"
              >
                <TrendingUp className="w-4 h-4" />
                Go to Dashboard
              </Link>
            </section>

            {/* XP & Rewards System Section */}
            <section className="bg-card border border-border rounded-[1rem] p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                  <Coins className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    XP & Rewards System
                  </h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Complete Guide to Earning and Converting XP
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  The Secure Rise XP & Rewards System allows you to earn Experience Points (XP) through daily engagement and platform milestones. Convert your XP into USDT at any time to grow your trading capital. This comprehensive guide explains all ways to earn XP and how to maximize your rewards.
                </p>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    Daily Streak System
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Log in daily to claim <strong>+100 XP</strong> each day. XP is awarded per calendar day (not 24-hour period). Track your streak through the monthly calendar view.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>+100 XP</strong> per day claimed</li>
                    <li>XP automatically added to Daily XP Balance</li>
                    <li>Track: Current streak, Longest streak, Total completed days</li>
                    <li><strong>Streak resets</strong> if you miss a day</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Day Status Types:</strong> ✅ Completed (Green), 🟡 Today (Yellow), ❌ Missed (Red), 🔒 Upcoming (Gray)
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    Achievements System
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Unlock achievements by completing specific milestones. Each achievement grants XP based on rarity.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="bg-background/50 p-3 rounded-lg">
                      <p className="text-[10px] font-black uppercase text-indigo-400 mb-1">Welcome (Indigo)</p>
                      <p className="text-[9px] text-muted-foreground">Welcome Bonus (50 XP), Crypto Starter (75 XP), Crypto Master (300 XP), Verify KYC (200 XP)</p>
                    </div>
                    <div className="bg-background/50 p-3 rounded-lg">
                      <p className="text-[10px] font-black uppercase text-violet-400 mb-1">ROI (Violet)</p>
                      <p className="text-[9px] text-muted-foreground">First ROI (100 XP), Profit Master (400 XP), Profit Legend (1,200 XP)</p>
                    </div>
                    <div className="bg-background/50 p-3 rounded-lg">
                      <p className="text-[10px] font-black uppercase text-blue-400 mb-1">Deposits (Blue)</p>
                      <p className="text-[9px] text-muted-foreground">First Deposit (100 XP), Grand Depositor (500 XP), Whale Status (1,000 XP)</p>
                    </div>
                    <div className="bg-background/50 p-3 rounded-lg">
                      <p className="text-[10px] font-black uppercase text-green-400 mb-1">Investments (Green)</p>
                      <p className="text-[9px] text-muted-foreground">First Investment (100 XP), Power Investor (500 XP), Market Titan (1,000 XP)</p>
                    </div>
                    <div className="bg-background/50 p-3 rounded-lg">
                      <p className="text-[10px] font-black uppercase text-orange-400 mb-1">Withdrawals (Orange)</p>
                      <p className="text-[9px] text-muted-foreground">First Cash Out (100 XP), Grand Exit (500 XP), Big Liquidator (1,000 XP)</p>
                    </div>
                    <div className="bg-background/50 p-3 rounded-lg">
                      <p className="text-[10px] font-black uppercase text-pink-400 mb-1">Gifts (Pink)</p>
                      <p className="text-[9px] text-muted-foreground">First Gift (75 XP), Big Heart (300 XP), Legendary Giver (1,500 XP)</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Rarity Levels:</strong> Common (50-150 XP), Rare (150-400 XP), Epic (400-750 XP), Legendary (750-1,500 XP)
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-sky-400" />
                    XP Redemption System
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Convert both Daily XP and Achievement XP into USDT. The conversion rate is uniform across all XP types.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Conversion Rate:</strong> 50 XP = 1 USDT ($0.02 per XP)</li>
                    <li><strong>No minimum threshold</strong> - Redeem any amount</li>
                    <li><strong>Instant settlement</strong> - USDT added immediately</li>
                    <li><strong>Example:</strong> 100 XP = $2.00 USDT, 1,000 XP = $20.00 USDT, 10,000 XP = $200.00 USDT</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Gift className="w-4 h-4 text-pink-400" />
                    Gifting System
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Send gifts (money) to other users and earn rewards. The sender earns a <strong>5% commission</strong> on every gift sent.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>5% Commission:</strong> Earn 5% of gifted amount back as reward</li>
                    <li><strong>Example:</strong> Send $100 → Earn +$5.00 commission</li>
                    <li><strong>Balance Impact:</strong> Gift amount deducted, commission added back</li>
                    <li><strong>No fees:</strong> Transfers are free, full amount reaches recipient</li>
                    <li><strong>Instant processing:</strong> Gifts sent immediately</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    XP Earning Summary
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Daily Streak:</strong> 100 XP/day × 365 days = 36,500 XP/year</li>
                    <li><strong>Welcome Achievements:</strong> Up to 725 XP</li>
                    <li><strong>ROI Achievements:</strong> Up to 2,700 XP</li>
                    <li><strong>Deposit Achievements:</strong> Up to 2,300 XP</li>
                    <li><strong>Investment Achievements:</strong> Up to 2,300 XP</li>
                    <li><strong>Withdrawal Achievements:</strong> Up to 2,300 XP</li>
                    <li><strong>Gift Achievements:</strong> Up to 3,625 XP</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Total Maximum XP:</strong> ~17,450 XP (achievements only) = $349.00 USDT + Daily streak value
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Strategy Tips
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li>Never miss a daily claim - 100 XP/day adds up fast</li>
                    <li>Focus on high-XP achievements - Legendary achievements give 1,500 XP</li>
                    <li>Gift strategically - Earn 5% commission while helping others</li>
                    <li>Convert XP regularly - No minimum, redeem anytime</li>
                    <li>Track your progress - Use achievements page to see completion %</li>
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

            {/* Predict Market Section */}
            <section className="bg-card border border-border rounded-[1rem] p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                  <TrendingUpDown className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Predict Market
                  </h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Test your market analysis skills and earn XP
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  The Predict Market feature allows you to test your market analysis skills by predicting whether cryptocurrency prices will go up or down. Make one prediction per day and earn 1000 XP for every correct prediction. Your predictions are processed daily at midnight, and results are emailed to you.
                </p>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Target className="w-4 h-4 text-cyan-400" />
                    How It Works
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Select a Pair:</strong> Choose from supported crypto pairs (BTCUSDT, ETHUSDT, SOLUSDT, BNBUSDT)</li>
                    <li><strong>Choose Direction:</strong> Predict if the price will go UP (BUY) or DOWN (SELL)</li>
                    <li><strong>Set Confidence:</strong> Select your confidence level (Low, Medium, High)</li>
                    <li><strong>Submit Prediction:</strong> Submit your prediction before the daily deadline</li>
                    <li><strong>Daily Processing:</strong> Predictions are processed at midnight (00:00 UTC)</li>
                    <li><strong>Receive Results:</strong> Email notification with win/loss status and XP earned</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    XP Rewards
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>+1000 XP</strong> for each correct prediction</li>
                    <li><strong>0 XP</strong> for incorrect predictions</li>
                    <li><strong>Daily Limit:</strong> One prediction per day</li>
                    <li><strong>Conversion:</strong> Prediction XP can be converted to USDT (50 XP = 1 USDT)</li>
                    <li><strong>Example:</strong> 10 correct predictions = 10,000 XP = $200 USDT</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-purple-400" />
                    Supported Crypto Pairs
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    We support major cryptocurrency pairs for predictions. Prices are fetched from CoinGecko API to ensure accuracy.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>BTCUSDT:</strong> Bitcoin / Tether</li>
                    <li><strong>ETHUSDT:</strong> Ethereum / Tether</li>
                    <li><strong>SOLUSDT:</strong> Solana / Tether</li>
                    <li><strong>BNBUSDT:</strong> Binance Coin / Tether</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    Prediction Rules
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>One Per Day:</strong> You can only submit one prediction per calendar day</li>
                    <li><strong>Entry Price:</strong> The price at the time of submission</li>
                    <li><strong>Close Price:</strong> The price at midnight (00:00 UTC)</li>
                    <li><strong>Win Condition:</strong> Price moves in your predicted direction by close time</li>
                    <li><strong>Status Updates:</strong> Prediction status changes from pending to won/lost after processing</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    Leaderboard
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Compete with other traders on the prediction leaderboard. Track your win rate and climb the ranks to showcase your market analysis skills.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Win Rate:</strong> Percentage of correct predictions</li>
                    <li><strong>Total XP Earned:</strong> Cumulative XP from predictions</li>
                    <li><strong>Ranking:</strong> Position on the global leaderboard</li>
                    <li><strong>History:</strong> View all your past predictions and results</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Tips for Success
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li>Study market trends and technical analysis before predicting</li>
                    <li>Consider news events that might affect crypto prices</li>
                    <li>Start with higher confidence when you're more certain</li>
                    <li>Track your prediction history to learn from past results</li>
                    <li>Convert your prediction XP regularly to grow your trading capital</li>
                  </ul>
                </div>
              </div>

              <Link
                href="/user-dashboard/predict"
                className="inline-flex items-center gap-2 bg-cyan-500 text-white px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all cursor-pointer"
              >
                <TrendingUpDown className="w-4 h-4" />
                Go to Predict Market
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

            {/* Referral/Affiliate Network Section */}
            <section className="bg-card border border-border rounded-[1rem] p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <Users className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Affiliate Network
                  </h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Expand your network, increase your earnings
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  The Affiliate Network allows you to earn commissions by referring new users to Secure Rise. Share your unique referral link and earn a percentage of your referrals' deposits. Build a multi-level network and maximize your earning potential through our tiered commission structure.
                </p>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-blue-400" />
                    Your Referral Link
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Each user receives a unique referral link that can be shared with friends, family, and on social media. When someone registers using your link, they become part of your referral network.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li>Navigate to the Affiliate Network page from your dashboard</li>
                    <li>Copy your unique referral link with one click</li>
                    <li>Share the link via email, social media, or messaging apps</li>
                    <li>Track your referrals and earnings in real-time</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Commission Structure
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Our tiered commission system rewards you for building a deep network. Earn commissions across three levels of referrals.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Level 1 (Direct Referrals):</strong> 10% commission on deposits</li>
                    <li><strong>Level 2 (Indirect Network):</strong> 5% commission on sub-referrals' deposits</li>
                    <li><strong>Level 3 (Extended Network):</strong> 2% commission on third-level deposits</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Example:</strong> If your Level 1 referral deposits $1,000, you earn $100. If their referral (Level 2) deposits $500, you earn $25. Commissions are settled instantly upon partner deposit confirmation.
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-purple-400" />
                    Network Directory
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Track all your referrals in one place. View their status, earnings, and join dates. Search and filter your network to monitor performance.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Total Referrals:</strong> View total number of users in your network</li>
                    <li><strong>Active Referrals:</strong> See how many are currently active</li>
                    <li><strong>Net Bonuses:</strong> Track total commissions earned from referrals</li>
                    <li><strong>Partner Status:</strong> Monitor each referral's activity level</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Benefits of Referring
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Passive Income:</strong> Earn commissions on your referrals' deposits</li>
                    <li><strong>Multi-Level Earnings:</strong> Build a network that pays across 3 levels</li>
                    <li><strong>Instant Settlement:</strong> Commissions credited immediately</li>
                    <li><strong>No Limits:</strong> Unlimited referral potential</li>
                    <li><strong>Community Growth:</strong> Help others discover Secure Rise</li>
                  </ul>
                </div>
              </div>

              <Link
                href="/user-dashboard/referrals"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all cursor-pointer"
              >
                <Users className="w-4 h-4" />
                Go to Affiliate Network
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
                  Our Investment Plans offer a straightforward way to grow your wealth with a fixed 70% daily ROI. Choose from 6 different plan tiers based on your investment amount. All plans run for 14 days with daily ROI payouts credited to your account balance.
                </p>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-cyan-400" />
                    Investment Calculator
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Use our built-in investment calculator to estimate your returns. Adjust the investment amount and duration (1-30 days) to see projected daily earnings, total profit, and total return. The calculator uses the 70% daily ROI rate for accurate projections.
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
                    <li>Receive daily ROI payouts for 14 days</li>
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

            {/* Leaderboard Section */}
            <section className="bg-card border border-border rounded-[1rem] p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                  <Trophy className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Leaderboard
                  </h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Compare performance against top traders
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  The Leaderboard showcases the top-performing traders on Secure Rise. Compare your portfolio metrics, withdrawals, profits, and deposits against the most successful users. The leaderboard updates 24/7 to reflect real-time performance data.
                </p>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    Top 3 Rankings
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    The top 3 traders are displayed prominently with special rank badges (Gold, Silver, Bronze). These elite performers are ranked by their total withdrawals, representing the most successful users on the platform.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Rank 1 (Gold):</strong> Highest total withdrawals, featured with special badge and styling</li>
                    <li><strong>Rank 2 (Silver):</strong> Second-highest performer with silver badge</li>
                    <li><strong>Rank 3 (Bronze):</strong> Third-place finisher with bronze badge</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    Top 10 Traders Table
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    The full leaderboard displays the top 10 traders with comprehensive metrics for comparison.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Rank:</strong> Position on the leaderboard (1-10)</li>
                    <li><strong>Player:</strong> Username and profile image</li>
                    <li><strong>Email:</strong> Partially masked email for identification</li>
                    <li><strong>Account Balance:</strong> Current wallet balance</li>
                    <li><strong>Total Withdrawals:</strong> Total amount withdrawn (primary ranking metric)</li>
                    <li><strong>Total Profits:</strong> Cumulative profit from investments</li>
                    <li><strong>Total Deposits:</strong> Total amount deposited</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Search className="w-4 h-4 text-purple-400" />
                    Search & Filter
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Use the search function to find specific users on the leaderboard. Search by username or email to quickly locate any trader's ranking and performance metrics.
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Real-Time Updates
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    The leaderboard updates continuously 24/7 to reflect the latest trading activity. Rankings change dynamically as users make withdrawals, profits, and deposits. Check back regularly to see your position and track your progress toward the top.
                  </p>
                </div>
              </div>

              <Link
                href="/user-dashboard/leaderboard"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                Go to Leaderboard
              </Link>
            </section>

            {/* Analytics/Performance Section */}
            <section className="bg-card border border-border rounded-[1rem] p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <BarChart2 className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Performance Analytics
                  </h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Track investment growth & trade metrics
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  The Performance Analytics dashboard provides comprehensive insights into your trading performance, portfolio growth, and investment metrics. Track your progress over different time ranges and make data-driven decisions to optimize your investment strategy.
                </p>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-green-400" />
                    Overview Statistics
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Key performance indicators displayed at the top of the dashboard for quick assessment of your portfolio health.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Total Balance:</strong> Current account balance across all currencies</li>
                    <li><strong>Total Profit:</strong> Cumulative profit from all investments</li>
                    <li><strong>Total Deposits:</strong> Sum of all deposits made to date</li>
                    <li><strong>Total Withdrawals:</strong> Sum of all withdrawals processed</li>
                    <li><strong>Active Investments:</strong> Number of currently active investment plans</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    Daily Profit Chart
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Visual representation of your daily profit over time. The chart shows profit trends and helps identify patterns in your investment performance.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Time Range:</strong> Switch between different periods (7 days, 30 days, 90 days)</li>
                    <li><strong>Visual Format:</strong> Line chart with profit points for each day</li>
                    <li><strong>Hover Details:</strong> View exact profit amounts on hover</li>
                    <li><strong>Animated Loading:</strong> Smooth animations when data loads</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-400" />
                    Portfolio Breakdown
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Detailed breakdown of your portfolio composition across different investment plans and assets.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Investment Distribution:</strong> Percentage allocation across plans</li>
                    <li><strong>Asset Allocation:</strong> Distribution across different cryptocurrencies</li>
                    <li><strong>Active vs Completed:</strong> Split between ongoing and finished investments</li>
                    <li><strong>Risk Profile:</strong> Assessment of portfolio risk level</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-blue-400" />
                    Live Activity Feed
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Real-time feed of your recent platform activities including deposits, withdrawals, investments, and ROI payouts.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Recent Transactions:</strong> Latest deposits and withdrawals</li>
                    <li><strong>Investment Updates:</strong> New investments and ROI payouts</li>
                    <li><strong>Timestamp:</strong> Each activity shows exact time</li>
                    <li><strong>Activity Type:</strong> Color-coded by transaction type</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Real-Time Updates
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    The dashboard features live market analytics and real-time data updates to ensure you always have the latest information.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Live Market Analytics:</strong> Real-time data indicator</li>
                    <li><strong>Manual Refresh:</strong> One-click refresh button</li>
                    <li><strong>Time Range Filters:</strong> Switch between different periods</li>
                    <li><strong>Animated Counters:</strong> Numbers animate when data loads</li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Key Metrics Summary
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Additional metrics displayed at the bottom of the dashboard for comprehensive portfolio health assessment.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Capital Safe:</strong> 100% capital protection guarantee</li>
                    <li><strong>Coverage:</strong> 24/7 trading and support coverage</li>
                    <li><strong>Bonuses:</strong> Active bonus rewards count</li>
                    <li><strong>Total Deposits:</strong> Cumulative deposit amount</li>
                    <li><strong>Total Withdrawals:</strong> Cumulative withdrawal amount</li>
                  </ul>
                </div>
              </div>

              <Link
                href="/user-dashboard/analytics"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all cursor-pointer"
              >
                <BarChart2 className="w-4 h-4" />
                Go to Performance Analytics
              </Link>
            </section>

          </div>
        </main>
      </div>
      <UserNav />
    </div>
  );
}
