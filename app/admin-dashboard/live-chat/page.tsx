"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Search,
  ShieldCheck,
  Loader2,
  CheckCheck,
  Inbox,
  CircleDot,
  MoreVertical,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

// ─── Constants ──────────────────────────────────────────────────────────────

const LOGO_URL = "https://i.postimg.cc/0NK6BRV6/favicon-ico.png";
const ATTACH_OPTIONS = ["Screenshot", "Document", "Transaction ID"];

// ─── Types ──────────────────────────────────────────────────────────────────

type Sender = "user" | "admin";
type FilterTab = "all" | "unread";

interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  createdAt: string;
  read?: boolean;
}

interface Conversation {
  userId: string;
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  online?: boolean;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

// ─── Avatar ─────────────────────────────────────────────────────────────────

function UserAvatar({
  name,
  avatarUrl,
  online,
  size = 40,
}: {
  name: string;
  avatarUrl?: string;
  online?: boolean;
  size?: number;
}) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
          <span className="text-[11px] font-black text-primary">
            {initials(name)}
          </span>
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
      )}
    </div>
  );
}

// ─── Conversation list item ─────────────────────────────────────────────────

function ConversationListItem({
  conversation,
  active,
  onClick,
}: {
  conversation: Conversation;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left cursor-pointer rounded-xl p-3 transition-all flex items-center gap-3 ${
        active ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/40 border border-transparent"
      }`}
    >
      <UserAvatar
        name={conversation.userName}
        avatarUrl={conversation.avatarUrl}
        online={conversation.online}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-black uppercase tracking-tight truncate">
            {conversation.userName}
          </p>
          <span className="text-[9px] font-black uppercase text-muted-foreground tracking-wider shrink-0">
            {relativeTime(conversation.lastMessageAt)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-[11px] font-bold text-muted-foreground truncate">
            {conversation.lastMessage}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-black flex items-center justify-center">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Message bubble (admin = right, user = left) ────────────────────────────

function MessageBubble({
  message,
  conversation,
}: {
  message: ChatMessage;
  conversation: Conversation;
}) {
  const isAdmin = message.sender === "admin";
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2.5 ${isAdmin ? "justify-end" : "justify-start"}`}
    >
      {!isAdmin && (
        <UserAvatar
          name={conversation.userName}
          avatarUrl={conversation.avatarUrl}
          size={28}
        />
      )}
      <div className={`max-w-[70%] flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-2.5 text-sm font-bold leading-relaxed ${
            isAdmin
              ? "bg-foreground text-background rounded-2xl rounded-br-sm"
              : "bg-muted/40 border border-border text-foreground rounded-2xl rounded-bl-sm"
          }`}
        >
          {message.text}
        </div>
        <div className="flex items-center gap-1 px-1 mt-1">
          <span className="text-[9px] font-black uppercase text-muted-foreground tracking-wider">
            {time}
          </span>
          {isAdmin && message.read && <CheckCheck className="w-3 h-3 text-primary" />}
        </div>
      </div>
      {isAdmin && (
        <img src={LOGO_URL} alt="Admin" className="w-7 h-7 rounded-full shrink-0" />
      )}
    </motion.div>
  );
}

// ─── Reply composer ─────────────────────────────────────────────────────────

function ReplyComposer({
  value,
  onChange,
  onSend,
  attachment,
  setAttachment,
  isSending,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  attachment: string;
  setAttachment: (v: string) => void;
  isSending: boolean;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="bg-card border-2 border-border rounded-[1.2rem] p-2 shadow-sm">
      <div className="flex items-center gap-3 px-3 pt-2 pb-3">
        <input
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Reply to this user..."
          className="flex-1 bg-transparent text-sm font-bold focus:outline-none placeholder:text-muted-foreground/60"
        />
      </div>
      <div className="flex items-center justify-between border-t border-border/60 pt-2 px-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted/40 transition-all"
            >
              <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {attachment || "Attach"}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[180px] bg-card border-border rounded-xl">
            {ATTACH_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() => setAttachment(opt)}
                className="flex items-center gap-3 px-3 py-2 cursor-pointer focus:bg-muted/50 transition-colors"
              >
                <span className="font-black text-xs uppercase">{opt}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          onClick={onSend}
          disabled={!value.trim() || isSending}
          className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-20 cursor-pointer"
          aria-label="Send reply"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Empty state (no conversation selected) ────────────────────────────────

function EmptyThreadState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
      <div className="relative flex items-center justify-center w-24 h-24">
        <motion.div
          className="absolute w-20 h-20 rounded-full bg-primary/25 blur-2xl"
          animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.15, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src={LOGO_URL}
          alt="Logo"
          className="relative w-12 h-12 rounded-full shadow-2xl"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-black uppercase tracking-tight">
          Select a conversation
        </p>
        <p className="text-[11px] font-bold text-muted-foreground max-w-xs">
          Choose a user from the list to view their messages and reply.
        </p>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AdminMessagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");

  const [replyValue, setReplyValue] = useState("");
  const [attachment, setAttachment] = useState("");
  const [isSending, setIsSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.userId === selectedUserId) || null,
    [conversations, selectedUserId]
  );

  const filteredConversations = useMemo(() => {
    return conversations
      .filter((c) =>
        filterTab === "unread" ? c.unreadCount > 0 : true
      )
      .filter((c) =>
        search
          ? c.userName.toLowerCase().includes(search.toLowerCase()) ||
            c.userEmail.toLowerCase().includes(search.toLowerCase())
          : true
      )
      .sort(
        (a, b) =>
          new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
      );
  }, [conversations, filterTab, search]);

  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    [conversations]
  );

  useEffect(() => {
    fetchConversations();
    // Poll for new conversations and messages every 20 seconds
    pollingRef.current = setInterval(() => {
      fetchConversations();
      if (selectedUserId) fetchMessages(selectedUserId);
    }, 20000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [selectedUserId]);

  useEffect(() => {
    if (selectedUserId) fetchMessages(selectedUserId);
  }, [selectedUserId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/admin/chat/conversations");
      const data = await response.json();

      if (data.error || !data.success) {
        toast.error(data.message || data.error || "Failed to load conversations");
        return;
      }

      const list: Conversation[] = data.conversations ?? [];
      setConversations(list);
      if (!selectedUserId && list.length > 0) {
        setSelectedUserId(list[0].userId);
      }
    } catch (error) {
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    setMessagesLoading(true);
    try {
      const response = await fetch(`/api/admin/chat/messages?userId=${userId}`);
      const data = await response.json();

      if (data.error || !data.success) {
        toast.error(data.message || data.error || "Failed to load messages");
        return;
      }

      setMessages(data.messages ?? []);
      setConversations((prev) =>
        prev.map((c) => (c.userId === userId ? { ...c, unreadCount: 0 } : c))
      );
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendReply = async () => {
    const trimmed = replyValue.trim();
    if (!trimmed || !selectedUserId || isSending) return;

    const optimistic: ChatMessage = {
      id: `admin-${Date.now()}`,
      sender: "admin",
      text: trimmed,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, optimistic]);
    setReplyValue("");
    setIsSending(true);

    try {
      const response = await fetch("/api/admin/chat/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          text: trimmed,
          attachment,
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        setConversations((prev) =>
          prev.map((c) =>
            c.userId === selectedUserId
              ? { ...c, lastMessage: trimmed, lastMessageAt: optimistic.createdAt }
              : c
          )
        );
      }
    } catch (error) {
      toast.error("Failed to send reply");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <div className="hidden lg:block">
          <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>


        <main className="flex-1 overflow-hidden p-4 md:p-8 pb-25">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {/* Header */}
            <section className="space-y-1 mb-6 shrink-0">
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none flex items-center gap-3">
                Messages
                {totalUnread > 0 && (
                  <span className="text-[10px] font-black bg-primary text-primary-foreground rounded-full px-2 py-1">
                    {totalUnread} unread
                  </span>
                )}
              </h1>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-primary" /> View and reply
                to user conversations
              </p>
            </section>

            {/* Split view */}
            <div className="flex-1 min-h-0 flex gap-6">
              {/* Left: conversation list */}
              <div className="w-full sm:w-[320px] shrink-0 flex flex-col bg-card border border-border rounded-[1rem] overflow-hidden">
                <div className="p-4 space-y-3 border-b border-border/60 shrink-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search users..."
                      className="w-full bg-muted/30 border border-border rounded-lg py-2 pl-9 pr-3 text-xs font-bold focus:border-foreground focus:outline-none transition-all placeholder:text-muted-foreground/60"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {(["all", "unread"] as FilterTab[]).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setFilterTab(tab)}
                        className={`cursor-pointer px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                          filterTab === tab
                            ? "bg-foreground text-background"
                            : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {loading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-2 text-center px-4">
                      <Inbox className="w-6 h-6 text-muted-foreground opacity-50" />
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                        No conversations found
                      </p>
                    </div>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <ConversationListItem
                        key={conversation.userId}
                        conversation={conversation}
                        active={conversation.userId === selectedUserId}
                        onClick={() => setSelectedUserId(conversation.userId)}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Right: thread */}
              <div className={`${selectedUserId ? 'flex' : 'hidden sm:flex'} flex-1 flex-col bg-card border border-border rounded-[1rem] overflow-hidden absolute sm:relative inset-0 z-10`}>
                {!selectedConversation ? (
                  <EmptyThreadState />
                ) : (
                  <>
                    {/* Thread header */}
                    <div className="flex items-center justify-between gap-3 p-4 border-b border-border/60 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedUserId(null)}
                        className="sm:hidden p-2 rounded-lg hover:bg-muted/40 transition-all cursor-pointer"
                      >
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={selectedConversation.userName}
                          avatarUrl={selectedConversation.avatarUrl}
                          online={selectedConversation.online}
                        />
                        <div>
                          <p className="text-xs font-black uppercase tracking-tight">
                            {selectedConversation.userName}
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5">
                            <CircleDot
                              className={`w-3 h-3 ${
                                selectedConversation.online
                                  ? "text-green-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                            {selectedConversation.userEmail}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="p-2 rounded-lg hover:bg-muted/40 transition-all cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[200px] bg-card border-border rounded-xl">
                          <DropdownMenuItem
                            onClick={() =>
                              toast.success("Conversation marked as resolved")
                            }
                            className="flex items-center gap-2.5 px-3 py-2 cursor-pointer focus:bg-muted/50 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                            <span className="font-black text-xs uppercase">
                              Mark Resolved
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-5">
                      {messagesLoading ? (
                        <div className="flex items-center justify-center py-10">
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        </div>
                      ) : (
                        messages.map((message) => (
                          <MessageBubble
                            key={message.id}
                            message={message}
                            conversation={selectedConversation}
                          />
                        ))
                      )}
                      <div ref={scrollRef} />
                    </div>

                    {/* Reply composer */}
                    <div className="p-4 border-t border-border/60 shrink-0">
                      <ReplyComposer
                        value={replyValue}
                        onChange={setReplyValue}
                        onSend={handleSendReply}
                        attachment={attachment}
                        setAttachment={setAttachment}
                        isSending={isSending}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <AdminNav />
    </div>
  );
}