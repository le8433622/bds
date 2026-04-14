import type { NotificationItem } from '../screens/notifications/NotificationsScreen';

export function markAsRead(items: NotificationItem[], notificationId: string): NotificationItem[] {
  return items.map((item) => (item.id === notificationId ? { ...item, read: true } : item));
}

export function markAllAsRead(items: NotificationItem[]): NotificationItem[] {
  return items.map((item) => ({ ...item, read: true }));
}

export function getUnreadCount(items: NotificationItem[]): number {
  return items.filter((item) => !item.read).length;
}
