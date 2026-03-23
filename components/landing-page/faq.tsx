"use client";
import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const faqs = [
  {
    question: "How does the SECURE RISE investment process work?",
    answer: "Our process is simple: when you deposit capital, our institutional-grade AI and expert traders use those funds to execute high-frequency trades across global markets. We manage the risk, and you receive a portion of the trading profits credited to your account every 24 hours."
  },
  {
    question: "How do I claim and withdraw my $20 registration bonus?",
    answer: "The $20 credit is added to your trading wallet immediately upon registration. To ensure platform security, this bonus becomes eligible for withdrawal at the same time you receive the payout from your first successful investment cycle."
  },
  {
    question: "Is there a limit to how much I can invest?",
    answer: "No, there is no upper limit. However, we offer different tiers of trading algorithms based on your capital size to ensure maximum efficiency and risk management for your specific portfolio."
  },
  {
    question: "Why wouldn't I just trade the markets myself?",
    answer: "SECURE RISE provides institutional-level execution and proprietary AI strategies that are typically unavailable to retail traders. We handle the 24/7 market monitoring and technical analysis so you can enjoy passive accumulation without the stress of manual trading."
  },
  {
    question: "How safe are my deposited funds?",
    answer: "Security is our namesake. We use end-to-end encryption, multi-signature cold storage for digital assets, and partner with regulated liquidity providers to ensure your capital remains protected at all times."
  },
  {
    question: "Can I withdraw my initial capital at any time?",
    answer: "Yes. Your money is your control. While profit payouts happen daily, you can request a withdrawal of your available capital through your dashboard, and it will be processed directly to your preferred payment method."
  },
  {
    question: "What happens if a trade results in a loss of my capital?",
    answer: "We stand by our strategies. If a trade results in a loss of your initial capital, SECURE RISE covers it 100%. Not only do we refund your full investment immediately, but we also credit an additional 20% of your capital as compensation—fully withdrawable the moment it hits your account."
  },
  {
    question: "What are the supported payment methods for deposits?",
    answer: "To ensure global accessibility and instant processing, we primarily support major Cryptocurrencies. You can fund your account using USDT (ERC20/TRC20), Bitcoin (BTC), and Ethereum (ETH) directly from any private or exchange wallet."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-20 w-full">
     <div className="text-center mb-16 relative z-10">
  {/* Badge */}
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-[.2em] mb-4 text-primary">
    Support
  </div>

  {/* Main Heading */}
  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none">
    Frequently Asked <span className="text-primary">Questions</span>
  </h2>

  {/* Centered Paragraph */}
  <p className="text-muted-foreground max-w-lg mx-auto text-base md:text-lg font-light leading-relaxed">
    Everything you need to know about the SECURE RISE ecosystem. 
    From registration bonuses to our institutional-grade trading cycles.
  </p>
</div>

      {/* Two Column Layout like the image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Left Column */}
        <div className="space-y-4">
          {faqs.slice(0, 4).map((faq, index) => (
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
          {faqs.slice(4, 8).map((faq, index) => (
            <FAQItem 
              key={index + 4} 
              faq={faq} 
              isOpen={openIndex === index + 4} 
              onClick={() => setOpenIndex(openIndex === index + 4 ? null : index + 4)} 
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
      className={`group transition-all duration-300 rounded-[1rem] border ${
        isOpen 
        ? "bg-card border-primary shadow-xl shadow-primary/5" 
        : "bg-card/40 border-primary/10 hover:border-primary/30"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center cursor-pointer justify-between p-6 text-left"
      >
        <span className={`text-sm md:text-base font-bold uppercase tracking-tight ${isOpen ? "text-primary" : "text-foreground"}`}>
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