import { useState, useEffect, useRef } from "react";
import { useMessagesStore } from "@/store/messagesStore";
import { Send, User } from "lucide-react";

export interface Contact {
  id: string;
  name: string;
  role: string;
  avatarInitial: string;
}

export interface MessagesTabProps {
  currentUser: {
    id: string;
    name: string;
    role: string;
  };
  contacts: Contact[];
  t: (key: string) => string;
}

export default function MessagesTab({ currentUser, contacts, t }: MessagesTabProps) {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(contacts.length > 0 ? contacts[0].id : null);
  const [messageText, setMessageText] = useState("");
  
  const { messages, sendMessage, getConversation, markAsRead, getUnreadCountFromUser } = useMessagesStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mark messages as read when selecting a contact
  useEffect(() => {
    if (selectedContactId) {
      markAsRead(selectedContactId, currentUser.id);
    }
  }, [selectedContactId, markAsRead, currentUser.id, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedContactId]);

  const conversation = selectedContactId ? getConversation(currentUser.id, selectedContactId) : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedContactId) return;
    sendMessage(currentUser.id, selectedContactId, messageText);
    setMessageText("");
  };

  return (
    <div className="bg-charcoal rounded-2xl shadow-lg border border-foreground/10 flex overflow-hidden" style={{ height: "calc(100vh - 250px)", minHeight: "500px" }}>
      {/* Contacts Sidebar */}
      <div className="w-1/3 border-r border-foreground/10 flex flex-col bg-charcoal/50">
        <div className="p-4 border-b border-foreground/10">
          <h3 className="text-foreground font-bold" style={{ fontFamily: "var(--font-playfair)" }}>{t("messages.contacts")}</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => {
            const unread = getUnreadCountFromUser(contact.id, currentUser.id);
            const isSelected = selectedContactId === contact.id;
            
            return (
              <button
                key={contact.id}
                onClick={() => setSelectedContactId(contact.id)}
                className={`w-full text-left p-4 flex items-center gap-3 transition-colors border-b border-foreground/5 hover:bg-foreground/5 ${isSelected ? "bg-foreground/10" : ""}`}
              >
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${contact.role === "PDG" ? "bg-gold/20 text-gold" : "bg-purple/20 text-purple"}`}>
                    {contact.avatarInitial}
                  </div>
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-charcoal flex items-center justify-center text-[10px] text-white font-bold">
                      {unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-foreground font-semibold truncate">{contact.name}</p>
                  <p className="text-foreground/50 text-xs truncate">{contact.role}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-charcoal relative">
        {selectedContactId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-foreground/10 flex items-center gap-3 bg-charcoal/50">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-foreground/10 text-foreground">
                {contacts.find(c => c.id === selectedContactId)?.avatarInitial}
              </div>
              <div>
                <p className="text-foreground font-bold">{contacts.find(c => c.id === selectedContactId)?.name}</p>
                <p className="text-foreground/50 text-xs">{contacts.find(c => c.id === selectedContactId)?.role}</p>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversation.length === 0 ? (
                <div className="h-full flex items-center justify-center text-foreground/40 text-sm">
                  {t("messages.noMessages")}
                </div>
              ) : (
                conversation.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${isMe ? "bg-purple text-white rounded-br-sm" : "bg-foreground/10 text-foreground rounded-bl-sm"}`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${isMe ? "text-white/60 text-right" : "text-foreground/40 text-left"}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-foreground/10 bg-charcoal/50">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={t("messages.placeholder")}
                  className="flex-1 bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-purple transition-all placeholder:text-foreground/40"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="bg-purple hover:bg-purple/90 disabled:opacity-50 text-white p-3 rounded-xl transition-all flex items-center justify-center shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-foreground/40">
            <User className="w-12 h-12 mb-4 opacity-50" />
            <p>{t("messages.selectUser")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
