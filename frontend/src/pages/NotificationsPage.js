import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { 
  Bell, 
  BellOff, 
  Info, 
  AlertTriangle, 
  Clock,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

const notificationIcons = {
  info: { icon: Info, bg: "bg-blue-100", color: "text-blue-600" },
  warning: { icon: AlertTriangle, bg: "bg-amber-100", color: "text-amber-600" },
  reminder: { icon: Clock, bg: "bg-purple-100", color: "text-purple-600" },
  success: { icon: CheckCircle2, bg: "bg-emerald-100", color: "text-emerald-600" }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data);
    } catch (error) {
      // If no notifications, that's okay
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const markAllRead = async () => {
    try {
      await api.post("/notifications/mark-all-read");
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-slate-400">Loading notifications...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div data-testid="notifications-page" className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-slate-900">
              Notifications
            </h1>
            <p className="text-slate-600 mt-1">
              {unreadCount > 0 
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : "You're all caught up!"}
            </p>
          </div>
          
          {notifications.length > 0 && unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllRead}
              data-testid="mark-all-read-btn"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const config = notificationIcons[notification.type] || notificationIcons.info;
              const Icon = config.icon;
              
              return (
                <div 
                  key={notification.id}
                  className={`bg-white rounded-lg border p-4 transition-all ${
                    notification.is_read 
                      ? 'border-slate-200' 
                      : 'border-teal-200 bg-teal-50/30'
                  }`}
                  data-testid={`notification-${notification.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-medium ${notification.is_read ? 'text-slate-700' : 'text-slate-900'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-slate-500 flex-shrink-0">
                          {new Date(notification.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                      <p className={`text-sm mt-1 ${notification.is_read ? 'text-slate-500' : 'text-slate-600'}`}>
                        {notification.message}
                      </p>
                      
                      {!notification.is_read && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2 -ml-2 text-teal-600 hover:text-teal-700"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <BellOff className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-heading font-medium text-slate-900 mb-2">No notifications yet</h3>
            <p className="text-slate-600 text-sm">
              We'll notify you about compliance updates, review reminders, and more.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
