"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Mic,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  CreditCard,
  UserCog,
  FlagTriangleRight,
  Loader2,
  CheckCheck,
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

// ─── Constants ──────────────────────────────────────────────────────────────

const LOGO_URL = "https://i.postimg.cc/0NK6BRV6/favicon-ico.png";

const PRIORITIES = ["Normal", "Urgent"];
const ATTACH_OPTIONS = ["Screenshot", "Document", "Transaction ID"];

// ─── Types ──────────────────────────────────────────────────────────────────

type Sender = "user" | "admin";

interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  createdAt: string;
  read?: boolean;
}

interface QuickTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  prompt: string;
}

// ─── Static config ──────────────────────────────────────────────────────────

const QUICK_TOPICS: QuickTopic[] = [
  {
    id: "billing",
    title: "Billing & Payments",
    description: "Questions about a charge, fee or withdrawal",
    icon: CreditCard,
    prompt: "Hi, I have a question about a payment on my account.",
  },
  {
    id: "account",
    title: "Account Support",
    description: "Help with login, verification or settings",
    icon: UserCog,
    prompt: "Hi, I need help with my account settings.",
  },
  {
    id: "report",
    title: "Report an Issue",
    description: "Flag a bug or something that looks wrong",
    icon: FlagTriangleRight,
    prompt: "Hi, I'd like to report an issue I ran into.",
  },
];

const TOPIC_COLORS: Record<string, { bg: string; iconBg: string; iconBorder: string }> = {
  billing: { bg: "bg-blue-500/10", iconBg: "bg-blue-500/20", iconBorder: "border-blue-500/30" },
  account: { bg: "bg-purple-500/10", iconBg: "bg-purple-500/20", iconBorder: "border-purple-500/30" },
  report: { bg: "bg-green-500/10", iconBg: "bg-green-500/20", iconBorder: "border-green-500/30" },
};

// ─── Animated logo orb ──────────────────────────────────────────────────────

function LogoOrb({ size = 72 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center mx-auto"
      style={{ width: size * 1.8, height: size * 1.8 }}
    >
      <motion.div
        className="absolute rounded-full bg-primary/30 blur-2xl"
        style={{ width: size * 1.6, height: size * 1.6 }}
        animate={{ opacity: [0.35, 0.65, 0.35], scale: [1, 1.15, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src={LOGO_URL}
        alt="Logo"
        className="relative rounded-full shadow-2xl"
        style={{ width: size, height: size }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ─── Small dropdown control (matches SelectInput styling) ──────────────────

function BarDropdown({
  label,
  icon: Icon,
  value,
  onChange,
  options,
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted/40 transition-all"
        >
          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {value || label}
          </span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[180px] bg-card border-border rounded-xl">
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

// ─── Chat input bar ─────────────────────────────────────────────────────────

function ChatInputBar({
  value,
  onChange,
  onSend,
  priority,
  setPriority,
  attachment,
  setAttachment,
  isSending,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  priority: string;
  setPriority: (v: string) => void;
  attachment: string;
  setAttachment: (v: string) => void;
  isSending: boolean;
  autoFocus?: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  return (
    <div className="bg-card border-2 border-border rounded-[1.2rem] p-2 shadow-sm">
      <div className="flex items-start gap-3 px-3 pt-2 pb-3">
        <Sparkles className="w-4 h-4 text-primary shrink-0 mt-1" />
        <textarea
          ref={textareaRef}
          autoFocus={autoFocus}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Message the support team..."
          rows={1}
          className="flex-1 bg-transparent text-sm font-bold focus:outline-none placeholder:text-muted-foreground/60 resize-none overflow-hidden min-h-[24px] max-h-[120px]"
          style={{ height: "auto" }}
        />
      </div>
      <div className="flex items-center justify-between border-t border-border/60 pt-2 px-1">
        <div className="flex items-center gap-1">
          <BarDropdown
            label="Attach"
            icon={Paperclip}
            value={attachment}
            onChange={setAttachment}
            options={ATTACH_OPTIONS}
          />
          <BarDropdown
            label="Priority"
            icon={ShieldCheck}
            value={priority}
            onChange={setPriority}
            options={PRIORITIES}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSend}
            disabled={!value.trim() || isSending}
            className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-20 cursor-pointer"
            aria-label="Send message"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Quick topic card ───────────────────────────────────────────────────────

function QuickTopicCard({ topic, onClick }: { topic: QuickTopic; onClick: () => void }) {
  const Icon = topic.icon;
  const colors = TOPIC_COLORS[topic.id];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative text-left cursor-pointer rounded-[1rem] border-2 border-border p-5 transition-all group hover:border-foreground/30 ${colors.bg}`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 border ${colors.iconBg} ${colors.iconBorder} group-hover:border-foreground/20 transition-colors`}
      >
        <Icon className="w-4 h-4 text-foreground" />
      </div>
      <p className="text-xs font-black uppercase tracking-tight leading-none mb-1.5">
        {topic.title}
      </p>
      <p className="text-[10px] font-bold text-muted-foreground leading-snug">
        {topic.description}
      </p>
    </button>
  );
}

// ─── Message bubble ─────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === "user";
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <img
          src={LOGO_URL}
          alt="Support"
          className="w-7 h-7 rounded-full shrink-0 mb-1"
        />
      )}
      <div className={`max-w-[75%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-2.5 text-sm font-bold leading-relaxed ${
            isUser
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
          {isUser && message.read && (
            <CheckCheck className="w-3 h-3 text-primary" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Typing indicator ───────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5">
      <img src={LOGO_URL} alt="Support" className="w-7 h-7 rounded-full shrink-0" />
      <div className="bg-muted/40 border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function SupportChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [attachment, setAttachment] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isAdminTyping, setIsAdminTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const hasStarted = messages.length > 0;

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAdminTyping]);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/chat/messages");
      const data = await response.json();

      if (data.error || !data.success) {
        toast.error(data.message || data.error || "Failed to load conversation");
        return;
      }

      setMessages(data.messages ?? []);
    } catch (error) {
      toast.error("Failed to load conversation");
    } finally {
      setLoading(false);
    }
  };

  const pushMessage = (sender: Sender, text: string) => {
    const message: ChatMessage = {
      id: `${sender}-${Date.now()}`,
      sender,
      text,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, message]);
    return message;
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    pushMessage("user", trimmed);
    setInputValue("");
    setIsSending(true);
    setIsAdminTyping(true);

    try {
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, priority, attachment }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
      } else if (data.reply) {
        pushMessage("admin", data.reply);
      } else {
        pushMessage(
          "admin",
          "Thanks for reaching out — a member of our support team will reply shortly."
        );
      }
    } catch (error) {
      pushMessage(
        "admin",
        "Thanks for reaching out — a member of our support team will reply shortly."
      );
    } finally {
      setIsAdminTyping(false);
      setIsSending(false);
    }
  };

  const handleQuickTopic = (topic: QuickTopic) => {
    sendMessage(topic.prompt);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <div className="hidden lg:block">
  <UserHeader
    sidebarOpen={sidebarOpen}
    setSidebarOpen={setSidebarOpen}
  />
</div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-25">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <AnimatePresence mode="wait">
              {!hasStarted ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col justify-center space-y-10 py-10"
                >
                  <div className="space-y-6 text-center">
                    <LogoOrb size={72} />
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                        Welcome Back
                      </p>
                      <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                        How can we help you today?
                      </h1>
                    </div>
                  </div>

                  <ChatInputBar
                    value={inputValue}
                    onChange={setInputValue}
                    onSend={() => sendMessage(inputValue)}
                    priority={priority}
                    setPriority={setPriority}
                    attachment={attachment}
                    setAttachment={setAttachment}
                    isSending={isSending}
                    autoFocus
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {QUICK_TOPICS.map((topic) => (
                      <QuickTopicCard
                        key={topic.id}
                        topic={topic}
                        onClick={() => handleQuickTopic(topic)}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="thread"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  {/* Thread header */}
                  <div className="flex items-center gap-3 pb-5 border-b border-border/60">
                    <div className="relative">
                      <img
                        src={LOGO_URL}
                        alt="Support"
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-tight">
                        Support Team
                      </p>
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3 text-primary" /> Usually
                        replies in a few minutes
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto py-6 space-y-5">
                    {messages.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                    ))}
                    {isAdminTyping && <TypingIndicator />}
                    <div ref={scrollRef} />
                  </div>

                  {/* Input */}
                  <div className="pt-2">
                    <ChatInputBar
                      value={inputValue}
                      onChange={setInputValue}
                      onSend={() => sendMessage(inputValue)}
                      priority={priority}
                      setPriority={setPriority}
                      attachment={attachment}
                      setAttachment={setAttachment}
                      isSending={isSending}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <UserNav />
    </div>
  );
}