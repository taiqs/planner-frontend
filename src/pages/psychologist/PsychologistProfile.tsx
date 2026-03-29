import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Camera, Lock, Eye, EyeOff, X, ChevronLeft, Bell, BellOff, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { getProxyUrl } from '../../utils/fileProxy';
import { getNotificationStatus, requestNotificationPermission, unsubscribeFromPush } from '../../utils/notifications';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../utils/canvasUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { PsychologistSidebar } from '../../components/PsychologistSidebar';

export function PsychologistProfile() {
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [notificationStatus, setNotificationStatus] = useState<string>(getNotificationStatus());

    // Form states
    const [name, setName] = useState('');
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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/user/me');
                const data = res.data;
                setUser(data);
                setName(data.name || '');
                setAvatarUrl(data.avatarUrl || '');
                setPhone(data.phone || '');
            } catch (error) {
                console.error("Erro ao carregar perfil", error);
                toast.error("Não foi possível carregar suas informações.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

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
            toast.error("Erro ao processar/enviar a foto.");
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

    if (isLoading) {
        return (
            <div className="psi-layout">
                <PsychologistSidebar activePath="perfil" />
                <div className="psi-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader2 className="animate-spin" size={32} color="var(--co-accent)" />
                </div>
            </div>
        );
    }

    return (
        <div className="psi-layout">
            <PsychologistSidebar activePath="perfil" />
            <div className="psi-main">
                <header style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button 
                        className="btn-secondary" 
                        style={{ padding: '8px', borderRadius: '12px', display: 'flex' }}
                        onClick={() => navigate('/psicologo/dashboard')}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h1 style={{ fontSize: '1.8rem' }}>Meu Perfil Profissional</h1>
                </header>

                <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative' }}>
                            <div
                                style={{
                                    width: '120px', height: '120px', borderRadius: '60px',
                                    backgroundColor: 'var(--co-lavender)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', fontSize: '3rem',
                                    overflow: 'hidden', border: '4px solid white', boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                                }}
                            >
                                {isUploading ? (
                                    <Loader2 className="animate-spin" size={32} color="var(--co-accent)" />
                                ) : avatarUrl ? (
                                    <img src={getProxyUrl(avatarUrl)} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    name ? name.charAt(0).toUpperCase() : 'P'
                                )}
                            </div>
                            <button
                                className="btn-primary"
                                style={{ position: 'absolute', bottom: '0', right: '0', width: '40px', height: '40px', borderRadius: '20px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white' }}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                <Camera size={20} />
                            </button>
                            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUploadPhoto} />
                        </div>

                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Nome Completo (Como aparece para os pacientes)</label>
                                    <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Email</label>
                                    <input type="email" className="input-field" value={user?.email} disabled style={{ background: '#f5f5f5', cursor: 'not-allowed' }} />
                                </div>
                                <div>
                                    <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>WhatsApp Profissional</label>
                                    <input type="tel" className="input-field" value={phone} onChange={handlePhoneChange} placeholder="(11) 99999-9999" />
                                </div>
                            </div>
                            <button
                                className="btn-primary"
                                style={{ marginTop: '32px', padding: '16px 32px', borderRadius: '16px' }}
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? <Loader2 size={24} className="animate-spin" /> : 'Salvar Alterações de Perfil'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--co-action, #9575CD)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bell size={20} color="white" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.15rem', marginBottom: '2px' }}>Notificações Push</h2>
                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Receba alertas de novos comentários e agendamentos</p>
                        </div>
                    </div>

                    <div style={{ background: notificationStatus === 'granted' ? '#E8F5E9' : notificationStatus === 'denied' ? '#FFEBEE' : '#F5F5F5', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {notificationStatus === 'granted' ? <Bell size={18} color="#2E7D32" /> : <BellOff size={18} color={notificationStatus === 'denied' ? '#D32F2F' : '#666'} />}
                            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: notificationStatus === 'granted' ? '#2E7D32' : notificationStatus === 'denied' ? '#D32F2F' : 'var(--co-text-dark)' }}>
                                {notificationStatus === 'granted' ? 'Ativadas neste dispositivo' : notificationStatus === 'denied' ? 'Bloqueadas no navegador' : 'Aguardando ativação'}
                            </span>
                        </div>
                        <button
                            className="btn-secondary"
                            style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', background: 'white', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer' }}
                            onClick={handleToggleNotifications}
                            disabled={notificationStatus === 'unsupported'}
                        >
                            {notificationStatus === 'granted' ? 'Desativar' : 'Ativar Agora'}
                        </button>
                    </div>
                    
                    {notificationStatus === 'denied' && (
                        <p style={{ fontSize: '0.75rem', color: '#D32F2F', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Info size={14} /> Você bloqueou as notificações. Ative-as nas configurações do seu navegador para receber alertas.
                        </p>
                    )}
                </div>

                <div className="glass-panel" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '32px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--co-lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Lock size={24} color="var(--co-accent)" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.4rem' }}>Segurança e Acesso</h2>
                            <p className="text-muted">Gerencie sua senha de acesso ao Painel Psi.</p>
                        </div>
                    </div>

                    <div style={{ maxWidth: '500px' }}>
                        <div style={{ position: 'relative', marginBottom: '16px' }}>
                            <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Senha Atual</label>
                            <input
                                type={showPasswords ? "text" : "password"}
                                className="input-field"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div style={{ position: 'relative', marginBottom: '24px' }}>
                            <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Nova Senha</label>
                            <input
                                type={showPasswords ? "text" : "password"}
                                className="input-field"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords(!showPasswords)}
                                style={{ position: 'absolute', right: '16px', top: '40px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--co-text-muted)' }}
                            >
                                {showPasswords ? <EyeOff size={22} /> : <Eye size={22} />}
                            </button>
                        </div>
                        <button
                            className="btn-secondary"
                            style={{ padding: '16px 32px', borderRadius: '16px' }}
                            onClick={handleChangePassword}
                            disabled={isChangingPassword}
                        >
                            {isChangingPassword ? <Loader2 size={24} className="animate-spin" /> : 'Atualizar Senha de Acesso'}
                        </button>
                    </div>
                </div>
            </div>

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
                                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Recortar Foto Profissional</h3>
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
