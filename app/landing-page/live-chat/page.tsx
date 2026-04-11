"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/landing-page/Header";
import Footer from "@/components/landing-page/Footer";
import CookieConsent from "@/components/landing-page/CookieConsent";
import FAQ from "@/components/landing-page/faq";
import {
  MessageCircle,
  Clock,
  ShieldCheck,
  Headphones,
  Zap,
  Users,
  TrendingUp,
} from "lucide-react";

export default function LetsTalkPage() {
  // Load Tawk.to chat widget
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

  // Intercept ALL anchor clicks while on this page.
  // Forces a hard reload to the destination so Tawk.to is cleanly
  // torn down — Next.js soft navigation keeps the widget alive otherwise.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Skip: external, hash-only, download, new-tab links
      if (
        href.startsWith("http") ||
        href.startsWith("//") ||
        href.startsWith("#") ||
        anchor.hasAttribute("download") ||
        anchor.target === "_blank"
      )
        return;

      // Internal navigation — force a full page load to destination
      e.preventDefault();
      e.stopPropagation();
      window.location.href = href;
    };

    // Capture phase so we intercept before Next.js's own router handler
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return (
    <main className="bg-background text-foreground transition-colors duration-300 min-h-screen flex flex-col">
      <Header />

      {/* ── Hero (same style as About Us) ────────────────────────── */}
      <section className="relative h-[55vh] w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/80" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-3 py-1.5 mb-5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-white/80">
              Support Center
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-5 text-white"
          >
            Live Support
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base md:text-lg font-light tracking-wide text-white/75 max-w-xl mx-auto leading-relaxed"
          >
            Connect instantly with our investment support team. Real people,
            real answers — available around the clock.
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">
            Scroll
          </span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </section>

      <div className="flex-1 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Stats Row — 4 items */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { label: "Response Time", value: "< 2 min", icon: Zap },
              { label: "Support Availability", value: "24 / 7", icon: Clock },
              { label: "Satisfied Clients", value: "98%", icon: Users },
              { label: "Issues Resolved", value: "50K+", icon: TrendingUp },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="bg-card border border-border rounded-[1.5rem] p-3 py-4 lg:p-5 text-center shadow-sm"
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
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
                    <p className="text-primary-foreground/70 text-sm">
                      A live agent is ready for you
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-primary-foreground/80 text-sm font-medium">
                    Support team is online
                  </span>
                </div>
              </div>

              <div className="p-8 md:p-10 space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Whether you have questions about your portfolio, withdrawals,
                  bonuses, or trading cycles — our team is standing by. Click
                  below to open a live chat window and get an instant response.
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
                        <svg
                          className="w-3 h-3 text-primary-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
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
                  You can also use the chat widget in the bottom-right corner of
                  any page.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="bg-card border border-border rounded-[1.5rem] p-8 shadow-sm">
                <h3 className="font-black uppercase italic tracking-tighter text-lg mb-6">
                  Other Channels
                </h3>
                <div className="space-y-5">
                  <a
                    href="https://t.me/secure_rise"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Headphones className="h-4 w-4 text-primary" />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                        Telegram Support
                      </p>
                      <p className="font-bold">@secure_rise</p>
                      <p className="text-xs text-muted-foreground">
                        24/7 Support on Telegram
                      </p>
                    </div>
                  </a>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                        Email Support
                      </p>
                      <p className="font-bold">support@securerise.com</p>
                      <p className="text-xs text-muted-foreground">
                        Reply within 2 hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="bg-primary p-8 rounded-[1.5rem] text-primary-foreground shadow-lg">
                <ShieldCheck className="h-8 w-8 mb-4 opacity-80" />
                <h4 className="font-black uppercase italic tracking-tighter text-lg mb-2">
                  Your Privacy Matters
                </h4>
                <p className="text-sm opacity-80 leading-relaxed">
                  All chat conversations are encrypted end-to-end. We never share your data with third parties.
                </p>
              </div> */}

              <div className="bg-card border border-border rounded-[1.5rem] p-8 shadow-sm">
                <Clock className="h-6 w-6 text-primary mb-3" />
                <h4 className="font-bold mb-1">Response Guarantee</h4>
                <p className="text-sm text-muted-foreground">
                  If we don't respond within 5 minutes via live chat, we'll
                  follow up by email within the hour.
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
