import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
} from '../../app/api/notificationsAPI.js';

vi.mock('../../app/api/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  }
}));

import axiosInstance from '../../app/api/axiosInstance.js';

describe('Notifications API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue('mock-token');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ==================== GET NOTIFICATIONS ====================
  describe('getNotifications', () => {
    it('should fetch all notifications', async () => {
      const mockResponse = {
        data: {
          success: true,
          notifications: [
            { id: 'notif-1', type: 'application', title: 'New Application', isRead: false },
            { id: 'notif-2', type: 'message', title: 'New Message', isRead: true }
          ],
          total: 2
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getNotifications();

      expect(axiosInstance.get).toHaveBeenCalledWith('/notifications');
      expect(result.data.notifications).toHaveLength(2);
    });

    it('should return empty array when no notifications', async () => {
      const mockResponse = {
        data: { success: true, notifications: [], total: 0 }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getNotifications();

      expect(result.data.notifications).toHaveLength(0);
    });

    it('should require authentication', async () => {
      localStorage.getItem.mockReturnValue(null);

      const mockError = {
        response: { status: 401, data: { message: 'Authentication required' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getNotifications()).rejects.toEqual(mockError);
    });
  });

  // ==================== MARK NOTIFICATION READ ====================
  describe('markNotificationRead', () => {
    it('should mark notification as read', async () => {
      const notificationId = 'notif-1';

      const mockResponse = {
        data: { success: true, notification: { id: notificationId, isRead: true } }
      };

      axiosInstance.put.mockResolvedValue(mockResponse);

      const result = await markNotificationRead(notificationId);

      expect(axiosInstance.put).toHaveBeenCalledWith(`/notifications/${notificationId}/read`);
      expect(result.data.success).toBe(true);
    });

    it('should handle notification not found', async () => {
      const notificationId = 'invalid';

      const mockError = {
        response: { status: 404, data: { message: 'Notification not found' } }
      };

      axiosInstance.put.mockRejectedValue(mockError);

      await expect(markNotificationRead(notificationId)).rejects.toEqual(mockError);
    });

    it('should reject marking other user notification', async () => {
      const notificationId = 'other-notif';

      const mockError = {
        response: { status: 403, data: { message: 'Not authorized' } }
      };

      axiosInstance.put.mockRejectedValue(mockError);

      await expect(markNotificationRead(notificationId)).rejects.toEqual(mockError);
    });
  });

  // ==================== MARK ALL NOTIFICATIONS READ ====================
  describe('markAllNotificationsRead', () => {
    it('should mark all notifications as read', async () => {
      const mockResponse = {
        data: { success: true, message: 'All notifications marked as read' }
      };

      axiosInstance.put.mockResolvedValue(mockResponse);

      const result = await markAllNotificationsRead();

      expect(axiosInstance.put).toHaveBeenCalledWith('/notifications/read-all');
      expect(result.data.success).toBe(true);
    });

    it('should handle when no notifications to mark', async () => {
      const mockResponse = {
        data: { success: true, message: 'No unread notifications' }
      };

      axiosInstance.put.mockResolvedValue(mockResponse);

      const result = await markAllNotificationsRead();

      expect(result.data.success).toBe(true);
    });
  });

  // ==================== DELETE NOTIFICATION ====================
  describe('deleteNotification', () => {
    it('should delete notification successfully', async () => {
      const notificationId = 'notif-1';

      const mockResponse = { data: { success: true, message: 'Notification deleted' } };

      axiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await deleteNotification(notificationId);

      expect(axiosInstance.delete).toHaveBeenCalledWith(`/notifications/${notificationId}`);
      expect(result.data.success).toBe(true);
    });

    it('should handle notification not found', async () => {
      const notificationId = 'invalid';

      const mockError = {
        response: { status: 404, data: { message: 'Notification not found' } }
      };

      axiosInstance.delete.mockRejectedValue(mockError);

      await expect(deleteNotification(notificationId)).rejects.toEqual(mockError);
    });

    it('should reject deleting other user notification', async () => {
      const notificationId = 'other-notif';

      const mockError = {
        response: { status: 403, data: { message: 'Not authorized' } }
      };

      axiosInstance.delete.mockRejectedValue(mockError);

      await expect(deleteNotification(notificationId)).rejects.toEqual(mockError);
    });
  });
});
