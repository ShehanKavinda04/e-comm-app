import api from './api';

export const getUserNotifications = async () => {
    try {
        const response = await api.get('/notifications');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch notifications:', error);
        throw error;
    }
};

export const markNotificationAsReadBackend = async (id) => {
    try {
        const response = await api.post(`/notifications/${id}/read`);
        return response.data;
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
        throw error;
    }
};

export const markAllNotificationsAsReadBackend = async () => {
    try {
        const response = await api.post('/notifications/mark-all-read');
        return response.data;
    } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
        throw error;
    }
};

export const deleteNotificationBackend = async (id) => {
    try {
        const response = await api.delete(`/notifications/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to delete notification:', error);
        throw error;
    }
};
