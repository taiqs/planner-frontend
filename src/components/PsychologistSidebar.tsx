import { useNavigate } from 'react-router-dom';
import { Activity, Users, Calendar as CalendarIcon, LogOut, BookOpen, Brain } from 'lucide-react';

export function PsychologistSidebar({ activePath }: { activePath: string }) {
    const navigate = useNavigate();

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const name = user?.name || 'Psicóloga';

    return (
        <div className="psi-sidebar">
            <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
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

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <button
                    onClick={() => navigate('/psicologo/dashboard')}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', background: activePath === 'dashboard' ? 'var(--co-serene-blue)' : 'transparent', color: activePath === 'dashboard' ? 'var(--co-text-dark)' : 'var(--co-text-muted)', fontWeight: activePath === 'dashboard' ? 600 : 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                >
                    <Activity size={20} /> Dashboard
                </button>
                <button
                    onClick={() => navigate('/psicologo/pacientes')}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', background: activePath === '/psicologo/pacientes' ? 'var(--co-serene-blue)' : 'transparent', color: activePath === '/psicologo/pacientes' ? 'var(--co-text-dark)' : 'var(--co-text-muted)', fontWeight: activePath === '/psicologo/pacientes' ? 600 : 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
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
