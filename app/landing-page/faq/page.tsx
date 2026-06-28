"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, X, Search, HelpCircle } from "lucide-react";
import GiveAway from "@/components/landing-page/GiveAway";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import CookieConsent from "@/components/landing-page/CookieConsent";
import Footer from "@/components/landing-page/Footer";

const faqs = [
  {
    question: "What is SECURE RISE?",
    answer: "SECURE RISE is an investment Trading platform designed for individuals who want exposure to the financial markets without actively trading themselves. Our experienced trading team and advanced analytical tools manage trading activities on behalf of investors, allowing members to participate in potential market opportunities while tracking their portfolio performance through a dedicated dashboard."
  },
 {
  question: "How does SECURE RISE make its money?",
  answer: "When a user deposits funds and purchases an investment plan, SECURE RISE uses those funds for trading and other revenue-generating strategies. A portion of the profits is paid to the user as their daily return, while the remaining profit is retained by the platform to cover operational costs and generate company revenue. For example, if a trading session generates $100 in profit, the user may receive $70 according to their investment plan, while SECURE RISE keeps the remaining $30."
},
  {
    question: "How do I invest?",
    answer: "To start investing, first create an account and complete the registration process. Then, deposit funds into your account using any of our supported payment methods (Paystack Bank Transfer, USDT, Bitcoin, Ethereum, or gift cards). Once your account is funded, navigate to the investment section, choose an investment plan that suits your goals, and activate it. Your capital will then be allocated to our trading operations, and you'll start receiving daily returns according to your plan's terms."
  },
  {
    question: "How do I top up my balance?",
    answer: "To top up your balance, log in to your dashboard and navigate to the deposit section. Select your preferred payment method from the available options: Paystack Bank Transfer for instant local payments, or cryptocurrencies including USDT (TRC20/ERC20), Bitcoin (BTC), and Ethereum (ETH). Follow the instructions to complete your deposit. Funds are typically credited to your account shortly after blockchain confirmation or payment processing. You can also use gift cards through our approved funding channels."
  },
  {
    question: "How can I withdrawal?",
    answer: "To withdraw funds, go to your dashboard's withdrawal section. Ensure you have met the minimum withdrawal amount of $100 and that the funds are in your withdrawable balance (not locked in active investments). Select your preferred withdrawal method, enter the amount and destination address, and confirm. All withdrawals require email OTP verification for security. Cryptocurrency withdrawals are processed within 24 hours, while bank transfers may take 3-5 business days depending on your bank."
  },
  {
    question: "How do I add money to my account?",
    answer: "Adding money to your account is simple. Log in to your dashboard, click on the 'Deposit' or 'Add Funds' button, and choose your payment method. You can use Paystack Bank Transfer for instant deposits in supported regions, or deposit cryptocurrencies like USDT, Bitcoin, or Ethereum. Follow the on-screen instructions to complete the transaction. Your funds will be credited to your account once the payment is confirmed on the blockchain or by the payment processor."
  },
  {
    question: "How do I get my money out?",
    answer: "To get your money out, navigate to the withdrawal section in your dashboard. Enter the amount you wish to withdraw (minimum $100) and your withdrawal details. Confirm the transaction and complete the email OTP verification for security. Your withdrawal will be processed within the specified timeframe: 24 hours for cryptocurrencies, 3-5 business days for bank transfers. Make sure your withdrawal address is verified to avoid delays."
  },
  {
    question: "How do I start trading?",
    answer: "SECURE RISE handles all trading activities on your behalf. You don't need to trade manually. Simply deposit funds, activate an investment plan, and our AI-powered trading system will execute trades for you. Monitor your performance through your dashboard where you can track daily returns, active investments, and overall portfolio growth. Our expert traders and algorithms work 24/7 to generate profits according to your selected investment plan."
  },
  {
    question: "How do I deposit crypto?",
    answer: "To deposit cryptocurrency, go to your dashboard's deposit section and select your preferred cryptocurrency (USDT TRC20/ERC20, Bitcoin, or Ethereum). Copy the wallet address provided or scan the QR code. Send the exact amount from your external wallet to the address shown. Wait for blockchain confirmation, which typically takes a few minutes to an hour depending on network congestion. Once confirmed, the funds will be credited to your account automatically."
  },
  {
    question: "How do I withdraw to my bank?",
    answer: "To withdraw to your bank account, select the bank transfer option in the withdrawal section. Enter your bank details including account number and routing information. Specify the withdrawal amount (minimum $100) and confirm the transaction. Bank withdrawals typically take 3-5 business days to process, depending on your bank and location. Ensure your bank details are correct to avoid processing delays or failed transactions."
  },
  {
    question: "How do I make a deposit?",
    answer: "Making a deposit is easy. After logging in, click on 'Deposit' in your dashboard. Choose your payment method from the options: Paystack Bank Transfer, USDT, Bitcoin, Ethereum, or gift cards. Enter the amount you wish to deposit and follow the payment instructions. For crypto deposits, copy the wallet address and send funds from your external wallet. For bank transfers, use the provided account details. Your deposit will be credited once payment is confirmed."
  },
  {
    question: "How do I withdraw profits?",
    answer: "Profits from your investments are credited to your withdrawable balance daily. To withdraw these profits, go to the withdrawal section in your dashboard. Enter the amount you wish to withdraw (minimum $100) and select your withdrawal method. Complete the email OTP verification for security. Your withdrawal will be processed according to the standard timeframe: 24 hours for crypto, 3-5 business days for bank transfers."
  },
  {
    question: "How do I fund my account?",
    answer: "Funding your account can be done through multiple methods. Log in and navigate to the deposit section. Choose from Paystack Bank Transfer for instant local payments, or deposit cryptocurrencies including USDT (TRC20/ERC20), Bitcoin (BTC), and Ethereum (ETH). You can also use gift cards through approved channels. Follow the instructions for your chosen method, and your funds will be credited once the payment is confirmed."
  },
  {
    question: "How do I cash out?",
    answer: "To cash out, visit the withdrawal section of your dashboard. Ensure you have at least $100 in your withdrawable balance. Select your preferred withdrawal method (cryptocurrency or bank transfer), enter the amount and destination details, and confirm. Complete the email OTP verification for security. Your cash out request will be processed within 24 hours for crypto or 3-5 business days for bank transfers."
  },
  {
    question: "How do I buy an investment plan?",
    answer: "To buy an investment plan, first ensure your account is funded. Then navigate to the investment section of your dashboard. Browse the available plans, each showing minimum deposit, duration, and daily ROI. Select a plan that matches your investment goals and budget. Click 'Activate' or 'Invest', confirm the amount, and your investment will begin. You'll start receiving daily returns according to the plan's terms starting the next day."
  },
  {
    question: "How do I get my bonus?",
    answer: "Your $20 registration bonus is automatically credited to your account upon successful registration. This bonus appears in your trading wallet immediately. To withdraw the bonus, you must first complete at least one investment cycle and receive a successful payout from that cycle. Once this condition is met, the bonus becomes part of your withdrawable balance and can be withdrawn along with your profits."
  },
  {
    question: "How do I send money to my account?",
    answer: "To send money to your account, use the deposit function in your dashboard. Select your preferred payment method and follow the provided instructions. For cryptocurrency deposits, send funds from your external wallet to the address shown. For bank transfers, transfer to the provided bank account details. Always include any reference numbers or membras specified to ensure proper crediting of your deposit."
  },
  {
    question: "How do I receive my payout?",
    answer: "Payouts from your investment plans are credited to your account automatically every 24 hours based on your plan's performance. You can view these payouts in your dashboard's transaction history. To receive the funds in your external wallet or bank account, you need to initiate a withdrawal request from the withdrawal section. The funds will then be transferred to your chosen payment method within the standard processing time."
  },
  {
    question: "How do I add funds?",
    answer: "Adding funds to your account is straightforward. Access your dashboard, click on 'Deposit' or 'Add Funds', and select your payment method. Options include Paystack Bank Transfer, USDT (TRC20/ERC20), Bitcoin, Ethereum, and gift cards. Enter the deposit amount and complete the payment using the provided instructions. Your funds will be available in your account once the payment is confirmed by the blockchain or payment processor."
  },
  {
    question: "How do I withdraw to crypto wallet?",
    answer: "To withdraw to your cryptocurrency wallet, go to the withdrawal section and select your preferred cryptocurrency (USDT TRC20/ERC20, Bitcoin, or Ethereum). Enter your wallet address and the withdrawal amount (minimum $100). Double-check the address is correct as crypto transactions cannot be reversed. Confirm the transaction and complete the email OTP verification. Your withdrawal will be processed within 24 hours after confirmation."
  },
  {
    question: "How do I check my balance?",
    answer: "Your account balance is displayed prominently on your dashboard homepage. You can see your total balance, withdrawable balance, and locked balance (funds in active investments). For detailed transaction history, navigate to the transaction or history section where you can view all deposits, withdrawals, daily returns, and other account activities with dates and amounts."
  },
  {
    question: "How do I activate a plan?",
    answer: "To activate an investment plan, ensure you have sufficient funds in your account. Go to the investment section of your dashboard, review the available plans, and select one that suits your investment goals. Click on the plan to view details, then click 'Activate' or 'Invest'. Enter the amount you wish to invest (must meet the plan's minimum), confirm the transaction, and your plan will be activated immediately."
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
    question: "Can I invest using gifted capital?",
    answer: "Yes. Gifted funds received from other members can be used to activate investment plans and participate in available opportunities. Once eligibility requirements have been met and the account qualifies for withdrawals, any available profits and approved earnings may be withdrawn according to platform policies."
  },
  {
    question: "Why choose SECURE RISE instead of trading on my own?",
    answer: "Many investors lack the time, experience, or technical knowledge required to trade consistently. SECURE RISE provides access to experienced market participants, strategic analysis, and continuous market monitoring, allowing members to participate in the markets without actively managing trades themselves."
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
    question: "What happens if a trade results in a loss of my capital?",
    answer: "We stand by our strategies. If a trade results in a loss of your initial capital, SECURE RISE covers it 100%. Not only do we refund your full investment immediately, but we also credit an additional 20% of your capital as compensation—fully withdrawable the moment it hits your account."
  },
  {
    question: "What payment methods are supported?",
    answer: "SECURE RISE supports multiple funding methods for global accessibility and convenience. Users can deposit using Paystack Bank Transfer for instant local payments in supported regions. We also accept major cryptocurrencies including USDT (TRC20/ERC20), Bitcoin (BTC), and Ethereum (ETH), as well as selected gift card deposits through our approved funding channels."
  },
  {
    question: "Can I have more than one active investment?",
    answer: "Yes. Depending on your account status and available balance, you may activate multiple investment plans simultaneously and manage them from a single dashboard."
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach our support team through the contact options available on the platform. For direct assistance, join our Telegram community at https://t.me/secure_rise or contact an administrator via Telegram: @secure_rise_trading. We are available to assist with account issues, deposits, withdrawals, investment inquiries, and technical support."
  },
  {
    question: "What are the minimum and maximum deposit amounts?",
    answer: "The minimum deposit amount varies depending on the investment plan you choose. Generally, plans start from as low as $20 for entry-level investments. Maximum deposit limits are determined by your account tier and can be increased by upgrading your account status through our verification process."
  },
  {
    question: "How do I verify my account (KYC)?",
    answer: "To complete KYC verification, navigate to your dashboard's verification section. You'll need to provide a government-issued ID (passport, driver's license, or national ID), a selfie for identity confirmation, and proof of address (utility bill or bank statement). Verification typically takes 24-48 hours."
  },
  {
    question: "What is the XP system and how does it work?",
    answer: "XP (Experience Points) are earned through daily login streaks and completing platform achievements. You can redeem accumulated XP for USDT at a rate of 50 XP = 1 USDT. This feature allows active users to earn additional rewards simply by engaging with the platform regularly."
  },
  {
    question: "How do gift transfers work?",
    answer: "Gift transfers allow you to send funds to other SECURE RISE members. When you send a gift, you earn a 5% commission instantly. The recipient can use gifted funds to activate investment plans. This feature is perfect for helping friends get started or for team building."
  },
  {
    question: "What are the different investment plans available?",
    answer: "We offer multiple investment tiers designed to accommodate different investment goals and risk appetites. Plans range from entry-level options with lower minimums to premium tiers with higher ROI potential. Each plan has specific terms regarding duration, daily returns, and withdrawal eligibility."
  },
  {
    question: "How are daily profitscalculated?",
    answer: "Daily profits are calculated based on the performance of our trading algorithms and the specific terms of your investment plan. Returns are credited to your account every 24 hours and can be tracked in real-time through your dashboard. Higher-tier plans typically offer more favorable profit structures."
  },
  {
    question: "Is my personal and financial information secure?",
    answer: "Absolutely. We employ industry-leading security measures including AES-256 encryption, two-factor authentication, and secure socket layer (SSL) technology. Your personal data is stored in compliance with GDPR and other international privacy regulations. We never share your information with third parties without your consent."
  },
  {
    question: "What countries are supported by SECURE RISE?",
    answer: "SECURE RISE operates globally with support for users in most countries. However, due to regulatory restrictions, we may not be able to serve residents of certain jurisdictions. Check our terms of service or contact support to confirm availability in your specific region."
  },
  {
    question: "How do I reset my password?",
    answer: "To reset your password, click the 'Forgot Password' link on the login page. You'll receive an email with a password reset link. Follow the instructions in the email to create a new secure password. For security reasons, the reset link expires after 1 hour."
  },
  {
    question: "Can I change my registered email address?",
    answer: "Yes, you can update your email address through your account settings. For security purposes, you'll need to verify both your current email and the new email address before the change takes effect. This ensures that only authorized users can modify account credentials."
  },
  {
    question: "What is the referral program?",
    answer: "Our referral program rewards you for bringing new users to the platform. When someone registers using your referral link and makes their first deposit, you earn a commission. Additional bonuses may be available for reaching referral milestones. Check your dashboard for your unique referral link and current commission rates."
  },
  {
    question: "How long do withdrawals take to process?",
    answer: "Withdrawal processing times vary by payment method. Cryptocurrency withdrawals are typically processed within 24 hours. Bank transfers may take 3-5 business days depending on your bank and location. All withdrawals require email OTP verification for security."
  },
  {
    question: "Are there any fees for deposits or withdrawals?",
    answer: "SECURE RISE does not charge deposit fees. For withdrawals, we cover standard processing fees, though you may be responsible for blockchain network transaction fees for cryptocurrency withdrawals. These fees vary based on network congestion and the specific cryptocurrency being withdrawn."
  },
  {
    question: "What happens if I forget my 2FA codes?",
    answer: "If you lose access to your 2FA device or codes, contact support immediately. We'll verify your identity through alternative means (such as KYC documents and security questions) before disabling 2FA and allowing you to set it up again. This process may take 24-48 hours for security verification."
  },
  {
    question: "Can I close my account?",
    answer: "Yes, you can request account closure through your dashboard or by contacting support. Before closure, ensure all investments have completed and all funds have been withdrawn. Once closed, your account cannot be reactivated, and you'll need to register as a new user if you wish to return."
  },
  {
    question: "How does the daily streak bonus work?",
    answer: "The daily streak bonus rewards consistent platform engagement. Log in every day to maintain your streak. Longer streaks earn higher XP multipliers and additional rewards. Miss a day, and your streak resets. This feature encourages regular platform interaction and helps users maximize their earnings."
  },
  {
    question: "What is the minimum withdrawal amount?",
    answer: "The minimum withdrawal amount is $100 for most payment methods. This minimum helps us maintain efficient processing and reduce transaction costs. For cryptocurrency withdrawals, the minimum may vary based on network fees and the specific cryptocurrency."
  },
  {
    question: "How do I track my investment performance?",
    answer: "Your dashboard provides comprehensive performance metrics including total deposits, active investments, daily returns, cumulative profits, and withdrawal history. Real-time charts and detailed transaction logs help you monitor your portfolio's performance at any time."
  },
  {
    question: "Can I reinvest my profits automatically?",
    answer: "Yes, we offer an auto-reinvestment feature that allows you to automatically compound your earnings. You can set a percentage of your daily profits to be reinvested into your active plans, helping accelerate your portfolio growth through compound interest."
  },
  {
    question: "What happens during market volatility?",
    answer: "Our trading algorithms are designed to navigate various market conditions, including high volatility. We employ risk management strategies to protect capital during turbulent periods. While no investment is entirely risk-free, our diversified approach helps mitigate the impact of market fluctuations."
  },
  {
    question: "How do I report a technical issue?",
    answer: "If you encounter any technical issues, please contact our support team with a detailed description of the problem, including screenshots if possible. Our technical team works around the clock to resolve issues promptly. Critical bugs affecting multiple users are prioritized for immediate resolution."
  },
  {
    question: "Are there any restrictions on withdrawals?",
    answer: "Withdrawals must meet the minimum amount requirement ($100) and can only be processed from your withdrawable balance. Funds locked in active investment plans cannot be withdrawn until the plan matures. Additionally, the welcome bonus requires completion of at least one investment cycle before withdrawal eligibility."
  },
  {
    question: "How often are investment plans updated?",
    answer: "We regularly review and update our investment plans based on market conditions, user feedback, and platform performance. New plans may be introduced, and existing plans may be modified. Users are notified of significant changes via email and dashboard announcements."
  },
  {
    question: "What is the difference between USDT TRC20 and ERC20?",
    answer: "USDT TRC20 runs on the Tron network and typically offers lower transaction fees and faster confirmation times. USDT ERC20 runs on the Ethereum network and is more widely supported by exchanges. Both are fully supported on our platform—choose based on your preference for fees versus compatibility."
  },
  {
    question: "Can I use multiple payment methods?",
    answer: "Yes, you can use multiple payment methods to fund your account. However, withdrawals are typically processed back to the same method used for deposit to comply with anti-money laundering regulations. Contact support if you need to use a different withdrawal method than your original deposit method."
  },
  {
    question: "How do I know my investment is active?",
    answer: "Your dashboard clearly displays the status of all your investments. Active plans show real-time progress, daily earnings, and remaining duration. You'll also receive email notifications when plans are activated, when daily profits are credited, and when plans complete."
  },
  {
    question: "What happens if my deposit doesn't appear?",
    answer: "If your deposit doesn't appear within the expected timeframe, first check the blockchain transaction status using your transaction ID. If confirmed on the blockchain but not credited, contact support with your transaction ID, deposit amount, and wallet address. We'll investigate and credit your account promptly."
  },
  {
    question: "Are there any age restrictions?",
    answer: "Yes, you must be at least 18 years old to use SECURE RISE. We verify age during the KYC process. Accounts found to be registered by minors will be closed, and any funds will be returned to the original payment source after verification."
  },
  {
    question: "How do I enable two-factor authentication?",
    answer: "Navigate to your account security settings and select 'Enable 2FA.' You can use an authenticator app (Google Authenticator, Authy) or receive codes via SMS. Follow the setup instructions, which include scanning a QR code or entering a setup key. Save your backup codes in a secure location."
  },
  {
    question: "What is the commission structure for gift transfers?",
    answer: "When you send a gift to another user, you earn an instant 5% commission on the gifted amount. This commission is credited to your withdrawable balance immediately. There's no limit to how many gifts you can send or how much commission you can earn through this feature."
  },
  {
    question: "Can I upgrade my investment plan mid-cycle?",
    answer: "Generally, investment plans run for their full duration without option for mid-cycle upgrades. However, you can start additional plans with higher tiers while existing plans continue. This allows you to gradually increase your investment exposure as your confidence in the platform grows."
  },
  {
    question: "How do I delete my transaction history?",
    answer: "Transaction history is maintained for regulatory compliance and security purposes and cannot be manually deleted. However, you can export your transaction records for your personal records. Historical data is retained according to our data retention policy, which complies with financial regulations."
  },
  {
    question: "What happens if SECURE RISE experiences downtime?",
    answer: "We maintain 99.9% uptime through redundant server infrastructure. In the unlikely event of downtime, trading activities are paused, and your funds remain secure. Any missed daily profits due to platform downtime are compensated once operations resume. You'll be notified of any extended outages."
  },
  {
    question: "How do I change my investment plan after activation?",
    answer: "Once an investment plan is activated, it runs for its predetermined duration. You cannot change the plan mid-cycle. However, you can activate additional plans with different parameters at any time, allowing you to diversify your investment strategy across multiple tiers."
  },
  {
    question: "Is there a mobile app available?",
    answer: "Currently, SECURE RISE is optimized for mobile web browsers and provides a fully responsive experience on all devices. We are actively developing native mobile applications for iOS and Android, which will be announced when available. The web version offers full functionality on mobile devices."
  },
  {
    question: "How do I report suspicious activity on my account?",
    answer: "If you notice any suspicious activity, immediately change your password and enable 2FA if not already active. Contact support with details of the suspicious activity. We'll investigate, secure your account, and take appropriate action. We recommend using unique passwords and never sharing your credentials."
  },
  {
    question: "What is the difference between withdrawable and locked balance?",
    answer: "Your withdrawable balance includes funds that can be withdrawn immediately, such as completed profits, commissions, and gifts. Locked balance includes funds currently invested in active plans and the welcome bonus until withdrawal conditions are met. Locked funds become withdrawable once plans complete or conditions are satisfied."
  },
  {
    question: "How do I subscribe to platform updates?",
    answer: "You can subscribe to email notifications in your account settings. We send updates about new features, plan changes, promotional offers, and important announcements. You can also follow our social media channels and join our Telegram community for real-time updates and community discussions."
  },
  {
    question: "What happens if I violate the terms of service?",
    answer: "Terms of service violations may result in account restrictions, suspension, or termination depending on severity. Common violations include fraud, bonus abuse, multiple accounts, or attempting to exploit system vulnerabilities. We review each case individually and provide notification before taking action except in cases of immediate security risk."
  },
  {
    question: "How do I provide feedback or suggestions?",
    answer: "We value user feedback and continuously improve based on your suggestions. You can submit feedback through your dashboard or contact support directly. Feature requests and suggestions are reviewed by our product team and may be implemented in future updates. Join our community channels to participate in discussions about platform improvements."
  },
  {
    question: "Are there any hidden fees?",
    answer: "SECURE RISE is transparent about all fees. We don't charge hidden fees. Deposit fees are covered by us. Withdrawal fees are limited to network transaction fees for cryptocurrencies. All fee structures are clearly displayed before you confirm any transaction. If you encounter unexpected charges, contact support immediately."
  },
  {
    question: "How do I know my funds are safe?",
    answer: "Your funds are protected through multiple layers of security: cold storage for cryptocurrency holdings, segregated accounts for user funds, regular security audits, and comprehensive insurance coverage. We maintain transparency about our security practices and financial health to build trust with our users."
  },
  {
    question: "Can I have multiple accounts?",
    answer: "No, each individual is limited to one SECURE RISE account. Multiple accounts per person violate our terms of service and may result in account suspension. If you need to manage investments for family members, each person should create their own account with proper KYC verification."
  },
  {
    question: "What is the XP redemption process?",
    answer: "To redeem XP for USDT, navigate to the XP Redemption section in your dashboard. Enter the amount of XP you wish to redeem (minimum 50 XP). The equivalent USDT amount will be calculated and credited to your withdrawable balance instantly. There's no limit on how much XP you can redeem."
  },
  {
    question: "How do I verify my withdrawal address?",
    answer: "For security, you may need to verify new withdrawal addresses. This typically involves confirming a small test transaction or providing additional documentation. Once verified, the address is saved for future withdrawals. This process helps prevent unauthorized withdrawals to unknown addresses."
  },
  {
    question: "What happens during holidays or weekends?",
    answer: "Our trading operations run 24/7, including weekends and holidays, as cryptocurrency markets never close. However, bank transfers may be delayed during banking holidays. Customer support operates with reduced hours during major holidays but maintains emergency support for critical issues."
  },
  {
    question: "How do I cancel a pending withdrawal?",
    answer: "Pending withdrawals can be cancelled through your dashboard if they haven't been processed yet. Once a withdrawal is marked as 'processing,' it cannot be cancelled and will complete normally. If you need to cancel a processed withdrawal, contact support immediately, though reversal may not be possible depending on the payment method."
  },
  {
    question: "What is the platform's policy on market manipulation?",
    answer: "SECURE RISE has zero tolerance for market manipulation. Our trading algorithms operate ethically and comply with all applicable regulations. We monitor for suspicious trading patterns and cooperate with regulatory authorities. Users attempting to manipulate markets through our platform will face immediate account termination."
  },
  {
    question: "How do I access my tax documents?",
    answer: "Tax documents are available in your dashboard's documents section. We provide annual statements detailing your deposits, withdrawals, and earnings for tax reporting purposes. Documents are generated at the end of each calendar year and can be downloaded in PDF format. Contact support if you need additional documentation."
  },
  {
    question: "What happens if I lose access to my email?",
    answer: "If you lose access to your registered email, contact support immediately with alternative verification (KYC documents, security questions). We'll help you update your email after verifying your identity. This process may take 24-48 hours for security purposes. Keep your email secure and enable 2FA for added protection."
  },
  {
    question: "How does the platform handle network congestion?",
    answer: "During periods of high network congestion, we may adjust transaction fee recommendations to ensure timely confirmations. We monitor network conditions and optimize our blockchain interactions. Deposits may take longer to confirm during congestion, but we credit accounts once blockchain confirmation is received."
  },
  {
    question: "Can I participate in beta features?",
    answer: "We occasionally offer beta access to new features for select users. Beta participants get early access to new functionality and help shape the final product through feedback. Participation is voluntary, and beta features are clearly marked. Contact support if you're interested in joining our beta program."
  },
  {
    question: "What is the platform's approach to responsible investing?",
    answer: "SECURE RISE promotes responsible investing by providing clear risk disclosures, encouraging diversification, and offering educational resources. We never guarantee returns and encourage users to invest only what they can afford to lose. Our support team can provide guidance on responsible investment strategies."
  },
  {
    question: "How do I unsubscribe from marketing emails?",
    answer: "You can unsubscribe from marketing emails by clicking the unsubscribe link at the bottom of any promotional email or through your account settings. Transactional emails (withdrawals, deposits, security alerts) cannot be disabled as they are essential for account security and operation."
  },
  {
    question: "What happens if I exceed my account tier limits?",
    answer: "Account tier limits determine maximum investment amounts and withdrawal speeds. If you reach your limits, you can request a tier upgrade through your dashboard. Upgrades may require additional verification. Higher tiers offer more favorable terms and higher limits."
  },
  {
    question: "How do I report a bug or technical error?",
    answer: "Report bugs through the support system with detailed information including steps to reproduce the issue, browser/device information, and screenshots. Our technical team prioritizes bug fixes based on severity and impact. Users who discover critical security vulnerabilities may be eligible for rewards through our bug bounty program."
  },
  {
    question: "What is the platform's policy on data retention?",
    answer: "We retain user data according to regulatory requirements and our data retention policy. Financial transaction data is retained for 7 years. Personal data is retained as long as your account is active and for a period after closure as required by law. You can request data deletion subject to legal and regulatory requirements."
  },
  {
    question: "How do I change my security questions?",
    answer: "Security questions can be updated through your account security settings. For protection, you may need to verify your identity before making changes. Choose questions with answers that are memorable but not easily guessable. Avoid using information publicly available on your social media profiles."
  },
  {
    question: "What happens if my investment plan underperforms?",
    answer: "While our algorithms aim for consistent returns, market conditions can affect performance. If a plan underperforms significantly, we may offer compensation or plan extensions at our discretion. Our capital protection policy covers losses in certain scenarios. Contact support if you have concerns about your plan's performance."
  },
  {
    question: "How do I access platform announcements?",
    answer: "Platform announcements are displayed on your dashboard homepage and sent via email for important updates. You can also check our blog, social media channels, and Telegram community for news and announcements. Major updates are always communicated through multiple channels to ensure you stay informed."
  },
  {
    question: "What is the policy on inactive accounts?",
    answer: "Accounts inactive for more than 12 months may be subject to inactivity fees or closure. We'll send warning emails before any action is taken. To keep your account active, simply log in periodically. If you need to extend your inactivity period, contact support before your account becomes inactive."
  },
  {
    question: "How do I verify my identity for large withdrawals?",
    answer: "Large withdrawals may require additional identity verification for security and compliance. This may include providing additional documentation or a live verification call. This process protects both you and the platform from fraud. Complete verification promptly to avoid withdrawal delays."
  },
  {
    question: "What happens during system maintenance?",
    answer: "Scheduled maintenance is announced in advance through email and dashboard notifications. During maintenance, some features may be temporarily unavailable, but your funds remain secure. Trading activities are paused during maintenance and resume automatically when maintenance completes. Emergency maintenance is rare but may occur without notice."
  },
  {
    question: "How do I integrate SECURE RISE with other tools?",
    answer: "We currently offer API access for enterprise users who need to integrate with their own systems. API access requires approval and additional verification. Contact our enterprise team for more information about API integration, documentation, and access requirements."
  },
  {
    question: "What is the platform's stance on regulatory compliance?",
    answer: "SECURE RISE is committed to full regulatory compliance in all jurisdictions where we operate. We maintain appropriate licenses, conduct regular compliance audits, and adapt to regulatory changes. We work with legal experts to ensure our operations meet or exceed regulatory requirements in each supported region."
  },
  {
    question: "How do I provide feedback on new features?",
    answer: "When new features are released, we collect user feedback through surveys, dashboard prompts, and community channels. Your feedback directly influences future improvements. Participate in feedback opportunities to help shape the platform's evolution. We prioritize features based on user demand and feedback."
  },
  {
    question: "What happens if I need to pause my investments?",
    answer: "Once activated, investment plans run for their full duration and cannot be paused. However, you can choose not to activate additional plans if you need a break from investing. Your existing plans will continue to completion. Consider this before activating new plans if you anticipate needing a pause."
  },
  {
    question: "How do I change my notification preferences?",
    answer: "Notification preferences can be customized in your account settings. You can choose which types of notifications you receive (email, SMS, push) and for which events (deposits, withdrawals, daily profits, announcements). Adjust these settings to stay informed without being overwhelmed by notifications."
  },
  {
    question: "What is the platform's approach to transparency?",
    answer: "We believe in full transparency about our operations, fees, and performance. Regular reports on platform performance, security practices, and financial health are available to users. We maintain open communication about changes and issues. Our community channels provide direct access to our team for questions and feedback."
  },
  {
    question: "How do I resolve disputes with other users?",
    answer: "SECURE RISE is not responsible for disputes between users regarding gifts, referrals, or other user-to-user interactions. However, if you encounter fraudulent behavior from another user, report it to support with evidence. We'll investigate and take appropriate action against users violating our terms of service."
  },
  {
    question: "What happens if I accidentally send to the wrong address?",
    answer: "Cryptocurrency transactions to incorrect addresses cannot be reversed once confirmed on the blockchain. Always double-check wallet addresses before confirming transactions. If you accidentally send to the wrong address, contact the recipient (if known) and our support, though recovery is not guaranteed."
  },
  {
    question: "How do I access educational resources?",
    answer: "We provide educational content through our blog, dashboard tutorials, and community channels. Topics include investment basics, security best practices, platform features, and market insights. Check our resources section regularly for new content. Our support team can also guide you to relevant educational materials."
  },
  {
    question: "What is the platform's policy on API usage?",
    answer: "API access is available for approved enterprise users with appropriate rate limits and usage guidelines. Unauthorized API access or abuse will result in immediate termination. API users must comply with our terms of service and may be subject to additional agreements. Contact our enterprise team for API access requests."
  },
  {
    question: "How do I report phishing attempts?",
    answer: "If you receive suspicious emails or messages claiming to be from SECURE RISE, report them immediately. Never share your credentials or click links in suspicious messages. Forward phishing attempts to our security team. We actively work to shut down phishing sites and protect our users from scams."
  },
  {
    question: "What happens during major market events?",
    answer: "Our systems are designed to handle major market events through stress-tested infrastructure and risk management protocols. During extreme volatility, we may adjust trading parameters to protect capital. Users are notified of any significant changes to operations. Historical performance during market events is available in our reports."
  },
  {
    question: "How do I change my preferred language?",
    answer: "Currently, SECURE RISE is available in English. We are working on adding support for additional languages based on user demand. If you need assistance in another language, contact support to see if translation services are available. Community members may also provide informal language support in our channels."
  },
  {
    question: "What is the platform's approach to innovation?",
    answer: "We continuously innovate by adopting new technologies, improving our algorithms, and adding features based on user needs and market trends. Our development roadmap is shaped by community feedback and industry advancements. Stay tuned for regular updates and new features that enhance your investment experience."
  },
  {
    question: "How do I escalate a support issue?",
    answer: "If your support issue isn't resolved to your satisfaction, you can request escalation through the support system. Escalated issues are reviewed by senior support staff. Provide your ticket number and details about why you're dissatisfied with the previous resolution. We aim to resolve all issues fairly and efficiently."
  },
  {
    question: "What happens if I need legal assistance?",
    answer: "SECURE RISE can provide documentation and information to assist with legal matters, but we cannot provide legal advice. For legal assistance, consult with a qualified attorney in your jurisdiction. Our terms of service include governing law and dispute resolution provisions that outline the legal framework for using our platform."
  },
  {
    question: "How do I participate in community governance?",
    answer: "We value community input on platform decisions. Participate in surveys, feedback sessions, and community discussions to share your opinions. Major platform changes may be put to community vote. Join our Telegram community and follow our channels to stay involved in governance discussions."
  },
  {
    question: "What is the platform's policy on refunds?",
    answer: "Refund requests are evaluated on a case-by-case basis. Deposits not yet allocated to investment plans may be eligible for refund within 24 hours. Once allocated to trading, funds follow the investment plan terms. Review our detailed Refund Policy for complete information about eligibility and processing."
  },
  {
    question: "How do I verify the authenticity of SECURE RISE communications?",
    answer: "Official SECURE RISE communications come from our domain (@securerise.com or official channels). Verify URLs before entering credentials. Official social media accounts are verified. If you're unsure about a communication's authenticity, contact support through official channels before taking any action."
  },
  {
    question: "What happens if I exceed withdrawal limits?",
    answer: "Withdrawal limits are based on your account tier and verification status. If you need to withdraw more than your limit, request a tier upgrade or contact support for special handling. Higher-tier accounts have increased limits and faster processing times. Plan your withdrawals accordingly or upgrade your account for better limits."
  },
  {
    question: "How do I access my investment certificates?",
    answer: "Investment certificates are available in your dashboard documents section once plans are activated. These certificates serve as proof of your investment and include plan details, terms, and activation date. Download and save these documents for your records. Certificates are automatically generated for each active plan."
  },
  {
    question: "What is the platform's approach to customer satisfaction?",
    answer: "Customer satisfaction is our top priority. We measure satisfaction through feedback, support ratings, and retention metrics. Our support team is empowered to resolve issues fairly. We continuously improve based on your feedback and strive to exceed expectations in every interaction."
  },
  {
    question: "How do I change my time zone settings?",
    answer: "Your dashboard displays times in your local time zone based on your browser settings. For accuracy, ensure your device time zone is set correctly. If you notice incorrect time displays, check your browser settings or contact support. All timestamps are also available in UTC for reference."
  },
  {
    question: "What happens during platform upgrades?",
    answer: "Platform upgrades are announced in advance and scheduled during low-traffic periods when possible. During upgrades, there may be brief service interruptions. We work to minimize disruption and ensure data integrity. Post-upgrade, we monitor closely for issues and provide support for any upgrade-related questions."
  },
  {
    question: "How do I provide testimonials?",
    answer: "We welcome user testimonials and success stories. Submit your testimonial through the dashboard or contact support. Approved testimonials may be featured on our website with your permission. We respect your privacy and only share testimonials with your explicit consent."
  },
  {
    question: "What is the platform's policy on intellectual property?",
    answer: "All SECURE RISE content, including software, designs, and materials, is protected by intellectual property laws. Users may not copy, modify, or redistribute our content without permission. Feedback and suggestions you provide may be used to improve the platform. By submitting feedback, you grant us a license to use it."
  },
  {
    question: "How do I handle tax reporting for my investments?",
    answer: "We provide annual tax statements summarizing your investment activity. However, we cannot provide tax advice. Consult with a qualified tax professional in your jurisdiction to understand your tax obligations. Tax laws vary by country and individual circumstances. Keep records of all transactions for tax purposes."
  },
  {
    question: "What happens if I need to change my legal name?",
    answer: "If your legal name changes (marriage, legal change), contact support with documentation proving the change (marriage certificate, court order). We'll update your records after verification. This may require re-verification of your identity. Keep your account information current to avoid issues with withdrawals."
  },
  {
    question: "How do I access platform performance metrics?",
    answer: "Platform performance metrics are available in our reports section and shared periodically with the community. These include overall ROI, uptime statistics, user growth, and other key metrics. Individual performance is always available in your dashboard. We believe transparency builds trust."
  },
  {
    question: "What is the platform's approach to security audits?",
    answer: "We conduct regular security audits by third-party firms to identify and address vulnerabilities. Audit results inform our security improvements. Critical findings are addressed immediately. We maintain a bug bounty program to encourage responsible disclosure of security issues by researchers."
  },
  {
    question: "How do I change my referral link?",
    answer: "Your referral link is unique to your account and cannot be changed. This ensures tracking accuracy for referral commissions. If you need multiple tracking links for different campaigns, contact support to discuss enterprise solutions. Your existing link remains valid for all referrals."
  },
  {
    question: "What happens if I encounter a scam claiming to be SECURE RISE?",
    answer: "Report any scams or fraudulent schemes claiming to be SECURE RISE immediately. We actively work to shut down impersonators and protect our users. Never share your credentials or send funds to unofficial channels. Verify all communications through official channels before taking action."
  },
  {
    question: "How do I access platform status updates?",
    answer: "Platform status is available on our status page and displayed in your dashboard. We provide real-time information about system performance, ongoing issues, and scheduled maintenance. Subscribe to status notifications to receive alerts about platform availability and performance."
  },
  {
    question: "What is the platform's policy on user data portability?",
    answer: "You can request a copy of your personal data through your dashboard or by contacting support. We provide data in machine-readable formats within 30 days of request. This right is part of our commitment to GDPR compliance and data transparency. Contact support for data export requests."
  },
  {
    question: "How do I handle disputes about transaction amounts?",
    answer: "If you believe a transaction amount is incorrect, contact support immediately with transaction details. We'll investigate and correct any errors. Keep records of your transactions for reference. Disputes must be reported within 30 days of the transaction for timely resolution."
  },
  {
    question: "What happens during regulatory changes?",
    answer: "We monitor regulatory changes in all jurisdictions where we operate. When regulations change, we adapt our operations to maintain compliance. Users are notified of changes that affect them. Some regulatory changes may require updates to our terms of service or available features."
  },
  {
    question: "How do I access platform documentation?",
    answer: "Platform documentation is available in our help center and dashboard. Topics include getting started guides, feature explanations, security best practices, and troubleshooting. Documentation is regularly updated. If you can't find answers in documentation, contact support for personalized assistance."
  },
  {
    question: "What is the platform's approach to user privacy?",
    answer: "User privacy is fundamental to our operations. We collect only necessary data, obtain consent for data processing, and never sell your information. Our privacy policy details how we handle your data. You have rights to access, correct, and delete your personal data subject to legal requirements."
  },
  {
    question: "How do I change my dashboard layout?",
    answer: "Dashboard layout customization options are available in your settings. You can rearrange widgets, choose which information displays prominently, and set your preferred view. These settings are saved and applied each time you log in. Contact support if you need help with dashboard customization."
  },
  {
    question: "What happens if I need to verify my identity multiple times?",
    answer: "Additional identity verification may be required for security reasons, large transactions, or regulatory compliance. This is normal and protects your account. Provide requested documentation promptly to avoid delays. Enhanced verification may be required periodically as part of our security protocols."
  },
  {
    question: "How do I access platform news and updates?",
    answer: "Platform news is available on our blog, dashboard announcements, and social media channels. Subscribe to email notifications for important updates. Our Telegram community also shares news and allows discussion about platform developments. Stay informed through multiple channels."
  },
  {
    question: "What is the platform's policy on account sharing?",
    answer: "Account sharing is prohibited. Each account must be used by only the registered individual. Sharing accounts violates our terms of service and may result in suspension. If you need to manage investments for family members, each person should have their own account with proper verification."
  },
  {
    question: "How do I handle issues with gift transfers?",
    answer: "If a gift transfer fails or has issues, contact support with transaction details. Common issues include incorrect recipient information, insufficient balance, or network problems. We'll investigate and resolve the issue. Ensure recipient information is correct before sending gifts."
  },
  {
    question: "What happens if I need to close my account during an active investment?",
    answer: "Account closure during active investments requires completion of all investment cycles first. Funds locked in active plans cannot be withdrawn until plans complete. Once all investments mature and funds are withdrawn, you can proceed with account closure through your dashboard or by contacting support."
  },
  {
    question: "How do I access platform analytics?",
    answer: "Your dashboard provides personal analytics including investment performance, profit trends, and activity history. Platform-wide analytics are shared in reports. For detailed custom analytics, contact our enterprise team. Analytics help you make informed investment decisions."
  },
  {
    question: "What is the platform's approach to user education?",
    answer: "We believe educated users make better investment decisions. Our educational resources cover investment basics, security practices, and platform features. We regularly add new content. Participate in webinars and community discussions to enhance your knowledge. Education is key to successful investing."
  },
  {
    question: "How do I change my notification delivery method?",
    answer: "Notification delivery preferences can be set in your account settings. Choose between email, SMS, push notifications, or in-app alerts for different types of notifications. Customize these to match your preferences and ensure you never miss important updates about your account."
  },
  {
    question: "What happens if I encounter bugs in new features?",
    answer: "Report bugs in new features through support with details about the issue. Our development team prioritizes fixing bugs in recently released features. Your feedback helps us improve. We may offer compensation for significant bugs that affect your investments. Report promptly for quick resolution."
  },
  {
    question: "How do I access platform roadmap?",
    answer: "Our platform roadmap is shared with the community and updated regularly. It outlines planned features, improvements, and timeline. Roadmap items may change based on priorities and feedback. Participate in discussions about roadmap items to influence development priorities."
  },
  {
    question: "What is the platform's policy on communication channels?",
    answer: "Official communication channels include email, dashboard announcements, Telegram, and verified social media accounts. Only trust information from these official channels. Unofficial channels may contain misinformation. Verify important information through official sources."
  },
  {
    question: "How do I handle issues with 2FA?",
    answer: "If you have 2FA issues, first ensure your device time is synchronized. If problems persist, use backup codes if available. If all 2FA methods fail, contact support for identity verification and 2FA reset. This process may take 24-48 hours for security. Keep backup codes stored securely."
  },
  {
    question: "What happens if I need to update my KYC documents?",
    answer: "KYC documents may need updating if they expire or if information changes. Submit updated documents through the verification section. We'll review and update your records. Expired documents may affect your ability to withdraw, so keep them current. Contact support if you need help with document updates."
  },
  {
    question: "How do I access platform statistics?",
    answer: "Platform statistics are available in our reports and shared periodically. These include user growth, total investments processed, average returns, and other metrics. Your personal statistics are always available in your dashboard. Statistics help you understand platform performance and trends."
  },
  {
    question: "What is the platform's approach to user feedback implementation?",
    answer: "User feedback directly influences our development priorities. We regularly review feedback from surveys, support tickets, and community discussions. Features with high user demand are prioritized. We communicate when feedback leads to changes. Your voice matters in shaping the platform."
  },
  {
    question: "How do I change my account tier?",
    answer: "Account tier upgrades are available through your dashboard. Higher tiers offer increased limits, better terms, and additional features. Upgrades may require additional verification. Review tier benefits before upgrading. Contact support if you need guidance on which tier is right for you."
  },
  {
    question: "What happens if I have questions not covered in FAQ?",
    answer: "If your question isn't covered in our FAQ, contact our support team. We're happy to help with any questions about the platform. You can reach support through the dashboard, Telegram, or email. We continuously update our FAQ based on common questions, so your question may be added in the future."
  }
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const query = searchQuery.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      <GiveAway />
      <Header />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative h-[30vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://i.postimg.cc/MTCrwDhY/4.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/90" />

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto mt-20">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 backdrop-blur-sm px-4 py-1.5 mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
              Support Center
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-5 text-white leading-none"
          >
            Frequently Asked{" "}
            <span className="text-primary">Questions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="text-sm md:text-base font-light tracking-wide text-white/60 max-w-lg mx-auto leading-relaxed"
          >
            Find answers to common questions about SECURE RISE. From account setup to withdrawals, we've got you covered.
          </motion.p>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
          >
            <span className="text-[9px] uppercase tracking-[0.25em] text-white/35 font-medium">
              Scroll
            </span>
            <div className="w-[1px] h-7 bg-gradient-to-b from-white/35 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ── Search Section ──────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12 w-full">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 ring-primary/20 outline-none shadow-lg"
            />
          </div>
          {searchQuery && (
            <p className="text-center text-muted-foreground text-sm mt-3">
              Found {filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'} for "{searchQuery}"
            </p>
          )}
        </div>
      </section>

      {/* ── FAQ Section ─────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-24 w-full">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-16">
            <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No results found</h3>
            <p className="text-muted-foreground">Try adjusting your search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFAQs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        )}
      </section>

      <ThemeAndScroll />
      <CookieConsent />
      <Footer />
    </main>
  );
}

function FAQItem({ faq, isOpen, onClick }: { faq: any; isOpen: boolean; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group transition-all duration-300 rounded-2xl border ${
        isOpen
          ? "bg-card border-primary shadow-xl shadow-primary/5"
          : "bg-card/40 border-primary/10 hover:border-primary/30"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center cursor-pointer justify-between p-5 lg:p-6 text-left"
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
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-6 pb-6">
            <div className="h-px bg-primary/10 mb-4" />
            <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
              {faq.answer}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
