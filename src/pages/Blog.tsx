import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, BookOpen, Clock, Tag, Loader2 } from 'lucide-react';
import api from '../services/api';

export function Blog() {
    const navigate = useNavigate();
    const [articles, setArticles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await api.get('/blog');
                setArticles(res.data);
            } catch (error) {
                console.error("Erro ao carregar artigos do blog", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticles();
    }, []);

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', paddingTop: '16px' }}>
                <button
                    className="btn-secondary"
                    style={{ padding: '10px 14px', borderRadius: '16px' }}
                    onClick={() => navigate('/dashboard')}
                >
                    <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Conteúdos</h1>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>Artigos da sua clínica</p>
                </div>
                <div style={{ background: 'var(--co-lavender)', padding: '10px', borderRadius: '16px' }}>
                    <BookOpen size={24} color="var(--co-accent-hover)" />
                </div>
            </header>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="animate-spin" size={32} color="var(--co-accent)" /></div>
            ) : articles.length === 0 ? (
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                    <p className="text-muted">Nenhum artigo publicado pela sua psicóloga ainda.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {articles.map(article => (
                        <article key={article.id} className="glass-card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s ease' }}>
                            <div style={{ height: '140px', background: `url(${article.imageUrl || 'https://images.unsplash.com/photo-1541480601022-2308c0f01587?auto=format&fit=crop&q=80'}) center/cover no-repeat` }} />

                            <div style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <span style={{ background: 'var(--co-primary-bg)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--co-action)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Tag size={12} /> {article.category || 'Saúde Mental'}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--co-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={12} /> {new Date(article.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <h2 style={{ fontSize: '1.2rem', marginBottom: '8px', lineHeight: 1.3 }}>{article.title}</h2>
                                <p style={{ fontSize: '0.9rem', color: 'var(--co-text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                                    {article.content.substring(0, 100)}...
                                </p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '16px' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: 'var(--co-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--co-text-dark)', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                        {article.author?.name?.charAt(0) || 'P'}
                                    </div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--co-text-dark)' }}>{article.author?.name || 'Psicóloga'}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
