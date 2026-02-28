import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1.0';

// Create base axios instance
export const api = axios.create({
    baseURL: BASE_URL,
});

/**
 * Hook to get an axios instance that automatically attaches the Clerk JWT token
 * and the user's Clerk ID in request headers.
 */
export const useApiClient = () => {
    const { getToken, userId } = useAuth();

    const authApi = axios.create({ baseURL: BASE_URL });

    authApi.interceptors.request.use(async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (userId) {
            config.headers['X-Clerk-User-Id'] = userId;
        }
        return config;
    });

    return authApi;
};

// ---- File API ----
export const fileApi = {
    upload: (authApi, file) => {
        const form = new FormData();
        form.append('file', file);
        return authApi.post('/files/upload', form);
    },
    list: (authApi) => authApi.get('/files'),
    share: (authApi, fileId) => authApi.post(`/files/${fileId}/share`),
    unshare: (authApi, fileId) => authApi.post(`/files/${fileId}/unshare`),
    delete: (authApi, fileId) => authApi.delete(`/files/${fileId}`),
};

// ---- Public API (no auth) ----
export const publicApi = {
    getSharedFile: (shareToken) => api.get(`/public/files/${shareToken}`),
};

// ---- Profile API ----
export const profileApi = {
    register: (authApi, profileData) => authApi.post('/register', profileData),
};

// ---- Payment API ----
export const paymentApi = {
    createOrder: (authApi, planName) => authApi.post('/payments/mock-order', { planName }),
    verify: (authApi, orderId, planName) => authApi.post('/payments/mock-verify', { orderId, planName }),
};
