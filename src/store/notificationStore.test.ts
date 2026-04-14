import { describe, expect, it } from 'vitest';
import { getUnreadCount, markAllAsRead, markAsRead } from './notificationStore';

const notifications = [
  { id: 'n1', title: 'A', message: 'a', createdAt: '2026-01-01', read: false },
  { id: 'n2', title: 'B', message: 'b', createdAt: '2026-01-02', read: true },
] as const;

describe('notificationStore', () => {
  it('marks single item as read', () => {
    const updated = markAsRead([...notifications], 'n1');
    expect(updated.find((n) => n.id === 'n1')?.read).toBe(true);
  });

  it('marks all as read', () => {
    const updated = markAllAsRead([...notifications]);
    expect(updated.every((n) => n.read)).toBe(true);
  });

  it('counts unread notifications', () => {
    expect(getUnreadCount([...notifications])).toBe(1);
  });
});
