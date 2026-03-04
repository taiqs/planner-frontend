import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, Calendar as CalendarIcon, LogOut, BookOpen, Brain, Bell, BellRing, Check, X } from 'lucide-react';
import api from '../services/api';

export function PsychologistSidebar({ activePath }: { activePath: string }) {
    const navigate = useNavigate();

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const name = user?.name || 'Psicóloga';

    const [notifications, setNotifications] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.error("Erro ao buscar notificações", error);
        }
    };

    useEffect(() => {
        if (user?.role === 'PSYCHOLOGIST') {
            fetchNotifications();
            // Polling simples a cada 5 min (300000ms) se desejado:
            // const interval = setInterval(fetchNotifications, 300000);
            // return () => clearInterval(interval);
        }
    }, [user?.role]);

    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error("Erro ao marcar como lida", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Erro ao marcar todas como lidas", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="psi-sidebar" style={{ position: 'relative' }}>
            <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: 'var(--co-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', overflow: 'hidden' }}>
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.1rem' }}>{name}</h2>
                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>Psicóloga Clínica</p>
                    </div>
                </div>

                {/* Notifications Bell */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '20px', transition: 'background 0.2s', backgroundColor: showDropdown ? 'var(--co-lavender)' : 'transparent' }}
                    >
                        {unreadCount > 0 ? <BellRing size={20} color="var(--co-primary)" /> : <Bell size={20} color="var(--co-text-muted)" />}
                        {unreadCount > 0 && (
                            <span style={{ position: 'absolute', top: '0', right: '0', background: 'var(--co-danger)', color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {showDropdown && (
                        <div style={{ position: 'absolute', top: '48px', left: '100%', marginLeft: '12px', width: '360px', background: 'var(--co-white)', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', zIndex: 100, border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', maxHeight: '500px' }}>
                            <div style={{ padding: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Notificações</h3>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {unreadCount > 0 && (
                                        <button onClick={handleMarkAllRead} style={{ background: 'transparent', border: 'none', color: 'var(--co-action)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>Lida Tudo</button>
                                    )}
                                    <button onClick={() => setShowDropdown(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}><X size={18} className="text-muted" /></button>
                                </div>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                                {notifications.length === 0 ? (
                                    <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Nenhuma notificação por enquanto.</p>
                                    </div>
                                ) : (
                                    notifications.map(notif => (
                                        <div key={notif.id} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.02)', background: notif.read ? 'transparent' : 'var(--co-lavender)', display: 'flex', gap: '12px', position: 'relative' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: notif.read ? 'transparent' : 'var(--co-primary)', flexShrink: 0, marginTop: '6px' }} />
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: '0.9rem', fontWeight: notif.read ? 500 : 700, margin: '0 0 4px 0' }}>{notif.title}</p>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--co-text-dark)', margin: 0, whiteSpace: 'pre-wrap' }}>{notif.content}</p>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--co-text-muted)', display: 'block', marginTop: '6px' }}>{new Date(notif.createdAt).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            {!notif.read && (
                                                <button onClick={(e) => handleMarkAsRead(notif.id, e)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--co-text-muted)', display: 'flex', padding: '4px', height: 'fit-content' }} aria-label="Marcar como lida" title="Marcar como lida">
                                                    <Check size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <button
                    onClick={() => navigate('/psicologo/dashboard')}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', background: activePath === 'dashboard' ? 'var(--co-serene-blue)' : 'transparent', color: activePath === 'dashboard' ? 'var(--co-text-dark)' : 'var(--co-text-muted)', fontWeight: activePath === 'dashboard' ? 600 : 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                >
                    <Activity size={20} /> Dashboard
                </button>
                <button
                    onClick={() => navigate('/psicologo/pacientes')}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', background: activePath === '/psicologo/pacientes' || activePath === 'pacientes' ? 'var(--co-serene-blue)' : 'transparent', color: activePath === '/psicologo/pacientes' || activePath === 'pacientes' ? 'var(--co-text-dark)' : 'var(--co-text-muted)', fontWeight: activePath === '/psicologo/pacientes' || activePath === 'pacientes' ? 600 : 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                >
                    <Users size={20} /> Prontuários
                </button>
                <button
                    onClick={() => navigate('/psicologo/avaliacoes')}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', background: activePath === '/psicologo/avaliacoes' ? 'var(--co-serene-blue)' : 'transparent', color: activePath === '/psicologo/avaliacoes' ? 'var(--co-text-dark)' : 'var(--co-text-muted)', fontWeight: activePath === '/psicologo/avaliacoes' ? 600 : 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                >
                    <Brain size={20} /> Avaliações / Leads
                </button>
                <button
                    onClick={() => navigate('/psicologo/agenda')}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', background: activePath === '/psicologo/agenda' ? 'var(--co-serene-blue)' : 'transparent', color: activePath === '/psicologo/agenda' ? 'var(--co-text-dark)' : 'var(--co-text-muted)', fontWeight: activePath === '/psicologo/agenda' ? 600 : 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                >
                    <CalendarIcon size={20} /> Agenda
                </button>
                <button
                    onClick={() => navigate('/psicologo/blog')}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', background: activePath === '/psicologo/blog' ? 'var(--co-serene-blue)' : 'transparent', color: activePath === '/psicologo/blog' ? 'var(--co-text-dark)' : 'var(--co-text-muted)', fontWeight: activePath === '/psicologo/blog' ? 600 : 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                >
                    <BookOpen size={20} /> Publicações
                </button>
            </nav>

            <button
                onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/');
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', background: 'transparent', color: 'var(--co-danger-text)', fontWeight: 500, cursor: 'pointer', textAlign: 'left', marginTop: 'auto' }}
            >
                <LogOut size={20} /> Sair
            </button>
        </div>
    );
}
