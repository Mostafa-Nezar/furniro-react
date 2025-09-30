import { createContext, useContext, useEffect, useState } from 'react';
import { io } from "socket.io-client";

const SocketContext = createContext();

const API = "https://furniro-back-production.up.railway.app/api/notifications";

export const useSocket = ( ) => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const getToken = () => localStorage.getItem("token");
  const fetchNotifications = async () => {
    try {
      const token =  getToken();
      const userString = localStorage.getItem("user");
      if (!token || !userString) return;

      const user = JSON.parse(userString);
      const res = await fetch(API, {headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }});

      if (res.ok) {
        const data = await res.json();
        const userNotifications = (data.notifications || []).filter(n => n.userId === user.id);
        setNotifications(userNotifications);
        setUnreadCount(userNotifications.filter(n => !n.read).length);
      }
    } catch (err) {
      console.error("Fetch notifications error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAllAsReadInDB = async () => {
      const token = getToken();
      await fetch(`${API}/mark-all-read`, { method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }});
      setUnreadCount(0);
  };

  const handleDeleteNotification = async (id) => {
    try {
      const token = getToken();
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n._id !== id));
      }
    } catch (err) {
      console.error("Delete notification error:", err);
    }
  };

  const formatDate = (str) => {
    const date = new Date(str);
    const now = new Date();
    const diff = (now - date) / 60000; 

    if (diff < 1) return "Just now";
    if (diff < 60) return `${Math.floor(diff)}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const initSocket = async () => {
      try {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');

        if (token && userString) {
          await fetchNotifications();

          const userData = JSON.parse(userString);
          const newSocket = io('https://furniro-back-production.up.railway.app', {
            auth: { token: token }
          } );

          newSocket.on('connect', () => {
            console.log('✅ Connected to socket server');
            setConnected(true);
            if (userData?.id) {
              newSocket.emit('join', userData.id);
            }
          });

          newSocket.on('disconnect', () => {
            console.log('❌ Disconnected from socket server');
            setConnected(false);
          });

          newSocket.on('newNotification', (notification) => {
            console.log('🔔 New notification received:', notification);
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
          });

          setSocket(newSocket);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Socket initialization error:", error);
        setLoading(false);
      }
    };

    initSocket();

    return () => {
      if (socket) {
        console.log('🔌 Disconnecting socket...');
        socket.disconnect();
      }
    };
  }, []);

  const value = {
    socket,
    connected,
    notifications,
    unreadCount,
    loading,
    refreshing,
    setNotifications,
    setUnreadCount,
    fetchNotifications,
    markAllAsReadInDB,
    handleDeleteNotification,
    formatDate,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
