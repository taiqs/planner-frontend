import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export function Planner() {
    const navigate = useNavigate();
    const [content, setContent] = useState('');
    const [isPrivate, setIsPrivate] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!content.trim()) {
            toast.error("O conteúdo não pode estar vazio.");
            return;
        }

        setIsSaving(true);
        try {
            await api.post('/vault', {
                content,
                isPrivate
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
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', paddingTop: '16px' }}>
                <button className="btn-secondary" style={{ padding: '10px 14px', borderRadius: '16px' }} onClick={() => navigate('/dashboard')}>
                    <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <h1 style={{ fontSize: '1.5rem' }}>Nova Reflexão</h1>
            </header>

            <div className="glass-panel" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Reflexão guiada</label>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Qual foi o principal desafio de hoje?</h2>

                <textarea
                    className="input-field"
                    placeholder="Escreva como você se sentiu..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ flex: 1, minHeight: '150px', resize: 'none', background: 'transparent', border: 'none', boxShadow: 'none', padding: '0', fontSize: '1.1rem', lineHeight: '1.6' }}
                ></textarea>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            id="share"
                            checked={!isPrivate}
                            onChange={(e) => setIsPrivate(!e.target.checked)}
                            style={{ accentColor: 'var(--co-accent-hover)', width: '18px', height: '18px' }}
                        />
                        <label htmlFor="share" className="text-muted" style={{ fontSize: '0.9rem' }}>Enviar para Psicóloga ler na sessão</label>
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
