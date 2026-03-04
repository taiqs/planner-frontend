import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Loader2, PenTool, List } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export function Planner() {
    const navigate = useNavigate();

    const [isGuided, setIsGuided] = useState(false);

    // Livro
    const [content, setContent] = useState('');

    // Guiado
    const [situation, setSituation] = useState('');
    const [automaticThought, setThought] = useState('');
    const [emotion, setEmotion] = useState('');
    const [behavior, setBehavior] = useState('');

    const [isPrivate, setIsPrivate] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasPsychologist, setHasPsychologist] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setHasPsychologist(!!user.psychologistId);
            } catch (e) {
                console.error("Erro ao ler usuário do storage", e);
            }
        }
    }, []);

    const handleSave = async () => {
        if (isGuided) {
            if (!situation || !automaticThought || !emotion || !behavior) {
                toast.error("Por favor, preencha todos os campos da reflexão guiada.");
                return;
            }
        } else {
            if (!content.trim()) {
                toast.error("O conteúdo não pode estar vazio.");
                return;
            }
        }

        setIsSaving(true);
        try {
            await api.post('/vault', {
                content: isGuided ? `Reflexão Guiada: ${situation}` : content, // fallback para listagem
                isPrivate,
                isGuided,
                situation,
                automaticThought,
                emotion,
                behavior
            });
            toast.success(isPrivate ? "Salvo no seu Cofre Privado!" : "Reflexão salva e compartilhada!");
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.error || "Erro ao salvar reflexão.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: '90px' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', paddingTop: '16px' }}>
                <button className="btn-secondary" style={{ padding: '10px 14px', borderRadius: '16px' }} onClick={() => navigate('/dashboard')}>
                    <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <h1 style={{ fontSize: '1.5rem' }}>Nova Reflexão</h1>
            </header>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'var(--co-bg-light)', padding: '6px', borderRadius: '20px' }}>
                <button
                    onClick={() => setIsGuided(false)}
                    style={{ flex: 1, padding: '12px', borderRadius: '14px', border: 'none', background: !isGuided ? 'var(--co-white)' : 'transparent', color: !isGuided ? 'var(--co-text)' : 'var(--co-text-muted)', fontWeight: !isGuided ? 'bold' : 'normal', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: !isGuided ? '0 4px 10px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.3s ease' }}
                >
                    <PenTool size={18} /> Texto Livre
                </button>
                <button
                    onClick={() => setIsGuided(true)}
                    style={{ flex: 1, padding: '12px', borderRadius: '14px', border: 'none', background: isGuided ? 'var(--co-white)' : 'transparent', color: isGuided ? 'var(--co-text)' : 'var(--co-text-muted)', fontWeight: isGuided ? 'bold' : 'normal', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: isGuided ? '0 4px 10px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.3s ease' }}
                >
                    <List size={18} /> Guiada
                </button>
            </div>

            <div className="glass-panel" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

                {!isGuided ? (
                    <>
                        <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Reflexão livre</label>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Escreva o que vier à mente...</h2>
                        <textarea
                            className="input-field"
                            placeholder="Como você se sentiu hoje?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{ flex: 1, minHeight: '150px', resize: 'none', background: 'transparent', border: 'none', boxShadow: 'none', padding: '0', fontSize: '1.1rem', lineHeight: '1.6' }}
                        ></textarea>
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '6px', display: 'block', fontWeight: 'bold' }}>1. A Situação</label>
                            <p style={{ fontSize: '0.85rem', marginBottom: '8px', color: 'var(--co-text-muted)' }}>Onde você estava e o que aconteceu?</p>
                            <textarea className="input-field" value={situation} onChange={e => setSituation(e.target.value)} placeholder="Ex: Estava na reunião do trabalho e me pediram para apresentar..." style={{ minHeight: '80px', fontSize: '1rem' }} />
                        </div>

                        <div>
                            <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '6px', display: 'block', fontWeight: 'bold' }}>2. Pensamento Automático</label>
                            <p style={{ fontSize: '0.85rem', marginBottom: '8px', color: 'var(--co-text-muted)' }}>O que passou pela sua cabeça na hora?</p>
                            <textarea className="input-field" value={automaticThought} onChange={e => setThought(e.target.value)} placeholder="Ex: 'Eles vão achar que eu não sei nada'" style={{ minHeight: '80px', fontSize: '1rem' }} />
                        </div>

                        <div>
                            <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '6px', display: 'block', fontWeight: 'bold' }}>3. Emoção</label>
                            <p style={{ fontSize: '0.85rem', marginBottom: '8px', color: 'var(--co-text-muted)' }}>O que você sentiu no corpo e qual foi a emoção?</p>
                            <textarea className="input-field" value={emotion} onChange={e => setEmotion(e.target.value)} placeholder="Ex: Ansiedade forte, coração disparado..." style={{ minHeight: '80px', fontSize: '1rem' }} />
                        </div>

                        <div>
                            <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '6px', display: 'block', fontWeight: 'bold' }}>4. Comportamento</label>
                            <p style={{ fontSize: '0.85rem', marginBottom: '8px', color: 'var(--co-text-muted)' }}>Como você reagiu à situação?</p>
                            <textarea className="input-field" value={behavior} onChange={e => setBehavior(e.target.value)} placeholder="Ex: Gaguejei muito e saí da sala correndo." style={{ minHeight: '80px', fontSize: '1rem' }} />
                        </div>
                    </div>
                )}

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {hasPsychologist && (
                            <>
                                <input
                                    type="checkbox"
                                    id="share"
                                    checked={!isPrivate}
                                    onChange={(e) => setIsPrivate(!e.target.checked)}
                                    style={{ accentColor: 'var(--co-accent-hover)', width: '18px', height: '18px' }}
                                />
                                <label htmlFor="share" className="text-muted" style={{ fontSize: '0.9rem' }}>Enviar para Psicóloga</label>
                            </>
                        )}
                    </div>
                    <button
                        className="btn-primary"
                        style={{ padding: '10px 20px', display: 'flex', gap: '8px', alignItems: 'center' }}
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? <Loader2 size={20} className="animate-spin" /> : 'Salvar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
