"use client";
import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const faqs = [
  {
    question: "What is Predict Market?",
    answer: "Predict Market is a feature that allows you to test your market analysis skills by predicting whether cryptocurrency prices will go up or down. Make one prediction per day and earn 1000 XP for every correct prediction. Your predictions are processed daily at midnight, and results are emailed to you."
  },
  {
    question: "How do I make a prediction?",
    answer: "Navigate to the Predict Market page in your dashboard. Select a crypto pair from the supported options (BTCUSDT, ETHUSDT, SOLUSDT, BNBUSDT), choose your direction (BUY for up, SELL for down), set your confidence level, and submit your prediction. The entry price is captured automatically at submission time."
  },
  {
    question: "What crypto pairs are supported?",
    answer: "Currently, we support 4 major crypto pairs: BTCUSDT (Bitcoin), ETHUSDT (Ethereum), SOLUSDT (Solana), and BNBUSDT (BNB). These pairs are selected for their liquidity and market stability to ensure fair prediction outcomes."
  },
  {
    question: "How much XP can I earn?",
    answer: "You earn 1000 XP for every correct prediction. There's no limit to how much XP you can accumulate over time. Your XP can be converted to USDT at a rate of 50 XP = 1 USDT through the Redeem XP page in your dashboard."
  },
  {
    question: "When are predictions processed?",
    answer: "All predictions are processed daily at midnight (00:00 UTC). The system compares the entry price captured at submission with the closing price at midnight. If the price moved in your predicted direction, you win and receive 1000 XP. Results are emailed to you automatically."
  },
  {
    question: "How do I win a prediction?",
    answer: "You win if the market price moves in your predicted direction by midnight. For a BUY prediction, the closing price must be higher than your entry price. For a SELL prediction, the closing price must be lower than your entry price. The direction matters, not the magnitude of the move."
  },
  {
    question: "Can I change my prediction after submitting?",
    answer: "No. Once you submit a prediction, it's locked for the day. This ensures fairness and prevents manipulation. You can only make one prediction per calendar day, so choose carefully before submitting."
  },
  {
    question: "How do I convert XP to USDT?",
    answer: "Go to the Redeem XP page in your dashboard. Select 'Prediction XP' as your XP type, enter the amount you want to redeem (minimum 50 XP), and confirm. Your USDT will be credited to your account balance instantly at the conversion rate of 50 XP = 1 USDT."
  },
  {
    question: "Is there a leaderboard?",
    answer: "Yes! The Predict Market leaderboard shows top predictors ranked by total XP earned, win rate, and prediction streaks. Compete with other traders to climb the rankings and showcase your market analysis skills."
  },
  {
    question: "What happens if I lose a prediction?",
    answer: "If the market moves against your prediction, you don't earn any XP for that day. There's no penalty or loss of capital—Predict Market is a risk-free way to test your skills and earn rewards. You can try again the next day."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-[1400px] px-4 lg:px-8 py-16 w-full">
      <div className="text-center mb-8 relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-[.2em] mb-4 text-primary">
          Support
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl md:text-4xl font-black uppercase tracking-tighter mb-6 leading-none">
          Frequently Asked <span className="text-primary">Questions</span>
        </h2>

        {/* Centered Paragraph */}
        <p className="text-muted-foreground max-w-lg mx-auto text-base md:text-lg font-light leading-relaxed">
          Everything you need to know about Predict Market.
          From making predictions to converting your XP rewards.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Left Column */}
        <div className="space-y-4">
          {faqs.slice(0, 5).map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {faqs.slice(5, 10).map((faq, index) => (
            <FAQItem
              key={index + 5}
              faq={faq}
              isOpen={openIndex === index + 5}
              onClick={() => setOpenIndex(openIndex === index + 5 ? null : index + 5)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ faq, isOpen, onClick }: { faq: any, isOpen: boolean, onClick: () => void }) {
  return (
    <div
      className={`group transition-all duration-300 rounded-[1rem] border ${isOpen
          ? "bg-card border-primary shadow-xl shadow-primary/5"
          : "bg-card/40 border-primary/10 hover:border-primary/30"
        }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center cursor-pointer justify-between p-4 lg:p-5 text-left"
      >
        <span className={`text-sm md:text-[14px] font-bold uppercase tracking-tight ${isOpen ? "text-primary" : "text-foreground"}`}>
          {faq.question}
        </span>
        <div className={`flex-shrink-0 ml-4 transition-transform duration-300 ${isOpen ? "rotate-0" : "rotate-0"}`}>
          {isOpen ? (
            <X className="w-5 h-5 text-primary" />
          ) : (
            <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-8">
          <div className="h-px bg-primary/10 mb-6" />
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}