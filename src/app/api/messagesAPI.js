import axiosInstance from './axiosInstance';

export const getConversations = () => axiosInstance.get('/messages/conversations');
export const getMessages = (conversationId, params = {}) => axiosInstance.get(`/messages/${conversationId}`, { params });
export const sendMessage = (data) => axiosInstance.post('/messages', data);
export const markAsRead = (id) => axiosInstance.put(`/messages/${id}/read`);
export const getUnreadCount = () => axiosInstance.get('/messages/unread/count');

// For backwards compatibility
export default {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  getUnreadCount
};
