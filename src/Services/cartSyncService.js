import api from './api';

const isRealToken = () => {
  const token = localStorage.getItem('token');
  return !!token && token.length > 20; // Correct JWT-like check
};

export const addToBackendCart = async (productId, quantity = 1) => {
  if (!isRealToken()) return; // Skip for demo/mock users
  try {
    await api.post('/user/cart/add', { productId, quantity });
  } catch (error) {
    console.error('Failed to sync cart item to backend:', error);
  }
};

export const removeFromBackendCart = async (productId) => {
  if (!isRealToken()) return;
  try {
    await api.delete(`/user/cart/remove/${productId}`);
  } catch (error) {
    console.error('Failed to remove cart item from backend:', error);
  }
};

export const clearBackendCart = async () => {
  if (!isRealToken()) return;
  try {
    await api.delete('/user/cart/clear');
  } catch (error) {
    console.error('Failed to clear backend cart:', error);
  }
};

export const updateBackendCartQuantity = async (productId, quantity) => {
  if (!isRealToken()) return;
  try {
    await api.put('/user/cart/update', { productId, quantity });
  } catch (error) {
    console.error('Failed to update cart quantity in backend:', error);
  }
};

export const getBackendCart = async () => {
  if (!isRealToken()) return null;
  try {
    const response = await api.get('/user/cart');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch cart from backend:', error);
    return null;
  }
};
