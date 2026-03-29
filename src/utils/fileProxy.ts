import api from '../services/api';

export function getProxyUrl(originalUrl: string | null | undefined): string | undefined {
    if (!originalUrl) return undefined;

    if (originalUrl.includes('vercel-storage.com')) {
        const token = localStorage.getItem('token');
        return `${api.defaults.baseURL}/upload/proxy?url=${encodeURIComponent(originalUrl)}&token=${encodeURIComponent(token || '')}`;
    }

    return originalUrl;
}
