import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, BookOpen, Clock, Tag, Loader2, X, Send, MessageCircle, Lock as LockIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { getProxyUrl } from '../utils/fileProxy';

export function Blog() {
    const navigate = useNavigate();
    const [articles, setArticles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
    const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSendingComment, setIsSendingComment] = useState(false);

    const handleImageError = (id: string) => {
        setImageErrors(prev => ({ ...prev, [id]: true }));
    };

    useEffect(() => {
        fetchArticles();
    }, []);

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

    const fetchComments = async (postId: string) => {
        try {
            const res = await api.get(`/blog/${postId}/comments`);
            setComments(res.data);
        } catch (error) {
            console.error("Erro ao buscar comentários", error);
        }
    };

    const handleSendComment = async () => {
        if (!newComment.trim() || !selectedArticle) return;
        setIsSendingComment(true);
        try {
            await api.post('/blog/comments', {
                postId: selectedArticle.id,
                content: newComment
            });
            setNewComment('');
            toast.success('Comentário enviado! Apenas a Dra. verá sua mensagem.');
            fetchComments(selectedArticle.id);
        } catch (error) {
            toast.error('Erro ao enviar comentário.');
        } finally {
            setIsSendingComment(false);
        }
    };

    const openArticle = (article: any) => {
        setSelectedArticle(article);
        fetchComments(article.id);
    };

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
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>Artigos da Ponto e Vírgula</p>
                </div>
                <div style={{ background: 'var(--co-lavender)', padding: '10px', borderRadius: '16px' }}>
                    <BookOpen size={24} color="var(--co-accent-hover)" />
                </div>
            </header>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="animate-spin" size={32} color="var(--co-accent)" /></div>
            ) : articles.length === 0 ? (
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                    <p className="text-muted">Nenhum artigo publicado ainda.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {articles.map(article => (
                        <article
                            key={article.id}
                            className="glass-card"
                            onClick={() => openArticle(article)}
                            style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s ease' }}
                        >
                            {article.imageUrl && !imageErrors[article.id] && (
                                <img
                                    src={getProxyUrl(article.imageUrl)}
                                    alt="Capa"
                                    onError={() => handleImageError(article.id)}
                                    style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                                />
                            )}

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

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: 'var(--co-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--co-text-dark)', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                            {article.author?.name?.charAt(0) || 'P'}
                                        </div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--co-text-dark)' }}>{article.author?.name || 'Psicóloga'}</span>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--co-action)', fontWeight: 700 }}>LER MAIS</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {selectedArticle && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}
                        onClick={() => setSelectedArticle(null)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{ width: '100%', maxWidth: '600px', height: '92vh', background: 'var(--co-primary-bg)', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', display: 'flex', flexDirection: 'column', position: 'relative' }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <BookOpen size={20} color="var(--co-action)" />
                                    <span style={{ fontSize: '1rem', fontWeight: 800 }}>Artigo Completo</span>
                                </div>
                                <button
                                    onClick={() => setSelectedArticle(null)}
                                    style={{ background: 'var(--co-lavender)', border: 'none', width: '40px', height: '40px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                    <X size={20} color="var(--co-action)" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                                {selectedArticle.imageUrl && !imageErrors[selectedArticle.id] && (
                                    <img
                                        src={getProxyUrl(selectedArticle.imageUrl)}
                                        alt="Capa"
                                        style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '24px', marginBottom: '24px' }}
                                    />
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <span style={{ background: 'var(--co-lavender)', padding: '6px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--co-action)' }}>
                                        {selectedArticle.category}
                                    </span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--co-text-muted)' }}>
                                        {new Date(selectedArticle.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--co-text-dark)', marginBottom: '24px', lineHeight: 1.15 }}>{selectedArticle.title}</h1>

                                <div style={{ fontSize: '1.1rem', color: 'var(--co-text-dark)', lineHeight: 1.7, marginBottom: '48px', whiteSpace: 'pre-wrap' }}>
                                    {selectedArticle.content}
                                </div>

                                {/* Comments Section */}
                                <div style={{ borderTop: '2px solid rgba(0,0,0,0.05)', paddingTop: '32px', marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                        <MessageCircle size={24} color="var(--co-action)" />
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Dúvidas & Reflexões</h3>
                                    </div>

                                    {/* Privacy Warning */}
                                    <div style={{ background: '#FFF9C4', padding: '16px', borderRadius: '16px', borderLeft: '4px solid #FBC02D', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                        <LockIcon size={20} color="#FBC02D" style={{ marginTop: '2px' }} />
                                        <p style={{ fontSize: '0.85rem', margin: 0, color: '#5D4037', fontWeight: 500 }}>
                                            <strong>Espaço Seguro:</strong> Seu comentário é privado e será visto APENAS pela Dra. Tailiny. Outros usuários não têm acesso a esta conversa.
                                        </p>
                                    </div>

                                    {/* Comment Form */}
                                    <div style={{ position: 'relative', marginBottom: '32px' }}>
                                        <textarea
                                            placeholder="O que você achou deste tema? Deixe sua dúvida..."
                                            value={newComment}
                                            onChange={e => setNewComment(e.target.value)}
                                            style={{ width: '100%', height: '100px', padding: '16px', borderRadius: '20px', border: '1.5px solid rgba(0,0,0,0.1)', background: 'white', fontSize: '0.95rem', resize: 'none' }}
                                        />
                                        <button
                                            onClick={handleSendComment}
                                            disabled={!newComment.trim() || isSendingComment}
                                            style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'var(--co-action)', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, opacity: !newComment.trim() ? 0.5 : 1 }}
                                        >
                                            {isSendingComment ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Enviar</>}
                                        </button>
                                    </div>

                                    {/* Comment List */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
                                        {comments.length === 0 ? (
                                            <p style={{ textAlign: 'center', color: 'var(--co-text-muted)', fontSize: '0.9rem' }}>Nenhuma interação ainda. Seja o primeiro a refletir sobre este tema!</p>
                                        ) : comments.map(comment => (
                                            <div key={comment.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {/* User Comment */}
                                                <div style={{ alignSelf: 'flex-end', maxWidth: '85%', background: 'var(--co-lavender)', padding: '14px 18px', borderRadius: '20px 20px 4px 20px', boxShadow: '0 4px 12px rgba(149, 117, 205, 0.1)' }}>
                                                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--co-text-dark)' }}>{comment.content}</p>
                                                    <span style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '4px', display: 'block', textAlign: 'right' }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                </div>

                                                {/* Psychologist Response */}
                                                {comment.response && (
                                                    <div style={{ alignSelf: 'flex-start', maxWidth: '85%', background: 'white', padding: '16px 20px', borderRadius: '4px 20px 20px 20px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', position: 'relative' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                                            <div style={{ width: '20px', height: '20px', background: 'var(--co-accent)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800 }}>D</div>
                                                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--co-action)' }}>Dra. Tailiny Quirino</span>
                                                        </div>
                                                        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--co-text-dark)', fontWeight: 500 }}>{comment.response}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
