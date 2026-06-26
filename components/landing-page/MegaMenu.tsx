"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  ChevronDown,
  FileText,
  Shield,
  RotateCcw,
  Phone,
  Info,
  TrendingUp,
  Star,
  LogIn,
  UserPlus,
  BookOpen,
  Lock,
  Users,
  Briefcase,
  Newspaper,
  Map,
  Coins,
  Code,
  BarChart2,
  ExternalLink,
} from "lucide-react";

// ─── Mega Menu Data ────────────────────────────────────────────────────────────

const LEARN_MORE_LINKS = [
    { label: "Privacy Policy", href: "/landing-page/privacy", icon: Lock },
    { label: "Terms & Conditions", href: "/landing-page/terms", icon: FileText },
    { label: "Refund Policy", href: "/landing-page/refund", icon: RotateCcw },
    { label: "Security", href: "/landing-page/security", icon: Shield },
    { label: "Roadmap", href: "/landing-page/roadmap", icon: Map },
    { label: "API Docs", href: "/landing-page/api-docs", icon: Code },
    { label: "Learn More", href: "/landing-page/learn-more", icon: BookOpen },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/landing-page/about", icon: Info },
  { label: "Contact Us", href: "/landing-page/contact-us", icon: Phone },
  { label: "Careers", href: "/landing-page/careers", icon: Briefcase },
  { label: "Blog / News", href: "/landing-page/blog", icon: Newspaper },
  { label: "Affiliate Program", href: "/landing-page/affiliate", icon: Users },
  { label: "Testimonials", href: "/landing-page/testimonials", icon: Star },
  { label: "FAQ", href: "/landing-page/faq", icon: HelpCircle },
];

const PLATFORM_LINKS = [
  { label: "Investment Plans", href: "/landing-page/investment-plan", icon: TrendingUp },
  { label: "Supported Crypto", href: "/landing-page/supported-crypto", icon: Coins },
  { label: "Login", href: "/auth-page/login", icon: LogIn },
  { label: "Register", href: "/auth-page/register", icon: UserPlus },
];

const TRADING_TOOLS = [
  { label: "Exness", href: "https://www.exness.com", icon: BarChart2, external: true },
  { label: "cTrader", href: "https://ctrader.com", icon: BarChart2, external: true },
  { label: "MetaTrader 5 (MT5)", href: "https://www.metatrader5.com", icon: BarChart2, external: true },
  { label: "TradeLocker", href: "https://tradelocker.com", icon: BarChart2, external: true },
  { label: "Match Trader", href: "https://matchtrader.com", icon: BarChart2, external: true },
];

interface MegaMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function MegaMenu({ isOpen, onToggle, onClose }: MegaMenuProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const aboutActive =
    pathname === "/landing-page/about" ||
    pathname === "/landing-page/privacy" ||
    pathname === "/landing-page/terms" ||
    pathname === "/landing-page/refund" ||
    pathname === "/landing-page/contact-us" ||
    pathname === "/landing-page/learn-more" ||
    pathname === "/landing-page/security" ||
    pathname === "/landing-page/faq" ||
    pathname === "/landing-page/affiliate" ||
    pathname === "/landing-page/careers" ||
    pathname === "/landing-page/blog" ||
    pathname === "/landing-page/roadmap" ||
    pathname === "/landing-page/supported-crypto" ||
    pathname === "/landing-page/api-docs" ||
    pathname === "/landing-page/testimonials";

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={menuRef}>
      {/* ABOUT US — mega menu trigger */}
      <button
        onClick={onToggle}
        className={`relative px-4 py-2 text-[14px] font-bold tracking-wide transition-all flex items-center gap-1 hover:text-foreground cursor-pointer after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:rounded-full after:transition-all after:duration-300 ${
          aboutActive || isOpen
            ? "text-foreground after:w-full after:bg-primary"
            : "text-muted-foreground after:w-0 hover:after:w-full hover:after:bg-border"
        }`}
      >
        About Us
      </button>

      {/* MEGA MENU PANEL */}
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-[1px] w-[70vw] bg-background border border-border shadow-2xl rounded-xl overflow-hidden transition-all duration-200 z-500 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="grid grid-cols-[220px_1fr] min-h-[280px]">
          {/* LEFT — branded CTA panel */}
          <div className="bg-[#229ED9] p-6 flex flex-col justify-between">
            <div>
              <p className="text-white/60 text-[10px] font-black tracking-[0.2em] uppercase mb-2">
                Secure Rise
              </p>
              <h3 className="text-white font-black text-[22px] leading-tight mb-3">
                Everything<br />you need<br />to know
              </h3>
              <p className="text-white/75 text-[12px] leading-relaxed">
                Explore our platform, policies, tools, and company pages — all in one place.
              </p>
            </div>
            <Button
              asChild
              className="mt-4 w-full bg-white text-[#229ED9] hover:bg-white/90 font-bold text-[13px] rounded-lg"
            >
              <a href="/landing-page/about">Learn More</a>
            </Button>
          </div>

          {/* RIGHT — link columns */}
          <div className="p-5 grid grid-cols-3 gap-x-4">
            {/* Column 1: Learn More */}
            <div>
              <p className="text-[10px] font-black tracking-[0.15em] uppercase text-[#229ED9] mb-3">
                Info Pages
              </p>
              <ul className="space-y-0.5">
                {LEARN_MORE_LINKS.map(({ label, href, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] font-semibold transition-colors group ${
                        pathname === href
                          ? "text-foreground bg-muted"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-[#229ED9] opacity-70 group-hover:opacity-100 transition-opacity" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Company */}
            <div>
              <p className="text-[10px] font-black tracking-[0.15em] uppercase text-[#229ED9] mb-3">
                Company
              </p>
              <ul className="space-y-0.5">
                {COMPANY_LINKS.map(({ label, href, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] font-semibold transition-colors group ${
                        pathname === href
                          ? "text-foreground bg-muted"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-[#229ED9] opacity-70 group-hover:opacity-100 transition-opacity" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Platform + Trading Tools */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[10px] font-black tracking-[0.15em] uppercase text-[#229ED9] mb-3">
                  Platform
                </p>
                <ul className="space-y-0.5">
                  {PLATFORM_LINKS.map(({ label, href, icon: Icon }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] font-semibold transition-colors group ${
                          pathname === href
                            ? "text-foreground bg-muted"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0 text-[#229ED9] opacity-70 group-hover:opacity-100 transition-opacity" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-black tracking-[0.15em] uppercase text-[#229ED9] mb-3">
                  Trading Tools
                </p>
                <ul className="space-y-0.5">
                  {TRADING_TOOLS.map(({ label, href, icon: Icon, external }) => (
                    <li key={href}>
                      <a
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors group"
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0 text-[#229ED9] opacity-70 group-hover:opacity-100 transition-opacity" />
                        {label}
                        {external && (
                          <ExternalLink className="h-2.5 w-2.5 ml-auto opacity-40 group-hover:opacity-70 transition-opacity" />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
