import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

const GROUNDING_STEPS = [
    { count: 5, label: 'coisas que você pode VER ao seu redor.', color: 'var(--co-serene-blue)' },
    { count: 4, label: 'coisas que você pode TOCAR (e sinta a textura).', color: 'var(--co-lavender)' },
    { count: 3, label: 'coisas que você pode OUVIR.', color: 'var(--co-accent)' },
    { count: 2, label: 'coisas que você pode CHEIRAR (sua roupa, o ar).', color: '#B39DDB' },
    { count: 1, label: 'coisa que você pode SENTIR O GOSTO.', color: '#9575CD' }
];

export function Grounding() {
    const navigate = useNavigate();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const step = GROUNDING_STEPS[currentStepIndex];
    const isFinished = currentStepIndex >= GROUNDING_STEPS.length;

    const handleNext = () => {
        setCurrentStepIndex(prev => prev + 1);
    };

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '24px', background: 'var(--co-background)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <button
                    className="btn-secondary"
                    style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => navigate('/emergencia')}
                >
                    <X size={24} />
                </button>
                <div style={{ background: 'var(--co-primary-bg)', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Técnica 5-4-3-2-1</span>
                </div>
                <div style={{ width: '48px' }}></div>
            </header>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
                <AnimatePresence mode="wait">
                    {!isFinished ? (
                        <motion.div
                            key={currentStepIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}
                        >
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--co-text-muted)', fontWeight: 500 }}>Encontre e foque em</h2>
                            <div
                                style={{
                                    width: '100px', height: '100px', borderRadius: '50%',
                                    background: step.color, color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '3.5rem', fontWeight: 800, margin: '24px 0',
                                    boxShadow: `0 8px 32px ${step.color}60`
                                }}
                            >
                                {step.count}
                            </div>
                            <h1 style={{ fontSize: '1.6rem', marginBottom: '40px', maxWidth: '280px', lineHeight: 1.4 }}>
                                {step.label}
                            </h1>

                            <button
                                className="btn-primary"
                                style={{ padding: '16px 32px', borderRadius: '24px', fontSize: '1.1rem', width: '100%', maxWidth: '300px' }}
                                onClick={handleNext}
                            >
                                Já encontrei {step.count}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="finished"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}
                        >
                            <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'var(--co-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'white', boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)' }}>
                                <Check size={40} />
                            </div>
                            <h1 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Muito bem.</h1>
                            <p className="text-muted" style={{ maxWidth: '280px', lineHeight: 1.5, marginBottom: '48px' }}>
                                A técnica de aterramento ajuda a tirar o foco da ansiedade e trazer você de volta ao momento presente.
                            </p>
                            <button
                                className="btn-primary"
                                style={{ padding: '16px 32px', borderRadius: '24px', fontSize: '1.1rem', width: '100%', maxWidth: '300px' }}
                                onClick={() => navigate('/emergencia')}
                            >
                                Concluir
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {!isFinished && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', paddingBottom: '24px' }}>
                    {GROUNDING_STEPS.map((_, i) => (
                        <div key={i} style={{ width: '8px', height: '8px', borderRadius: '4px', background: i === currentStepIndex ? 'var(--co-text-dark)' : 'rgba(0,0,0,0.1)' }} />
                    ))}
                </div>
            )}
        </div>
    );
}
