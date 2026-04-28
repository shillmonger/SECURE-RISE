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
  Phone,
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
  { name: "Bitcoin", symbol: "BTC", icon: "https://i.postimg.cc/pLhcx2Vd/bitcoin-128.png" },
  { name: "Solana", symbol: "SOL", icon: "https://i.postimg.cc/FzHG6vnh/solana-128.png" },
  { name: "Tether", symbol: "USDT", icon: "https://i.postimg.cc/nLKkcr6W/tether-128.png" },
  { name: "Ethereum", symbol: "ETH", icon: "https://i.postimg.cc/gJNH85kG/ethereum-128.png" },
  { name: "USD Coin", symbol: "USDC", icon: "https://i.postimg.cc/NGCx0WzT/usdc-128.png" },
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

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    country: "",
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
  const [profileImage, setProfileImage] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Member since
  const [memberSince, setMemberSince] = useState("");
  // User role
  const [userRole, setUserRole] = useState<string[]>([]);

  // Crypto Payout Settings
  const [payoutAddresses, setPayoutAddresses] = useState<PayoutAddress[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState(SUPPORTED_CRYPTOS[0]);
  const [walletAddress, setWalletAddress] = useState("");
  const [showAddForm, setShowAddForm] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Confirmation dialog state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/user-dashboard/profile');
        const data = await response.json();
        
        if (data.success) {
          const user = data.user;
          setPersonalInfo({
            username: user.username || "",
            name: user.fullName || "",
            email: user.email || "",
            phone: user.phone || "",
            country: user.country || "",
          });
          setProfileImage(user.profileImage || "");
          setUserRole(user.role || ["user"]);
          setMemberSince(new Date(user.createdAt).toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }).toUpperCase());
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Load crypto addresses from database
  useEffect(() => {
    const fetchCryptoAddresses = async () => {
      try {
        const response = await fetch('/api/user-dashboard/crypto-addresses');
        const data = await response.json();
        
        if (data.success) {
          setPayoutAddresses(data.cryptoAddresses);
        }
      } catch (error) {
        console.error('Error fetching crypto addresses:', error);
      }
    };

    fetchCryptoAddresses();
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Save Payout Address (Add or Update)
  const handleSavePayoutAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress.trim()) {
      toast.error("Please enter a wallet address");
      return;
    }

    setIsSavingPayout(true);

    try {
      const url = editingId 
        ? '/api/user-dashboard/crypto-addresses' 
        : '/api/user-dashboard/crypto-addresses';
      const method = editingId ? 'PUT' : 'POST';
      
      const body = editingId 
        ? { id: editingId, crypto: selectedCrypto, address: walletAddress.trim() }
        : { crypto: selectedCrypto, address: walletAddress.trim() };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingId ? "Address updated successfully" : "New payout address added");
        
        // Refetch addresses to get updated list
        const fetchResponse = await fetch('/api/user-dashboard/crypto-addresses');
        const fetchData = await fetchResponse.json();
        if (fetchData.success) {
          setPayoutAddresses(fetchData.cryptoAddresses);
        }
        
        setWalletAddress("");
        setShowAddForm(false);
        setEditingId(null);
      } else {
        toast.error(data.error || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    } finally {
      setIsSavingPayout(false);
    }
  };

  const handleEdit = (address: PayoutAddress) => {
    setSelectedCrypto(address.crypto);
    setWalletAddress(address.address);
    setEditingId(address.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/user-dashboard/crypto-addresses?id=${deleteTargetId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Address deleted");
        setPayoutAddresses(prev => prev.filter(item => item.id !== deleteTargetId));
      } else {
        toast.error(data.error || 'Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setDeleteTargetId(null);
  };

  const handleAddNew = () => {
    setWalletAddress("");
    setEditingId(null);
    setSelectedCrypto(SUPPORTED_CRYPTOS[0]);
    setShowAddForm(true);
  };

  // Profile image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/user-dashboard/profile/image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setProfileImage(data.imageUrl);
        toast.success('Profile image uploaded successfully');
      } else {
        toast.error(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await fetch('/api/user-dashboard/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: personalInfo.username,
          fullName: personalInfo.name,
          phone: personalInfo.phone,
          country: personalInfo.country,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  // Password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const response = await fetch('/api/user-dashboard/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
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
                        <img 
                          src={profileImage || "https://github.com/shadcn.png"} 
                          alt="Profile" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <label className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2.5 rounded-xl cursor-pointer hover:bg-primary/90 transition-colors shadow-lg">
                        {isUploadingImage ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Camera className="w-5 h-5" />
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          disabled={isUploadingImage}
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                    <p className="text-sm font-black uppercase">{personalInfo.username}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Investor Account</p>
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
                      <span className="text-xs font-bold text-muted-foreground uppercase">Role</span>
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-black uppercase border border-primary/20">
                        {userRole.join(", ").toUpperCase() || "USER"}
                      </span>
                    </div>
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
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
                        className="w-full md:w-full cursor-pointer bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
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
                        className="flex items-center cursor-pointer gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
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
                              className="p-2 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-muted-foreground cursor-pointer hover:text-destructive transition-colors"
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
                            <button type="button" className="w-full flex cursor-pointer items-center justify-between gap-3 bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-background border flex items-center justify-center">
                                  <img src={selectedCrypto.icon} alt={selectedCrypto.name} className="w-10" />
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
                                <img src={coin.icon} alt={coin.name} className="w-6 h-6" />
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
                          className="flex-1 bg-primary cursor-pointer text-primary-foreground py-3 rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isSavingPayout ? (
                            <>
                              <Loader2 className="w-4 h-4 cursor-pointer animate-spin" /> Saving...
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
                            className="flex-1 border border-border cursor-pointer py-3 rounded-xl font-bold text-sm hover:bg-muted"
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
                      className="bg-primary w-full md:w-full text-primary-foreground cursor-pointer px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/10 disabled:opacity-50 flex items-center justify-center gap-2"
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
                        router.push("/auth-page/login");
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

      {/* Custom Confirmation Dialog */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl border border-border max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tighter">Delete Payout Address</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this payout address? Any future payouts to this address will fail.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="flex-1 border border-border cursor-pointer py-3 rounded-xl font-bold text-sm hover:bg-muted transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-destructive cursor-pointer text-white py-3 rounded-xl font-bold text-sm hover:bg-destructive/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Address"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}