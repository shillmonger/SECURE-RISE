"use client";

import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Clock,
  Zap,
  Users,
  TrendingUp,
  Headphones,
  Mail,
  PlusCircle,
  History,
  ChevronRight,
  ShieldCheck,
  Search,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { motion } from "framer-motion";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import FAQ from "@/components/landing-page/faq";

// ─── Mock Data ──────────────────────────────────────────────────────────────

const TICKET_HISTORY = [
  {
    id: "TK-4421",
    subject: "Withdrawal Delay",
    status: "Resolved",
    date: "Apr 10, 2026",
  },
  {
    id: "TK-4590",
    subject: "Verification Status",
    status: "Open",
    date: "Apr 14, 2026",
  },
];

export default function SupportPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 1. Tawk.to Widget Integration
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

  // 2. Hard Reload Logic (Tawk.to Cleanup)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("#") ||
        anchor.target === "_blank"
      )
        return;

      e.preventDefault();
      e.stopPropagation();
      window.location.href = href;
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  const openChat = () => {
    if ((window as any).Tawk_API) {
      (window as any).Tawk_API.maximize();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto">
          {/* Hero Section */}
          <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center overflow-hidden bg-foreground">
            <div className="absolute inset-0 opacity-90 grayscale">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070"
                className="w-full h-full object-cover"
                alt="Support"
              />
            </div>
            <div className="relative z-10 text-center px-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-background"
              >
                Priority Support
              </motion.h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-background/60 mt-4">
                Real people. Instant answers. 24/7.
              </p>
            </div>
          </section>

          <div className="max-w-7xl mx-auto -mt-20 relative z-20 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2  p-4 md:p-8 lg:grid-cols-4 gap-4">
              {[
                { label: "Response Time", value: "< 2 min", icon: Zap },
                { label: "Availability", value: "24 / 7", icon: Clock },
                { label: "Satisfaction", value: "99%", icon: Users },
                { label: "Status", value: "Online", icon: ShieldCheck },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-xl p-6 shadow-xl flex flex-col items-center text-center"
                >
                  <stat.icon className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xl font-black italic tracking-tighter">
                    {stat.value}
                  </p>
                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1  p-4 md:p-8 lg:grid-cols-3 gap-8">
              {/* Main Column: Tickets & Chat */}
              <div className="lg:col-span-2 space-y-8">
                {/* Live Chat Card */}
                <div className="bg-foreground text-background rounded-[1.5rem]  p-5 md:p-5 overflow-hidden relative group">
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary p-2 rounded-lg">
                        <MessageCircle className="w-5 h-5 text-background" />
                      </div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">
                        Direct Channel
                      </h3>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tight">
                      Need an instant response?
                    </h2>
                    <p className="text-sm opacity-60 max-w-md font-medium">
                      Our live support agents are currently active. Average wait
                      time is currently under 120 seconds.
                    </p>
                    <button
                      onClick={openChat}
                      className="w-full md:w-auto cursor-pointer bg-background text-foreground px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3"
                    >
                      Initialize Live Chat <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <MessageCircle className="absolute -right-10 -bottom-10 w-64 h-64 opacity-5" />
                </div>

                {/* Ticket History */}
                <div className="bg-card border border-border rounded-[1.5rem] overflow-hidden">
                  <div className="p-8 border-b border-border flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <History className="w-4 h-4" /> Ticket Archive
                      </h3>
                    </div>
                    <button className="text-[10px] font-black uppercase text-primary tracking-widest">
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-border/50">
                    {TICKET_HISTORY.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="p-6 px-8 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-black uppercase italic tracking-tight">
                            {ticket.subject}
                          </p>
                          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                            ID: {ticket.id} • Created {ticket.date}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            ticket.status === "Resolved"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar: New Ticket & Contact */}
              <div className="space-y-8">
                {/* Submit Ticket Form */}
                <div className="bg-card border border-border rounded-[1.5rem] p-5 md:p-5 space-y-6 shadow-sm">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-primary" /> Open New
                    Ticket
                  </h3>

                  <div className="space-y-4">
                    {/* Shadcn Select Implementation */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest opacity-40">
                        Department
                      </label>
                      <Select>
                        <SelectTrigger className="w-full bg-muted/30 border-border rounded-xl h-13 p-5 cursor-pointer text-xs font-bold focus:ring-0 focus:ring-offset-0">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border rounded-xl">
                          <SelectItem
                            value="deposit"
                            className="text-xs font-bold uppercase py-3"
                          >
                            Deposit Issues
                          </SelectItem>
                          <SelectItem
                            value="investment"
                            className="text-xs font-bold uppercase py-3"
                          >
                            Investment Plan
                          </SelectItem>
                          <SelectItem
                            value="referral"
                            className="text-xs font-bold uppercase py-3"
                          >
                            Referral Program
                          </SelectItem>
                          <SelectItem
                            value="withdrawal"
                            className="text-xs font-bold uppercase py-3"
                          >
                            Withdrawal Updates
                          </SelectItem>
                          <SelectItem
                            value="technical"
                            className="text-xs font-bold uppercase py-3"
                          >
                            Technical Support
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Message Area */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest opacity-40">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Describe your issue..."
                        className="w-full bg-muted/30 border border-border rounded-xl p-4 text-xs font-bold focus:outline-none focus:border-foreground transition-all placeholder:opacity-30"
                      />
                    </div>

                    {/* Action Button */}
                    <button className="w-full cursor-pointer bg-foreground text-background py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all shadow-lg active:scale-95">
                      Dispatch Ticket
                    </button>
                  </div>
                </div>

                {/* Other Channels */}
                <div className="bg-muted/30 border border-border rounded-[1.5rem] p-5 md:p-5 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-40">
                        Telegram
                      </p>
                      <p className="text-sm font-black italic">@secure_rise</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-40">
                        Email Support
                      </p>
                      <p className="text-sm font-black italic">
                        support@cetadel.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Integration */}
            <div className="pt-5">
              <FAQ />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
