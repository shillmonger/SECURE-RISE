"use client";
import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const faqs = [
  {
    question: "What is SECURE RISE?",
    answer: "SECURE RISE is an investment platform designed for individuals who want exposure to the financial markets without actively trading themselves. Our experienced trading team and advanced analytical tools manage trading activities on behalf of investors, allowing members to participate in potential market opportunities while tracking their portfolio performance through a dedicated dashboard."
  },
  {
    question: "How does the SECURE RISE investment process work?",
    answer: "Our process is simple: when you deposit capital, our institutional-grade AI and expert traders use those funds to execute high-frequency trades across global markets. We manage the risk, and you receive a portion of the trading profits credited to your account every 24 hours."
  },
  {
    question: "How do I claim and withdraw my $20 registration bonus?",
    answer: "The $20 credit is added to your trading wallet immediately upon registration. To ensure platform security, this bonus becomes eligible for withdrawal at the same time you receive the payout from your first successful investment cycle."
  },
  {
    question: "How does the SECURE RISE investment process work?",
    answer: "Getting started is simple. After funding your account and activating an investment plan, your capital is allocated to our trading operations. Any eligible earnings generated from active investment plans are credited to your account balance according to the terms of your selected plan, allowing you to monitor your growth in real time."
  },
  {
    question: "Can I invest using gifted capital?",
    answer: "Yes. Gifted funds received from other members can be used to activate investment plans and participate in available opportunities. Once eligibility requirements have been met and the account qualifies for withdrawals, any available profits and approved earnings may be withdrawn according to platform policies."
  },
  {
    question: "Is there a limit to how much I can invest?",
    answer: "There is currently no maximum investment limit. Investors can choose an investment level that matches their goals, and larger portfolios may benefit from specialized allocation strategies designed to support efficient capital management."
  },
  {
    question: "Is there a limit to how much I can invest?",
    answer: "No, there is no upper limit. However, we offer different tiers of trading algorithms based on your capital size to ensure maximum efficiency and risk management for your specific portfolio."
  },
  {
    question: "Why choose SECURE RISE instead of trading on my own?",
    answer: "Many investors lack the time, experience, or technical knowledge required to trade consistently. SECURE RISE provides access to experienced market participants, strategic analysis, and continuous market monitoring, allowing members to participate in the markets without actively managing trades themselves."
  },
  {
    question: "How secure are my funds and account information?",
    answer: "Security is a top priority at SECURE RISE. We implement industry-standard security measures, encrypted communications, account protection systems, and continuous monitoring to help safeguard user accounts and sensitive information."
  },
  {
    question: "Do I need to deposit before withdrawing Capital?",
    answer: "Yes. To activate full withdrawal privileges for gifted income and promotional rewards, users are required to make at least one successful deposit. This policy helps prevent abuse of promotional programs and confirms participation as an active member of the SECURE RISE investment community."
  },
  {
    question: "Can I withdraw my initial capital at any time?",
    answer: "Yes. Your money is your control. While profit payouts happen daily, you can request a withdrawal of your available capital through your dashboard, and it will be processed directly to your preferred payment method."
  },
  {
    question: "How long do deposits take to be approved?",
    answer: "Most cryptocurrency deposits are reviewed and credited within a short period after network confirmation. Processing times may vary depending on blockchain congestion, payment method, and verification requirements."
  },
  {
    question: "How do I track my earnings?",
    answer: "Your dashboard provides real-time access to your account activity, investment status, transaction history, earnings, withdrawals, and overall portfolio performance."
  },
  {
    question: "What happens if a trade results in a loss of my capital?",
    answer: "We stand by our strategies. If a trade results in a loss of your initial capital, SECURE RISE covers it 100%. Not only do we refund your full investment immediately, but we also credit an additional 20% of your capital as compensation—fully withdrawable the moment it hits your account."
  },
  {
    question: "What payment methods are supported?",
    answer: "SECURE RISE supports multiple funding methods for global accessibility and convenience. Users can deposit using major cryptocurrencies including USDT (TRC20/ERC20), Bitcoin (BTC), and Ethereum (ETH). We also support selected gift card deposits through our approved funding channels."
  },
  {
    question: "Is SECURE RISE available internationally?",
    answer: "Yes. SECURE RISE is designed to serve users from multiple countries, allowing investors from different regions to participate using supported funding methods."
  },
  {
    question: "Can I have more than one active investment?",
    answer: "Yes. Depending on your account status and available balance, you may activate multiple investment plans simultaneously and manage them from a single dashboard."
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach our support team through the contact options available on the platform. For direct assistance, join our Telegram community at https://t.me/secure_rise or contact an administrator via Telegram: @secure_rise_trading. We are available to assist with account issues, deposits, withdrawals, investment inquiries, and technical support."
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
          Everything you need to know about the SECURE RISE ecosystem.
          From registration bonuses to our institutional-grade trading cycles.
        </p>
      </div>

      {/* Two Column Layout like the image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Left Column */}
        <div className="space-y-4">
          {faqs.slice(0, 9).map((faq, index) => (
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
          {faqs.slice(9, 18).map((faq, index) => (
            <FAQItem
              key={index + 9}
              faq={faq}
              isOpen={openIndex === index + 9}
              onClick={() => setOpenIndex(openIndex === index + 9 ? null : index + 9)}
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