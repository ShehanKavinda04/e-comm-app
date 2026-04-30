import api from './api';

export const getUserOrders = async (statusFilter = '') => {
  try {
    const url = statusFilter && statusFilter !== 'all' 
      ? `/orders?status=${statusFilter}`
      : '/orders';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    throw error;
  }
};
export const getOrderDetails = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch order details:', error);
    throw error;
  }
};
