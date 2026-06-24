"use client";

import { ArrowRight, Gift } from "lucide-react";
import Link from "next/link";

export default function PromoSection() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-10 w-full">
      <div className="relative overflow-hidden rounded-[1.5rem] bg-primary px-5 py-6 md:px-6 md:py-8">
        
        {/* Background Image - Positioned at right end corner */}
        <img 
          src="https://i.postimg.cc/fL5VfmqY/tg.png" 
          alt="" 
          className="absolute bottom-0 right-0 w-[400px] md:w-[400px] h-auto object-contain opacity-60 md:opacity-100 pointer-events-none translate-x-10 translate-y-10 lg:translate-x-0 lg:translate-y-5"
        />

        {/* Decorative Blur */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
  {/* Badge */}
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 border border-white/20 text-[10px] font-bold uppercase tracking-[.2em] mb-4 text-primary-foreground">
    <Gift className="w-3 h-3" />
    10,000+ Members & Growing
  </div>

  <h2 className="text-4xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-4 text-primary-foreground">
    Join Our Community
  </h2>

  <p className="text-primary-foreground/90 text-sm md:text-base max-w-md mb-8 leading-relaxed">
    Become part of our thriving Telegram community with over 10,000 active
    members and growing every day. Get the latest updates and
    instant notifications about new features and promotions.
  </p>

  <Link
    href="https://t.me/secure_rise0"
    target="_blank"
    rel="noopener noreferrer"
  >
    <button className="w-full lg:w-auto justify-center items-center bg-white text-primary cursor-pointer dark:bg-black dark:text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex gap-3 shadow-lg hover:scale-105 active:scale-95">
  Join Telegram Now
  <ArrowRight className="w-4 h-4" />
</button>
  </Link>
</div>
      </div>
    </section>
  );
}