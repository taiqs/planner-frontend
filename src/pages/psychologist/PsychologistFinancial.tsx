import { useState, useEffect, useMemo } from 'react';
import { 
    DollarSign,
    Plus,
    CheckCircle,
    Clock,
    Trash2,
    Loader2,
    TrendingUp,
    Filter,
    Download,
    Calendar,
    X,
    FileText
} from 'lucide-react';
import { PsychologistSidebar } from '../../components/PsychologistSidebar';
import api from '../../services/api';
import toast from 'react-hot-toast';

export function PsychologistFinancial() {
    const [records, setRecords] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [patients, setPatients] = useState<any[]>([]);

    // Filter State
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // 1-12
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');

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

    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    useEffect(() => {
        fetchData();
        fetchPatients();
    }, [selectedMonth, selectedYear, filterCategory, filterStatus]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Calculate start and end date for the selected month
            const firstDay = new Date(selectedYear, selectedMonth - 1, 1).toISOString();
            const lastDay = new Date(selectedYear, selectedMonth, 0, 23, 59, 59).toISOString();

            const queryParams = new URLSearchParams();
            queryParams.append('startDate', firstDay);
            queryParams.append('endDate', lastDay);
            if (filterCategory !== 'ALL') queryParams.append('category', filterCategory);
            if (filterStatus !== 'ALL') queryParams.append('status', filterStatus);

            const res = await api.get(`/financial?${queryParams.toString()}`);
            setRecords(res.data);
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

    // Calculate summary based on current records (more reactive than a separate API call when filtering)
    const summary = useMemo(() => {
        const paid = records.filter(r => r.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0);
        const pending = records.filter(r => r.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0);
        return { paid, pending, total: paid + pending };
    }, [records]);

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

    const handlePrint = () => {
        window.print();
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const progressValue = summary.total > 0 ? (summary.paid / summary.total) * 100 : 0;

    return (
        <div className="psi-layout">
            <PsychologistSidebar activePath="financeiro" />

            <main className="psi-main printable-area">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }} className="no-print">
                    <div>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Gestão Financeira</h2>
                        <p className="text-muted">Acompanhamento de faturamento, recebíveis e histórico de transações.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn-secondary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Download size={18} /> Exportar PDF
                        </button>
                        <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Plus size={20} /> Novo Lançamento
                        </button>
                    </div>
                </header>

                {/* Print Header */}
                <div className="print-only" style={{ marginBottom: '40px', borderBottom: '2px solid #EEE', paddingBottom: '20px' }}>
                    <h1 style={{ fontSize: '2rem' }}>Relatório Financeiro - {months[selectedMonth - 1]} / {selectedYear}</h1>
                    <p style={{ color: '#666' }}>Documento gerado em {new Date().toLocaleDateString('pt-BR')}</p>
                </div>

                {/* Cards de Resumo */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                    <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ background: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', padding: '10px', borderRadius: '12px' }}>
                                <TrendingUp size={24} />
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>RECEBIDO</span>
                                <h3 style={{ fontSize: '1.8rem', color: '#2E7D32' }}>{formatCurrency(summary.paid)}</h3>
                            </div>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${progressValue}%`, background: '#4CAF50', transition: 'width 0.5s ease' }}></div>
                        </div>
                        <p style={{ fontSize: '0.75rem', marginTop: '8px', color: '#666' }}>{progressValue.toFixed(1)}% do total previsto realizado.</p>
                    </div>

                    <div className="glass-panel" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ background: 'rgba(255, 152, 0, 0.1)', color: '#FF9800', padding: '10px', borderRadius: '12px' }}>
                                <Clock size={24} />
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>A RECEBER</span>
                                <h3 style={{ fontSize: '1.8rem', color: '#E65100' }}>{formatCurrency(summary.pending)}</h3>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#666' }}>{records.filter(r => r.status === 'PENDING').length} lançamentos pendentes neste período.</p>
                    </div>

                    <div className="glass-panel" style={{ padding: '24px', background: 'var(--co-serene-blue)', border: 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ background: 'rgba(124, 77, 255, 0.1)', color: 'var(--co-accent)', padding: '10px', borderRadius: '12px' }}>
                                <DollarSign size={24} />
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>TOTAL PREVISTO</span>
                                <h3 style={{ fontSize: '1.8rem' }}>{formatCurrency(summary.total)}</h3>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#666' }}>Faturamento bruto estimado para o mês.</p>
                    </div>
                </div>

                {/* Filtros */}
                <div className="glass-panel no-print" style={{ padding: '20px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={18} className="text-muted" />
                        <select 
                            className="input-field" 
                            style={{ padding: '8px 12px', minWidth: '140px' }}
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        >
                            {months.map((m, i) => (
                                <option key={m} value={i + 1}>{m}</option>
                            ))}
                        </select>
                        <select 
                            className="input-field" 
                            style={{ padding: '8px 12px', minWidth: '100px' }}
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                        >
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ height: '24px', width: '1px', background: 'rgba(0,0,0,0.1)' }}></div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Filter size={18} className="text-muted" />
                        <select 
                            className="input-field" 
                            style={{ padding: '8px 12px' }}
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="ALL">Todas Categorias</option>
                            <option value="THERAPY_MONTHLY">Mensalidade</option>
                            <option value="NEURO_EVAL">Avaliação</option>
                            <option value="OTHER">Outros</option>
                        </select>

                        <select 
                            className="input-field" 
                            style={{ padding: '8px 12px' }}
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="ALL">Todos Status</option>
                            <option value="PAID">Pagos</option>
                            <option value="PENDING">Pendentes</option>
                        </select>
                    </div>

                    {(filterCategory !== 'ALL' || filterStatus !== 'ALL') && (
                        <button 
                            style={{ border: 'none', background: 'transparent', color: 'var(--co-accent)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => { setFilterCategory('ALL'); setFilterStatus('ALL'); }}
                        >
                            <X size={14} /> Limpar Filtros
                        </button>
                    )}
                </div>

                {/* Tabela de Registros */}
                <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#F8F9FA', fontSize: '0.85rem', color: 'var(--co-text-muted)', textTransform: 'uppercase' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px' }}>Data</th>
                                    <th style={{ padding: '16px 24px' }}>Paciente / Descrição</th>
                                    <th style={{ padding: '16px 24px' }}>Categoria</th>
                                    <th style={{ padding: '16px 24px' }}>Valor</th>
                                    <th style={{ padding: '16px 24px' }}>Status</th>
                                    <th style={{ padding: '16px 24px' }} className="no-print">Ações</th>
                                </tr>
                            </thead>
                            <tbody style={{ fontSize: '0.95rem' }}>
                                {records.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '60px', textAlign: 'center' }}>
                                            {isLoading ? (
                                                <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto' }} color="var(--co-accent)" />
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                                    <FileText size={48} color="#DDD" />
                                                    <p className="text-muted" style={{ fontSize: '1rem' }}>Nenhum lançamento encontrado para este período.</p>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    records.map((record) => (
                                        <tr key={record.id} style={{ borderBottom: '1px solid #F0F0F0', transition: 'background 0.2s' }} className="table-row-hover">
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ fontWeight: 500 }}>{new Date(record.date).toLocaleDateString('pt-BR')}</div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ fontWeight: 600, color: 'var(--co-text-dark)' }}>{record.user?.name || 'Venda Avulsa'}</div>
                                                <div className="text-muted" style={{ fontSize: '0.8rem' }}>{record.description || 'Sem descrição'}</div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={{ 
                                                    padding: '4px 10px', 
                                                    borderRadius: '20px', 
                                                    fontSize: '0.75rem', 
                                                    fontWeight: 600,
                                                    background: record.category === 'NEURO_EVAL' ? '#E3F2FD' : record.category === 'OTHER' ? '#F5F5F5' : '#F3E5F5',
                                                    color: record.category === 'NEURO_EVAL' ? '#1976D2' : record.category === 'OTHER' ? '#666' : '#7B1FA2'
                                                }}>
                                                    {record.category === 'NEURO_EVAL' ? 'Avaliação' : record.category === 'OTHER' ? 'Outro' : 'Mensalidade'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 24px', fontWeight: 700, fontSize: '1rem' }}>
                                                {formatCurrency(record.amount)}
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ 
                                                    display: 'inline-flex', 
                                                    alignItems: 'center', 
                                                    gap: '6px', 
                                                    padding: '6px 12px',
                                                    borderRadius: '12px',
                                                    background: record.status === 'PAID' ? '#E8F5E9' : '#FFF3E0',
                                                    color: record.status === 'PAID' ? '#2E7D32' : '#E65100',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 700
                                                }}>
                                                    {record.status === 'PAID' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                                    {record.status === 'PAID' ? 'PAGO' : 'PENDENTE'}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }} className="no-print">
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    {record.status === 'PENDING' && (
                                                        <button 
                                                            style={{ background: 'none', border: 'none', color: '#4CAF50', cursor: 'pointer', padding: '6px', borderRadius: '8px', transition: 'background 0.2s' }}
                                                            className="action-btn-hover"
                                                            onClick={() => handleUpdateStatus(record.id, 'PAID')}
                                                            title="Confirmar Pagamento"
                                                        >
                                                            <CheckCircle size={20} />
                                                        </button>
                                                    )}
                                                    <button 
                                                        style={{ background: 'none', border: 'none', color: '#D32F2F', cursor: 'pointer', padding: '6px', borderRadius: '8px', transition: 'background 0.2s' }}
                                                        className="action-btn-hover-danger"
                                                        onClick={() => handleDelete(record.id)}
                                                        title="Excluir Registro"
                                                    >
                                                        <Trash2 size={20} />
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
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', background: 'white', padding: '32px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Novo Lançamento</h3>
                            <button style={{ background: '#F5F5F5', border: 'none', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowAddModal(false)}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label className="text-muted" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Paciente</label>
                                <select 
                                    className="input-field" 
                                    value={formData.userId} 
                                    onChange={e => setFormData({ ...formData, userId: e.target.value })}
                                    style={{ width: '100%', padding: '14px' }}
                                >
                                    <option value="">Lançamento Avulso / Outro</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label className="text-muted" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Valor (R$)</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        className="input-field"
                                        placeholder="0,00"
                                        required
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                        style={{ width: '100%', padding: '14px', fontSize: '1.1rem', fontWeight: 700 }}
                                    />
                                </div>
                                <div>
                                    <label className="text-muted" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Data</label>
                                    <input 
                                        type="date" 
                                        className="input-field"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        style={{ width: '100%', padding: '14px' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-muted" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Categoria</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {['THERAPY_MONTHLY', 'NEURO_EVAL', 'OTHER'].map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, category: cat })}
                                            style={{
                                                flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #EEE', fontSize: '0.75rem', fontWeight: 600,
                                                background: formData.category === cat ? 'var(--co-serene-blue)' : 'white',
                                                color: formData.category === cat ? 'var(--co-text-dark)' : '#666'
                                            }}
                                        >
                                            {cat === 'THERAPY_MONTHLY' ? 'Mensalidade' : cat === 'NEURO_EVAL' ? 'Avaliação' : 'Outros'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-muted" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Descrição</label>
                                <input 
                                    type="text" 
                                    className="input-field"
                                    placeholder="Ex: Ref. sessão do dia 15..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    style={{ width: '100%', padding: '14px' }}
                                />
                            </div>

                            <div>
                                <label className="text-muted" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Status</label>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button 
                                        type="button"
                                        style={{ 
                                            flex: 1, padding: '14px', borderRadius: '16px', border: '1px solid #EEE', 
                                            background: formData.status === 'PAID' ? '#E8F5E9' : 'white',
                                            color: formData.status === 'PAID' ? '#2E7D32' : '#666',
                                            fontWeight: 700
                                        }}
                                        onClick={() => setFormData({ ...formData, status: 'PAID' })}
                                    >
                                        PAGO
                                    </button>
                                    <button 
                                        type="button"
                                        style={{ 
                                            flex: 1, padding: '14px', borderRadius: '16px', border: '1px solid #EEE', 
                                            background: formData.status === 'PENDING' ? '#FFF3E0' : 'white',
                                            color: formData.status === 'PENDING' ? '#E65100' : '#666',
                                            fontWeight: 700
                                        }}
                                        onClick={() => setFormData({ ...formData, status: 'PENDING' })}
                                    >
                                        PENDENTE
                                    </button>
                                </div>
                            </div>

                            <button className="btn-primary" type="submit" style={{ marginTop: '16px', padding: '18px', borderRadius: '18px', fontSize: '1.1rem', fontWeight: 700 }} disabled={isSaving}>
                                {isSaving ? <Loader2 className="animate-spin" /> : 'Salvar Lançamento'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    .printable-area { padding: 0 !important; margin: 0 !important; background: white !important; }
                    .glass-panel { border: 1px solid #EEE !important; box-shadow: none !important; }
                    .psi-main { padding: 0 !important; }
                    .psi-layout { display: block !important; }
                    .psi-sidebar { display: none !important; }
                }
                .print-only { display: none; }
                .table-row-hover:hover { background-color: #FAFAFA !important; }
                .action-btn-hover:hover { background: #E8F5E9 !important; }
                .action-btn-hover-danger:hover { background: #FFEBEE !important; }
            `}</style>
        </div>
    );
}
