import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useNotifications } from '../../app/hooks/useNotifications.js';

// Mock notifications API
vi.mock('../../app/api/notificationsAPI.js', () => ({
  getNotifications: vi.fn(),
  markNotificationRead: vi.fn(),
  markAllNotificationsRead: vi.fn(),
  deleteNotification: vi.fn(),
}));

import * as notificationsAPI from '../../app/api/notificationsAPI.js';

describe('useNotifications Hook Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ==================== INITIALIZATION ====================
  describe('Initialization', () => {
    it('should fetch notifications on mount', async () => {
      const mockNotifications = [
        { _id: 'notif-1', title: 'New Application', read: false },
        { _id: 'notif-2', title: 'New Message', read: true }
      ];

      notificationsAPI.getNotifications.mockResolvedValue({
        data: { notifications: mockNotifications }
      });

      const { result } = renderHook(() => useNotifications());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.notifications).toEqual(mockNotifications);
      expect(result.current.unreadCount).toBe(1);
    });

    it('should handle fetch error', async () => {
      notificationsAPI.getNotifications.mockRejectedValue(new Error('Failed'));

      const { result } = renderHook(() => useNotifications());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.notifications).toEqual([]);
    });
  });

  // ==================== MARK AS READ ====================
  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const mockNotifications = [
        { _id: 'notif-1', title: 'Notification 1', read: false }
      ];

      notificationsAPI.getNotifications.mockResolvedValue({
        data: { notifications: mockNotifications }
      });
      notificationsAPI.markNotificationRead.mockResolvedValue({ data: { success: true } });

      const { result } = renderHook(() => useNotifications());

      await waitFor(() => expect(result.current.loading).toBe(false));

      await result.current.markAsRead('notif-1');

      expect(notificationsAPI.markNotificationRead).toHaveBeenCalledWith('notif-1');
      expect(result.current.unreadCount).toBe(0);
    });

    it('should handle mark as read error', async () => {
      const mockNotifications = [
        { _id: 'notif-1', title: 'Notification 1', read: false }
      ];

      notificationsAPI.getNotifications.mockResolvedValue({
        data: { notifications: mockNotifications }
      });
      notificationsAPI.markNotificationRead.mockRejectedValue(new Error('Failed'));

      const { result } = renderHook(() => useNotifications());

      await waitFor(() => expect(result.current.loading).toBe(false));

      try {
        await result.current.markAsRead('notif-1');
      } catch (e) {
        // Expected
      }

      expect(result.current.notifications[0].read).toBe(false);
    });
  });

  // ==================== MARK ALL AS READ ====================
  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      const mockNotifications = [
        { _id: 'notif-1', title: 'Notification 1', read: false },
        { _id: 'notif-2', title: 'Notification 2', read: false }
      ];

      notificationsAPI.getNotifications.mockResolvedValue({
        data: { notifications: mockNotifications }
      });
      notificationsAPI.markAllNotificationsRead.mockResolvedValue({ data: { success: true } });

      const { result } = renderHook(() => useNotifications());

      await waitFor(() => expect(result.current.loading).toBe(false));

      await result.current.markAllAsRead();

      expect(notificationsAPI.markAllNotificationsRead).toHaveBeenCalled();
      expect(result.current.unreadCount).toBe(0);
    });
  });

  // ==================== DELETE NOTIFICATION ====================
  describe('deleteNotification', () => {
    it('should delete notification', async () => {
      const mockNotifications = [
        { _id: 'notif-1', title: 'Notification 1', read: false }
      ];

      notificationsAPI.getNotifications.mockResolvedValue({
        data: { notifications: mockNotifications }
      });
      notificationsAPI.deleteNotification.mockResolvedValue({ data: { success: true } });

      const { result } = renderHook(() => useNotifications());

      await waitFor(() => expect(result.current.loading).toBe(false));

      await result.current.deleteNotification('notif-1');

      expect(notificationsAPI.deleteNotification).toHaveBeenCalledWith('notif-1');
      expect(result.current.notifications).toEqual([]);
    });
  });
});
