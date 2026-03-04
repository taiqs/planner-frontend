import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import { PsychologistSidebar } from '../../components/PsychologistSidebar';
import { MOOD_CATEGORIES } from '../../utils/constants';
import toast from 'react-hot-toast';
import api from '../../services/api';

export function PsychologistPatientDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [patient, setPatient] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingToggle, setIsSavingToggle] = useState(false);
    const [isLinking, setIsLinking] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchPatient = async () => {
            try {
                const res = await api.get(`/psychologist/patients/${id}`);
                setPatient(res.data);
            } catch (error) {
                console.error("Erro", error);
                toast.error("Erro ao carregar prontuário.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatient();
    }, [id]);

    const handleEmergencyToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        setIsSavingToggle(true);
        try {
            await api.patch(`/psychologist/patients/${id}/emergency`, { enabled: newValue });
            setPatient((prev: any) => ({ ...prev, emergencyEnabled: newValue }));
            toast.success(newValue ? "Emergência liberada para o paciente." : "Emergência desativada.");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao atualizar status.");
        } finally {
            setIsSavingToggle(false);
        }
    };

    const handleLinkPatient = async () => {
        setIsLinking(true);
        try {
            await api.post('/psychologist/link-patient', { email: patient.email });
            toast.success("Paciente vinculado à sua clínica!");
            setPatient((prev: any) => ({ ...prev, psychologistId: 'vinculado' })); // mock visual imediato
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Erro ao vincular.");
        } finally {
            setIsLinking(false);
        }
    };

    if (isLoading) {
        return <div className="psi-layout"><PsychologistSidebar activePath="pacientes" /><div className="psi-main" style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px' }}><Loader2 className="animate-spin" /></div></div>;
    }

    if (!patient) {
        return <div className="psi-layout"><PsychologistSidebar activePath="pacientes" /><div className="psi-main"><p>Paciente não encontrado.</p></div></div>;
    }

    // Calcula Idade básica pelo Nascimento se tiver
    const getAge = (birthDate: string) => {
        if (!birthDate) return 'Idade n/a';
        const d = new Date(birthDate);
        const ageDifMs = Date.now() - d.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970) + ' anos';
    };

    return (
        <div className="psi-layout">
            <PsychologistSidebar activePath="pacientes" />
            <div className="psi-main" style={{ display: 'flex', flexDirection: 'column' }}>
                <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                    <button className="btn-secondary" style={{ padding: '10px 14px', borderRadius: '16px' }} onClick={() => navigate('/psicologo/pacientes')}>
                        <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', textTransform: 'capitalize' }}>{patient.name}</h1>
                        <p className="text-muted">{getAge(patient.birthDate)} • {patient.pronouns || 'Sem pronome'}</p>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '24px' }}>

                    {/* Controls */}
                    {!patient.psychologistId ? (
                        <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--co-lavender)', border: '2px dashed var(--co-accent)' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Usuário Livro</h3>
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Este usuário ainda não se vinculou a você. Alguns controles estão restritos até o vínculo.</p>
                            </div>
                            <button className="btn-primary" onClick={handleLinkPatient} disabled={isLinking}>
                                {isLinking ? <Loader2 size={16} className="animate-spin" /> : 'Vincular Paciente'}
                            </button>
                        </div>
                    ) : (
                        <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Botão de Emergência</h3>
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Permitir que este paciente acesse o chat de crise.</p>
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', background: patient.emergencyEnabled ? '#E8F5E9' : 'var(--co-lavender)', padding: '8px 16px', borderRadius: '100px', opacity: isSavingToggle ? 0.5 : 1 }}>
                                <input
                                    type="checkbox"
                                    checked={patient.emergencyEnabled}
                                    onChange={handleEmergencyToggle}
                                    disabled={isSavingToggle}
                                    style={{ marginRight: '8px', accentColor: 'var(--co-success-text)', cursor: 'pointer', width: '18px', height: '18px' }}
                                />
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: patient.emergencyEnabled ? 'var(--co-success-text)' : 'inherit' }}>
                                    {patient.emergencyEnabled ? 'Permitido' : 'Desativado'}
                                </span>
                            </label>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="glass-panel" style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Histórico Compartilhado</h3>

                            <h4 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Últimos Check-ins de Humor</h4>
                            {patient.moodEntries && patient.moodEntries.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                                    {patient.moodEntries.slice(0, 5).map((mood: any) => (
                                        <div key={mood.id} style={{ padding: '16px', borderLeft: `6px solid ${MOOD_CATEGORIES[mood.mainMood as keyof typeof MOOD_CATEGORIES]?.color || '#ccc'}`, background: 'rgba(255,255,255,0.8)', borderRadius: '0 8px 8px 0', border: '1px solid rgba(0,0,0,0.05)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--co-text-muted)', fontWeight: 600 }}>{new Date(mood.date).toLocaleDateString('pt-BR')} - {MOOD_CATEGORIES[mood.mainMood as keyof typeof MOOD_CATEGORIES]?.emoji} {MOOD_CATEGORIES[mood.mainMood as keyof typeof MOOD_CATEGORIES]?.label}</p>
                                                {mood.moodSwing && <span style={{ fontSize: '0.75rem', background: '#FFECB3', color: '#FF8F00', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>Mudança Brusca</span>}
                                            </div>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--co-text-dark)' }}>{mood.subEmotions?.join(', ')}</p>
                                            {mood.notes && <p style={{ fontSize: '0.9rem', color: 'var(--co-text-muted)', fontStyle: 'italic', marginTop: '8px' }}>"{mood.notes}"</p>}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted" style={{ marginBottom: '32px' }}>Nenhum humor registrado.</p>
                            )}

                            <h4 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Reflexões Pré-Sessão (Cofre)</h4>
                            {patient.vaultEntries && patient.vaultEntries.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {patient.vaultEntries.map((vault: any) => (
                                        <div key={vault.id} style={{ padding: '16px', borderLeft: '4px solid var(--co-accent)', background: 'rgba(255,255,255,0.5)', borderRadius: '0 8px 8px 0' }}>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--co-text-muted)', marginBottom: '8px', fontWeight: 600 }}>{new Date(vault.createdAt).toLocaleDateString('pt-BR')}</p>
                                            <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{vault.content}</p>

                                            {vault.audioUrl && (
                                                <div style={{ marginTop: '12px' }}>
                                                    <a href={vault.audioUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--co-action)', fontWeight: 600, textDecoration: 'none' }}>▶️ Ouvir Áudio Compartilhado</a>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">Nenhuma reflexão compartilhada pelo paciente.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
