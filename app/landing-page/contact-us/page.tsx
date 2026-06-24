"use client";

import React, { useState } from "react";
import GiveAway from "@/components/landing-page/GiveAway";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import CookieConsent from "@/components/landing-page/CookieConsent";
import FAQ from "@/components/landing-page/faq";
import Footer from "@/components/landing-page/Footer";

import Link from "next/link";

import { Phone, Mail, Send, ShieldCheck } from "lucide-react"; // Added ShieldCheck for branding
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactReason: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      contactReason: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast.error("Please fill out all required fields");
      return;
    }

    if (!formData.contactReason) {
      toast.warning("Please select a contact reason");
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to send message. Please try again.');
        return;
      }

      toast.success(data.message || "Your inquiry has been sent to our investment team!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        contactReason: "",
        message: "",
      });
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <main className="bg-background text-foreground transition-colors duration-300 min-h-screen flex flex-col">
      <GiveAway />
      <Header />

      <div className="flex-1 pb-0 pt-35 sm:pb-10 lg:pt-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page Title */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent"
            >
              Get in Touch
            </motion.h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ready to scale your wealth? Our SECURE RISE experts are here to assist with your trading and investment journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-sm border border-border bg-card rounded-[1.5rem] overflow-hidden">
                <CardHeader className="p-5 md:p-8 pb-0">
                  <CardTitle className="text-2xl font-bold">
                    Connect with our Experts
                  </CardTitle>
                  <p className="text-muted-foreground mt-2">
                    Have questions about your $20 bonus or trading cycles? Send us a message below.
                  </p>
                </CardHeader>


                <CardContent className="p-5 md:p-8">
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="font-bold uppercase tracking-widest text-[10px] text-primary">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="SECURE"
                          className="h-12 bg-secondary/50 border-border focus:ring-primary rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="font-bold uppercase tracking-widest text-[10px] text-primary">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="RISE"
                          className="h-12 bg-secondary/50 border-border focus:ring-primary rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-bold uppercase tracking-widest text-[10px] text-primary">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="investor@securerise.com"
                          className="h-12 bg-secondary/50 border-border focus:ring-primary rounded-xl w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactReason" className="font-bold uppercase tracking-widest text-[10px] text-primary">
                          Inquiry Reason
                        </Label>
                        <Select onValueChange={handleSelectChange} value={formData.contactReason}>
                          <SelectTrigger className="h-15 w-full px-5 py-6 bg-secondary/30 border-none rounded-xl focus:ring-1 focus:ring-[#229ED9] focus:ring-offset-0 cursor-pointer text-muted-foreground/70">
                            <SelectValue placeholder="Select a reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general" className="py-3 cursor-pointer">General Investment Inquiry</SelectItem>
                            <SelectItem value="payout" className="py-3 cursor-pointer">Withdrawals & Payouts</SelectItem>
                            <SelectItem value="trading" className="py-3 cursor-pointer">Trading Strategy Info</SelectItem>
                            <SelectItem value="bonus" className="py-3 cursor-pointer">Bonus & Promotions</SelectItem>
                            <SelectItem value="billing" className="py-3 cursor-pointer">Deposit & Verification</SelectItem>
                            <SelectItem value="other" className="py-3 cursor-pointer">Others</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="font-bold uppercase tracking-widest text-[10px] text-primary">
                        Your Message
                      </Label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us how we can help you grow your portfolio..."
                        className="w-full rounded-xl border border-border bg-secondary/50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full sm:w-auto px-10 py-6 bg-primary cursor-pointer text-primary-foreground hover:scale-105 transition-transform rounded-xl font-bold uppercase tracking-tighter  flex items-center gap-2"
                    >
                      <Send className="h-5 w-5" />
                      Send Inquiry
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>




            {/* Sidebar Info */}
            <aside className="space-y-6">
              <div className="bg-[#229ED9] p-6 sm:p-7 rounded-[1.5rem] text-white shadow-md space-y-8">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">
                    Secure Support
                  </h3>
                  <p className="opacity-90 text-sm leading-relaxed">
                    Our portfolio managers and technical team are available to ensure your assets are always working for you.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Group Admin Link */}
                  <a
                    href="https://t.me/SecureRiseOfficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group transition-opacity hover:opacity-90"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
                      <Send className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Group Admin</p>
                      <p className="font-bold border-b border-transparent group-hover:border-white/50 transition-colors inline-block">
                        @SecureRiseOfficial
                      </p>
                    </div>
                  </a>

                  {/* Telegram Group/Channel Link */}
                  <a
                    href="https://t.me/+2J3hQtWxTbVlZjVk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group transition-opacity hover:opacity-90"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
                      <Send className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Telegram Group</p>
                      <p className="font-bold border-b border-transparent group-hover:border-white/50 transition-colors inline-block text-sm sm:text-base break-all">
                        Join Telegram Channel
                      </p>
                    </div>
                  </a>
                </div>
              </div>





              <div className="bg-card border border-border p-6 sm:p-7 rounded-[1.5rem]">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Transparency First
                </h4>
                <p className="text-sm text-muted-foreground mb-4">Learn how we use your investments in high-yield trading.</p>
                <Link href="/landing-page/learn-more">
                  <Button variant="link" className="p-0 text-primary font-bold uppercase tracking-tighter ">
                    <Send className="h-5 w-5" /> Learn More About Us
                  </Button>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <ThemeAndScroll />
      <CookieConsent />
      <FAQ />
      <Footer />
    </main>
  );
}