import api from "./api";

export interface Notification {
  id: string;
  userId: string;
  titre: string;
  message: string;
  lue: boolean;
  createdAt: string;
}

export async function getNotifications(
  userId: string
): Promise<Notification[]> {
  const { data } = await api.get<Notification[]>(
    `/notifications/${userId}`
  );
  return data;
}

export async function markAsRead(
  notificationId: string
): Promise<void> {
  await api.put(`/notifications/${notificationId}/lue`);
}

export async function markAllAsRead(userId: string): Promise<void> {
  await api.put(`/notifications/${userId}/lue-toutes`);
}
