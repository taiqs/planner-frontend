import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: Array<string>;
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export function usePWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Verifica se já está rodando como app standalone (instalado)
        if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
            setIsInstalled(true);
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            // Previne o mini-infobar padrão do Chrome de aparecer imediatamente
            e.preventDefault();
            // Salva o evento para podermos disparar depois no botão
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Atualiza o estado para exibir o nosso botão customizado
            setIsInstallable(true);
        };

        const handleAppInstalled = () => {
            // Limpa após instalado com sucesso
            setIsInstallable(false);
            setIsInstalled(true);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const installApp = async () => {
        if (!deferredPrompt) return;

        // Mostra o prompt nativo de instalação
        deferredPrompt.prompt();

        // Aguarda a escolha do usuário
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsInstallable(false);
        }

        // Não podemos usar o prompt novamente, então limpamos
        setDeferredPrompt(null);
    };

    return { isInstallable, isInstalled, installApp };
}
