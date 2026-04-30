import api from './api';

export const getUserWishlist = async () => {
  try {
    const response = await api.get('/user/wishlist');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch wishlist:', error);
    throw error;
  }
};

export const removeFromWishlistBackend = async (productId) => {
  try {
    const response = await api.delete(`/user/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to remove item from wishlist:', error);
    throw error;
  }
};
export const toggleWishlistBackend = async (productId) => {
  try {
    const response = await api.post(`/user/wishlist/${productId}/toggle`);
    return response.data; // { favorited: true/false }
  } catch (error) {
    console.error('Failed to toggle wishlist:', error);
    throw error;
  }
};
