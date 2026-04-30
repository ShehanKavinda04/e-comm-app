import api from './api';

export const getUserAddress = async () => {
    try {
        const response = await api.get('/user/address');
        return response.data; // Might be empty if never configured
    } catch (error) {
        console.error('Failed to fetch user address:', error);
        throw error;
    }
}

export const saveUserAddress = async (addressData) => {
    try {
        const response = await api.post('/user/address', addressData);
        return response.data;
    } catch (error) {
        console.error('Failed to save user address:', error);
        throw error;
    }
}
