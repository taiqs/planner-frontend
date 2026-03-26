import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockKeyhole, Loader2, Plus, Play, Pause } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { VaultPinModal } from '../components/VaultPinModal';

export function VaultList() {
    const navigate = useNavigate();
    const [vaults, setVaults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [userHasPin, setUserHasPin] = useState(false);
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);

    // Audio Player State
    const [playingId, setPlayingId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlayPause = (id: string, url: string) => {
        if (playingId === id) {
            audioRef.current?.pause();
            setPlayingId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.play();
                setPlayingId(id);
            }
        }
    };

    useEffect(() => {
        checkPinStatus();
    }, []);

    const checkPinStatus = async () => {
        try {
            const { data: user } = await api.get('/user/me');
            setUserHasPin(!!user.vaultPin);
            setIsPinModalOpen(true);
        } catch (error) {
            console.error(error);
            setIsUnlocked(true); // Fallback em caso de erro no me
        }
    };

    useEffect(() => {
        if (isUnlocked) {
            loadVaults();
        }
    }, [isUnlocked]);

    const loadVaults = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/vault');
            // Ordenar por data mais recente
            setVaults(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar o cofre.");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePrivacy = async (id: string, currentStatus: boolean) => {
        try {
            await api.patch(`/vault/${id}/privacy`, { isPrivate: !currentStatus });
            loadVaults();
            toast.success(!currentStatus ? "Agora privado" : "Agora visível para a psicóloga");
        } catch (error) {
            toast.error("Erro ao alterar privacidade.");
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '24px', background: 'var(--co-lavender)', color: 'var(--co-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LockKeyhole size={24} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Cofre</h1>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Seus pensamentos seguros</p>
                    </div>
                </div>
            </header>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="animate-spin" /></div>
            ) : vaults.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--co-white)', borderRadius: '24px', border: '1px dashed var(--co-accent)' }}>
                    <p className="text-muted" style={{ marginBottom: '16px' }}>Seu cofre está vazio.</p>
                    <button className="btn-primary" style={{ padding: '12px 24px', borderRadius: '16px' }} onClick={() => navigate('/planner')}>Adicionar Reflexão</button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {vaults.map((vault) => (
                        <motion.div key={vault.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '24px', position: 'relative', borderLeft: vault.isPrivate ? 'none' : '4px solid var(--co-accent)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--co-text-muted)', fontWeight: 600 }}>
                                    {new Date(vault.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </span>
                                {vault.isGuided && (
                                    <span style={{ fontSize: '0.75rem', background: 'var(--co-primary)', color: '#fff', padding: '4px 8px', borderRadius: '12px', fontWeight: 600 }}>TCC Guiada</span>
                                )}
                            </div>

                            {vault.isGuided ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                                    <div><strong style={{ fontSize: '0.85rem', color: 'var(--co-text-muted)' }}>Situação:</strong><p style={{ fontSize: '0.95rem' }}>{vault.situation}</p></div>
                                    <div><strong style={{ fontSize: '0.85rem', color: 'var(--co-text-muted)' }}>Pensamento Automático:</strong><p style={{ fontSize: '0.95rem' }}>{vault.automaticThought}</p></div>
                                    <div><strong style={{ fontSize: '0.85rem', color: 'var(--co-text-muted)' }}>Emoção sentida:</strong><p style={{ fontSize: '0.95rem' }}>{vault.emotion}</p></div>
                                    <div><strong style={{ fontSize: '0.85rem', color: 'var(--co-text-muted)' }}>Como você reagiu:</strong><p style={{ fontSize: '0.95rem' }}>{vault.behavior}</p></div>
                                </div>
                            ) : vault.audioUrl ? (
                                    <div style={{ background: 'var(--co-lavender)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                                        <button 
                                            onClick={() => handlePlayPause(vault.id, vault.audioUrl)}
                                            style={{ background: 'var(--co-action)', border: 'none', width: '44px', height: '44px', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(149, 117, 205, 0.3)' }}
                                        >
                                            {playingId === vault.id ? <Pause size={20} color="white" /> : <Play size={20} color="white" style={{ marginLeft: '3px' }} />}
                                        </button>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px' }}>Nota de Voz</p>
                                            <div style={{ height: '4px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px', width: '100%', position: 'relative' }}>
                                                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: playingId === vault.id ? '100%' : '0%', background: 'var(--co-accent)', borderRadius: '2px', transition: playingId === vault.id ? 'width 10s linear' : 'none' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                <p style={{ fontSize: '1rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{vault.content}</p>
                            )}
            <audio ref={audioRef} onEnded={() => setPlayingId(null)} style={{ display: 'none' }} />

                            <span 
                                onClick={() => togglePrivacy(vault.id, vault.isPrivate)}
                                style={{ 
                                    position: 'absolute', top: '24px', right: '24px', fontSize: '0.68rem', fontWeight: 700, 
                                    color: vault.isPrivate ? 'var(--co-text-muted)' : '#2E7D32', 
                                    background: vault.isPrivate ? 'rgba(0,0,0,0.05)' : '#E8F5E9', 
                                    padding: '5px 10px', borderRadius: '10px', cursor: 'pointer',
                                    transition: 'all 0.2s ease', border: vault.isPrivate ? '1px solid transparent' : '1px solid #C8E6C9'
                                }}
                                title="Clique para alterar privacidade"
                            >
                                {vault.isPrivate ? 'Privado' : '✓ Liberado p/ Psicóloga'}
                            </span>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Float Button for Addition */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/planner')}
                style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '24px',
                    width: '64px',
                    height: '64px',
                    borderRadius: '32px',
                    backgroundColor: 'var(--co-text-dark)',
                    color: '#fff',
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

            <VaultPinModal
                isOpen={isPinModalOpen}
                userHasPin={userHasPin}
                onSuccess={() => {
                    setIsPinModalOpen(false);
                    setIsUnlocked(true);
                }}
            />
        </div>
    );
}
