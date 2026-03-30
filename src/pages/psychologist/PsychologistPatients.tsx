import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Phone, Sparkles, Mail, MessageCircle, ShieldAlert } from 'lucide-react';
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

    const myPatients = patients.filter(p => p.psychologistId !== null);
    const otherUsers = patients.filter(p => p.psychologistId === null).sort((a, b) => {
        if (a.interestedInTherapy && !b.interestedInTherapy) return -1;
        if (!a.interestedInTherapy && b.interestedInTherapy) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

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

    const getAge = (birthDate: string) => {
        if (!birthDate) return null;
        const d = new Date(birthDate);
        const ageDifMs = Date.now() - d.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970) + ' anos';
    };

    const cleanPhone = (phone: string) => phone.replace(/\D/g, '');

    return (
        <div className="psi-layout">
            <PsychologistSidebar activePath="pacientes" />
            <div className="psi-main">
                <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem' }}>Gestão de Usuários</h1>
                        <p className="text-muted">Abaixo você vê seus pacientes ativos e todos os usuários cadastrados na plataforma.</p>
                    </div>
                </header>

                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 size={32} className="animate-spin" color="var(--co-accent)" /></div>
                ) : (
                    <>
                        <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Meus Pacientes Ativos <span style={{ fontSize: '0.9rem', background: 'var(--co-lavender)', color: 'var(--co-accent)', padding: '2px 8px', borderRadius: '10px' }}>{myPatients.length}</span>
                        </h2>
                        {myPatients.length === 0 ? (
                            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', marginBottom: '40px' }}>
                                <p className="text-muted" style={{ fontSize: '1.05rem' }}>Você ainda não possui pacientes vinculados a você.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                                {myPatients.map(p => {
                                    const age = getAge(p.birthDate);
                                    return (
                                        <div key={p.id} className="glass-card" style={{ padding: '24px', cursor: 'pointer', position: 'relative' }} onClick={() => navigate(`/psicologo/paciente/${p.id}`)}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
                                                <div style={{ width: '56px', height: '56px', borderRadius: '28px', backgroundColor: 'var(--co-lavender)', color: 'var(--co-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.4rem', flexShrink: 0 }}>
                                                    {p.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <h3 style={{ fontSize: '1.2rem', textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '2px' }}>{p.name}</h3>
                                                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>{age ? `${age} • ` : ''}{p.pronouns || 'Sem pronome'}</p>
                                                    <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>Membro desde {formatDate(p.createdAt)}</p>
                                                </div>
                                            </div>

                                            <div style={{ background: 'rgba(0,0,0,0.02)', borderRadius: '12px', padding: '12px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--co-text-dark)' }}>
                                                    <Mail size={14} className="text-muted" /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.email}</span>
                                                </div>
                                                {p.phone && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--co-text-dark)' }}>
                                                        <Phone size={14} className="text-muted" /> <span>{p.phone}</span>
                                                        <a 
                                                            href={`https://wa.me/${cleanPhone(p.phone)}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            style={{ marginLeft: 'auto', background: '#25D366', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                                                        >
                                                            <MessageCircle size={12} /> WhatsApp
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <ShieldAlert size={14} color={p.emergencyEnabled ? 'var(--co-danger-text)' : '#bbb'} />
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: p.emergencyEnabled ? 'var(--co-danger-text)' : 'var(--co-text-muted)' }}>
                                                        {p.emergencyEnabled ? 'SOS Liberado' : 'SOS Padrão'}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={(e) => handleUnlinkPatient(p.id, e)}
                                                    style={{ border: 'none', background: 'transparent', color: 'var(--co-danger-text)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Outros Usuários Cadastrados <span style={{ fontSize: '0.9rem', background: 'var(--co-lavender)', color: 'var(--co-accent)', padding: '2px 8px', borderRadius: '10px' }}>{otherUsers.length}</span>
                        </h2>
                        {otherUsers.length === 0 ? (
                            <p className="text-muted">Nenhum outro usuário cadastrado no momento.</p>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                                {otherUsers.map(u => {
                                    const age = getAge(u.birthDate);
                                    return (
                                        <div key={u.id} className="glass-card" style={{ padding: '24px', background: 'var(--co-white)', cursor: 'pointer', position: 'relative', border: u.interestedInTherapy ? '2px solid var(--co-accent)' : '1px solid rgba(0,0,0,0.05)' }} onClick={() => navigate(`/psicologo/paciente/${u.id}`)}>
                                            {u.interestedInTherapy && (
                                                <div style={{ position: 'absolute', top: '-12px', right: '16px', background: 'var(--co-accent)', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 12px rgba(166,124,255,0.4)' }}>
                                                    <Sparkles size={14} /> Terapia
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
                                                <div style={{ width: '56px', height: '56px', borderRadius: '28px', backgroundColor: u.interestedInTherapy ? 'var(--co-lavender)' : 'var(--co-serene-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.4rem', color: u.interestedInTherapy ? 'var(--co-primary)' : '#000', flexShrink: 0 }}>
                                                    {u.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <h3 style={{ fontSize: '1.1rem', textTransform: 'capitalize', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', marginBottom: '2px' }}>{u.name}</h3>
                                                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>{age ? `${age} • ` : ''}{u.pronouns || 'Sem pronome'}</p>
                                                    <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>Entrou em {formatDate(u.createdAt)}</p>
                                                </div>
                                            </div>

                                            <div style={{ background: 'rgba(0,0,0,0.02)', borderRadius: '12px', padding: '12px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--co-text-dark)' }}>
                                                    <Mail size={14} className="text-muted" /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</span>
                                                </div>
                                                {u.phone && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--co-text-dark)' }}>
                                                        <Phone size={14} className="text-muted" /> <span>{u.phone}</span>
                                                        <a 
                                                            href={`https://wa.me/${cleanPhone(u.phone)}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            style={{ marginLeft: 'auto', background: '#25D366', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                                                        >
                                                            <MessageCircle size={12} /> WhatsApp
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleLinkPatient(u.email); }}
                                                className="btn-primary"
                                                style={{ width: '100%', padding: '14px', borderRadius: '12px', display: 'flex', justifyContent: 'center', fontWeight: 700 }}
                                                disabled={isLinking}
                                            >
                                                Vincular como Paciente
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
