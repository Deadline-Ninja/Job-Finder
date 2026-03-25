import axiosInstance from './axiosInstance';

export const getNotifications = (params = {}) => axiosInstance.get('/notifications', { params });
export const getUnreadCount = () => axiosInstance.get('/notifications/unread-count');
export const markAsRead = (id) => axiosInstance.put(`/notifications/${id}/read`);
export const markAllAsRead = () => axiosInstance.put('/notifications/read-all');
export const deleteNotification = (id) => axiosInstance.delete(`/notifications/${id}`);
export const clearAll = () => axiosInstance.delete('/notifications');

// For backwards compatibility
export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAll
};
