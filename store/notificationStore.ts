/**
 * notificationStore.ts
 *
 * Zustand store for the logged-in user's notifications.
 * Polls every 5 seconds while the app is open to simulate push notifications.
 */

import { create } from "zustand";
import * as notificationService from "@/src/services/notificationService";
import type { BackendNotificationDTO } from "@/services/api.types";

interface NotificationState {
  notifications: BackendNotificationDTO[];
  unreadCount: number;
  isLoading: boolean;

  /** Load all notifications for the current user */
  fetchNotifications: (userId: string) => Promise<void>;

  /** Mark a single notification as read */
  markRead: (notifId: string, userId: string) => Promise<void>;

  /** Mark all notifications as read */
  markAllRead: (userId: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async (userId) => {
    set({ isLoading: true });
    try {
      const notifications = await notificationService.getAllNotifications(userId);
      const unreadCount = notifications.filter((n) => !n.is_read).length;
      set({ notifications, unreadCount, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  markRead: async (notifId, userId) => {
    await notificationService.markNotificationRead(notifId);
    const notifications = await notificationService.getAllNotifications(userId);
    const unreadCount = notifications.filter((n) => !n.is_read).length;
    set({ notifications, unreadCount });
  },

  markAllRead: async (userId) => {
    await notificationService.markAllNotificationsRead(userId);
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    }));
  },
}));
