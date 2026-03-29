import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldAlert, Loader2, Bell, X } from 'lucide-react';
import { PsychologistSidebar } from '../../components/PsychologistSidebar';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { getNotificationStatus, requestNotificationPermission } from '../../utils/notifications';
import { AnimatePresence } from 'framer-motion';

export function PsychologistDashboard() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showNotificationBanner, setShowNotificationBanner] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await api.get('/psychologist/patients');
                setPatients(res.data);
            } catch (error) {
                console.error("Erro ao puxar pacientes", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatients();

        // Verifica status de notificação para o banner de convite
        const status = getNotificationStatus();
        const dismissed = localStorage.getItem('hide_notification_banner_psi');
        if (status === 'default' && !dismissed) {
            setShowNotificationBanner(true);
        }
    }, []);

    // Simulação: se tem botão ativado, mostrar um painel de alerta (MVP Fake Trigger)
    const hasEmergencyEnabled = patients.some(p => p.emergencyEnabled);

    const handleActivateNotifications = async () => {
        const granted = await requestNotificationPermission();
        if (granted) {
            setShowNotificationBanner(false);
            toast.success("Notificações ativadas!");
        } else {
            toast.error("Não foi possível ativar as notificações.");
        }
    };

    const handleDismissNotificationBanner = () => {
        setShowNotificationBanner(false);
        localStorage.setItem('hide_notification_banner_psi', 'true');
    };

    return (
        <div className="psi-layout">
            <PsychologistSidebar activePath="dashboard" />

            <div className="psi-main">
                <header style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '1.8rem' }}>Visão Geral</h1>
                    <p className="text-muted">Acompanhe seus alertas e seus pacientes recentes.</p>
                </header>

                <AnimatePresence>
                    {showNotificationBanner && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden' }}
                        >
                            <div 
                                className="glass-panel" 
                                style={{ 
                                    padding: '16px 20px', 
                                    marginBottom: '32px', 
                                    background: 'rgba(166,124,255,0.08)', 
                                    border: '1px solid rgba(166,124,255,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    position: 'relative'
                                }}
                            >
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--co-lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Bell size={22} color="var(--co-accent)" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '2px' }}>Ative as Notificações Profissionais</h3>
                                    <p className="text-muted" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>Receba alertas em tempo real de novos comentários e chamadas de emergência.</p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <button 
                                        className="btn-primary" 
                                        style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '10px' }}
                                        onClick={handleActivateNotifications}
                                    >
                                        Ativar Alertas
                                    </button>
                                    <button 
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--co-text-muted)' }}
                                        onClick={handleDismissNotificationBanner}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Alerta de Emergência - Mockado com o estado de permissão */}
                {hasEmergencyEnabled && (
                    <motion.div
                        className="glass-card"
                        style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--co-danger)', marginBottom: '32px', cursor: 'pointer' }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate('/emergencia')}
                    >
                        <div style={{ background: '#FFEBEE', padding: '12px', borderRadius: '16px' }}>
                            <ShieldAlert size={24} color="var(--co-danger-text)" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.1rem', color: 'var(--co-danger-text)', marginBottom: '4px' }}>Chat de Emergência Disponível</h3>
                            <p style={{ color: 'var(--co-danger-text)', opacity: 0.8, fontSize: '0.9rem' }}>Você possui pacientes com permissão de emergência ligada.</p>
                        </div>
                        <ChevronRight size={20} color="var(--co-danger-text)" />
                    </motion.div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr)', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>Meus Pacientes (Cadastrados)</h2>

                        {isLoading ? (
                            <Loader2 className="animate-spin" style={{ margin: '20px auto' }} />
                        ) : patients.length === 0 ? (
                            <p className="text-muted">Nenhum paciente iniciou o uso do app na sua clínica ainda.</p>
                        ) : (
                            patients.slice(0, 3).map(p => (
                                <div key={p.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', cursor: 'pointer' }} onClick={() => navigate(`/psicologo/paciente/${p.id}`)}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: 'var(--co-action)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                {p.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.1rem', textTransform: 'capitalize' }}>{p.name.split(' ')[0]}</h3>
                                                <p className="text-muted" style={{ fontSize: '0.85rem' }}>{p.pronouns || 'Pronome não def.'}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} className="text-muted" />
                                    </div>
                                    {p.emergencyEnabled && (
                                        <div style={{ background: '#FFF3E0', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.03)', fontSize: '0.85rem', color: '#E65100', fontWeight: 600 }}>
                                            SOS Permitido
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                        {patients.length > 3 && (
                            <button className="btn-secondary" onClick={() => navigate('/psicologo/pacientes')} style={{ padding: '12px', borderRadius: '12px' }}>
                                Ver todos
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
