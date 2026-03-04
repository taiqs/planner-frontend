import { useState, useEffect } from 'react';
import { PsychologistSidebar } from '../../components/PsychologistSidebar';
import { Plus, Image, Send, LayoutTemplate, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { getProxyUrl } from '../../utils/fileProxy';

export function PsychologistBlog() {
    const [isWriting, setIsWriting] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Ansiedade');

    const [articles, setArticles] = useState<any[]>([]);
    const [isLoadingArticles, setIsLoadingArticles] = useState(true);
    const [isPublishing, setIsPublishing] = useState(false);

    const fetchArticles = async () => {
        setIsLoadingArticles(true);
        try {
            const res = await api.get('/blog');
            setArticles(res.data);
        } catch (error) {
            console.error("Erro ao carregar blog", error);
            toast.error("Erro ao carregar os artigos.");
        } finally {
            setIsLoadingArticles(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            await api.post('/blog', {
                title,
                content,
                category,
                imageUrl: 'https://images.unsplash.com/photo-1541480601022-2308c0f01587?auto=format&fit=crop&q=80' // Mock Image
            });
            toast.success('Artigo publicado no feed de todos os pacientes!');
            setIsWriting(false);
            setTitle('');
            setContent('');
            fetchArticles();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao publicar artigo.");
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="psi-layout">
            <PsychologistSidebar activePath="/psicologo/blog" />

            <main className="psi-main" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', color: 'var(--co-text-dark)' }}>Publicações</h1>
                        <p className="text-muted" style={{ fontSize: '0.95rem' }}>Compartilhe conhecimento psicoeducativo com sua base</p>
                    </div>

                    {!isWriting && (
                        <button
                            className="btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '16px' }}
                            onClick={() => setIsWriting(true)}
                        >
                            <Plus size={20} />
                            <span>Novo Artigo</span>
                        </button>
                    )}
                </header>

                <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '40px' }}>
                    {isWriting ? (
                        <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--co-white)' }}>
                            <div style={{ padding: '32px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <input
                                    type="text"
                                    placeholder="Título do Artigo..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{ width: '100%', fontSize: '2rem', fontWeight: 700, border: 'none', outline: 'none', background: 'transparent', marginBottom: '16px' }}
                                />
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        style={{ padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--co-lavender)', outline: 'none', fontSize: '0.9rem' }}
                                    >
                                        <option value="Ansiedade">Ansiedade</option>
                                        <option value="Depressão">Depressão</option>
                                        <option value="Relacionamentos">Relacionamentos</option>
                                        <option value="Bem-estar">Bem-estar</option>
                                        <option value="Informação">Informação</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', fontSize: '0.9rem' }}>
                                        <Image size={16} /> Adicionar Capa
                                    </button>
                                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', fontSize: '0.9rem' }}>
                                        <LayoutTemplate size={16} /> Templates
                                    </button>
                                </div>
                            </div>

                            <div style={{ padding: '32px' }}>
                                <textarea
                                    placeholder="Comece a escrever o conteúdo terapêutico aqui..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    style={{ width: '100%', minHeight: '400px', fontSize: '1.1rem', lineHeight: 1.6, border: 'none', outline: 'none', background: 'transparent', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ padding: '24px 32px', background: 'var(--co-primary-bg)', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button className="btn-secondary" onClick={() => setIsWriting(false)}>Cancelar</button>
                                <button
                                    className="btn-primary"
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 32px', opacity: !title || !content || isPublishing ? 0.5 : 1 }}
                                    disabled={!title || !content || isPublishing}
                                    onClick={handlePublish}
                                >
                                    {isPublishing ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Publicar Agora</>}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                            {/* Card Post Vazio Estilizado */}
                            <div className="glass-card" style={{ border: '2px dashed rgba(0,0,0,0.1)', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '340px', cursor: 'pointer' }} onClick={() => setIsWriting(true)}>
                                <div style={{ background: 'var(--co-white)', padding: '16px', borderRadius: '50%', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                    <Plus size={32} color="var(--co-action)" />
                                </div>
                                <h3 style={{ fontSize: '1.1rem', color: 'var(--co-text-dark)' }}>Nova Publicação</h3>
                                <p style={{ color: 'var(--co-text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '8px', maxWidth: '200px' }}>Escreva um artigo para ajudar seus pacientes fora da sessão</p>
                            </div>

                            {isLoadingArticles ? (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '340px', gridColumn: 'span 1' }}><Loader2 className="animate-spin" size={32} /></div>
                            ) : (
                                articles.map(article => (
                                    <div key={article.id} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                                        <div style={{ height: '160px', background: `url(${getProxyUrl(article.imageUrl)}) center/cover` }} />
                                        <div style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.8rem', color: 'var(--co-text-muted)', fontWeight: 600 }}>
                                                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                                                <span style={{ color: 'var(--co-action)' }}>{article.category}</span>
                                            </div>
                                            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', lineHeight: 1.3 }}>{article.title}</h3>
                                            <p style={{ color: 'var(--co-text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>{article.content.substring(0, 100)}...</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
