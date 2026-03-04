import { useState, useEffect } from 'react';
import { PsychologistSidebar } from '../../components/PsychologistSidebar';
import api from '../../services/api';
import { Loader2, Plus, Calendar as CalendarIcon, Clock, X } from 'lucide-react';
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
                notes: notes || undefined
            });

            toast.success("Sessão agendada com sucesso!");
            setIsScheduling(false);
            setSelectedPatientId('');
            setDate('');
            setTime('');
            setNotes('');
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

    // Agrupamento por dia
    const grouped = appointments.reduce((acc: any, apt: any) => {
        const dateStr = new Date(apt.date).toLocaleDateString('pt-BR');
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(apt);
        return acc;
    }, {});

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
                    <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', border: '2px solid var(--co-accent)', position: 'relative' }}>
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

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label className="text-muted" style={{ display: 'block', marginBottom: '8px' }}>Link da chamada ou notas extras (Opcional. Será enviado via WhatsApp posteriormente caso não tenha agora)</label>
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
                        {Object.entries(grouped).map(([dateStr, apts]: [string, any]) => (
                            <div key={dateStr} className="glass-panel" style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '12px' }}>{dateStr}</h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {apts.map((apt: any) => {
                                        const aptTime = new Date(apt.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                        return (
                                            <div key={apt.id} style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
                                                <div style={{ width: '60px', textAlign: 'right', paddingTop: '16px', color: 'var(--co-text-muted)', fontWeight: 600 }}>{aptTime}</div>
                                                <div className="glass-card" style={{ flex: 1, padding: '16px', borderLeft: `4px solid ${apt.status === 'COMPLETED' ? 'var(--co-success, #4CAF50)' : apt.status === 'CANCELLED' ? 'var(--co-danger, #F44336)' : 'var(--co-accent-hover)'}`, background: apt.status === 'SCHEDULED' ? 'var(--co-lavender)' : 'var(--co-white)', opacity: apt.status === 'CANCELLED' ? 0.6 : 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <div>
                                                            <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{apt.patient.name}</h4>
                                                            {apt.notes && <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px' }}>{apt.notes}</p>}

                                                            <div style={{ display: 'inline-block', fontSize: '0.8rem', padding: '4px 8px', borderRadius: '12px', background: apt.status === 'COMPLETED' ? '#E8F5E9' : apt.status === 'CANCELLED' ? '#FFEBEE' : '#E3F2FD', color: apt.status === 'COMPLETED' ? '#2E7D32' : apt.status === 'CANCELLED' ? '#C62828' : '#1565C0', fontWeight: 600 }}>
                                                                {apt.status === 'SCHEDULED' ? 'AGENDADA' : apt.status === 'COMPLETED' ? 'REALIZADA' : 'CANCELADA'}
                                                            </div>
                                                        </div>

                                                        {apt.status === 'SCHEDULED' && (
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                <button onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')} style={{ background: 'var(--co-success, #4CAF50)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Realizada</button>
                                                                <button onClick={() => handleUpdateStatus(apt.id, 'CANCELLED')} style={{ background: 'var(--co-white)', color: 'var(--co-danger, #F44336)', border: '1px solid var(--co-danger, #F44336)', padding: '6px 12px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Cancelar</button>
                                                            </div>
                                                        )}
                                                    </div>
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
