import React, { useState, useRef, useEffect } from "react";
import { X, Send, Smile, Info, ChevronLeft } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "brand";
  text: string;
  timestamp: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: "m1",
    sender: "brand",
    text: "👋 Hey! Thanks for watching our ad. Want to know more about our Summer Collection?",
    timestamp: "10:02",
  },
  {
    id: "m2",
    sender: "user",
    text: "Yes! The new Air Max colourways look insane 🔥",
    timestamp: "10:03",
  },
  {
    id: "m3",
    sender: "brand",
    text: "We're glad you love them! As a Banner.co viewer, you get exclusive early access. Use code BANNER20 for 20% off.",
    timestamp: "10:03",
  },
  {
    id: "m4",
    sender: "user",
    text: "That's amazing! When does the drop happen?",
    timestamp: "10:04",
  },
  {
    id: "m5",
    sender: "brand",
    text: "May 20th at 9AM WAT. We'll send you a reminder notification 🎉",
    timestamp: "10:04",
  },
];

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  brandAvatar: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  isOpen,
  onClose,
  brandName,
  brandAvatar,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const sendMessage = () => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
    setMessages((p) => [...p, newMsg]);
    setText("");

    // Simulate brand auto-reply
    setTimeout(() => {
      setMessages((p) => [
        ...p,
        {
          id: `m${Date.now()}-auto`,
          sender: "brand",
          text: "Thanks for reaching out! Our team will get back to you shortly 💬",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        },
      ]);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end">
      {/* Backdrop (mobile) */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm sm:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full sm:w-[400px] sm:h-screen sm:max-h-screen h-[85vh] bg-main-bg sm:border-l border-t sm:border-t-0 border-border-subtle shadow-2xl flex flex-col rounded-t-[32px] sm:rounded-none">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border-subtle flex-shrink-0">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-surface flex items-center justify-center transition-colors sm:hidden"
          >
            <ChevronLeft className="h-5 w-5 text-text-main" />
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-black text-white text-lg shadow-lg">
              {brandAvatar.charAt(0).toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-main-bg" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-black text-text-main uppercase tracking-tight truncate">
              {brandName}
            </h3>
            <p className="text-[10px] text-emerald-500 font-bold">● Online</p>
          </div>
          <button className="p-2 hover:bg-surface rounded-full transition-colors">
            <Info className="h-4 w-4 text-text-sub" />
          </button>
          <button
            onClick={onClose}
            className="hidden sm:flex p-2 hover:bg-surface rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-text-sub" />
          </button>
        </div>

        {/* Brand promo banner */}
        <div className="mx-4 mt-3 bg-primary/10 border border-primary/20 rounded-2xl px-4 py-2.5 flex-shrink-0">
          <p className="text-[10px] font-black text-primary uppercase tracking-wider">
            💰 Sponsored Chat — Earn ₦10 for every reply
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {msg.sender === "brand" && (
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center font-black text-white text-xs flex-shrink-0">
                  {brandAvatar.charAt(0).toUpperCase()}
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-snug ${
                  msg.sender === "user"
                    ? "bg-primary text-white rounded-br-sm"
                    : "bg-surface text-text-main rounded-bl-sm border border-border-subtle"
                }`}
              >
                {msg.text}
                <span
                  className={`block text-[9px] mt-1 ${
                    msg.sender === "user" ? "text-white/50" : "text-text-sub"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-border-subtle flex-shrink-0">
          <button className="p-2 hover:bg-surface rounded-full transition-colors">
            <Smile className="h-5 w-5 text-text-sub" />
          </button>
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Message brand..."
            className="flex-1 h-10 bg-surface rounded-full px-4 text-sm text-text-main placeholder:text-text-sub outline-none border border-border-subtle focus:border-primary transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center disabled:opacity-40 transition-opacity active:scale-95"
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
        <div style={{ height: "env(safe-area-inset-bottom, 8px)" }} />
      </div>
    </div>
  );
};
