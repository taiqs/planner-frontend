import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    DollarSign,
    Plus,
    CheckCircle,
    Clock,
    Trash2,
    Loader2,
    TrendingUp
} from 'lucide-react';
import { PsychologistSidebar } from '../../components/PsychologistSidebar';
import api from '../../services/api';
import toast from 'react-hot-toast';

export function PsychologistFinancial() {
    const [records, setRecords] = useState<any[]>([]);
    const [summary, setSummary] = useState<any>({ paid: 0, pending: 0, total: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [patients, setPatients] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        userId: '',
        amount: '',
        description: '',
        category: 'THERAPY_MONTHLY',
        status: 'PAID',
        date: new Date().toISOString().split('T')[0],
        type: 'INCOME'
    });

    useEffect(() => {
        fetchData();
        fetchPatients();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [recordsRes, summaryRes] = await Promise.all([
                api.get('/financial'),
                api.get('/financial/summary')
            ]);
            setRecords(recordsRes.data);
            setSummary(summaryRes.data);
        } catch (error) {
            toast.error("Erro ao carregar dados financeiros.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPatients = async () => {
        try {
            const res = await api.get('/psychologist/patients');
            setPatients(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.post('/financial', formData);
            toast.success("Lançamento realizado!");
            setShowAddModal(false);
            setFormData({
                userId: '',
                amount: '',
                description: '',
                category: 'THERAPY_MONTHLY',
                status: 'PAID',
                date: new Date().toISOString().split('T')[0],
                type: 'INCOME'
            });
            fetchData();
        } catch (error) {
            toast.error("Erro ao salvar lançamento.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await api.put(`/financial/${id}`, { status });
            toast.success("Status atualizado!");
            fetchData();
        } catch (error) {
            toast.error("Erro ao atualizar status.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este registro?")) return;
        try {
            await api.delete(`/financial/${id}`);
            toast.success("Registro excluído.");
            fetchData();
        } catch (error) {
            toast.error("Erro ao excluir.");
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <div className="psi-layout">
            <PsychologistSidebar activePath="financeiro" />

            <main className="psi-main">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Financeiro</h2>
                        <p className="text-muted">Gestão de pagamentos e faturamento mensal.</p>
                    </div>
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        <Plus size={20} /> Novo Lançamento
                    </button>
                </header>

                {/* Cards de Resumo */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                    <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #4CAF50' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span className="text-muted" style={{ fontSize: '0.9rem' }}>Recebido (Mês)</span>
                            <TrendingUp size={20} color="#4CAF50" />
                        </div>
                        <h3 style={{ fontSize: '1.5rem' }}>{formatCurrency(summary.paid)}</h3>
                    </div>
                    <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #FF9800' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span className="text-muted" style={{ fontSize: '0.9rem' }}>Pendente</span>
                            <Clock size={20} color="#FF9800" />
                        </div>
                        <h3 style={{ fontSize: '1.5rem' }}>{formatCurrency(summary.pending)}</h3>
                    </div>
                    <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid var(--co-action)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span className="text-muted" style={{ fontSize: '0.9rem' }}>Total Previsto</span>
                            <DollarSign size={20} color="var(--co-action)" />
                        </div>
                        <h3 style={{ fontSize: '1.5rem' }}>{formatCurrency(summary.total)}</h3>
                    </div>
                </div>

                {/* Tabela de Registros */}
                <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#F8F9FA', fontSize: '0.85rem', color: 'var(--co-text-muted)', textTransform: 'uppercase' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px' }}>Data</th>
                                    <th style={{ padding: '16px 24px' }}>Paciente / Descrição</th>
                                    <th style={{ padding: '16px 24px' }}>Categoria</th>
                                    <th style={{ padding: '16px 24px' }}>Valor</th>
                                    <th style={{ padding: '16px 24px' }}>Status</th>
                                    <th style={{ padding: '16px 24px' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody style={{ fontSize: '0.95rem' }}>
                                {records.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>
                                            {isLoading ? <Loader2 className="animate-spin" style={{ margin: '0 auto' }} /> : 'Nenhum lançamento encontrado.'}
                                        </td>
                                    </tr>
                                ) : (
                                    records.map((record) => (
                                        <tr key={record.id} style={{ borderBottom: '1px solid #EEE' }}>
                                            <td style={{ padding: '16px 24px' }}>
                                                {new Date(record.date).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ fontWeight: 600 }}>{record.user?.name || 'Venda Avulsa'}</div>
                                                <div className="text-muted" style={{ fontSize: '0.8rem' }}>{record.description}</div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={{ 
                                                    padding: '4px 10px', 
                                                    borderRadius: '20px', 
                                                    fontSize: '0.75rem', 
                                                    background: record.category === 'NEURO_EVAL' ? '#E3F2FD' : '#F3E5F5',
                                                    color: record.category === 'NEURO_EVAL' ? '#1976D2' : '#7B1FA2'
                                                }}>
                                                    {record.category === 'NEURO_EVAL' ? 'Avaliação' : 'Mensalidade'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 24px', fontWeight: 700 }}>
                                                {formatCurrency(record.amount)}
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '6px', 
                                                    color: record.status === 'PAID' ? '#4CAF50' : '#FF9800',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600
                                                }}>
                                                    {record.status === 'PAID' ? <CheckCircle size={16} /> : <Clock size={16} />}
                                                    {record.status === 'PAID' ? 'Pago' : 'Pendente'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {record.status === 'PENDING' && (
                                                        <button 
                                                            style={{ background: 'none', border: 'none', color: '#4CAF50', cursor: 'pointer', padding: '4px' }}
                                                            onClick={() => handleUpdateStatus(record.id, 'PAID')}
                                                            title="Marcar como Pago"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    )}
                                                    <button 
                                                        style={{ background: 'none', border: 'none', color: '#D32F2F', cursor: 'pointer', padding: '4px' }}
                                                        onClick={() => handleDelete(record.id)}
                                                        title="Excluir"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Modal Novo Lançamento */}
            {showAddModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', background: 'white', padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '1.3rem' }}>Novo Lançamento</h3>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowAddModal(false)}>Fechar</button>
                        </div>

                        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label className="text-muted" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Paciente (Opcional)</label>
                                <select 
                                    className="input-field" 
                                    value={formData.userId} 
                                    onChange={e => setFormData({ ...formData, userId: e.target.value })}
                                >
                                    <option value="">Entrada Avulsa / Sem Paciente</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label className="text-muted" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Valor (R$)</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        className="input-field"
                                        placeholder="0,00"
                                        required
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-muted" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Data</label>
                                    <input 
                                        type="date" 
                                        className="input-field"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-muted" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Categoria</label>
                                <select 
                                    className="input-field"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="THERAPY_MONTHLY">Mensalidade Terapia</option>
                                    <option value="NEURO_EVAL">Avaliação Neuropsicológica</option>
                                    <option value="OTHER">Outros</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-muted" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Descrição</label>
                                <input 
                                    type="text" 
                                    className="input-field"
                                    placeholder="Ex: Sessão avulsa, Relatório..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-muted" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Status Inicial</label>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button 
                                        type="button"
                                        style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #EEE', background: formData.status === 'PAID' ? '#E8F5E9' : 'white' }}
                                        onClick={() => setFormData({ ...formData, status: 'PAID' })}
                                    >
                                        Pago
                                    </button>
                                    <button 
                                        type="button"
                                        style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #EEE', background: formData.status === 'PENDING' ? '#FFF3E0' : 'white' }}
                                        onClick={() => setFormData({ ...formData, status: 'PENDING' })}
                                    >
                                        Pendente
                                    </button>
                                </div>
                            </div>

                            <button className="btn-primary" type="submit" style={{ marginTop: '16px' }} disabled={isSaving}>
                                {isSaving ? <Loader2 className="animate-spin" /> : 'Confirmar Lançamento'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
