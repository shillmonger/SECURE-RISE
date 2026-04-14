"use client";

import React, { useState } from "react";
import {
  Copy,
  CheckCircle2,
  Users,
  Link as LinkIcon,
  UserPlus,
  Search,
  ChevronLeft,
  ChevronRight,
  InboxIcon,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
} from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_REFERRALS = [
  {
    id: "1",
    name: "Alex Thompson",
    username: "alex_t",
    status: "Active",
    date: "2026-03-12",
    level: "L1",
    earnings: 45.0,
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "2",
    name: "Sarah Chen",
    username: "schen_88",
    status: "Inactive",
    date: "2026-03-15",
    level: "L1",
    earnings: 0.0,
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "3",
    name: "Marcus Wright",
    username: "m_wright",
    status: "Active",
    date: "2026-04-01",
    level: "L1",
    earnings: 120.5,
    avatar: "https://github.com/shadcn.png",
  },
];

const COMMISSION_STRUCTURE = [
  { level: "Level 1", percentage: "10%", description: "Direct Referrals" },
  { level: "Level 2", percentage: "5%", description: "Indirect Network" },
  { level: "Level 3", percentage: "2%", description: "Extended Network" },
];

const shortenLink = (link: string, start = 20, end = 10) => {
  if (link.length <= start + end) return link;
  return `${link.slice(0, start)}...${link.slice(-end)}`;
};

const ReferralPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const referralLink = "https://cetadel.com/register?ref=USER772";
  const myReferralId = "USER772";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredReferrals = MOCK_REFERRALS.filter(
    (ref) =>
      ref.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Page Header */}
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">
                Affiliate Network
              </h1>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-primary" /> Expand your
                network, increase your cap
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Link & List (8 Cols) */}
              <div className="lg:col-span-8 space-y-8">
                {/* Referral Link Card */}
                <div className="bg-foreground text-background rounded-[1.5rem] p-5 md:p-7 relative overflow-hidden shadow-2xl">
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-background/10 p-2 rounded-lg">
                        <LinkIcon className="w-5 h-5 text-background" />
                      </div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                        Unique Invite Link
                      </h3>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 bg-background/10 border border-background/20 rounded-2xl p-2 pl-6">
                      <p className="flex-1 text-sm font-black italic tracking-tight py-2 md:py-0">
                        {shortenLink(referralLink)}
                      </p>
                      <button
                        onClick={handleCopy}
                        className="w-full md:w-auto bg-background text-foreground px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all active:scale-95"
                      >
                        {copied ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        {copied ? "Copied" : "Copy Link"}
                      </button>
                    </div>

                    <div className="pt-6 border-t border-background/10 flex justify-between items-center">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40">
                          Your ID
                        </p>
                        <p className="text-2xl font-black italic text-green-500">
                          {myReferralId}
                        </p>{" "}
                      </div>
                      <Award className="w-10 h-10 opacity-20" />
                    </div>
                  </div>
                  <Zap className="absolute -right-10 -bottom-10 w-64 h-64 text-background/5 rotate-12" />
                </div>

                {/* Referral List */}
                <div className="bg-card border border-border rounded-[1.5rem] overflow-hidden">
                  <div className="p-8 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em]">
                        Network Directory
                      </h3>
                      <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">
                        Managing {filteredReferrals.length} active nodes
                      </p>
                    </div>
                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search partners..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-muted/30 border border-border rounded-xl text-xs font-bold focus:outline-none focus:border-foreground"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest opacity-60">
                            Partner
                          </th>
                          <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest opacity-60">
                            Status
                          </th>
                          <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest opacity-60 text-right">
                            Earnings
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {filteredReferrals.map((ref) => (
                          <tr
                            key={ref.id}
                            className="group hover:bg-muted/20 transition-colors"
                          >
                            <td className="px-4 sm:px-8 py-4 sm:py-6">
                              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                <img
                                  src={
                                    ref.avatar ||
                                    "https://github.com/shadcn.png"
                                  }
                                  alt={ref.name}
                                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                                />

                                <div className="min-w-0">
                                  <p className="text-xs font-black uppercase italic tracking-tight truncate">
                                    {ref.name}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest truncate">
                                    Joined {ref.date}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span
                                className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                  ref.status === "Active"
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {ref.status}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <p className="text-sm font-black italic tracking-tighter">
                                ${ref.earnings.toFixed(2)}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Stats & Structure (4 Cols) */}
              <div className="lg:col-span-4 space-y-8">
                {/* Referral Stats */}
                <div className="bg-card border border-border rounded-[1.5rem] p-5 md:p-5 space-y-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="text-xs font-black uppercase tracking-widest">
                      Network Stats
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-5 rounded-2xl border border-border">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">
                        Total
                      </p>
                      <p className="text-2xl font-black italic leading-none">
                        12
                      </p>
                    </div>
                    <div className="bg-muted/30 p-5 rounded-2xl border border-border">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">
                        Active
                      </p>
                      <p className="text-2xl font-black italic leading-none text-primary">
                        08
                      </p>
                    </div>
                  </div>
                  <div className="bg-foreground text-background p-3 px-5 rounded-xl flex justify-between items-center shadow-lg">
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      Net Bonuses
                    </p>
                    <p className="text-xl font-black italic">$1,450.00</p>
                  </div>
                </div>

                {/* Commission Structure */}
                <div className="bg-card border border-border rounded-[1.5rem] p-5 md:p-5 space-y-6">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <h3 className="text-xs font-black uppercase tracking-widest">
                      Revenue Model
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {COMMISSION_STRUCTURE.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 group hover:border-foreground/20 transition-all"
                      >
                        <div>
                          <p className="text-[10px] font-black uppercase italic tracking-tight">
                            {item.level}
                          </p>
                          <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">
                            {item.description}
                          </p>
                        </div>
                        <p className="text-lg font-black italic text-primary">
                          {item.percentage}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground leading-relaxed text-center">
                    Commissions are settled instantly upon partner deposit
                    confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <UserNav />
    </div>
  );
};

export default ReferralPage;
