import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Calendar as CalendarIcon, MessageSquare, ShieldAlert, Check, X, Loader2, Flame, BookOpen, Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { MOOD_CATEGORIES } from '../utils/constants';
import api from '../services/api';
import toast from 'react-hot-toast';
import { sendPushNotification } from '../utils/notifications';

export function Dashboard() {
    const navigate = useNavigate();

    // Auth & Status State
    const [userName, setUserName] = useState('Paciente');
    const [userInitial, setUserInitial] = useState('P');
    const [streak, setStreak] = useState(0);
    const [emergencyEnabled, setEmergencyEnabled] = useState(false);
    const [hasPsychologist, setHasPsychologist] = useState(false);
    const [nextAppointment, setNextAppointment] = useState<any>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Estado para o fluxo de registro de humor
    const [selectedMainMood, setSelectedMainMood] = useState<string | null>(null);
    const [selectedSubEmotion, setSelectedSubEmotion] = useState<string | null>(null);
    const [moodSwing, setMoodSwing] = useState<boolean | null>(null);
    const [moodNotes, setMoodNotes] = useState('');

    // PWA Install Hook
    const { isInstallable, installApp } = usePWAInstall();
    const [savingMood, setSavingMood] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setIsLoadingData(true);
        try {
            // Promise.all para puxar dados em paralelo
            const [profileRes, streakRes, aptsRes] = await Promise.all([
                api.get('/user/me'),
                api.get('/mood/streak'),
                api.get('/appointments').catch(() => ({ data: [] }))
            ]);

            const user = profileRes.data;
            setUserName(user.name?.split(' ')[0] || 'Paciente'); // Primeiro Nome
            setUserInitial(user.name?.charAt(0).toUpperCase() || 'P');
            setEmergencyEnabled(user.emergencyEnabled);
            setHasPsychologist(!!user.psychologistId);
            setStreak(streakRes.data.streak || 0);

            const scheduled = aptsRes.data.filter((a: any) => a.status === 'SCHEDULED' && new Date(a.date).getTime() >= new Date().getTime() - 3600000); // Tira as que passaram muito, mas mantém a próxima mais de 1 hr de erro
            const nextApt = scheduled.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
            setNextAppointment(nextApt || null);

            // Push Notification: Lembrete de Sessão
            if (nextApt) {
                const aptDate = new Date(nextApt.date);
                const isToday = aptDate.toDateString() === new Date().toDateString();
                const lastNotifiedSession = localStorage.getItem(`push_session_${nextApt.id}`);

                if (isToday && !lastNotifiedSession) {
                    sendPushNotification("📅 Sessão Hoje!", { body: `Você tem uma sessão marcada para às ${aptDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.` });
                    localStorage.setItem(`push_session_${nextApt.id}`, 'true');
                }
            }

            // Push Notification: Como você está? (Streaks)
            const streakVal = streakRes.data.streak || 0;
            if (streakVal > 0) {
                const lastNotifiedMood = localStorage.getItem('push_mood');
                if (lastNotifiedMood !== new Date().toDateString()) {
                    sendPushNotification("🧠 Como você está hoje?", { body: "Tire um minutinho para registrar seu humor." });
                    localStorage.setItem('push_mood', new Date().toDateString());
                }
            }

            // Salvar no localstorage atualizado
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            console.error('Erro ao carregar dashboard', error);
            // Se der erro de token implícito/inválido
        } finally {
            setIsLoadingData(false);
        }
    };

    // Handlers do fluxo
    const handleMainMoodSelect = (moodKey: string) => {
        setSelectedMainMood(moodKey);
        setSelectedSubEmotion(null);
        setMoodSwing(null);
        setMoodNotes('');
    };

    const handleSaveDetailedMood = async () => {
        if (!selectedMainMood || !selectedSubEmotion || moodSwing === null) return;

        setSavingMood(true);
        try {
            await api.post('/mood', {
                mainMood: selectedMainMood,
                subEmotions: [selectedSubEmotion],
                moodSwing: moodSwing,
                notes: moodNotes
            });

            toast.success("Humor registrado com sucesso!");
            setSelectedMainMood(null); // Fecha modal
            loadDashboardData(); // Recarrega o streak pra ver se aumentou
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Erro ao registrar humor.');
        } finally {
            setSavingMood(false);
        }
    };

    if (isLoadingData) {
        return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" size={32} color="var(--co-accent)" /></div>
    }

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingTop: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem' }}>Olá, {userName}</h1>
                    <p className="text-muted">Como você está se sentindo hoje?</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--co-white)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <Flame size={18} color={streak > 0 ? "#FF9800" : "#ccc"} />
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--co-text-dark)' }}>{streak}</span>
                    </div>
                    <div
                        onClick={() => navigate('/perfil')}
                        style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: 'var(--co-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        {userInitial}
                    </div>
                </div>
            </header>

            {/* Banner Instalar App (PWA) */}
            {isInstallable && (
                <motion.div
                    initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="glass-panel"
                    style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', background: 'var(--co-primary)', color: 'var(--co-white)', cursor: 'pointer', border: 'none' }}
                    onClick={installApp}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Download size={20} color="var(--co-white)" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.05rem', marginBottom: '2px', color: 'var(--co-white)' }}>Instalar Aplicativo</h3>
                            <p style={{ fontSize: '0.85rem', opacity: 0.9, color: 'var(--co-white)' }}>Transforme em um ícone no seu celular</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Banner Teste Cognitivo */}
            <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                className="glass-panel"
                style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', background: 'linear-gradient(135deg, var(--co-lavender) 0%, rgba(166,124,255, 0.15) 100%)', color: 'var(--co-text-dark)', cursor: 'pointer', border: '1px solid var(--co-accent)' }}
                onClick={() => navigate('/assessment')}
            >
                <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '4px', color: 'var(--co-primary)' }}>Descubra seu Perfil Cognitivo</h3>
                    <p className="text-muted" style={{ fontSize: '0.9rem', opacity: 0.9 }}>Faça o teste rápido de 5 perguntas.</p>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: 'var(--co-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--co-accent)', boxShadow: '0 2px 8px rgba(166,124,255,0.2)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
            </motion.div>

            {/* FLUXO EXPANDIDO DO HUMOR */}
            <AnimatePresence mode="wait">
                {selectedMainMood ? (
                    <motion.div
                        key="detailed-form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-panel"
                        style={{ padding: '24px', marginBottom: '40px', border: `2px solid ${MOOD_CATEGORIES[selectedMainMood as keyof typeof MOOD_CATEGORIES].color}` }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '2.5rem' }}>{MOOD_CATEGORIES[selectedMainMood as keyof typeof MOOD_CATEGORIES].emoji}</span>
                                <div>
                                    <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '2px' }}>Emoção Base</p>
                                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{MOOD_CATEGORIES[selectedMainMood as keyof typeof MOOD_CATEGORIES].label}</h2>
                                </div>
                            </div>
                            <button
                                className="btn-secondary"
                                style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                onClick={() => setSelectedMainMood(null)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '1.05rem', marginBottom: '16px' }}>Especifique o que está sentindo:</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {(MOOD_CATEGORIES[selectedMainMood as keyof typeof MOOD_CATEGORIES].subEmotions).map(sub => (
                                    <button
                                        key={sub}
                                        onClick={() => setSelectedSubEmotion(sub)}
                                        style={{
                                            padding: '8px 16px', borderRadius: '100px', border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', fontSize: '0.9rem',
                                            transition: 'all 0.2s ease',
                                            background: selectedSubEmotion === sub ? MOOD_CATEGORIES[selectedMainMood as keyof typeof MOOD_CATEGORIES].color : 'var(--co-white)',
                                            fontWeight: selectedSubEmotion === sub ? 600 : 400
                                        }}
                                    >
                                        {sub}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '1.05rem', marginBottom: '16px' }}>Houve mudança brusca de humor hoje?</h3>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setMoodSwing(true)}
                                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: moodSwing === true ? 'var(--co-lavender)' : 'var(--co-white)', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', justifyContent: 'center', gap: '8px' }}
                                >
                                    <Check size={18} opacity={moodSwing === true ? 1 : 0.4} /> Sim
                                </button>
                                <button
                                    onClick={() => setMoodSwing(false)}
                                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: moodSwing === false ? 'var(--co-lavender)' : 'var(--co-white)', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', justifyContent: 'center', gap: '8px' }}
                                >
                                    <X size={18} opacity={moodSwing === false ? 1 : 0.4} /> Não
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '1.05rem', marginBottom: '16px' }}>Observação (Opcional):</h3>
                            <textarea
                                className="input-field"
                                placeholder="Aconteceu algo específico que você quer registrar sobre esse sentimento?"
                                value={moodNotes}
                                onChange={(e) => setMoodNotes(e.target.value)}
                                style={{ minHeight: '100px', resize: 'vertical' }}
                            />
                        </div>

                        <button
                            className="btn-primary"
                            style={{ width: '100%', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'center', gap: '8px', opacity: !selectedSubEmotion || moodSwing === null ? 0.5 : 1 }}
                            disabled={!selectedSubEmotion || moodSwing === null || savingMood}
                            onClick={handleSaveDetailedMood}
                        >
                            {savingMood ? <Loader2 size={24} style={{ animation: 'spin 1.5s linear infinite' }} /> : 'Registrar no Calendário'}
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="mood-selector"
                        style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '40px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {Object.entries(MOOD_CATEGORIES).map(([key, category]) => (
                            <button
                                key={key}
                                className="glass-card"
                                style={{ flexShrink: 0, fontSize: 'clamp(20px, 6vw, 26px)', padding: '10px', border: 'none', cursor: 'pointer', borderRadius: '18px', width: 'clamp(48px, 14vw, 56px)', height: 'clamp(48px, 14vw, 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                onClick={() => handleMainMoodSelect(key)}
                            >
                                {category.emoji}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '1.25rem' }}>Ações Rápidas</h2>

                <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }} onClick={() => navigate('/planner')}>
                    <div style={{ background: 'var(--co-lavender)', padding: '12px', borderRadius: '16px' }}>
                        <MessageSquare size={24} color="var(--co-text-dark)" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>O que falar na terapia</h3>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Anote pensamentos do dia</p>
                    </div>
                    <ChevronRight size={20} className="text-muted" />
                </div>

                {hasPsychologist && (
                    <>
                        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }} onClick={() => navigate('/blog')}>
                            <div style={{ background: 'var(--co-lavender)', padding: '12px', borderRadius: '16px' }}>
                                <BookOpen size={24} color="var(--co-text-dark)" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Artigos da Clínica</h3>
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Leia conteúdos sobre Saúde Mental</p>
                            </div>
                            <ChevronRight size={20} className="text-muted" />
                        </div>

                        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ background: 'var(--co-serene-blue)', padding: '12px', borderRadius: '16px' }}>
                                <CalendarIcon size={24} color="var(--co-text-dark)" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Próxima Sessão</h3>
                                <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: nextAppointment?.notes ? '8px' : '0' }}>
                                    {nextAppointment
                                        ? new Date(nextAppointment.date).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
                                        : 'A definir com a terapeuta'}
                                </p>
                                {nextAppointment?.notes && (
                                    <div style={{ fontSize: '0.85rem', padding: '8px 12px', background: 'rgba(255,255,255,0.5)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', color: 'var(--co-text-dark)' }}>
                                        <strong>Nota:</strong> {nextAppointment.notes}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {emergencyEnabled && (
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/breathe')}
                        style={{
                            width: '100%', padding: '20px', borderRadius: '24px', background: 'linear-gradient(135deg, #FFCDD2 0%, #E57373 100%)',
                            border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', boxShadow: '0 8px 16px rgba(229, 115, 115, 0.4)'
                        }}
                    >
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '16px' }}>
                            <ShieldAlert size={28} />
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Botão de Emergência</h3>
                            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Preciso de ajuda agora</p>
                        </div>
                        <ChevronRight size={20} />
                    </motion.div>
                )}
            </div>
        </div>
    );
}
