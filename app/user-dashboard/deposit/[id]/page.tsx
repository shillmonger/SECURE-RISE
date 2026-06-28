"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import QRCode from "qrcode";
import { toast } from "sonner";

import { 
  ChevronRight, 
  Copy, 
  CheckCircle2, 
  Upload, 
  QrCode, 
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Zap,
  Check,
  AlertTriangle,
  Info
} from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

const MakePaymentPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState("100");
  const [showSuccess, setShowSuccess] = useState(false);
  const [depositData, setDepositData] = useState<any>(null);
  
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentMethods: Record<string, { name: string; address: string; network: string }> = {
    bitcoin: { name: "Bitcoin", address: "bc1qj4m4uyfnyynxtkd4dhmx7r47rmsdvy4dqm4gad", network: "BTC" },
    ethereum: { name: "Ethereum", address: "0x21f0b7513264d07b54246123dd72ab4bdcb7dc64", network: "ERC20" },
    "usdt-trc20": { name: "USDT-TRC20", address: "TNx5x4TtsoYZVeaZPvVoGLk59Gyny9Px49", network: "TRC20" },
    solana: { name: "Solana", address: "BytFN7JYPcs8qfXGzhgjaA4okvc1usgpemd4iFrr9rwB", network: "SOL" },
    litecoin: { name: "Litecoin", address: "ltc1qkkmh2rtwje98jx8ffrgxquse7tq6phmcc96nyd", network: "LTC" },
    xrp: { name: "XRP", address: "re5NTE9hACgBpRE3LQZmY3d5nmBugicks", network: "XRP" },
    doge: { name: "Dogecoin", address: "DTsjjoDudtwGVJPfQFb15xP6pQzAxquz2r", network: "DOGE" },
    "usdc-erc20": { name: "USDC ERC20", address: "0x21F0b7513264d07b54246123DD72AB4BdCB7dC64", network: "ERC20" },
    cardano: { name: "Cardano", address: "addr1q8c26332j4ptdk7hu90eacjnj9dsctcymxaze6demgsld0eyev2jxl4zxjwdcaadejksvn0w08u3436usa4xxqye0fks8jr7n4", network: "ADA" },
    "bnb-bep20": { name: "BNB BEP20", address: "0x21f0b7513264d07b54246123dd72ab4bdcb7dc64", network: "BEP20" }
  };

  const currentId = params.id as string;
  const paymentMethod = paymentMethods[currentId] || paymentMethods.bitcoin;

  useEffect(() => {
    const urlAmount = searchParams.get('amount');
    if (urlAmount) setAmount(urlAmount);
  }, [searchParams]);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const url = await QRCode.toDataURL(paymentMethod.address);
        setQrCodeUrl(url);
      } catch (err) {
        console.error('QR error:', err);
      }
    };
    generateQRCode();
  }, [paymentMethod.address]);

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentMethod.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please upload proof of transfer');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const userResponse = await fetch('/api/user/info');
      
      if (!userResponse.ok) {
        toast.error('Please log in to submit a deposit');
        return;
      }
      
      const userData = await userResponse.json();
      
      if (!userData.success || !userData.user) {
        toast.error('Please log in to submit a deposit');
        return;
      }
      
      const user = userData.user;
      
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('paymentMethod', paymentMethod.name);
      formData.append('proofImage', selectedFile);
      formData.append('userId', user.id);
      formData.append('username', user.username);
      formData.append('userEmail', user.email);

      const response = await fetch('/api/user-dashboard/deposit', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const depositData = {
          amount: amount,
          paymentMethod: paymentMethod.name,
          transactionId: result.transactionId,
          username: user.username
        };
        setDepositData(depositData);
        setShowSuccess(true);
      } else {
        toast.error(result.error || 'Failed to submit deposit');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit deposit. Please try again.');
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
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Checkout</h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-primary" /> Secure Payment Gateway
                </p>
              </div>
              <Link href="/user-dashboard/deposit">
                <button className="flex items-center gap-2 hover:bg-muted p-2 px-3 cursor-pointer rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                  <ArrowLeft className="w-4 h-4" /> Cancel
                </button>
              </Link>
            </div>

            {/* Main flex row — matches gift card layout */}
            <div className="flex flex-col lg:flex-row gap-7">

              {/* LEFT: Main card — 70% */}
              <div className="bg-card border border-border rounded-[1rem] overflow-hidden shadow-2xl lg:w-[70%]">
                {/* Method Indicator Bar */}
                <div className="bg-foreground p-3 py-2 sm:px-4 sm:py-1 text-background flex justify-between flex-wrap items-center gap-1 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="bg-yellow-500/20 p-2 sm:p-3 rounded-xl flex items-center justify-center">
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-60">
                        Pay with
                      </p>
                      <p className="text-sm sm:text-xl font-black uppercase tracking-tight flex items-center gap-1 sm:gap-2 truncate">
                        {paymentMethod.name}
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 opacity-40 shrink-0" />
                      </p>
                    </div>
                  </div>
                  <div className="flex sm:block items-center justify-between sm:text-right w-full sm:w-auto">
                    <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-60">
                      Required Amount
                    </p>
                    <p className="text-lg sm:text-xl font-black tracking-tight text-green-500">
                      ${parseFloat(amount).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="p-5 md:p-6 space-y-9">
                  <div className="grid md:grid-cols-2 gap-8 lg:gap-8 items-start">

                    {/* Left Side: QR */}
                    <div className="space-y-6">
                      <div className="relative group">
                        <div className="relative flex flex-col items-center justify-center p-5 bg-background border-2 border-dashed border-border rounded-[1rem]">
                          <div className="bg-foreground p-4 rounded-xl shadow-xl mb-6">
                            {qrCodeUrl ? (
                              <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40 invert" />
                            ) : (
                              <QrCode className="w-36 h-36 text-background" />
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest text-center">
                            Scan address for mobile transfer
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Copy & Upload */}
                    <div className="space-y-7 lg:space-y-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                          Official {paymentMethod.name} Address
                        </label>
                        <div className="group relative">
                          <div className="w-full bg-muted/30 border-2 border-border rounded-xl p-4 pr-14 text-sm font-black leading-relaxed">
                            {paymentMethod.address.slice(0, 15)}...{paymentMethod.address.slice(-4)}
                          </div>
                          <button
                            onClick={handleCopy}
                            className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 bg-foreground text-background p-2 rounded-lg hover:scale-105 transition-all shadow-lg active:scale-95"
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="bg-primary/10 text-primary text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest">
                            Network: {paymentMethod.network}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-border">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                          Upload Proof of Transfer
                        </label>
                        <div className="relative group">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className={`border-2 border-dashed rounded-xl p-6 lg:p-3 flex flex-col items-center justify-center gap-3 transition-all ${
                            selectedFile ? 'border-primary bg-primary/5' : 'border-border bg-muted/10 group-hover:border-foreground/40'
                          }`}>
                            <Upload className={`w-6 h-6 ${selectedFile ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-center">
                              {selectedFile?.name || 'Choose Screenshot'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Submit Action */}
                      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                        <button
                          type="submit"
                          disabled={isSubmitting || !selectedFile}
                          className="w-full bg-foreground cursor-pointer text-background px-5 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed group"
                        >
                          {isSubmitting ? (
                            <>Submitting <Loader2 className="w-4 h-4 animate-spin" /></>
                          ) : (
                            <>Submit For Review <CheckCircle2 className="w-4 h-4" /></>
                          )}
                        </button>
                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest text-center">
                          Review typically takes 5-30 minutes
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Warning banner — 30% */}
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:w-[30%]">
                <div className="relative overflow-hidden rounded-[1.2rem] border-2 border-red-500/30 bg-gradient-to-br from-red-500/15 via-orange-500/10 to-red-500/5 bg-white/80 dark:bg-transparent p-4 md:p-5 backdrop-blur-sm shadow-sm dark:shadow-none w-full">

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.04),transparent_45%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />
                  <AlertTriangle className="absolute -right-5 -top-5 h-28 w-28 text-red-400 opacity-10" />

                  <div className="relative z-10 mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 border border-red-500/30">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-600 dark:text-red-300">
                        Deposit Warning
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-tight text-gray-700 dark:text-red-100/70">
                        Read carefully before sending funds
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-3">
                    <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 dark:bg-black/20 px-4 py-3">
                      <Copy className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-tight text-gray-900 dark:text-red-100">
                          Always Use The Copy Button
                        </span>
                        <p className="mt-0.5 text-[10px] text-gray-600 dark:text-red-100/60 leading-relaxed">
                          Never type the address manually. One wrong character means permanent, unrecoverable loss of funds.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 dark:bg-red-500/10 px-4 py-3">
                      <Zap className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-tight text-gray-900 dark:text-red-100">
                          Send On The Correct Network Only
                        </span>
                        <p className="mt-0.5 text-[10px] text-gray-600 dark:text-red-100/60 leading-relaxed">
                          Sending on the wrong network will result in loss. Network shown:{" "}
                          <span className="text-red-600 dark:text-red-300 font-black">
                            {paymentMethod.network}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 dark:bg-black/20 px-4 py-3">
                      <CheckCircle2 className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-tight text-gray-900 dark:text-red-100">
                          Send The Exact Amount
                        </span>
                        <p className="mt-0.5 text-[10px] text-gray-600 dark:text-red-100/60 leading-relaxed">
                          Under- or over-payment may delay or void your deposit pending manual review.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 dark:bg-black/20 px-4 py-3">
                      <Upload className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-tight text-gray-900 dark:text-red-100">
                          Upload Clear Proof Of Transfer
                        </span>
                        <p className="mt-0.5 text-[10px] text-gray-600 dark:text-red-100/60 leading-relaxed">
                          Screenshot must show transaction hash, amount & destination address. Blurry images will be rejected.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 dark:bg-red-500/10 px-4 py-3">
                      <span className="text-[11px] font-black uppercase tracking-tight text-gray-900 dark:text-red-100">
                        Transactions Are Irreversible
                      </span>
                      <span className="text-[11px] font-black text-red-600 dark:text-red-400">
                        No Exceptions
                      </span>
                    </div>
                  </div>
                </div>
              </div>

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
            window.location.href = "/user-dashboard/deposit";
          }}
        >
          <div
            className="bg-card border border-border rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-5 h-20 w-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
              <svg className="h-9 w-9 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-foreground mb-1">Deposit Submitted! 🎉</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Your deposit of <span className="text-primary font-bold">${parseFloat(depositData.amount).toLocaleString()}</span> via <span className="text-foreground font-semibold">{depositData.paymentMethod}</span> has been submitted for review.
            </p>
            <div className="bg-muted/50 rounded-2xl p-4 mb-6 text-left space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="text-foreground font-semibold">{depositData.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="text-primary font-black text-base">${parseFloat(depositData.amount).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm gap-4">
                <span className="text-muted-foreground shrink-0">Transaction ID</span>
                <span className="text-foreground font-semibold text-xs truncate max-w-[150px]" title={depositData.transactionId}>
                  {depositData.transactionId}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="text-yellow-500 font-semibold">Pending Review</span>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-6">
              <p className="text-[10px] text-yellow-800 font-black text-center">
                ⏱️ Review typically takes 5-30 minutes. You'll receive an email once approved.
              </p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push('/user-dashboard/deposit');
              }}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              View Deposit History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakePaymentPage;