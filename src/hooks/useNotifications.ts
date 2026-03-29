import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

export function useNotifications() {
    const location = useLocation();
    const [notifications, setNotifications] = useState<any[]>([]);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.notifications || []);
        } catch (error) {
            console.error("Erro ao buscar notificações", error);
        }
    }, [user?.id]);

    useEffect(() => {
        // Só busca se estiver logado e NÃO for Landing/Login
        const isAuthPage = location.pathname === '/' || location.pathname === '/login';
        
        if (user && !isAuthPage) {
            fetchNotifications();
            
            // Polling a cada 1 minuto
            const interval = setInterval(fetchNotifications, 60000); 
            return () => clearInterval(interval);
        }
    }, [location.pathname, user?.id, fetchNotifications]);

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error("Erro ao marcar como lida", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return {
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead
    };
}
