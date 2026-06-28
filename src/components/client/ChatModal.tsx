"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, MessageSquare, User } from "lucide-react";
import { useMessagesStore } from "@/store/messagesStore";
import { useAuthStore } from "@/store/authStore";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

interface ChatModalProps {
  /** The director's user account ID to chat with */
  directorId: string;
  directorName: string;
  hotelName: string;
  onClose: () => void;
}

export default function ChatModal({
  directorId,
  directorName,
  hotelName,
  onClose,
}: ChatModalProps) {
  const { user, isAuthenticated } = useAuthStore();
  const { sendMessage, getConversation, markAsRead } = useMessagesStore();
  const locale = useLocale();
  const router = useRouter();

  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      onClose();
      router.push(`/${locale}/login?redirect=/hotels`);
    }
  }, [isAuthenticated, locale, router, onClose]);

  const conversation = user ? getConversation(user.id, directorId) : [];

  // Mark incoming messages as read
  useEffect(() => {
    if (user) markAsRead(directorId, user.id);
  }, [directorId, user, markAsRead, conversation.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;
    sendMessage(user.id, directorId, text.trim());
    setText("");
  };

  if (!isAuthenticated || !user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Chat window */}
      <div
        className="relative z-10 w-full sm:w-[380px] bg-card border border-border rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ height: "min(520px, 90dvh)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-purple dark:bg-gold shrink-0">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-white dark:text-[#1c1714]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white dark:text-[#1c1714] font-bold text-sm truncate">
              {hotelName}
            </p>
            <p className="text-white/70 dark:text-[#1c1714]/70 text-[11px] truncate">
              {directorName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 dark:text-[#1c1714]/70 hover:text-white dark:hover:text-[#1c1714] transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {conversation.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-foreground/40 text-sm">
              <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-center max-w-[200px]">
                Posez vos questions à l'hôtel. Un directeur vous répondra dans les meilleurs délais.
              </p>
            </div>
          ) : (
            conversation.map((msg) => {
              const isMe = msg.senderId === user.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {!isMe && (
                    <div className="w-7 h-7 rounded-full bg-purple/20 dark:bg-gold/20 flex items-center justify-center shrink-0 mr-2 mt-1">
                      <User className="w-3.5 h-3.5 text-purple dark:text-gold" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed
                      ${isMe
                        ? "bg-purple dark:bg-gold text-white dark:text-[#1c1714] rounded-br-sm"
                        : "bg-foreground/8 dark:bg-foreground/10 text-foreground rounded-bl-sm border border-border"
                      }`}
                  >
                    <p>{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${isMe ? "text-white/60 dark:text-[#1c1714]/60" : "text-foreground/40"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 px-3 py-3 border-t border-border bg-card shrink-0"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Votre message..."
            className="flex-1 bg-foreground/5 border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder-foreground/40 outline-none focus:ring-2 focus:ring-purple/30 dark:focus:ring-gold/30 transition-all"
            autoFocus
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="p-2.5 rounded-xl bg-purple dark:bg-gold text-white dark:text-[#1c1714] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
