import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, Calendar as CalendarIcon, LogOut, DollarSign, User, Brain, BookOpen } from 'lucide-react';
import { getProxyUrl } from '../utils/fileProxy';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationCenter } from './NotificationCenter';
import toast from 'react-hot-toast';

export function PsychologistSidebar({ activePath }: { activePath: string }) {
    const navigate = useNavigate();

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const name = user?.name || 'Psicóloga';

    const { notifications, unreadCount, markAsRead } = useNotifications();
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <div className="psi-sidebar" style={{ position: 'relative' }}>
                <div 
                    onClick={() => setShowNotifications(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', position: 'relative' }}
                >
                    <div style={{ position: 'relative' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: 'var(--co-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', overflow: 'hidden', border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            {user?.avatarUrl ? (
                                <img src={getProxyUrl(user.avatarUrl)} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                name.charAt(0).toUpperCase()
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <div style={{ 
                                position: 'absolute', top: '-2px', right: '-2px', 
                                width: '14px', height: '14px', borderRadius: '50%', 
                                background: 'var(--co-action)', border: '2px solid white',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }} />
                        )}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.1rem', margin: 0 }}>{name}</h2>
                        <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0 }}>Psicóloga Clínica</p>
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
                    <Users size={20} /> Gestão de Usuários
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
                <button
                    onClick={() => navigate('/psicologo/financeiro')}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', background: activePath === 'financeiro' ? 'var(--co-serene-blue)' : 'transparent', color: activePath === 'financeiro' ? 'var(--co-text-dark)' : 'var(--co-text-muted)', fontWeight: activePath === 'financeiro' ? 600 : 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                >
                    <DollarSign size={20} /> Financeiro
                </button>
                <button
                    onClick={() => navigate('/psicologo/perfil')}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', background: activePath === 'perfil' ? 'var(--co-serene-blue)' : 'transparent', color: activePath === 'perfil' ? 'var(--co-text-dark)' : 'var(--co-text-muted)', fontWeight: activePath === 'perfil' ? 600 : 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                >
                    <User size={20} /> Meu Perfil
                </button>
            </nav>

            <button
                onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/');
                    toast.success("Sessão encerrada");
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', background: 'transparent', color: 'var(--co-danger-text)', fontWeight: 500, cursor: 'pointer', textAlign: 'left', marginTop: 'auto' }}
            >
                <LogOut size={20} /> Sair
            </button>

            <NotificationCenter 
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                notifications={notifications}
                onMarkAsRead={markAsRead}
            />
        </div>
    );
}
