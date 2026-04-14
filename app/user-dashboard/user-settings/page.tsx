"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/components/custom-theme-provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Camera,
  User,
  Lock,
  Palette,
  Moon,
  Sun,
  Shield,
  AlertCircle,
  Eye,
  EyeOff,
  Wallet,
  Plus,
  Trash2,
  Mail,
  Edit2,
  ChevronDown,
  Loader2,
  Globe,
} from "lucide-react";

import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SUPPORTED_CRYPTOS = [
  { name: "Bitcoin", symbol: "BTC", icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
  { name: "Solana", symbol: "SOL", icon: "https://cryptologos.cc/logos/solana-sol-logo.png" },
  { name: "Tether", symbol: "USDT", icon: "https://cryptologos.cc/logos/tether-usdt-logo.png" },
  { name: "Ethereum", symbol: "ETH", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
  { name: "USD Coin", symbol: "USDC", icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png" },
];

interface PayoutAddress {
  id: string;
  crypto: typeof SUPPORTED_CRYPTOS[0];
  address: string;
}

export default function UserSettingsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const darkMode = resolvedTheme === "dark";

  // Personal Info State (now includes username & country)
  const [personalInfo, setPersonalInfo] = useState({
    username: "shillmonger",
    name: "Alex Rivera",
    email: "alex@example.com",
    phone: "+234 801 234 5678",
    country: "Nigeria",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSavingPayout, setIsSavingPayout] = useState(false);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Profile image
  const [profileImage, setProfileImage] = useState("https://github.com/shadcn.png");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Member since
  const [memberSince, setMemberSince] = useState("");

  // Crypto Payout Settings
  const [payoutAddresses, setPayoutAddresses] = useState<PayoutAddress[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState(SUPPORTED_CRYPTOS[0]);
  const [walletAddress, setWalletAddress] = useState("");
  const [showAddForm, setShowAddForm] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load payout addresses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("payoutAddresses");
    if (saved) setPayoutAddresses(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("payoutAddresses", JSON.stringify(payoutAddresses));
  }, [payoutAddresses]);

  // Fake profile load
  useEffect(() => {
    const fetchProfile = async () => {
      await new Promise((res) => setTimeout(res, 600));
      setMemberSince("MAR 12, 2025");
      setIsLoading(false);
    };
    fetchProfile();
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Save Payout Address (Add or Update)
  const handleSavePayoutAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress.trim()) {
      toast.error("Please enter a wallet address");
      return;
    }

    setIsSavingPayout(true);

    setTimeout(() => {
      if (editingId) {
        setPayoutAddresses((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? { ...item, crypto: selectedCrypto, address: walletAddress.trim() }
              : item
          )
        );
        toast.success("Address updated successfully");
        setEditingId(null);
      } else {
        const newAddress: PayoutAddress = {
          id: Date.now().toString(),
          crypto: selectedCrypto,
          address: walletAddress.trim(),
        };
        setPayoutAddresses((prev) => [...prev, newAddress]);
        toast.success("New payout address added");
      }

      setWalletAddress("");
      setShowAddForm(false);
      setIsSavingPayout(false);
    }, 600);
  };

  const handleEdit = (address: PayoutAddress) => {
    setSelectedCrypto(address.crypto);
    setWalletAddress(address.address);
    setEditingId(address.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this payout address?")) return;
    setPayoutAddresses((prev) => prev.filter((item) => item.id !== id));
    toast.success("Address deleted");
  };

  const handleAddNew = () => {
    setWalletAddress("");
    setEditingId(null);
    setSelectedCrypto(SUPPORTED_CRYPTOS[0]);
    setShowAddForm(true);
  };

  // Fake profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      toast.success("Profile updated successfully");
      setIsUpdating(false);
    }, 800);
  };

  // Fake password update
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setIsUpdatingPassword(true);
    setTimeout(() => {
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsUpdatingPassword(false);
    }, 800);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 pb-32">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10">
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic text-foreground">
                Profile & Settings
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">
                  Manage your identity and preferences
                </p>
                <div className="h-[1px] flex-1 bg-border" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Identity */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> Identity
                  </h3>
                  <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-primary bg-muted shadow-2xl">
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <label className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2.5 rounded-xl cursor-pointer hover:bg-primary/90 transition-colors shadow-lg">
                        <Camera className="w-5 h-5" />
                        <input type="file" accept="image/*" className="hidden" disabled={isUploadingImage} />
                      </label>
                    </div>
                    <p className="text-sm font-black uppercase">{personalInfo.name}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Buyer Account</p>
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 overflow-hidden relative">
                  <div className="absolute -right-4 -top-4 opacity-5">
                    <Shield className="w-24 h-24" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-4">Account Status</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Verification</span>
                      <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-black uppercase border border-green-500/20">Verified</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Member Since</span>
                      <span className="text-xs font-black">{memberSince || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Appearance */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" /> Appearance
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">Dark Mode</p>
                    <button
                      onClick={toggleTheme}
                      className={`relative w-14 h-8 rounded-full cursor-pointer border border-border transition-colors ${darkMode ? "bg-primary" : "bg-muted"}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${darkMode ? "translate-x-6" : "translate-x-1"}`}>
                        {darkMode ? <Moon className="w-3.5 h-3.5 text-black" /> : <Sun className="w-3.5 h-3.5 text-yellow-500" />}
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <form onSubmit={handleProfileUpdate} className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Username</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          name="username"
                          type="text"
                          value={personalInfo.username}
                          onChange={handleInputChange}
                          className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          name="name"
                          type="text"
                          value={personalInfo.name}
                          onChange={handleInputChange}
                          className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          name="email"
                          type="email"
                          value={personalInfo.email}
                          readOnly
                          className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-3 text-sm cursor-not-allowed opacity-70"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Country</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          name="country"
                          type="text"
                          value={personalInfo.country}
                          onChange={handleInputChange}
                          className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</label>
                      <div className="relative">
                        <input
                          name="phone"
                          type="tel"
                          value={personalInfo.phone}
                          onChange={handleInputChange}
                          className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 pt-2">
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="w-full md:w-auto bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                          </>
                        ) : (
                          "Update Profile"
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                {/* Crypto Payout Settings */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-primary" /> Crypto Payout Settings
                    </h3>
                    {payoutAddresses.length > 0 && (
                      <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add New
                      </button>
                    )}
                  </div>

                  {/* Saved Addresses - Always Visible Icons */}
                  {payoutAddresses.length > 0 && (
                    <div className="space-y-3 mb-8">
                      {payoutAddresses.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-muted/30 border border-border rounded-xl p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-background border flex items-center justify-center">
                              <img src={item.crypto.icon} alt={item.crypto.name} className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="font-bold text-sm flex items-center gap-2">
                                {item.crypto.name}
                                <span className="text-xs text-muted-foreground font-mono">({item.crypto.symbol})</span>
                              </div>
                              <div className="font-mono text-xs text-muted-foreground break-all">
                                {item.address}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add / Edit Form */}
                  {showAddForm && (
                    <form onSubmit={handleSavePayoutAddress} className="space-y-5 border-t border-border pt-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payout Currency</label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button type="button" className="w-full flex items-center justify-between gap-3 bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-background border flex items-center justify-center">
                                  <img src={selectedCrypto.icon} alt={selectedCrypto.name} className="w-4 h-4" />
                                </div>
                                <span className="font-bold">{selectedCrypto.name}</span>
                                <span className="text-xs text-muted-foreground font-bold uppercase tracking-wide">{selectedCrypto.symbol}</span>
                              </div>
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full min-w-[240px]">
                            {SUPPORTED_CRYPTOS.map((coin) => (
                              <DropdownMenuItem key={coin.symbol} onClick={() => setSelectedCrypto(coin)} className="flex items-center gap-3 cursor-pointer">
                                <img src={coin.icon} alt={coin.name} className="w-5 h-5" />
                                <span className="font-bold">{coin.name}</span>
                                <span className="ml-auto text-xs text-muted-foreground">({coin.symbol})</span>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          {selectedCrypto.symbol} Wallet Address
                        </label>
                        <div className="relative">
                          <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="text"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            placeholder={`Enter ${selectedCrypto.symbol} wallet address`}
                            className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none font-mono"
                          />
                        </div>
                         <p className="text-[10px] text-muted-foreground mt-1">
                    Make sure to double-check your address. Payouts sent to wrong addresses cannot be recovered.
                  </p>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={isSavingPayout}
                          className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isSavingPayout ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                            </>
                          ) : editingId ? (
                            "Update Wallet Address"
                          ) : (
                            "Add Wallet Address"
                          )}
                        </button>

                        {editingId && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddForm(false);
                              setEditingId(null);
                              setWalletAddress("");
                            }}
                            className="flex-1 border border-border py-3 rounded-xl font-bold text-sm hover:bg-muted"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  )}

                  {!showAddForm && payoutAddresses.length === 0 && (
                    <button
                      onClick={handleAddNew}
                      className="w-full py-6 border border-dashed border-border rounded-2xl text-muted-foreground hover:text-foreground hover:border-primary transition-colors flex flex-col items-center gap-2"
                    >
                      <Plus className="w-8 h-8" />
                      <span className="font-bold">Add your first payout address</span>
                    </button>
                  )}
                </div>

                {/* Security */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" /> Security
                  </h3>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none"
                          placeholder="Enter current password"
                          required
                        />
                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              setPasswordsMatch(e.target.value === confirmPassword);
                            }}
                            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none"
                            placeholder="Enter new password"
                            required
                            minLength={8}
                          />
                          <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Min 8 chars with uppercase, lowercase, and number</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confirm New</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              setPasswordsMatch(newPassword === e.target.value);
                            }}
                            className={`w-full bg-muted/30 border ${confirmPassword ? (passwordsMatch ? "border-border" : "border-destructive") : "border-border"} rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none`}
                            placeholder="Confirm new password"
                            required
                          />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {confirmPassword && !passwordsMatch && (
                          <p className="text-[10px] font-bold text-destructive flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" /> Passwords don&apos;t match
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword || !passwordsMatch}
                      className="bg-primary w-full md:w-auto text-primary-foreground cursor-pointer px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/10 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isUpdatingPassword ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </>
                      ) : (
                        "Update Security"
                      )}
                    </button>
                  </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 overflow-hidden relative border-destructive/20">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-destructive">
                    <Shield className="w-4 h-4" /> Danger Zone
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        toast.success("Logged out successfully");
                        router.push("/auth/login");
                      }}
                      className="flex-1 text-xs font-black uppercase tracking-widest py-3 px-4 rounded-xl border border-destructive text-destructive hover:bg-destructive hover:text-white transition-all cursor-pointer"
                    >
                      Log out everywhere
                    </button>
                    <button className="flex-1 text-xs font-black uppercase tracking-widest py-3 px-4 rounded-xl bg-destructive text-white hover:opacity-90 transition-all cursor-pointer">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <UserNav />
      </div>
    </div>
  );
}