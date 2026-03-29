import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, HeartPulse, Loader2, Check, Bell } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { requestNotificationPermission } from '../utils/notifications';

export function Onboarding() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [pronouns, setPronouns] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        // Pré-carrega o nome se foi definido no registro
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.name) setName(user.name);
            if (user.phone) setPhone(user.phone);
        }
    }, []);

    const maskPhone = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(maskPhone(e.target.value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.put('/user/profile', {
                name,
                pronouns,
                birthDate,
                phone
            });

            // Atualiza o local storage
            localStorage.setItem('user', JSON.stringify(response.data));

            toast.success("Perfil atualizado! Vamos começar.");
            
            if (notificationsEnabled) {
                await requestNotificationPermission();
            }

            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Erro ao atualizar perfil.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container" style={{ justifyContent: 'center' }}>
            <motion.div
                className="glass-panel"
                style={{ padding: '32px' }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '32px', backgroundColor: 'var(--co-action)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <User size={32} color="var(--co-text-dark)" />
                    </div>
                    <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Bem-vindo(a)!</h1>
                    <p className="text-muted">Vamos preparar o seu espaço seguro. Precisamos de apenas alguns detalhes.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                    <div>
                        <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block', fontWeight: 500 }}>Como você prefere ser chamado(a)?</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Seu nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block', fontWeight: 500 }}>Pronomes</label>
                        <div style={{ position: 'relative' }}>
                            <select
                                className="input-field"
                                style={{ appearance: 'none', cursor: 'pointer' }}
                                value={pronouns}
                                onChange={(e) => setPronouns(e.target.value)}
                                required
                            >
                                <option value="" disabled>Selecione seu pronome</option>
                                <option value="Ela/Dela">Ela/Dela</option>
                                <option value="Ele/Dele">Ele/Dele</option>
                                <option value="Elu/Delu">Elu/Delu</option>
                                <option value="Outro">Outro ou prefiro não informar</option>
                            </select>
                            <div style={{ position: 'absolute', right: '16px', top: '16px', pointerEvents: 'none' }}>▼</div>
                        </div>
                    </div>
                    <div>
                        <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block', fontWeight: 500 }}>Sua data de nascimento</label>
                        <input
                            type="date"
                            className="input-field"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block', fontWeight: 500 }}>Seu Telefone (WhatsApp)</label>
                        <input
                            type="tel"
                            className="input-field"
                            placeholder="(11) 99999-9999"
                            value={phone}
                            onChange={handlePhoneChange}
                            required
                        />
                    </div>

                    <div 
                        style={{ 
                            background: 'rgba(166,124,255,0.05)', 
                            padding: '16px', 
                            borderRadius: '16px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px',
                            cursor: 'pointer',
                            border: '1px solid rgba(166,124,255,0.1)'
                        }}
                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    >
                        <div style={{ 
                            width: '24px', 
                            height: '24px', 
                            borderRadius: '6px', 
                            border: '2px solid var(--co-accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: notificationsEnabled ? 'var(--co-accent)' : 'transparent',
                            transition: 'all 0.2s ease'
                        }}>
                            {notificationsEnabled && <Check size={16} color="white" />}
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '2px' }}>Ativar Notificações</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--co-text-muted)' }}>Receba lembretes de sessões e mensagens da sua psicóloga.</p>
                        </div>
                        <Bell size={20} color="var(--co-accent)" opacity={notificationsEnabled ? 1 : 0.4} />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 size={24} style={{ animation: 'spin 1.5s linear infinite' }} /> : 'Começar Jornada'} <HeartPulse size={20} />
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
