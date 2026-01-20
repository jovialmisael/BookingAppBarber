import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your local IP address for physical device testing
// For Android Emulator match the IP 10.0.2.2 usually works
// For iOS Simulator localhost works
export const API_URL = 'http://192.168.110.57:3001';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
};

export const servicesService = {
    getAll: () => api.get('/services'),
    getById: (id: number) => api.get(`/services/${id}`),
};

export const bookingService = {
    create: (data: any) => api.post('/bookings', data),
    getMyBookings: () => api.get('/bookings/my'),
};

export default api;
