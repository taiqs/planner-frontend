import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wind, Hand, Phone, X, ShieldAlert } from 'lucide-react';

export function EmergencyHub() {
    const navigate = useNavigate();

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '24px 24px 100px 24px', background: 'var(--co-background)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <button
                    className="btn-secondary"
                    style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => navigate('/dashboard')}
                >
                    <X size={24} />
                </button>
                <div style={{ background: 'linear-gradient(135deg, #FFCDD2 0%, #E57373 100%)', color: 'white', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(229,115,115,0.4)' }}>
                    <ShieldAlert size={16} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>SOS Calma</span>
                </div>
                <div style={{ width: '48px' }}></div>
            </header>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '16px' }}>Como podemos aliviar agora?</h1>
                    <p className="text-muted" style={{ maxWidth: '280px', margin: '0 auto', lineHeight: 1.5 }}>
                        Escolha uma ferramenta abaixo para ajudar a acalmar sua mente e corpo neste momento.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/breathe')}
                        className="glass-card"
                        style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', border: '1px solid var(--co-accent)' }}
                    >
                        <div style={{ background: 'var(--co-serene-blue)', width: '56px', height: '56px', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Wind size={28} color="var(--co-text-dark)" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Respiração Guiada</h3>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Técnica 4-7-8 para relaxamento imediato do sistema nervoso.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/grounding')}
                        className="glass-card"
                        style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', border: '1px solid var(--co-accent)' }}
                    >
                        <div style={{ background: 'var(--co-lavender)', width: '56px', height: '56px', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Hand size={28} color="var(--co-text-dark)" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Técnica de Aterramento</h3>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Exercício 5-4-3-2-1 para trazer o foco de volta ao presente.</p>
                        </div>
                    </motion.div>
                </div>

                <div style={{ marginTop: 'auto', marginBottom: '24px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '24px', padding: '24px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Precisa falar com alguém agora?</h3>
                        <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
                            O Centro de Valorização da Vida (CVV) realiza apoio emocional preventivo atendendo voluntária e gratuitamente sob total sigilo.
                        </p>
                        <a
                            href="tel:188"
                            className="btn-primary"
                            style={{ display: 'flex', width: '100%', padding: '16px', borderRadius: '20px', background: 'var(--co-text-dark)', color: 'white', alignItems: 'center', justifyContent: 'center', gap: '12px', textDecoration: 'none' }}
                        >
                            <Phone size={20} />
                            <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>Ligar para 188 (24h)</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
