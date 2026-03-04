import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import { MOOD_CATEGORIES } from '../utils/constants';
import api from '../services/api';
import { getProxyUrl } from '../utils/fileProxy';

export function DayDetail() {
    const navigate = useNavigate();
    const { diaId } = useParams(); // URL traz "YYYY-MM-DD"

    const [moodData, setMoodData] = useState<any>(null);
    const [vaultData, setVaultData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDayData();
    }, [diaId]);

    const loadDayData = async () => {
        if (!diaId) return;
        setIsLoading(true);
        try {
            // Buscando todo Mood e todo Vault para filtrar (MVP, num ideal teria rota /date/:date)
            const [moodsRes, vaultsRes] = await Promise.all([
                api.get('/mood'),
                api.get('/vault')
            ]);

            // Filtrar itens do dia escolhido
            const foundMood = moodsRes.data.find((m: any) => m.date.startsWith(diaId));
            const foundVaults = vaultsRes.data.filter((v: any) => v.createdAt.startsWith(diaId));

            setMoodData(foundMood);
            setVaultData(foundVaults);
        } catch (error) {
            console.error("Erro ao carregar os dados desse dia.", error);
        } finally {
            setIsLoading(false);
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
                <div>
                    <h1 style={{ fontSize: '1.5rem', textTransform: 'capitalize' }}>{getFormattedDate()}</h1>
                    <p className="text-muted" style={{ textTransform: 'capitalize' }}>{getFormattedWeek()}</p>
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
                        vaultData.map((v) => (
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
        </div>
    );
}
