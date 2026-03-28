import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ChevronRight, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import logo from '../assets/logopontoevirgula.png';
import { SEO } from '../components/SEO';

export function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if location state instructed us to show the register form
    const [isRegister, setIsRegister] = useState(false);

    useEffect(() => {
        if (location.state?.register) {
            setIsRegister(true);
        }
    }, [location.state]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPatientModal, setShowPatientModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isRegister) {
            if (!email || !password || !name) {
                toast.error('Preencha todos os campos!');
                return;
            }
            setShowPatientModal(true);
        } else {
            handleLogin();
        }
    };

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            toast.success(`Bem-vindo(a) de volta!`);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            if (response.data.user.role === 'ADMIN') {
                navigate('/psicologo/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || 'Erro ao entrar.';
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinalRegister = async (alreadyPatient: boolean) => {
        setShowPatientModal(false);
        setIsLoading(true);

        try {
            const response = await api.post('/auth/register', {
                email,
                password,
                name,
                role: 'PATIENT',
                isAlreadyPatient: alreadyPatient
            });

            toast.success('Conta criada com sucesso!');
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/onboarding');
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || 'Erro ao criar conta.';
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container" style={{ justifyContent: 'center' }}>
            <SEO 
                title={isRegister ? "Criar Conta" : "Acessar Conta"} 
                description={isRegister ? "Crie sua conta no Ponto e Vírgula e comece a organizar sua jornada terapêutica hoje mesmo." : "Acesse seu espaço seguro para organizar suas sessões e reflexões."} 
            />
            <motion.div
                className="glass-panel"
                style={{ padding: '32px', textAlign: 'center' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div style={{ marginBottom: '32px' }}>
                    <img 
                        src={logo} 
                        alt="Ponto e Vírgula Logo" 
                        style={{ height: '80px', margin: '0 auto 16px', display: 'block', objectFit: 'contain' }} 
                    />
                    <p className="text-muted">{isRegister ? 'Crie sua conta e inicie sua jornada' : 'Seu espaço terapêutico'}</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>

                    {isRegister && (
                        <div style={{ position: 'relative' }}>
                            <User size={20} className="text-muted" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Nome como prefere ser chamado"
                                style={{ paddingLeft: '48px' }}
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}


                    <div style={{ position: 'relative' }}>
                        <Mail size={20} className="text-muted" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                        <input
                            type="email"
                            className="input-field"
                            placeholder="E-mail"
                            style={{ paddingLeft: '48px' }}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={20} className="text-muted" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="input-field"
                            placeholder="Senha"
                            style={{ paddingLeft: '48px', paddingRight: '48px' }}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ position: 'absolute', right: '12px', top: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--co-text-muted)' }}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', marginTop: '8px' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Aguarde...' : (isRegister ? 'Criar Conta' : 'Acessar')} <ChevronRight size={20} />
                    </button>
                </form>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '24px' }}>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                        {isRegister ? 'Já possui conta?' : 'Primeira vez aqui?'}
                    </p>
                    <button
                        type="button"
                        className="btn-secondary"
                        style={{ width: '100%', marginTop: '12px', border: '1px solid var(--co-accent)', background: 'transparent' }}
                        onClick={() => setIsRegister(!isRegister)}
                    >
                        {isRegister ? 'Fazer Login' : 'Criar Conta'}
                    </button>
                </div>
            </motion.div>

            <AnimatePresence>
                {showPatientModal && (
                    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                            onClick={() => setShowPatientModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-panel"
                            style={{ position: 'relative', width: '100%', maxWidth: '400px', padding: '32px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                        >
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Uma pergunta rápida...</h2>
                            <p className="text-muted" style={{ marginBottom: '32px', lineHeight: 1.5 }}>
                                Você já realiza acompanhamento com a <strong>Psicóloga Tailiny Quirino</strong>?
                            </p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button 
                                    className="btn-primary" 
                                    style={{ width: '100%', padding: '16px' }}
                                    onClick={() => handleFinalRegister(true)}
                                >
                                    Sim, já sou paciente
                                </button>
                                <button 
                                    className="btn-secondary" 
                                    style={{ width: '100%', padding: '16px', border: '1px solid var(--co-accent)', background: 'transparent' }}
                                    onClick={() => handleFinalRegister(false)}
                                >
                                    Não por enquanto
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
