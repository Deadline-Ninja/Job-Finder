import * as notificationsAPI from '../api/notificationsAPI';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = () => {
    notificationsAPI.getNotifications()
      .then(res => {
        const data = res.data.notifications || res.data;
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();

    if (user) {
      const socket = io(SOCKET_URL);
      
      socket.on('connect', () => {
        socket.emit('join', user._id);
      });

      socket.on('newNotification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        toast.info(notification.title, {
          description: notification.message
        });
      });

      socket.on('newMessage', (message) => {
        toast.success(`New Message from ${message.sender.name}`, {
          description: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')
        });
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const markAsRead = async (id) => {
    await notificationsAPI.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    await notificationsAPI.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = async (id) => {
    await notificationsAPI.deleteNotification(id);
    setNotifications(prev => prev.filter(n => n._id !== id));
  };

  return { notifications, loading, unreadCount, markAsRead, markAllAsRead, deleteNotification, refetch: fetchNotifications };
};
