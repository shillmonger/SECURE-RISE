"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import QRCode from "qrcode";

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
  Check
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
  
  const params = useParams();
  const searchParams = useSearchParams();

  // Updated Payment methods to match your 10-item list
  const paymentMethods: Record<string, { name: string; address: string; network: string }> = {
    bitcoin: { name: "Bitcoin", address: "bc1qnw5qxtvsayve32042dkruqnrcwx32r8vw4yfmd", network: "BTC" },
    ethereum: { name: "Ethereum", address: "0xc28938a688215b45328068A6B5204f33e3051440", network: "ERC20" },
    "usdt-trc20": { name: "USDT TRC20", address: "TBdVHRagTQvoZ1o38Q3Gn5wUHFWFdLWuGX", network: "TRC20" },
    "usdt-erc20": { name: "USDT ERC20", address: "0xc28938a688215b45328068A6B5204f33e3051440", network: "ERC20" },
    solana: { name: "Solana", address: "Cgt3agGCp4ce5SfSuixJn3N1ByizfvLcNJeeYDWJha4D", network: "SOL" },
    litecoin: { name: "Litecoin", address: "ltc1qdl05yxg8k2qwvfxyxgt8vdlwmjg9h0vulau0rm", network: "LTC" },
    xrp: { name: "XRP", address: "rUABG73PfQR2616j9RjLCzv8WXsp7CkjLu", network: "XRP" },
    doge: { name: "DOGE", address: "DGPybWe6RMp4AyiNzphenLzgWciRw9wXmP", network: "DOGE" },
    "binance-coin": { name: "BNB", address: "0xc28938a688215b45328068A6B5204f33e3051440", network: "BEP20" },
    cardano: { name: "Cardano", address: "addr1qxy...cardano_mock_address", network: "ADA" }
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
        // Simple address QR
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Logic for submission goes here
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Nav Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-black italic uppercase tracking-tighter">Checkout</h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-primary" /> Secure Payment Gateway
                </p>
              </div>
              <Link href="/user-dashboard/deposit">
                <button className="flex items-center gap-2 hover:bg-muted p-3 px-3 cursor-pointer rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                  <ArrowLeft className="w-4 h-4" /> Cancel
                </button>
              </Link>
            </div>

            <div className="bg-card border border-border rounded-[1.5rem] overflow-hidden shadow-2xl">
              {/* Method Indicator Bar */}
              <div className="bg-foreground p-6 text-background flex justify-between flex-wrap items-center gap-4">
  <div className="flex items-center gap-4">
    <div className="bg-background/20 p-3 rounded-xl">
      <Zap className="w-5 h-5 text-background" />
    </div>
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
        Pay with
      </p>
      <p className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
        {paymentMethod.name}
        <ChevronRight className="w-4 h-4 opacity-40" />
      </p>
    </div>
  </div>

  {/* 👇 Push this to the far right */}
  <div className="flex sm:block items-center justify-between sm:text-right w-full sm:w-auto">
  <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
    Required Amount
  </p>
  <p className="text-2xl font-black italic tracking-tighter">
    ${parseFloat(amount).toLocaleString()}
  </p>
</div>
</div>

              <div className="p-6 md:p-12 space-y-12">
                
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  
                  {/* Left Side: Visual/QR */}
                  <div className="space-y-6">
                    <div className="relative group">
                      <div className="relative flex flex-col items-center justify-center p-10 bg-background border-2 border-dashed border-border rounded-[1.5rem]">
                        <div className="bg-foreground p-4 rounded-[1rem] shadow-xl mb-6">
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
                  <div className="space-y-8">
                    {/* Wallet Address */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Official {paymentMethod.name} Address
                      </label>
                      <div className="group relative">
                        <div className="w-full bg-muted/30 border-2 border-border rounded-2xl p-5 pr-14 text-sm font-black italic leading-relaxed">
  {paymentMethod.address.slice(0, 15)}...{paymentMethod.address.slice(-4)}
</div>
                        <button 
                          onClick={handleCopy}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-foreground text-background p-2.5 rounded-lg hover:scale-105 transition-all shadow-lg active:scale-95"
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

                    {/* File Upload */}
                    <div className="space-y-3 pt-6 border-t border-border">
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
                        <div className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all ${
                          selectedFile ? 'border-primary bg-primary/5' : 'border-border bg-muted/10 group-hover:border-foreground/40'
                        }`}>
                          <Upload className={`w-6 h-6 ${selectedFile ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-center">
                            {selectedFile ? selectedFile.name : 'Choose Screenshot'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                   <button 
                    type="submit"
                    disabled={isSubmitting || !selectedFile}
                    className="w-full md:w-auto bg-foreground text-background px-5 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
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
        </main>
      </div>
      <UserNav />
    </div>
  );
};

export default MakePaymentPage;