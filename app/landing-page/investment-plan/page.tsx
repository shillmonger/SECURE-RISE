"use client";

import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import CookieConsent from "@/components/landing-page/CookieConsent";
import HowItWorks from "@/components/landing-page/how-It-works";
import Footer from "@/components/landing-page/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; 
import { Check, ArrowRight, Lock, TrendingUp } from "lucide-react"; 

export default function SubscriptionPage() { 
    const accessPlans = [ 
        { 
            amount: 100, 
            type: "Starter Rise", 
            fee: "$100", 
            duration: "Daily ROI",
            tradingVolume: "Standard",
            benefits: ["Daily profit topping", "Secure trade execution", "$20 Welcome bonus eligible", "24/7 Support access"]
        }, 
        { 
            amount: 200, 
            type: "Basic Growth", 
            fee: "$200", 
            duration: "Daily ROI",
            tradingVolume: "Enhanced",
            benefits: ["Priority trade allocation", "Daily earnings tracking", "Bonus withdrawable on payout", "Secure capital protection"]
        },
        { 
            amount: 500, 
            type: "Pro Trader", 
            fee: "$500", 
            duration: "Daily ROI",
            tradingVolume: "Premium",
            popular: true,
            benefits: ["Diversified trade pool", "Accelerated daily returns", "Full bonus integration", "Priority withdrawal processing"]
        },
        { 
            amount: 1000, 
            type: "Advanced Wealth", 
            fee: "$1000", 
            duration: "Daily ROI",
            tradingVolume: "High Performance",
            benefits: ["Institutional grade trading", "Maximized daily yields", "Dedicated account monitor", "Exclusive market insights"]
        }, 
        { 
            amount: 5000, 
            type: "Elite Investor", 
            fee: "$5000", 
            duration: "Daily ROI",
            tradingVolume: "Institutional",
            benefits: ["Custom trade strategies", "Real-time audit access", "VIP support line", "Multi-layer security"]
        },
        { 
            amount: 10000, 
            type: "Secure Partner", 
            fee: "$10000", 
            duration: "Daily ROI",
            tradingVolume: "Unlimited",
            benefits: ["Founder-level trade pools", "Maximized profit limits", "Direct admin consulting", "Lifetime secure insurance"]
        },
        { 
            amount: 0, 
            type: "Corporate", 
            fee: "LOCKED", 
            duration: "Custom",
            locked: true,
            tradingVolume: "Enterprise",
            benefits: ["Custom API Integration", "Bulk capital management", "White-label solutions", "Dedicated server priority"]
        },
    ];

    const handleSelectPlan = (plan: string, amount: number, isLocked: boolean) => {
        if (isLocked) return;
        // Logic to proceed to investment/payment
        window.open('/auth-page/login', '_self');
    };

    return ( 
        <main className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300"> 
            <Header />

            {/* Hero Header */} 
            <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 text-center mt-12"> 
                <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full inline-block mb-6 animate-pulse">
                    🎁 Claim $20 Bonus Upon Registration!
                </div>
                <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                    SECURE RISE INVESTMENT
                </span>
                <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-6 leading-tight"> 
                    Grow Your Wealth <span className="text-primary">Daily</span>
                </h1> 
                <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"> 
                    Choose a plan and let our advanced trading systems work for you. Your investment earns daily returns, topped up automatically every 24 hours.
                </p> 
            </section> 

            {/* Plans Grid */} 
            <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-32 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {accessPlans.map((plan, i) => ( 
                        <Card 
                            key={i} 
                            className={`flex flex-col justify-between bg-card/50 backdrop-blur-sm rounded-3xl transition-all duration-500 overflow-hidden relative
                                ${plan.popular ? 'ring-4 ring-primary ring-offset-4 ring-offset-background shadow-2xl scale-105 z-10' : 'border border-border'}
                                ${plan.locked ? 'opacity-60 grayscale-[0.5]' : 'hover:border-primary/50 hover:shadow-xl group cursor-pointer'}
                            `}
                            onClick={() => handleSelectPlan(plan.type, plan.amount, !!plan.locked)}> 
                            
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                    <div className="bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest px-8 py-2 pt-8 rounded-full shadow-2xl border-2 border-background">
                                        MOST POPULAR
                                    </div>
                                    <div className="absolute inset-0 bg-primary/50 blur-xl -z-10" />
                                </div>
                            )}

                            <CardHeader className="p-8 pb-4"> 
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold uppercase tracking-widest text-primary">{plan.type}</span>
                                    <span className="text-xl font-black text-muted-foreground">{plan.duration}</span>
                                </div>
                                <CardTitle className="text-5xl font-black tracking-tight italic uppercase"> 
                                    {plan.locked ? <Lock className="w-12 h-12 text-muted-foreground/30" /> : `$${plan.amount}`}
                                </CardTitle> 
                                <p className="text-sm text-muted-foreground mt-2 uppercase tracking-tight">Investment Amount</p>
                            </CardHeader> 
                            
                            <CardContent className="space-y-6 p-8 flex-grow"> 
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-secondary/30 p-4 rounded-2xl border border-border"> 
                                        <span className="text-sm font-medium text-muted-foreground">Trade Volume</span> 
                                        <span className={`text-lg font-black ${plan.locked ? '' : 'text-primary'}`}>
                                            {plan.locked ? "---" : plan.tradingVolume}
                                        </span> 
                                    </div> 
                                </div>

                                <div className="space-y-4"> 
                                    <p className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2"> 
                                        Plan Benefits
                                    </p> 
                                    <ul className="space-y-3 text-sm"> 
                                        {plan.benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex items-center gap-3"> 
                                                <div className={`p-1 rounded-full ${plan.locked ? 'bg-muted/50' : 'bg-primary/10'}`}>
                                                    <Check className={`w-3 h-3 ${plan.locked ? 'text-muted-foreground' : 'text-primary'}`} /> 
                                                </div>
                                                <span className="text-muted-foreground">{benefit}</span>
                                            </li> 
                                        ))}
                                    </ul> 
                                </div> 
                            </CardContent> 

                            <div className="p-8 pt-0"> 
                                <button 
                                    disabled={plan.locked}
                                    className={`w-full font-black uppercase py-5 rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 group/btn shadow-lg
                                        ${plan.locked 
                                            ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                                            : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-primary/30'
                                        }
                                    `} 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectPlan(plan.type, plan.amount, !!plan.locked);
                                    }}
                                > 
                                    {plan.locked ? "Locked" : "Invest Now"}
                                    {!plan.locked && <TrendingUp className="w-5 h-5 group-hover/btn:scale-125 transition-transform duration-300" />}
                                </button> 
                            </div>  
                        </Card> 
                    ))} 
                </div>
            </section>

            <HowItWorks />
            <ThemeAndScroll />
            <CookieConsent />
            <Footer />
        </main> 
    ); 
}