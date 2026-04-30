import api from './api';

/**
 * Fetches the user's saved payment details (Card or KOKO).
 */
export const getUserPaymentDetails = async () => {
    try {
        const response = await api.get('/user/payment-method');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch payment details:', error);
        throw error;
    }
};

/**
 * Saves or updates the user's payment details.
 * @param {Object} paymentData - The CardDetailsDTO data.
 */
export const saveUserPaymentDetails = async (paymentData) => {
    try {
        const response = await api.post('/user/payment-method', paymentData);
        return response.data;
    } catch (error) {
        console.error('Failed to save payment details:', error);
        throw error;
    }
};
