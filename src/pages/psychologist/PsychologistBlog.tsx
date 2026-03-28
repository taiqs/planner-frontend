import { useState, useEffect, useRef } from 'react';
import { PsychologistSidebar } from '../../components/PsychologistSidebar';
import { Plus, Image as ImageIcon, Send, LayoutTemplate, Loader2, X, MessageCircle, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { getProxyUrl } from '../../utils/fileProxy';

const BLOG_TEMPLATES = [
    {
        name: 'Lorem Ipsum Padrão',
        title: 'Entendendo a Ansiedade no Dia a Dia',
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Principais tópicos:
1. Origem dos pensamentos intrusivos.
2. Como a respiração diafragmática ajuda.
3. Quando buscar ajuda profissional.

Conclusão:
A jornada de autoconhecimento é contínua e você não precisa percorrê-la sozinho.`
    },
    {
        name: 'Dica de Bem-Estar',
        title: '5 Minutos para Resetar sua Mente',
        content: `Neste artigo, vamos explorar uma técnica rápida para momentos de estresse agudo.

1. Pare tudo o que está fazendo.
2. Observe 3 sons ao seu redor.
3. Sinta 3 texturas diferentes (sua roupa, a mesa, suas mãos).
4. Respire fundo 3 vezes.

Esta prática simples de Mindfulness (atenção plena) ajuda a trazer sua consciência de volta para o presente, reduzindo o fluxo de preocupações futuras.`
    }
];

export function PsychologistBlog() {
    const [isWriting, setIsWriting] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Ansiedade');
    const [customCategory, setCustomCategory] = useState('');
    const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);

    const [articles, setArticles] = useState<any[]>([]);
    const [isLoadingArticles, setIsLoadingArticles] = useState(true);
    const [isPublishing, setIsPublishing] = useState(false);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
    
    // Comments states
    const [selectedPostForComments, setSelectedPostForComments] = useState<any | null>(null);
    const [postComments, setPostComments] = useState<any[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [responses, setResponses] = useState<Record<string, string>>({});

    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setImageUrl(res.data.url);
            toast.success('Imagem de capa carregada!');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao fazer upload da imagem.');
        } finally {
            setIsUploading(false);
        }
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            const payload = {
                title,
                content,
                category: isAddingCustomCategory ? customCategory : category,
                imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80'
            };

            if (editingPostId) {
                await api.put(`/blog/${editingPostId}`, payload);
                toast.success('Artigo atualizado com sucesso!');
            } else {
                await api.post('/blog', payload);
                toast.success('Artigo publicado no feed de todos os usuários!');
            }
            
            setIsWriting(false);
            setEditingPostId(null);
            resetForm();
            fetchArticles();
        } catch (error) {
            console.error(error);
            toast.error(editingPostId ? "Erro ao atualizar artigo." : "Erro ao publicar artigo.");
        } finally {
            setIsPublishing(false);
        }
    };

    const handleEdit = (article: any) => {
        setEditingPostId(article.id);
        setTitle(article.title);
        setContent(article.content);
        setCategory(article.category);
        setImageUrl(article.imageUrl);
        setIsWriting(true);
    };

    const handleImageError = (id: string) => {
        setImageErrors(prev => ({ ...prev, [id]: true }));
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setCategory('Ansiedade');
        setCustomCategory('');
        setIsAddingCustomCategory(false);
        setImageUrl('');
    };

    const fetchPostComments = async (postId: string) => {
        setIsLoadingComments(true);
        try {
            const res = await api.get(`/blog/${postId}/comments`);
            setPostComments(res.data);
            // Initialize responses state with existing responses
            const initialResponses: any = {};
            res.data.forEach((c: any) => {
                initialResponses[c.id] = c.response || '';
            });
            setResponses(initialResponses);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar comentários.");
        } finally {
            setIsLoadingComments(false);
        }
    };

    const handleRespond = async (commentId: string) => {
        const responseText = responses[commentId];
        if (!responseText?.trim()) return;

        try {
            await api.patch(`/blog/comments/${commentId}/respond`, { response: responseText });
            toast.success("Resposta enviada com sucesso!");
            fetchPostComments(selectedPostForComments.id);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao enviar resposta.");
        }
    };

    const applyTemplate = (template: typeof BLOG_TEMPLATES[0]) => {
        setTitle(template.title);
        setContent(template.content);
        setShowTemplates(false);
        toast.success(`Template "${template.name}" aplicado!`);
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
                            {imageUrl && (
                                <div style={{ width: '100%', height: '250px', position: 'relative', overflow: 'hidden', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
                                    <img src={getProxyUrl(imageUrl)} alt="Capa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button 
                                        onClick={() => setImageUrl('')}
                                        style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer' }}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            )}

                            <div style={{ padding: '32px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <input
                                    type="text"
                                    placeholder="Título do Artigo..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{ width: '100%', fontSize: '2rem', fontWeight: 700, border: 'none', outline: 'none', background: 'transparent', marginBottom: '16px' }}
                                />
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
                                    {!isAddingCustomCategory ? (
                                        <select
                                            value={category}
                                            onChange={(e) => {
                                                if (e.target.value === 'ADD_NEW') {
                                                    setIsAddingCustomCategory(true);
                                                } else {
                                                    setCategory(e.target.value);
                                                }
                                            }}
                                            style={{ padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--co-lavender)', outline: 'none', fontSize: '0.9rem' }}
                                        >
                                            <option value="Ansiedade">Ansiedade</option>
                                            <option value="Depressão">Depressão</option>
                                            <option value="Relacionamentos">Relacionamentos</option>
                                            <option value="Bem-estar">Bem-estar</option>
                                            <option value="Informação">Informação</option>
                                            <option value="ADD_NEW">+ Nova Categoria...</option>
                                        </select>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <input 
                                                type="text" 
                                                placeholder="Nome da categoria..."
                                                value={customCategory}
                                                onChange={(e) => setCustomCategory(e.target.value)}
                                                style={{ padding: '8px 16px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', fontSize: '0.9rem' }}
                                                autoFocus
                                            />
                                            <button onClick={() => setIsAddingCustomCategory(false)} className="text-muted"><X size={18} /></button>
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleFileUpload} 
                                        style={{ display: 'none' }} 
                                        accept="image/*"
                                    />
                                    <button 
                                        className="btn-secondary" 
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', fontSize: '0.9rem' }}
                                    >
                                        {isUploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />} 
                                        {imageUrl ? 'Trocar Capa' : 'Adicionar Capa'}
                                    </button>
                                    <button 
                                        className="btn-secondary" 
                                        onClick={() => setShowTemplates(!showTemplates)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', fontSize: '0.9rem' }}
                                    >
                                        <LayoutTemplate size={16} /> Templates
                                    </button>

                                    {showTemplates && (
                                        <div style={{ position: 'absolute', top: '48px', left: '160px', width: '240px', background: 'white', border: '1px solid #ddd', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 10, padding: '8px' }}>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--co-text-muted)', padding: '8px', fontWeight: 600 }}>ESCOLHA UM MODELO</p>
                                            {BLOG_TEMPLATES.map(t => (
                                                <button 
                                                    key={t.name}
                                                    onClick={() => applyTemplate(t)}
                                                    style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', transition: 'background 0.2s' }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                                    onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                                                >
                                                    {t.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
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
                                <button className="btn-secondary" onClick={() => { setIsWriting(false); setEditingPostId(null); resetForm(); }}>Cancelar</button>
                                <button
                                    className="btn-primary"
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 32px', opacity: !title || !content || isPublishing ? 0.5 : 1 }}
                                    disabled={!title || !content || isPublishing}
                                    onClick={handlePublish}
                                >
                                    {isPublishing ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> {editingPostId ? 'Salvar Alterações' : 'Publicar Agora'}</>}
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
                                    <div key={article.id} className="glass-card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                                        {article.imageUrl && !imageErrors[article.id] && (
                                            <img 
                                                src={getProxyUrl(article.imageUrl)} 
                                                alt="Capa"
                                                onError={() => handleImageError(article.id)}
                                                style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
                                            />
                                        )}
                                        <div style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.8rem', color: 'var(--co-text-muted)', fontWeight: 600 }}>
                                                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                    <span style={{ color: 'var(--co-action)' }}>{article.category}</span>
                                                    <button 
                                                        onClick={() => handleEdit(article)}
                                                        style={{ background: 'var(--co-lavender)', border: 'none', padding: '4px 8px', borderRadius: '8px', fontSize: '0.7rem', color: 'var(--co-action)', cursor: 'pointer', fontWeight: 700 }}
                                                    >
                                                        EDITAR
                                                    </button>
                                                </div>
                                            </div>
                                            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', lineHeight: 1.3 }}>{article.title}</h3>
                                            <p style={{ color: 'var(--co-text-muted)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '20px' }}>{article.content.substring(0, 100)}...</p>
                                            
                                            <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '16px', display: 'flex', justifyContent: 'center' }}>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedPostForComments(article);
                                                        fetchPostComments(article.id);
                                                    }}
                                                    style={{ background: 'none', border: 'none', color: 'var(--co-action)', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                                                >
                                                    <MessageCircle size={18} /> Ver Comentários
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Comments Sidebar/Modal */}
                {selectedPostForComments && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setSelectedPostForComments(null)}>
                        <div 
                            style={{ width: '100%', maxWidth: '450px', background: 'white', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ padding: '24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Interações Privadas</h3>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{selectedPostForComments.title}</p>
                                </div>
                                <button onClick={() => setSelectedPostForComments(null)} style={{ background: '#f5f5f5', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer' }}><X size={20} /></button>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                                {isLoadingComments ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="animate-spin" size={32} /></div>
                                ) : postComments.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                        <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                                        <p>Nenhuma dúvida ou reflexão enviada para este post ainda.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                        {postComments.map(comment => (
                                            <div key={comment.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: '16px', background: 'var(--co-lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--co-action)', fontWeight: 800, fontSize: '0.8rem' }}>
                                                            {comment.user?.name?.charAt(0) || 'U'}
                                                        </div>
                                                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{comment.user?.name || 'Usuário'}</span>
                                                    </div>
                                                    <span style={{ fontSize: '0.75rem', color: '#999' }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                </div>

                                                <div style={{ background: '#f9f9f9', padding: '16px', borderRadius: '16px', fontSize: '0.95rem', color: '#333', lineHeight: 1.5 }}>
                                                    {comment.content}
                                                </div>

                                                <div style={{ position: 'relative' }}>
                                                    <textarea 
                                                        placeholder="Sua resposta exclusiva..."
                                                        value={responses[comment.id] || ''}
                                                        onChange={e => setResponses({ ...responses, [comment.id]: e.target.value })}
                                                        style={{ width: '100%', height: '80px', padding: '12px 16px', borderRadius: '16px', border: '1px solid #ddd', background: '#fff', fontSize: '0.9rem', resize: 'none', transition: 'border 0.2s' }}
                                                    />
                                                    <button 
                                                        onClick={() => handleRespond(comment.id)}
                                                        disabled={!responses[comment.id]?.trim()}
                                                        style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'var(--co-action)', color: 'white', border: 'none', borderRadius: '10px', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', opacity: !responses[comment.id]?.trim() ? 0.5 : 1 }}
                                                    >
                                                        Responder
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
