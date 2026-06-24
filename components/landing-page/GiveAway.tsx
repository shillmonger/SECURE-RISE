"use client";

import { useEffect, useState } from "react";
import { Send, Clock } from "lucide-react";

export default function GiveAway() {
  // Set your giveaway end date here
  const endDate = new Date("2027-06-24T23:59:59");

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
      const days = Math.floor(
        (diff % (1000 * 60 * 60 * 24 * 30)) /
          (1000 * 60 * 60 * 24)
      );
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) /
          (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (diff % (1000 * 60 * 60)) /
          (1000 * 60)
      );

      setTimeLeft(
        `${months}M ${days}D ${hours}H ${minutes}M`
      );
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[50] bg-[#229ED9] text-white border-b border-white/20">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between px-6 py-2 text-sm font-semibold">
        <div className="flex items-center gap-2">
          <Send size={16} />
          <span>
            NO CAPITAL TO TRADE? Message
            {" "}
            <a
              href="https://t.me/secure_rise_trading"
              target="_blank"
              rel="noopener noreferrer"
              className="font-black underline"
            >
              @secure_rise_trading
            </a>
            {" "}
            and send:
            {" "}
            <strong>"No Capital"</strong>
            {" "}
            to qualify for our trader support giveaway.
          </span>
        </div>

        <div className="flex items-center gap-2 whitespace-nowrap ml-6">
          <Clock size={16} />
          <span>{timeLeft} Remaining</span>
        </div>
      </div>

      {/* Mobile Marquee */}
      <div className="md:hidden overflow-hidden py-2">
        <div className="flex whitespace-nowrap animate-[marquee_18s_linear_infinite]">
          <span className="mx-8 font-semibold">
            🎁 NO CAPITAL TO TRADE? Message @secure_rise_trading and send
            "No Capital" • Giveaway Active • {timeLeft} Remaining •
          </span>

          <span className="mx-8 font-semibold">
            🎁 NO CAPITAL TO TRADE? Message @secure_rise_trading and send
            "No Capital" • Giveaway Active • {timeLeft} Remaining •
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}