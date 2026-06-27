"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  Upload,
  Globe,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Camera,
  FileText,
  Smartphone,
  ShoppingBag,
  Gamepad2,
  Gift,
  ChevronRight,
} from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

// ─── Types ────────────────────────────────────────────────────────────────────
interface GiftCardRecord {
  _id: string;
  cardType: string;
  country: string;
  amount: number;
  currency: string;
  code: string;
  status: "pending_review" | "processing" | "approved" | "rejected";
  createdAt: string;
  userId: string;
}

const GIFT_CARD_TYPES = [
  { name: "Apple", image: "https://i.postimg.cc/FzxYYWzf/apple.jpg" },
  { name: "Xbox", image: "https://i.postimg.cc/hGxPJyZH/XBOX.jpg" },
  { name: "Amazon", image: "https://i.postimg.cc/K8j1Y52S/amazon.jpg" },
  { name: "Steam", image: "https://i.postimg.cc/VNb5qL58/Steam.jpg" },
  { name: "Razer Gold", image: "https://i.postimg.cc/W1d4VbG3/Razer-Gold.jpg" },
  { name: "Google Play", image: "https://i.postimg.cc/3RXRqSg2/Google-Play.jpg" },
];

const COUNTRIES = [
  { name: "USA", currency: "USD", flag: "🇺🇸" },
  { name: "UK", currency: "GBP", flag: "🇬🇧" },
  { name: "Canada", currency: "CAD", flag: "🇨🇦" },
  { name: "Australia", currency: "AUD", flag: "🇦🇺" },

  { name: "Germany", currency: "EUR", flag: "🇩🇪" },
  { name: "France", currency: "EUR", flag: "🇫🇷" },
  // { name: "Netherlands", currency: "EUR", flag: "🇳🇱" },
  { name: "Italy", currency: "EUR", flag: "🇮🇹" },
  { name: "Spain", currency: "EUR", flag: "🇪🇸" },

  { name: "Ireland", currency: "EUR", flag: "🇮🇪" },
  // { name: "Switzerland", currency: "CHF", flag: "🇨🇭" },
  { name: "Sweden", currency: "SEK", flag: "🇸🇪" },

  { name: "UAE", currency: "AED", flag: "🇦🇪" },

  { name: "Japan", currency: "JPY", flag: "🇯🇵" },
  { name: "Singapore", currency: "SGD", flag: "🇸🇬" },

];

const STEP_LABELS = ["Card Type", "Country", "Amount", "Upload", "Code"];

const GiftCardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCardType, setSelectedCardType] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [amount, setAmount] = useState("");
  const [cardCode, setCardCode] = useState("");
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [giftCards, setGiftCards] = useState<GiftCardRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGiftCards();
  }, []);

  const fetchGiftCards = async () => {
    try {
      const userResponse = await fetch("/api/user/info");
      if (!userResponse.ok) { setLoading(false); return; }
      const userData = await userResponse.json();
      if (!userData.success || !userData.user) { setLoading(false); return; }
      const user = userData.user;
      const response = await fetch(`/api/user-dashboard/gift-card?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setGiftCards(data.giftCards || []);
      }
    } catch (error) {
      console.error("Error fetching gift cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalApproved = giftCards
    .filter((card) => card.status === "approved")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "approved":
        return { icon: <CheckCircle2 className="w-3 h-3 text-green-500" />, text: "text-green-500", label: "Approved" };
      case "rejected":
        return { icon: <XCircle className="w-3 h-3 text-red-500" />, text: "text-red-500", label: "Rejected" };
      case "processing":
        return { icon: <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />, text: "text-blue-500", label: "Processing" };
      default:
        return { icon: <Clock className="w-3 h-3 text-orange-400" />, text: "text-orange-400", label: "Pending" };
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFrontImage(file);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedCardType !== "";
      case 2: return selectedCountry !== "";
      case 3: return amount !== "" && parseFloat(amount) > 0;
      case 4: return frontImage !== null;
      case 5: return cardCode !== "";
      default: return false;
    }
  };

  const nextStep = () => { if (canProceed() && currentStep < 5) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };
  const getSelectedCountryData = () => COUNTRIES.find((c) => c.name === selectedCountry);

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-25 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* ── Page Header ─────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none flex items-center gap-2">
                  {/* <Gift className="w-5 h-5 text-primary" /> */}
                  Gift Card Deposit
                </h1>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <Gift className="w-3 h-3 text-primary" />
                  Secure gift card verification system
                </p>
              </div>
            </div>

            {/* ── Progress Bar ─────────────────────────────────────────── */}
            <div className="bg-card border border-border rounded-[1rem] p-4 md:p-5">
              <div className="flex items-center">
                {STEP_LABELS.map((label, i) => {
                  const step = i + 1;
                  const isActive = currentStep === step;
                  const isDone = currentStep > step;
                  return (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center gap-1.5 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black transition-all shrink-0 ${
                          isDone ? "bg-green-500 text-white" :
                          isActive ? "bg-foreground text-background ring-4 ring-foreground/20" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : step}
                        </div>
                        <p className={`text-[9px] font-black uppercase tracking-widest hidden sm:block ${
                          isActive ? "text-foreground" : isDone ? "text-green-500" : "text-muted-foreground"
                        }`}>
                          {label}
                        </p>
                      </div>
                      {step < 5 && (
                        <div className={`flex-1 h-0.5 mx-2 mb-3 sm:mb-[1.2rem] transition-all ${
                          currentStep > step ? "bg-green-500" : "bg-muted"
                        }`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* ── Main Layout ──────────────────────────────────────────── */}
            <div className="flex flex-col lg:flex-row gap-5">

              {/* Left: Step Form */}
              <div className="flex-1">
                <div className="bg-card border border-border rounded-[1rem] p-5 md:p-6 shadow-sm">

                  {/* Step header pill */}
                  <div className="inline-flex items-center gap-2 bg-foreground/5 border border-border rounded-full px-3 py-1.5 mb-5">
                    <div className="w-4 h-4 rounded-full bg-foreground text-background text-[9px] font-black flex items-center justify-center">
                      {currentStep}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {STEP_LABELS[currentStep - 1]}
                    </span>
                  </div>

                  {/* ── Step 1: Card Type ── */}
                  {currentStep === 1 && (
                    <div className="space-y-3">
                      <p className="text-xs font-black uppercase tracking-tight">Select your gift card type</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
  {GIFT_CARD_TYPES.map((card) => {
    const isSelected = selectedCardType === card.name;

    return (
      <button
        key={card.name}
        onClick={() => setSelectedCardType(card.name)}
        className={`relative flex items-center justify-between gap-3 overflow-hidden cursor-pointer px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
          isSelected
            ? "bg-foreground border-transparent shadow-xl"
            : "bg-background border-border hover:border-foreground/30"
        }`}
      >
        {/* Left Content */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Logo */}
          <div
            className={`w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shrink-0 ${
              isSelected
                ? "bg-background/10 ring-1 ring-background/10"
                : "bg-muted"
            }`}
          >
            <img
              src={card.image}
              alt={card.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name */}
          <p
            className={`text-xs font-black uppercase tracking-tight text-left leading-tight ${
              isSelected ? "text-background" : "text-foreground"
            }`}
          >
            {card.name}
          </p>
        </div>

        {/* Check */}
        {isSelected && (
          <CheckCircle2 className="w-4 h-4 text-background/70 shrink-0" />
        )}
      </button>
    );
  })}
</div>
                    </div>
                  )}

                  {/* ── Step 2: Country ── */}
                  {currentStep === 2 && (
                    <div className="space-y-3">
                      <p className="text-xs font-black uppercase tracking-tight">Select card region</p>
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                        {COUNTRIES.map((country) => {
                          const isSelected = selectedCountry === country.name;
                          return (
                            <button
                              key={country.name}
                              onClick={() => setSelectedCountry(country.name)}
                              className={`flex items-center justify-between cursor-pointer px-4 py-3.5 rounded-xl border-2 transition-all duration-200 ${
                                isSelected
                                  ? "bg-foreground border-transparent shadow-xl"
                                  : "bg-background border-border hover:border-foreground/30"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{country.flag}</span>
                                <div className="text-left">
                                  <p className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? "text-background/60" : "text-muted-foreground"}`}>
                                    {country.currency}
                                  </p>
                                  <p className={`text-xs font-black uppercase tracking-tight ${isSelected ? "text-background" : "text-foreground"}`}>
                                    {country.name}
                                  </p>
                                </div>
                              </div>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-background/70 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── Step 3: Amount ── */}
                  {currentStep === 3 && (
                    <div className="space-y-3">
                      <p className="text-xs font-black uppercase tracking-tight">Enter the card Amount</p>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-muted-foreground pointer-events-none z-10">
                          {getSelectedCountryData()?.currency || "USD"}
                        </span>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full bg-muted/30 border-2 border-border rounded-xl p-3 pl-14 text-sm font-black tracking-tight focus:border-foreground focus:outline-none transition-all placeholder:text-muted-foreground/50"
                          placeholder="0.00"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                        Enter the exact denomination printed on the card
                      </p>
                    </div>
                  )}

                  {/* ── Step 4: Upload ── */}
                  {currentStep === 4 && (
                    <div className="space-y-3">
                      <p className="text-xs font-black uppercase tracking-tight">Upload card image</p>
                      <input type="file" id="cardImage" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <label htmlFor="cardImage" className="cursor-pointer block">
                        <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all ${
                          frontImage ? "border-primary bg-primary/5" : "border-border bg-muted/10 hover:border-foreground/30"
                        }`}>
                          {frontImage ? (
                            <>
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-primary" />
                              </div>
                              <div className="text-center">
                                <p className="text-xs font-black text-foreground">{frontImage.name}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Click to replace</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                                <Upload className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <div className="text-center">
                                <p className="text-xs font-black text-foreground">Click to upload card image</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Full card · Code visible · No blur</p>
                              </div>
                            </>
                          )}
                        </div>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Full card visible", "readable code", "No blur or crop", "Good lighting"].map((req) => (
                          <div key={req} className="flex items-center gap-1.5 bg-muted/30 border border-border/50 rounded-lg px-3 py-2">
                            <CheckCircle2 className="w-3 h-3 text-muted-foreground shrink-0" />
                            <span className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Step 5: Code ── */}
                  {currentStep === 5 && (
                    <div className="space-y-4">
                      <p className="text-xs font-black uppercase tracking-tight">Enter the card code</p>
                      <input
                        type="text"
                        value={cardCode}
                        onChange={(e) => setCardCode(e.target.value.toUpperCase())}
                        className="w-full bg-muted/30 border-2 border-border rounded-xl p-3 text-sm font-black tracking-[0.2em] focus:border-foreground focus:outline-none transition-all text-center placeholder:text-muted-foreground/50 placeholder:tracking-normal"
                        placeholder="XXXX-XXXX-XXXX"
                        maxLength={19}
                      />
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest text-center">
                        Enter exactly as shown on the card
                      </p>

                      {/* Review summary */}
                      <div className="bg-foreground text-background rounded-[1rem] p-4 space-y-2.5 relative overflow-hidden">
                        <Gift className="absolute -right-4 -top-4 w-16 h-16 opacity-10" />
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Submission Summary</p>
                        {[
                          { label: "Card Type", value: selectedCardType },
                          { label: "Region", value: `${selectedCountry} · ${getSelectedCountryData()?.currency}` },
                          { label: "Amount", value: `${getSelectedCountryData()?.currency} ${amount}` },
                          { label: "Code", value: cardCode || "—" },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex items-center justify-between border-b border-background/10 pb-2 last:border-0 last:pb-0">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{label}</span>
                            <span className="text-xs font-black tracking-tight">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Navigation Buttons ── */}
                  <div className="flex gap-3 mt-6">
                    {currentStep > 1 && (
                      <button
                        onClick={prevStep}
                        className="flex-1 bg-muted text-foreground py-3 rounded-lg font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-muted/70 transition-all cursor-pointer"
                      >
                        Back
                      </button>
                    )}
                    {currentStep < 5 ? (
                      <button
                        onClick={nextStep}
                        disabled={!canProceed()}
                        className={`flex-1 py-3 rounded-lg font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${
                          canProceed()
                            ? "bg-foreground text-background cursor-pointer hover:opacity-90 shadow-xl"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        }`}
                      >
                        Continue <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <Link
                        href={`/user-dashboard/gift-card/submit?cardType=${selectedCardType}&country=${selectedCountry}&amount=${amount}&currency=${getSelectedCountryData()?.currency}&code=${cardCode}${frontImage ? `&hasImage=true&imageName=${encodeURIComponent(frontImage.name)}` : ''}`}
                        className="flex-1"
                      >
                        <button
                          disabled={!canProceed()}
                          className={`w-full py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${
                            canProceed()
                              ? "bg-foreground text-background cursor-pointer hover:opacity-90 shadow-xl"
                              : "bg-muted text-muted-foreground cursor-not-allowed"
                          }`}
                        >
                          Submit <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Right Sidebar ────────────────────────────────────────── */}
              <div className="w-full lg:w-[340px] space-y-4">

                {/* Total Value Card */}
                <div className="bg-foreground text-background p-5 rounded-[1rem] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_50%)]" />
                  <Gift className="absolute -right-4 -top-4 w-20 h-20 opacity-10" />
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 mb-1.5 relative z-10">
                    Total Approved Value
                  </p>
                  <h3 className="text-2xl font-black tracking-tighter relative z-10">
                    {getSelectedCountryData()?.currency || "$"}
                    {totalApproved.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h3>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mt-1 relative z-10">
                    Lifetime approved deposits
                  </p>
                </div>

                {/* History */}
                <div className="bg-card border border-border rounded-[1rem] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="w-3.5 h-3.5 text-muted-foreground" />
                      <p className="text-[10px] font-black uppercase tracking-widest">
                        Card History
                      </p>
                    </div>
                    {giftCards.length > 5 && (
                      <Link
                        href="/user-dashboard/gift-card/history"
                        className="text-[9px] font-black uppercase text-primary hover:opacity-80 transition-opacity"
                      >
                        View All
                      </Link>
                    )}
                  </div>

                  <div className="space-y-2">
                    {loading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Loading...</p>
                      </div>
                    ) : giftCards.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                          <Gift className="w-4 h-4 opacity-40" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">No submissions yet</p>
                      </div>
                    ) : (
                      giftCards.map((card, index) => {
                        // Hide items beyond 5th on desktop (lg:hidden), show all on mobile
                        const isHiddenOnDesktop = index >= 5;
                        const style = getStatusStyles(card.status);
                        const formattedDate = new Date(card.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                        return (
                          <div
                            key={card._id}
                            className={`flex bg-muted/30 border border-border/50 px-3 py-2.5 rounded-xl items-center justify-between hover:border-foreground/20 transition-all ${isHiddenOnDesktop ? 'lg:hidden' : ''}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="p-1.5 bg-background rounded-lg shrink-0">
                                <Gift className="w-3.5 h-3.5 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="text-[11px] font-black uppercase tracking-tight">
                                  {card.cardType}
                                </p>
                                <p className="text-[9px] font-black uppercase text-muted-foreground">
                                  {formattedDate}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-black tracking-tighter">
                                +{card.currency} {card.amount.toLocaleString()}
                              </p>
                              <div className="flex items-center justify-end gap-1 mt-0.5">
                                {style.icon}
                                <p className={`text-[8px] font-black uppercase tracking-widest ${style.text}`}>
                                  {style.label}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
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

export default GiftCardPage;