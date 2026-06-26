"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Montserrat } from "next/font/google";
import {
  Menu,
  X,
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

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

// ─── Mega Menu Data ────────────────────────────────────────────────────────────

const LEARN_MORE_LINKS = [
  { label: "Learn More", href: "/landing-page/learn-more", icon: BookOpen },
  { label: "Privacy Policy", href: "/landing-page/privacy", icon: Lock },
  { label: "Terms & Conditions", href: "/landing-page/terms", icon: FileText },
  { label: "Refund Policy", href: "/landing-page/refund", icon: RotateCcw },
  { label: "Security", href: "/landing-page/security", icon: Shield },
  { label: "Roadmap", href: "/landing-page/roadmap", icon: Map },
  { label: "API Docs", href: "/landing-page/api-docs", icon: Code },
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

// ─── Component ─────────────────────────────────────────────────────────────────

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleMegaEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMegaOpen(true);
  };

  const handleMegaLeave = () => {
    timeoutRef.current = setTimeout(() => setMegaOpen(false), 120);
  };

  /* Desktop pill styles */
  const desktopLinkStyles = (href: string, exact: boolean = true) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return `relative px-4 py-2 text-[14px] font-bold tracking-wide transition-all flex items-center hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:rounded-full after:transition-all after:duration-300 ${
      isActive
        ? "text-foreground after:w-full after:bg-primary"
        : "text-muted-foreground hover:bg-transparent after:w-0 hover:after:w-full hover:after:bg-border"
    }`;
  };

  /* Mobile underline styles */
  const mobileLinkStyles = (href: string, exact: boolean = true) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return `relative flex items-center gap-3 px-0 pt-3.5 pb-2.5 text-[15px] font-bold tracking-wide transition-colors
      border-b border-border/40 last:border-b-0
      after:absolute after:bottom-0 after:left-0 after:h-[1px] after:rounded-full after:transition-all after:duration-300
      ${
        isActive
          ? "text-foreground after:w-full after:bg-primary"
          : "text-muted-foreground hover:text-foreground after:w-0 hover:after:w-full hover:after:bg-border"
      }`;
  };

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

  return (
    <header className="fixed top-7 lg:top-9 left-0 right-0 z-[100] bg-background border-b border-border">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 md:h-15">
          {/* LOGO */}
          <Link href="/">
            <span
              className={`${montserrat.className} 
            text-[20px] md:text-2xl font-black italic tracking-tight bg-gradient-to-b from-foreground
            to-foreground/40 bg-clip-text text-transparent uppercase`}
            >
              SECURE<span className="text-[#229ED9]"> RISE</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center">
            <Link
              href="/landing-page/investment-plan"
              className={desktopLinkStyles("/landing-page/investment-plan")}
            >
              Trading Plans
            </Link>
            <Link
              href="/landing-page/predict"
              onClick={closeMobileMenu}
              className={desktopLinkStyles("/landing-page/predict")}
            >
              Predict Market
            </Link>

            {/* ABOUT US — mega menu trigger */}
            <div
              className="relative"
              onMouseEnter={handleMegaEnter}
              onMouseLeave={handleMegaLeave}
            >
              <button
                className={`relative px-4 py-2 text-[14px] font-bold tracking-wide transition-all flex items-center gap-1 hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:rounded-full after:transition-all after:duration-300 ${
                  aboutActive || megaOpen
                    ? "text-foreground after:w-full after:bg-primary"
                    : "text-muted-foreground after:w-0 hover:after:w-full hover:after:bg-border"
                }`}
              >
                About Us
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* MEGA MENU PANEL */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-[1px] w-[780px] bg-background border border-border shadow-2xl rounded-xl overflow-hidden transition-all duration-200 ${
                  megaOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
                onMouseEnter={handleMegaEnter}
                onMouseLeave={handleMegaLeave}
              >
                {/* TOP ACCENT BAR */}
                <div className="h-[3px] bg-gradient-to-r from-[#229ED9] via-[#229ED9]/60 to-transparent" />

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
                      <Link href="/landing-page/about">Learn More</Link>
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

            <Link
              href="/landing-page/learn-more"
              className={desktopLinkStyles("/landing-page/learn-more")}
            >
              Learn More
            </Link>
          </nav>

          {/* RIGHT SECTION: AUTH */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                asChild
                variant="ghost"
                className="px-5 py-5 text-[14px] font-bold cursor-pointer"
              >
                <Link href="/auth-page/login">Sign In</Link>
              </Button>

              <Button
                asChild
                className="px-4 py-5 text-[14px] font-bold rounded-lg cursor-pointer"
              >
                <Link href="/auth-page/register">Start Investing</Link>
              </Button>
            </div>

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-foreground"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU BACKDROP */}
      <div
        onClick={closeMobileMenu}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed right-0 top-0 h-full w-full bg-background border-l border-border shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-[#229ED9] font-black tracking-widest text-xs opacity-50 uppercase">
              Menu
            </span>
            <button
              onClick={closeMobileMenu}
              className="p-2 hover:bg-muted rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col">
            <Link
              href="/landing-page/investment-plan"
              onClick={closeMobileMenu}
              className={mobileLinkStyles("/landing-page/investment-plan")}
            >
              Trading Plans
            </Link>
            <Link
              href="/landing-page/predict"
              onClick={closeMobileMenu}
              className={mobileLinkStyles("/landing-page/predict")}
            >
              Predict Market
            </Link>
            <Link
              href="/landing-page/contact-us"
              onClick={closeMobileMenu}
              className={mobileLinkStyles("/landing-page/contact-us")}
            >
              Contact Page
            </Link>
            <Link
              href="/landing-page/learn-more"
              onClick={closeMobileMenu}
              className={mobileLinkStyles("/landing-page/learn-more")}
            >
              Learn More
            </Link>
            <Link
              href="/landing-page/about"
              onClick={closeMobileMenu}
              className={mobileLinkStyles("/landing-page/about")}
            >
              About Secure Rise
            </Link>
            <Link
              href="/landing-page/privacy"
              onClick={closeMobileMenu}
              className={mobileLinkStyles("/landing-page/privacy")}
            >
              Privacy Policy
            </Link>
            <Link
              href="/landing-page/refund"
              onClick={closeMobileMenu}
              className={mobileLinkStyles("/landing-page/refund")}
            >
              Refund Policy
            </Link>
            <Link
              href="/landing-page/terms"
              onClick={closeMobileMenu}
              className={mobileLinkStyles("/landing-page/terms")}
            >
              Terms &amp; Conditions
            </Link>
            <button
              onClick={() => {
                closeMobileMenu();
                const faqSection = document.getElementById("faq");
                if (faqSection) {
                  faqSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="relative flex items-center gap-3 px-1 py-3.5 text-[15px] font-bold tracking-wide transition-colors border-b border-border/40 last:border-b-0 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <HelpCircle className="w-5 h-5" />
              Frequently Asked Questions
            </button>
          </nav>

          {/* Auth buttons */}
          <div className="mt-auto flex flex-col gap-3 border-t border-border pt-6">
            <Button
              variant="outline"
              asChild
              className="py-6 rounded-xl text-sm font-bold"
            >
              <Link href="/auth-page/login" onClick={closeMobileMenu}>
                Login Account
              </Link>
            </Button>
            <Button asChild className="py-6 rounded-xl text-sm font-bold">
              <Link href="/auth-page/register" onClick={closeMobileMenu}>
                Create Account
              </Link>
            </Button>
            <p className="text-center text-[11px] text-muted-foreground mt-2 px-4">
              By joining, you agree to our Terms of Service and Risk Disclosure.
            </p>
          </div>
        </div>
      </aside>
    </header>
  );
}