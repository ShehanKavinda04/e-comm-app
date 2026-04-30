import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getUserNotifications, markNotificationAsReadBackend, markAllNotificationsAsReadBackend } from '../Services/notificationService';
import { AuthContext } from './AuthContext';
import { toast } from 'react-hot-toast';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const prevNotificationsRef = useRef([]);

    const isRealToken = () => {
        const token = localStorage.getItem('token');
        return !!token && token.length > 20;
    };

    const fetchNotifications = async (silent = false) => {
        if (!user || !isRealToken()) return;

        try {
            const data = await getUserNotifications();
            const sortedData = data || [];
            
            // Check for new notifications to show toast
            if (!silent && sortedData.length > prevNotificationsRef.current.length) {
                const newOnes = sortedData.filter(n => 
                    n.unread && !prevNotificationsRef.current.find(prev => prev.id === n.id)
                );
                
                newOnes.forEach(n => {
                    toast.success(`Notification: ${n.title}`, {
                        duration: 4000,
                        position: 'top-right',
                        icon: '🔔'
                    });
                });
            }

            setNotifications(sortedData);
            setUnreadCount(sortedData.filter(n => n.unread).length);
            prevNotificationsRef.current = sortedData;
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        if (!user || !isRealToken()) {
            setNotifications([]);
            setUnreadCount(0);
            prevNotificationsRef.current = [];
            return;
        }

        fetchNotifications(true); // Initial fetch

        // Setup real-time notifications via SSE
        const sseUrl = "/api/ads/stream";
        const eventSource = new EventSource(sseUrl);

        eventSource.addEventListener("NOTIFICATION_UPDATE", (event) => {
            console.log("Real-time notification update received via SSE");
            fetchNotifications(); // Fetch new notifications and show toast if needed
        });

        eventSource.onerror = (err) => {
            console.error("SSE Connection Error for Notifications:", err);
            eventSource.close();
            // Optional: Backup polling if SSE fails, but current architecture relies on SSE
        };

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [user]);

    const markRead = async (id) => {
        try {
            await markNotificationAsReadBackend(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllRead = async () => {
        try {
            await markAllNotificationsAsReadBackend();
            setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const refresh = () => fetchNotifications(true);

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            unreadCount, 
            markRead, 
            markAllRead, 
            refresh 
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
