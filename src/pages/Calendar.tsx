import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, X, Check, Loader2 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { MOOD_CATEGORIES } from '../utils/constants';
import toast from 'react-hot-toast';
import api from '../services/api';
import { offlineSyncService } from '../services/offlineSyncService';

// Mapeamento de Humor Base para Nível (1 a 5) para o Gráfico
const MOOD_LEVELS: Record<string, number> = {
    'triste': 1,
    'irritada': 2,
    'neutra': 3,
    'boa': 4,
    'radiante': 5
};

export function Calendar() {
    const navigate = useNavigate();
    const [isAddingMood, setIsAddingMood] = useState(false);
    const [selectedMainMood, setSelectedMainMood] = useState<string | null>(null);
    const [selectedSubEmotion, setSelectedSubEmotion] = useState<string | null>(null);
    const [moodSwing, setMoodSwing] = useState<boolean | null>(null);
    const [moodNotes, setMoodNotes] = useState('');
    const [savingMood, setSavingMood] = useState(false);

    const [moodHistory, setMoodHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadHistory = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/mood');
            setMoodHistory(data);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar histórico.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();

        const handleSync = () => loadHistory();
        window.addEventListener('sync-complete', handleSync);
        return () => window.removeEventListener('sync-complete', handleSync);
    }, []);

    const [currentDate, setCurrentDate] = useState(new Date());

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    // Helper: Pega Humor do Dia (YYYY-MM-DD string para facilitar)
    const getMoodForDay = (dayStr: string) => {
        return moodHistory.find(m => {
            const mDate = new Date(m.date);
            // Ignore o Timezone local (Y-m-d exato do BD UTC simplificado)
            return mDate.toISOString().split('T')[0] === dayStr;
        });
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // 1 to 12
    const daysInMonthCount = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay(); // 0 (Sun) to 6 (Sat)

    // Adjusting to make Monday=0, Sunday=6 for our D S T Q Q S S layout 
    // Wait, the layout is D S T Q Q S S (Dom, Seg, Ter, Qua, Qui, Sex, Sab) -> standard: Sun=0.
    const emptySlots = Array.from({ length: firstDayOfMonth }, (_, i) => i);
    const daysInMonth = Array.from({ length: daysInMonthCount }, (_, i) => i + 1);

    const formatDayStr = (d: number, mo = month, y = year) => {
        return `${y}-${mo.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
    };

    const getEmoji = (day: number) => {
        const mood = getMoodForDay(formatDayStr(day));
        if (mood && MOOD_CATEGORIES[mood.mainMood as keyof typeof MOOD_CATEGORIES]) {
            return MOOD_CATEGORIES[mood.mainMood as keyof typeof MOOD_CATEGORIES].emoji;
        }
        return '';
    };

    // Montar Grafico da Semana Ativa Baseado no Histórico (Últimos 7 dias a partir de hoje)
    const weeklyMoodData = Array.from({ length: 7 }, (_, i) => {
        const today = new Date();
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i)); // -6, -5, ..., 0

        const dayStr = d.toISOString().split('T')[0];
        const mood = getMoodForDay(dayStr);

        let level = 3; // Neutro Default
        if (mood) {
            level = MOOD_LEVELS[mood.mainMood as keyof typeof MOOD_LEVELS] || 3;
        }

        const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        return { name: labels[d.getDay()], mood: level };
    });

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
            setSelectedMainMood(null);
            setIsAddingMood(false);
            loadHistory();
        } catch (error: any) {
            if (!error.response) {
                offlineSyncService.addToQueue('/mood', 'POST', {
                    mainMood: selectedMainMood,
                    subEmotions: [selectedSubEmotion],
                    moodSwing: moodSwing,
                    notes: moodNotes
                }, `Humor: ${selectedMainMood}`);
                
                setSelectedMainMood(null);
                setIsAddingMood(false);
            } else {
                console.error(error);
                toast.error(error.response?.data?.error || "Erro ao registrar");
            }
        } finally {
            setSavingMood(false);
        }
    };

    const handleDayClick = (day: number) => {
        const dayStr = formatDayStr(day);
        // Envia o dia para a rota DayDetail via State
        navigate(`/dia/${dayStr}`);
    };

    return (
        <div className="container" style={{ paddingBottom: '100px', position: 'relative' }}>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingTop: '16px' }}>
                <button className="btn-secondary" style={{ padding: '8px', borderRadius: '12px' }} onClick={prevMonth}>
                    <ChevronLeft size={20} />
                </button>
                <h1 style={{ fontSize: '1.25rem', margin: 0, textTransform: 'capitalize' }}>
                    {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </h1>
                <button className="btn-secondary" style={{ padding: '8px', borderRadius: '12px' }} onClick={nextMonth}>
                    <ChevronRight size={20} />
                </button>
            </header>

            <div className="glass-panel" style={{ padding: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '4px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--co-text-muted)', fontWeight: 600 }}>
                    <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
                </div>

                <div className="calendar-grid">
                    {emptySlots.map((slot) => (
                        <div key={`empty-${slot}`} className="calendar-day" style={{ visibility: 'hidden' }}></div>
                    ))}

                    {daysInMonth.map((day) => (
                        <motion.div
                            key={day}
                            className="calendar-day"
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleDayClick(day)}
                        >
                            <span className="calendar-day-number">{day}</span>
                            <span className="calendar-emoji">{getEmoji(day)}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Resumo da Semana</h2>
            <div className="glass-panel" style={{ padding: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Evolução da Semana</h2>
                    <span style={{ fontSize: '0.8rem', background: 'var(--co-lavender)', padding: '4px 8px', borderRadius: '12px', fontWeight: 600, color: 'var(--co-text-dark)' }}>{isLoading ? '...' : 'Histórico'}</span>
                </div>

                <div style={{ height: '140px', width: '100%' }}>
                    {!isLoading && (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyMoodData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}
                                    itemStyle={{ color: 'var(--co-text-dark)', fontWeight: 600 }}
                                    formatter={(value: any) => {
                                        const emojis = ['😢', '😠', '😐', '🙂', '🤩'];
                                        return [emojis[(value as number) - 1], 'Nível de Humor'];
                                    }}
                                    labelStyle={{ color: 'var(--co-text-muted)', marginBottom: '4px' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="mood"
                                    stroke="var(--co-action)"
                                    strokeWidth={4}
                                    dot={{ fill: 'var(--co-action)', r: 5, strokeWidth: 3, stroke: '#fff' }}
                                    activeDot={{ r: 8, stroke: 'var(--co-white)', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', padding: '0 8px', color: 'var(--co-text-muted)', fontSize: '0.75rem', fontWeight: 500 }}>
                    {weeklyMoodData.map(d => <span key={d.name}>{d.name}</span>)}
                </div>
            </div>

            {/* Botão Flutuante (FAB) */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddingMood(true)}
                style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '24px',
                    width: '64px',
                    height: '64px',
                    borderRadius: '32px',
                    backgroundColor: 'var(--co-action)',
                    color: 'var(--co-text-dark)',
                    border: 'none',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 50
                }}
            >
                <Plus size={32} />
            </motion.button>

            {/* Modal de Adição Rápida */}
            <AnimatePresence>
                {isAddingMood && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, backdropFilter: 'blur(4px)' }}
                            onClick={() => { setIsAddingMood(false); setSelectedMainMood(null); }}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: '100%' }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            style={{
                                position: 'fixed', bottom: 0, left: 0, right: 0,
                                backgroundColor: '#fafafa', borderTopLeftRadius: '32px', borderTopRightRadius: '32px',
                                padding: '32px 24px 40px', zIndex: 1000,
                                boxShadow: '0 -8px 32px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '1.25rem' }}>Como você está?</h2>
                                <button className="btn-secondary" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => { setIsAddingMood(false); setSelectedMainMood(null); }}>
                                    <X size={20} />
                                </button>
                            </div>

                            {!selectedMainMood ? (
                                <div className="hide-scrollbar" style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                                    {Object.entries(MOOD_CATEGORIES).map(([key, category]) => (
                                        <button
                                            key={key}
                                            className="glass-card"
                                            style={{ flexShrink: 0, fontSize: 'clamp(22px, 5vw, 26px)', padding: '10px', border: 'none', cursor: 'pointer', borderRadius: '18px', width: 'clamp(44px, 12vw, 56px)', height: 'clamp(44px, 12vw, 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--co-white)' }}
                                            onClick={() => handleMainMoodSelect(key)}
                                        >
                                            {category.emoji}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <motion.div
                                    key="detailed-form-modal"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ padding: '24px', borderRadius: '24px', border: `2px solid ${MOOD_CATEGORIES[selectedMainMood as keyof typeof MOOD_CATEGORIES].color}`, background: 'var(--co-white)' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontSize: '2.5rem' }}>{MOOD_CATEGORIES[selectedMainMood as keyof typeof MOOD_CATEGORIES].emoji}</span>
                                            <div>
                                                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '2px' }}>Emoção Base</p>
                                                <h2 style={{ fontSize: '1.1rem', margin: 0 }}>{MOOD_CATEGORIES[selectedMainMood as keyof typeof MOOD_CATEGORIES].label}</h2>
                                            </div>
                                        </div>
                                        <button
                                            className="btn-secondary"
                                            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                                            onClick={() => setSelectedMainMood(null)}
                                        >
                                            Trocar
                                        </button>
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <h3 style={{ fontSize: '0.95rem', marginBottom: '12px' }}>Especifique o sentimento:</h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {(MOOD_CATEGORIES[selectedMainMood as keyof typeof MOOD_CATEGORIES].subEmotions).map(sub => (
                                                <button
                                                    key={sub}
                                                    onClick={() => setSelectedSubEmotion(sub)}
                                                    style={{
                                                        padding: '6px 12px', borderRadius: '100px', border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', fontSize: '0.85rem',
                                                        transition: 'all 0.2s ease',
                                                        background: selectedSubEmotion === sub ? MOOD_CATEGORIES[selectedMainMood as keyof typeof MOOD_CATEGORIES].color : 'transparent',
                                                        fontWeight: selectedSubEmotion === sub ? 600 : 400
                                                    }}
                                                >
                                                    {sub}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <h3 style={{ fontSize: '0.95rem', marginBottom: '12px' }}>Mudança brusca de humor hoje?</h3>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <button
                                                onClick={() => setMoodSwing(true)}
                                                style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: moodSwing === true ? 'var(--co-lavender)' : 'transparent', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' }}
                                            >
                                                <Check size={16} opacity={moodSwing === true ? 1 : 0.4} /> Sim
                                            </button>
                                            <button
                                                onClick={() => setMoodSwing(false)}
                                                style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: moodSwing === false ? 'var(--co-lavender)' : 'transparent', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' }}
                                            >
                                                <X size={16} opacity={moodSwing === false ? 1 : 0.4} /> Não
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <textarea
                                            className="input-field"
                                            placeholder="Notas opcionais..."
                                            value={moodNotes}
                                            onChange={(e) => setMoodNotes(e.target.value)}
                                            style={{ minHeight: '80px', resize: 'vertical', fontSize: '0.9rem' }}
                                        />
                                    </div>

                                    <button
                                        className="btn-primary"
                                        style={{ width: '100%', padding: '14px', borderRadius: '16px', display: 'flex', justifyContent: 'center', gap: '8px', opacity: !selectedSubEmotion || moodSwing === null ? 0.5 : 1 }}
                                        disabled={!selectedSubEmotion || moodSwing === null || savingMood}
                                        onClick={handleSaveDetailedMood}
                                    >
                                        {savingMood ? <Loader2 size={20} style={{ animation: 'spin 1.5s linear infinite' }} /> : 'Registrar'}
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
