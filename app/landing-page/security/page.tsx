"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  Database,
  Eye,
  Key,
  Fingerprint,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Server,
  Cloud,
  FileText,
  User,
  Mail,
  CreditCard,
  Globe,
  RefreshCw,
  Cookie,
  Clock,
  Zap,
  ShieldCheck,
  Building2,
  Network,
  HardDrive,
  Code,
  Bug,
  AlertCircle,
  Ban,
  Trash2,
  Download,
  Upload,
  Copy,
  ExternalLink,
} from "lucide-react";
import GiveAway from "@/components/landing-page/GiveAway";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import CookieConsent from "@/components/landing-page/CookieConsent";
import Footer from "@/components/landing-page/Footer";
import Link from "next/link";

const sections = [
  { id: "account-security", title: "Account Security", icon: Shield },
  { id: "account-data", title: "Account Data", icon: User },
  { id: "data-storage", title: "Data Storage", icon: Database },
  { id: "privacy-protection", title: "Privacy & Protection", icon: Lock },
];

export default function SecurityPage() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("account-security");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 140;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight) {
          setActiveSection(section.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
    setSidebarOpen(false);
  };

  const activeIndex = sections.findIndex((s) => s.id === activeSection);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      <GiveAway />
      <Header />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative h-[30vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://i.postimg.cc/mk3VsGYp/2.jpg')",
          }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/90" />

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto mt-20">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 backdrop-blur-sm px-4 py-1.5 mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
              Security Center
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black uppercase  tracking-tighter mb-5 text-white leading-none"
          >
            Account Security
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="text-sm md:text-base font-light tracking-wide text-white/60 max-w-lg mx-auto leading-relaxed"
          >
            Comprehensive guide to protecting your account, understanding your data, and how we safeguard your information.
          </motion.p>

          {/* Progress bar — sections overview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-1.5 mt-8"
          >
            {sections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                aria-label={s.title}
                className={`h-[3px] rounded-full transition-all duration-300 ${
                  s.id === activeSection
                    ? "bg-primary w-8"
                    : i < activeIndex
                    ? "bg-primary/40 w-4"
                    : "bg-white/20 w-4"
                }`}
              />
            ))}
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/35 font-medium">
            Scroll
          </span>
          <div className="w-[1px] h-7 bg-gradient-to-b from-white/35 to-transparent" />
        </motion.div>
      </section>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-24 pt-12 flex flex-col lg:flex-row gap-10 w-full">

        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-32 space-y-1.5">
            {/* Header label */}
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-5 px-1">
              Sections
            </p>

            {sections.map((item, i) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-md text-xs font-mono shrink-0 transition-colors ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="leading-tight">{item.title}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
                </button>
              );
            })}

            {/* Reading progress */}
            <div className="mt-6 px-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-medium">
                  Progress
                </span>
                <span className="text-[9px] font-mono text-muted-foreground">
                  {activeIndex + 1}/{sections.length}
                </span>
              </div>
              <div className="h-[3px] bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${((activeIndex + 1) / sections.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* ── Mobile sticky nav ── */}
        <div className="lg:hidden sticky top-[80px] z-30 -mx-4 px-4 py-3 bg-background/90 backdrop-blur-md border-b border-border">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                    activeSection === s.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0 space-y-6" id="security-content">
          {/* Account Security Section */}
          <motion.div
            id="account-security"
            className="scroll-mt-32 bg-gradient-to-br from-primary/10 via-card to-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
              <span className="text-[10px] font-mono font-bold text-primary/60 tracking-widest leading-none">
                01
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Account Security</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                At Secure Rise, we employ industry-leading security measures to protect your account from unauthorized access. Our multi-layered security approach ensures your investments and personal information remain safe at all times.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" />
                  Password Security
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Minimum Requirements:</strong> 12+ characters with uppercase, lowercase, numbers, and special characters</li>
                  <li><strong>Hashing Algorithm:</strong> Passwords hashed using bcrypt with 12-round salt</li>
                  <li><strong>No Storage:</strong> We never store your actual password, only the secure hash</li>
                  <li><strong>Password Strength Meter:</strong> Real-time feedback during password creation</li>
                  <li><strong>Periodic Reminders:</strong> Prompts to update your password every 90 days</li>
                  <li><strong>Breach Detection:</strong> Automatic checks against known compromised password databases</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-blue-400" />
                  Two-Factor Authentication (2FA)
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Authenticator Apps:</strong> Support for Google Authenticator, Authy, and other TOTP apps</li>
                  <li><strong>SMS Verification:</strong> Backup option via SMS with one-time codes</li>
                  <li><strong>Email Codes:</strong> Secondary verification method via email</li>
                  <li><strong>Recovery Codes:</strong> 10 backup codes for emergency access</li>
                  <li><strong>Hardware Keys:</strong> Support for YubiKey and other security keys</li>
                  <li><strong>Remember Device:</strong> Trusted device option for 30 days (optional)</li>
                </ul>
                <div className="bg-background/50 p-3 rounded-lg mt-2">
                  <p className="text-[9px] text-muted-foreground">
                    <strong>Recommendation:</strong> We strongly recommend enabling 2FA for all accounts. Accounts with 2FA enabled are 99.9% less likely to be compromised.
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-purple-400" />
                  Session Management
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Secure Sessions:</strong> HTTP-only, secure, same-site cookies</li>
                  <li><strong>Session Timeout:</strong> Automatic logout after 30 minutes of inactivity</li>
                  <li><strong>Active Sessions View:</strong> See all devices currently logged into your account</li>
                  <li><strong>Remote Logout:</strong> Terminate sessions from any device instantly</li>
                  <li><strong>Device Fingerprinting:</strong> Detect and alert on new device logins</li>
                  <li><strong>IP Monitoring:</strong> Track login locations and alert on suspicious activity</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Eye className="w-4 h-4 text-orange-400" />
                  Login Security Features
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Rate Limiting:</strong> 5 failed attempts triggers 15-minute lockout</li>
                  <li><strong>CAPTTCHA Protection:</strong> reCAPTCHA v3 on all login attempts</li>
                  <li><strong>Biometric Login:</strong> Fingerprint and Face ID support on mobile devices</li>
                  <li><strong>Login Notifications:</strong> Instant email/SMS alerts for new logins</li>
                  <li><strong>Geofencing:</strong> Optional restriction to specific countries/regions</li>
                  <li><strong>Suspicious Activity Detection:</strong> AI-powered anomaly detection</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Account Recovery
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Secure Recovery:</strong> Multi-step verification process for password reset</li>
                  <li><strong>Email Verification:</strong> Confirmation link sent to registered email</li>
                  <li><strong>Security Questions:</strong> Optional backup questions for recovery</li>
                  <li><strong>Identity Verification:</strong> KYC document verification for high-value accounts</li>
                  <li><strong>Recovery Window:</strong> Reset links expire after 1 hour for security</li>
                  <li><strong>Support Escalation:</strong> Manual verification by support team when needed</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Security Best Practices
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Use a unique password for Secure Rise (never reuse passwords)</li>
                  <li>Enable 2FA immediately after account creation</li>
                  <li>Never share your password or 2FA codes with anyone</li>
                  <li>Be cautious of phishing emails mimicking Secure Rise</li>
                  <li>Keep your contact information up to date for recovery</li>
                  <li>Review active sessions regularly and remove unknown devices</li>
                  <li>Use a password manager to generate and store strong passwords</li>
                  <li>Report suspicious activity to support immediately</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Account Data Section */}
          <motion.div
            id="account-data"
            className="scroll-mt-32 bg-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
              <span className="text-[10px] font-mono font-bold text-primary/60 tracking-widest leading-none">
                02
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">
                <User className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Account Data</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                Your account data includes all personal information you provide to Secure Rise. We collect only what's necessary to provide our services and maintain transparency about how your data is used.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  Personal Information
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Full Name:</strong> Legal name as shown on identification documents</li>
                  <li><strong>Date of Birth:</strong> Required for age verification and compliance</li>
                  <li><strong>Phone Number:</strong> For 2FA verification and account recovery</li>
                  <li><strong>Email Address:</strong> Primary communication and account recovery</li>
                  <li><strong>Address:</strong> Residential address for KYC and regulatory compliance</li>
                  <li><strong>Nationality:</strong> Country of citizenship for regulatory purposes</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  KYC Documentation
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Government ID:</strong> Passport, national ID, or driver's license</li>
                  <li><strong>Proof of Address:</strong> Utility bill, bank statement, or government correspondence</li>
                  <li><strong>Selfie Verification:</strong> Live photo matching ID document</li>
                  <li><strong>Tax Information:</strong> Tax identification number where required</li>
                  <li><strong>Source of Funds:</strong> Declaration of investment fund origin</li>
                  <li><strong>Beneficial Ownership:</strong> For corporate accounts and high-net-worth individuals</li>
                </ul>
                <div className="bg-background/50 p-3 rounded-lg mt-2">
                  <p className="text-[9px] text-muted-foreground">
                    <strong>Storage:</strong> All KYC documents are encrypted at rest using AES-256 and stored in secure, access-controlled systems. Documents are automatically purged after 5 years of account inactivity.
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  Financial Information
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Investment Amounts:</strong> Record of all deposits and investments</li>
                  <li><strong>Withdrawal History:</strong> Complete log of all withdrawal requests</li>
                  <li><strong>Payment Methods:</strong> Linked cryptocurrency wallets and bank accounts</li>
                  <li><strong>Transaction History:</strong> Detailed record of all financial activities</li>
                  <li><strong>ROI Earnings:</strong> Accumulated returns and profit distributions</li>
                  <li><strong>Balance Information:</strong> Current account balances across all currencies</li>
                </ul>
                <div className="bg-background/50 p-3 rounded-lg mt-2">
                  <p className="text-[9px] text-muted-foreground">
                    <strong>Important:</strong> We never store full credit card numbers or banking credentials. Payment processing is handled through PCI DSS compliant third-party providers like Paystack.
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-400" />
                  Communication Data
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Email History:</strong> Copies of transactional emails sent to your account</li>
                  <li><strong>Support Tickets:</strong> Records of all support interactions</li>
                  <li><strong>Marketing Preferences:</strong> Your consent status for promotional communications</li>
                  <li><strong>Notification Settings:</strong> Your preferences for alerts and updates</li>
                  <li><strong>SMS Logs:</strong> Record of SMS verification codes sent (for security auditing)</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  Activity & Usage Data
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Login History:</strong> Timestamps, IP addresses, and device information</li>
                  <li><strong>Page Views:</strong> Which sections of the platform you access</li>
                  <li><strong>Feature Usage:</strong> How you interact with platform features</li>
                  <li><strong>Session Duration:</strong> Time spent on the platform per session</li>
                  <li><strong>Click Patterns:</strong> Navigation patterns (for UX improvement)</li>
                  <li><strong>Error Logs:</strong> Technical errors encountered (for debugging)</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Download className="w-4 h-4 text-pink-400" />
                  Data Access & Export
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Data Export:</strong> Download all your data in JSON or CSV format</li>
                  <li><strong>Document Download:</strong> Access your uploaded KYC documents anytime</li>
                  <li><strong>Transaction Reports:</strong> Generate detailed financial reports</li>
                  <li><strong>Activity Logs:</strong> Export your complete account activity history</li>
                  <li><strong>Request Processing:</strong> Data export requests processed within 24 hours</li>
                  <li><strong>Secure Delivery:</strong> Exports delivered via encrypted download link</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-red-400" />
                  Data Deletion
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Right to Deletion:</strong> Request complete deletion of your account and data</li>
                  <li><strong>Retention Period:</strong> Financial data retained for 7 years (legal requirement)</li>
                  <li><strong>Anonymous Data:</strong> Usage data anonymized after account deletion</li>
                  <li><strong>Deletion Process:</strong> Completed within 30 days of request</li>
                  <li><strong>Exceptions:</strong> Data required for legal proceedings or fraud prevention</li>
                  <li><strong>Confirmation:</strong> Email confirmation when deletion is complete</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Data Storage Section */}
          <motion.div
            id="data-storage"
            className="scroll-mt-32 bg-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
              <span className="text-[10px] font-mono font-bold text-primary/60 tracking-widest leading-none">
                03
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">
                <Database className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Data Storage</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                Secure Rise utilizes state-of-the-art infrastructure and encryption technologies to store your data securely. Our multi-layered storage architecture ensures your information is protected at every level.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  Infrastructure & Hosting
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Cloud Provider:</strong> AWS (Amazon Web Services) with enterprise-grade SLA</li>
                  <li><strong>Data Centers:</strong> Multiple availability zones across different geographic regions</li>
                  <li><strong>Redundancy:</strong> 99.99% uptime with automatic failover</li>
                  <li><strong>Load Balancing:</strong> Distributed traffic management for optimal performance</li>
                  <li><strong>CDN Integration:</strong> CloudFront for fast content delivery worldwide</li>
                  <li><strong>Backup Systems:</strong> Daily automated backups with 30-day retention</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-400" />
                  Encryption Standards
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>At Rest:</strong> AES-256 encryption for all stored data</li>
                  <li><strong>In Transit:</strong> TLS 1.3 for all data transmissions</li>
                  <li><strong>Database:</strong> Transparent Data Encryption (TDE) enabled</li>
                  <li><strong>File Storage:</strong> Encrypted object storage with customer-managed keys</li>
                  <li><strong>Key Management:</strong> AWS KMS (Key Management Service) for key rotation</li>
                  <li><strong>Hashing:</strong> bcrypt for passwords, Argon2 for sensitive data</li>
                </ul>
                <div className="bg-background/50 p-3 rounded-lg mt-2">
                  <p className="text-[9px] text-muted-foreground">
                    <strong>Key Rotation:</strong> Encryption keys are automatically rotated every 90 days. All data is re-encrypted with new keys during rotation without service interruption.
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-purple-400" />
                  Database Architecture
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Primary Database:</strong> PostgreSQL with read replicas for performance</li>
                  <li><strong>Caching Layer:</strong> Redis for fast data access and session management</li>
                  <li><strong>Search Engine:</strong> Elasticsearch for advanced search capabilities</li>
                  <li><strong>Data Sharding:</strong> Horizontal scaling for large datasets</li>
                  <li><strong>Connection Pooling:</strong> Optimized database connection management</li>
                  <li><strong>Query Optimization:</strong> Regular performance tuning and indexing</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-orange-400" />
                  Data Isolation & Segregation
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Multi-Tenant Architecture:</strong> Logical separation of user data</li>
                  <li><strong>Database per Tenant:</strong> High-value accounts in isolated databases</li>
                  <li><strong>Network Segmentation:</strong> VPC with private subnets for database servers</li>
                  <li><strong>Firewall Rules:</strong> Strict access control between application layers</li>
                  <li><strong>API Gateway:</strong> Centralized API management with rate limiting</li>
                  <li><strong>Service Mesh:</strong> Secure service-to-service communication</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  Backup & Disaster Recovery
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Daily Backups:</strong> Automated daily backups at 2:00 AM UTC</li>
                  <li><strong>Point-in-Time Recovery:</strong> Restore to any moment within 35 days</li>
                  <li><strong>Geographic Redundancy:</strong> Backups stored in separate AWS regions</li>
                  <li><strong>Backup Encryption:</strong> All backups encrypted with separate keys</li>
                  <li><strong>Restore Testing:</strong> Monthly restoration drills to verify integrity</li>
                  <li><strong>RPO/RTO:</strong> Recovery Point Objective: 1 hour, Recovery Time Objective: 4 hours</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-pink-400" />
                  Physical Security
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Data Center Access:</strong> 24/7 monitored facilities with biometric authentication</li>
                  <li><strong>Security Personnel:</strong> On-site security teams at all data centers</li>
                  <li><strong>Surveillance:</strong> Continuous video monitoring with 90-day retention</li>
                  <li><strong>Environmental Controls:</strong> Fire suppression, climate control, and power redundancy</li>
                  <li><strong>Compliance:</strong> SOC 2 Type II, ISO 27001, and GDPR certified facilities</li>
                  <li><strong>Background Checks:</strong> All data center personnel undergo rigorous screening</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Network className="w-4 h-4 text-yellow-400" />
                  Network Security
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>DDoS Protection:</strong> AWS Shield Standard and Advanced protection</li>
                  <li><strong>WAF:</strong> Web Application Firewall for attack prevention</li>
                  <li><strong>IPS/IDS:</strong> Intrusion Prevention and Detection Systems</li>
                  <li><strong>Private Network:</strong> All backend services on private VPC subnets</li>
                  <li><strong>VPN Access:</strong> Secure VPN for administrative access</li>
                  <li><strong>Network Monitoring:</strong> Real-time traffic analysis and anomaly detection</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Privacy & Protection Section */}
          <motion.div
            id="privacy-protection"
            className="scroll-mt-32 bg-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 lg:py-5 border-b border-border bg-secondary/30">
              <span className="text-[10px] font-mono font-bold text-primary/60 tracking-widest leading-none">
                04
              </span>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">
                <Lock className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">Privacy & Protection</h3>
            </div>
            <div className="p-5 lg:p-6 space-y-4 text-sm leading-relaxed">
              <p>
                Your privacy is fundamental to our business. We implement comprehensive privacy policies and protection measures to ensure your personal information is handled with the utmost care and compliance with global regulations.
              </p>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Compliance & Certifications
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>GDPR:</strong> General Data Protection Regulation (EU) compliance</li>
                  <li><strong>CCPA:</strong> California Consumer Privacy Act compliance</li>
                  <li><strong>SOC 2 Type II:</strong> Service Organization Control 2 certification</li>
                  <li><strong>ISO 27001:</strong> Information Security Management System</li>
                  <li><strong>PCI DSS:</strong> Payment Card Industry Data Security Standard</li>
                  <li><strong>AWS Artifact:</strong> Third-party compliance documentation available</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-400" />
                  Data Collection Principles
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Minimization:</strong> We collect only data essential for service delivery</li>
                  <li><strong>Consent-Based:</strong> Explicit consent obtained before data collection</li>
                  <li><strong>Transparency:</strong> Clear disclosure of what data is collected and why</li>
                  <li><strong>Purpose Limitation:</strong> Data used only for stated purposes</li>
                  <li><strong>Accuracy:</strong> Regular data validation and correction processes</li>
                  <li><strong>Storage Limitation:</strong> Data retained only as long as necessary</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-400" />
                  Your Privacy Rights
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Right to Access:</strong> Request a copy of all your personal data</li>
                  <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                  <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Right to Portability:</strong> Transfer your data to another service</li>
                  <li><strong>Right to Object:</strong> Object to processing of your data</li>
                  <li><strong>Right to Restrict:</strong> Limit how we process your data</li>
                </ul>
                <div className="bg-background/50 p-3 rounded-lg mt-2">
                  <p className="text-[9px] text-muted-foreground">
                    <strong>Exercise Your Rights:</strong> Submit privacy requests through your account settings or email privacy@securerise.com. All requests are processed within 30 days.
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Ban className="w-4 h-4 text-orange-400" />
                  Data Sharing Policy
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>No Selling:</strong> We never sell your personal data to third parties</li>
                  <li><strong>Service Providers:</strong> Limited sharing with essential service providers (payment processors, cloud hosting)</li>
                  <li><strong>Legal Requirements:</strong> Data disclosed only when required by law</li>
                  <li><strong>Business Transfers:</strong> Data may transfer in case of merger or acquisition</li>
                  <li><strong>Affiliate Sharing:</strong> No data sharing with affiliate companies</li>
                  <li><strong>Marketing Partners:</strong> No data sharing for marketing purposes</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Cookie className="w-4 h-4 text-cyan-400" />
                  Cookie Policy
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Essential Cookies:</strong> Required for basic site functionality (always active)</li>
                  <li><strong>Analytics Cookies:</strong> Help us improve user experience (optional)</li>
                  <li><strong>Marketing Cookies:</strong> Used for personalized advertising (optional)</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and choices</li>
                  <li><strong>Cookie Consent:</strong> Explicit consent obtained before non-essential cookies</li>
                  <li><strong>Cookie Management:</strong> Control cookie preferences through settings</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-pink-400" />
                  Data Breach Response
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Immediate Detection:</strong> 24/7 monitoring for security incidents</li>
                  <li><strong>Rapid Response:</strong> Dedicated incident response team on standby</li>
                  <li><strong>Containment:</strong> Immediate isolation of affected systems</li>
                  <li><strong>Notification:</strong> Users notified within 72 hours of breach discovery</li>
                  <li><strong>Regulatory Reporting:</strong> Timely reporting to relevant authorities</li>
                  <li><strong>Post-Mortem:</strong> Comprehensive analysis and prevention improvements</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Bug className="w-4 h-4 text-yellow-400" />
                  Vulnerability Management
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Regular Audits:</strong> Quarterly security audits by third-party firms</li>
                  <li><strong>Penetration Testing:</strong> Annual penetration testing by ethical hackers</li>
                  <li><strong>Bug Bounty Program:</strong> Responsible disclosure program for security researchers</li>
                  <li><strong>Patch Management:</strong> Automated security patching within 48 hours</li>
                  <li><strong>Dependency Scanning:</strong> Continuous monitoring of vulnerable dependencies</li>
                  <li><strong>Code Review:</strong> Security review for all code changes</li>
                </ul>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-red-400" />
                  Third-Party Links
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Our platform may contain links to third-party websites</li>
                  <li>We are not responsible for the privacy practices of external sites</li>
                  <li>Review privacy policies of third-party sites before providing information</li>
                  <li>Third-party links are provided for convenience and information</li>
                  <li>We regularly review linked sites for security and privacy compliance</li>
                </ul>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Security Tips for Users
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Keep your software and browser updated with the latest security patches</li>
                  <li>Use reputable antivirus software and keep it current</li>
                  <li>Avoid using public Wi-Fi for accessing your account</li>
                  <li>Be skeptical of unsolicited emails requesting personal information</li>
                  <li>Verify the URL before entering your credentials (look for HTTPS)</li>
                  <li>Use a VPN when accessing your account from public networks</li>
                  <li>Regularly review your account statements for unauthorized activity</li>
                  <li>Report any suspicious emails claiming to be from Secure Rise</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <ThemeAndScroll />
      <CookieConsent />
      <Footer />
    </main>
  );
}
