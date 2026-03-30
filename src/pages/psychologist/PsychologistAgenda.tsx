import { useState, useEffect } from 'react';
import { PsychologistSidebar } from '../../components/PsychologistSidebar';
import api from '../../services/api';
import { Loader2, Plus, Calendar as CalendarIcon, Clock, X, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export function PsychologistAgenda() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isScheduling, setIsScheduling] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form states
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');
    
    // Calendar & Edit states
    const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(new Date().toLocaleDateString('pt-BR'));
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [editingAptId, setEditingAptId] = useState<string | null>(null);
    const [editDate, setEditDate] = useState('');
    const [editTime, setEditTime] = useState('');
    const [editNotes, setEditNotes] = useState('');
    
    // Recurrence states
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrenceWeeks, setRecurrenceWeeks] = useState(4);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [aptRes, patRes] = await Promise.all([
                api.get('/appointments'),
                api.get('/psychologist/patients')
            ]);

            // Ordena compromissos do mais antigo para mais novo
            const sortedApps = aptRes.data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

            setAppointments(sortedApps);

            // Filtra só os que já são pacientes ativos
            setPatients(patRes.data.filter((p: any) => p.psychologistId !== null));
        } catch (error) {
            console.error(error);
            toast.error("Erro ao puxar dados da agenda.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateAppointment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatientId || !date || !time) {
            toast.error("Preencha todos os campos obrigatórios.");
            return;
        }

        setIsSaving(true);
        try {
            const appointmentDate = new Date(`${date}T${time}:00`);

            await api.post('/appointments', {
                patientId: selectedPatientId,
                date: appointmentDate.toISOString(),
                notes: notes || undefined,
                recurrenceWeeks: isRecurring ? recurrenceWeeks : undefined
            });

            toast.success(isRecurring ? "Sessões agendadas com sucesso!" : "Sessão agendada com sucesso!");
            setIsScheduling(false);
            setSelectedPatientId('');
            setDate('');
            setTime('');
            setNotes('');
            setIsRecurring(false);
            setRecurrenceWeeks(4);
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Erro ao agendar sessão.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/appointments/${id}/status`, { status });
            toast.success("Status atualizado.");
            fetchData();
        } catch (error) {
            toast.error("Erro ao atualizar status.");
        }
    };

    const handleDeleteAppointment = async (id: string) => {
        if (!confirm("Tem certeza que deseja apagar permanentemente este agendamento? (Diferente de 'Cancelar', ele irá sumir da sua visão geral).")) return;
        try {
            await api.delete(`/appointments/${id}`);
            toast.success("Agendamento apagado com sucesso.");
            fetchData();
        } catch (error) {
            toast.error("Erro ao excluir agendamento.");
        }
    };

    const openEditForm = (apt: any) => {
        setEditingAptId(apt.id);
        const aptDate = new Date(apt.date);
        setEditDate(aptDate.toISOString().split('T')[0]);
        setEditTime(aptDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        setEditNotes(apt.notes || '');
    };

    const handleEditSubmit = async (e: React.FormEvent, id: string) => {
        e.preventDefault();
        try {
            const newDateTime = new Date(`${editDate}T${editTime}:00`).toISOString();
            await api.put(`/appointments/${id}`, {
                date: newDateTime,
                notes: editNotes
            });
            toast.success("Sessão reagendada/atualizada!");
            setEditingAptId(null);
            fetchData();
        } catch (error) {
            toast.error("Erro ao atualizar sessão.");
        }
    };

    // Agrupamento por dia
    const grouped = appointments.reduce((acc: any, apt: any) => {
        const dateStr = new Date(apt.date).toLocaleDateString('pt-BR');
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(apt);
        return acc;
    }, {});

    // Calendar logic
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const today = new Date().toLocaleDateString('pt-BR');

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="cal-day empty" style={{ padding: '10px', minHeight: '40px' }} />);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dateObj = new Date(year, month, i);
            const dateStr = dateObj.toLocaleDateString('pt-BR');
            // Check if there are appointments on this day
            const hasApts = !!grouped[dateStr];
            
            const isSelected = selectedDateFilter === dateStr;
            const isToday = today === dateStr;

            days.push(
                <div 
                    key={i} 
                    onClick={() => setSelectedDateFilter(isSelected ? null : dateStr)}
                    style={{ 
                        padding: '10px', 
                        minHeight: '40px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        cursor: 'pointer',
                        borderRadius: '12px',
                        background: isSelected ? 'var(--co-accent)' : isToday ? 'var(--co-lavender)' : 'transparent',
                        color: isSelected ? '#fff' : 'inherit',
                        fontWeight: isSelected || isToday ? 600 : 400,
                        border: isToday && !isSelected ? '1px solid var(--co-accent)' : '1px solid transparent',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                    }}
                >
                    {i}
                    {hasApts && (
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isSelected ? '#fff' : 'var(--co-accent)', marginTop: '4px' }} />
                    )}
                </div>
            );
        }

        return (
            <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Calendário</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><ChevronLeft /></button>
                        <span style={{ fontWeight: 600, minWidth: '120px', textAlign: 'center' }}>
                            {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}
                        </span>
                        <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><ChevronRight /></button>
                    </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--co-text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                    <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                    {days}
                </div>
            </div>
        );
    };

    return (
        <div className="psi-layout">
            <PsychologistSidebar activePath="agenda" />
            <div className="psi-main">
                <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem' }}>Agenda de Consultas</h1>
                        <p className="text-muted">Gerencie seus compromissos com pacientes.</p>
                    </div>
                    <button className="btn-primary" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setIsScheduling(true)}>
                        <Plus size={20} /> Agendar Sessão
                    </button>
                </header>

                {isScheduling && (
                    <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', border: '2px solid var(--co-accent)', position: 'relative', zIndex: 110 }}>
                        <button
                            className="btn-secondary"
                            style={{ position: 'absolute', top: '16px', right: '16px', width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '18px' }}
                            onClick={() => setIsScheduling(false)}
                        >
                            <X size={20} />
                        </button>

                        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Nova Sessão</h3>
                        <form onSubmit={handleCreateAppointment} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label className="text-muted" style={{ display: 'block', marginBottom: '8px' }}>Paciente</label>
                                <select className="input-field" value={selectedPatientId} onChange={e => setSelectedPatientId(e.target.value)} required>
                                    <option value="">Selecione um paciente...</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-muted" style={{ display: 'block', marginBottom: '8px' }}><CalendarIcon size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> Data</label>
                                <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} required />
                            </div>

                            <div>
                                <label className="text-muted" style={{ display: 'block', marginBottom: '8px' }}><Clock size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> Horário</label>
                                <input type="time" className="input-field" value={time} onChange={e => setTime(e.target.value)} required />
                            </div>

                            <div style={{ gridColumn: '1 / -1', background: 'var(--co-lavender)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                                    <input 
                                        type="checkbox" 
                                        checked={isRecurring} 
                                        onChange={e => setIsRecurring(e.target.checked)} 
                                        style={{ width: '18px', height: '18px', accentColor: 'var(--co-accent)' }} 
                                    />
                                    Repetir evento semanalmente
                                </label>
                                
                                {isRecurring && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                                        <span className="text-muted" style={{ fontSize: '0.9rem' }}>Quantas semanas?</span>
                                        <select 
                                            className="input-field" 
                                            value={recurrenceWeeks} 
                                            onChange={e => setRecurrenceWeeks(Number(e.target.value))}
                                            style={{ width: 'auto', padding: '8px 16px' }}
                                        >
                                            <option value={2}>2 Semanas</option>
                                            <option value={4}>4 Semanas</option>
                                            <option value={8}>8 Semanas</option>
                                            <option value={12}>12 Semanas (3 meses)</option>
                                            <option value={24}>24 Semanas (6 meses)</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label className="text-muted" style={{ display: 'block', marginBottom: '8px' }}>Link da chamada ou notas extras (Opcional. Se vazio, o paciente verá o aviso de envio via WhatsApp)</label>
                                <textarea className="input-field" value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Ex: meet.google.com/abc-defg-hij" />
                            </div>

                            <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1', padding: '16px', borderRadius: '16px' }} disabled={isSaving}>
                                {isSaving ? <Loader2 size={24} className="animate-spin" /> : 'Confirmar Agendamento'}
                            </button>
                        </form>
                    </div>
                )}

                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 size={32} className="animate-spin" color="var(--co-accent)" /></div>
                ) : appointments.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                        <p className="text-muted" style={{ fontSize: '1.1rem' }}>Sua agenda está vazia no momento.</p>
                        <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>Clique em "Agendar Sessão" para marcar consultas com seus pacientes.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {/* Calendário */}
                        {renderCalendar()}

                        {/* Título de Filtro */}
                        {selectedDateFilter && (
                            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                Sessões em: {selectedDateFilter}
                                <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }} onClick={() => setSelectedDateFilter(null)}>
                                    Ver todas
                                </button>
                            </h3>
                        )}

                        {Object.entries(grouped)
                            .filter(([dateStr]) => !selectedDateFilter || dateStr === selectedDateFilter)
                            .map(([dateStr, apts]: [string, any]) => (
                            <div key={dateStr} className="glass-panel" style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '12px' }}>{dateStr}</h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {apts.map((apt: any) => {
                                        const aptTime = new Date(apt.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                        return (
                                            <div key={apt.id} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                                <div style={{ width: '60px', textAlign: 'right', paddingTop: '16px', color: 'var(--co-text-muted)', fontWeight: 600 }}>{aptTime}</div>
                                                <div className="glass-card" style={{ flex: 1, padding: '16px', borderLeft: `4px solid ${apt.status === 'COMPLETED' ? 'var(--co-success, #4CAF50)' : apt.status === 'CANCELLED' ? 'var(--co-danger, #F44336)' : 'var(--co-accent-hover)'}`, background: apt.status === 'SCHEDULED' ? 'var(--co-lavender)' : 'var(--co-white)', opacity: apt.status === 'CANCELLED' ? 0.6 : 1 }}>
                                                    
                                                    {editingAptId === apt.id ? (
                                                        <form onSubmit={(e) => handleEditSubmit(e, apt.id)} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                <input type="date" className="input-field" value={editDate} onChange={e => setEditDate(e.target.value)} required />
                                                                <input type="time" className="input-field" value={editTime} onChange={e => setEditTime(e.target.value)} required />
                                                            </div>
                                                            <textarea className="input-field" value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={2} placeholder="Novo link ou notas" />
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Salvar</button>
                                                                <button type="button" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => setEditingAptId(null)}>Cancelar</button>
                                                            </div>
                                                        </form>
                                                    ) : (
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <div>
                                                                <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{apt.patient.name}</h4>
                                                                {apt.notes && <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', wordBreak: 'break-word' }}>{apt.notes}</p>}

                                                                <div style={{ display: 'inline-block', fontSize: '0.8rem', padding: '4px 8px', borderRadius: '12px', background: apt.status === 'COMPLETED' ? '#E8F5E9' : apt.status === 'CANCELLED' ? '#FFEBEE' : '#E3F2FD', color: apt.status === 'COMPLETED' ? '#2E7D32' : apt.status === 'CANCELLED' ? '#C62828' : '#1565C0', fontWeight: 600 }}>
                                                                    {apt.status === 'SCHEDULED' ? 'AGENDADA' : apt.status === 'COMPLETED' ? 'REALIZADA' : 'CANCELADA'}
                                                                </div>
                                                            </div>

                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
                                                                {/* Toggles Status */}
                                                                {apt.status === 'SCHEDULED' && (
                                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                                        <button onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')} style={{ background: 'var(--co-success, #4CAF50)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Realizar</button>
                                                                        <button onClick={() => handleUpdateStatus(apt.id, 'CANCELLED')} style={{ background: 'var(--co-white)', color: 'var(--co-danger, #F44336)', border: '1px solid var(--co-danger, #F44336)', padding: '6px 12px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Cancelar</button>
                                                                    </div>
                                                                )}

                                                                {/* Edit & Delete Controls */}
                                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                                    <button 
                                                                        onClick={() => openEditForm(apt)} 
                                                                        style={{ background: 'transparent', border: 'none', color: 'var(--co-text-muted)', cursor: 'pointer' }}
                                                                        title="Reprogramar (Editar)"
                                                                    >
                                                                        <Edit2 size={18} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDeleteAppointment(apt.id)} 
                                                                        style={{ background: 'transparent', border: 'none', color: '#D32F2F', cursor: 'pointer' }}
                                                                        title="Excluir Permanentemente"
                                                                    >
                                                                        <Trash2 size={18} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
