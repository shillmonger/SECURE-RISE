"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ─── Images ───────────────────────────────────────────────────────────────────

const BANNER_IMAGES = [
  {
    src: "https://i.postimg.cc/gkW8VrZk/Banner-1.jpg",
    caption: "Smart Trading Starts Here",
    sub: "Powered by real-time market intelligence",
  },
  {
    src: "https://i.postimg.cc/jS8fYX3G/Banner-2.jpg",
    caption: "Trade Smarter, Not Harder",
    sub: "Advanced insights for every market move",
  },
  {
    src: "https://i.postimg.cc/7LdTfLkX/Banner-3.jpg",
    caption: "Master Every Market",
    sub: "Professional tools built for consistent growth",
  },
  {
    src: "https://i.postimg.cc/15BnDBSY/Banner-4.webp",
    caption: "Your Edge in the Markets",
    sub: "Precision signals backed by data-driven analysis",
  },
  {
    src: "https://i.postimg.cc/gjdjZXBs/Banner-5.jpg",
    caption: "Predict. Earn. Rise.",
    sub: "Earn daily XP rewards for accurate predictions",
  },
  {
    src: "https://i.postimg.cc/Zqd5sFG6/Banner-6.jpg",
    caption: "Grow With Confidence",
    sub: "Protect your capital while maximizing opportunities",
  },
];

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

// ─── Types ────────────────────────────────────────────────────────────────────

interface MegaMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MegaMenu({ isOpen, onToggle, onClose }: MegaMenuProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSlide(index);
      setIsTransitioning(false);
    }, 200);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((activeSlide + 1) % BANNER_IMAGES.length);
  }, [activeSlide, goTo]);

  const prev = useCallback(() => {
    goTo((activeSlide - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length);
  }, [activeSlide, goTo]);

  // Auto-advance only while menu is open
  useEffect(() => {
    if (isOpen) {
      intervalRef.current = setInterval(next, 3500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen, next]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const aboutActive =
    [
      "/landing-page/about", "/landing-page/privacy", "/landing-page/terms",
      "/landing-page/refund", "/landing-page/contact-us", "/landing-page/learn-more",
      "/landing-page/security", "/landing-page/faq", "/landing-page/affiliate",
      "/landing-page/careers", "/landing-page/blog", "/landing-page/roadmap",
      "/landing-page/supported-crypto", "/landing-page/api-docs", "/landing-page/testimonials",
    ].includes(pathname);

  const slide = BANNER_IMAGES[activeSlide];

  return (
    <div className="relative" ref={menuRef}>
      {/* TRIGGER BUTTON */}
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
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-[1px] w-[1080px] bg-background border border-border shadow-2xl rounded-xl overflow-hidden transition-all duration-200 z-[500] ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="grid grid-cols-[280px_1fr] min-h-[320px]">

          {/* ── LEFT: Image carousel panel ── */}
          <div className="relative bg-[#0d1117] overflow-hidden flex flex-col">

            {/* Image */}
            <div className="relative flex-1 min-h-[200px]">
              <img
                key={activeSlide}
                src={slide.src}
                alt={slide.caption}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  isTransitioning ? "opacity-0" : "opacity-100"
                }`}
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Caption */}
              <div
                className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
                  isTransitioning ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
                }`}
              >
                <p className="text-white font-black text-[15px] leading-tight mb-0.5">
                  {slide.caption}
                </p>
                <p className="text-white/65 text-[11px] leading-relaxed">
                  {slide.sub}
                </p>
              </div>

              {/* Prev / Next arrows */}
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-2 top-1/2 cusor-pointer -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-2 top-1/2 cusor-pointer -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* Bottom CTA strip */}
            <div className="bg-[#229ED9] px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                {BANNER_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeSlide ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <Button
                asChild
                size="sm"
                className="bg-white text-[#229ED9] hover:bg-white/90 font-bold text-[12px] rounded-md h-7 px-3"
              >
                <Link href="/landing-page/about">Explore</Link>
              </Button>
            </div>
          </div>



          {/* ── RIGHT: Link columns ── */}
          <div className="p-5 grid grid-cols-3 gap-x-5">

            {/* Column 1: Info Pages */}
            <div>
              <p className="text-[10px] font-black tracking-[0.15em] uppercase text-[#229ED9] mb-3">
                Info Pages
              </p>
              <ul className="space-y-1">
                {LEARN_MORE_LINKS.map(({ label, href, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onClose}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[15px] font-semibold transition-colors group ${
                        pathname === href
                          ? "text-foreground bg-muted"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
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
              <ul className="space-y-1">
                {COMPANY_LINKS.map(({ label, href, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onClose}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[15px] font-semibold transition-colors group ${
                        pathname === href
                          ? "text-foreground bg-muted"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
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
                <ul className="space-y-1">
                  {PLATFORM_LINKS.map(({ label, href, icon: Icon }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={onClose}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[15px] font-semibold transition-colors group ${
                          pathname === href
                            ? "text-foreground bg-muted"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
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
                <ul className="space-y-1">
                  {TRADING_TOOLS.map(({ label, href, icon: Icon, external }) => (
                    <li key={href}>
                      <a
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        onClick={onClose}
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