"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, X, CheckCheck } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import type { BackendNotificationDTO } from "@/services/api.types";

const TYPE_ICON: Record<string, string> = {
  BOOKING_NEW:       "🏨",
  BOOKING_ACCEPTED:  "✅",
  BOOKING_CANCELLED: "❌",
  BOOKING_COMPLETED: "🏁",
  REVIEW_NEW:        "⭐",
};

function fmtTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export default function NotificationBell() {
  const { user } = useAuthStore();
  const { notifications, unreadCount, fetchNotifications, markRead, markAllRead } =
    useNotificationStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Poll every 5 seconds for new notifications
  useEffect(() => {
    if (!user?.id) return;
    fetchNotifications(user.id);
    const interval = setInterval(() => fetchNotifications(user.id), 5000);
    return () => clearInterval(interval);
  }, [user?.id, fetchNotifications]);

  // Close panel on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative p-2 rounded-full transition-colors
          text-foreground/60 hover:text-foreground
          hover:bg-black/5 dark:hover:bg-white/10"
      >
        <Bell className="w-4 h-4" />
        {/* Red dot for unread */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background animate-pulse" />
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-10 w-80 bg-charcoal border border-foreground/10 rounded-2xl shadow-2xl shadow-black/30 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10">
            <h3 className="text-foreground font-bold text-sm">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllRead(user.id)}
                  className="text-xs text-foreground/50 hover:text-gold flex items-center gap-1 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Tout lire
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg hover:bg-foreground/10 text-foreground/40 hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-foreground/40 text-sm text-center py-8">
                Aucune notification
              </p>
            ) : (
              notifications.map((notif) => (
                <NotifItem
                  key={notif.id}
                  notif={notif}
                  onRead={() => markRead(notif.id, user.id)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NotifItem({
  notif,
  onRead,
}: {
  notif: BackendNotificationDTO;
  onRead: () => void;
}) {
  return (
    <div
      onClick={onRead}
      className={`flex items-start gap-3 px-4 py-3 border-b border-foreground/5 cursor-pointer transition-colors
        ${notif.is_read ? "opacity-50" : "hover:bg-foreground/5"}`}
    >
      <span className="text-lg leading-none mt-0.5">
        {TYPE_ICON[notif.type] ?? "🔔"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-foreground text-xs font-semibold leading-tight">
          {notif.title}
        </p>
        <p className="text-foreground/60 text-xs mt-0.5 leading-snug">
          {notif.message}
        </p>
        <p className="text-foreground/30 text-[10px] mt-1">
          {fmtTime(notif.created_at)}
        </p>
      </div>
      {!notif.is_read && (
        <span className="w-2 h-2 bg-purple dark:bg-gold rounded-full shrink-0 mt-1" />
      )}
    </div>
  );
}
