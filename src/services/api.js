import axios from 'axios';
import { API_DELAY } from '../utils/constants';

const api = axios.create({
    baseURL: '/api',
});

// Mock Interceptor
api.interceptors.request.use(async (config) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, API_DELAY));

    // Return a mock response instead of letting the request go to the network
    return config;
});

// Error handling interceptor
api.interceptors.response.use(
    response => response,
    error => {
        const message = error.response?.data?.message || 'An unexpected error occurred';
        return Promise.reject(new Error(message));
    }
);

export default api;
