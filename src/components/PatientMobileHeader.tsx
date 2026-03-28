import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, BellRing, X, User as UserIcon } from 'lucide-react';
import api from '../services/api';
import { getProxyUrl } from '../utils/fileProxy';

export function PatientMobileHeader() {
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
        // Só busca se estiver logado e NÃO for rota de psicólogo
        if (user && !location.pathname.startsWith('/psicologo') && location.pathname !== '/' && location.pathname !== '/login') {
            fetchNotifications();
            
            // Polling simples (opcional, mas bom para UX)
            const interval = setInterval(fetchNotifications, 60000); 
            return () => clearInterval(interval);
        }
    }, [location.pathname, user?.id]);

    const handleMarkAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    // Não exibe na Landing, Login ou rotas de Psicólogo
    if (location.pathname === '/' || location.pathname === '/login' || location.pathname.startsWith('/psicologo')) return null;
    if (!user) return null;

    return (
        <div className="patient-mobile-header" style={{ position: 'sticky', top: 0, left: 0, right: 0, height: '64px', background: 'var(--co-white)', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 500 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} onClick={() => navigate('/perfil')}>
                <div style={{ width: '36px', height: '36px', borderRadius: '18px', backgroundColor: 'var(--co-lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', overflow: 'hidden', border: '1px solid white' }}>
                    {user?.avatarUrl ? <img src={getProxyUrl(user.avatarUrl)} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon size={18} color="var(--co-action)" />}
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--co-text-dark)' }}>Ponto e Vírgula</span>
            </div>

            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ position: 'relative', border: 'none', background: 'var(--co-white)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer' }}
            >
                {unreadCount > 0 ? <BellRing size={22} color="var(--co-action)" /> : <Bell size={22} color="var(--co-text-muted)" />}
                {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '2px', right: '2px', background: 'var(--co-danger-text)', color: 'white', fontSize: '0.65rem', minWidth: '18px', height: '18px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid white', padding: '0 4px' }}>
                        {unreadCount}
                    </span>
                )}
            </button>

            {showNotifications && (
                <div style={{ position: 'fixed', top: '75px', left: '16px', right: '16px', background: 'white', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', zIndex: 1000, maxHeight: '70vh', overflowY: 'auto', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>Minhas Notificações</h3>
                        <button onClick={() => setShowNotifications(false)} style={{ background: '#f5f5f5', border: 'none', borderRadius: '50%', padding: '6px' }}><X size={18} /></button>
                    </div>
                    {notifications.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#999', fontSize: '0.95rem' }}>
                            <Bell size={40} style={{ opacity: 0.1, marginBottom: '12px' }} />
                            <p>Tudo em ordem por aqui!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {notifications.map(n => (
                                <div 
                                    key={n.id} 
                                    style={{ padding: '16px 20px', borderBottom: '1px solid #f8f8f8', background: n.read ? 'white' : 'var(--co-lavender)', transition: 'background 0.2s' }}
                                    onClick={() => !n.read && handleMarkAsRead(n.id)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'flex-start' }}>
                                        <span style={{ fontWeight: n.read ? 600 : 800, fontSize: '0.9rem', color: 'var(--co-text-dark)', flex: 1, paddingRight: '12px' }}>{n.title}</span>
                                        {!n.read && <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: 'var(--co-action)', marginTop: '6px' }} />}
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--co-text-muted)', margin: 0, lineHeight: 1.4 }}>{n.content}</p>
                                    <span style={{ fontSize: '0.7rem', color: '#bbb', marginTop: '8px', display: 'block' }}>{new Date(n.createdAt).toLocaleDateString('pt-BR')}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
