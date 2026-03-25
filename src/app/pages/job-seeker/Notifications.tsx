import { useState, useEffect } from 'react';
import { Bell, Briefcase, MessageSquare, TrendingUp, Loader2, MoreHorizontal } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { mockNotifications } from '../../data/mockData';

export function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      setNotifications(mockNotifications.map(n => ({
        ...n,
        _id: n.id,
        createdAt: new Date().toISOString(),
        read: n.isRead
      })));
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'application': return Briefcase;
      case 'message': return MessageSquare;
      case 'alert': return TrendingUp;
      default: return Bell;
    }
  };

  return (
    <div className="bg-[#F4F2EE] min-h-screen">
      <div className="max-w-[1128px] mx-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Notifications List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[#0000000D] flex items-center justify-between">
              <h1 className="text-base font-semibold text-[#000000E0]">Notifications</h1>
              <div className="flex gap-4">
                <button className="text-sm font-semibold text-[#0A66C2] hover:underline">Mark all as read</button>
                <button className="text-sm font-semibold text-[#00000099] hover:text-[#000000E0]">Settings</button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#0A66C2]" />
              </div>
            ) : (
              <div className="divide-y divide-[#0000000D]">
                {notifications.length > 0 ? (
                  notifications.map((notification) => {
                    const Icon = getIcon(notification.type);
                    return (
                      <div 
                        key={notification._id}
                        className={`flex items-start gap-4 p-4 hover:bg-[#F3F2EF] cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50/30' : ''}`}
                      >
                        <div className="flex-shrink-0 pt-1">
                          <div className="w-12 h-12 bg-white rounded-none border border-[#00000014] flex items-center justify-center overflow-hidden">
                            <Icon className="w-6 h-6 text-[#0A66C2]" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notification.read ? 'font-semibold text-[#000000E0]' : 'text-[#000000E0]'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-[#00000099] mt-1">2h</p>
                        </div>
                        <div className="flex-shrink-0 self-center">
                          <button className="p-2 text-[#00000099] hover:bg-black/5 rounded-full">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center">
                    <Bell className="w-12 h-12 text-[#00000024] mx-auto mb-4" />
                    <p className="text-[#00000099]">You have no new notifications.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-lg border border-[#00000014] p-4 shadow-sm text-center">
            <h3 className="text-sm font-semibold text-[#000000E0] mb-2">Manage your Notifications</h3>
            <p className="text-xs text-[#00000099] mb-4">View and update your notification settings</p>
            <Button variant="outline" className="w-full rounded-full border-[#0A66C2] text-[#0A66C2] font-semibold h-8 text-xs">
              View settings
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
