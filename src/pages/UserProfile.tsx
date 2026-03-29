import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight, Loader2, Camera, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { getProxyUrl } from '../utils/fileProxy';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/canvasUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, BellOff, Info } from 'lucide-react';
import { getNotificationStatus, requestNotificationPermission, unsubscribeFromPush } from '../utils/notifications';
import { usePWAInstall } from '../hooks/usePWAInstall';

export function UserProfile() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isIOS } = usePWAInstall();

    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [pronouns, setPronouns] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Crop states
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);

    // Password states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);
    const [notificationStatus, setNotificationStatus] = useState<string>(getNotificationStatus());

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/user/me');
                const data = res.data;
                setUser(data);
                setName(data.name || '');
                setPronouns(data.pronouns || 'Ela/Dela');
                setAvatarUrl(data.avatarUrl || '');
                setPhone(data.phone || '');

                if (data.birthDate) {
                    const dateObj = new Date(data.birthDate);
                    setBirthDate(dateObj.toISOString().split('T')[0]);
                }
            } catch (error) {
                console.error("Erro ao carregar perfil", error);
                toast.error("Não foi possível carregar suas informações.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();

        const googleStatus = searchParams.get('google');
        if (googleStatus === 'connected') {
            toast.success("Agenda Google conectada com sucesso!");
        } else if (googleStatus === 'error') {
            toast.error("Erro ao conectar com a Agenda Google.");
        }
    }, [searchParams]);

    const maskPhone = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(maskPhone(e.target.value));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = {
                name,
                pronouns,
                birthDate: birthDate ? birthDate : undefined,
                avatarUrl,
                phone
            };
            const res = await api.put('/user/profile', payload);
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
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
        
        // Ativar o cropper em vez de subir direto
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImageSrc(reader.result as string);
            setShowCropper(true);
        };
    };

    const handleSaveCroppedImage = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        setIsUploading(true);
        setShowCropper(false);
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (!croppedImageBlob) throw new Error("Erro ao gerar imagem recortada");

            const formData = new FormData();
            formData.append('file', croppedImageBlob, 'avatar.jpg');

            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setAvatarUrl(res.data.url);
            toast.success("Foto recortada e carregada com sucesso!");
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 413) {
                toast.error("O arquivo da imagem é muito grande.");
            } else {
                toast.error("Erro ao processar/enviar a foto.");
            }
        } finally {
            setIsUploading(false);
            setImageSrc(null);
        }
    };

    const handleToggleNotifications = async () => {
        if (notificationStatus === 'granted') {
            const ok = await unsubscribeFromPush();
            if (ok) {
                setNotificationStatus('default');
                toast.success("Notificações desativadas.");
            }
        } else {
            const granted = await requestNotificationPermission();
            if (granted) {
                setNotificationStatus('granted');
                toast.success("Notificações ativadas com sucesso!");
            } else {
                setNotificationStatus(getNotificationStatus());
                toast.error("Não foi possível ativar as notificações.");
            }
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

    /* Oculto por solicitação do usuário
    const handleConnectGoogle = async () => {
        setIsConnectingGoogle(true);
        try {
            const res = await api.get(`/auth/google/url?userId=${user.id}`);
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        } catch (error) {
            toast.error("Erro ao iniciar conexão com Google.");
        } finally {
            setIsConnectingGoogle(false);
        }
    };
    */

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
                        <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>Pronomes</label>
                        <select className="input-field" value={pronouns} onChange={(e) => setPronouns(e.target.value)}>
                            <option value="Ela/Dela">Ela/Dela</option>
                            <option value="Ele/Dele">Ele/Dele</option>
                            <option value="Elu/Delu">Elu/Delu</option>
                            <option value="Outro">Outro</option>
                            <option value="">Prefiro não dizer</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>Data de Nascimento</label>
                        <input type="date" className="input-field" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>Telefone (WhatsApp)</label>
                        <input type="tel" className="input-field" value={phone} onChange={handlePhoneChange} placeholder="(11) 99999-9999" />
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

{/* Google Calendar Section - Oculto por solicitação do usuário
            <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#4285F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Calendar size={20} color="white" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.15rem', marginBottom: '2px' }}>Google Agenda</h2>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>Sincronize seus agendamentos automaticamente</p>
                    </div>
                </div>

                <div style={{ background: user?.googleAccessToken ? '#E8F5E9' : '#F5F5F5', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: user?.googleAccessToken ? '#2E7D32' : 'var(--co-text-dark)' }}>
                        {user?.googleAccessToken ? 'Conectado com sucesso' : 'Não conectado'}
                    </span>
                    <button
                        className="btn-secondary"
                        style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', background: user?.googleAccessToken ? 'white' : 'var(--co-lavender)', color: 'var(--co-accent)', border: 'none' }}
                        onClick={handleConnectGoogle}
                        disabled={isConnectingGoogle}
                    >
                        {isConnectingGoogle ? <Loader2 className="animate-spin" size={16} /> : user?.googleAccessToken ? 'Reconectar' : 'Conectar'}
                    </button>
                </div>
            </div>
            */}

            <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--co-action, #9575CD)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bell size={20} color="white" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.15rem', marginBottom: '2px' }}>Notificações Push</h2>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>Receba alertas de suas sessões e mensagens no seu dispositivo</p>
                    </div>
                </div>

                <div style={{ background: notificationStatus === 'granted' ? '#E8F5E9' : notificationStatus === 'denied' ? '#FFEBEE' : '#F5F5F5', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {notificationStatus === 'granted' ? <Bell size={18} color="#2E7D32" /> : <BellOff size={18} color={notificationStatus === 'denied' ? '#D32F2F' : '#666'} />}
                        <span style={{ fontSize: '0.9rem', fontWeight: 500, color: notificationStatus === 'granted' ? '#2E7D32' : notificationStatus === 'denied' ? '#D32F2F' : 'var(--co-text-dark)' }}>
                            {notificationStatus === 'granted' ? 'Ativadas neste dispositivo' : notificationStatus === 'denied' ? 'Bloqueadas pelo Navegador' : 'Aguardando ativação'}
                        </span>
                    </div>
                    <button
                        className="btn-secondary"
                        style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', background: 'white', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                        onClick={handleToggleNotifications}
                        disabled={notificationStatus === 'unsupported'}
                    >
                        {notificationStatus === 'granted' ? 'Desativar' : 'Ativar Agora'}
                    </button>
                </div>
                
                {notificationStatus === 'denied' && (
                    <p style={{ fontSize: '0.75rem', color: '#D32F2F', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px', lineHeight: 1.4 }}>
                        <Info size={14} style={{ flexShrink: 0 }} /> 
                        {isIOS 
                            ? 'O iOS bloqueou as notificações. Vá em "Ajustes" -> "Notificações" -> "Ponto e Vírgula" para permitir.' 
                            : 'O navegador reportou que as notificações estão desativadas. Tente clicar no ícone de cadeado 🔒 na barra de endereços para redefinir as permissões.'}
                    </p>
                )}
                {notificationStatus === 'unsupported' && (
                    <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '12px', lineHeight: 1.4 }}>
                        {isIOS 
                            ? 'Para usar notificações no iPhone, você precisa instalar este aplicativo (clique no ícone de compartilhar e pesquise por "Adicionar à Tela de Início").' 
                            : 'Seu navegador atual não suporta notificações push.'}
                    </p>
                )}
            </div>

            <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--co-lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Lock size={20} color="var(--co-accent)" />
                    </div>
                    <h2 style={{ fontSize: '1.15rem' }}>Segurança</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>Alterar Senha</h3>
                        <div style={{ position: 'relative', marginBottom: '12px' }}>
                            <input
                                type={showPasswords ? "text" : "password"}
                                className="input-field"
                                placeholder="Senha Atual"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div style={{ position: 'relative', marginBottom: '16px' }}>
                            <input
                                type={showPasswords ? "text" : "password"}
                                className="input-field"
                                placeholder="Nova Senha"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords(!showPasswords)}
                                style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--co-text-muted)' }}
                            >
                                {showPasswords ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <button
                            className="btn-secondary"
                            style={{ width: '100%', padding: '12px', borderRadius: '12px' }}
                            onClick={handleChangePassword}
                            disabled={isChangingPassword}
                        >
                            {isChangingPassword ? <Loader2 size={16} className="animate-spin" /> : 'Atualizar Senha'}
                        </button>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.05)' }} />

                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>PIN do Cofre</h3>
                        <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '16px' }}>Proteja suas reflexões com um código de 4 dígitos.</p>
                        <button
                            className="btn-secondary"
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--co-lavender)', border: 'none', color: 'var(--co-accent)' }}
                            onClick={() => navigate('/cofre')}
                        >
                            {user?.vaultPin ? 'Alterar PIN' : 'Configurar PIN'}
                        </button>
                    </div>
                </div>
            </div>

            <button className="btn-secondary" style={{ width: '100%', color: 'var(--co-danger-text)', padding: '16px' }} onClick={handleLogout}>Sair da Conta</button>

            {/* Cropper Modal */}
            <AnimatePresence>
                {showCropper && imageSrc && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                            background: 'rgba(0,0,0,0.85)', zIndex: 2000,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '24px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            style={{
                                width: '100%', maxWidth: '500px', background: 'white',
                                borderRadius: '32px', overflow: 'hidden', display: 'flex', flexDirection: 'column'
                            }}
                        >
                            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Recortar Foto</h3>
                                <button onClick={() => setShowCropper(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                            </div>

                            <div style={{ position: 'relative', width: '100%', height: '350px', background: '#333' }}>
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                                    onZoomChange={setZoom}
                                    cropShape="round"
                                    showGrid={false}
                                />
                            </div>

                            <div style={{ padding: '24px' }}>
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ fontSize: '0.85rem', color: '#666', marginBottom: '8px', display: 'block' }}>Zoom: {zoom.toFixed(1)}x</label>
                                    <input
                                        type="range"
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        value={zoom}
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--co-accent)' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        className="btn-secondary"
                                        style={{ flex: 1, padding: '14px', borderRadius: '16px' }}
                                        onClick={() => setShowCropper(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className="btn-primary"
                                        style={{ flex: 2, padding: '14px', borderRadius: '16px' }}
                                        onClick={handleSaveCroppedImage}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? <Loader2 className="animate-spin" size={20} /> : 'Concluir Recorte'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
