import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HeartPulse } from 'lucide-react';

export function Breathe() {
    const navigate = useNavigate();
    const [phase, setPhase] = useState<'inspire' | 'segure' | 'expire'>('inspire');
    const [secondsLeft, setSecondsLeft] = useState(4);
    const [cyclesCompleted, setCyclesCompleted] = useState(0);

    // Sistema de respiração 4-7-8
    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev > 1) return prev - 1;

                // Muda de fase
                if (phase === 'inspire') {
                    setPhase('segure');
                    return 7;
                } else if (phase === 'segure') {
                    setPhase('expire');
                    return 8;
                } else {
                    setPhase('inspire');
                    setCyclesCompleted((c) => c + 1);
                    return 4;
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [phase]);

    const getPhaseMessage = () => {
        switch (phase) {
            case 'inspire': return 'Puxe o ar pelo nariz...';
            case 'segure': return 'Segure o ar...';
            case 'expire': return 'Solte devagar pela boca...';
        }
    };

    const getCircleScale = () => {
        switch (phase) {
            case 'inspire': return 1.5;
            case 'segure': return 1.5;
            case 'expire': return 1;
        }
    };

    const getPhaseColor = () => {
        switch (phase) {
            case 'inspire': return 'var(--co-serene-blue)';
            case 'segure': return 'var(--co-lavender)';
            case 'expire': return 'var(--co-accent)';
        }
    };

    const getPhaseDuration = () => {
        switch (phase) {
            case 'inspire': return 4;
            case 'segure': return 0;
            case 'expire': return 8;
        }
    };

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '24px', background: 'var(--co-background)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <button
                    className="btn-secondary"
                    style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => navigate('/dashboard')}
                >
                    <X size={24} />
                </button>
                <div style={{ background: 'var(--co-primary-bg)', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <HeartPulse size={16} color="var(--co-accent-hover)" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>SOS Calmante</span>
                </div>
                <div style={{ width: '48px' }}></div> {/* Spacer para centralizar titulo */}
            </header>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '1.75rem', marginBottom: '16px', textAlign: 'center' }}>Faça este exercício comigo.</h1>
                <p className="text-muted" style={{ textAlign: 'center', marginBottom: '64px', maxWidth: '280px', lineHeight: 1.5 }}>Siga a animação. A técnica 4-7-8 acalma rapidamente o sistema nervoso.</p>

                <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Ripple effects */}
                    <motion.div
                        animate={{
                            scale: getCircleScale() * 1.2,
                            opacity: [0.3, 0]
                        }}
                        transition={{
                            duration: getPhaseDuration(),
                            ease: "easeInOut",
                            repeat: Infinity
                        }}
                        style={{
                            position: 'absolute', inset: 0, borderRadius: '50%', background: getPhaseColor(), zIndex: 1
                        }}
                    />

                    {/* Círculo Principal Animado */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key="breathing-circle"
                            animate={{ scale: getCircleScale() }}
                            transition={{ duration: getPhaseDuration(), ease: "easeInOut" }}
                            style={{
                                width: '120px', height: '120px', borderRadius: '50%', background: getPhaseColor(),
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                boxShadow: `0 8px 32px ${getPhaseColor()}80`, zIndex: 2
                            }}
                        >
                            <motion.span
                                key={secondsLeft}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--co-text-dark)' }}
                            >
                                {secondsLeft}
                            </motion.span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                    <motion.h2
                        key={phase}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{ fontSize: '1.5rem', marginTop: '64px', textAlign: 'center', minHeight: '36px', fontWeight: 600, color: 'var(--co-text-dark)' }}
                    >
                        {getPhaseMessage()}
                    </motion.h2>
                </AnimatePresence>

                <p style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--co-text-muted)', fontWeight: 500 }}>
                    Ciclos completos: {cyclesCompleted}
                </p>
            </div>

            <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                <button
                    className="btn-primary"
                    style={{ width: '100%', padding: '16px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                    onClick={() => navigate('/dashboard')}
                >
                    <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>Concluir Exercício</span>
                </button>
            </div>
        </div>
    );
}
