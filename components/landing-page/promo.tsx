"use client";
import { ArrowRight, Gift } from "lucide-react";

export default function PromoSection() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-10 w-full">
      <div className="relative overflow-hidden rounded-[1.5rem] bg-primary px-6 py-10 md:px-12 md:py-10">
        
        {/* Background Image - Positioned at right end corner */}
        <img 
          src="https://i.postimg.cc/VLY13dbh/install-pwa-removebg-preview.png" 
          alt="" 
          className="absolute bottom-0 right-0 w-[250px] md:w-[350px] h-auto object-contain opacity-40 md:opacity-100 pointer-events-none translate-x-10 translate-y-10 lg:translate-x-0 lg:translate-y-5"
        />

        {/* Decorative Blur */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 border border-white/20 text-[10px] font-bold uppercase tracking-[.2em] mb-4 text-primary-foreground">
            <Gift className="w-3 h-3" />
            New User Exclusive
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4 text-primary-foreground">
            Claim Your $20 Bonus
          </h2>
          
          <p className="text-primary-foreground/90 text-sm md:text-base max-w-md mb-8 leading-relaxed">
            Register today and receive an instant $20 credit. 
            Bonus becomes withdrawable alongside your first investment payout.
          </p>

          <button className="bg-white text-primary cursor-pointer dark:bg-black dark:text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-3 shadow-lg">
            Get Started Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}