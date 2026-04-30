import api from './api';

export const checkSellerEligibility = async () => {
    const response = await api.get('/seller/eligibility');
    return response.data;
};

export const getSellerStep1 = async () => {
    const response = await api.get('/seller/onboarding/step1');
    return response.data;
};

export const submitSellerStep1 = async (data) => {
    const response = await api.post('/seller/onboarding/step1', data);
    return response.data;
};

export const getSellerStep2 = async () => {
    const response = await api.get('/seller/onboarding/step2');
    return response.data;
};

export const submitSellerStep2 = async (data) => {
    const response = await api.post('/seller/onboarding/step2', data);
    return response.data;
};

export const getSellerStep3 = async () => {
    const response = await api.get('/seller/onboarding/step3');
    return response.data;
};

export const submitSellerStep3 = async (formData) => {
    const response = await api.post('/seller/onboarding/step3', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const getSellerStep4 = async () => {
    const response = await api.get('/seller/onboarding/step4');
    return response.data;
};

export const submitSellerStep4 = async (data) => {
    const response = await api.post('/seller/onboarding/step4', data);
    return response.data;
};

export const submitFullSellerApplication = async (formData) => {
    const response = await api.post('/seller/onboarding/full', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};
