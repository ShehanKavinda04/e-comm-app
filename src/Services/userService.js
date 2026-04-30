import api from './api';

export const getUserOverview = async () => {
  try {
    const response = await api.get('/user/overview');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user overview:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (formData) => {
  try {
    const response = await api.put('/user/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
};

export const deleteProfileImage = async () => {
  try {
    const response = await api.delete('/user/profile-image');
    return response.data;
  } catch (error) {
    console.error('Failed to delete profile image:', error);
    throw error;
  }
};
