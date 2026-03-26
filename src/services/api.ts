import axios from 'axios';

const api = axios.create({
    baseURL: 'https://planner-backend-ecru.vercel.app/api', // URL do nosso backend
});

// Interceptor para injetar o Token JWT em todas as requisições (Exceto Login e Registro)
api.interceptors.request.use((config) => {
    const isAuthRoute = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');

    if (!isAuthRoute) {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;
