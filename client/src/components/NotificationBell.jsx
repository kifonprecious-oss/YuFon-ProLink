import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, ShieldCheck, MessageSquare } from 'lucide-react';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  const userId = currentUser._id || currentUser.id;

  useEffect(() => {
    if (!userId) return;

    // Fetch existing notifications
    fetch(`${API_BASE_URL}/api/notifications/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNotifications(data);
      })
      .catch(err => console.error('Failed to load notifications:', err));

    // Connect to WebSocket for real-time notifications
    const socket = io(API_BASE_URL);
    socket.on(`notification_${userId}`, (newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
    });

    return () => socket.disconnect();
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-[#111622] hover:bg-slate-800 text-slate-300 border border-slate-800 p-2.5 rounded-2xl transition flex items-center justify-center shadow"
        title="Notifications"
      >
        <Bell className="h-4 w-4 text-emerald-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#111622] border border-slate-800 rounded-3xl shadow-2xl p-4 z-50 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">Notifications</h3>
            <span className="text-[10px] text-emerald-400 font-semibold">{unreadCount} Unread</span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  onClick={() => !notif.read && markAsRead(notif._id)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex gap-3 items-start ${
                    notif.read ? 'bg-[#0A0D14]/40 border-slate-800/60 opacity-70' : 'bg-[#0A0D14] border-emerald-500/40 shadow-md'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-white font-bold text-xs">{notif.title}</h4>
                    <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">{notif.message}</p>
                    <span className="text-[9px] text-slate-500 mt-1 block">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No notifications yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}