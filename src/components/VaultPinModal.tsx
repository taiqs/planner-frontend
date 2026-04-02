import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, Delete } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface VaultPinModalProps {
    isOpen: boolean;
    onSuccess: () => void;
    userHasPin: boolean;
}

export function VaultPinModal({ isOpen, onSuccess, userHasPin }: VaultPinModalProps) {
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [step, setStep] = useState<'verify' | 'ask' | 'create' | 'confirm'>('verify');
    const [error, setError] = useState('');

    useEffect(() => {
        // Sempre que o modal abre ou o status do PIN muda, resetamos e definimos o step correto.
        // Isso garante que o step reflita o estado real do servidor (não o valor inicial do useState).
        if (isOpen) {
            setPin('');
            setConfirmPin('');
            setError('');
            setStep(userHasPin ? 'verify' : 'ask');
        }
    }, [isOpen, userHasPin]);

    const handleNumberClick = (num: string) => {
        if (pin.length < 4) {
            setPin(prev => prev + num);
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
    };

    const handleVerify = async () => {
        if (pin.length !== 4) return;
        setError('');
        try {
            await api.post('/user/vault-pin/verify', { pin });
            onSuccess();
        } catch (err: any) {
            setError('PIN incorreto. Tente novamente.');
            setPin('');
        }
    };

    const handleCreate = async () => {
        if (pin !== confirmPin) {
            setError('Os PINs não coincidem.');
            setPin('');
            setConfirmPin('');
            setStep('create');
            return;
        }

        try {
            await api.patch('/user/vault-pin', { pin });
            toast.success('Senha do cofre criada com sucesso!');
            onSuccess();
        } catch (err: any) {
            toast.error('Erro ao criar senha.');
        }
    };

    useEffect(() => {
        if (pin.length === 4) {
            if (step === 'verify') {
                handleVerify();
            } else if (step === 'create') {
                setConfirmPin(pin);
                setPin('');
                setStep('confirm');
            } else if (step === 'confirm') {
                // Wait for state to update
            }
        }
    }, [pin, step]);

    useEffect(() => {
        if (step === 'confirm' && pin.length === 4) {
             handleCreate();
        }
    }, [pin, confirmPin, step]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px'
                }}
            >
                <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                    {step === 'ask' ? (
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'var(--co-lavender)', color: 'var(--co-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <ShieldCheck size={40} />
                            </div>
                            <h2 style={{ marginBottom: '16px' }}>Proteger seu Cofre?</h2>
                            <p className="text-muted" style={{ marginBottom: '32px' }}>
                                Deseja criar uma senha de 4 dígitos para manter suas reflexões ainda mais seguras e privadas?
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button
                                    className="btn-primary"
                                    onClick={() => setStep('create')}
                                    style={{ padding: '16px' }}
                                >
                                    Sim, criar senha
                                </button>
                                <button
                                    className="btn-secondary"
                                    onClick={() => {
                                        toast('Você pode criar essa senha depois em "Minha Conta"', { icon: 'ℹ️' });
                                        onSuccess();
                                    }}
                                    style={{ padding: '16px', background: 'transparent', border: 'none' }}
                                >
                                    Agora não, obrigado
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Lock size={32} color="var(--co-accent)" style={{ marginBottom: '16px' }} />
                            <h2 style={{ marginBottom: '8px' }}>
                                {step === 'verify' ? 'Digite seu PIN' : step === 'create' ? 'Crie seu PIN' : 'Confirme seu PIN'}
                            </h2>
                            <p className="text-muted" style={{ marginBottom: '24px' }}>
                                {step === 'verify' ? 'Acesse suas reflexões privadas' : 'Escolha 4 dígitos fáceis de lembrar'}
                            </p>

                            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                                {[1, 2, 3, 4].map(idx => (
                                    <div
                                        key={idx}
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '10px',
                                            border: '2px solid var(--co-accent)',
                                            background: pin.length >= idx ? 'var(--co-accent)' : 'transparent',
                                            transition: 'all 0.2s'
                                        }}
                                    />
                                ))}
                            </div>

                            {error && <p style={{ color: 'var(--co-error)', fontSize: '0.9rem', marginBottom: '16px' }}>{error}</p>}

                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(3, 1fr)', 
                                gap: '20px', 
                                width: '100%', 
                                maxWidth: '280px' 
                            }}>
                                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => handleNumberClick(num)}
                                        style={{
                                            height: '70px',
                                            borderRadius: '35px',
                                            border: 'none',
                                            background: 'var(--co-white)',
                                            fontSize: '1.5rem',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {num}
                                    </button>
                                ))}
                                <div />
                                <button
                                    onClick={() => handleNumberClick('0')}
                                    style={{
                                        height: '70px',
                                        borderRadius: '35px',
                                        border: 'none',
                                        background: 'var(--co-white)',
                                        fontSize: '1.5rem',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    0
                                </button>
                                <button
                                    onClick={handleDelete}
                                    style={{
                                        height: '70px',
                                        borderRadius: '35px',
                                        border: 'none',
                                        background: 'transparent',
                                        fontSize: '1.5rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Delete size={24} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
