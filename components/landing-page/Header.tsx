"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Montserrat } from "next/font/google";
import { Menu, X, HelpCircle } from "lucide-react";
import MegaMenu from "./MegaMenu";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

// ─── Component ─────────────────────────────────────────────────────────────────

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const pathname = usePathname();

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const toggleMegaMenu = () => setMegaOpen(!megaOpen);
  const closeMegaMenu = () => setMegaOpen(false);

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

            <MegaMenu isOpen={megaOpen} onToggle={toggleMegaMenu} onClose={closeMegaMenu} />

            <Link
              href="/landing-page/predict"
              onClick={closeMobileMenu}
              className={desktopLinkStyles("/landing-page/predict")}
            >
              Predict Market
            </Link>
            <Link
              href="/landing-page/learn-more"
              className={desktopLinkStyles("/landing-page/learn-more")}
            >
              Learn More
            </Link>
            
            <Link
              href="/landing-page/faq"
              onClick={closeMobileMenu}
              className={desktopLinkStyles("/landing-page/faq")}
            >
              F&Q
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
            <Link
              href="/landing-page/faq"
              onClick={closeMobileMenu}
              className={mobileLinkStyles("/landing-page/faq")}
            >
              Frequently Asked Questions
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