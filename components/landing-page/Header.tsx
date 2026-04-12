"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Montserrat } from "next/font/google";
import {
  Menu,
  X,
  MessagesSquare ,
  MessageCircle,
  Info,
  Home,
  Headset,
  Briefcase,
} from "lucide-react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  /* Desktop pill styles — unchanged */
  const desktopLinkStyles = (href: string, exact: boolean = true) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return `px-4 py-2 text-[14px] font-bold tracking-wide transition-all rounded-full flex items-center hover:text-foreground ${
      isActive
        ? "text-foreground bg-black/[0.08] dark:bg-white/[0.1] shadow-sm"
        : "text-muted-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
    }`;
  };

  /* Mobile underline styles */
  const mobileLinkStyles = (href: string, exact: boolean = true) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return `relative flex items-center gap-3 px-1 py-3.5 text-[15px] font-bold tracking-wide transition-colors
      border-b border-border/40 last:border-b-0
      after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-300
      ${
        isActive
          ? "text-foreground after:w-full after:bg-primary"
          : "text-muted-foreground hover:text-foreground after:w-0 hover:after:w-full hover:after:bg-border"
      }`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-17">
          {/* LOGO */}
          <Link href="/">
            <span
              className={`${montserrat.className} 
            text-[20px] md:text-2xl font-black italic tracking-tight bg-gradient-to-b from-foreground
            to-foreground/40 bg-clip-text text-transparent uppercase`}
            >
              SECURE RISE
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-1 bg-black/[0.02] dark:bg-white/[0.02] border border-border/50 px-2 py-1.5 rounded-full">
            <Link
              href="/landing-page/investment-plan"
              className={desktopLinkStyles("/landing-page/investment-plan")}
            >
              Investments
            </Link>
            <Link
              href="/landing-page/about"
              className={desktopLinkStyles("/landing-page/about")}
            >
              About Us
            </Link>
            <Link
              href="/landing-page/testimonials"
              className={desktopLinkStyles("/landing-page/testimonials")}
            >
              Testimonials
            </Link>
            <Link
              href="/landing-page/contact-us"
              className={desktopLinkStyles("/landing-page/contact-us")}
            >
              Contact Page
            </Link>
          </nav>

          {/* RIGHT SECTION: AUTH */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                asChild
                className="relative px-3 py-3 bg-gray-200 text-black hover:bg-gray-300 border-none shadow-none cursor-pointer overflow-visible"
              >
                <Link
                  href="/landing-page/live-chat"
                  className="flex items-center justify-center"
                >
                  <span className="absolute inset-0 rounded-xl bg-gray-300 animate-ping opacity-60 pointer-events-none" />
                  <span className="animate-[wiggle_3s_ease-in-out_infinite]">
                    <MessagesSquare  size={30} />
                  </span>
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-black border-2 border-white flex items-center justify-center">
                    <span className="flex gap-px">
                      <span className="w-[2.5px] h-[2.5px] rounded-full bg-white animate-bounce [animation-delay:0ms]" />
                      <span className="w-[2.5px] h-[2.5px] rounded-full bg-white animate-bounce [animation-delay:150ms]" />
                      <span className="w-[2.5px] h-[2.5px] rounded-full bg-white animate-bounce [animation-delay:300ms]" />
                    </span>
                  </span>
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className="px-5 py-6 text-[14px] font-bold cursor-pointer"
              >
                <Link href="/auth-page/login">Sign In</Link>
              </Button>

              <Button
                asChild
                className="px-4 py-6 text-[14px] font-bold rounded-xl cursor-pointer"
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
            <span className="font-black italic tracking-widest text-xs opacity-50 uppercase">
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
              Investment Plans
            </Link>
            <Link
              href="/landing-page/about"
              onClick={closeMobileMenu}
              className={mobileLinkStyles("/landing-page/about")}
            >
              About Secure Rise
            </Link>
            <Link
              href="/landing-page/testimonials"
              onClick={closeMobileMenu}
              className={mobileLinkStyles("/landing-page/testimonials")}
            >
              Testimonials
            </Link>
            <Link
              href="/landing-page/contact-us"
              onClick={closeMobileMenu}
              className={mobileLinkStyles("/landing-page/contact-us")}
            >
              Contact Page
            </Link>
            <Link
              href="/landing-page/live-chat"
              onClick={closeMobileMenu}
              className={mobileLinkStyles("/landing-page/live-chat")}
            >
              Live Chat
            </Link>
            <Link
              href="/landing-page/privacy"
              onClick={closeMobileMenu}
              className={mobileLinkStyles("/landing-page/privacy")}
            >
              Privacy Policy
            </Link>
            <Link
              href="/landing-page/terms"
              onClick={closeMobileMenu}
              className={mobileLinkStyles("/landing-page/terms")}
            >
              Terms &amp; Conditions
            </Link>
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