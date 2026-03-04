import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar as CalendarIcon, LockKeyhole, User } from 'lucide-react';

export function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    // Don't show nav on login, onboarding, landing, or psychologist areas
    if (['/', '/login', '/onboarding', '/breathe'].includes(location.pathname) || location.pathname.startsWith('/psicologo')) return null;

    return (
        <div className="bottom-nav">
            <button className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => navigate('/dashboard')}>
                <Home size={24} />
                <span>Início</span>
            </button>
            <button className={`nav-item ${isActive('/calendario') ? 'active' : ''}`} onClick={() => navigate('/calendario')}>
                <CalendarIcon size={24} />
                <span>Calendário</span>
            </button>
            <button className={`nav-item ${isActive('/cofre') ? 'active' : ''}`} onClick={() => navigate('/cofre')}>
                <LockKeyhole size={24} />
                <span>Cofre</span>
            </button>
            <button className={`nav-item ${isActive('/perfil') ? 'active' : ''}`} onClick={() => navigate('/perfil')}>
                <User size={24} />
                <span>Perfil</span>
            </button>
        </div>
    );
}
