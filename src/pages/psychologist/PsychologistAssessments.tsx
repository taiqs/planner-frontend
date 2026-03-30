import { useState, useEffect } from 'react';
import { PsychologistSidebar } from '../../components/PsychologistSidebar';
import { 
    Loader2, 
    Brain, 
    Calendar, 
    ChevronRight, 
    Trash2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface AssessmentResult {
    id: string;
    assessmentType: string;
    score: number;
    resultType: string;
    answers: any;
    createdAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        createdAt: string;
    };
}

export function PsychologistAssessments() {
    const [results, setResults] = useState<AssessmentResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<AssessmentResult | null>(null);

    const fetchResults = async () => {
        try {
            const response = await api.get('/assessments/all');
            setResults(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Deseja realmente excluir este registro de avaliação? Isso não poderá ser desfeito.")) return;

        try {
            await api.delete(`/assessments/${id}`);
            toast.success("Avaliação excluída!");
            setResults(prev => prev.filter(r => r.id !== id));
            setSelectedUser(null);
        } catch (error) {
            toast.error("Erro ao excluir avaliação.");
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--co-background)' }}>
            <PsychologistSidebar activePath="/psicologo/avaliacoes" />

            <main style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>
                <header style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2rem', color: 'var(--co-text-dark)', marginBottom: '8px' }}>Captação de Avaliações / Pré-Testes</h1>
                    <p className="text-muted">Acompanhe os resultados dos testes cognitivos preenchidos por pacientes e novos Leads.</p>
                </header>

                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="animate-spin" size={32} color="var(--co-accent)" /></div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        {/* Lista de Resultados */}
                        <div className="glass-panel" style={{ padding: '24px' }}>
                            <h2 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Brain size={20} color="var(--co-accent)" /> Últimas Avaliações</h2>

                            {results.length === 0 ? (
                                <p className="text-muted" style={{ textAlign: 'center', padding: '24px' }}>Nenhum pré-teste realizado ainda.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {results.map(res => (
                                        <div
                                            key={res.id}
                                            className="glass-panel"
                                            style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: selectedUser?.id === res.id ? '2px solid var(--co-accent)' : '2px solid transparent' }}
                                            onClick={() => setSelectedUser(res)}
                                        >
                                            <div>
                                                <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>{res.user.name}</h3>
                                                <p className="text-muted" style={{ fontSize: '0.85rem' }}>{res.resultType} (Score: {res.score})</p>
                                            </div>
                                            <ChevronRight size={20} color="var(--co-text-muted)" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Detalhes do Lead selecionado */}
                        <div>
                            {selectedUser ? (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '32px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                                        <div>
                                            <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{selectedUser.user.name}</h2>
                                            <p className="text-muted">{selectedUser.user.email}</p>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button 
                                                    onClick={() => handleDelete(selectedUser.id)}
                                                    style={{ background: '#FFEBEE', border: 'none', color: '#D32F2F', padding: '8px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    title="Excluir Avaliação"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <span style={{ display: 'inline-block', padding: '6px 12px', background: 'var(--co-lavender)', color: 'var(--co-primary)', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600, height: 'fit-content' }}>
                                                    {selectedUser.resultType}
                                                </span>
                                            </div>
                                            <p className="text-muted" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                                                <Calendar size={14} /> {new Date(selectedUser.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>Raio-X Cognitivo (Questionário)</h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {Object.entries(selectedUser.answers).map(([qKey, answer]: any, index) => (
                                            <div key={qKey} style={{ background: 'var(--co-background)', padding: '16px', borderRadius: '12px' }}>
                                                <p style={{ fontSize: '0.9rem', color: 'var(--co-text-muted)', marginBottom: '8px' }}>Pergunta {index + 1}</p>
                                                <p style={{ fontWeight: 500 }}>{answer}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="btn-primary" style={{ width: '100%', marginTop: '32px', padding: '16px' }}>
                                        Tornar Paciente Oficial / Entrar em Contato
                                    </button>
                                </motion.div>
                            ) : (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <p className="text-muted">Selecione uma avaliação para ver os detalhes da Mente do paciente.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
