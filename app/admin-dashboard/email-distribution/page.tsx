"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Mail,
  Send,
  Users,
  Search,
  ChevronDown,
  X,
  Check,
  Loader2,
  AlertTriangle,
  UserCheck,
  History,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

interface SiteUser {
  _id: string;
  fullName: string;
  email: string;
  username: string;
  profileImage?: string;
}

export default function AdminEmailDistributionPage() {
  const defaultProfileImage = "https://github.com/shadcn.png";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<SiteUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userSearch, setUserSearch] = useState("");

  const [sendToAll, setSendToAll] = useState(true);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [isSending, setIsSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await fetch("/api/admin/users");
      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setUsers(data.users || []);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!userSearch) return users;
    const q = userSearch.toLowerCase();
    return users.filter(
      (u) =>
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  const toggleUser = (userId: string) => {
    setSendToAll(false);
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSendToAll(true);
    setSelectedUserIds([]);
  };

  const handleClearSelection = () => {
    setSendToAll(false);
    setSelectedUserIds([]);
  };

  const recipientCount = sendToAll ? users.length : selectedUserIds.length;

  const recipientLabel = sendToAll
    ? users.length > 0
      ? `All Users (${users.length})`
      : "All Users"
    : selectedUserIds.length === 0
    ? "Select Recipients"
    : selectedUserIds.length === 1
    ? users.find((u) => u._id === selectedUserIds[0])?.fullName || "1 User Selected"
    : `${selectedUserIds.length} Users Selected`;

  const isFormValid = () => {
    if (!subject.trim() || !body.trim()) return false;
    if (!sendToAll && selectedUserIds.length === 0) return false;
    return true;
  };

  const handleSendClick = () => {
    if (!isFormValid()) {
      toast.error("Please add a subject, message, and at least one recipient");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmSend = async () => {
    setIsSending(true);
    try {
      const response = await fetch("/api/admin/email-distribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: sendToAll ? "all" : selectedUserIds,
          subject,
          body,
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message || `Email sent to ${recipientCount} recipient(s)`);
        setSubject("");
        setBody("");
        setSendToAll(true);
        setSelectedUserIds([]);
      }
    } catch (error) {
      toast.error("Failed to send email");
    } finally {
      setIsSending(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none flex items-center gap-4">
              Email Distribution
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-1">
              <Mail className="w-3 h-3 text-primary" />
              Compose &amp; Broadcast to Users
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl">
            {/* Left: Compose */}
            <div className="flex-1 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                {/* Recipients */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    01. Recipients
                  </label>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="w-full flex cursor-pointer items-center justify-between gap-3 bg-muted/30 border-2 border-border rounded-lg px-5 py-3 hover:border-foreground/50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-background border flex items-center justify-center">
                            {sendToAll ? (
                              <Users className="w-4 h-4 text-primary" />
                            ) : (
                              <UserCheck className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <span className="text-xs font-black uppercase tracking-tight">
                            {recipientLabel}
                          </span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-[320px] bg-card border-border rounded-xl p-0 max-h-[420px] overflow-hidden flex flex-col">
                      <DropdownMenuLabel className="px-3 pt-3 pb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Select Recipients
                      </DropdownMenuLabel>

                      <div className="px-3 pb-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                          <input
                            type="text"
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            placeholder="Search users..."
                            className="w-full bg-muted/30 border border-border rounded-lg py-2 pl-8 pr-3 text-xs focus:outline-none focus:border-foreground/50"
                          />
                        </div>
                      </div>

                      <div
                        onClick={handleSelectAll}
                        className={`mx-2 rounded-lg font-black text-[11px] uppercase tracking-tight cursor-pointer focus:bg-muted/50 px-3 py-2 flex items-center gap-2 ${sendToAll ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'}`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${sendToAll ? 'bg-primary border-primary' : 'border-border'}`}>
                          {sendToAll && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        All Users ({users.length})
                      </div>

                      <DropdownMenuSeparator />

                      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
                        {loadingUsers ? (
                          <div className="text-center py-6">
                            <Loader2 className="w-4 h-4 animate-spin mx-auto text-muted-foreground" />
                          </div>
                        ) : filteredUsers.length === 0 ? (
                          <p className="text-[10px] text-center text-muted-foreground py-6 uppercase font-bold">
                            No users found
                          </p>
                        ) : (
                          filteredUsers.map((u) => (
                            <div
                              key={u._id}
                              onClick={() => {
                                if (sendToAll) setSendToAll(false);
                                toggleUser(u._id);
                              }}
                              className={`rounded-lg cursor-pointer focus:bg-muted/50 py-2 px-2 flex items-center gap-2.5 ${!sendToAll && selectedUserIds.includes(u._id) ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${!sendToAll && selectedUserIds.includes(u._id) ? 'bg-primary border-primary' : 'border-border'}`}>
                                {!sendToAll && selectedUserIds.includes(u._id) && <Check className="w-3 h-3 text-primary-foreground" />}
                              </div>
                              <img
                                src={u.profileImage || defaultProfileImage}
                                alt={u.fullName}
                                className="w-6 h-6 rounded-md object-cover"
                              />
                              <div className="flex flex-col">
                                <span className="text-xs font-bold leading-tight">
                                  {u.fullName || u.username}
                                </span>
                                <span className="text-[10px] text-muted-foreground leading-tight">
                                  {u.email}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {!sendToAll && selectedUserIds.length > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <button
                            onClick={handleClearSelection}
                            className="mx-3 mb-3 mt-1 text-[10px] font-black uppercase text-red-500 hover:opacity-80 cursor-pointer text-left"
                          >
                            Clear Selection
                          </button>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {!sendToAll && selectedUserIds.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedUserIds.slice(0, 6).map((id) => {
                        const u = users.find((usr) => usr._id === id);
                        if (!u) return null;
                        return (
                          <span
                            key={id}
                            className="flex items-center gap-1.5 bg-muted/50 border border-border rounded-full pl-1 pr-2 py-1"
                          >
                            <img
                              src={u.profileImage || defaultProfileImage}
                              alt={u.fullName}
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span className="text-[9px] font-bold uppercase">{u.fullName || u.username}</span>
                            <button onClick={() => toggleUser(id)} className="cursor-pointer">
                              <X className="w-2.5 h-2.5 text-muted-foreground hover:text-foreground" />
                            </button>
                          </span>
                        );
                      })}
                      {selectedUserIds.length > 6 && (
                        <span className="text-[9px] font-black uppercase text-muted-foreground self-center">
                          +{selectedUserIds.length - 6} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    02. Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Important update about your account"
                    className="w-full bg-muted/30 border-2 border-border rounded-lg p-3 text-sm font-bold focus:border-foreground focus:outline-none transition-all"
                  />
                </div>

                {/* Body */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    03. Message
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your message here..."
                    rows={10}
                    className="w-full bg-muted/30 border-2 border-border rounded-lg p-3 text-sm leading-relaxed focus:border-foreground focus:outline-none transition-all resize-none"
                  />
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                    {body.length} characters
                  </p>
                </div>

                <button
                  onClick={handleSendClick}
                  disabled={!isFormValid()}
                  className="w-full bg-foreground cursor-pointer text-background py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl disabled:opacity-20"
                >
                  Send Email <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Summary */}
            <div className="w-full lg:w-[320px] space-y-4">
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4 sticky top-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Broadcast Summary
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-muted-foreground">Recipients</span>
                    <span className="text-xs font-black">{recipientCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-muted-foreground">Type</span>
                    <span className="text-xs font-black uppercase">
                      {sendToAll ? "All Users" : "Selected Users"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-muted-foreground">Subject</span>
                    <span className="text-xs font-bold truncate max-w-[140px] text-right">
                      {subject || "—"}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/50 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Emails are sent immediately and cannot be recalled once confirmed.
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <History className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Total Site Users</p>
                  <p className="text-sm font-black">{loadingUsers ? "—" : users.length}</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <AdminNav />
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            onClick={() => !isSending && setShowConfirm(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-primary/10">
              <Mail className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-xl font-black text-center uppercase tracking-tight mb-2">
              Confirm Broadcast
            </h2>

            <div className="bg-muted/50 border border-border rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This will send an email to <strong>{recipientCount}</strong> recipient
                  {recipientCount === 1 ? "" : "s"} immediately. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Recipients</span>
                <span className="text-sm font-bold text-foreground">
                  {sendToAll ? `All Users (${users.length})` : `${selectedUserIds.length} Selected`}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Subject</span>
                <span className="text-sm font-bold text-foreground truncate max-w-[220px] text-right">
                  {subject}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isSending}
                className="flex-1 px-4 py-3 cursor-pointer bg-muted text-foreground rounded-lg text-xs font-black uppercase tracking-wider hover:bg-muted/80 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSend}
                disabled={isSending}
                className="flex-1 px-4 py-3 cursor-pointer bg-primary text-primary-foreground rounded-lg text-xs font-black uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Confirm Send
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}