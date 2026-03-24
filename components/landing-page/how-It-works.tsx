"use client";
// components/landing-page/why-platform-section.tsx
import {
  UserPlus,
  Gift,
  PlusCircle,
  TrendingUp,
  Zap,
  CreditCard,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FeatureCard } from "@/components/landing-page/FeatureCard";

export default function WhyPlatformSection() {
  const steps = [
    {
      step: "01",
      title: "Create Account",
      desc: "Join SECURE RISE in seconds. Our registration is fast, encrypted, and built to protect your identity from day one.",
      icon: <UserPlus className="w-[18px] h-[18px]" />,
    },
    {
      step: "02",
      title: "Claim $20 Bonus",
      desc: "New members receive a $20 welcome bonus credited to their trading wallet instantly — zero conditions.",
      icon: <Gift className="w-[18px] h-[18px]" />,
    },
    {
      step: "03",
      title: "Add Capital",
      desc: "Deposit funds through secure gateways. Choose the amount you want to put to work in the global markets.",
      icon: <PlusCircle className="w-[18px] h-[18px]" />,
    },
    {
      step: "04",
      title: "Professional Trading",
      desc: "Expert traders and AI algorithms execute high-frequency trades around the clock to maximize your returns.",
      icon: <TrendingUp className="w-[18px] h-[18px]" />,
    },
    {
      step: "05",
      title: "Daily Accumulation",
      desc: "Profits are calculated and credited to your account every 24 hours — watch your balance grow without lifting a finger.",
      icon: <Zap className="w-[18px] h-[18px]" />,
    },
    {
      step: "06",
      title: "Easy Withdrawals",
      desc: "Your money, your control. Request a withdrawal anytime and receive funds directly to your preferred method.",
      icon: <CreditCard className="w-[18px] h-[18px]" />,
    },
  ];

  return (
    <section
      id="why-this-platform"
      className="mx-auto max-w-[1400px] px-4 lg:px-8 py-16 lg:py-10 w-full"
    >
      {/* Header */}
      <div className="mb-14">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-[11px] font-medium uppercase tracking-widest text-primary">
            Simple Process
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
          How It Works
        </h2>

        <p className="text-muted-foreground max-w-lg text-base md:text-lg font-light leading-relaxed">
          A streamlined 6-step journey — from sign-up to daily profits with
          institutional-grade efficiency.
        </p>
      </div>

      {/* Desktop / Tablet Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {steps.map((step, index) => (
          <StepCard key={index} step={step} />
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden">
        <Carousel className="w-full">
          <CarouselContent>
            {steps.map((step, i) => (
              <CarouselItem key={i}>
                <StepCard step={step} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex items-center justify-center gap-6">
            <CarouselPrevious className="static translate-y-0 w-11 h-11 bg-primary/8 hover:bg-primary/15 border border-primary/20 rounded-xl" />
            <CarouselNext className="static translate-y-0 w-11 h-11 bg-primary/8 hover:bg-primary/15 border border-primary/20 rounded-xl" />
          </div>
        </Carousel>
      </div>

      {/* Footer rule */}
      <div className="mt-14 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium whitespace-nowrap">
          Start your journey today
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>
    </section>
  );
}

// ─── Step Card Sub-component ──────────────────────────────────────────────────

type Step = {
  step: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
};

function StepCard({ step }: { step: Step }) {
  return (
    <div className="group relative rounded-2xl cursor-pointer border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.15)] cursor-default overflow-hidden">
      {/* Top accent line — visible on hover */}
      <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-primary to-primary/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      {/* Step label + Icon */}
      <div className="flex items-start justify-between mb-4">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">
          Step {step.step}
        </span>
        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-primary/15 bg-primary/8 text-primary transition-colors duration-200 group-hover:bg-primary/12">
          {step.icon}
        </div>
      </div>

      {/* Text */}
      <h3 className="font-bold text-[1rem] tracking-tight text-foreground mb-2">
        {step.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed font-light">
        {step.desc}
      </p>
    </div>
  );
}