import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useConversations, useMessages, useUnreadCount } from '../../app/hooks/useMessages.js';

// Mock messages API
vi.mock('../../app/api/messagesAPI.js', () => ({
  getConversationsList: vi.fn(),
  getMessages: vi.fn(),
  getUnreadCount: vi.fn(),
}));

import * as messagesAPI from '../../app/api/messagesAPI.js';

describe('useMessages Hook Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.useRealTimers();
  });

  // ==================== USECONVERSATIONS ====================
  describe('useConversations', () => {
    it('should fetch conversations on mount', async () => {
      const mockConversations = [
        { id: 'conv-1', participantName: 'John' },
        { id: 'conv-2', participantName: 'Jane' }
      ];

      messagesAPI.getConversationsList.mockResolvedValue({
        data: { conversations: mockConversations }
      });

      const { result } = renderHook(() => useConversations());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.conversations).toEqual(mockConversations);
    });

    it('should handle fetch error', async () => {
      messagesAPI.getConversationsList.mockRejectedValue(new Error('Failed'));

      const { result } = renderHook(() => useConversations());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.conversations).toEqual([]);
    });
  });

  // ==================== USEMESSAGES ====================
  describe('useMessages', () => {
    it('should fetch messages for conversation', async () => {
      const mockMessages = [
        { id: 'msg-1', content: 'Hello' },
        { id: 'msg-2', content: 'Hi there' }
      ];

      messagesAPI.getMessages.mockResolvedValue({
        data: { messages: mockMessages }
      });

      const { result } = renderHook(() => useMessages('conv-1'));

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.messages).toEqual(mockMessages);
    });

    it('should not fetch when conversationId is null', () => {
      const { result } = renderHook(() => useMessages(null));

      expect(result.current.loading).toBe(false);
      expect(messagesAPI.getMessages).not.toHaveBeenCalled();
    });
  });

  // ==================== USEUNREADCOUNT ====================
  describe('useUnreadCount', () => {
    it('should fetch unread count on mount', async () => {
      messagesAPI.getUnreadCount.mockResolvedValue({
        data: { unreadCount: 5 }
      });

      const { result } = renderHook(() => useUnreadCount());

      // Wait for initial fetch
      await act(async () => {
        vi.runAllTimers();
      });

      expect(result.current.count).toBe(5);
    });

    it('should poll for unread count every 30 seconds', async () => {
      messagesAPI.getUnreadCount
        .mockResolvedValueOnce({ data: { unreadCount: 5 } })
        .mockResolvedValueOnce({ data: { unreadCount: 3 } });

      const { result } = renderHook(() => useUnreadCount());

      await act(async () => {
        vi.runAllTimers();
      });

      expect(result.current.count).toBe(5);

      await act(async () => {
        vi.advanceTimersByTime(30000);
      });

      expect(messagesAPI.getUnreadCount).toHaveBeenCalledTimes(2);
    });
  });
});
