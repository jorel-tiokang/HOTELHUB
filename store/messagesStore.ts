import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface MessagesState {
  messages: Message[];
  sendMessage: (senderId: string, receiverId: string, content: string) => void;
  getConversation: (userId1: string, userId2: string) => Message[];
  markAsRead: (senderId: string, receiverId: string) => void;
  getUnreadCount: (userId: string) => number;
  getUnreadCountFromUser: (senderId: string, receiverId: string) => number;
}

export const useMessagesStore = create<MessagesState>()(
  persist(
    (set, get) => ({
      messages: [],
      sendMessage: (senderId, receiverId, content) => {
        const newMessage: Message = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          senderId,
          receiverId,
          content,
          timestamp: new Date().toISOString(),
          isRead: false,
        };
        set((state) => ({ messages: [...state.messages, newMessage] }));
      },
      getConversation: (userId1, userId2) => {
        return get()
          .messages.filter(
            (m) =>
              (m.senderId === userId1 && m.receiverId === userId2) ||
              (m.senderId === userId2 && m.receiverId === userId1)
          )
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      },
      markAsRead: (senderId, receiverId) => {
        const state = get();
        const hasUnread = state.messages.some(
          (m) => m.senderId === senderId && m.receiverId === receiverId && !m.isRead
        );
        if (!hasUnread) return;

        set((state) => ({
          messages: state.messages.map((m) =>
            m.senderId === senderId && m.receiverId === receiverId ? { ...m, isRead: true } : m
          ),
        }));
      },
      getUnreadCount: (userId) => {
        return get().messages.filter((m) => m.receiverId === userId && !m.isRead).length;
      },
      getUnreadCountFromUser: (senderId, receiverId) => {
        return get().messages.filter((m) => m.senderId === senderId && m.receiverId === receiverId && !m.isRead).length;
      }
    }),
    {
      name: "hotelhub-messages-storage",
    }
  )
);
