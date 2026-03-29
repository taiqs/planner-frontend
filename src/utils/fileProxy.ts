import api from '../services/api';

export function getProxyUrl(originalUrl: string | null | undefined): string | undefined {
    if (!originalUrl) return undefined;

    // Se for URL do Vercel Blob (privado), injeta o proxy do backend
    if (originalUrl.includes('vercel-storage.com')) {
        const token = localStorage.getItem('token');
        return `${api.defaults.baseURL}/upload/proxy?url=${encodeURIComponent(originalUrl)}&token=${encodeURIComponent(token || '')}`;
    }

    // Caso seja foto do google, unspash, ou base64, retorna puro
    return originalUrl;
}
