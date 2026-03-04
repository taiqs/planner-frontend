import api from '../services/api';

const urlB64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

export const requestNotificationPermission = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push api não é suportada neste navegador.');
        return false;
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return false;

        const registration = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;

        const VAPID_PUBLIC = import.meta.env.VITE_VAPID_PUBLIC_KEY;
        if (!VAPID_PUBLIC) {
            console.error("VAPID_PUBLIC_KEY não configurada no frontend.");
            return false;
        }

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC)
        });

        // Enviar para o backend para salvar no Usuário (APENAS SE ESTIVER LOGADO)
        const token = localStorage.getItem('token');
        if (token) {
            await api.post('/user/push-subscription', { subscription });
        }
        return true;
    } catch (error) {
        console.warn('Inscrição Push pendente ou acesso negado/sem login.');
        return false;
    }
};

export const sendPushNotification = (title: string, options?: NotificationOptions) => {
    // Agora isso é feito pelo Backend Jobs
};
