import { useState, useEffect, useCallback } from 'react';
import * as messagesAPI from '../api/messagesAPI';

export const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = () => {
    messagesAPI.getConversationsList()
      .then(res => setConversations(res.data.conversations || res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return { conversations, loading, refetch: fetchConversations };
};

export const useMessages = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    if (!conversationId) return;
    messagesAPI.getMessages(conversationId)
      .then(res => setMessages(res.data.messages || res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  return { messages, loading, refetch: fetchMessages };
};

export const useUnreadCount = () => {
  const [count, setCount] = useState(0);

  const fetchCount = () => {
    messagesAPI.getUnreadCount()
      .then(res => setCount(res.data.unreadCount || 0));
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return { count };
};
