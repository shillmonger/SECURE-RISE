"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import {
  Youtube,
  Twitter,
  Send,
  Instagram,
  LineChart,
  ShieldCheck,
  Wallet,
  Activity,
  Cpu
} from "lucide-react";
import { FaDiscord } from "react-icons/fa6";
import Translator from "@/components/landing-page/translator";


const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});


export default function Footer() {
  const socialLinks = [
    { name: "Telegram", icon: <Send size={20} />, href: "https://t.me/+2J3hQtWxTbVlZjVk" },
    { name: "Discord", icon: <FaDiscord size={20} />, href: "#" },
    { name: "Instagram", icon: <Instagram size={20} />, href: "#" },
    { name: "X (Twitter)", icon: <Twitter size={20} />, href: "#" },
    { name: "YouTube", icon: <Youtube size={20} />, href: "#" },
  ];

  return (
    <footer className="bg-background border-t border-border text-foreground pb-10 pt-7 px-4 md:px-16 relative">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 md:gap-8 lg:gap-24">
        
        {/* Logo + Platform Description */}
        <div className="flex flex-col space-y-6 md:col-span-4 lg:col-span-2">
          <div>
            <Link href="/" className="flex items-center gap-3 group">
  {/* Text Logo */}
  <span
    className={`${montserrat.className} 
    text-2xl md:text-3xl font-black italic tracking-tight 
    bg-gradient-to-b from-foreground to-foreground/40 
    bg-clip-text text-transparent uppercase`}
  >
    SECURE<span className="text-[#229ED9]"> RISE</span>
  </span>
</Link>
           <p className="mt-5 leading-relaxed text-muted-foreground max-w-sm">
  SECURE RISE is a managed investment platform connecting your capital with experienced traders to generate consistent returns in global markets.
</p>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-primary font-bold uppercase tracking-wider text-sm mb-4">
              Join Our Community
            </h3>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="p-2 bg-secondary/50 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm border border-border"
                  title={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Trading Tools Section */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-[18px] font-bold uppercase tracking-tight flex items-center gap-2 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
            Trading Tools
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="#" className="text-[15px] hover:text-primary transition-colors text-muted-foreground">C Trader</Link></li>
            <li><Link href="#" className="text-[15px] hover:text-primary transition-colors text-muted-foreground">Exness Broker</Link></li>
            <li><Link href="#" className="text-[15px] hover:text-primary transition-colors text-muted-foreground">Google Cloud VPS</Link></li>
            <li><Link href="#" className="text-[15px] hover:text-primary transition-colors text-muted-foreground">MetaTrader 5 (MT5)</Link></li>
            <li><Link href="#" className="text-[15px] hover:text-primary transition-colors text-muted-foreground">Trade Locker</Link></li>
            <li><Link href="#" className="text-[15px] hover:text-primary transition-colors text-muted-foreground">Match Trader ETC</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-[18px] font-bold uppercase tracking-tight bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">Investor Area</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/landing-page/investment-plan" className="text-[15px] hover:text-primary transition-colors text-muted-foreground">Investment Plans</Link></li>
            <li><Link href="/landing-page/about" className="text-[15px] hover:text-primary transition-colors text-muted-foreground">About Secure Rise</Link></li>
            <li><Link href="/landing-page/privacy" className="text-[15px] hover:text-primary transition-colors text-muted-foreground">Privacy Policy</Link></li>
            <li><Link href="/landing-page/security" className="text-[15px] hover:text-primary transition-colors text-muted-foreground">Security Policy</Link></li>
            <li><Link href="/landing-page/refund" className="text-[15px] hover:text-primary transition-colors text-muted-foreground">Refunds Policy</Link></li>
            <li><Link href="/landing-page/terms" className="text-[15px] hover:text-primary transition-colors text-muted-foreground">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Supported Wallets Section */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-[18px] font-bold uppercase tracking-tight bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
            Our Pages
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/landing-page/blog" className="text-[15px] hover:text-primary transition-colors text-muted-foreground">Blog / News</Link></li>
            <li><Link href="/landing-page/learn-more" className="text-[15px] hover:text-primary transition-colors text-muted-foreground">Learn More</Link></li>
            <li><Link href="/auth-page/login" className="text-[15px] hover:text-primary transition-colors text-muted-foreground">Investor Signin</Link></li>
            <li><Link href="/auth-page/register" className="text-[15px] hover:text-primary transition-colors text-muted-foreground">Investor Signup</Link></li>
            <li><Link href="/landing-page/contact-us" className="text-[15px] hover:text-primary transition-colors text-muted-foreground">Contact Support</Link></li>
            <li><Link href="/landing-page/testimonials" className="text-[15px] hover:text-primary transition-colors text-muted-foreground">Traders Testimonials</Link></li>
          </ul>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-[1400px] mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border pt-12">
        <div className="flex items-center gap-4 text-muted-foreground">
          <ShieldCheck className="text-primary" size={32} />
          <div>
            <h4 className="font-bold text-foreground text-sm uppercase">Secured Capital</h4>
            <p className="text-xs">Funds are managed in segregated Tier-1 bank accounts.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <Cpu className="text-primary" size={32} />
          <div>
            <h4 className="font-bold text-foreground text-sm uppercase">AI Integration</h4>
            <p className="text-xs">Smart algorithms execute trades at millisecond speeds.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <Activity className="text-primary" size={32} />
          <div>
            <h4 className="font-bold text-foreground text-sm uppercase">Instant Accruals</h4>
            <p className="text-xs">Profits are calculated and credited to your wallet daily.</p>
          </div>
        </div>
      </div>

      {/* Financial Disclaimer */}
      <div className="max-w-[1400px] mx-auto mt-16 space-y-8 text-[12px] leading-relaxed text-muted-foreground/70 border-t border-border pt-12">
        <div className="space-y-4">
          <p className="text-sm">
            <span className="font-bold text-foreground">RISK DISCLOSURE:</span> Trading Foreign Exchange (Forex) and CFDs on margin carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to invest in SECURE RISE, you should carefully consider your investment objectives, level of experience, and risk appetite.
          </p>

          <p className="text-sm">
            SECURE RISE provides a managed trading environment. Past performance is not indicative of future results. We do not guarantee specific profit margins, and users should only invest capital they can afford to lose.
          </p>
        </div>

        <div className="space-y-2 border-t border-border/20 pt-8">
          <p className="font-bold text-foreground uppercase tracking-widest text-[10px]">
            Regulatory Compliance
          </p>
          <p className="text-sm">
            SECURE RISE operates as a registered financial technology provider. We adhere to KYC (Know Your Customer) and AML (Anti-Money Laundering) protocols to ensure a secure and transparent ecosystem for our global users. All data is encrypted via SSL protocols.
          </p>
        </div>
      </div>

      {/* Final Copyright */}
      <div className="max-w-[1400px] mx-auto border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <p>© {new Date().getFullYear()} SECURE RISE — Elevating Wealth Safely.</p>
          <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-x-4 gap-y-2 text-[12px]">
  <Link href="/landing-page/privacy" className="underline hover:text-primary whitespace-nowrap">
    Privacy Policy
  </Link>
  <Link href="/landing-page/terms" className="underline hover:text-primary whitespace-nowrap">
    Investor Agreement
  </Link>
  <Link href="/landing-page/refund" className="underline hover:text-primary whitespace-nowrap">
    Refunds Policy
  </Link>
  <Link href="/landing-page/security" className="underline hover:text-primary whitespace-nowrap">
    Security Policy
  </Link>
</div>
        </div>
        <p className="italic text-xs text-center md:text-right max-w-md opacity-60">
          All investments carry risk. SECURE RISE is not a licensed bank but a private investment platform. 
          Use of this site constitutes acceptance of our Risk Disclosure.
        </p>
      </div>

  <Translator />

    </footer>
  );
}