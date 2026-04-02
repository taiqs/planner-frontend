import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Loader2, X, Check } from 'lucide-react';
import { MOOD_CATEGORIES } from '../utils/constants';
import api from '../services/api';
import toast from 'react-hot-toast';
import { getProxyUrl } from '../utils/fileProxy';

export function DayDetail() {
    const navigate = useNavigate();
    const { diaId } = useParams(); // URL traz "YYYY-MM-DD"

    const [moodData, setMoodData] = useState<any>(null);
    const [vaultData, setVaultData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Mood Modal State
    const [isAddingMood, setIsAddingMood] = useState(false);
    const [selectedMainMood, setSelectedMainMood] = useState<string | null>(null);
    const [selectedSubEmotion, setSelectedSubEmotion] = useState<string | null>(null);
    const [moodSwing, setMoodSwing] = useState<boolean | null>(null);
    const [moodNotes, setMoodNotes] = useState('');
    const [savingMood, setSavingMood] = useState(false);

    // Verifica se a data é hoje ou passado (bloqueia dias futuros)
    const isFutureDay = () => {
        if (!diaId) return false;
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        return diaId > todayStr;
    };

    useEffect(() => {
        loadDayData();
    }, [diaId]);

    const loadDayData = async () => {
        if (!diaId) return;
        setIsLoading(true);
        try {
            // Buscando apenas dados do dia específico no backend
            const [moodsRes, vaultsRes] = await Promise.all([
                api.get(`/mood?date=${diaId}`),
                api.get(`/vault?date=${diaId}`)
            ]);
 
            setMoodData(moodsRes.data[0] || null);
            setVaultData(vaultsRes.data);
        } catch (error) {
            console.error("Erro ao carregar os dados desse dia.", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveDetailedMood = async () => {
        if (!selectedMainMood || !selectedSubEmotion || moodSwing === null) return;
        setSavingMood(true);
        try {
            await api.post('/mood', {
                mainMood: selectedMainMood,
                subEmotions: [selectedSubEmotion],
                moodSwing: moodSwing,
                notes: moodNotes,
                date: diaId // Passando a data do dia visualizado
            });
            toast.success("Humor registrado com sucesso!");
            setSelectedMainMood(null);
            setIsAddingMood(false);
            loadDayData();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.error || "Erro ao registrar");
        } finally {
            setSavingMood(false);
        }
    };

    // Formatar YYYY-MM-DD visualmente amigável
    const getFormattedDate = () => {
        if (!diaId) return 'Data Desconhecida';
        const dateObj = new Date(diaId + 'T00:00:00Z');
        return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(dateObj);
    };

    const getFormattedWeek = () => {
        if (!diaId) return '';
        const dateObj = new Date(diaId + 'T00:00:00Z');
        return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: 'UTC' }).format(dateObj);
    };

    return (
        <div className="container" style={{ paddingBottom: '90px' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', paddingTop: '16px' }}>
                <button className="btn-secondary" style={{ padding: '10px 14px', borderRadius: '16px' }} onClick={() => navigate('/calendario')}>
                    <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '1.5rem', textTransform: 'capitalize' }}>{getFormattedDate()}</h1>
                    <p className="text-muted" style={{ textTransform: 'capitalize' }}>{getFormattedWeek()}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                     {!moodData && !isFutureDay() && (
                        <button 
                            className="btn-secondary" 
                            style={{ padding: '8px 12px', fontSize: '0.8rem', borderRadius: '12px', background: 'var(--co-lavender)' }}
                            onClick={() => setIsAddingMood(true)}
                        >
                            + Humor
                        </button>
                     )}
                     <button 
                        className="btn-primary" 
                        style={{ padding: '8px 12px', fontSize: '0.8rem', borderRadius: '12px' }}
                        onClick={() => navigate(`/planner?date=${diaId}`)}
                    >
                        + Reflexão
                    </button>
                </div>
            </header>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="animate-spin" /></div>
            ) : (
                <>
                    {/* Exibir o Humor do Dia */}
                    {moodData ? (
                        <div className="glass-card" style={{ padding: '24px', marginBottom: '16px', borderLeft: `6px solid ${MOOD_CATEGORIES[moodData.mainMood as keyof typeof MOOD_CATEGORIES]?.color || '#ccc'}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <span style={{ fontSize: '2rem' }}>{MOOD_CATEGORIES[moodData.mainMood as keyof typeof MOOD_CATEGORIES]?.emoji}</span>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{MOOD_CATEGORIES[moodData.mainMood as keyof typeof MOOD_CATEGORIES]?.label}</h3>
                                    <p style={{ color: 'var(--co-text-muted)', fontSize: '0.85rem' }}>{moodData.subEmotions.join(', ')}</p>
                                </div>
                            </div>
                            {moodData.notes && (
                                <p style={{ lineHeight: 1.6, marginTop: '8px' }}>"{moodData.notes}"</p>
                            )}
                            {moodData.moodSwing && (
                                <span style={{ display: 'inline-block', marginTop: '12px', fontSize: '0.75rem', background: '#FFECB3', color: '#FF8F00', padding: '4px 8px', borderRadius: '8px', fontWeight: 600 }}>Tive Mudança Brusca ⚠️</span>
                            )}
                        </div>
                    ) : (
                        <div className="glass-card" style={{ padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
                            <p className="text-muted">Nenhum humor registrado neste dia.</p>
                        </div>
                    )}

                    {/* Exibir Registros do Cofre Vault (Reflexões) */}
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', marginTop: '32px' }}>Anotações e Diário</h3>
                    {vaultData.length > 0 ? (
                        vaultData.map((v: any) => (
                            <div key={v.id} className="glass-card" style={{ padding: '24px', marginBottom: '12px', position: 'relative' }}>
                                <p style={{ lineHeight: 1.6 }}>{v.content}</p>

                                {v.audioUrl && (
                                    <div style={{ marginTop: '16px', background: 'var(--co-lavender)', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ background: 'var(--co-white)', padding: '8px', borderRadius: '50%' }}>🎙️</div>
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Áudio Anexado</p>
                                            <a href={getProxyUrl(v.audioUrl)} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--co-action)' }}>Ouvir na Nuvem</a>
                                        </div>
                                    </div>
                                )}

                                <span style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '0.7rem', fontWeight: 600, color: v.isPrivate ? 'var(--co-danger-text)' : 'var(--co-success-text)', background: v.isPrivate ? '#FFEBEE' : '#E8F5E9', padding: '4px 8px', borderRadius: '8px' }}>
                                    {v.isPrivate ? 'Privado (Cofre)' : 'Compartilhado'}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted" style={{ textAlign: 'center', marginTop: '24px' }}>Nenhuma reflexão feita.</p>
                    )}
                </>
            )}

            {/* Modal de Adição Rápida de Humor (Reutilizado do Calendar) */}
            <AnimatePresence>
                {isAddingMood && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, backdropFilter: 'blur(4px)' }}
                            onClick={() => { setIsAddingMood(false); setSelectedMainMood(null); }}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            style={{
                                position: 'fixed', bottom: 0, left: 0, right: 0,
                                backgroundColor: '#fafafa', borderTopLeftRadius: '32px', borderTopRightRadius: '32px',
                                padding: '32px 24px 40px', zIndex: 1000, boxShadow: '0 -8px 32px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '1.25rem' }}>Como você estava?</h2>
                                <button className="btn-secondary" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => { setIsAddingMood(false); setSelectedMainMood(null); }}>
                                    <X size={20} />
                                </button>
                            </div>

                            {!selectedMainMood ? (
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                                    {Object.entries(MOOD_CATEGORIES).map(([key, category]) => (
                                        <button
                                            key={key}
                                            className="glass-card"
                                            style={{ flexShrink: 0, fontSize: '26px', padding: '10px', border: 'none', cursor: 'pointer', borderRadius: '18px', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--co-white)' }}
                                            onClick={() => setSelectedMainMood(key)}
                                        >
                                            {category.emoji}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
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
                                        <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }} onClick={() => setSelectedMainMood(null)}>Trocar</button>
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
                                        <h3 style={{ fontSize: '0.95rem', marginBottom: '12px' }}>Mudança brusca de humor?</h3>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <button onClick={() => setMoodSwing(true)} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: moodSwing === true ? 'var(--co-lavender)' : 'transparent', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                <Check size={16} opacity={moodSwing === true ? 1 : 0.4} /> Sim
                                            </button>
                                            <button onClick={() => setMoodSwing(false)} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: moodSwing === false ? 'var(--co-lavender)' : 'transparent', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                <X size={16} opacity={moodSwing === false ? 1 : 0.4} /> Não
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <textarea
                                            className="input-field"
                                            placeholder="Observações sobre este dia..."
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
