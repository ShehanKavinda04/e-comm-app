import React, { useEffect, useState, useContext } from 'react';
import { getUserNotifications, markNotificationAsReadBackend, markAllNotificationsAsReadBackend, deleteNotificationBackend } from '../../../Services/notificationService';
import { useNotification } from '../../../Contexts/NotificationContext';
import { AuthContext } from '../../../Contexts/AuthContext';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const isRealToken = () => {
  const token = localStorage.getItem('token');
  return !!token && token.length > 20;
};

const UserNotifications = () => {
    const { user } = useContext(AuthContext);
    const { notifications, markRead, markAllRead } = useNotification();
    const [localNotifications, setLocalNotifications] = useState([]);

    useEffect(() => {
        setLocalNotifications(notifications);
    }, [notifications]);

    const handleMarkAllRead = async () => {
        markAllRead();
    };

    const handleMarkRead = async (id) => {
        markRead(id);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            await deleteNotificationBackend(id);
            setLocalNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error('Failed to delete notification', error);
        }
    };

    return (
        <div className="md:px-14 px-5 w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-black">
                    <NotificationsActiveIcon className="text-orange-600" />
                    Notifications
                </h2>
                <div className="flex gap-4">

                    <button
                        onClick={handleMarkAllRead}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                        Mark all as read
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow min-h-[400px]">
                {localNotifications.length > 0 ? (
                    localNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => handleMarkRead(notification.id)}
                            className={`p-4 border-b last:border-b-0 hover:bg-gray-50 transition cursor-pointer relative group ${notification.unread ? 'bg-blue-50/50' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1 pr-10">
                                <h3 className={`font-bold text-lg ${notification.unread ? 'text-black' : 'text-gray-800'}`}>
                                    {notification.title}
                                </h3>
                                <span className="text-sm text-gray-600 font-medium whitespace-nowrap ml-2">
                                    {notification.time}
                                </span>
                            </div>
                            <p className="text-base text-gray-800 leading-relaxed font-medium">
                                {notification.description}
                            </p>
                            <button
                                onClick={(e) => handleDelete(e, notification.id)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-red-50"
                                title="Delete Notification"
                            >
                                <DeleteOutlineIcon />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                        <NotificationsActiveIcon sx={{ fontSize: 60, opacity: 0.5, marginBottom: 2 }} />
                        <p>No notifications yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserNotifications;
