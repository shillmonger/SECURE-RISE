"use client";

import { useEffect, useState } from "react";
import { Gift, Clock } from "lucide-react";

// Individual digit component that slides up when the value changes
function AnimatedUnit({ value, label }: { value: number; label: string }) {
    const [displayValue, setDisplayValue] = useState(value);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (value !== displayValue) {
            setAnimate(true);
            const timer = setTimeout(() => {
                setDisplayValue(value);
                setAnimate(false);
            }, 150); // duration of slide-out
            return () => clearTimeout(timer);
        }
    }, [value, displayValue]);

    return (
        <span className="inline-flex items-center mx-0.5">
            <span className="inline-block overflow-hidden h-[1.2em] relative w-[2ch] text-center vertical-baseline">
                <span
                    className={`absolute inset-0 block transform transition-all duration-150 ease-in-out ${animate ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
                        }`}
                >
                    {displayValue.toString().padStart(2, "0")}
                </span>
            </span>
            <span className="text-[10px] opacity-75 font-normal ml-0.5 mr-1 uppercase">{label}</span>
        </span>
    );
}

export default function GiveAway() {
    const endDate = new Date("2027-06-24T23:59:59");

    const [timeUnits, setTimeUnits] = useState({
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false,
    });

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const diff = endDate.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeUnits((prev) => ({ ...prev, isExpired: true }));
                return;
            }

            const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
            const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeUnits({ months, days, hours, minutes, seconds, isExpired: false });
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, []);

    // Shared countdown layout for both desktop and mobile marquee string replication
    const renderCountdown = () => {
        if (timeUnits.isExpired) return <span>Expired</span>;
        return (
            <span className="inline-flex items-center font-mono font-bold tracking-tight bg-none lg:bg-black/10 px-0 py-0 lg:px-1 lg:py-1 rounded-full text-[10px] lg:text-[11px]">
                <AnimatedUnit value={timeUnits.months} label="m" />
                <AnimatedUnit value={timeUnits.days} label="d" />
                <AnimatedUnit value={timeUnits.hours} label="h" />
                <AnimatedUnit value={timeUnits.minutes} label="m" />
                <AnimatedUnit value={timeUnits.seconds} label="s" />
            </span>
        );
    };

    
    return (
        <div className="fixed top-0 left-0 right-0 z-[50] bg-[#229ED9] text-white border-b border-white/20 shadow-sm">
            {/* CSS Styles injection for Marquee */}
            <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-infinite {
          animation: marquee 22s linear infinite;
        }
      `}</style>

            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-between px-6 py-2 text-sm font-semibold">
                <div className="flex items-center gap-2">
                    <Gift size={15} />
                    <span>
                        NO CAPITAL TO TRADE? Message{" "}
                        <a
                            href="https://t.me/SecureRiseOfficial"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-black underline hover:text-white/90"
                        >
                            @SecureRiseOfficial
                        </a>{" "}
                        and send the text: <strong>"Funding Support"</strong> to qualify for our trader support giveaway.
                    </span>
                </div>

                <div className="flex items-center gap-2 whitespace-nowrap ml-6">
                    <Clock size={15} />
                    <div className="flex text-sm items-center gap-2">
                        {renderCountdown()} <span>Remaining</span>
                    </div>
                </div>
            </div>




            {/* Mobile Marquee Layout */}
            <div className="md:hidden overflow-hidden py-2 flex items-center">
                {/* Seamless infinite loop wrapping container */}
                <div className="flex whitespace-nowrap animate-marquee-infinite text-[11px] font-medium tracking-wide">
                    <div className="flex items-center gap-2 px-4">
                        <span>NO CAPITAL TO TRADE? Message <a href="https://t.me/SecureRiseOfficial" target="_blank" rel="noopener noreferrer" className="font-black underline hover:text-white/90">@SecureRiseOfficial</a> and send "Funding Support" • Giveaway Active •</span>
                        <span className="flex items-center gap-1">{renderCountdown()} Remaining</span>
                        <span className="ml-2">•</span>
                    </div>
                    <div className="flex items-center gap-2 px-4">
                        <span>NO CAPITAL TO TRADE? Message <a href="https://t.me/SecureRiseOfficial" target="_blank" rel="noopener noreferrer" className="font-black underline hover:text-white/90">@SecureRiseOfficial</a> and send "Funding Support" • Giveaway Active •</span>
                        <span className="flex items-center gap-1">{renderCountdown()} Remaining</span>
                        <span className="ml-2">•</span>
                    </div>
                </div>
            </div>
        </div>
    );
}