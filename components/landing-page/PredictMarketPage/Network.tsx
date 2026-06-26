"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Network() {
  return (
    <section className="relative py-24 w-full flex items-center justify-center overflow-hidden mt-10 lg:mt-0 lg:mb-20">
      <div
        className="absolute inset-0 bg-cover bg-fixed bg-center z-0"
        style={{
          backgroundImage:
            "url('https://i.postimg.cc/bJNySZhC/up1.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center text-white px-4 max-w-3xl"
      >
        <span className="text-white font-bold tracking-widest uppercase text-sm mb-4 block">
          Join Our Network
        </span>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-tight">
          Start Predicting Today <br /> Earn XP Rewards
        </h2>
        <p className="text-lg opacity-80 mb-10 font-light">
          Test your market analysis skills with our risk-free prediction system.
          Make one prediction per day, earn 1000 XP for every correct call, and convert your XP to USDT.
        </p>
        <Link href="/auth-page/register">
          <button className="bg-[#229ED9] text-white px-10 py-4 rounded-full cursor-pointer font-bold uppercase tracking-tighter transition-all duration-300 hover:bg-white hover:text-black">
            Start Predicting
          </button>
        </Link>
      </motion.div>
    </section>
  );
}