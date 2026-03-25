import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getConversations,
  getConversationsList,
  getUnreadCount,
  sendMessage,
  getMessages,
  markMessageRead
} from '../../app/api/messagesAPI.js';

vi.mock('../../app/api/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  }
}));

import axiosInstance from '../../app/api/axiosInstance.js';

describe('Messages API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue('mock-token');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ==================== GET CONVERSATIONS ====================
  describe('getConversations', () => {
    it('should fetch all conversations', async () => {
      const mockResponse = {
        data: {
          success: true,
          conversations: [
            { id: 'conv-1', participant: { name: 'John' }, lastMessage: 'Hello' },
            { id: 'conv-2', participant: { name: 'Jane' }, lastMessage: 'Hi' }
          ]
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getConversations();

      expect(axiosInstance.get).toHaveBeenCalledWith('/messages');
      expect(result.data.conversations).toHaveLength(2);
    });

    it('should require authentication', async () => {
      localStorage.getItem.mockReturnValue(null);

      const mockError = {
        response: { status: 401, data: { message: 'Authentication required' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getConversations()).rejects.toEqual(mockError);
    });
  });

  // ==================== GET CONVERSATIONS LIST ====================
  describe('getConversationsList', () => {
    it('should fetch conversations list', async () => {
      const mockResponse = {
        data: {
          success: true,
          conversations: [
            { id: 'conv-1', participantName: 'John Doe', lastMessage: 'Hello', unreadCount: 2 }
          ]
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getConversationsList();

      expect(axiosInstance.get).toHaveBeenCalledWith('/messages/conversations');
      expect(result.data.conversations).toHaveLength(1);
    });
  });

  // ==================== GET UNREAD COUNT ====================
  describe('getUnreadCount', () => {
    it('should fetch unread message count', async () => {
      const mockResponse = {
        data: { success: true, unreadCount: 5 }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getUnreadCount();

      expect(axiosInstance.get).toHaveBeenCalledWith('/messages/unread/count');
      expect(result.data.unreadCount).toBe(5);
    });

    it('should return zero when no unread messages', async () => {
      const mockResponse = {
        data: { success: true, unreadCount: 0 }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getUnreadCount();

      expect(result.data.unreadCount).toBe(0);
    });
  });

  // ==================== SEND MESSAGE ====================
  describe('sendMessage', () => {
    it('should send a message successfully', async () => {
      const messageData = {
        recipientId: 'user-2',
        content: 'Hello, are you interested in this job?'
      };

      const mockResponse = {
        data: {
          success: true,
          message: {
            id: 'msg-1',
            senderId: 'user-1',
            recipientId: messageData.recipientId,
            content: messageData.content,
            sentAt: new Date().toISOString()
          }
        }
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await sendMessage(messageData);

      expect(axiosInstance.post).toHaveBeenCalledWith('/messages', messageData);
      expect(result.data.success).toBe(true);
    });

    it('should reject sending to blocked user', async () => {
      const messageData = { recipientId: 'blocked-user', content: 'Hello' };

      const mockError = {
        response: { status: 403, data: { message: 'You cannot message this user' } }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(sendMessage(messageData)).rejects.toEqual(mockError);
    });

    it('should reject empty message content', async () => {
      const messageData = { recipientId: 'user-2', content: '' };

      const mockError = {
        response: { status: 400, data: { message: 'Message content is required' } }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(sendMessage(messageData)).rejects.toEqual(mockError);
    });

    it('should reject sending message to self', async () => {
      const messageData = { recipientId: 'same-user', content: 'Hello' };

      const mockError = {
        response: { status: 400, data: { message: 'Cannot send message to yourself' } }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(sendMessage(messageData)).rejects.toEqual(mockError);
    });
  });

  // ==================== GET MESSAGES ====================
  describe('getMessages', () => {
    it('should fetch messages for a conversation', async () => {
      const conversationId = 'conv-1';

      const mockResponse = {
        data: {
          success: true,
          messages: [
            { id: 'msg-1', senderId: 'user-1', content: 'Hello' },
            { id: 'msg-2', senderId: 'user-2', content: 'Hi there' }
          ],
          total: 2
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getMessages(conversationId);

      expect(axiosInstance.get).toHaveBeenCalledWith(`/messages/${conversationId}`, { params: {} });
      expect(result.data.messages).toHaveLength(2);
    });

    it('should handle pagination for messages', async () => {
      const conversationId = 'conv-1';
      const params = { page: 1, limit: 20 };

      const mockResponse = {
        data: { success: true, messages: [], total: 0, page: 1 }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getMessages(conversationId, params);

      expect(result.data.page).toBe(1);
    });

    it('should handle conversation not found', async () => {
      const conversationId = 'invalid';

      const mockError = {
        response: { status: 404, data: { message: 'Conversation not found' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getMessages(conversationId)).rejects.toEqual(mockError);
    });

    it('should reject access to other conversation', async () => {
      const conversationId = 'other-conv';

      const mockError = {
        response: { status: 403, data: { message: 'Not authorized to view this conversation' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getMessages(conversationId)).rejects.toEqual(mockError);
    });
  });

  // ==================== MARK MESSAGE READ ====================
  describe('markMessageRead', () => {
    it('should mark message as read', async () => {
      const messageId = 'msg-1';

      const mockResponse = {
        data: { success: true, message: { id: messageId, isRead: true } }
      };

      axiosInstance.put.mockResolvedValue(mockResponse);

      const result = await markMessageRead(messageId);

      expect(axiosInstance.put).toHaveBeenCalledWith(`/messages/${messageId}/read`);
      expect(result.data.success).toBe(true);
    });

    it('should handle message not found', async () => {
      const messageId = 'invalid';

      const mockError = {
        response: { status: 404, data: { message: 'Message not found' } }
      };

      axiosInstance.put.mockRejectedValue(mockError);

      await expect(markMessageRead(messageId)).rejects.toEqual(mockError);
    });
  });
});
