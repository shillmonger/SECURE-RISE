"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  ArrowUpRight,
  Building2,
  Smartphone,
  Landmark,
  CreditCard,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  X,
  Info,
  Lock,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

// ─── Types ──────────────────────────────────────────────────────────────────

type MethodId = "bank" | "paypal" | "payoneer" | "momo";

interface WithdrawMethod {
  id: MethodId;
  name: string;
  description: string;
  icon: React.ElementType;
}

interface BankTransferData {
  country: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  swift: string;
  iban: string;
  currency: string;
}

interface PayPalData {
  email: string;
}

interface PayoneerData {
  email: string;
}

interface MobileMoneyData {
  country: string;
  provider: string;
  phoneNumber: string;
  accountHolderName: string;
}

interface UserData {
  accountBalance: number;
  email: string;
}

// ─── Static config ──────────────────────────────────────────────────────────

const WITHDRAW_METHODS: WithdrawMethod[] = [
  {
    id: "bank",
    name: "Bank Transfer",
    description: "Direct transfer to your bank account",
    icon: Landmark,
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Fast payout to your PayPal balance",
    icon: Wallet,
  },
  {
    id: "payoneer",
    name: "Payoneer",
    description: "Withdraw to your Payoneer account",
    icon: CreditCard,
  },
  {
    id: "momo",
    name: "Mobile Money",
    description: "Send straight to your mobile wallet",
    icon: Smartphone,
  },
];

const COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "Uganda",
  "Rwanda",
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "South Africa",
];

const IBAN_COUNTRIES = ["United Kingdom", "Germany", "France"];

const CURRENCIES = ["USD", "EUR", "GBP", "NGN", "GHS", "KES", "UGX", "RWF", "ZAR"];

const MOMO_PROVIDERS: Record<string, string[]> = {
  Ghana: ["MTN MoMo", "AirtelTigo Money", "Telecel Cash"],
  Kenya: ["M-Pesa", "Airtel Money"],
  Uganda: ["MTN MoMo", "Airtel Money"],
  Rwanda: ["MTN MoMo", "Airtel Money"],
};

const LIMITS = {
  min: 100,
  max: 10000,
  feePercent: 0,
  processingTime: "Instant - 24 Hours",
};

// ─── Small styled primitives (matching theme) ──────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-muted/30 border-2 border-border rounded-lg p-3 text-xs font-black uppercase tracking-tight focus:border-foreground focus:outline-none transition-all placeholder:text-muted-foreground/60 placeholder:normal-case placeholder:tracking-normal placeholder:font-bold"
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="w-full flex cursor-pointer items-center justify-between gap-3 bg-muted/30 border-2 border-border rounded-lg px-5 py-3 hover:border-foreground/50 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="text-left">
              <p className="text-sm font-black uppercase leading-none">
                {value || placeholder || "Select"}
              </p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px] bg-card border-border rounded-xl">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => onChange(opt)}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer focus:bg-muted/50 transition-colors"
          >
            <span className="font-black text-xs uppercase">{opt}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Method selection card ──────────────────────────────────────────────────

function WithdrawMethodCard({
  method,
  selected,
  onClick,
}: {
  method: WithdrawMethod;
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = method.icon;

  const methodColors: Record<MethodId, { bg: string; iconBg: string; iconBorder: string }> = {
    bank: { bg: "bg-blue-500/10", iconBg: "bg-blue-500/20", iconBorder: "border-blue-500/30" },
    paypal: { bg: "bg-yellow-500/10", iconBg: "bg-yellow-500/20", iconBorder: "border-yellow-500/30" },
    payoneer: { bg: "bg-purple-500/10", iconBg: "bg-purple-500/20", iconBorder: "border-purple-500/30" },
    momo: { bg: "bg-green-500/10", iconBg: "bg-green-500/20", iconBorder: "border-green-500/30" },
  };

  const colors = methodColors[method.id];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative text-left cursor-pointer rounded-[1rem] border-2 p-5 transition-all group ${
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : `border-border ${colors.bg} hover:border-foreground/30`
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
      )}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border transition-colors ${
          selected
            ? "bg-primary/10 border-primary/30"
            : `${colors.iconBg} ${colors.iconBorder} group-hover:border-foreground/20`
        }`}
      >
        <Icon
          className={`w-5 h-5 ${selected ? "text-primary" : "text-foreground"}`}
        />
      </div>
      <p className="text-sm font-black uppercase tracking-tight leading-none mb-1.5">
        {method.name}
      </p>
      <p className="text-[10px] font-bold text-muted-foreground leading-snug">
        {method.description}
      </p>
    </button>
  );
}

// ─── Method-specific forms ──────────────────────────────────────────────────

function BankTransferForm({
  data,
  onChange,
}: {
  data: BankTransferData;
  onChange: (d: BankTransferData) => void;
}) {
  const showIban = IBAN_COUNTRIES.includes(data.country);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <FieldLabel>Country</FieldLabel>
          <SelectInput
            value={data.country}
            onChange={(v) => onChange({ ...data, country: v })}
            options={COUNTRIES}
            placeholder="Select country"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel>Currency</FieldLabel>
          <SelectInput
            value={data.currency}
            onChange={(v) => onChange({ ...data, currency: v })}
            options={CURRENCIES}
            placeholder="Select currency"
          />
        </div>
      </div>

      <div className="space-y-2">
        <FieldLabel>Bank Name</FieldLabel>
        <TextInput
          value={data.bankName}
          onChange={(v) => onChange({ ...data, bankName: v })}
          placeholder="e.g. Chase Bank"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <FieldLabel>Account Name</FieldLabel>
          <TextInput
            value={data.accountName}
            onChange={(v) => onChange({ ...data, accountName: v })}
            placeholder="Full name on account"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel>Account Number</FieldLabel>
          <TextInput
            value={data.accountNumber}
            onChange={(v) => onChange({ ...data, accountNumber: v })}
            placeholder="Account number"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <FieldLabel>SWIFT / BIC (Optional)</FieldLabel>
          <TextInput
            value={data.swift}
            onChange={(v) => onChange({ ...data, swift: v })}
            placeholder="e.g. CHASUS33"
          />
        </div>
        {showIban && (
          <div className="space-y-2">
            <FieldLabel>IBAN</FieldLabel>
            <TextInput
              value={data.iban}
              onChange={(v) => onChange({ ...data, iban: v })}
              placeholder="International bank account number"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function PayPalForm({
  data,
  onChange,
}: {
  data: PayPalData;
  onChange: (d: PayPalData) => void;
}) {
  return (
    <div className="space-y-3">
      <FieldLabel>PayPal Email</FieldLabel>
      <TextInput
        value={data.email}
        onChange={(v) => onChange({ email: v })}
        placeholder="you@example.com"
        type="email"
      />
      <p className="text-[9px] font-black uppercase text-primary tracking-widest px-1 flex items-center gap-1.5">
        <Info className="w-3 h-3" /> Funds will be sent to your PayPal email
      </p>
    </div>
  );
}

function PayoneerForm({
  data,
  onChange,
}: {
  data: PayoneerData;
  onChange: (d: PayoneerData) => void;
}) {
  return (
    <div className="space-y-3">
      <FieldLabel>Payoneer Email</FieldLabel>
      <TextInput
        value={data.email}
        onChange={(v) => onChange({ email: v })}
        placeholder="you@example.com"
        type="email"
      />
      <p className="text-[9px] font-black uppercase text-primary tracking-widest px-1 flex items-center gap-1.5">
        <Info className="w-3 h-3" /> Funds will be sent to your Payoneer account
      </p>
    </div>
  );
}

function MobileMoneyForm({
  data,
  onChange,
}: {
  data: MobileMoneyData;
  onChange: (d: MobileMoneyData) => void;
}) {
  const providers = data.country ? MOMO_PROVIDERS[data.country] || [] : [];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <FieldLabel>Country</FieldLabel>
          <SelectInput
            value={data.country}
            onChange={(v) =>
              onChange({ ...data, country: v, provider: "" })
            }
            options={Object.keys(MOMO_PROVIDERS)}
            placeholder="Select country"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel>Provider</FieldLabel>
          <SelectInput
            value={data.provider}
            onChange={(v) => onChange({ ...data, provider: v })}
            options={providers}
            placeholder={data.country ? "Select provider" : "Select country first"}
          />
        </div>
      </div>

      {data.provider && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-hidden"
        >
          <div className="space-y-2">
            <FieldLabel>Phone Number</FieldLabel>
            <TextInput
              value={data.phoneNumber}
              onChange={(v) => onChange({ ...data, phoneNumber: v })}
              placeholder="e.g. 024xxxxxxx"
              type="tel"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>Account Holder Name</FieldLabel>
            <TextInput
              value={data.accountHolderName}
              onChange={(v) => onChange({ ...data, accountHolderName: v })}
              placeholder="Name on mobile money account"
            />
          </div>
        </motion.div>
      )}

      <p className="text-[9px] font-black uppercase text-primary tracking-widest px-1 flex items-center gap-1.5">
        <Info className="w-3 h-3" /> Ensure the phone number is registered with
        your selected provider
      </p>
    </div>
  );
}

// ─── Summary panel ──────────────────────────────────────────────────────────

function WithdrawalSummary({
  method,
  amount,
  fee,
  receiveAmount,
}: {
  method: WithdrawMethod | null;
  amount: number;
  fee: number;
  receiveAmount: number;
}) {
  return (
    <div className="bg-card border border-border rounded-[1rem] p-5 space-y-4 sticky top-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        Summary
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase text-muted-foreground">
            Method
          </span>
          <span className="text-xs font-black uppercase">
            {method ? method.name : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase text-muted-foreground">
            Requested Amount
          </span>
          <span className="text-xs font-black">${amount.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase text-muted-foreground">
            Fee ({LIMITS.feePercent}%)
          </span>
          <span className="text-xs font-black text-red-400">
            -${fee.toFixed(2)}
          </span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase">
            You&apos;ll Receive
          </span>
          <span className="text-sm font-black text-green-500">
            ${receiveAmount.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-black uppercase text-muted-foreground">
            Processing Time
          </span>
          <span className="text-[10px] font-black uppercase text-primary">
            {LIMITS.processingTime}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-border/50 grid grid-cols-2 gap-3">
        <div className="bg-muted/30 rounded-lg p-3">
          <p className="text-[9px] font-black uppercase text-muted-foreground">
            Minimum
          </p>
          <p className="text-xs font-black">${LIMITS.min}</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-3">
          <p className="text-[9px] font-black uppercase text-muted-foreground">
            Maximum
          </p>
          <p className="text-xs font-black">${LIMITS.max.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Confirmation modal ─────────────────────────────────────────────────────

function ConfirmationModal({
  open,
  method,
  amount,
  fee,
  receiveAmount,
  isSubmitting,
  onClose,
  onConfirm,
}: {
  open: boolean;
  method: WithdrawMethod | null;
  amount: number;
  fee: number;
  receiveAmount: number;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-500 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-sm bg-card border border-border rounded-[1.2rem] p-6 space-y-5 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-black uppercase tracking-tight">
                Confirm Withdrawal
              </p>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <p className="text-[11px] font-bold text-muted-foreground leading-snug">
              You are about to request:
            </p>

            <div className="space-y-2 bg-muted/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-muted-foreground">
                  Method
                </span>
                <span className="text-xs font-black uppercase">
                  {method?.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-muted-foreground">
                  Amount
                </span>
                <span className="text-xs font-black">${amount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-muted-foreground">
                  Fee
                </span>
                <span className="text-xs font-black text-red-400">
                  ${fee.toFixed(2)}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase">
                  You&apos;ll Receive
                </span>
                <span className="text-sm font-black text-green-500">
                  ${receiveAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border-2 border-border font-black uppercase text-[10px] tracking-widest hover:bg-muted/30 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-foreground text-background font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Success dialog ─────────────────────────────────────────────────────────

function SuccessDialog({
  open,
  referenceId,
  onClose,
}: {
  open: boolean;
  referenceId: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-500 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-sm bg-card border border-border rounded-[1.2rem] p-8 text-center space-y-5 shadow-xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
              className="w-16 h-16 mx-auto rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center"
            >
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </motion.div>

            <div className="space-y-1.5">
              <p className="text-sm font-black uppercase tracking-tight">
                Withdrawal Request Submitted
              </p>
              <p className="text-[11px] font-bold text-muted-foreground leading-snug">
                Your withdrawal request has been received and is awaiting
                processing.
              </p>
            </div>

            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-muted-foreground">
                  Reference ID
                </span>
                <span className="text-xs font-black">{referenceId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-muted-foreground">
                  Processing Time
                </span>
                <span className="text-[10px] font-black uppercase text-primary">
                  {LIMITS.processingTime}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-foreground text-background font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all cursor-pointer"
            >
              Back to Dashboard
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function WithdrawOtherMethodsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  const [selectedMethodId, setSelectedMethodId] = useState<MethodId | null>(null);
  const selectedMethod = useMemo(
    () => WITHDRAW_METHODS.find((m) => m.id === selectedMethodId) || null,
    [selectedMethodId]
  );

  const [amount, setAmount] = useState("");

  const [bankData, setBankData] = useState<BankTransferData>({
    country: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    swift: "",
    iban: "",
    currency: "",
  });
  const [paypalData, setPaypalData] = useState<PayPalData>({ email: "" });
  const [payoneerData, setPayoneerData] = useState<PayoneerData>({ email: "" });
  const [momoData, setMomoData] = useState<MobileMoneyData>({
    country: "",
    provider: "",
    phoneNumber: "",
    accountHolderName: "",
  });

  // OTP
  const [otp, setOtp] = useState("");
  const [otpExpires, setOtpExpires] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/info");
      const data = await response.json();

      if (data.error || !data.success) {
        toast.error(data.message || data.error || "Failed to fetch account data");
        return;
      }

      setUserData({
        accountBalance: data.user?.accountBalance ?? 0,
        email: data.user?.email,
      });
    } catch (error) {
      toast.error("Failed to fetch account data");
    } finally {
      setLoading(false);
    }
  };

  const numericAmount = parseFloat(amount) || 0;
  const fee = numericAmount * (LIMITS.feePercent / 100);
  const receiveAmount = Math.max(numericAmount - fee, 0);

  const isFormValid = () => {
    if (!selectedMethod) return false;
    if (!amount || numericAmount < LIMITS.min || numericAmount > LIMITS.max)
      return false;
    if (userData && numericAmount > userData.accountBalance) return false;

    switch (selectedMethod.id) {
      case "bank":
        return !!(
          bankData.country &&
          bankData.bankName &&
          bankData.accountName &&
          bankData.accountNumber &&
          bankData.currency &&
          (!IBAN_COUNTRIES.includes(bankData.country) || bankData.iban)
        );
      case "paypal":
        return !!paypalData.email;
      case "payoneer":
        return !!payoneerData.email;
      case "momo":
        return !!(
          momoData.country &&
          momoData.provider &&
          momoData.phoneNumber &&
          momoData.accountHolderName
        );
      default:
        return false;
    }
  };

  const getMethodPayload = () => {
    switch (selectedMethod?.id) {
      case "bank":
        return bankData;
      case "paypal":
        return paypalData;
      case "payoneer":
        return payoneerData;
      case "momo":
        return momoData;
      default:
        return {};
    }
  };

  const handleSendOtp = async () => {
    if (numericAmount < LIMITS.min) {
      toast.error(`Minimum withdrawal amount is $${LIMITS.min}`);
      return;
    }

    if (numericAmount > LIMITS.max) {
      toast.error(`Maximum withdrawal amount is $${LIMITS.max}`);
      return;
    }

    if (userData && numericAmount > userData.accountBalance) {
      toast.error("Insufficient balance");
      return;
    }

    if (!isFormValid()) {
      toast.error("Please complete all required fields correctly");
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await fetch("/api/withdraw/send-otp-other", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numericAmount,
          method: selectedMethod?.id,
          details: getMethodPayload(),
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("OTP sent to your email");
        setOtpExpires(data.otpExpires);
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleRequestWithdrawal = () => {
    if (!isFormValid()) {
      toast.error("Please complete all required fields correctly");
      return;
    }
    if (!otp || otp.length !== 4) {
      toast.error("Please enter the 4-digit OTP sent to your email");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/withdraw/other", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numericAmount,
          fee,
          receiveAmount,
          method: selectedMethod?.id,
          details: getMethodPayload(),
          otp,
          otpExpires,
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        setIsSubmitting(false);
        return;
      }

      setReferenceId(data.withdrawalId || `OWD-${Date.now().toString().slice(-6)}`);
      setShowConfirm(false);
      setShowSuccess(true);

      // Reset form
      setAmount("");
      setOtp("");
      setOtpExpires("");
      setSelectedMethodId(null);
      setBankData({
        country: "",
        bankName: "",
        accountName: "",
        accountNumber: "",
        swift: "",
        iban: "",
        currency: "",
      });
      setPaypalData({ email: "" });
      setPayoneerData({ email: "" });
      setMomoData({ country: "", provider: "", phoneNumber: "", accountHolderName: "" });
      fetchUserData();
    } catch (error) {
      toast.error("Failed to submit withdrawal request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-25">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <section className="space-y-3">
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none flex items-center gap-4">
                  Withdraw Funds
                </h1>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-primary" /> Choose a
                  payout method and complete the required details
                </p>
              </div>
            </section>

            {/* Method selection */}
            <section className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                01. Select Withdrawal Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {WITHDRAW_METHODS.map((method) => (
                  <WithdrawMethodCard
                    key={method.id}
                    method={method}
                    selected={selectedMethodId === method.id}
                    onClick={() => setSelectedMethodId(method.id)}
                  />
                ))}
              </div>
            </section>

            <AnimatePresence mode="wait">
              {selectedMethod && (
                <motion.div
                  key={selectedMethod.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col lg:flex-row gap-8"
                >
                  {/* Left: Form */}
                  <div className="flex-1">
                    <div className="bg-card border border-border rounded-[1rem] p-6 md:p-10 shadow-sm space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          02. {selectedMethod.name} Details
                        </label>

                        {selectedMethod.id === "bank" && (
                          <BankTransferForm data={bankData} onChange={setBankData} />
                        )}
                        {selectedMethod.id === "paypal" && (
                          <PayPalForm data={paypalData} onChange={setPaypalData} />
                        )}
                        {selectedMethod.id === "payoneer" && (
                          <PayoneerForm data={payoneerData} onChange={setPayoneerData} />
                        )}
                        {selectedMethod.id === "momo" && (
                          <MobileMoneyForm data={momoData} onChange={setMomoData} />
                        )}
                      </div>

                      {/* Amount */}
                      <div className="space-y-3 pt-4 border-t border-border/50">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            03. Withdrawal Amount
                          </label>
                          <p className="text-[10px] font-black uppercase text-muted-foreground">
                            Available:{" "}
                            <span className="text-green-500">
                              ${userData?.accountBalance?.toLocaleString() || "0"}
                            </span>
                          </p>
                        </div>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black text-muted-foreground">
                            $
                          </span>
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-muted/30 border-2 border-border rounded-lg p-2 pl-12 text-xl font-black tracking-tighter focus:border-foreground focus:outline-none transition-all"
                            placeholder="0.00"
                          />
                        </div>
                        <div className="flex flex-wrap gap-3 pt-1">
                          <span className="text-[9px] font-black uppercase text-muted-foreground">
                            Min ${LIMITS.min}
                          </span>
                          <span className="text-[9px] font-black uppercase text-muted-foreground">
                            Max ${LIMITS.max.toLocaleString()}
                          </span>
                          <span className="text-[9px] font-black uppercase text-muted-foreground">
                            Fee {LIMITS.feePercent}%
                          </span>
                          <span className="text-[9px] font-black uppercase text-muted-foreground">
                            {LIMITS.processingTime}
                          </span>
                        </div>
                      </div>

                      {/* OTP */}
                      <div className="space-y-3 pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            04. Email Authentication
                          </label>
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={isSendingOtp}
                            className="bg-primary text-primary-foreground cursor-pointer px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all border border-primary flex items-center justify-center disabled:opacity-50"
                          >
                            {isSendingOtp ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              "Send OTP"
                            )}
                          </button>
                        </div>

                        <div className="relative">
                          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full bg-muted/30 border-2 border-border rounded-lg p-2 text-center text-lg font-black tracking-[0.5em] focus:border-primary focus:outline-none transition-all"
                            placeholder="****"
                            maxLength={4}
                          />
                        </div>
                      </div>

                      {/* Mobile summary */}
                      {/* <div className="lg:hidden">
                        <WithdrawalSummary
                          method={selectedMethod}
                          amount={numericAmount}
                          fee={fee}
                          receiveAmount={receiveAmount}
                        />
                      </div> */}

                      <button
                        onClick={handleRequestWithdrawal}
                        disabled={!isFormValid() || !otp}
                        className="w-full bg-foreground cursor-pointer text-background py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl disabled:opacity-20"
                      >
                        Request Withdrawal <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Right: Summary (desktop) */}
                  <div className="w-full lg:w-[360px]">
                    <WithdrawalSummary
                      method={selectedMethod}
                      amount={numericAmount}
                      fee={fee}
                      receiveAmount={receiveAmount}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!selectedMethod && (
              <div className="text-center py-16 border-2 border-dashed border-border rounded-[1rem]">
                <Building2 className="w-8 h-8 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Select a method above to continue
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      <ConfirmationModal
        open={showConfirm}
        method={selectedMethod}
        amount={numericAmount}
        fee={fee}
        receiveAmount={receiveAmount}
        isSubmitting={isSubmitting}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSubmit}
      />

      <SuccessDialog
        open={showSuccess}
        referenceId={referenceId}
        onClose={() => setShowSuccess(false)}
      />

      <UserNav />
    </div>
  );
}