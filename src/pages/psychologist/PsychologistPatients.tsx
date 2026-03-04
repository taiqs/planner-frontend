import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PsychologistSidebar } from '../../components/PsychologistSidebar';
import api from '../../services/api';

export function PsychologistPatients() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLinking, setIsLinking] = useState(false);

    const fetchPatients = async () => {
        try {
            const res = await api.get('/psychologist/patients');
            setPatients(res.data);
        } catch (error) {
            console.error("Erro ao carregar lista de pacientes", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    // Separando os pacientes
    // Como a API retorna TODOS da plataforma, vamos filtrar no JS
    // Em um app real com milhares de usuários, essa lógica ficaria no back-end com paginação.
    // Como é um MVP para a psicóloga única, podemos fazer no front.
    const myPatients = patients.filter(p => p.psychologistId !== null);
    const otherUsers = patients.filter(p => p.psychologistId === null);

    const handleLinkPatient = async (email: string) => {
        setIsLinking(true);
        try {
            await api.post('/psychologist/link-patient', { email });
            import('react-hot-toast').then(({ default: toast }) => toast.success("Paciente vinculado com sucesso!"));
            fetchPatients();
        } catch (error: any) {
            import('react-hot-toast').then(({ default: toast }) => toast.error(error.response?.data?.error || "Erro ao vincular paciente"));
        } finally {
            setIsLinking(false);
        }
    }

    const handleUnlinkPatient = async (patientId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Tem certeza que deseja remover este paciente da sua clínica? Ele perderá o acesso à aba de Emergência e Agenda.")) return;

        try {
            await api.post(`/psychologist/unlink-patient/${patientId}`);
            import('react-hot-toast').then(({ default: toast }) => toast.success("Paciente removido com sucesso."));
            fetchPatients();
        } catch (error: any) {
            import('react-hot-toast').then(({ default: toast }) => toast.error(error.response?.data?.error || "Erro ao desvincular"));
        }
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Data não disponível';
        const d = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(d);
    };

    return (
        <div className="psi-layout">
            <PsychologistSidebar activePath="pacientes" />
            <div className="psi-main">
                <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem' }}>Gestão de Pacientes</h1>
                        <p className="text-muted">Abaixo você vê seus pacientes ativos e pessoas que baixaram o aplicativo.</p>
                    </div>
                </header>

                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 size={32} className="animate-spin" color="var(--co-accent)" /></div>
                ) : (
                    <>
                        <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '12px', marginBottom: '24px' }}>Meus Pacientes Ativos</h2>
                        {myPatients.length === 0 ? (
                            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', marginBottom: '40px' }}>
                                <p className="text-muted" style={{ fontSize: '1.05rem' }}>Você ainda não possui pacientes vinculados a você.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                                {myPatients.map(p => (
                                    <div key={p.id} className="glass-card" style={{ padding: '24px', cursor: 'pointer', position: 'relative' }} onClick={() => navigate(`/psicologo/paciente/${p.id}`)}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: p.emergencyEnabled ? 'var(--co-danger)' : 'var(--co-action)', color: p.emergencyEnabled ? '#fff' : '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                                {p.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.2rem', textTransform: 'capitalize' }}>{p.name.split(' ')[0]}</h3>
                                                <p className="text-muted" style={{ fontSize: '0.9rem', textTransform: 'capitalize' }}>Desde {formatDate(p.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '16px' }}>
                                            <span className="text-muted" style={{ fontSize: '0.9rem' }}>{p.emergencyEnabled ? <strong style={{ color: '#d32f2f' }}>SOS Perm.</strong> : 'Padrão'}</span>
                                            <button
                                                onClick={(e) => handleUnlinkPatient(p.id, e)}
                                                style={{ border: 'none', background: 'transparent', color: 'var(--co-danger-text)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '12px', marginBottom: '24px' }}>Outros Usuários Cadastrados no App</h2>
                        {otherUsers.length === 0 ? (
                            <p className="text-muted">Nenhum usuário aguardando vínculo.</p>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                {otherUsers.map(u => (
                                    <div key={u.id} className="glass-card" style={{ padding: '24px', background: 'var(--co-white)', cursor: 'pointer', position: 'relative' }} onClick={() => navigate(`/psicologo/paciente/${u.id}`)}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: 'var(--co-serene-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                                {u.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div style={{ overflow: 'hidden' }}>
                                                <h3 style={{ fontSize: '1.1rem', textTransform: 'capitalize', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{u.name}</h3>
                                                <p className="text-muted" style={{ fontSize: '0.85rem' }}>{u.email}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleLinkPatient(u.email); }}
                                            className="btn-primary"
                                            style={{ width: '100%', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'center' }}
                                            disabled={isLinking}
                                        >
                                            Vincular como Paciente
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
