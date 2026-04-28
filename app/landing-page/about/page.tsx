"use client";

import { motion } from "framer-motion";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import CookieConsent from "@/components/landing-page/CookieConsent";
import Footer from "@/components/landing-page/Footer";

export default function AboutUs() {
  const sections = [
    {
      id: "01",
      title: "Intelligent Trading Algorithms",
      label: "Technology",
      description:
        "Secure Rise utilizes high-frequency trading algorithms to put your capital to work. By purchasing assets through our platform, you trigger automated trades that top up your daily income consistently.",
      // Multiple screens with trading charts and code — algo/quant theme
      image:
        "https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=2070&auto=format&fit=crop",
      cta: "Our Methodology",
    },
    {
      id: "$20",
      title: "The Secure Rise Welcome Bonus",
      label: "Bonus",
      description:
        "We believe in starting your journey on the right foot. Every new user receives a $20 instant credit. This bonus is fully withdrawable alongside your very first investment payout.",
      // Dollar bills / cash reward — bonus/gift theme
      image:
        "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=2070&auto=format&fit=crop",
      cta: "Claim Bonus",
    },
    {
      id: "SAFE",
      title: "Uncompromising Security",
      label: "Trust",
      description:
        "Our name is our promise. Secure Rise employs military-grade encryption and secure withdrawal protocols to ensure your funds and data are protected at every stage of your investment.",
      // Padlock / cybersecurity digital lock
      image:
        "https://i.postimg.cc/y6PG31Lb/Strong-Passwords.jpg",
      cta: "Security Protocols",
    },
    {
      id: "24/7",
      title: "Round-the-Clock Support",
      label: "Global",
      description:
        "Markets never sleep, and neither do we. Our team of financial experts and technical support are available 24/7 to assist with your portfolio management and technical inquiries.",
      // Professional support team / headset operator in modern office
      image:
        "https://i.postimg.cc/d3t4jCWP/Delivering-247.jpg",
      cta: "Meet The Team",
    },
    {
      id: "LIVE",
      title: "Real-Time Market Access",
      label: "Data",
      description:
        "Gain an edge with live data feeds. We provide our investors with the same high-level market insights used by institutional traders, ensuring complete visibility into how your trades perform.",
      // Live trading screens / multi-monitor Bloomberg-style setup
      image:
        "https://i.postimg.cc/g0FsBQM3/Forex.jpg",
      cta: "Market Insights",
    },
    {
      id: "100%",
      title: "Financial Transparency",
      label: "Ethics",
      description:
        "Transparency is the bedrock of our platform. From fee structures to trading volumes, we provide detailed reporting so you can track every cent of your growth without hidden costs.",
      // Open ledger / financial report / documents on desk
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2070&auto=format&fit=crop",
      cta: "Transparency Report",
    },
  ];

  return (
    <main className="bg-background text-foreground transition-colors duration-300 min-h-screen flex flex-col">
      <Header />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative h-[55vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background: finance data center / server room for techy feel */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2070&auto=format&fit=crop')",
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
              About Secure Rise
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-5 text-white"
          >
            #SecureRise
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base md:text-lg font-light tracking-wide text-white/75 max-w-xl mx-auto leading-relaxed"
          >
            Revolutionizing wealth creation through automated intelligence.
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

      {/* ── Dynamic Content Sections ─────────────────────────────── */}
      <section className="flex flex-col gap-28 max-w-7xl mx-auto px-4 lg:px-8 py-24 w-full">
        {sections.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative"
            >
              {/* Watermark ID */}
              <span
                aria-hidden="true"
                className="pointer-events-none select-none absolute -top-8 md:-top-14 left-0 -z-10 text-[5rem] md:text-[9rem] font-black leading-none text-foreground/[0.04] tracking-tighter"
              >
                {item.id}
              </span>

              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${
                  !isEven ? "lg:[direction:rtl]" : ""
                }`}
              >
                {/* ── Image ── */}
                <div
                  className={`lg:col-span-7 [direction:ltr] ${
                    !isEven ? "lg:order-2" : ""
                  }`}
                >
                  <div className="group relative aspect-[16/9] overflow-hidden rounded-2xl border border-border/40">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />

                    {/* Subtle gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent" />

                    {/* Label pill */}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-sm">
                      <span className="h-1 w-1 rounded-full bg-primary-foreground/60" />
                      {item.label}
                    </div>
                  </div>
                </div>

                {/* ── Text ── */}
                <div
                  className={`lg:col-span-5 [direction:ltr] space-y-5 ${
                    !isEven ? "lg:order-1 lg:pr-6" : "lg:pl-6"
                  }`}
                >
                  {/* Step counter */}
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    {String(index + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
                  </span>

                  <h2 className="text-3xl md:text-[2.5rem] font-black italic tracking-tighter leading-[1.1] text-foreground">
                    {item.title}
                  </h2>

                  {/* Accent line */}
                  <div className="h-[2px] w-12 rounded-full bg-primary" />

                  <p className="text-muted-foreground leading-relaxed text-sm md:text-[0.95rem] font-light">
                    {item.description}
                  </p>

                  <div className="pt-1">
                    <a
                      href="#"
                      className="group/link inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.18em] uppercase text-foreground hover:text-primary transition-colors duration-200"
                    >
                      {item.cta}
                      <span className="h-[1.5px] w-6 rounded-full bg-current transition-all duration-300 group-hover/link:w-10" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* ── Bottom divider ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 pb-20">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium whitespace-nowrap">
            Secure Rise
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </div>

      <ThemeAndScroll />
      <CookieConsent />
      <Footer />
    </main>
  );
}