import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, BellRing, Check, X, LogOut } from 'lucide-react';
import api from '../services/api';
import { getProxyUrl } from '../utils/fileProxy';

export function PsychologistMobileHeader() {
    const location = useLocation();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            // O backend retorna { notifications: [], unreadCount: X }
            setNotifications(res.data.notifications || []);
        } catch (error) {
            console.error("Erro ao buscar notificações", error);
        }
    };

    useEffect(() => {
        if (location.pathname.startsWith('/psicologo')) {
            fetchNotifications();
        }
    }, [location.pathname]);

    const handleMarkAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (!location.pathname.startsWith('/psicologo')) return null;

    return (
        <div className="psi-mobile-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '16px', backgroundColor: 'var(--co-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', overflow: 'hidden', border: '1px solid white' }}>
                    {user?.avatarUrl ? <img src={getProxyUrl(user.avatarUrl)} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.name?.charAt(0)}
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>Dra. Tailiny Quirino</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    style={{ position: 'relative', border: 'none', background: 'var(--co-white)', width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                >
                    {unreadCount > 0 ? <BellRing size={20} color="var(--co-action)" /> : <Bell size={20} color="var(--co-text-muted)" />}
                    {unreadCount > 0 && (
                        <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--co-danger-text)', color: 'white', fontSize: '0.6rem', width: '16px', height: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid var(--co-primary-bg)' }}>
                            {unreadCount}
                        </span>
                    )}
                </button>

                <button 
                    onClick={handleLogout}
                    style={{ border: 'none', background: 'var(--co-danger)', color: 'var(--co-danger-text)', width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                    title="Sair"
                >
                    <LogOut size={20} />
                </button>
            </div>

            {showNotifications && (
                <div style={{ position: 'fixed', top: '70px', left: '16px', right: '16px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', zIndex: 200, maxHeight: '70vh', overflowY: 'auto', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', margin: 0 }}>Notificações</h3>
                        <button onClick={() => setShowNotifications(false)} style={{ background: 'none', border: 'none' }}><X size={18} /></button>
                    </div>
                    {notifications.length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: '#999', fontSize: '0.9rem' }}>Nenhuma notificação</div>
                    ) : (
                        notifications.map(n => (
                            <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f8f8f8', background: n.read ? 'white' : 'var(--co-lavender)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: n.read ? 600 : 700, fontSize: '0.85rem' }}>{n.title}</span>
                                    {!n.read && <button onClick={() => handleMarkAsRead(n.id)} style={{ background: 'none', border: 'none', color: 'var(--co-action)' }}><Check size={14} /></button>}
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#555', margin: 0 }}>{n.content}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
