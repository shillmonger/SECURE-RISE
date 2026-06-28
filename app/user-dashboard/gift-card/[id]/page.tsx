"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  ChevronRight,
  Copy,
  CheckCircle2,
  Upload,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  CreditCard,
  Check,
  AlertTriangle,
  Info,
  Gift,
  FileText,
  Camera,
  Clock,
  X,
} from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

const GiftCardSubmitPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [frontImageData, setFrontImageData] = useState<string>("");
  const [backImageData, setBackImageData] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [giftCardData, setGiftCardData] = useState<any>(null);

  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentId = params.id as string;

  // Get form data from URL params
  const cardType = searchParams.get("cardType") || "";
  const country = searchParams.get("country") || "";
  const amount = searchParams.get("amount") || "";
  const currency = searchParams.get("currency") || "USD";
  const code = searchParams.get("code") || "";

  useEffect(() => {
    // If no required data, redirect back to gift card page
    if (!cardType || !country || !amount || !code) {
      router.push("/user-dashboard/gift-card");
    }
    // Retrieve image data from sessionStorage
    const frontImage = sessionStorage.getItem('giftCardFrontImage') || '';
    const backImage = sessionStorage.getItem('giftCardBackImage') || '';

    if (frontImage) {
      setFrontImageData(frontImage);
    }
    if (backImage) {
      setBackImageData(backImage);
    }

    // Clear sessionStorage after retrieving data
    sessionStorage.removeItem('giftCardFrontImage');
    sessionStorage.removeItem('giftCardBackImage');
  }, [cardType, country, amount, code, router]);

  const getCardImage = (type: string) => {
    switch (type) {
      case "Apple":
        return "https://i.postimg.cc/FzxYYWzf/apple.jpg";
      case "Amazon":
        return "https://i.postimg.cc/K8j1Y52S/amazon.jpg";
      case "Steam":
        return "https://i.postimg.cc/VNb5qL58/Steam.jpg";
      case "Google Play":
        return "https://i.postimg.cc/3RXRqSg2/Google-Play.jpg";
      case "Razer Gold":
        return "https://i.postimg.cc/W1d4VbG3/Razer-Gold.jpg";
      case "Xbox":
        return "https://i.postimg.cc/hGxPJyZH/XBOX.jpg";
      default:
        return undefined;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const base64ToFile = (base64: string, filename: string): File => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!frontImageData) {
      toast.error("Please upload the front gift card image");
      return;
    }
    if (!backImageData) {
      toast.error("Please upload the back gift card image");
      return;
    }

    setIsSubmitting(true);

    try {
      const userResponse = await fetch("/api/user/info");

      if (!userResponse.ok) {
        toast.error("Please log in to submit a gift card");
        return;
      }

      const userData = await userResponse.json();

      if (!userData.success || !userData.user) {
        toast.error("Please log in to submit a gift card");
        return;
      }

      const user = userData.user;

      const formData = new FormData();
      formData.append("cardType", cardType);
      formData.append("country", country);
      formData.append("amount", amount);
      formData.append("currency", currency);
      formData.append("code", code);

      // Convert base64 to File objects
      const frontFile = base64ToFile(frontImageData, 'front-image.jpg');
      const backFile = base64ToFile(backImageData, 'back-image.jpg');

      formData.append("frontImage", frontFile);
      formData.append("backImage", backFile);

      if (description) {
        formData.append("description", description);
      }

      formData.append("userId", user.id);
      formData.append("username", user.username);
      formData.append("userEmail", user.email);

      const response = await fetch("/api/user-dashboard/gift-card", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const data = {
          cardType: cardType,
          country: country,
          amount: amount,
          currency: currency,
          code: code,
          transactionId: result.transactionId,
          username: user.username,
        };
        setGiftCardData(data);
        setShowSuccess(true);
      } else {
        toast.error(result.error || "Failed to submit gift card");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit gift card. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-25 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Nav Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                  Checkout
                </h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-primary" /> Secure Gift
                  Card Verification
                </p>
              </div>
              <Link href="/user-dashboard/gift-card">
                <button className="flex items-center gap-2 hover:bg-muted p-2 px-3 cursor-pointer rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                  <ArrowLeft className="w-4 h-4" /> Cancel
                </button>
              </Link>
            </div>

            {/* Main card */}
            <div className="flex flex-col lg:flex-row gap-7 lg:10">
              <div className="bg-card border border-border rounded-[1rem] overflow-hidden shadow-2xl lg:w-[70%]">
                {/* Method Indicator Bar */}
                <div className="bg-foreground p-3 py-2 sm:px-4 sm:py-1 text-background flex justify-between flex-wrap items-center gap-1 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="bg-primary/20 p-2 sm:p-3 rounded-xl flex items-center justify-center">
                      {getCardImage(cardType) ? (
                        <img
                          src={getCardImage(cardType)}
                          alt={cardType}
                          className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                        />
                      ) : (
                        <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-60">
                        Gift Card Type
                      </p>
                      <p className="text-sm sm:text-xl font-black uppercase tracking-tight flex items-center gap-1 sm:gap-2 truncate">
                        {cardType} ({country})
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 opacity-40 shrink-0" />
                      </p>
                    </div>
                  </div>
                  <div className="flex sm:block items-center justify-between sm:text-right w-full sm:w-auto">
                    <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-60">
                      Card Value
                    </p>
                    <p className="text-lg sm:text-xl font-black tracking-tight text-green-500">
                      {currency} {parseFloat(amount).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="p-5 md:p-6 space-y-9">
                  <div className="grid md:grid-cols-2 gap-8 lg:gap-8 items-start">
                    {/* Left Side: Card Details */}
                    <div className="space-y-6">
                      <div className="relative group">
                       <div className="relative h-50 lg:h-30 overflow-hidden rounded-xl border border-border">
  {/* Background */}
  {getCardImage(cardType) ? (
    <div
      className="absolute inset-0 bg-repeat bg-contain"
      style={{
        backgroundImage: `url(${getCardImage(cardType)})`,
        backgroundSize: "120px auto", // Adjust size as needed
        backgroundPosition: "center",
      }}
    />
  ) : (
    <div className="absolute inset-0 flex items-center justify-center bg-foreground">
      <Gift className="w-16 h-16 text-background" />
    </div>
  )}

  {/* Dark Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

  {/* Content */}
  <div className="relative z-10 flex h-full flex-col items-center justify-end p-6">
    <p className="text-center text-xs font-black uppercase tracking-[0.35em] text-white drop-shadow-lg">
      Gift Card Information
    </p>
  </div>
</div>
                      </div>

                      {/* Card Details Summary */}
                      <div className="space-y-3 bg-muted/30 border border-border/50 rounded-xl p-4">
                        <h4 className="text-xs font-black text-foreground mb-3">
                          Submission Details:
                        </h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Card Type:</span>
                            <span className="font-black">{cardType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Country:</span>
                            <span className="font-black">{country}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount:</span>
                            <span className="font-black text-primary">
                              {currency} {amount}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-black text-orange-500">
                              Pending Review
                            </span>
                          </div>

                          {/* Image Previews */}
                          {(frontImageData || backImageData) && (
                            <div className="pt-3 border-t border-border/50 mt-3">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                                Uploaded Images:
                              </p>
                              <div className="flex gap-2">
                                {frontImageData && (
                                  <div className="flex-1">
                                    <img
                                      src={frontImageData}
                                      alt="Front"
                                      className="w-full h-20 object-cover rounded-lg border border-border"
                                    />
                                    <p className="text-[9px] text-center text-muted-foreground mt-1">Front</p>
                                  </div>
                                )}
                                {backImageData && (
                                  <div className="flex-1">
                                    <img
                                      src={backImageData}
                                      alt="Back"
                                      className="w-full h-20 object-cover rounded-lg border border-border"
                                    />
                                    <p className="text-[9px] text-center text-muted-foreground mt-1">Back</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Code & Upload */}
                    <div className="space-y-7 lg:space-y-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                          Gift Card Code
                        </label>
                        <div className="group relative">
                          <div className="w-full bg-muted/30 border-2 border-border rounded-xl p-4 pr-14 text-sm font-black tracking-wider break-all">
                            {code}
                          </div>
                          <button
                            onClick={handleCopy}
                            className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 bg-foreground text-background p-2 rounded-lg hover:scale-105 transition-all shadow-lg active:scale-95"
                          >
                            {copied ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="bg-primary/10 text-primary text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest">
                            Code verified by staff
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-border">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                          Description (Optional)
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Add any additional information (address, notes, etc.)"
                          className="w-full bg-muted/30 border-2 border-border rounded-xl p-4 text-sm focus:border-foreground focus:outline-none transition-all placeholder:text-muted-foreground/50 resize-none"
                          rows={3}
                          maxLength={500}
                        />
                        <p className="text-[10px] text-muted-foreground">
                          Optional: Add address or additional notes
                        </p>
                      </div>

                      {/* Submit Action */}
                      <form
                        onSubmit={handleSubmit}
                        className="flex flex-col items-center gap-4"
                      >
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-foreground cursor-pointer text-background px-5 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed group"
                        >
                          {isSubmitting ? (
                            <>
                              Submitting <Loader2 className="w-4 h-4 animate-spin" />
                            </>
                          ) : (
                            <>
                              Submit For Review <CheckCircle2 className="w-4 h-4" />
                            </>
                          )}
                        </button>
                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest text-center">
                          Review typically takes 24-48 hours
                        </p>
                      </form>
                    </div>
                  </div>

                </div>
              </div>

              {/* ── Bottom section: Submit info + Guidelines side-by-side on lg ── */}
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:w-[30%]">

                {/* ⚠️ GIFT CARD WARNING BANNER */}
                <div className="relative overflow-hidden rounded-[1.2rem] border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/15 via-yellow-500/10 to-orange-500/5 bg-white/80 dark:bg-transparent p-4 md:p-5 backdrop-blur-sm shadow-sm dark:shadow-none w-full">

                  {/* Background Effects */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.04),transparent_45%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />

                  <AlertTriangle className="absolute -right-5 -top-5 h-28 w-28 text-orange-400 opacity-10" />

                  {/* Header */}
                  <div className="relative z-10 mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20 border border-orange-500/30">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-600 dark:text-orange-300">
                        Gift Card Guidelines
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-tight text-gray-700 dark:text-orange-100/70">
                        Read carefully before submission
                      </p>
                    </div>
                  </div>

                  {/* Warning Items */}
                  <div className="relative z-10 space-y-3">

                    <div className="flex items-start gap-3 rounded-xl border border-orange-500/20 bg-orange-500/5 dark:bg-black/20 px-4 py-3">
                      <FileText className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-tight text-gray-900 dark:text-orange-100">
                          Valid Gift Cards Only
                        </span>
                        <p className="mt-0.5 text-[10px] text-gray-600 dark:text-orange-100/60 leading-relaxed">
                          Only submit unused, valid gift cards. Used or expired cards will be rejected.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-orange-500/20 bg-orange-500/5 dark:bg-orange-500/10 px-4 py-3">
                      <Camera className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-tight text-gray-900 dark:text-orange-100">
                          Clear Image Required
                        </span>
                        <p className="mt-0.5 text-[10px] text-gray-600 dark:text-orange-100/60 leading-relaxed">
                          Image must show full card with code clearly visible. Blurry or cropped images will be rejected.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-orange-500/20 bg-orange-500/5 dark:bg-black/20 px-4 py-3">
                      <Copy className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-tight text-gray-900 dark:text-orange-100">
                          Correct Code Entry
                        </span>
                        <p className="mt-0.5 text-[10px] text-gray-600 dark:text-orange-100/60 leading-relaxed">
                          Double-check your code entry. Incorrect codes will delay verification and may result in rejection.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-orange-500/20 bg-orange-500/5 dark:bg-black/20 px-4 py-3">
                      <Clock className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-tight text-gray-900 dark:text-orange-100">
                          Processing Time
                        </span>
                        <p className="mt-0.5 text-[10px] text-gray-600 dark:text-orange-100/60 leading-relaxed">
                          Gift card verification takes 24-48 hours. You'll be notified once approved or rejected.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-orange-500/20 bg-orange-500/10 dark:bg-orange-500/10 px-4 py-3">
                      <span className="text-[11px] font-black uppercase tracking-tight text-gray-900 dark:text-orange-100">
                        No Instant Credits
                      </span>
                      <span className="text-[11px] font-black text-orange-600 dark:text-orange-400">
                        Manual Review Required
                      </span>
                    </div>

                  </div>
                </div>

              </div>
              {/* ── End bottom section ── */}
            </div>

          </div>
        </main>
      </div>
      <UserNav />



      {/* Success Modal */}
      {showSuccess && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm px-4"
          onClick={() => {
            setShowSuccess(false);
            router.push("/user-dashboard/gift-card");
          }}
        >
          <div
            className="bg-card border border-border rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-5 h-20 w-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
              <svg
                className="h-9 w-9 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-foreground mb-1">
              Gift Card Submitted! 🎉
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Your{" "}
              <span className="text-primary font-bold">
                {giftCardData.cardType}
              </span>{" "}
              gift card worth{" "}
              <span className="text-foreground font-semibold">
                {giftCardData.currency}{" "}
                {parseFloat(giftCardData.amount).toLocaleString()}
              </span>{" "}
              has been submitted for review.
            </p>
            <div className="bg-muted/50 rounded-2xl p-4 mb-6 text-left space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Card Type</span>
                <span className="text-foreground font-semibold">
                  {giftCardData.cardType}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Country</span>
                <span className="text-foreground font-semibold">
                  {giftCardData.country}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="text-primary font-black text-base">
                  {giftCardData.currency}{" "}
                  {parseFloat(giftCardData.amount).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm gap-4">
                <span className="text-muted-foreground shrink-0">
                  Transaction ID
                </span>
                <span
                  className="text-foreground font-semibold text-xs truncate max-w-[150px]"
                  title={giftCardData.transactionId}
                >
                  {giftCardData.transactionId}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="text-yellow-500 font-semibold">
                  Pending Review
                </span>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-6">
              <p className="text-[10px] text-yellow-800 font-black text-center">
                ⏱️ Review typically takes 24-48 hours. You'll receive an email
                once approved.
              </p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push("/user-dashboard/transactions");
              }}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              View Gift Card History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftCardSubmitPage;