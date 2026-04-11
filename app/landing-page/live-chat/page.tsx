"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/landing-page/Header";
import Footer from "@/components/landing-page/Footer";
import CookieConsent from "@/components/landing-page/CookieConsent";
import FAQ from "@/components/landing-page/faq";
import { MessageCircle, Clock, ShieldCheck, Headphones, Zap, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function LetsTalkPage() {
  const pathname = usePathname();
  const router = useRouter();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (document.getElementById("tawk-script")) return;
    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();
    const s1 = document.createElement("script");
    s1.id = "tawk-script";
    s1.async = true;
    s1.src = "https://embed.tawk.to/69da7be83d36051c387a7988/1jlun812f";
    s1.crossOrigin = "*";
    document.body.appendChild(s1);
  }, []);

  // Route change detection - refresh when navigating away from live-chat
  useEffect(() => {
    if (previousPathname.current === "/landing-page/live-chat" && pathname !== "/landing-page/live-chat") {
      setTimeout(() => {
        window.location.reload();
      }, 0);
    }
    previousPathname.current = pathname;
  }, [pathname]);

  return (
    <main className="bg-background text-foreground transition-colors duration-300 min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 py-30 sm:py-20 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent"
            >
              Live Support
            </motion.h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Connect instantly with our investment support team. Real people, real answers — available around the clock.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            {[
              { label: "Avg. Response Time", value: "< 2 min", icon: Zap },
              { label: "Support Availability", value: "24 / 7", icon: Clock },
              { label: "Satisfied Clients", value: "98%", icon: Users },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="bg-card border border-border rounded-[1.5rem] p-6 text-center shadow-sm"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-3xl font-black tracking-tighter">{value}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-16">

            {/* Chat Card */}
            <div className="lg:col-span-2 bg-card border border-border rounded-[1.5rem] overflow-hidden shadow-sm">
              <div className="bg-primary p-8 md:p-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-primary-foreground">
                      Start a Conversation
                    </h2>
                    <p className="text-primary-foreground/70 text-sm">A live agent is ready for you</p>
                  </div>
                </div>
                {/* Online indicator */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-primary-foreground/80 text-sm font-medium">Support team is online</span>
                </div>
              </div>

              <div className="p-8 md:p-10 space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Whether you have questions about your portfolio, withdrawals, bonuses, or trading cycles — our team is standing by. Click below to open a live chat window and get an instant response.
                </p>

                <ul className="space-y-3">
                  {[
                    "Real-time answers from human agents",
                    "No bots — direct expert access",
                    "Secure & confidential conversations",
                    "Available 24/7 including weekends",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    if ((window as any).Tawk_API) {
                      (window as any).Tawk_API.maximize();
                    }
                  }}
                  className="w-full sm:w-auto px-10 h-14 bg-primary text-primary-foreground hover:scale-105 transition-transform rounded-xl font-bold uppercase tracking-tighter italic flex items-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4" />
                  Open Live Chat
                </button>

                <p className="text-xs text-muted-foreground">
                  You can also use the chat widget in the bottom-right corner of any page.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Support Channels */}
              <div className="bg-card border border-border rounded-[1.5rem] p-8 shadow-sm">
                <h3 className="font-black uppercase italic tracking-tighter text-lg mb-6">
                  Other Channels
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Headphones className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Phone Support</p>
                      <p className="font-bold">+0 (000) 000-000</p>
                      <p className="text-xs text-muted-foreground">Mon – Sun, 24 hrs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Email Support</p>
                      <p className="font-bold">support@securerise.com</p>
                      <p className="text-xs text-muted-foreground">Reply within 2 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-primary p-8 rounded-[1.5rem] text-primary-foreground shadow-lg">
                <ShieldCheck className="h-8 w-8 mb-4 opacity-80" />
                <h4 className="font-black uppercase italic tracking-tighter text-lg mb-2">
                  Your Privacy Matters
                </h4>
                <p className="text-sm opacity-80 leading-relaxed">
                  All chat conversations are encrypted end-to-end. We never share your data with third parties.
                </p>
              </div>

              {/* Response Promise */}
              <div className="bg-card border border-border rounded-[1.5rem] p-8 shadow-sm">
                <Clock className="h-6 w-6 text-primary mb-3" />
                <h4 className="font-bold mb-1">Response Guarantee</h4>
                <p className="text-sm text-muted-foreground">
                  If we don't respond within 5 minutes via live chat, we'll follow up by email within the hour.
                </p>
              </div>
            </aside>
          </div>

        </div>
      </div>

      <CookieConsent />
      <FAQ />
      <Footer />
    </main>
  );
}