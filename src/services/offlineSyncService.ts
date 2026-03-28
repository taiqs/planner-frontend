import api from './api';
import toast from 'react-hot-toast';

interface OfflineRequest {
    id: string;
    url: string;
    method: 'POST' | 'PUT' | 'DELETE';
    data: any;
    timestamp: number;
    title: string;
}

const STORAGE_KEY = 'offline_sync_queue';

export const offlineSyncService = {
    addToQueue: (url: string, method: 'POST' | 'PUT' | 'DELETE', data: any, title: string) => {
        const queue: OfflineRequest[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const newRequest: OfflineRequest = {
            id: crypto.randomUUID(),
            url,
            method,
            data,
            timestamp: Date.now(),
            title
        };
        queue.push(newRequest);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
        toast('Salvo offline. Sincronizando quando houver conexão...', { icon: '☁️' });
    },

    processQueue: async () => {
        const queue: OfflineRequest[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (queue.length === 0) return;

        console.log(`[OfflineSync] Sincronizando ${queue.length} itens...`);
        const toastId = toast.loading(`Sincronizando ${queue.length} registros...`);

        const remainingQueue: OfflineRequest[] = [];
        let successCount = 0;

        for (const req of queue) {
            try {
                await api({
                    url: req.url,
                    method: req.method,
                    data: req.data
                });
                successCount++;
            } catch (error) {
                console.error(`[OfflineSync] Erro ao sincronizar ${req.title}:`, error);
                remainingQueue.push(req);
            }
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(remainingQueue));

        if (successCount > 0) {
            toast.success(`${successCount} registros sincronizados com sucesso!`, { id: toastId });
            // Força um recarregamento leve se houver sucesso
            window.dispatchEvent(new CustomEvent('sync-complete'));
        } else {
            toast.dismiss(toastId);
        }
    },

    hasPendingSync: () => {
        const queue = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return queue.length > 0;
    }
};
