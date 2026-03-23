"use client";
// components/landing-page/risk-protection.tsx
import Image from "next/image";
import { ShieldCheck, RefreshCcw, TrendingDown } from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export default function RiskProtection() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 pb-30 w-full">
      {/* Header Content — OUTSIDE the card */}
      <div className="text-center mb-8 px-6">
        <h2
          className={`${montserrat.className} text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 text-foreground`}
        >
          What If We Lose Your Money ?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          At SECURE RISE, we prioritize your peace of mind. Our risk management
          systems are built to ensure your capital is always protected.
        </p>
      </div>

      {/* Bordered Card */}
      <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-card/40 dark:bg-black/40 backdrop-blur-md shadow-xl dark:shadow-none">
        {/* Main Image Section — top of card */}
        {/* Main Image Section — top of card */}
        <div className="relative w-full h-[350px] md:h-[1000px] bg-gradient-to-b from-primary/5 to-transparent">
          <Image
            src="https://i.postimg.cc/vTFvT4Vj/secure-rise.png"
            alt="Capital Protection"
            fill
            // Removed scale-95 from mobile, added object-cover to ensure full width/height
            className="object-cover md:object-cover transition-transform duration-500"
            priority
          />

          {/* Subtle Glow Overlay - Fixed to blend perfectly with the card in light/dark mode */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent dark:from-black dark:via-transparent" />
        </div>

        {/* Feature Highlights — bottom of card */}
        {/* We use bg-muted/50 for light mode and a darker shade for dark mode */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 p-6 md:p-12 bg-muted/30 dark:bg-black/60 border-t border-primary/10">
          {/* Card 1 */}
          <div className="p-6 flex flex-col group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors shrink-0">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground">
                Full Capital Refund
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If a trade results in a loss of your initial capital, that's on
              us. We refund 100% of your invested amount immediately.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 flex flex-col group border-y md:border-y-0 md:border-x border-primary/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors shrink-0">
                <RefreshCcw className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground">
                +20% Compensation
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We don't just return your money; we add 20% of your capital as
              compensation, fully withdrawable the moment it arrives.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 flex flex-col group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors shrink-0">
                <TrendingDown className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground">
                Proactive Risk Control
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We make sure we don't lose your capital by trading properly and
              managing risks with professional precision.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
