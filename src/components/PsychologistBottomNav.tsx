import { useNavigate, useLocation } from 'react-router-dom';
import { Activity, Users, Calendar, BookOpen, DollarSign } from 'lucide-react';

export function PsychologistBottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/psicologo/dashboard' && location.pathname === '/psicologo/dashboard') return true;
        if (path !== '/psicologo/dashboard' && location.pathname.startsWith(path)) return true;
        return false;
    };

    // Only show on psychologist routes, and not on desktop (managed by CSS)
    if (!location.pathname.startsWith('/psicologo')) return null;

    return (
        <div className="bottom-nav psychologist-mobile-nav">
            <button className={`nav-item ${isActive('/psicologo/dashboard') ? 'active' : ''}`} onClick={() => navigate('/psicologo/dashboard')}>
                <Activity size={24} />
                <span>Painel</span>
            </button>
            <button className={`nav-item ${isActive('/psicologo/pacientes') ? 'active' : ''}`} onClick={() => navigate('/psicologo/pacientes')}>
                <Users size={24} />
                <span>Pacientes</span>
            </button>
            <button className={`nav-item ${isActive('/psicologo/agenda') ? 'active' : ''}`} onClick={() => navigate('/psicologo/agenda')}>
                <Calendar size={24} />
                <span>Agenda</span>
            </button>
            <button className={`nav-item ${isActive('/psicologo/blog') ? 'active' : ''}`} onClick={() => navigate('/psicologo/blog')}>
                <BookOpen size={24} />
                <span>Blog</span>
            </button>
            <button className={`nav-item ${isActive('/psicologo/financeiro') ? 'active' : ''}`} onClick={() => navigate('/psicologo/financeiro')}>
                <DollarSign size={24} />
                <span>$</span>
            </button>
        </div>
    );
}
