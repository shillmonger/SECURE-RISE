"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  FileText,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  Eye,
  ShieldCheck,
  Calendar,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast, Toaster } from "sonner";

// Store Theme Dashboard Imports
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";
import KYCVerificationSkeleton from "@/components/LoadingSkeleton/KYCVerificationSkeleton";

// ─── Types ──────────────────────────────────────────────────────────────────
interface KYCSubmission {
  _id: string;
  userId: string;
  username: string;
  userEmail: string;
  firstName: string;
  lastName: string;
  dob: string;
  nationality: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  idType: string;
  idNumber: string;
  frontImage: string;
  backImage: string;
  submissionId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  ipAddress: string;
  userAgent: string;
  userProfile: {
    _id: string;
    username: string;
    email: string;
    profileImage: string;
    fullName: string;
  };
  reviewedAt?: string;
  rejectionReason?: string;
}

export default function AdminKYCVerificationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [kycSubmissions, setKycSubmissions] = useState<KYCSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; action: 'approve' | 'reject'; submissionId: string; userName: string } | null>(null);

  // Fetch KYC submissions on component mount
  useEffect(() => {
    const fetchKYCSubmissions = async () => {
      try {
        const response = await fetch('/api/admin/kyc');
        const result = await response.json();
        
        if (result.success) {
          setKycSubmissions(result.kycSubmissions);
        } else {
          toast.error('Failed to fetch KYC submissions');
        }
      } catch (error) {
        console.error('Error fetching KYC submissions:', error);
        toast.error('Failed to fetch KYC submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchKYCSubmissions();
  }, []);

  const filteredSubmissions = kycSubmissions.filter((sub) => {
    const matchesSearch =
      sub.userProfile.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.userProfile.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || sub.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await fetch(`/api/admin/kyc/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'approve' }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('KYC submission approved successfully');
        // Update local state
        setKycSubmissions(prev =>
          prev.map(sub =>
            sub._id === id
              ? { ...sub, status: 'approved', reviewedAt: new Date().toISOString() }
              : sub
          )
        );
      } else {
        toast.error(result.error || 'Failed to approve submission');
      }
    } catch (error) {
      console.error('Error approving KYC:', error);
      toast.error('Failed to approve submission');
    } finally {
      setActionLoading(null);
      setConfirmModal(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await fetch(`/api/admin/kyc/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reject' }),
      });

      const result = await response.json();

      if (result.success) {
        toast.error('KYC submission rejected');
        // Update local state
        setKycSubmissions(prev =>
          prev.map(sub =>
            sub._id === id
              ? { ...sub, status: 'rejected', reviewedAt: new Date().toISOString() }
              : sub
          )
        );
      } else {
        toast.error(result.error || 'Failed to reject submission');
      }
    } catch (error) {
      console.error('Error rejecting KYC:', error);
      toast.error('Failed to reject submission');
    } finally {
      setActionLoading(null);
      setConfirmModal(null);
    }
  };

  const openConfirmModal = (action: 'approve' | 'reject', submissionId: string, userName: string) => {
    setConfirmModal({ isOpen: true, action, submissionId, userName });
  };

  const closeConfirmModal = () => {
    setConfirmModal(null);
  };

  const confirmAction = () => {
    if (!confirmModal) return;
    if (confirmModal.action === 'approve') {
      handleApprove(confirmModal.submissionId);
    } else {
      handleReject(confirmModal.submissionId);
    }
  };

  const [selectedUser, setSelectedUser] = useState<KYCSubmission | null>(null);

  const stats = [
    { label: "Total Submissions", value: kycSubmissions.length, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Pending Review", value: kycSubmissions.filter((k) => k.status === "pending").length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Approved", value: kycSubmissions.filter((k) => k.status === "approved").length, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Rejected", value: kycSubmissions.filter((k) => k.status === "rejected").length, icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  if (loading && kycSubmissions.length === 0) {
    return (
      <div className="flex h-screen overflow-hidden bg-background font-sans">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden text-foreground">
          <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
            <KYCVerificationSkeleton />
          </main>
          <AdminNav />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <Toaster position="top-center" richColors />
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        {/* ✅ Fix: pass sidebarOpen alongside setSidebarOpen */}
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">
                  KYC Verification
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-1">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  Security & Compliance
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-muted/30 border-2 border-border rounded-xl py-2.5 pl-10 pr-4 text-xs font-black italic tracking-tight focus:border-foreground focus:outline-none transition-all w-full md:w-64"
                  />
                </div>
                <button className="p-2.5 bg-muted/30 border-2 border-border rounded-xl text-muted-foreground hover:border-foreground/40 transition-all">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-[1rem] px-5 py-3 shadow-sm hover:shadow-md transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-black tracking-tighter text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Content Table */}
            <div className="bg-card border border-border rounded-[1rem] shadow-sm overflow-hidden">
              <>
                  {/* Filter Tabs */}
                  <div className="flex gap-1 p-2 bg-muted/30 border-b border-border">
                    {["all", "pending", "approved", "rejected"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status as "all" | "pending" | "approved" | "rejected")}
                        className={`px-5 py-2 cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          filterStatus === status
                            ? "bg-foreground text-background shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-muted-foreground text-[10px] uppercase tracking-[0.15em] font-black border-b border-border">
                          <th className="px-6 py-5">User Profile</th>
                          <th className="px-6 py-5">Document</th>
                          <th className="px-6 py-5">Date Submitted</th>
                          <th className="px-6 py-5">Status</th>
                          <th className="px-6 py-5 text-right">Review Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredSubmissions.map((submission) => (
                          <tr
                            key={submission._id}
                            className="group hover:bg-muted/30 transition-colors"
                          >
                            {/* User */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={submission.userProfile.profileImage} 
                                  alt={submission.userProfile.fullName}
                                  className="w-10 h-10 rounded-lg  cursor-pointer object-cover border border-border"
                                />
                                <div className="flex flex-col">
                                  <span className="font-black italic text-sm tracking-tight text-foreground">
                                    {submission.userProfile.fullName}
                                  </span>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                    @{submission.userProfile.username}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Document */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-500/10 rounded-lg">
                                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-tight text-foreground">
                                  {submission.idType}
                                </span>
                              </div>
                            </td>

                            {/* Date */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Calendar className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black uppercase">
                                  {new Date(submission.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </td>

                            {/* Status Badge */}
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                  submission.status === "approved"
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    : submission.status === "rejected"
                                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                }`}
                              >
                                {submission.status}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setSelectedUser(submission)}
                                  className="p-3 bg-muted/50 rounded-lg text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                                {submission.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() => openConfirmModal('approve', submission._id, submission.userProfile.fullName)}
                                      disabled={actionLoading === submission._id}
                                      className="p-3 bg-emerald-500/10 cursor-pointer hover:bg-emerald-500/20 rounded-lg text-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {actionLoading === submission._id ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                      ) : (
                                        <CheckCircle className="w-5 h-5" />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => openConfirmModal('reject', submission._id, submission.userProfile.fullName)}
                                      disabled={actionLoading === submission._id}
                                      className="p-3 bg-rose-500/10 cursor-pointer hover:bg-rose-500/20 rounded-lg text-rose-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {actionLoading === submission._id ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                      ) : (
                                        <XCircle className="w-5 h-5" />
                                      )}
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredSubmissions.length === 0 && (
                    <div className="p-20 text-center">
                      <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-sm font-black uppercase italic text-muted-foreground">
                        No matching submissions found
                      </h3>
                    </div>
                  )}
                </>
            </div>
          </div>
        </main>

        <AdminNav />
      </div>

{selectedUser && (
  <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
    <div className="bg-card border border-border rounded-2xl w-full max-w-2xl flex flex-col" style={{ height: '90vh' }}>

      {/* Fixed Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium text-foreground">User details</h3>
          <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
            selectedUser.status === "approved"
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : selectedUser.status === "rejected"
              ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
          }`}>
            {selectedUser.status}
          </span>
        </div>
        <button
          onClick={() => setSelectedUser(null)}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* User hero */}
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border">
          <img
            src={selectedUser.userProfile.profileImage}
            alt={selectedUser.userProfile.fullName}
            className="w-13 h-13 rounded-xl object-cover border border-border flex-shrink-0"
          />
          <div>
            <p className="text-sm font-medium text-foreground">{selectedUser.userProfile.fullName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              @{selectedUser.userProfile.username} · {selectedUser.userProfile.email}
            </p>
          </div>
        </div>

        {/* Personal information */}
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-3">
            Personal information
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Full name", value: `${selectedUser.firstName} ${selectedUser.lastName}` },
              { label: "Date of birth", value: selectedUser.dob },
              { label: "Nationality", value: selectedUser.nationality },
              { label: "Postal code", value: selectedUser.postalCode },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 bg-muted/30 rounded-lg border border-border">
                <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
                <p className="text-sm font-medium text-foreground">{value}</p>
              </div>
            ))}
            <div className="col-span-2 p-3 bg-muted/30 rounded-lg border border-border">
              <p className="text-[11px] text-muted-foreground mb-1">Address</p>
              <p className="text-sm font-medium text-foreground">
                {selectedUser.address}, {selectedUser.city}, {selectedUser.country}
              </p>
            </div>
          </div>
        </div>

        <hr className="border-border" />

        {/* Identity document */}
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-3">
            Identity document
          </p>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <p className="text-[11px] text-muted-foreground mb-1">Document type</p>
              <p className="text-sm font-medium text-foreground">{selectedUser.idType}</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <p className="text-[11px] text-muted-foreground mb-1">Document number</p>
              <p className="text-sm font-medium text-foreground font-mono">{selectedUser.idNumber}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Front", src: selectedUser.frontImage },
              { label: "Back", src: selectedUser.backImage },
            ].map(({ label, src }) => (
              <div key={label} className="rounded-lg border border-border overflow-hidden bg-muted/30">
                <p className="text-[11px] text-muted-foreground px-3 pt-2.5 pb-1.5">{label}</p>
                <img
                  src={src}
                  alt={`${label} of document`}
                  className="w-full h-36 object-cover border-t border-border cursor-pointer"
                  onClick={() => window.open(src, '_blank')}
                />
              </div>
            ))}
          </div>
        </div>

        <hr className="border-border" />

        {/* Submission details */}
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-3">
            Submission details
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 p-3 bg-muted/30 rounded-lg border border-border">
              <p className="text-[11px] text-muted-foreground mb-1">Submission ID</p>
              <p className="text-sm font-medium text-foreground font-mono">{selectedUser.submissionId}</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <p className="text-[11px] text-muted-foreground mb-1">Submitted</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(selectedUser.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <p className="text-[11px] text-muted-foreground mb-1">IP address</p>
              <p className="text-sm font-medium text-foreground font-mono">{selectedUser.ipAddress}</p>
            </div>
          </div>
        </div>

      </div>


{/* Fixed Footer */}
      <div className="flex-shrink-0 flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
        <button className="text-xs font-medium px-4 py-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 hover:opacity-80 transition-opacity cursor-pointer">
          Reject
        </button>
        <button className="text-xs font-medium px-4 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:opacity-80 transition-opacity cursor-pointer">
          Approve
        </button>
      </div>

    </div>
  </div>
)}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={closeConfirmModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal */}
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
            {/* Icon */}
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              confirmModal.action === 'approve'
                ? 'bg-emerald-500/10'
                : 'bg-rose-500/10'
            }`}>
              {confirmModal.action === 'approve' ? (
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-500" />
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl font-black text-center uppercase tracking-tight mb-2">
              {confirmModal.action === 'approve' ? 'Approve KYC' : 'Reject KYC'}
            </h2>

            {/* Warning */}
            <div className="bg-muted/50 border border-border rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This action <strong>cannot be undone</strong>. Please review the details below before confirming.
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">User</span>
                <span className="text-sm font-bold text-foreground">{confirmModal.userName}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Action</span>
                <span className={`text-sm font-bold uppercase ${
                  confirmModal.action === 'approve' ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                  {confirmModal.action}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeConfirmModal}
                disabled={actionLoading === confirmModal.submissionId}
                className="flex-1 px-4 py-3 cursor-pointer bg-muted text-foreground rounded-lg text-xs font-black uppercase tracking-wider hover:bg-muted/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={actionLoading === confirmModal.submissionId}
                className={`flex-1 px-4 py-3 cursor-pointer rounded-lg text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  confirmModal.action === 'approve'
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-rose-500 text-white hover:bg-rose-600'
                }`}
              >
                {actionLoading === confirmModal.submissionId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {confirmModal.action === 'approve' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    {confirmModal.action === 'approve' ? 'Approve' : 'Reject'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    // </div>
  );
}