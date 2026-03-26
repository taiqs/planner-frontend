import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    const [isAlreadyPatient, setIsAlreadyPatient] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isRegister) {
                // Rota de Registro
                const response = await api.post('/auth/register', {
                    email,
                    password,
                    name,
                    role: 'PATIENT', // Cadastro público é sempre paciente
                    isAlreadyPatient
                });

                toast.success('Conta criada com sucesso!');
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/onboarding'); // Direciona pro onboarding preencher pronomes
            } else {
                // Rota de Login
                const response = await api.post('/auth/login', { email, password });

                toast.success(`Bem-vindo(a) de volta!`);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Redirecionamento Baseado no Cargo/Role
                if (response.data.user.role === 'ADMIN') {
                    navigate('/psicologo/dashboard');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (error: any) {
            console.error(error);
            // Capturando o erro nativo do express
            const errorMsg = error.response?.data?.error || 'Erro ao conectar no servidor. Tente novamente.';
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

                    {isRegister && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px' }}>
                            <input
                                type="checkbox"
                                id="alreadyPatient"
                                checked={isAlreadyPatient}
                                onChange={e => setIsAlreadyPatient(e.target.checked)}
                                style={{ accentColor: 'var(--co-accent)', width: '18px', height: '18px' }}
                            />
                            <label htmlFor="alreadyPatient" className="text-muted" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                                Já sou paciente da Psicóloga Tailiny Quirino
                            </label>
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
        </div>
    );
}
