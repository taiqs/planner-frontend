import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Loader2, Camera, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { getProxyUrl } from '../utils/fileProxy';

export function UserProfile() {
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [pronouns, setPronouns] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Password states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/user/me');
                const data = res.data;
                setUser(data);
                setName(data.name || '');
                setPronouns(data.pronouns || 'Ela/Dela');
                setAvatarUrl(data.avatarUrl || '');

                // Formatar a data para o input type="date"
                if (data.birthDate) {
                    const dateObj = new Date(data.birthDate);
                    const formattedUrl = dateObj.toISOString().split('T')[0];
                    setBirthDate(formattedUrl);
                }
            } catch (error) {
                console.error("Erro ao carregar perfil", error);
                toast.error("Não foi possível carregar suas informações.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = {
                name,
                pronouns,
                birthDate: birthDate ? birthDate : undefined,
                avatarUrl
            };
            const res = await api.put('/user/profile', payload);
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data)); // atualiza local state
            toast.success("Perfil atualizado com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar alterações.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setAvatarUrl(res.data.url);
            toast.success("Foto carregada. Clique em Salvar Alterações para confirmar!");
        } catch (error) {
            toast.error("Erro ao fazer upload da foto.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword) {
            toast.error("Preencha a senha atual e a nova senha.");
            return;
        }
        setIsChangingPassword(true);
        try {
            await api.put('/user/password', { currentPassword, newPassword });
            toast.success("Senha alterada com sucesso!");
            setCurrentPassword('');
            setNewPassword('');
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Erro ao alterar senha.");
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success("Você saiu da conta.");
        navigate('/');
    };

    if (isLoading) {
        return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" size={32} color="var(--co-accent)" /></div>
    }

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', paddingTop: '16px' }}>
                <button
                    className="btn-secondary"
                    style={{ padding: '10px 14px', borderRadius: '16px' }}
                    onClick={() => navigate(user?.role === 'ADMIN' ? '/psicologo' : '/dashboard')}
                >
                    <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Meu Perfil</h1>
            </header>

            <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px', position: 'relative' }}>
                    <div style={{ position: 'relative' }}>
                        <div
                            style={{
                                width: '100px', height: '100px', borderRadius: '50px',
                                backgroundColor: 'var(--co-lavender)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', fontSize: '2.5rem', marginBottom: '16px',
                                overflow: 'hidden', border: '3px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        >
                            {isUploading ? (
                                <Loader2 className="animate-spin" size={32} color="var(--co-accent)" />
                            ) : avatarUrl ? (
                                <img src={getProxyUrl(avatarUrl)} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                name ? name.charAt(0).toUpperCase() : 'U'
                            )}
                        </div>
                        <button
                            className="btn-primary"
                            style={{ position: 'absolute', bottom: '16px', right: '-8px', width: '36px', height: '36px', borderRadius: '18px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white' }}
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            <Camera size={16} />
                        </button>
                    </div>

                    <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUploadPhoto} />

                    <h2 style={{ fontSize: '1.25rem', textTransform: 'capitalize' }}>{name || 'Usuário'}</h2>
                    <p className="text-muted">{user?.email}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>Nome Completo</label>
                        <input
                            type="text"
                            className="input-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>Como prefere ser chamada? (Pronomes)</label>
                        <select
                            className="input-field"
                            value={pronouns}
                            onChange={(e) => setPronouns(e.target.value)}
                        >
                            <option value="Ela/Dela">Ela/Dela</option>
                            <option value="Ele/Dele">Ele/Dele</option>
                            <option value="Elu/Delu">Elu/Delu</option>
                            <option value="Outro">Outro</option>
                            <option value="">Prefiro não dizer</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>Data de Nascimento</label>
                        <input
                            type="date"
                            className="input-field"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                        />
                    </div>

                    <button
                        className="btn-primary"
                        style={{ marginTop: '16px', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'center' }}
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? <Loader2 size={24} className="animate-spin" /> : 'Salvar Alterações'}
                    </button>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--co-lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Lock size={20} color="var(--co-accent)" />
                    </div>
                    <h2 style={{ fontSize: '1.15rem' }}>Segurança da Conta</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Password Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Alterar Senha de Acesso</h3>
                        <div style={{ position: 'relative' }}>
                            <label className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>Senha Atual</label>
                            <input
                                type={showPasswords ? "text" : "password"}
                                className="input-field"
                                placeholder="Sua senha atual"
                                style={{ paddingRight: '48px' }}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords(!showPasswords)}
                                style={{ position: 'absolute', right: '12px', top: '38px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--co-text-muted)' }}
                            >
                                {showPasswords ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <label className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>Nova Senha</label>
                            <input
                                type={showPasswords ? "text" : "password"}
                                className="input-field"
                                placeholder="Uma nova senha forte"
                                style={{ paddingRight: '48px' }}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords(!showPasswords)}
                                style={{ position: 'absolute', right: '12px', top: '38px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--co-text-muted)' }}
                            >
                                {showPasswords ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <button
                            className="btn-secondary"
                            style={{ padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'center', background: 'transparent', border: '1px solid var(--co-accent)', color: 'var(--co-accent)' }}
                            onClick={handleChangePassword}
                            disabled={isChangingPassword}
                        >
                            {isChangingPassword ? <Loader2 size={20} className="animate-spin" /> : 'Alterar Senha'}
                        </button>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.05)' }} />

                    {/* Vault PIN Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Senha do Cofre (PIN de 4 dígitos)</h3>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                            {user?.vaultPin ? 'Você já possui um PIN configurado para o cofre.' : 'Proteja suas reflexões com uma senha numérica exclusiva.'}
                        </p>
                        <button
                            className="btn-secondary"
                            style={{ padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'center', background: 'var(--co-lavender)', border: 'none', color: 'var(--co-accent)', fontWeight: 600 }}
                            onClick={() => {
                                navigate('/cofre');
                            }}
                        >
                            {user?.vaultPin ? 'Alterar PIN do Cofre' : 'Configurar PIN do Cofre'}
                        </button>
                    </div>
                </div>
            </div>

            <button className="btn-secondary" style={{ width: '100%', color: 'var(--co-danger-text)', padding: '16px' }} onClick={handleLogout}>Sair da Conta</button>
        </div>
    );
}
