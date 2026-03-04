import { useNavigate } from 'react-router-dom';
import { ChevronRight, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export function EmergencyChat() {
    const navigate = useNavigate();
    return (
        <div className="container" style={{ paddingBottom: '0', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingTop: '16px' }}>
                <button className="btn-secondary" style={{ padding: '10px 14px', borderRadius: '16px' }} onClick={() => navigate(-1)}>
                    <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <div>
                    <h1 style={{ fontSize: '1.25rem', color: 'var(--co-danger-text)' }}>Chat de Emergência</h1>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>Psicóloga Clínica</p>
                </div>
            </header>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <span style={{ background: 'rgba(0,0,0,0.05)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', color: 'var(--co-text-muted)', fontWeight: 600 }}>Hoje, 10:30</span>
                </div>

                <div style={{ alignSelf: 'flex-end', background: 'var(--co-danger)', padding: '12px 16px', borderRadius: '16px 16px 0 16px', maxWidth: '85%' }}>
                    <p style={{ color: 'var(--co-danger-text)', fontSize: '0.95rem', lineHeight: 1.5 }}>Preciso de ajuda, os sintomas de pânico voltaram muito fortes agora. Não consigo focar.</p>
                </div>

                <div style={{ alignSelf: 'flex-start', background: 'var(--co-white)', border: '1px solid rgba(0,0,0,0.05)', padding: '12px 16px', borderRadius: '16px 16px 16px 0', maxWidth: '85%', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>Oi, Marina. Estou aqui com você. Sente-se confortavelmente e tente focar na sua respiração comigo. Puxe o ar contando até 4... solte contando até 6.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', padding: '16px 0', borderTop: '1px solid rgba(0,0,0,0.05)', background: 'var(--co-primary-bg)' }}>
                <input type="text" className="input-field" placeholder="Digite uma mensagem..." style={{ flex: 1, borderRadius: '24px', padding: '12px 20px' }} />
                <button
                    className="btn-primary"
                    style={{ padding: '12px', borderRadius: '24px', background: 'var(--co-danger)', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => toast("Alerta emitido! A sua psicóloga recebeu uma notificação no celular agora.", { icon: '🚨', duration: 4000 })}
                >
                    <Send size={20} color="var(--co-danger-text)" />
                </button>
            </div>
        </div>
    );
}
