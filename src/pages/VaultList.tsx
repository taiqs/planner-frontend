import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockKeyhole, Loader2, Plus } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export function VaultList() {
    const navigate = useNavigate();
    const [vaults, setVaults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadVaults();
    }, []);

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
                            ) : (
                                <p style={{ fontSize: '1rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{vault.content}</p>
                            )}

                            <span style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '0.7rem', fontWeight: 600, color: vault.isPrivate ? 'var(--co-text-muted)' : 'var(--co-success-text)', background: vault.isPrivate ? 'rgba(0,0,0,0.05)' : '#E8F5E9', padding: '4px 8px', borderRadius: '8px' }}>
                                {vault.isPrivate ? 'Privado' : 'Visível p/ Psicóloga'}
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
        </div>
    );
}
