"use client";

import { useRouter } from "next/navigation";
import GiveAway from "@/components/landing-page/GiveAway";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import CookieConsent from "@/components/landing-page/CookieConsent";
import LiveMarkets from "@/components/landing-page/LiveMarkets";
import Footer from "@/components/landing-page/Footer";
import TradingView from "@/components/landing-page/trading-view-slide";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, TrendingUp } from "lucide-react";

export default function SubscriptionPage() {
  const router = useRouter();
  const accessPlans = [
    {
      amount: 100,
      type: "Starter Rise",
      fee: "$100",
      duration: "14 Days",
      roi: 70,
      totalEarnings: 980,
      color: "from-yellow-500/20 to-yellow-500/5",
      accent: "text-yellow-500",
      border: "border-yellow-500/30",
      accentBg: "bg-yellow-500/10",
      accentHex: "yellow",
      tradingVolume: "Standard",
      benefits: [
        "Daily profit topping",
        "Secure trade execution",
        "$20 Welcome bonus eligible",
        "24/7 Support access",
      ],
    },
    {
      amount: 200,
      type: "Basic Growth",
      fee: "$200",
      duration: "14 Days",
      roi: 70,
      totalEarnings: 1960,
      color: "from-green-500/20 to-green-500/5",
      accent: "text-green-500",
      border: "border-green-500/30",
      accentBg: "bg-green-500/10",
      accentHex: "green",
      tradingVolume: "Enhanced",
      benefits: [
        "Priority trade allocation",
        "Daily earnings tracking",
        "Bonus withdrawable on payout",
        "Secure capital protection",
      ],
    },
    {
      amount: 500,
      type: "Pro Trader",
      fee: "$500",
      duration: "14 Days",
      roi: 70,
      totalEarnings: 4900,
      color: "from-blue-500/20 to-blue-500/5",
      accent: "text-blue-500",
      border: "border-blue-500/30",
      accentBg: "bg-blue-500/10",
      accentHex: "blue",
      tradingVolume: "Premium",
      benefits: [
        "Diversified trade pool",
        "Accelerated daily returns",
        "Full bonus integration",
        "Priority withdrawal processing",
      ],
    },
    {
      amount: 1000,
      type: "Advanced Wealth",
      fee: "$1000",
      duration: "14 Days",
      roi: 70,
      totalEarnings: 9800,
      color: "from-purple-500/20 to-purple-500/5",
      accent: "text-purple-500",
      border: "border-purple-500/30",
      accentBg: "bg-purple-500/10",
      accentHex: "purple",
      tradingVolume: "High Performance",
      popular: true,
      benefits: [
        "Institutional grade trading",
        "Maximized daily yields",
        "Dedicated account monitor",
        "Exclusive market insights",
      ],
    },
    {
      amount: 5000,
      type: "Elite Investor",
      fee: "$5000",
      duration: "14 Days",
      roi: 70,
      totalEarnings: 49000,
      color: "from-orange-500/20 to-orange-500/5",
      accent: "text-orange-500",
      border: "border-orange-500/30",
      accentBg: "bg-orange-500/10",
      accentHex: "orange",
      tradingVolume: "Institutional",
      benefits: [
        "Custom trade strategies",
        "Real-time audit access",
        "VIP support line",
        "Multi-layer security",
      ],
    },
    {
      amount: 10000,
      type: "Secure Partner",
      fee: "$10000",
      duration: "14 Days",
      roi: 70,
      totalEarnings: 98000,
      color: "from-cyan-500/20 to-cyan-500/5",
      accent: "text-cyan-500",
      border: "border-cyan-500/30",
      accentBg: "bg-cyan-500/10",
      accentHex: "cyan",
      tradingVolume: "Unlimited",
      benefits: [
        "Founder-level trade pools",
        "Maximized profit limits",
        "Direct admin consulting",
        "Lifetime secure insurance",
      ],
    },
  ];

  const handleSelectPlan = (plan: string, amount: number) => {
    router.push("/auth-page/login");
  };

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <GiveAway />
      <Header />

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 lg:px-10 pt-20 pb-15 lg:pt-25 lg:pb-20 text-center mt-12">
        <div className="bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full inline-block mb-5 text-xs font-semibold animate-pulse">
          🎁 Claim $20 Bonus Upon Signup!
        </div>
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-tight">
          Grow Your Wealth <span className="text-primary">Daily</span>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Choose a plan and let our advanced trading systems work for you.
          Earnings topped up automatically every 24 hours.
        </p>
      </section>

      {/* Plans Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-10 lg:pb-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {accessPlans.map((plan, i) => (
            <Card
              key={i}
              className={`flex flex-col justify-between bg-card/50 backdrop-blur-sm rounded-2xl transition-all duration-300 overflow-hidden relative
                ${
                  plan.popular
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-xl scale-[1.02] z-10"
                    : `border ${plan.border}`
                }
                hover:border-primary/40 hover:shadow-lg group
              `}
            >
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${plan.color}`} />

              {plan.popular && (
<div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">                  <div className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-b-lg shadow-md">
                   Our POPULAR Plan
                  </div>
                </div>
              )}

              {/* Header */}
              <CardHeader className="px-5 pt-6 pb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${plan.accent}`}>
                    {plan.type}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${plan.accentBg} ${plan.accent}`}>
                    {plan.roi}% ROI
                  </span>
                </div>
                <CardTitle className="text-3xl font-black tracking-tight">
                  ${plan.amount.toLocaleString()}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">
                  {plan.duration} · {plan.tradingVolume} Volume
                </p>
              </CardHeader>

              {/* Body */}
              <CardContent className="px-5 pb-5 flex-grow flex flex-col gap-4">
                {/* Earnings row */}
                <div className={`flex justify-between items-center px-3 py-2.5 rounded-xl bg-gradient-to-br ${plan.color} border ${plan.border}`}>
                  <span className="text-xs text-muted-foreground font-medium">Total Earnings</span>
                  <span className={`text-sm font-black ${plan.accent}`}>
                    +${plan.totalEarnings.toLocaleString()}
                  </span>
                </div>

                {/* Benefits */}
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2 tracking-widest">
                    Includes
                  </p>
                  <ul className="space-y-1.5">
                    {plan.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className={`shrink-0 w-4 h-4 rounded-full ${plan.accentBg} flex items-center justify-center`}>
                          <Check className={`w-2.5 h-2.5 ${plan.accent}`} />
                        </div>
                        <span className="text-xs text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <button
                  className="mt-auto w-full cursor-pointer font-bold text-sm uppercase py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-primary/20 hover:shadow-md"
                  onClick={() => handleSelectPlan(plan.type, plan.amount)}
                >
                  Invest Now
                  <TrendingUp className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <LiveMarkets />
      <TradingView />
      <ThemeAndScroll />
      <CookieConsent />
      <Footer />
    </main>
  );
}